# Zune

Zune is a full-stack real-time video conferencing web application built with React, Node.js, Express, WebRTC, Socket.io, and MongoDB. It enables secure authentication, peer-to-peer video communication, and real-time signaling between users.

---

## Live Demo

Frontend: https://main.d2fyugyyaiab9s.amplifyapp.com/

Backend API: https://zune.onrender.com

---

## Features

- User authentication using JWT
- Secure password hashing with bcrypt
- Real-time video conferencing using WebRTC
- Real-time signaling using Socket.io
- Peer-to-peer communication
- RESTful backend APIs

---

## Tech Stack

### Frontend

https://skillicons.dev/icons?i=react,javascript,tailwind

### Backend

https://skillicons.dev/icons?i=nodejs,express,sequelize,websocket

### Real-Time Layer

https://skillicons.dev/icons?i=socketio,webrtc

### Database

https://skillicons.dev/icons?i=mongodb

### Tools & Deployment

https://skillicons.dev/icons?i=aws,git,github

---

## Architecture

Frontend (React on AWS Amplify)  
→ Backend API (Node.js + Express on Render)  
→ MongoDB Database  ( on MongoDB Atlas )
→ WebRTC Peer-to-Peer Connection  

---

## Project Structure

frontend/  
backend/  
README.md  

---

## Environment Variables

Backend:

PORT=8080
MONGO_URL=your_mongodb_connection_string  
JWT_SECRET=your_secret_key  

---

## Authentication Flow

- User registers or logs in  
- Password is hashed using bcrypt  
- JWT token is generated on login  
- Token stored in localStorage  
- Token used for protected routes  

---

## Real-Time Communication

- Socket.io handles signaling  
- WebRTC creates peer-to-peer video connection  
- STUN servers handle NAT traversal  

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