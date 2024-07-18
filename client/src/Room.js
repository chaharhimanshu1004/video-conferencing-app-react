import React, { useEffect } from "react";
import { useSocket } from "./context/SocketContext";
import usePeer from "./hooks/usePeer";
import { useParams } from "react-router-dom";
import useMediaStream from "./hooks/useMediaStream";
import Player from "./components/Player/Player";
import usePlayer from "./hooks/usePlayer";
import styles from "./Room.module.css";
import Bottom from "./components/BottomSection/Bottom";
import { useState } from "react";
import { cloneDeep } from "lodash";
import CopySection from "./components/CopySection/Copy";

const Room = () => {
  const { roomId } = useParams();
  const socket = useSocket();
  const { peer, myId } = usePeer();
  const { stream } = useMediaStream();
  const {
    players,
    setPlayers,
    playerHighlighted,
    nonHighlightedPlayers,
    toggleAudio,
    toggleVideo,
    leaveRoom,
  } = usePlayer(myId, roomId, peer); 

  const [users, setUsers] = useState([]); 

  useEffect(() => {
    if (!socket || !peer || !stream) return;
    const handleUserConnected = (newUser) => {
      const call = peer.call(newUser, stream);
      call.on("stream", (incomingStream) => {
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

      call.on("error", (err) => {
        console.error(`Call error: ${err}`);
      });

      call.on("close", () => {
        console.log(`Call closed by ${newUser}`);
      });
      setUsers((prev) => ({
        ...prev,
        [newUser]: call, // we are storing the call object -- >> bcz we have to apply the close function on the call object
      }));
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


  // handling audio video toggles

  useEffect(() => {
    if (!socket) return;
    console.log("here",players);
    const handleUserToggledAudio = (userId) => {
      console.log(`user with id ${userId} toggled audio`);
      setPlayers((prev) => ({
        ...prev,
        [userId]: {
          ...prev[userId],
          muted: !prev[userId].muted,
        },
      }));
    };
    const handleUserToggledVideo = (userId) => {
      console.log(`user with id ${userId} toggled video`);
      setPlayers((prev) => ({
        ...prev,
        [userId]: {
          ...prev[userId],
          playing: !prev[userId].playing,
        },
      }));

    };
    const handleUserLeave = (userId) => {
      console.log(`user with id ${userId} left the room`);
      users?.[userId]?.close(); // this close function exists on the call object, we are storing the call object in the array of users
      const playersCopy = cloneDeep(players);
      delete playersCopy[userId];
      setPlayers(playersCopy);
     };
    socket.on("user-toggled-audio", handleUserToggledAudio);
    socket.on("user-toggled-video", handleUserToggledVideo);
    socket.on("user-leave", handleUserLeave);
    socket.on("user-disconnected", handleUserLeave);
    return () => {
      socket.off("user-toggled-audio", handleUserToggledAudio);
      socket.off("user-toggled-video", handleUserToggledVideo);
      socket.off("user-leave", handleUserLeave);
      socket.off("user-disconnected", handleUserLeave);
    };
  }, [setPlayers, socket,users,players]);

  useEffect(() => {
    if (!peer || !stream) return;
    peer.on("call", (call) => {
      const { peer: callerId } = call; // caller ki id le liya -- peer naam se ni lera coz peer pehle se upr define, uska naam change krke callerId kr diya
      call.answer(stream);
      console.log("Call answered with stream:", stream); // send back your stream when you answer the call
      call.on("stream", (incomingStream) => {
        console.log(`incoming stream from ${callerId}`);
        setPlayers((prev) => ({
          ...prev,
          [callerId]: {
            url: incomingStream,
            muted: false,
            playing: true,
          },
        }));
      });
      call.on("error", (err) => {
        console.error(`Call error: ${err}`);
      });
      call.on("close", () => {
        console.log(`Call closed by ${callerId}`);
      });
      setUsers((prev) => ({
        ...prev,
        [callerId]: call,
      }));
    });
    
  }, [peer, setPlayers, stream]);

  useEffect(() => {
    if (!stream || !myId) return;
    console.log(`setting my stream ${myId}`);
    setPlayers((prev) => ({
      ...prev,
      [myId]: {
        url: stream,
        muted: false,
        playing: true,
      },
    }));
  }, [myId, setPlayers, stream]);

  return (
    <div>
      <div className={styles.activePlayerContainer}>
        {playerHighlighted && (
          <Player
            url={playerHighlighted.url}
            muted={playerHighlighted.muted}
            playing={playerHighlighted.playing}
            isHighlighted
          />
        )}
      </div>
      <div className={styles.inActivePlayerContainer}>
        {Object.keys(nonHighlightedPlayers).map((playerId) => {
          const { url, muted, playing } = nonHighlightedPlayers[playerId];
          return (
            <Player
              key={playerId}
              url={url}
              muted={muted}
              playing={playing}
              isHighlighted={false}
            />
          );
        })}
      </div>
      <CopySection roomId={roomId} />
      <Bottom
        muted={playerHighlighted?.muted}
        playing={playerHighlighted?.playing}
        toggleAudio={toggleAudio}
        toggleVideo={toggleVideo}
        leaveRoom={leaveRoom}
      />
    </div>
  );
};

export default Room;
