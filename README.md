# Real-Time Chat Application

A full-stack real-time chat application that enables secure one-to-one messaging with instant delivery, online presence indicators, and persistent message storage.

The project focuses on **event-driven architecture, real-time communication, and backend correctness**.

---

## 🚀 Features

- User authentication using custom JWT logic
- Real-time messaging via WebSockets (Socket.io)
- Online / offline presence indicators
- Persistent message storage
- Secure API and socket authorization
- Clean separation of REST and real-time layers

---

## 🧠 Architecture Overview

The application uses a **hybrid architecture**:

- **REST APIs** handle authentication, user management, and message persistence
- **Socket.io** handles real-time message delivery and presence updates

Message flow:
1. User logs in and receives a JWT
2. Client establishes an authenticated socket connection
3. Messages are sent to the backend
4. Messages are saved to the database
5. Messages are emitted to the recipient in real time

> Messages are always persisted before being emitted to ensure reliability.

---

## 🛠 Tech Stack

- **Frontend:** React, Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **Real-Time:** Socket.io
- **Authentication:** JWT

---

## 🔐 Authentication & Security

- JWT-based authentication for REST APIs
- Socket connections are authorized using the same JWT
- All sensitive operations are user-scoped
- Unauthorized users cannot establish socket connections

---

## ⚙️ Key Design Decisions

- Focused on one-to-one chat to keep data consistency simple
- Persisted messages before emitting over sockets
- Used event-driven updates for presence tracking
- Avoided premature scaling to keep the system understandable

---

## ⚠️ Limitations

- Assumes a single backend instance
- No Redis-based socket state sharing yet
- No message delivery/read receipts

---

## 🔮 Future Improvements

- Group chats
- Message delivery & read receipts
- Media uploads and compression
- Redis-backed socket scaling
- Push notifications

---

## 📌 Purpose

This project was built to understand **real-time systems**, WebSocket communication, and backend state synchronization in practical applications.

