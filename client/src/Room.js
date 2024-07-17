
import React, { useEffect } from 'react';
import { useSocket } from './context/SocketContext';
import usePeer from './hooks/usePeer';
import { useParams } from 'react-router-dom';
import useMediaStream from './hooks/useMediaStream';
import Player from './components/Player/Player';
import usePlayer from './hooks/usePlayer';

const Room = () => {
    const { roomId } = useParams();
    const socket = useSocket();
    const { peer, myId } = usePeer();
    const { stream } = useMediaStream();
    const {players,setPlayers} = usePlayer(myId);

    useEffect(() => {
      if (!socket || !peer || !stream) return;
      const handleUserConnected = (newUser) => {
        console.log("peer connected", newUser, stream);
        const call = peer.call(newUser, stream);
        call.on('stream', (incomingStream) => {
            console.log(`incoming stream from ${newUser}`);
            setPlayers((prev) => ({
                ...prev,
                [newUser]: {
                    url: incomingStream,
                    muted: false,
                    playing: true,
                },
            }));
        });

        call.on('error', (err) => {
            console.error(`Call error: ${err}`);
        });

        call.on('close', () => {
            console.log(`Call closed by ${newUser}`);
        });
    };

    // https://stackoverflow.com/questions/66937384/peer-oncalll-is-never-being-called?answertab=scoredesc#tab-top
    //  handleUserConnected gets triggered before the user has finished the navigator promise.
      const delayedUserConnected = (newUser) => {
        setTimeout(() => handleUserConnected(newUser), 1000);
    };

      socket.on("user-connected", delayedUserConnected);
      return () => {
        socket.off("user-connected", handleUserConnected);
      };
    }, [peer, setPlayers, socket, stream]);

    useEffect(() => {
      if (!peer || !stream) return;
      peer.on("call", (call) => {
        setTimeout(() => {
          call.answer(stream);
          console.log("Call answered with stream:", stream);
        }, 1000);  // 1 second delay
        call.answer(stream); // send back your stream when you answer the call
        call.on('stream', (incomingStream) => {
            console.log(`incoming stream from ${call.peer}`);
            setPlayers((prev) => ({
                ...prev,
                [call.peer]: {
                    url: incomingStream,
                    muted: false,
                    playing: true,
                },
            }));
        });
        call.on('error', (err) => {
            console.error(`Call error: ${err}`);
        });
        call.on('close', () => {
            console.log(`Call closed by ${call.peer}`);
        });
    });
    }, [peer, setPlayers, stream]);

  useEffect(()=>{
    if(!stream || !myId )return;
    console.log(`setting my stream ${myId}`)
    setPlayers((prev)=>({
        ...prev,
        [myId]:{
            url:stream,
            muted : false,
            playing : true,
        }
    }))

  },[myId,setPlayers,stream]);

  return (
    <div>
      {
        Object.keys(players).map((playerId)=>{
          const {url,muted,playing} = players[playerId];
            return <Player key={playerId} url={url} muted={muted} playing={playing} />
        })
      }
    </div>
    
  );
};

export default Room;
