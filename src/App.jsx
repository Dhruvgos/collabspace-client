import React, { useState } from "react";
// import { SocketProvider } from "./SocketProvider"; // Assuming SocketProvider is implemented
import LoginPage from "./Loginpage/LoginPage";
import WorkspacePage from "./WorkspacePage";

const App = () => {
  const [user, setUser] = useState(null); // `null` means no user is logged in

  return (
   
      user ? (
        // Render WorkspacePage if user exists
        <WorkspacePage user={user} />
      ) : (
        // Render LoginPage otherwise
        <LoginPage setUser={setUser} />
      )
  );
};

export default App;
