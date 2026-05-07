# Zune

Zune is a full-stack real-time video conferencing web application built with React, Node.js, Express, WebRTC, Socket.io, and MongoDB. It enables secure authentication, peer-to-peer video communication, and real-time signaling between users.

---

## Live Demo

Frontend: https://main.d2fyugyyaiab9s.amplifyapp.com/  
Backend API: https://zune.onrender.com  

---

## Features

- User authentication using JWT  
- Secure password hashing using bcrypt  
- Real-time video conferencing using WebRTC  
- Real-time signaling using Socket.io  
- Peer-to-peer communication  
- RESTful API architecture  

---

## Tech Stack


<p>
  <img src="https://skillicons.dev/icons?i=react" />
  <img src="https://skillicons.dev/icons?i=javascript" />
  <img src="https://skillicons.dev/icons?i=tailwind" />
  <img src="https://skillicons.dev/icons?i=nodejs" />
  <img src="https://skillicons.dev/icons?i=express" />
  <img src="https://socket.io/images/logo-dark.svg" width="40"/>
  <img src="https://www.gstatic.com/devrel-devsite/prod/v78ce60439c72b9da3632137223a86ae38b78a872a1f6dee1b5c1c8cfa57fe81d/webrtc/images/lockup.svg" width="140" style="margin-left:5px;"/>
  <img src="https://skillicons.dev/icons?i=mongodb" />
  <img src="https://skillicons.dev/icons?i=aws" />
  <img src="https://skillicons.dev/icons?i=git" />
  <img src="https://skillicons.dev/icons?i=github" />
</p>

---

## Architecture

Frontend (React on AWS Amplify)  
↓  
Backend (Node.js + Express on Render)  
↓  
MongoDB Atlas  
↓  
WebRTC Peer-to-Peer Connection  

---

## Project Structure

frontend/  
backend/  
README.md  

---

## Environment Variables

### Frontend

VITE_BACKEND_URL=your_backend_url

### Backend

PORT=8080 
MONGO_URL=your_mongodb_connection_string  
JWT_SECRET=your_secret_key  

---

## Authentication Flow

1. User registers or logs in  
2. Password is hashed using bcrypt  
3. JWT token is generated  
4. Token stored in localStorage  
5. Token used for protected routes  

---

## Real-Time Communication

- Socket.io handles signaling  
- WebRTC establishes peer-to-peer connection  
- STUN servers used for NAT traversal  

---

## Deployment

Frontend: AWS Amplify  
Backend: Render  
Database: MongoDB Atlas  

---

## Future Improvements

- Group video calls  
- Screen sharing  
- Chat system  
- Recording feature  
- Mobile optimization  

---

## Author

Soumya