# Enterprise CRM System

A production-ready Enterprise CRM built with the MERN stack (MongoDB, Express, React, Node.js) featuring JWT authentication, role-based access control, a drag-and-drop sales pipeline, and a modern dark-themed responsive UI.

## Tech Stack

**Frontend**

- React.js (JavaScript, no TypeScript)
- React Router (protected routes)
- Axios (API client with JWT interceptor)
- Tailwind CSS (dark theme, responsive)
- Recharts (dashboard charts)
- Lucide React (icons)

**Backend**

- Node.js + Express.js
- MongoDB Atlas (Mongoose ODM)
- JWT Authentication
- bcryptjs password hashing
- Role-Based Access Control (Admin / Sales Executive)

## Features

### Authentication

- Register, Login, Logout
- JWT token stored in localStorage
- Protected routes (frontend + backend)
- bcrypt password hashing

### Dashboard

- Total Leads, Total Customers, Deals Won, Revenue cards
- Monthly Sales area chart
- Leads-by-status bar chart
- Recent activity feed

### Lead Management

- Add / Edit / Delete leads
- Search leads (name, email, company)
- Filter leads by status
- Lead statuses: New, Contacted, Qualified, Proposal, Won, Lost
- Assign leads to sales executives (admin only)

### Customer Management

- Add / Edit / Delete customers
- Customer detail view
- Search customers

### Sales Pipeline

- Kanban board with 6 status columns
- Drag-and-drop to update lead status
- Per-column deal value totals

### Activity Logs

- Automatic tracking of all user actions (auth, leads, customers, users)
- Timestamped activity feed

### Role-Based Access Control

- **Admin**: full access — manage all leads, customers, and users
- **Sales Executive**: manage only leads/customers assigned to them; cannot access user management

### Responsive UI

- Modern dark theme
- Collapsible sidebar navigation (mobile drawer)
- Fully mobile-responsive layouts

## Project Structure

```
enterprise-crm/
├── client/                  # React frontend
│   ├── public/
│   ├── src/
│   │   ├── api/             # Axios instance
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # Auth + Toast context
│   │   ├── pages/           # Route pages
│   │   ├── App.jsx          # Routes
│   │   ├── main.jsx         # Entry point
│   │   └── index.css        # Tailwind styles
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── server/                  # Node/Express backend
│   ├── src/
│   │   ├── config/          # DB connection
│   │   ├── controllers/     # Route logic
│   │   ├── middleware/      # Auth + error handling
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # Express routes
│   │   ├── utils/           # Helpers (token, activity log)
│   │   ├── server.js        # Express app entry
│   │   └── seed.js          # Sample data seeder
│   ├── .env.example
│   └── package.json
├── README.md
└── package.json             # Root orchestration scripts
```

## Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB Atlas account (or any MongoDB instance)

### 1. Install dependencies

```bash
npm install:all
```

Or manually:

```bash
npm install
npm --prefix server install
npm --prefix client install
```

### 2. Configure environment variables

Copy the server env example and fill in your values:

```bash
cp server/.env.example server/.env
```

Edit `server/.env`:

```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<db>?retryWrites=true&w=majority
JWT_SECRET=your_long_random_secret_string
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
SEED_ADMIN_NAME=Admin User
SEED_ADMIN_EMAIL=admin@crm.com
SEED_ADMIN_PASSWORD=Admin@123
```

### 3. Seed sample data (optional but recommended)

```bash
npm run seed
```

This creates demo users, leads, customers, and activities.

### 4. Run the application

```bash
npm run dev
```

This starts both the server (port 5000) and client (port 5173) concurrently.

- Frontend: http://localhost:5173
- API: http://localhost:5000/api

## Demo Accounts

After seeding, use these credentials:

| Role            | Email         | Password  |
| --------------- | ------------- | --------- |
| Admin           | admin@crm.com | Admin@123 |
| Sales Executive | sarah@crm.com | Sales@123 |
| Sales Executive | mike@crm.com  | Sales@123 |

## API Endpoints

### Auth

| Method | Endpoint           | Description         |
| ------ | ------------------ | ------------------- |
| POST   | /api/auth/register | Register a new user |
| POST   | /api/auth/login    | Login               |
| GET    | /api/auth/me       | Get current user    |
| POST   | /api/auth/logout   | Logout              |

### Users (admin only)

| Method | Endpoint       | Description    |
| ------ | -------------- | -------------- |
| GET    | /api/users     | List all users |
| POST   | /api/users     | Create a user  |
| GET    | /api/users/:id | Get a user     |
| PUT    | /api/users/:id | Update a user  |
| DELETE | /api/users/:id | Delete a user  |

### Leads

| Method | Endpoint              | Description           |
| ------ | --------------------- | --------------------- |
| GET    | /api/leads            | List leads (filtered) |
| POST   | /api/leads            | Create a lead         |
| GET    | /api/leads/:id        | Get a lead            |
| PUT    | /api/leads/:id        | Update a lead         |
| DELETE | /api/leads/:id        | Delete a lead         |
| PATCH  | /api/leads/:id/status | Update lead status    |

### Customers

| Method | Endpoint           | Description       |
| ------ | ------------------ | ----------------- |
| GET    | /api/customers     | List customers    |
| POST   | /api/customers     | Create a customer |
| GET    | /api/customers/:id | Get a customer    |
| PUT    | /api/customers/:id | Update a customer |
| DELETE | /api/customers/:id | Delete a customer |

### Activities

| Method | Endpoint        | Description     |
| ------ | --------------- | --------------- |
| GET    | /api/activities | List activities |

### Dashboard

| Method | Endpoint       | Description         |
| ------ | -------------- | ------------------- |
| GET    | /api/dashboard | Get dashboard stats |

## Scripts

| Command           | Description                        |
| ----------------- | ---------------------------------- |
| `npm run dev`     | Start server + client concurrently |
| `npm run server`  | Start only the backend             |
| `npm run client`  | Start only the frontend            |
| `npm run seed`    | Seed sample data into MongoDB      |
| `npm run build`   | Build the client for production    |
| `npm install:all` | Install all dependencies           |

## License

MIT

# Enterprise-CRM-System
A scalable Enterprise CRM web application for managing customer relationships, sales data, and business operations with an intutive dashboard and role-based user access. 

