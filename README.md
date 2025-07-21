# 🦷 Dental Clinic Scheduling System

This project now implements **four microservices** using **Node.js**, **Docker**, and **Kubernetes**:

- **User Service** – Handles user registration, login, and lookup  
- **Booking Service** – Creates bookings and validates users via user-service  
- **Product Service** – Manages clinic services/products (e.g., types of appointments)  
- **Notification Service** – Handles notifications (email/SMS in future)

---

## Technologies Used

- Node.js + Express.js  
- Docker + Docker Compose  
- Kubernetes (local, using Docker Desktop)  
- Prometheus + Grafana (for monitoring)  
- Axios (for HTTP requests between services)

---

## Project Structure
```bash
clinic_booking_app/
├── user-service/
├── booking-service/
├── product-service/
├── notification-service/
├── k8s/ # Kubernetes YAML files (deployment, service, autoscaling)
└── docker-compose.yml # For optional local Docker testing
```

---

## How to Run

### Kubernetes (Recommended)

> Ensure Docker Desktop's Kubernetes is enabled

1. Apply all manifests:
```bash
kubectl apply -f k8s/
```
2. Check pods/services
```bash
kubectl get pods
kubectl get svc
```
3. Access via NodePort or kubectl port-forward depending on your setup.
Optional: Docker Compose (Local Dev Only)
```bash
docker compose up --build
```
- User Service: http://localhost:3001
- Booking Service: http://localhost:3002
- Product Service: http://localhost:3003
- Notification Service: http://localhost:3004

---

### Autoscaling

All microservices have Horizontal Pod Autoscalers (HPA) enabled via Kubernetes.

---

### Monitoring

- Prometheus collects metrics from all pods

- Grafana displays real-time dashboards

- You can view pod metrics and service performance

---

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

---

## Example Workflow
1. Register a user at http://localhost:3001/users/register

2. Create a booking at http://localhost:3002/bookings using the user ID

3. View bookings at http://localhost:3002/bookings

---

## Team Members
- Alexa Agabon
- Hannah Joy Julian
- Claude Kaiser Espanillo
