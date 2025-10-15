import { create } from 'zustand';
import { supabase, authHelpers } from '../lib/supabase';

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
  session: any | null;
  setCurrentUser: (user: User | null) => void;
  setSession: (session: any | null) => void;
  logout: () => Promise<void>;
  messages: Message[];
  activeConversation: string | null;
  onlineUsers: string[];
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  setActiveConversation: (userId: string | null) => void;
  setOnlineUsers: (users: string[]) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  initializeAuth: () => Promise<void>;
}

export const useAppStore = create<AppState>((set) => ({
  currentUser: null,
  session: null,
  setCurrentUser: (user) => set({ currentUser: user }),
  setSession: (session) => set({ session }),
  logout: async () => {
    await authHelpers.signOut();
    set({ currentUser: null, session: null, messages: [], activeConversation: null });
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
  initializeAuth: async () => {
    try {
      // Get initial session
      const { session, error: sessionError } = await authHelpers.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        return;
      }
      
      if (session?.user) {
        // Fetch user profile from users table
        const { data: userProfile, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (userProfile && !error) {
          const newUser = {
            id: userProfile.id,
            email: userProfile.email,
            name: userProfile.name,
            role: userProfile.role,
            status: userProfile.status
          };
          set({
            session,
            currentUser: newUser
          });
        } else {
          console.error('No user profile found:', error);
          set({ session, currentUser: null });
        }
      } else {
        set({ session: null, currentUser: null });
      }
      
      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          // Fetch user profile
          const { data: userProfile, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (userProfile && !error) {
            const newUser = {
              id: userProfile.id,
              email: userProfile.email,
              name: userProfile.name,
              role: userProfile.role,
              status: userProfile.status
            };
            set({
              session,
              currentUser: newUser
            });
          } else {
            console.error('User profile not found:', error);
          }
        } else if (event === 'SIGNED_OUT') {
          set({ currentUser: null, session: null, messages: [], activeConversation: null });
        }
      });
    } catch (error) {
      console.error('Error in initializeAuth:', error);
    }
  },
}));
