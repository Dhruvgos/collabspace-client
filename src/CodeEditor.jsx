import  { useState, useEffect, useRef } from 'react';
// import { io } from 'socket.io-client';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { oneDark } from '@codemirror/theme-one-dark';
// import { SocketContext } from './context/SocketProvider';
import { useSocket } from './context/useSocket';

const CodeEditor = ({ content, onChange,runtimes }) => {
  const { socket } = useSocket(); // Access the socket context
  const [code, setCode] = useState(content);
  const [language, setLanguage] = useState('javascript');
  // const [runtimes, setRuntimes] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState('latest');
  const [output, setOutput] = useState('');
  const [theme, setTheme] = useState('dark');
  const [isRunning, setIsRunning] = useState(false);
  const [cursors, setCursors] = useState({});
  const editorRef = useRef(null);

  // Fetch available runtimes on mount
  // useEffect(() => {
  //   const fetchRuntimes = async () => {
  //     try {
  //       const response = await fetch('https://emkc.org/api/v2/piston/runtimes');
  //       if (!response.ok) {
  //         throw new Error('Failed to fetch runtimes');
  //       }
  //       const data = await response.json();
  //       setRuntimes(data);
  //     } catch (error) {
  //       console.error('Error fetching runtimes:', error);
  //     }
  //   };

  //   fetchRuntimes();
  // }, []);

  // Update selected version when language changes
  useEffect(() => {
    const runtime = runtimes.find((rt) => rt.language === language);
    if (runtime) {
      setSelectedVersion(runtime.version);
    }
  }, [language, runtimes]);

  // Listen for real-time code updates and cursor positions
  useEffect(() => {
    socket.on('updateCode', (newCode) => setCode(newCode));
    socket.on('updateRCode', (newCode) => onChange(newCode));
    socket.on('updateCursor', (cursorData) =>
      setCursors((prevCursors) => ({
        ...prevCursors,
        [cursorData.id]: cursorData.position,
      }))
    );

    return () => {
      socket.off('updateCode');
      socket.off('updateCursor');
    };
  }, []);

  const handleChange = (value) => {
    onChange(value)
    setCode(value);
    socket.emit('updateCode', value); // Emit code changes for collaboration
  };
  useEffect(() => {
   // onChange(content)  here to amke changes
    setCode(content);
  }, [content]);

  const handleCursorActivity = (editor) => {
    const cursorPosition = editor.state.selection.main.head;
    socket.emit('updateCursor', {
      id: socket.id,
      position: cursorPosition,
    });
  };

  const runCode = async () => {
    setIsRunning(true);
    try {
      const response = await fetch('https://emkc.org/api/v2/piston/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language,
          version: selectedVersion,
          files: [
            {
              name: `main.${language}`,
              content: code,
            },
          ],
        }),
      });
      const data = await response.json();
      setOutput(data.run?.output || 'No output');
    } catch (error) {
      console.error('Error running code:', error);
      setOutput('Error running code');
    } finally {
      setIsRunning(false);
    }
  };

  const getLanguageExtension = () => {
    switch (language) {
      case 'javascript':
        return javascript();
      case 'python':
        return python();
      case 'cpp':
        return cpp();
      case 'java':
        return java();
      default:
        return javascript();
    }
  };

  const containerStyle = theme === 'dark'
    ? 'bg-gray-900 text-white'
    : 'bg-white text-black';
  const outputStyle = theme === 'dark'
    ? 'bg-gray-800 text-white'
    : 'bg-gray-100 text-black';

  return (
    <div className={`h-screen flex flex-col p-4 ${containerStyle}`}>
      <div className="flex justify-between items-center mb-4">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className={`px-4 py-2 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-300 text-black'}`}
        >
          {runtimes.map((runtime) => (
            <option key={runtime.language} value={runtime.language}>
              {runtime.language}
            </option>
          ))}
        </select>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className={`ml-2 px-4 py-2 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-300 text-black'}`}
        >
          <option value="dark">Dark Theme</option>
          <option value="light">Light Theme</option>
        </select>
        <button
          onClick={runCode}
          className={`ml-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transition duration-300`}
          disabled={isRunning}
        >
          {isRunning ? 'Running...' : 'Run Code'}
        </button>
      </div>
      <CodeMirror
        value={code}
        height="500px"
        className="rounded-lg overflow-hidden border shadow-md"
        extensions={[getLanguageExtension()]}
        theme={theme === 'dark' ? oneDark : undefined}
        onChange={handleChange}
        onCursorActivity={(editor) => handleCursorActivity(editor)}
        ref={editorRef}
      />
      <div className="relative">
        {Object.entries(cursors).map(([id, position]) => (
          <div
            key={id}
            style={{
              position: 'absolute',
              top: position.line * 20, // Adjust based on line height
              left: position.ch * 8, // Adjust based on character width
              background: 'red',
              height: '20px',
              width: '2px',
            }}
          />
        ))}
      </div>
      <div className={`mt-4 p-4 rounded-lg shadow-md ${outputStyle}`}>
        <h3 className="text-lg font-semibold mb-2">Output:</h3>
        <pre className="whitespace-pre-wrap text-sm p-2 rounded-lg">
          {output}
        </pre>
      </div>
    </div>
  );
};

export default CodeEditor;
