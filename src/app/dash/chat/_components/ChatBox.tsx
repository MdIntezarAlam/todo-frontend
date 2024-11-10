// ChatBox.tsx
import { useEffect, useState, useRef } from "react";
import { type Socket } from "socket.io-client";
import { VscSend } from "react-icons/vsc";
import { cn } from "@/lib/utils/utils";
import ChatHeader from "./ChatHeader";
import { useAuth } from "@/lib/slice";

interface ChatProps {
    socket: Socket;
    room: string;
}

interface Message {
    author: string;
    message: string;
    time: string;
}

export default function ChatBox({ socket, room }: ChatProps) {
    const { auth } = useAuth();
    const username = auth?.account?.name ?? "Anonymous"; 
    console.log("room", room);
    console.log("socket", socket);

    const [currentMessage, setCurrentMessage] = useState<string>("");
    const [messageList, setMessageList] = useState<Message[]>([]);

    const autoScroll = useRef<HTMLDivElement>(null);

    const sendMessage = () => {
        if (currentMessage !== "") {
            const messageData: Message = {
                author: username,
                message: currentMessage,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
            };

            socket.emit("send_message", { ...messageData, room });
            setMessageList((list) => [...list, messageData]);
            setCurrentMessage("");
        }
    };

    useEffect(() => {
        // load old msg before sending old messages to the user
        socket.on("load_messages", (messages: Message[]) => {
            console.log(socket.id);
            console.log("loading  prev messages", messages);
            setMessageList(messages);
        });

        // send message to the user db
        socket.on("receive_message", (data: Message) => {
            console.log("receive_message", data);
            setMessageList((list) => [...list, data]);
        });

        // unmounts clean up the listeners 
        return () => {
            socket.off("receive_message");
            socket.off("load_messages");
            console.log("Clean up the listeners when the component unmounts");
        };
    }, [socket]);

    useEffect(() => {
        if (autoScroll.current) {
            autoScroll.current.scrollTop = autoScroll.current.scrollHeight;
        }
    }, [messageList]);

    return (
        <section className="flex flex-col ml-auto  border-2 w-full h-full  rounded-md overflow-hidden">
            <ChatHeader username={username} ticketId={room} />
            <main ref={autoScroll} className="overflow-y-auto h-full bg-white border p-4">
                {messageList.map((messageContent, index) => (
                    <div key={index} className={cn({
                        "justify-end": username === messageContent.author,
                        "justify-start": username !== messageContent.author
                    })}>
                        <div className={cn("w-[70%] overflow-hidden break-words my-2", {
                            "ml-auto bg-green-200 border border-green-800 rounded-t-xl rounded-bl-xl p-2": username === messageContent.author,
                            "mr-auto bg-green-200 border border-green-800 rounded-t-xl rounded-br-xl p-2": username !== messageContent.author
                        })}>
                            <div className="flex flex-col w-full p-1">
                                <p className="text-sm font-semibold">{messageContent.message}</p>
                                <span className="flex items-end justify-end text-xs font-medium">{messageContent.time}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </main>
            <footer className="mt-auto border bg-background border-green-500 h-20 px-3 py-1 flex items-center gap-3 justify-center rounded-md focus:outline-double ">
                <textarea
                    rows={1}
                    cols={1}
                    maxLength={500}
                    value={currentMessage}
                    placeholder="Type message here..."
                    onChange={(event) => setCurrentMessage(event.target.value)}
                    onKeyPress={(event) => {
                        if (event.key === "Enter") sendMessage();
                    }}
                    className="!h-full w-full border-0 outline-none bg-transparent placeholder:text-foreground/50"
                />
                <VscSend onClick={sendMessage} className="text-4xl cursor-pointer mr-3 p-1" />
            </footer>
        </section >
    );
}
