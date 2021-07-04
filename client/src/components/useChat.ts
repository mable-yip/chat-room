import { useEffect, useRef, useState } from "react";
import socketIOClient, { Socket } from "socket.io-client";
import { Message } from "../interface/models";

const NEW_CHAT_MESSAGE_EVENT = "newChatMessage"; // Name of the event
const GET_USERS_IN_ROOM = "userInRoom";
const USER_JOINRED_EVENT = "userJoined";
const USER_LEFT_EVENT = "userLeft";
const SOCKET_SERVER_URL = "http://localhost:4000";

const useChat = (roomId: string, userName: string) => {
  const [users, setUsers] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]); // Sent and received messages
  const [notification, setNotification] = useState<string| undefined>();
  const socketRef = useRef<Socket>();

  useEffect(() => {
    // Creates a WebSocket connection
    socketRef.current = socketIOClient(SOCKET_SERVER_URL, {
      query: { roomId, userName },
    });
    
    // Listens for incoming messages
    socketRef.current.on(NEW_CHAT_MESSAGE_EVENT, (message: Message) => {
      console.log("useChat", message)
      setMessages((messages) => [...messages, message]); // <--------- why this implementation? 
    });


    // Listen for available user
    socketRef.current.on(GET_USERS_IN_ROOM, (onlineUsers: string[]) => {
      setUsers(onlineUsers);
    });

    //Listen for user joined
    socketRef.current.on(USER_JOINRED_EVENT, (joinedUser: string) => {
      setNotification(`${joinedUser} has joined the room`)
    });

    // Listen for user left
    socketRef.current.on(USER_LEFT_EVENT, (leftUser: string) => {
        const newUsers = users.filter(user => user !== leftUser)
        setUsers(newUsers);
        setNotification(`${leftUser} has left the room`)
    });

    
    // Destroys the socket reference when the connection is closed
    return () => {
      socketRef.current?.disconnect();
    };
  }, [roomId]);

  // Sends a message to the server that forwards it to all users in the same room
  const sendMessage = (messageBody: string) => {
    socketRef.current?.emit(NEW_CHAT_MESSAGE_EVENT, {
      messageBody: messageBody,
      sender: userName,
    });
  };

  const usersInRoom = (userName: string) => {
    socketRef.current?.emit(GET_USERS_IN_ROOM, roomId);  
    socketRef.current?.emit(USER_JOINRED_EVENT, userName);  
  }

  const leaveRoom = (roomId: string, userName: string) => {
    socketRef.current?.emit(USER_LEFT_EVENT, {
      roomId: roomId,
      userName: userName
    });  
  }

  return { messages, users, notification, sendMessage, usersInRoom, leaveRoom };
};

export default useChat;