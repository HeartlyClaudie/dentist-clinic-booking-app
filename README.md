
# Dental Clinic Scheduling System

This project implements a **microservices-based architecture** for a dental clinic using **Node.js**, **Docker**, and **Kubernetes**. It includes:

- **User Service** – Manages user registration, login, and retrieval  
- **Booking Service** – Handles booking creation and validation via User Service  
- **Product Service** – Manages clinic services/products (e.g., dental services offered)  
- **Notification Service** – Sends internal notifications (future support for email/SMS)

---

## Technologies Used

This project leverages a wide range of technologies to implement a complete, scalable, and observable microservices architecture:

- **Node.js & Express.js** – for creating RESTful microservices.
- **Docker** – for containerization of each service.
- **Kubernetes** – for orchestrating containers (including Pods, Deployments, Services, Ingress, and HPA).
- **Ingress Controller** – for external access and routing.
- **Horizontal Pod Autoscaler (HPA)** – for scaling microservices based on CPU utilization.
- **Prometheus** – for collecting metrics.
- **Grafana** – for monitoring and visualizing metrics.
- **ConfigMap & Secrets** – for configuration management and secure credentials.
- **RBAC (Role-Based Access Control)** – for fine-grained Kubernetes access control.
- **Network Policies** – to restrict traffic between pods.
- **PostgreSQL, MongoDB, SQLite** – demonstrating polyglot persistence.
- **GitHub Actions** – for CI/CD pipelines.
- **Jest** – for automated testing.

## Project Structure

```
CLINIC_BOOKING_APP/
├── __tests__/
├── .github/
├── booking-service/
├── k8s/
│   ├── booking-service/
│   │   ├── configmap.yaml
│   │   ├── deployment.yaml
│   │   ├── network-policy.yaml
│   │   ├── secret.yaml
│   │   ├── service.yaml
│   ├── notification-service/
│   ├── product-service/
│   ├── user-service/
│   ├── rbac/
│   │   ├── pod-viewer-rolebinding.yaml
│   │   ├── pod-viewer-serviceaccount.yaml
│   │   ├── viewer-role.yaml
├── notification-service/
├── product-service/
├── user-service/
├── .gitignore
├── docker-compose.yml
└── README.md
```

## How to Run

### Kubernetes (Recommended)

> Prerequisite: Kubernetes must be enabled in Docker Desktop

1. Deploy all components:

```bash
kubectl apply -f k8s/
```

2. Verify deployments:

```bash
kubectl get pods
kubectl get svc
```

3. Optionally access services:

```bash
kubectl port-forward service/user-service 3001:3000
kubectl port-forward service/booking-service 3002:3000
kubectl port-forward service/product-service 3003:3000
kubectl port-forward service/notification-service 3004:3000
```

4. Access Prometheus and Grafana:

```bash
kubectl port-forward -n monitoring service/prometheus-server 9090:9090
kubectl port-forward -n monitoring service/grafana 3000:3000
```

---

### Docker Compose (For Local Development)

```bash
docker compose up --build
```

Access endpoints:

- User Service: `http://localhost:3001`
- Booking Service: `http://localhost:3002`
- Product Service: `http://localhost:3003`
- Notification Service: `http://localhost:3004`

---

## Kubernetes Features

The project includes full Kubernetes deployment features:

- **Horizontal Pod Autoscaling (HPA)** per service  
- **ConfigMaps and Secrets** for environment configs and credentials  
- **RBAC (Role-Based Access Control)** to restrict cluster actions  
- **Network Policies** to isolate microservices  
- **Rolling Updates** for zero-downtime deployments  
- **Prometheus + Grafana** integration for monitoring and visualization  

---

## API Endpoints

### User Service

| Method | Endpoint        | Description         |
|--------|-----------------|---------------------|
| POST   | /users/register | Register a new user |
| POST   | /users/login    | Log in a user       |
| GET    | /users/:id      | Get user by ID      |

### Booking Service

| Method | Endpoint  | Description                               |
|--------|-----------|-------------------------------------------|
| POST   | /bookings | Create booking (verifies user-service)    |
| GET    | /bookings | Retrieve all bookings                     |

### Product Service

| Method | Endpoint       | Description                  |
|--------|----------------|------------------------------|
| GET    | /products      | List all clinic services     |
| POST   | /products      | Add a new clinic service     |

### Notification Service

| Method | Endpoint        | Description                      |
|--------|------------------|----------------------------------|
| POST   | /notifications   | Send internal notifications      |

---

## Example Workflow

1. Register a user at `http://localhost:3001/users/register`  
2. Use the user ID to create a booking at `http://localhost:3002/bookings`  
3. Optionally trigger a notification (simulated)  
4. View all bookings at `http://localhost:3002/bookings`  

---

## Monitoring Workflow

1. Prometheus scrapes metrics from all services.  
2. Grafana displays CPU, memory, and HPA metrics visually.  
3. You can view dashboards at `http://localhost:3000` after port-forwarding.

---

## Team Members

- Alexa Agabon  
- Hannah Joy Julian  
- Claude Kaiser Espanillo
