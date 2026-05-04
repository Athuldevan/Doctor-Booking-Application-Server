

## 🚀 Features

- **User Authentication**: Secure login and registration with JWT.
- **Role-Based Access Control (RBAC)**: Distinct permissions for Admins and Patients.
- **Admin Dashboard**: Real-time metrics including total doctors, patients, revenue, and booking trends.
- **Doctor Management**: Admins can add, update, and manage doctor profiles.
- **Slot Management**: Create and manage time slots with status tracking (Available, Pending, Confirmed, Cancelled, Completed, Blocked).
- **Appointment Booking**: Patients can view available doctors and book appointments.
- **Transaction Safety**: MongoDB transactions for critical booking operations.
- **Data Validation**: Joi-based request validation for all API endpoints.

## 🛠️ Tech Stack

- **Backend**: Node.js, Express, TypeScript, MongoDB, Mongoose, Joi, JWT.
- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Lucide React, React Toastify.



### Prerequisites
- Node.js (v16+)
- MongoDB 

### Backend Setup
1. Navigate to the server directory: `cd Doctor-Booking-Application`
2. Install dependencies: `npm install`
3. Create a `.env` file in the root and add the following:
   ```env
   PORT=5000
   DB_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLIENT_URL=http://localhost:5173
   ```
4. Start the development server: `npm run dev`

### Frontend Setup
1. Navigate to the client directory: `cd doctor-booking-client`
2. Install dependencies: `npm install`
3. Create a `.env` file in the root and add:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the frontend: `npm run dev`

## 🔌 API Endpoints

### Auth
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Admin
- `GET /api/admin/dashboard` - Get dashboard metrics (Admin only)
- `GET /api/admin/appointments` - View all appointments (Admin only)

### Doctors
- `GET /api/doctors` - List all doctors
- `POST /api/doctors` - Add a doctor (Admin only)
- `GET /api/doctors/:id` - Get doctor details
- `PUT /api/doctors/:id` - Update doctor details (Admin only)

### Booking/Slots
- `POST /api/slots` - Create slots (Admin only)
- `GET /api/slots` - Get all slots (Admin/Patient)
- `POST /api/slots/:doctorSlotId/book/:timeSlotId` - Book an appointment (Patient only)
- `PATCH /api/slots/:doctorSlotId/status/:timeSlotId` - Update slot status (Admin/Doctor)
- `PATCH /api/slots/:doctorSlotId/cancel/:timeSlotId` - Cancel slot

## 🛡️ Validation
All requests are validated using Joi schemas to ensure data integrity and security.


