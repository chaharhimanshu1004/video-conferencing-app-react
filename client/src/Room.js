
import React, { useEffect } from 'react';
import { useSocket } from './context/SocketContext';
import usePeer from './hooks/usePeer';
import { useParams } from 'react-router-dom';

const Room = () => {
    const { roomId } = useParams();
    const socket = useSocket();
    const { peer, myId } = usePeer();

  useEffect(() => {
    if (socket) {
      socket.on('connect', () => {
        console.log('Socket connected', socket.id);
      });
    }else{
      console.log("error connecting socket")
    }

    if (peer) {
      peer.on('open', (id) => {
        console.log('Peer connection open with ID:', id);
      });
    }

    return () => {
      if (socket) {
        socket.off('connect');
      }
      if (peer) {
        peer.off('open');
      }
    };
  }, [socket, peer]);

  return (
    <div>
      <h1>Room</h1>
      <p>Room ID: {roomId}</p>
      <p>Your Socket ID: {socket?.id}</p>
      <p>Your Peer ID: {myId}</p>
    </div>
  );
};

export default Room;
