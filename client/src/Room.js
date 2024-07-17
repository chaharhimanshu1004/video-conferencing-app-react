
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

      useEffect(()=>{
        if(!socket || !peer || !stream)return;
        const handleUserConnected = (newUser)=>{
            console.log(`a new user connected with userId ${newUser}`)
            const call = peer.call(newUser,stream);
            call.on('stream',(incomingStream)=>{
                console.log(`incoming stream from ${newUser}`)
                setPlayers((prev)=>({
                    ...prev,
                    [newUser]:{
                        url:incomingStream,
                        muted : false,
                        playing : true,
                    }
                }))
            })
        }
        socket.on('user-connected',handleUserConnected);
        return () =>{
            socket.off('user-connected',handleUserConnected);
        }
    },[peer,setPlayers,socket,stream])

    useEffect(()=>{
      if(!peer || !stream)return;
      peer.on('call',(call)=>{
          const {peer : callerId} = call; // caller ki id le liya -- peer naam se ni lera coz peer pehle se upr define, uska naam change krke callerId kr diya
          call.answer(stream); // send back your stream when you answer the call
          call.on('stream',(incomingStream)=>{
              console.log(`incoming stream from ${callerId}`)
              setPlayers((prev)=>({
                  ...prev,
                  [callerId]:{
                      url:incomingStream,
                      muted : false,
                      playing : true,
                  }
              }))
          })
      })

  },[peer,setPlayers,stream])

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

  // useEffect(() => {
  //   if (socket) {
  //     socket.on('connect', () => {
  //       console.log('Socket connected', socket.id);
  //     });
  //   }else{
  //     console.log("error connecting socket")
  //   }

  //   if (peer) {
  //     peer.on('open', (id) => {
  //       console.log('Peer connection open with ID:', id);
  //     });
  //   }

  //   return () => {
  //     if (socket) {
  //       socket.off('connect');
  //     }
  //     if (peer) {
  //       peer.off('open');
  //     }
  //   };
  // }, [socket, peer]);

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
