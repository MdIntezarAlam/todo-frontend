import React from 'react'

export default function ChatHeader({ username, ticketId }: { username: string, ticketId: string }) {
    return (
        <nav className="h-14 p-3 w-full bg-background shadow-xl flex flex-col mb-auto rounded-t-md">
            <div className="flex items-center">
                <h1 className='text-sm font-medium'>From :</h1>
                <h1 className='text-sm font-medium'>{username}</h1>
            </div>
            <div className="flex items-center">
                <h1 className='text-sm font-medium'>TicketId :</h1>
                <h1 className='text-sm font-medium'>{ticketId}</h1>
            </div>
        </nav>)
}
