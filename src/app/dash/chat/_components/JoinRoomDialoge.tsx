
'use client';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils/handler";


interface Props {
    socket: any;
    showChat: boolean;
    setShowChat: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function JoinRoomDialoge({ showChat, setShowChat, socket }: Props) {

    const [username, setUsername] = useState<string>("");
    const [room, setRoom] = useState<string>("");
    const [error, setError] = useState<string>("");


    const joinRoom = useMutation({
        mutationFn: async () => {
            try {
                if (!username) {
                    setError("Username is required")
                    return
                }
                if (!room) {
                    setError("Room is required")
                    return
                }
                if (room.length > 6) {
                    setError("Room must be less than 6 characters")
                }
                if (room.length < 4) {
                    setError("Room must be greater than 4 characters")
                }
                if (room && username) {
                    socket.emit("join_room", room);
                    setShowChat(true);
                }
            }
            catch (error) {
                toast.error(getErrorMessage(error))
            }
        }

    })

    return (
        <Dialog open={showChat} onOpenChange={setShowChat}>
            <DialogTrigger><Button variant={"destructive"} className="rounded-md w-[200px] h-10">Join Room</Button></DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="my-5 border-b pb-2 w-fit">Join Room</DialogTitle>
                    <DialogDescription>
                        <form
                            className="w-full flex flex-col gap-5 items-center shadow border-2 min-h-[40vh] border-black/10 rounded-lg p-4">
                            <h3 className="text-xl font-bold my-10 border-b pb-2">Create A Room</h3>
                            <div className="w-full flex flex-col gap-1">
                                <Input
                                    label="Enter Username"
                                    type="text"
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
                                <p className="text-destructive"> {error}</p>
                            </div>
                            <Button type="button" onClick={() => {
                                joinRoom.mutate()
                            }} className="w-full h-10 rounded-md text-sm font-semibold">Create Room</Button>
                        </form>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
