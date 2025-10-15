# DEFENSE SHIELD – Web Application Roadmap (3-Day Sprint)

**A secure, encrypted web-based communication platform for India's defense personnel - MVP in 3 days**

---

##  Strategic Decision: Web-First Approach

**Why Web App First?**
-  Faster development (no mobile app store approvals)
-  Easier to demo (works on any browser)
-  Simpler debugging and testingso why two folder you are saying why not supabase can i use instead of creating gthe two folder 
-  Can showcase core security features
-  Later: Progressive Web App (PWA) for mobile-like experience
-  Backend can be reused when building mobile app later

**What We're Building:**
- Secure web chat application (like WhatsApp Web)
- HQ admin dashboard
- End-to-end encryption (browser-to-browser)
- Real-time messaging
- User authentication and approval system
- Audit logging

---

##  3-Day Timeline

### **Day 1: Foundation & Backend** (8-10 hours)
- Backend API with authentication
- Database setup
- Real-time WebSocket server
- Basic encryption implementation

### **Day 2: Frontend & Chat** (8-10 hours)
- User authentication UI
- Chat interface with real-time messaging
- End-to-end encryption in browser
- File sharing

### **Day 3: Dashboard & Polish** (8-10 hours)
- HQ admin dashboard
- User approval system
- Audit logs viewer
- Security features & deployment

---

##  Simplified Tech Stack (3-Day Focus)

### Frontend
- **Framework:** React.js + Vite + TypeScript (fast setup, type safety, scalable)
- **Styling:** Tailwind CSS (rapid UI development)
- **State Management:** Zustand (simpler than Redux)
- **Real-time:** Socket.io-client
- **Encryption:** crypto-js (AES-256) + Web Crypto API
- **Routing:** React Router

#### Why not Next.js or Vue?
- Next.js is great for SSR/SSG and SEO, but this app is a real-time, client-driven SPA. Vite + React is faster to set up and deploy for this use case.
- Vue is also good, but React has a larger ecosystem for real-time, security, and enterprise features. Most of the planned stack (Zustand, Socket.io, Supabase) has first-class React support.

#### Theme System
- Dual theme: "Hacker/Terminal" dark mode (matrix-style animated background, neon green text) and WhatsApp-style light mode (clean, friendly UI)
- Theme switcher in the UI
- Tailwind CSS customizations for both themes

#### Initial Boilerplate Setup
- Scaffold with Vite + React + TypeScript
- Install Tailwind CSS
- Set up folder structure: `components/`, `pages/`, `themes/`, `utils/`, `store/`
- Add a basic theme switcher and minimal homepage

**Next Steps:**
- Scaffold the frontend project and set up the theme system so you can see the basics working immediately.

### Backend
- **Framework:** Node.js + Express (faster than Nest.js for MVP)
- **Database:** Supabase (instant setup, includes auth)
- **Real-time:** Socket.io
- **Auth:** JWT + bcrypt
- **File Upload:** Multer

### Deployment (Free Tier)
- **Frontend:** Vercel or Netlify
- **Backend:** Render or Railway
- **Database:** Supabase (free tier)


---

##  Day 1: Foundation & Backend

### Morning (4-5 hours)

#### 1. Project Setup (30 min)
- [ ] Create project folders (frontend, backend)
- [ ] Initialize backend: `npm init -y`
- [ ] Install backend dependencies:
  ```bash
  npm install express socket.io cors dotenv bcryptjs jsonwebtoken @supabase/supabase-js multer
  ```
- [ ] Set up Supabase account and create database
- [ ] Create `.env` file with database credentials

#### 2. Database Schema (30 min)
- [ ] Create `users` table:
  - id, email, password_hash, name, role, status, created_at
- [ ] Create `messages` table:
  - id, sender_id, receiver_id, encrypted_content, iv, timestamp
- [ ] Create `audit_logs` table:
  - id, user_id, action, metadata, timestamp

#### 3. Authentication API (2 hours)
- [ ] Build `/api/auth/register` endpoint
  - Hash password with bcrypt
  - Set initial status as "pending"
  - Store user in database
