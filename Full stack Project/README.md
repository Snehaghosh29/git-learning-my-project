# PG Booking Website

A full-stack web application for managing Paying Guest (PG) accommodations, allowing property owners to list their properties and clients to book them.

## Features

### Admin Features
- Approve/Reject property listings
- Manage user accounts
- View all bookings and transactions
- Monitor system activity

### Property Owner Features
- Register and manage account
- List new properties
- Upload property photos
- Set property details (location, price, capacity)
- Manage bookings
- View booking history

### Client Features
- Browse available properties
- Search and filter properties
- Book properties
- View booking history
- Manage profile

## Tech Stack

### Frontend
- React.js (Vite)
- CSS
- React Router for navigation
- Context API for state management

### Backend
- Node.js
- Express.js
- MongoDB Atlas (Database)
- Cloudinary (Image Storage)
- JWT Authentication

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- Cloudinary account
- Git

## Installation

1. Clone the repository
```bash
git clone [repository-url]
```

2. Install frontend dependencies
```bash
cd frontend
npm install
```

3. Install backend dependencies
```bash
cd backend
npm install
```

4. Create environment variables
Create a `.env` file in the backend directory with the following variables:
```
MONGODB_URI=mongodb+srv://prinkalgarg03:Prinkal30@cluster0.5ts55.mongodb.net
CLOUDINARY_CLOUD_NAME=dvrlfqokm
CLOUDINARY_API_KEY=332498836659466
CLOUDINARY_API_SECRET=IvPdptct1rEb8R0iAPoBatL14J0
JWT_SECRET=your_jwt_secret
```

## Project Structure

```
pg-booking-website/
├── frontend/
│   ├── src/
│   │   ├── admin/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   └── styles/
│   │   ├── property-owner/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   └── styles/
│   │   ├── client/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   └── styles/
│   │   ├── shared/
│   │   │   ├── components/
│   │   │   ├── context/
│   │   │   └── utils/
│   │   ├── assets/
│   │   └── App.jsx
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── adminController.js
│   │   │   ├── propertyOwnerController.js
│   │   │   └── clientController.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Property.js
│   │   │   └── Booking.js
│   │   ├── routes/
│   │   │   ├── adminRoutes.js
│   │   │   ├── propertyOwnerRoutes.js
│   │   │   └── clientRoutes.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── upload.js
│   │   └── server.js
│   └── package.json
└── README.md
```

## Running the Application

1. Start the backend server
```bash
cd backend
npm run dev
```

2. Start the frontend development server
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## API Endpoints

### Authentication
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me

### Admin Endpoints
- GET /api/admin/properties
- PUT /api/admin/properties/:id/approve
- PUT /api/admin/properties/:id/reject
- GET /api/admin/users
- GET /api/admin/bookings

### Property Owner Endpoints
- POST /api/property-owner/properties
- GET /api/property-owner/properties
- PUT /api/property-owner/properties/:id
- DELETE /api/property-owner/properties/:id
- GET /api/property-owner/bookings

### Client Endpoints
- GET /api/client/properties
- POST /api/client/bookings
- GET /api/client/bookings
- PUT /api/client/bookings/:id

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

[Your Name] - [Your Email]

Project Link: [https://github.com/yourusername/pg-booking-website](https://github.com/yourusername/pg-booking-website) 