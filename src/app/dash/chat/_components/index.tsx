
'use client';

import JoinRoomWithoutTickt from "./JoinRoomWithoutTickt";
// import JoinRoomWithTicket from "./JoinRoomWithTicket";


export default function SupportDshboard() {
    return (
        <section className="w-full h-[90vh] overflow-hidden  bg-gray-100 p-2 border rounded-md">
            {/* <JoinRoomWithTicket /> */}
            <JoinRoomWithoutTickt />
        </section >
    );
}
