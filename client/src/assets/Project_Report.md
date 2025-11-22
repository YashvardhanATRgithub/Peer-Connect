# PeerConnect: Project Report

**Project Name:** PeerConnect  
**Domain:** Web Development (MERN Stack)  
**Date:** November 2025

---

## 1. Introduction

### 1.1 Overview
PeerConnect is a campus-first social platform designed to bridge the gap between students by facilitating real-world connections through shared activities. In a post-pandemic world where digital interactions often replace physical ones, PeerConnect aims to bring students together for sports, study sessions, workshops, and casual meetups.

### 1.2 Problem Statement
College campuses are bustling with thousands of students, yet many struggle to find peers with similar interests or to organize impromptu events. Existing social networks are often too broad or purely digital, lacking the hyper-local, activity-focused context of a university campus. Students miss out on opportunities to play sports, collaborate on projects, or socialize simply because they don't know who else is available and interested.

### 1.3 Solution
PeerConnect provides a dedicated space for students to:
- **Create Activities:** Host events with specific details (time, location, capacity).
- **Discover Peers:** Browse a live feed of activities happening on campus.
- **Join & Participate:** RSVP to events, manage waitlists, and connect with organizers.
- **Verify Identity:** Ensure safety and relevance through college domain email verification.

---

## 2. System Architecture

### 2.1 Technology Stack
The project utilizes the **MERN Stack**, a robust and popular choice for modern web applications:

- **Frontend:**
  - **React 19:** For building a dynamic and responsive user interface.
  - **Vite:** Next-generation frontend tooling for fast builds.
  - **Tailwind CSS:** Utility-first CSS framework for rapid and consistent styling.
  - **Axios:** For handling HTTP requests to the backend.
  - **React Router:** For seamless client-side navigation.

- **Backend:**
  - **Node.js:** JavaScript runtime environment.
  - **Express.js:** Web application framework for API routing and middleware.
  - **Nodemailer:** Module for sending emails (verification OTPs).
  - **Bcrypt:** Library for hashing passwords securely.
  - **JsonWebToken (JWT):** For secure, stateless user authentication.

- **Database:**
  - **MongoDB Atlas:** Cloud-hosted NoSQL database for flexible and scalable data storage.
  - **Mongoose:** ODM (Object Data Modeling) library for MongoDB.

### 2.2 Architecture Diagram
*(Conceptual representation)*
```
[Client (React/Vite)]  <-->  [REST API (Express/Node)]  <-->  [Database (MongoDB Atlas)]
       |                            |
       v                            v
  [Browser Storage]            [Email Service (Nodemailer)]
  (JWT Token)
```

---

## 3. Key Features

### 3.1 User Authentication & Security
- **Signup/Login:** Secure registration process requiring a valid college email address (e.g., `@nitc.ac.in`).
- **Email Verification:** Users must verify their email via a 6-digit OTP sent by the system before accessing the platform.
- **JWT Authorization:** Protected routes ensure only authenticated users can create or join activities.
- **Password Encryption:** User passwords are hashed using bcrypt before storage.

### 3.2 Activity Management
- **Create Activity:** Users can host events by providing a title, category (Sports, Study, Event, Other), date, time, location, description, and maximum capacity.
- **Join/Leave:** Users can RSVP to activities. If an activity is full, they can join a waitlist.
- **Waitlist System:** Automatic management of participant slots.
- **Edit/Delete:** Creators have full control to modify or cancel their events.

### 3.3 Discovery & Search
- **Dashboard:** A personalized feed displaying relevant activities.
- **Filtering:** Users can filter activities by category (e.g., "Show only Sports").
- **Search:** Real-time search functionality to find specific events or locations.
- **Recommendations:** The system suggests activities based on the user's listed interests.

### 3.4 User Interface (UI/UX)
- **Immersive Design:** The application features a high-quality background video overlay (`bg-white/70`) that provides a dynamic and modern aesthetic.
- **Responsive Layout:** Fully optimized for desktop, tablet, and mobile devices.
- **Glassmorphism:** Use of translucent cards and blur effects for a premium look and feel.

---

## 4. Implementation Details

### 4.1 Backend Structure
The backend is organized into modular components:
- **Models:** Define the schema for `User` and `Activity` documents.
- **Routes:** Separate route files for `auth` and `activities` to handle API endpoints.
- **Controllers/Handlers:** Logic for processing requests (e.g., `register`, `login`, `createActivity`).
- **Middleware:** `authMiddleware` verifies JWT tokens for protected routes.

### 4.2 Frontend Structure
The frontend follows a component-based architecture:
- **Pages:** `Landing`, `Login`, `Signup`, `Dashboard`, `CreateActivity`, `ActivityDetails`, `Profile`.
- **Components:** Reusable UI elements like `Button`, `ActivityCard`, `Navbar`, `BackgroundVideo`.
- **Context:** `AuthContext` manages global user state and authentication logic.

### 4.3 Database Schema
- **User Collection:** Stores name, email, password (hashed), college, interests, and avatar.
- **Activity Collection:** Stores title, category, date, time, location, description, capacity, creator (reference), participants (array of references), and waitlist.

---

## 5. User Flow

1.  **Landing Page:** New users are greeted with a visually appealing landing page explaining the platform's value proposition.
2.  **Registration:** User signs up with their college email.
3.  **Verification:** User enters the OTP sent to their email to activate the account.
4.  **Onboarding:** User logs in and lands on the Dashboard.
5.  **Exploration:** User browses activities, filters by category, or searches for specific interests.
6.  **Participation:** User clicks "Join" on an activity card. If successful, they are added to the participant list.
7.  **Creation:** User clicks "Create Event," fills in the details, and publishes a new activity to the feed.
8.  **Profile:** User updates their profile picture, bio, and interests to get better recommendations.

---

## 6. Future Scope

-   **Real-time Chat:** Integrating Socket.io for activity-specific chat rooms.
-   **Notifications:** Push notifications for upcoming events or waitlist updates.
-   **Map Integration:** Visualizing activity locations on an interactive campus map.
-   **Social Sharing:** Allowing users to share activity links on other social media platforms.
-   **Admin Panel:** Moderation tools for reporting and managing inappropriate content.

---

## 7. Conclusion

PeerConnect successfully addresses the need for a focused, trusted, and engaging social platform for college campuses. By leveraging modern web technologies and prioritizing user experience, it creates a digital space that fosters meaningful physical connections. The project demonstrates a comprehensive application of full-stack development principles, from secure authentication to dynamic data management and responsive design.
