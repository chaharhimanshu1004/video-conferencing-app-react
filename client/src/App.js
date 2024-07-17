// src/App.js
import React, { useEffect } from "react";
import { useSocket } from "./context/SocketContext";

const App = () => {
  const socket = useSocket();

  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        console.log("Socket connected", socket.id);
      });
    }
    return () => {
      if (socket) {
        socket.off("connect");
      }
    };
  }, [socket]);

  return (
    <div>
      <h1>Hello</h1>
    </div>
  );
};

export default App;
