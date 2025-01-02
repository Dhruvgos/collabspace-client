import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import CodeEditor from "./CodeEditor";
import DrawingEditor from "./DrawingCanvas";
import { useSocket } from "./context/useSocket";
import { useAppContext } from "./context/useAppContext";
import Chat from "./chat/Chat";

const WorkspacePage = ({ user }) => {
  const { socket } = useSocket();
  const { drawingData, setDrawingData } = useAppContext();
  const [activeTab, setActiveTab] = useState("editor");
  const [editorContent, setEditorContent] = useState('console.log("Hello World...")');
  const [runtimes, setRuntimes] = useState([]);
  const handleEditorChange = (value) => {
    setEditorContent(value);
  };

  useEffect(() => {
    const fetchRuntimes = async () => {
      try {
        const response = await fetch('https://emkc.org/api/v2/piston/runtimes');
        if (!response.ok) {
          throw new Error('Failed to fetch runtimes');
        }
        const data = await response.json();
        setRuntimes(data);
      } catch (error) {
        console.error('Error fetching runtimes:', error);
      }
    };

    fetchRuntimes();
  }, []);

  useEffect(() => {
    if (socket) {
      // Join the room
      socket.emit("joinRoom", { name: user.name, roomName: user.room });

      // Listen for drawing updates
      socket.on("DRAWING_UPDATE", ({ snapshot }) => {
        console.log("Received drawing update:", snapshot);
        setDrawingData(snapshot); // Update shared state with the new drawing data
      });

      return () => {
        socket.emit("leaveRoom", { name: user.name, room: user.room });
        socket.off("DRAWING_UPDATE");
      };
    }
  }, [socket, user, setDrawingData]);

  return (
    <div className="flex h-screen">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} socket ={socket} user = {user} />
      <div className="w-full">
        {activeTab === "editor" && (
          <CodeEditor
            content={editorContent}
            onChange={handleEditorChange}
            runtimes = {runtimes}
          />
        )}
        {activeTab === "drawing" && <DrawingEditor />}
      </div>
        {/* <div className="mt-4 flex-1 ">
        <Chat socket={socket} user={user} />
      </div> */}
    </div>
  );
};

export default WorkspacePage;
