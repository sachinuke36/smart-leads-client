# Smart Leads Dashboard

A full-stack Lead Management Dashboard built with the MERN stack (MongoDB, Express.js, React, Node.js) using TypeScript.

## Features

### Core Features
- **Authentication System**: JWT-based authentication with secure password hashing
- **Role-Based Access Control**: Admin and Sales User roles with different permissions
- **Leads Management**: Full CRUD operations for leads
- **Advanced Filtering & Search**: Filter by status, source, and search by name/email
- **Pagination**: Backend pagination with 10 records per page
- **CSV Export**: Export filtered leads to CSV format
- **Dark Mode**: Toggle between light and dark themes

### Technical Features
- TypeScript throughout (frontend and backend)
- RESTful API design
- Debounced search
- Responsive design with TailwindCSS
- Proper error handling and validation
- Loading and empty states

## Tech Stack

### Frontend
- React.js 18
- TypeScript
- TailwindCSS
- React Router v6
- Axios

### Backend
- Node.js
- Express.js
- TypeScript
- MongoDB + Mongoose
- JWT for authentication
- bcryptjs for password hashing
- express-validator for validation

## Project Structure

```
smart-leads/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # React contexts (Auth, Theme)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service functions
│   │   ├── types/          # TypeScript type definitions
│   │   └── utils/          # Utility functions
│   ├── Dockerfile
│   └── package.json
├── server/                 # Backend Node.js application
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── types/          # TypeScript type definitions
│   │   └── utils/          # Utility functions
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smart-leads
   ```

2. **Setup Backend**
   ```bash
   cd server
   cp .env.example .env
   npm install
   npm run dev
   ```

3. **Setup Frontend** (in a new terminal)
   ```bash
   cd client
   cp .env.example .env
   npm install
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

### Docker Deployment

1. **Create environment file**
   ```bash
   cp .env.example .env
   # Edit .env and set a secure JWT_SECRET
   ```

2. **Build and run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Application: http://localhost
   - API: http://localhost:5000

## API Documentation

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "sales" // optional, defaults to "sales"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Leads

#### Get All Leads (with filters and pagination)
```http
GET /api/leads?page=1&limit=10&status=New&source=Website&search=john&sortBy=latest
Authorization: Bearer <token>
```

#### Get Single Lead
```http
GET /api/leads/:id
Authorization: Bearer <token>
```

#### Create Lead
```http
POST /api/leads
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Lead Name",
  "email": "lead@example.com",
  "status": "New",
  "source": "Website"
}
```

#### Update Lead
```http
PUT /api/leads/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "status": "Contacted"
}
```

#### Delete Lead
```http
DELETE /api/leads/:id
Authorization: Bearer <token>
```

#### Export Leads to CSV
```http
GET /api/leads/export?status=New&source=Website
Authorization: Bearer <token>
```

### Response Format

**Success Response**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

**Paginated Response**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

**Error Response**
```json
{
  "success": false,
  "error": "Error message"
}
```

## Lead Fields

| Field | Type | Required | Values |
|-------|------|----------|--------|
| name | String | Yes | 2-100 characters |
| email | String | Yes | Valid email |
| status | String | No | New, Contacted, Qualified, Lost |
| source | String | Yes | Website, Instagram, Referral |

## Role Permissions

| Action | Admin | Sales User |
|--------|-------|------------|
| View all leads | Yes | Only own/assigned |
| Create leads | Yes | Yes |
| Update leads | Yes | Only own/assigned |
| Delete leads | Yes | Only own |
| Assign leads | Yes | No |
| Export leads | Yes | Only own/assigned |

## Environment Variables

### Server
| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| NODE_ENV | Environment | development |
| MONGO_URI | MongoDB connection string | mongodb://localhost:27017/smart-leads |
| JWT_SECRET | JWT signing secret | - |
| JWT_EXPIRES_IN | Token expiration | 7d |
| CORS_ORIGIN | Allowed CORS origin | http://localhost:5173 |

### Client
| Variable | Description | Default |
|----------|-------------|---------|
| VITE_API_URL | API base URL | /api (uses proxy) |

## Scripts

### Server
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
```

### Client
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## License

MIT
