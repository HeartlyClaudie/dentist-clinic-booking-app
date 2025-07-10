# Microservices Appointment Scheduling System

This project implements two microservices using Node.js and Docker:
- **User Service** – Handles user registration, login, and lookup
- **Booking Service** – Handles booking appointments and integrates with user-service

---

## 🛠️ Technologies Used
- Node.js + Express.js
- Docker + Docker Compose
- Axios (for inter-service HTTP requests)

---

## 📂 Project Structure
clinic_booking_app/
├── user-service/
├── booking-service/
└── docker-compose.yml

---

## 🚀 How to Run Locally

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- Docker Compose (built-in if Docker Desktop is installed)

### Start the Services
bash
docker compose up --build

User Service: http://localhost:3001

Booking Service: http://localhost:3002

## API Endpoints
### User Service

| Method | Endpoint        | Description         |
| ------ | --------------- | ------------------- |
| POST   | /users/register | Register a new user |
| POST   | /users/login    | Log in a user       |
| GET    | /users/\:id     | Get user by ID      |

### Booking Service
| Method | Endpoint  | Description                               |
| ------ | --------- | ----------------------------------------- |
| POST   | /bookings | Create a booking (validates user-service) |
| GET    | /bookings | Retrieve all bookings (in-memory)         |

## Example Workflow
1. Register a user at http://localhost:3001/users/register

2. Create a booking at http://localhost:3002/bookings using the user ID

3. View bookings at http://localhost:3002/bookings

## Team Members
Alexa Agabon
Hannah Joy Julian
Claude Kaiser Espanillo
