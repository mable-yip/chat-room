import React, {useState} from "react";
import { Link } from "react-router-dom";

const Home = () => {
    const [userName, setUserName] = useState("");
    const [roomId, setRoomId] = useState("");

    return (
        <div>
            <h1> Welcome to Chatroom! </h1>
            <input
                type="text"
                placeholder="Name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
            />

            <input
                type="text"
                placeholder="Room"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
            />
            <Link to={`/${roomId}/${userName}`}>
                Join room
            </Link>
        </div>
    );
};

export default Home;