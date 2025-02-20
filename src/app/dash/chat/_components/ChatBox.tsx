'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import { type Socket } from 'socket.io-client';
import { VscSend } from 'react-icons/vsc';
import { cn } from '@/lib/utils/utils';
import ChatHeader from './ChatHeader';
import { useAuth } from '@/lib/slice';

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
  const username = auth?.account?.name ?? 'Anonymous';

  const [currentMessage, setCurrentMessage] = useState('');
  const [messageList, setMessageList] = useState<Message[]>([]);

  const autoScroll = useRef<HTMLDivElement>(null);

  const sendMessage = useCallback(() => {
    if (!currentMessage.trim()) return;

    const messageData: Message = {
      author: username,
      message: currentMessage.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    socket.emit('send_message', { ...messageData, room });
    setMessageList((list) => [...list, messageData]);
    setCurrentMessage('');
  }, [currentMessage, username, room, socket]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
      }
    },
    [sendMessage]
  );

  useEffect(() => {
    // load old msg before sending new msg
    socket.on('load_messages', (messages: Message[]) => {
      console.log(socket.id);
      console.log('loading  prev messages', messages);
      setMessageList(messages);
    });
    // send message to the user db
    socket.on('receive_message', (data: Message) => {
      console.log('receive_message', data);
      setMessageList((list) => [...list, data]);
      setMessageList((list) => [...list, data]);
    });

    // unmounts clean up the listeners
    return () => {
      socket.off('receive_message');
      socket.off('load_messages');
    };
  }, [socket]);

  useEffect(() => {
    if (autoScroll.current) {
      autoScroll.current.scrollTo({
        top: autoScroll.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messageList]);

  return (
    <section className='ml-auto flex h-full w-full flex-col overflow-hidden rounded-md border-2'>
      <ChatHeader username={username} ticketId={room} />

      <main
        ref={autoScroll}
        className='h-full overflow-y-auto border bg-white p-4'
      >
        {messageList.map((messageContent, index) => {
          const isUser = username === messageContent.author;
          return (
            <div
              key={index}
              className={cn('my-2 flex w-[70%]', {
                'ml-auto': isUser,
                'mr-auto': !isUser,
              })}
            >
              <div
                className={cn(
                  'break-words rounded-t-xl border border-green-800 bg-green-200 p-2',
                  isUser ? 'ml-auto rounded-bl-xl' : 'mr-auto rounded-br-xl'
                )}
              >
                <p className='text-sm font-semibold'>
                  {messageContent.message}
                </p>
                <span className='flex justify-end text-xs font-medium'>
                  {messageContent.time}
                </span>
              </div>
            </div>
          );
        })}
      </main>

      <footer className='mt-auto flex h-20 items-center justify-center gap-3 rounded-md border border-green-500 bg-background px-3 py-1'>
        <textarea
          rows={1}
          maxLength={500}
          value={currentMessage}
          placeholder='Type message here...'
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className='h-full w-full border-0 bg-transparent outline-none placeholder:text-foreground/50'
        />
        <VscSend
          onClick={sendMessage}
          className='mr-3 cursor-pointer p-1 text-4xl'
        />
      </footer>
    </section>
  );
}
