import React, { useState, useEffect } from "react";
import Chat from "./chat/Chat";
import VoiceChat from "./VoideChat/VoiceChat";
import { BsChatDots, BsFillChatDotsFill } from "react-icons/bs";
import { FiCode, FiEdit3 } from "react-icons/fi";
import { AiOutlineAudio, AiFillAudio } from "react-icons/ai";

const Sidebar = ({ activeTab, setActiveTab, socket, user }) => {
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [showVoiceChat, setShowVoiceChat] = useState(false);

  useEffect(() => {
    if (socket) {
      const handleNewMessage = (msg) => {
        setChatMessages((prevMessages) => [...prevMessages, msg]);
      };

      socket.on("chatMessage", handleNewMessage);

      return () => {
        socket.off("chatMessage", handleNewMessage);
      };
    }
  }, [socket]);

  return (
    <div className="w-2/5 bg-gray-900 p-6 text-white flex flex-col shadow-xl rounded-lg">
      <h1 className="text-3xl mb-6 font-bold text-yellow-400 text-center">CollabSpace</h1>

      {/* Code Editor Tab */}
      <button
        onClick={() => setActiveTab("editor")}
        className={`flex items-center justify-start gap-4 w-full py-3 mb-4 rounded-lg text-lg font-semibold transition-all duration-300 ${
          activeTab === "editor"
            ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
            : "bg-gray-800 text-blue-400 hover:bg-blue-600"
        }`}
      >
        <FiCode size={24} />
        Code Editor
      </button>

      {/* Drawing Tab */}
      <button
        onClick={() => setActiveTab("drawing")}
        className={`flex items-center justify-start gap-4 w-full py-3 mb-4 rounded-lg text-lg font-semibold transition-all duration-300 ${
          activeTab === "drawing"
            ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
            : "bg-gray-800 text-blue-400 hover:bg-blue-600"
        }`}
      >
        <FiEdit3 size={24} />
        Drawing Canvas
      </button>

      {/* Toggle Chat */}
      <button
        onClick={() => setShowChat(!showChat)}
        className={`flex items-center justify-start gap-4 w-full py-3 mb-4 rounded-lg text-lg font-semibold transition-all duration-300 ${
          showChat
            ? "bg-gradient-to-r from-red-600 to-red-700 text-white"
            : "bg-gray-800 text-blue-400 hover:bg-blue-600"
        }`}
      >
        {showChat ? <BsFillChatDotsFill size={24} /> : <BsChatDots size={24} />}
        {showChat ? "Hide Chat" : "Show Chat"}
      </button>

      {/* Chat Component */}
      {showChat && (
        <div className="mt-4 flex-1 h-3/4 overflow-y-auto">
          <Chat socket={socket} user={user} setMessages={setChatMessages} messages={chatMessages} />
        </div>
      )}

      {/* Toggle Voice Chat */}
      <button
        onClick={() => setShowVoiceChat(!showVoiceChat)}
        className={`flex items-center justify-start gap-4 w-full py-3 mt-4 rounded-lg text-lg font-semibold transition-all duration-300 ${
          showVoiceChat
            ? "bg-gradient-to-r from-green-600 to-green-700 text-white"
            : "bg-gray-800 text-green-400 hover:bg-green-600"
        }`}
      >
        {showVoiceChat ? <AiFillAudio size={24} /> : <AiOutlineAudio size={24} />}
        {showVoiceChat ? "Hide Voice Chat" : "Show Voice Chat"}
      </button>

      {/* Voice Chat Component */}
      {showVoiceChat && (
        <div className="mt-4  h-1/2 overflow-hidden">
          <VoiceChat roomName="collabRoom" displayName={user.name} />
        </div>
      )}
    </div>
  );
};

export default Sidebar;
