
'use client';
import { useEffect, useState } from "react";
import ViewTicket from "./ViewTicket";

import { env } from '@/lib/utils/configs/env';
import { type TypeTicket, } from '@/types/TypeTicket';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import ChatBox from "./ChatBox";
import io, { type Socket } from "socket.io-client";
import { useTicket } from "@/lib/slice";
import { useSearchParams } from "next/navigation";
import CreateTicketDialoge from "./CreateTicketDialoge";

const socket: Socket = io(env.SOCKET_URL);

export default function JoinRoomWithTicket() {
    const { setTicketData, ticketData } = useTicket()
    const [showDialoge, setShowDialoge] = useState<boolean>(false);
    const ticketId = useSearchParams().get('ticket')
    console.log("ticketId", ticketId)

    useEffect(() => {
        setTicketData(data)
    }, [socket, setTicketData])

    const { data } = useQuery<TypeTicket["data"]>({
        queryKey: ["tickets"],
        queryFn: async () => {
            const res = await axios.get(`${env.BACKEND_URL}/fetch-ticket`);
            const data = res.data.data as TypeTicket["data"];
            setTicketData(data)
            return data;
        },
    })

    return (
        <section className="w-full h-[90vh] overflow-hidden  bg-gray-100 p-2 border rounded-md">
            <nav className="h-14 p-3 w-full bg-background shadow-xl flex items-center justify-between mb-auto rounded-t-md gap-2">
                <CreateTicketDialoge setShowDialoge={setShowDialoge} showDialoge={showDialoge} />
            </nav>
            <section className="w-full h-full flex gap-4 bg-gray-100 p-2 border rounded-md">
                <main className="w-1/3 h-[82vh]  flex flex-col gap-2  bg-gray-500/10 p-3 rounded-md">
                    {ticketData && ticketData?.length > 0 ? (
                        ticketData?.map((ticket) => (
                            <ViewTicket key={ticket._id} {...ticket} />
                        ))) : (
                        <div className="flex flex-col gap-2 items-center justify-center ml-auto w-full h-full rounded-md  bg-white border p-4">
                            <h1 className="text-xl font-bold">No Ticket Found </h1>
                            <h2 className="text-sm font-medium">Please Create A Ticket to Join the Chat</h2>
                        </div>
                    )}
                </main>
                <main className="w-full h-[82vh] bg-gray-600/10 p-3 rounded-md">
                    {!ticketId ? (
                        <div className="flex flex-col gap-2 items-center justify-center ml-auto w-full h-full rounded-md  bg-white border p-4">
                            <h1 className="text-xl font-bold">No Ticket Found </h1>
                            <h2 className="text-lg font-semibold">Please select a ticket from the inbox. Or you can create a new ticket
                            </h2>
                        </div>
                    ) : (<>
                        <ChatBox socket={socket} room={ticketId} />
                    </>)}
                </main >
            </section>
        </section >
    );
}
