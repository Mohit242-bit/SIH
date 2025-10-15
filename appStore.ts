import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'soldier' | 'veteran' | 'family' | 'hq_admin';
  status: 'pending' | 'approved' | 'rejected';
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  encryptedContent: string;
  iv: string;
  timestamp: number;
  status: 'sent' | 'delivered' | 'read';
}

interface AppState {
  currentUser: User | null;
  token: string | null;
  setCurrentUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
  messages: Message[];
  activeConversation: string | null;
  onlineUsers: string[];
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  setActiveConversation: (userId: string | null) => void;
  setOnlineUsers: (users: string[]) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentUser: null,
  token: localStorage.getItem('token'),
  setCurrentUser: (user) => set({ currentUser: user }),
  setToken: (token) => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
    set({ token });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ currentUser: null, token: null, messages: [], activeConversation: null });
  },
  messages: [],
  activeConversation: null,
  onlineUsers: [],
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setActiveConversation: (userId) => set({ activeConversation: userId }),
  setOnlineUsers: (users) => set({ onlineUsers: users }),
  theme: (localStorage.getItem('theme') as 'light' | 'dark') || 'light',
  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return { theme: newTheme };
    }),
}));
