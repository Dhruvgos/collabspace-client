import React, { useState, useEffect } from 'react';

const Chat = ({ socket, user ,messages, setMessages }) => {
  const [message, setMessage] = useState('');
  // const [messages, setMessages] = useState([]);

  const handleSendMessage = () => {
    if (message.trim() && socket) {
      const newMessage = { message, user: user.name };
      socket.emit('chatMessage', newMessage);
      // setMessages((prevMessages) => [...prevMessages, newMessage]); // Update local messages
      setMessage(''); // Clear input field
    }
  };
  return (
    <div className="flex flex-col h-full bg-gray-900 p-4 rounded-md">
      {/* Messages container */}
      <div className="flex-1 overflow-y-auto mb-2">
        <div className="space-y-2">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.user === user.name ? 'justify-end' : 'justify-start'
              }`}
              style={{
                wordWrap: 'break-word',
                whiteSpace: 'normal',
                wordBreak: 'break-word',
                // maxWidth: '80%', // Limit message width
                marginLeft: msg.user === user.name ? 'auto' : '0', // Align based on sender
                marginRight: msg.user === user.name ? '0' : 'auto', // Align based on sender
              }}
            >
              <div
                className={`p-3 rounded-lg ${
                  msg.user === user.name ? 'bg-cyan-500' : 'bg-gray-700'
                }`}
                style={{
                  display: 'inline-block',
                  maxWidth: '80%',
                  wordWrap: 'break-word',
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                }}
              >
                <strong>{msg.user}: </strong>{msg.message}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input field and send button */}
      <div className="mt-2 flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 bg-gray-800 text-white rounded-l-md"
          style={{
            wordWrap: 'break-word', // Ensure text wraps here as well
            whiteSpace: 'normal',
            wordBreak: 'break-word',
          }}
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 text-white p-2 rounded-r-md"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
