
import React, { useEffect } from 'react';
import { useSocket } from './context/SocketContext';
import usePeer from './hooks/usePeer';
import { useParams } from 'react-router-dom';
import useMediaStream from './hooks/useMediaStream';
import Player from './components/Player/Player';

const Room = () => {
    const { roomId } = useParams();
    const socket = useSocket();
    const { peer, myId } = usePeer();
    const { stream } = useMediaStream();

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
      {stream && <Player url={stream} muted playing playerId={myId} />}
    </div>
  );
};

export default Room;
