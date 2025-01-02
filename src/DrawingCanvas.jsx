import { useAppContext } from "./context/useAppContext";
import { useSocket } from "./context/useSocket";
import useWindowDimensions from "./context/useWindowDimensions";
import { useEffect, useCallback, useRef } from "react";
import { Tldraw, useEditor, getSnapshot, loadSnapshot } from "tldraw";
import "tldraw/tldraw.css";

function DrawingEditor() {
  const { isMobile } = useWindowDimensions();
  return (
    <div className="w-full h-full bg-white">
      <Tldraw
        autoFocus={true}
        inferDarkMode
        // forceMobile={isMobile}
        defaultName="Editor"
        className="z-0"
      >
        <ReachEditor />
      </Tldraw>
    </div>
  );
}

function ReachEditor() {
  const editor = useEditor();
  const { drawingData, setDrawingData } = useAppContext();
  const { socket } = useSocket();
  const prevSnapshotRef = useRef(null); // To track changes in shapes
  const debounceTimeoutRef = useRef(null);

  const handleChangeEvent = useCallback(() => {
    if (editor) {
      const currentSnapshot = getSnapshot(editor.store);
  
      // Check if current snapshot matches the previous one
      if (
        prevSnapshotRef.current &&
        JSON.stringify(prevSnapshotRef.current.document) ===
          JSON.stringify(currentSnapshot.document)
      ) {
        console.warn("No changes detected. Skipping DRAWING_UPDATE emission.");
        return; // Skip emission if there's no difference
      }
  
      // Emit the snapshot only if there are actual changes
      socket.emit("DRAWING_UPDATE", { snapshot: currentSnapshot });
  
      // Update the previous snapshot reference
      prevSnapshotRef.current = currentSnapshot;
  
      // Update local state
      setDrawingData(currentSnapshot);
    }
  }, [editor, setDrawingData, socket]);
  
  // Debounce change events to improve performance
  const debouncedHandleChangeEvent = useCallback(() => {
    clearTimeout(debounceTimeoutRef.current);
    debounceTimeoutRef.current = setTimeout(() => {
      handleChangeEvent();
    }, ); // Adjust debounce time as needed
  }, [handleChangeEvent]);

  // Handle local and remote changes

  const handleRemoteDrawing = useCallback(
    ({ added, updated }) => {
      if (!editor) return;
  
      // Ensure `added` and `updated` are valid objects
      const safeAdded = added || {};
      const safeUpdated = updated || {};
  
      // Ignore empty updates
      if (Object.keys(safeAdded).length === 0 && Object.keys(safeUpdated).length === 0) {
        console.warn("DRAWING_UPDATE received with empty payload. Ignoring.");
        return;
      }
  
      // Merge remote changes
      editor.store.mergeRemoteChanges(() => {
        Object.values(safeAdded).forEach((record) => {
          if (!editor.store.has(record.id)) {
            editor.store.put([record]);
          }
        });
  
        Object.values(safeUpdated).forEach((record) => {
          if (editor.store.has(record.id)) {
            editor.store.put([record]);
          }
        });
      });
  
      setDrawingData(editor.store.getStoreSnapshot());
    },
    [editor, setDrawingData]
  );
  
  
  // Handle shape deletions
  const handleRemoteDeletion = useCallback(
    ({ removedIds }) => {
      if (editor && Array.isArray(removedIds)) {
        editor.store.mergeRemoteChanges(() => {
          removedIds.forEach((id) => {
            if (editor.store.has(id)) {
              editor.store.remove(id);
            }
          });
        });
  
        setDrawingData(getSnapshot(editor.store));
      }
    },
    [editor, setDrawingData]
  );
  

  // Load initial drawing data
  useEffect(() => {
    if (editor && drawingData?.document) {
      try {
        loadSnapshot(editor.store, drawingData);
      } catch (error) {
        console.error("Error loading snapshot:", error);
      }
    }
  }, [drawingData, editor]);

  // Listen to local and remote changes
  useEffect(() => {
    if (editor) {
      const cleanup = editor.store.listen(debouncedHandleChangeEvent, {
        source: "user",
        scope: "document",
      });
  
      socket.on("DRAWING_UPDATE", handleRemoteDrawing);
      socket.on("SHAPE_REMOVED", handleRemoteDeletion);
  
      return () => {
        cleanup();
        socket.off("DRAWING_UPDATE", handleRemoteDrawing);
        socket.off("SHAPE_REMOVED", handleRemoteDeletion);
      };
    }
  }, [
    editor,
    debouncedHandleChangeEvent,
    handleRemoteDrawing,
    handleRemoteDeletion,
    socket,
  ]);
  
  useEffect(() => {
    return () => {
      clearTimeout(debounceTimeoutRef.current);
    };
  }, []);
  
  return null;
}

export default DrawingEditor; 