import React, { useState } from "react";

const LoginPage = ({ setUser }) => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");

  const handleJoin = () => {
    if (name.trim() && room.trim()) {
      setUser({ name, room }); // Set the user state in App
    } else {
      alert("Please enter both name and room!");
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-r from-blue-800 via-indigo-800 to-purple-800 text-white">
      <div className="w-full max-w-md p-8 bg-opacity-90 bg-gray-900 rounded-xl shadow-lg backdrop-blur-lg">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-indigo-400 transition-all duration-500">
          Welcome to CollabSpace
        </h1>
        <p className="text-xl mb-6 text-center text-gray-400">
          Collaborate on Coding & Drawing in Real-Time
        </p>
        
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-6 p-3 w-full text-lg rounded-lg bg-gray-700 border-2 border-transparent focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
        />
        
        <input
          type="text"
          placeholder="Enter room name"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          className="mb-6 p-3 w-full text-lg rounded-lg bg-gray-700 border-2 border-transparent focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
        />

        <button
          onClick={handleJoin}
          className="w-full py-3 text-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:scale-105 transition-all duration-300 transform hover:bg-indigo-700 hover:shadow-xl"
        >
          Join Room
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
