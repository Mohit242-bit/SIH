import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import ThemeSwitcher from '../components/ThemeSwitcher';
import TerminalBackground from '../components/TerminalBackground';
import { IoArrowBack, IoSend } from 'react-icons/io5';
// import { io, Socket } from 'socket.io-client';

interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: number;
  status: 'sent' | 'delivered' | 'read';
}

const Chat: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, logout, onlineUsers, setOnlineUsers, messages, addMessage } = useAppStore();
  const [messageInput, setMessageInput] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [showChatView, setShowChatView] = useState(false); // New state for WhatsApp-style navigation
  // const [socket, setSocket] = useState<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock users for demo
  const [availableUsers] = useState([
    { id: '1', name: 'Soldier Alpha', status: 'online', role: 'soldier' },
    { id: '2', name: 'Captain Bravo', status: 'online', role: 'officer' },
    { id: '3', name: 'Major Charlie', status: 'offline', role: 'major' },
    { id: '4', name: 'Colonel Delta', status: 'online', role: 'colonel' },
  ]);

  useEffect(() => {
    // Initialize socket connection
    // const socketInstance = io('http://localhost:3000');
    // setSocket(socketInstance);
    
    // Mock online users
    setOnlineUsers(['1', '2', '4']);

    // Cleanup
    return () => {
      // socketInstance?.disconnect();
    };
  }, [setOnlineUsers]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedUser) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: currentUser?.id || 'current',
      receiverId: selectedUser,
      content: messageInput.trim(),
      timestamp: Date.now(),
      status: 'sent',
    };

    addMessage(newMessage as any);
    setMessageInput('');

    // Send via socket
    // socket?.emit('message', newMessage);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };


  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleContactSelect = (userId: string) => {
    setSelectedUser(userId);
    setShowChatView(true);
  };

  const handleBackToContacts = () => {
    setShowChatView(false);
    setSelectedUser(null);
  };

  const filteredMessages = messages.filter(
    (msg: any) =>
      (msg.senderId === currentUser?.id && msg.receiverId === selectedUser) ||
      (msg.receiverId === currentUser?.id && msg.senderId === selectedUser)
  );

  // Contact List View
  const ContactListView = () => (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-transparent px-2 sm:px-6 md:px-10">
      {/* Header */}
      <header className="bg-[#25D366] dark:bg-[#0a0e0a] border-b border-[#25D366] dark:border-[#00ff41] p-4 shadow-sm dark:shadow-[0_0_15px_rgba(0,255,65,0.3)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 rounded-full text-white dark:text-[#00ff41] hover:text-green-100 dark:hover:text-[#33ff66] hover:bg-green-600/20 dark:hover:bg-green-900/20 transition-all"
            >
              <IoArrowBack className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-white dark:text-[#00ff41] dark:font-mono">
              <span className="dark:hidden">Messages</span>
              <span className="hidden dark:inline">[SECURE_MESSAGES]</span>
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="text-white dark:text-[#00ff41] hover:text-green-100 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </header>

      {/* Contact List */}
      <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-transparent">
        {availableUsers.map((user) => (
          <button
            key={user.id}
            onClick={() => handleContactSelect(user.id)}
            className="w-full p-4 bg-white dark:bg-transparent hover:bg-gray-100 dark:hover:bg-green-900/10 active:bg-gray-100 dark:active:bg-green-900/20 transition-colors border-b border-gray-200 dark:border-[#00ff41]/20 flex items-center gap-3"
          >
            <div className="relative">
              <div className="w-12 h-12 bg-[#25D366] dark:bg-[#00ff41] rounded-full flex items-center justify-center text-white dark:text-black font-bold text-lg">
                {user.name.charAt(0)}
              </div>
              {onlineUsers.includes(user.id) && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#25D366] border-2 border-white dark:border-black rounded-full"></div>
              )}
            </div>
            <div className="flex-1 text-left">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-900 dark:text-[#00ff41] text-base">{user.name}</h3>
                <span className="text-xs text-gray-500 dark:text-[#33ff66]">12:30 PM</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-[#33ff66] truncate mt-1">Tap to start secure chat...</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  // Individual Chat View
  const ChatView = () => {
    const selectedUserData = availableUsers.find(u => u.id === selectedUser);
    
    return (
      <div className="h-screen flex flex-col bg-gray-50 dark:bg-transparent px-2 sm:px-6 md:px-10">
        {/* Chat Header */}
        <header className="bg-[#25D366] dark:bg-[#0a0e0a] border-b border-[#25D366] dark:border-[#00ff41] p-4 shadow-sm dark:shadow-[0_0_15px_rgba(0,255,65,0.3)]">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBackToContacts}
              className="p-2 rounded-full text-white dark:text-[#00ff41] hover:text-green-100 dark:hover:text-[#33ff66] hover:bg-green-600/20 dark:hover:bg-green-900/20 transition-all"
            >
              <IoArrowBack className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-green-100 dark:bg-[#00ff41] rounded-full flex items-center justify-center text-[#25D366] dark:text-black font-bold">
                  {selectedUserData?.name.charAt(0)}
                </div>
                {onlineUsers.includes(selectedUser!) && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-[#25D366] dark:border-black rounded-full"></div>
                )}
              </div>
              <div>
                <h2 className="font-bold text-white dark:text-[#00ff41]">{selectedUserData?.name}</h2>
                <p className="text-sm text-green-100 dark:text-[#33ff66]">
                  {onlineUsers.includes(selectedUser!) ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Messages Area */}
        <div className="flex-1 p-4 overflow-y-auto bg-[#e5ddd5] dark:bg-transparent">
          {filteredMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 bg-white dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4 shadow-lg">
                <svg className="w-10 h-10 text-[#25D366] dark:text-[#00ff41]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-[#00ff41] mb-2 dark:font-mono">
                <span className="dark:hidden">No messages yet</span>
                <span className="hidden dark:inline">NO_MESSAGES :: INIT_CONVERSATION</span>
              </h3>
              <p className="text-gray-600 dark:text-[#33ff66] dark:font-mono">
                <span className="dark:hidden">Start the conversation with {selectedUserData?.name}</span>
                <span className="hidden dark:inline">INIT_SECURE_CHANNEL_WITH :: {selectedUserData?.name}</span>
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredMessages.map((message: any) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === currentUser?.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] px-4 py-1.5 rounded-[12px] shadow-sm ${
                      message.senderId === currentUser?.id
                        ? 'bg-[#25D366] text-white dark:bg-[#00ff41] dark:text-black ml-auto'
                        : 'bg-white dark:bg-gray-800/50 text-gray-800 dark:text-[#33ff66]'
                    }`}
                  >
                    <p className="text-[15px] dark:font-mono leading-[1.4] break-words px-1">{message.content}</p>
                    <p className={`text-[11px] mt-0.5 text-right dark:font-mono ${
                      message.senderId === currentUser?.id
                        ? 'text-white/70 dark:text-black/70'
                        : 'text-gray-500 dark:text-[#33ff66]/70'
                    }`}>
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="p-4 bg-white dark:bg-[#0a0e0a] border-t border-gray-200 dark:border-[#00ff41]/30">
          <div className="flex gap-3 items-end">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2.5 text-base border-2 border-gray-300 dark:border-[#00ff41] rounded-full focus:outline-none focus:border-[#25D366] dark:focus:border-[#00ff41] bg-white dark:bg-black text-gray-900 dark:text-[#00ff41] placeholder-gray-400 dark:placeholder-[#33ff66] placeholder:text-base dark:font-mono transition-colors"
              autoComplete="off"
              spellCheck="false"
              autoFocus={false}
            />
            <button
              onClick={handleSendMessage}
              disabled={!messageInput.trim()}
              className="w-10 h-10 bg-[#25D366] dark:bg-[#00ff41] text-white dark:text-black rounded-full hover:bg-[#1ea952] dark:hover:bg-[#00dd37] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl active:scale-95"
            >
              <IoSend className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0e0a] relative px-4 sm:px-8 md:px-16 py-4">
      {/* Hide theme switcher on mobile for chat */}
      <div className="hidden sm:block absolute top-4 right-4 z-50">
        <ThemeSwitcher showLabel={false} />
      </div>
      
      {/* Matrix/Terminal Background Effect for Dark Mode Only */}
      <div className="hidden dark:block fixed inset-0 z-0">
        <TerminalBackground />
      </div>

      {/* Show either Contact List or Individual Chat */}
      <div className="relative z-10">
        {showChatView ? <ChatView /> : <ContactListView />}
      </div>
    </div>
  );
};

export default Chat;
