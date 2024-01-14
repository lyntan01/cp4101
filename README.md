# Interactive Frontend Development Learning Platform

## Description

This platform is designed to provide an interactive learning experience for undergraduate students studying frontend development. It features a comprehensive set of tools and resources tailored to enhance the learning process. The platform is equipped with features like traditional text-based lessons, a code sandbox for hands-on practice, step-by-step visualizations of coding concepts, real-time code feedback, and analytics tools for teachers to monitor student progress.

This platform is developed for CP4101 B.Comp Dissertation (FYP AY2023/24)

## Users

The platform caters to two main user groups:
1. **Teachers**: Can create and manage courses, track student progress, and provide feedback.
2. **Students**: Can enroll in courses, access learning materials, practice coding, and receive feedback.

## Core Features

1. **Text-Based Lessons**: Structured lessons with theoretical content.
2. **Code Sandbox**: An interactive environment where students can write and test code.
3. **Step-By-Step Visualization**: Visual aids to illustrate coding concepts.
4. **Real-Time Code Feedback**: Instant feedback on coding exercises.
5. **Analytics for Teachers**: Insights into student engagement and performance.

## Project Setup

### Prerequisites

- Node.js (LTS Version)
- PostgreSQL Database
- Prisma

### Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up the PostgreSQL database and ensure it is running.
4. Configure the `.env` file with your database credentials and port number.
   ```bash
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
   PORT=8000
   ```
5. Run Prisma migrations:
   ```bash
   npx prisma migrate dev
   ```
6. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React app:
   ```bash
   npm start
   ```
4. The application should now be running on `http://localhost:3000`.