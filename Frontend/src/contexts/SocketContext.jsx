import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineCount, setOnlineCount] = useState(0);

  useEffect(() => {
    // Determine the socket URL based on current hostname
    const isProd = import.meta.env.PROD;
    const socketUrl = isProd 
      ? window.location.origin 
      : `http://${window.location.hostname}:4000`;
    
    console.log("Connecting to socket at:", socketUrl);
    
    const newSocket = io(socketUrl, {
      transports: ['websocket', 'polling'], // Ensure compatibility across devices
      reconnectionAttempts: 5
    });
    
    setSocket(newSocket);

    newSocket.on('onlineUsersCount', (count) => {
      setOnlineCount(count);
    });

    return () => newSocket.close();
  }, []);

  const value = useMemo(() => ({
    socket,
    onlineCount
  }), [socket, onlineCount]);

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
