import React, {useEffect, useState} from "react";
import { useHistory, useParams } from "react-router-dom"
import useChat from "./useChat";

interface ParamTypes {
    roomId: string
    userName: string
}

const ChatRoom = () => {
    const { roomId, userName } = useParams<ParamTypes>();
    const { messages, users, notification, sendMessage, usersInRoom, leaveRoom } = useChat(roomId, userName);
    const [ newMessage, setNewMessage ] = useState<string>("");  
    const history = useHistory();


    useEffect(() => {
        console.log("useEffect called")
        usersInRoom(userName)
    }, [userName])

    const handleSendMessage = () => {
        sendMessage(newMessage);
        setNewMessage("");
    };

    const handleLeaveRoom = () => {
        leaveRoom(roomId, userName)
        history.push('../')
    }

    const handleSelectUser = () => {

    }

    console.log("message", messages)
    console.log("users", users)

    return (
        <div>
            <h1>Room: {roomId}</h1>
            <h2>User: {userName}</h2>

            {messages.map((message, i) => (
                <div key={i}>
                    {message.sender}: {message.messageBody}
                </div>
            ))}

            <textarea
                value={newMessage}
                onChange={(event) => setNewMessage(event.target.value)}
                placeholder="Write message..."
            />
            
            <button onClick={handleSendMessage}>Send</button>
            <button onClick={handleLeaveRoom}>Leave Chat Room</button>

            {
                notification && <p>{notification}</p>
            }

            <p> Available Users: </p>
            <ul>
                {
                    users.filter(user => user !== userName).map((user, idx) =>  
                        <li key={idx} onClick={handleSelectUser}> {user} </li>)
                }
            </ul>
        </div>
    );
};

export default ChatRoom;