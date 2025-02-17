# Prime Visitor - Visitor Management System

A modern, responsive visitor management system built with React, TypeScript, and Firebase.

## Features

- Front desk authentication
- Employee and visitor information management
- Real-time updates using Firebase
- Responsive design with animations
- Modern UI using Mantine

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Firebase:
   - Create a new Firebase project
   - Enable Authentication and Firestore
   - Copy your Firebase configuration to `src/config/firebase.ts`

4. Create a front desk user:
   - In Firebase Console, go to Authentication
   - Add a new user with email and password
   - This will be used for front desk login

5. Start the development server:
   ```bash
   npm run dev
   ```

## Technologies Used

- React + Vite
- TypeScript
- Firebase (Authentication & Firestore)
- Mantine UI
- Framer Motion for animations