- [ ] Build `/api/auth/login` endpoint
  - Verify credentials
  - Check if user is approved
  - Generate JWT token
- [ ] Build JWT middleware for protected routes
- [ ] Test with Postman/Thunder Client

#### 4. User Management API (1 hour)
- [ ] Build `/api/users/pending` (HQ only)
- [ ] Build `/api/users/approve/:id` (HQ only)
- [ ] Build `/api/users/reject/:id` (HQ only)
- [ ] Build `/api/users/list` (get all approved users)
- [ ] Test all endpoints

### Afternoon (4-5 hours)

#### 5. WebSocket Server Setup (1.5 hours)
- [ ] Initialize Socket.io server
- [ ] Implement connection authentication
- [ ] Handle user online/offline status
- [ ] Create room-based messaging (user-to-user)
- [ ] Test socket connections

#### 6. Message API (2 hours)
- [ ] Build `/api/messages/send` endpoint
  - Store encrypted message
  - Emit via WebSocket to recipient
- [ ] Build `/api/messages/history/:userId` endpoint
- [ ] Build message delivery confirmation
- [ ] Implement message status (sent, delivered, read)

#### 7. Encryption Utilities (1 hour)
- [ ] Create server-side encryption helpers
- [ ] AES-256 encryption/decryption functions
- [ ] Key generation utilities
- [ ] Test encryption/decryption flow

#### 8. File Upload (30 min)
- [ ] Set up Multer for file uploads
- [ ] Create `/api/upload` endpoint
- [ ] Store encrypted files
- [ ] Return secure file URL

### Day 1 End Goal
 Working backend API with auth, messaging, and real-time WebSocket  
 All endpoints tested and functional  
 Database schema implemented

---

##  Day 2: Frontend & Chat Interface

### Morning (4-5 hours)

#### 1. Frontend Setup (30 min)
- [ ] Initialize Vite + React project:
  ```bash
  npm create vite@latest defense-shield-client -- --template react
  ```
- [ ] Install dependencies:
  ```bash
  npm install react-router-dom socket.io-client zustand axios crypto-js
  npm install -D tailwindcss postcss autoprefixer
  npx tailwindcss init -p
  ```
- [ ] Configure Tailwind CSS
- [ ] Set up folder structure (components, pages, utils, store)

#### 2. Authentication Pages (2 hours)
- [ ] Create Login page
  - Email/password form
  - JWT token storage (localStorage)
  - Redirect after login
- [ ] Create Register page
  - Registration form
  - Role selection (soldier/veteran/family)
  - "Awaiting approval" message
- [ ] Create ProtectedRoute component
- [ ] Set up React Router with routes

#### 3. State Management (1 hour)
- [ ] Create Zustand store for:
  - Current user
  - Active conversations
  - Messages
  - Online users
- [ ] Create API service layer (axios wrapper)
- [ ] Set up Socket.io connection hook

#### 4. Encryption in Browser (1.5 hours)
- [ ] Create encryption utilities using Web Crypto API
- [ ] AES-256-GCM encrypt/decrypt functions
- [ ] Key derivation from passwords
- [ ] Store encryption keys securely (IndexedDB)
- [ ] Test encryption flow

### Afternoon (4-5 hours)

#### 5. Chat UI Layout (2 hours)
- [ ] Create main chat layout:
  - Sidebar with user list
  - Chat window with messages
  - Message input box
  - User profile header
- [ ] Style with Tailwind CSS
- [ ] Make responsive (desktop + tablet)
- [ ] Add loading states and animations

#### 6. Real-Time Messaging (2.5 hours)
- [ ] Connect to Socket.io server
- [ ] Display online users in sidebar
- [ ] Implement message sending:
  - Encrypt message in browser
  - Send via Socket.io
  - Display in chat window
- [ ] Implement message receiving:
  - Listen for incoming messages
  - Decrypt in browser
  - Update UI in real-time
- [ ] Add message status indicators ( sent,  delivered)
- [ ] Implement typing indicators

