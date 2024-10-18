// without ticket
'use client';
import { useState } from "react";
import io, { type Socket } from "socket.io-client";
import ChatBox from "./ChatBox";
import { env } from "@/lib/utils/configs/env";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Initialize the socket connection once
const socket: Socket = io(env.SOCKET_URL);

export default function JoinRoomWithoutTickt() {
    const [username, setUsername] = useState<string>("");
    const [room, setRoom] = useState<string>("");
    const [showChat, setShowChat] = useState<boolean>(false);
    const [error, setError] = useState("")
    const [roomErr, setRoomErr] = useState("")

    const joinRoom = () => {
        if (!username) {
            setError("Username is required")
            return
        }
        if (room.length > 5) {
            setRoomErr("Room must be less than 4 characters")
            return
        }
        if (!room) {
            setRoomErr("Room is required")
            return
        }
        if (username !== "" && room !== "") {
            socket.emit("join_room", room);
            setShowChat(true);
        }
    };

    return (
        <section className="w-full h-[90vh] flex justify-between  gap-4 bg-gray-100 p-2 border rounded-md">
            <main className="flex flex-col items-center justify-center mr-auto border w-1/2 rounded-md shadow">
                <div className="w-1/2 flex flex-col gap-5 items-center shadow border-2 min-h-[40vh] border-black/10 rounded-md p-4">
                    <h3 className="text-xl font-bold my-10">Create A Room</h3>
                    <div className="w-full flex flex-col gap-1">
                        <Input
                            type="text"
                            label="Enter Username"
                            placeholder="Enter the Username"
                            onChange={(event) => setUsername(event.target.value)}
                        />
                        <p className="text-destructive">{error}</p>
                    </div>
                    <div className="w-full flex flex-col gap-1">
                        <Input
                            type="text"
                            label="Enter Room ID(room Id must be 4 characters & unique)"
                            placeholder="Enter the Room ID(room Id must be 4 characters & unique)"
                            onChange={(event) => setRoom(event.target.value)}
                        />
                        <p className="text-destructive"> {roomErr}</p>
                    </div>
                    <Button onClick={joinRoom} className="w-full h-10 rounded-md text-sm font-semibold">Join A Room</Button>
                </div>
            </main>
            {showChat ? (<ChatBox socket={socket} username={username} room={room} />) : (
                <div className="flex flex-col items-center justify-center ml-auto w-1/2 h-[85vh] rounded-md  bg-white border p-4">
                    <h1 className="text-xl font-bold">No Room Found </h1>
                    <h2 className="text-lg font-medium">Please Create A Room to Join the Chat</h2>
                </div>
            )}
        </section>
    );
}