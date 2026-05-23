import { useEffect } from "react";
import { useSelector } from "react-redux";
import socket from "../socket";

const SocketProvider = ({ children, listingId }) => {
  const currentUser = useSelector((state) => state.user.currentUser);

  useEffect(() => {

    console.log("Current User : ",currentUser );
    console.log("Listing ID : ",listingId );
    if (currentUser && listingId) {
      // Connect the socket only if not connected
      if (!socket.connected) {
        socket.connect();
      }

      socket.emit("joinRoom", listingId);
      console.log("📡 Joined room:", listingId);
    }

    // Clean up: disconnect socket on logout or user change
    return () => {
      if (!currentUser) {
        socket.disconnect();
        console.log("📡 Disconnected socket");
      }
    };
  }, [currentUser, listingId]);

  return children;
};

export default SocketProvider;
