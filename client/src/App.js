// src/App.js
import React, { useEffect } from "react";
import { useSocket } from "./context/SocketContext";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Room from './Room';
import Home from "./Home";

const App = () => {

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/room/:roomId" element={<Room />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
