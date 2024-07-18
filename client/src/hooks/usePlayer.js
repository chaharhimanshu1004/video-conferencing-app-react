
import { useState } from "react"
import {cloneDeep} from 'lodash'
import { useSocket } from "../context/SocketContext";
import { useNavigate } from 'react-router-dom';

const usePlayer = (myId,roomId,peer) =>{ // why didn't we get the myId by calling hook, -- >>bcz hooks create a new instance whenever they are created and hence same myId ni rehti phir
    const socket = useSocket();
    const [players,setPlayers] = useState({});
    const playersCopy = cloneDeep(players);
    const playerHighlighted = playersCopy[myId];
    const navigate = useNavigate();

    delete playersCopy[myId];
    const nonHighlightedPlayers = playersCopy;
    
    const leaveRoom = () => { 
        socket.emit("user-leave",myId,roomId);
        console.log("leaving room",roomId);
        peer?.disconnect();
        navigate("/");
    }

    const toggleAudio = () =>{
        console.log("I toggled the audio");
        setPlayers((prevPlayers)=>{
            return {
                ...prevPlayers,
                [myId]:{
                    ...prevPlayers[myId],
                    muted: !prevPlayers[myId].muted
                }
            }
        })
        socket.emit("user-toggle-audio",myId,roomId);
    }

    const toggleVideo = () =>{
        console.log("I toggled the video");
        setPlayers((prevPlayers)=>{
            return {
                ...prevPlayers,
                [myId]:{
                    ...prevPlayers[myId],
                    playing: !prevPlayers[myId].playing
                }
            }
        })
        socket.emit("user-toggle-video",myId,roomId);
    }
    return {players,setPlayers,playerHighlighted,nonHighlightedPlayers,toggleAudio,toggleVideo,leaveRoom};

}
export default usePlayer;