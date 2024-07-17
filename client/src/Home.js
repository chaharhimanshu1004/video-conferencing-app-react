// src/Home.js
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState('');

  const createAndJoin = () => {
    const newRoomId = uuidv4(); // will create a random roomId
    navigate(`/room/${newRoomId}`); // will navigate to that route -- [roomId] means dynamic route hoga any value aa skti
  };

  const joinRoom = () => {
    if (roomId) {
      navigate(`/room/${roomId}`);
    } else {
      alert('Please provide a valid room ID');
    }
  };

  return (
    <div className="homeContainer">
      <h1>Google Meet Clone</h1>
      <div className="enterRoom">
        <input
          placeholder="Enter Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
        <button onClick={joinRoom}>Join Room</button>
      </div>
      <span className="separatorText">--------------- OR ---------------</span>
      <button onClick={createAndJoin}>Create a new room</button>
    </div>
  );
};

export default Home;