#### 7. File Sharing (1 hour)
- [ ] Add file upload button
- [ ] Encrypt file before upload
- [ ] Display file previews (images)
- [ ] Download and decrypt files

### Day 2 End Goal
 Fully functional chat interface  
 Real-time encrypted messaging working  
 File sharing implemented  
 User authentication flow complete


---

##  Day 3: Dashboard, Security & Deployment

### Morning (4-5 hours)

#### 1. HQ Admin Dashboard (3 hours)
- [ ] Create admin layout with sidebar navigation
- [ ] Build **Pending Approvals** page:
  - List users awaiting approval
  - Approve/reject buttons
  - View user details
- [ ] Build **User Management** page:
  - List all users
  - Filter by role/status
  - Suspend/activate users
  - View user activity
- [ ] Build **Audit Logs** page:
  - Display communication metadata
  - Filter by date/user
  - NO message content shown
  - Export logs (CSV)
- [ ] Build **Analytics Dashboard**:
  - Total users count
  - Active conversations
  - Messages sent today
  - System health indicators

#### 2. Role-Based Access Control (1 hour)
- [ ] Implement role checking in frontend
- [ ] Hide admin features from regular users
- [ ] Add role-based route guards
- [ ] Test access control

### Afternoon (4-5 hours)

#### 3. Security Features (2 hours)
- [ ] **Message Expiry:**
  - Add expiry timer to messages
  - Auto-delete from UI after expiry
  - Visual countdown timer
- [ ] **Copy/Screenshot Detection:**
  - Disable right-click on chat
  - Add CSS to prevent text selection
  - Watermark overlay (subtle)
- [ ] **Session Management:**
  - Auto-logout after inactivity
  - Secure token refresh
  - Force logout on password change
- [ ] **Rate Limiting:**
  - Limit messages per minute
  - Show cooldown timer

#### 4. UI/UX Polish (1.5 hours)
- [ ] Add notifications (toast messages)
- [ ] Improve loading states
- [ ] Add error handling and user feedback
- [ ] Create demo accounts with sample data
- [ ] Test all user flows
- [ ] Fix any bugs

#### 5. Deployment (1.5 hours)
- [ ] **Backend Deployment:**
  - Push code to GitHub
  - Deploy to Render/Railway
  - Set environment variables
  - Test API endpoints
- [ ] **Frontend Deployment:**
  - Build production bundle
  - Deploy to Vercel/Netlify
  - Configure API URL
  - Test live app
- [ ] **Final Testing:**
  - Test end-to-end on live URLs
  - Check encryption working
  - Verify real-time messaging
  - Test on multiple browsers

### Day 3 End Goal
 HQ dashboard fully functional  
 All security features implemented  
 App deployed and accessible online  
 Demo-ready with sample accounts

---

##  Simplified Security Implementation

### End-to-End Encryption (Simplified)
```javascript
// Browser-side encryption (sender)
1. User types message
2. Generate AES-256 key (or use existing shared key)
3. Encrypt message with AES-256
4. Send encrypted message + IV to server
5. Server forwards to recipient (cannot decrypt)

// Browser-side decryption (receiver)
6. Receive encrypted message + IV
7. Use shared AES key to decrypt
8. Display plaintext message
```

### Key Features (MVP)
-  AES-256 encryption (good enough for demo)
-  JWT authentication
-  HTTPS (via hosting platform)
-  Message expiry (client-side)
-  Audit logging (metadata only)

