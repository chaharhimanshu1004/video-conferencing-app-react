import { io } from "socket.io-client";
import React, { createContext, useContext, useState, useEffect } from "react";

const SocketContext = createContext(null);

export const useSocket = () => {
    const socket = useContext(SocketContext);
    return socket;
}

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const connection = io("http://localhost:4100"); 
        console.log("Socket connection established", connection);
        setSocket(connection);

        connection.on("connect_error", (error) => {
            console.error("Error stabilizing the socket connection:", error);
        });

        return () => {
            connection.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
}
