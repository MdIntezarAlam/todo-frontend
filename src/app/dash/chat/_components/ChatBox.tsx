// ChatBox.tsx
import { useEffect, useState, useRef } from 'react';
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
  console.log('room', room);
  console.log('socket', socket);

  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [messageList, setMessageList] = useState<Message[]>([]);

  const autoScroll = useRef<HTMLDivElement>(null);

  const sendMessage = () => {
    if (currentMessage !== '') {
      const messageData: Message = {
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ':' +
          new Date(Date.now()).getMinutes(),
      };

      socket.emit('send_message', { ...messageData, room });
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage('');
    }
  };

  useEffect(() => {
    // load old msg before sending old messages to the user
    socket.on('load_messages', (messages: Message[]) => {
      console.log(socket.id);
      console.log('loading  prev messages', messages);
      setMessageList(messages);
    });

    // send message to the user db
    socket.on('receive_message', (data: Message) => {
      console.log('receive_message', data);
      setMessageList((list) => [...list, data]);
    });

    // unmounts clean up the listeners
    return () => {
      socket.off('receive_message');
      socket.off('load_messages');
      console.log('Clean up the listeners when the component unmounts');
    };
  }, [socket]);

  useEffect(() => {
    if (autoScroll.current) {
      autoScroll.current.scrollTop = autoScroll.current.scrollHeight;
    }
  }, [messageList]);

  return (
    <section className='ml-auto flex h-full w-full flex-col overflow-hidden rounded-md border-2'>
      <ChatHeader username={username} ticketId={room} />
      <main
        ref={autoScroll}
        className='h-full overflow-y-auto border bg-white p-4'
      >
        {messageList.map((messageContent, index) => (
          <div
            key={index}
            className={cn({
              'justify-end': username === messageContent.author,
              'justify-start': username !== messageContent.author,
            })}
          >
            <div
              className={cn('my-2 w-[70%] overflow-hidden break-words', {
                'ml-auto rounded-t-xl rounded-bl-xl border border-green-800 bg-green-200 p-2':
                  username === messageContent.author,
                'mr-auto rounded-t-xl rounded-br-xl border border-green-800 bg-green-200 p-2':
                  username !== messageContent.author,
              })}
            >
              <div className='flex w-full flex-col p-1'>
                <p className='text-sm font-semibold'>
                  {messageContent.message}
                </p>
                <span className='flex items-end justify-end text-xs font-medium'>
                  {messageContent.time}
                </span>
              </div>
            </div>
          </div>
        ))}
      </main>
      <footer className='mt-auto flex h-20 items-center justify-center gap-3 rounded-md border border-green-500 bg-background px-3 py-1 focus:outline-double'>
        <textarea
          rows={1}
          cols={1}
          maxLength={500}
          value={currentMessage}
          placeholder='Type message here...'
          onChange={(event) => setCurrentMessage(event.target.value)}
          onKeyPress={(event) => {
            if (event.key === 'Enter') sendMessage();
          }}
          className='!h-full w-full border-0 bg-transparent outline-none placeholder:text-foreground/50'
        />
        <VscSend
          onClick={sendMessage}
          className='mr-3 cursor-pointer p-1 text-4xl'
        />
      </footer>
    </section>
  );
}
