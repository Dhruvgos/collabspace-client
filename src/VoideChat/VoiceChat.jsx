import React, { useEffect } from 'react';

const VoiceChat = ({ roomName, displayName }) => {
  useEffect(() => {
    // Load the Jitsi Meet API
    const domain = 'jitsi.riot.im'; // Alternative Jitsi instance
    const options = {
      roomName: roomName || 'default-room', // Use roomName or a default
      width: '100%',
      height: 300,
      parentNode: document.getElementById('jitsi-container'),
      configOverwrite: {
        enableWelcomePage: false,
        prejoinPageEnabled: false, // Skip pre-join
        startWithAudioMuted: false,
        startWithVideoMuted: true, // Ensure video is off
      },
      interfaceConfigOverwrite: {
        TOOLBAR_BUTTONS: ['microphone', 'hangup'], // Keep only audio and hangup
        VIDEO_LAYOUT_FIT: 'nocrop', // Prevent cropping
        HIDE_VIDEO_MUTED: true, // Hide muted videos
      },
    };

    const api = new JitsiMeetExternalAPI(domain, options);

    // Clean up when component unmounts
    return () => {
      api.dispose();
    };
  }, [roomName, displayName]);

  return (
    <div className="flex flex-col items-center  w-full   h-screen bg-gray-900 text-white">
      <h2 className="text-xl mb-4 font-bold">
        Voice Chat Room: <span className="text-blue-500">{roomName}</span>
      </h2>
      <div id="jitsi-container" className="rounded-lg overflow-hidden shadow-lg w-full max-w-3xl h-96 bg-gray-800"></div>
    </div>
  );
};

export default VoiceChat;