### Skip for MVP (Add Later)
-  Post-Quantum Crypto (too complex for 3 days)
-  VPN simulation (not needed for web)
-  Biometric auth (web doesn't support well)
-  Advanced device checks (mobile-only)

---

##  Deliverables (End of Day 3)

### Working Web Application
1. **User Features:**
   - Register and login
   - Wait for HQ approval
   - Send/receive encrypted messages
   - Share encrypted files
   - See online/offline status
   - Message expiry timers

2. **HQ Admin Features:**
   - Approve/reject users
   - View all users
   - Monitor audit logs (metadata only)
   - View analytics

3. **Security Features:**
   - End-to-end encryption (AES-256)
   - Secure authentication (JWT)
   - Message auto-deletion
   - Copy/select prevention
   - Rate limiting

### Demo Materials
- [ ] Live deployed app (public URL)
- [ ] Demo accounts (1 admin, 2 users)
- [ ] Sample conversations with encryption
- [ ] Architecture diagram
- [ ] 2-minute demo video (optional)

---

##  Quick Start Commands

### Backend Setup
```bash
mkdir defense-shield-backend
cd defense-shield-backend
npm init -y
npm install express socket.io cors dotenv bcryptjs jsonwebtoken @supabase/supabase-js multer
# Create server.js and start coding
node server.js
```

### Frontend Setup
```bash
npm create vite@latest defense-shield-client -- --template react
cd defense-shield-client
npm install
npm install react-router-dom socket.io-client zustand axios crypto-js
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm run dev
```

---

##  Progress Tracking

### Day 1: Backend 
- [ ] Project setup & dependencies
- [ ] Database schema
- [ ] Authentication API
- [ ] User management API
- [ ] WebSocket server
- [ ] Message API
- [ ] Encryption utilities
- [ ] File upload

### Day 2: Frontend 
- [ ] Frontend setup
- [ ] Login/Register pages
- [ ] State management
- [ ] Encryption in browser
- [ ] Chat UI layout
- [ ] Real-time messaging
- [ ] File sharing

### Day 3: Dashboard & Deploy 
- [ ] Admin dashboard
- [ ] RBAC implementation
- [ ] Security features
- [ ] UI polish
- [ ] Deployment
- [ ] Testing
- [ ] Demo prep

---

##  Pro Tips for Speed

1. **Use Templates:** Copy-paste UI components from Tailwind UI or shadcn/ui
2. **Use AI Tools:** ChatGPT/Copilot for boilerplate code
3. **Skip Testing:** For MVP, manual testing is enough
4. **Reuse Code:** Copy common patterns (auth, API calls)
5. **Focus on Core:** Chat + Encryption + Admin Dashboard only
6. **Deploy Early:** Test on production from Day 2
7. **Use Supabase:** Built-in auth, real-time, storage saves time

---

##  Environment Variables

### Backend `.env`
```env
PORT=5000
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

---

##  Demo Script (5 minutes)

1. **Intro** (30 sec)
   - Problem: Soldiers use insecure WhatsApp/Telegram
   - Solution: Defense Shield - Encrypted, HQ-controlled platform

2. **User Registration** (1 min)
   - Show registration form
   - "Awaiting HQ approval" message
   - Explain security-first approach

3. **Admin Approval** (1 min)
   - Login as HQ admin
   - Show pending approvals
   - Approve user with one click
   - Show audit log entry created

4. **Encrypted Chat** (2 min)
   - Login as two users (side-by-side browsers)
   - Send encrypted messages in real-time
   - Show encryption indicators
   - Demonstrate file sharing
   - Show message expiry countdown

5. **Admin Monitoring** (30 sec)
   - Show audit logs (timestamps, users, actions)
   - Emphasize: **No message content visible to admin**
   - Show analytics dashboard
   - Highlight India-hosted data sovereignty

---

##  Success Criteria (3-Day MVP)

### Must Have 
-  User registration with HQ approval workflow
-  Encrypted real-time chat (AES-256)
-  Admin dashboard with user management
-  Audit logs showing metadata only
-  Deployed and accessible online

### Nice to Have  (if time permits)
-  Group chats
-  Message search
-  Dark/light mode toggle
-  Email notifications
-  Advanced analytics charts

### Can Skip  (Add Later)
-  Voice/video calls
-  Mobile app version
-  Post-quantum encryption (complex)
-  Biometric authentication
-  VPN simulation

---

**Total Time:** 3 days (24-30 hours of focused work)  
**Budget:** $  (all free-tier services)  
**Team:** 1-2 developers  
**Target:** Fully functional MVP for SIH 2025  
**Tech:** React + Node.js + Supabase + Socket.io

---

*Last Updated: October 11, 2025*  
*Status: Ready to Build*   
*Let's ship this in 3 days!*
