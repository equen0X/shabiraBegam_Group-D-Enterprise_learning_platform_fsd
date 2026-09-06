<div align="center">

# 🚀 Enterprise Learning Platform

### Empowering Students • Connecting Talent • Transforming Careers

**Enterprise Learning Platform** is an AI-powered full-stack learning and workforce platform designed to bridge the gap between education and industry.

It brings together **personalized learning, coding practice, AI assistance, career guidance, recruitment, workforce management, and administrative operations** into one unified ecosystem.

<br>

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Build-646CFF?logo=vite&logoColor=white)
![Java](https://img.shields.io/badge/Java-17-orange?logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5-6DB33F?logo=springboot&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white)
![Hibernate](https://img.shields.io/badge/Hibernate-ORM-59666C?logo=hibernate&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Authentication-black?logo=jsonwebtokens)
![Gemini](https://img.shields.io/badge/Google%20Gemini-AI-4285F4?logo=google)
![YouTube API](https://img.shields.io/badge/YouTube-API-FF0000?logo=youtube&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue)

</div>

---

# 📖 About

**Enterprise Learning Platform** is a comprehensive full-stack platform developed to create an integrated digital ecosystem for **students, recruiters, workforce teams, and administrators**.

The platform combines learning, skill development, career preparation, AI assistance, recruitment, and workforce management into a single application.

Instead of using separate platforms for learning, coding practice, career preparation, recruitment, and administration, SkillSphere provides these capabilities through one connected ecosystem.

### 🎯 Core Objective

> **Learn → Build Skills → Practice → Prepare → Connect → Get Hired**

Enterprise Learning Platform helps students become industry-ready while providing organizations and recruiters with tools to discover, evaluate, and manage talent efficiently.

---

# ✨ Key Features

## 🎓 Student Portal

- Personalized Student Dashboard
- Learning Hub
- AI Study Buddy
- Course Management
- Interactive Coding Arena
- Daily Quests
- Flashcards
- Learning Paths
- Career Roadmap
- Resume Builder
- Progress Tracker
- Skill Analytics
- Opportunity Feed
- Job Search
- Job Applications
- Team Collaboration
- Sandbox Environment
- Student Profile
- Certificate Tracking
- Assessments
- AI-powered Learning Assistance

---

## 💼 Workforce Portal

- Workforce Dashboard
- Recruiter Portal
- Job Posting
- Candidate Management
- Applicant Tracking
- Recruitment Analytics
- Hiring Workflow
- Team Management
- Service Catalog
- Talent Management
- Candidate Evaluation
- Assessments
- Certificates
- Promotion Flowchart
- Leaves and Attendance

---

## 👨‍💼 Admin Panel

- Admin Dashboard
- Student Management
- Workforce Management
- Course Management
- Course Approval
- Leave Approval
- Service Booking
- Complaint Tracking
- Certification Management

---

# 🤖 AI Features

Our platform integrates **Google Gemini AI** to provide intelligent learning and career assistance.

### AI Capabilities

- 🤖 AI Study Buddy
- 📚 Personalized Learning Recommendations
- 🧭 AI Career Roadmap
- 📊 Intelligent Skill Analysis
- 📝 AI Resume Suggestions
- 💡 AI Learning Assistant
- 🎯 Career Recommendation Engine
- 📈 Smart Progress Insights
- 💬 Conversational AI Assistance

### AI Workflow

```text
User Query
    │
    ▼
Frontend Chatbot
    │
    ▼
Backend API
    │
    ▼
Gemini AI Service
    │
    ▼
AI Response
    │
    ▼
Frontend Chat Interface
```

The chatbot communicates with the backend, which securely handles the AI service integration before returning the generated response to the user.

---

# 🛠 Technology Stack

## 🎨 Frontend Layer

| Technology | Purpose |
|------------|---------|
| **React 19** | Core frontend library |
| **JavaScript (ES6+)** | Application logic |
| **Vite** | Fast build tool and development server |
| **React Router DOM v7** | Routing and navigation |
| **Context API** | Global state management |
| **HTML5** | Application structure |
| **Custom CSS3** | UI styling and responsive design |
| **Glassmorphism & Micro-animations** | Modern user experience |

---

## ⚙️ Backend Layer

| Technology | Purpose |
|------------|---------|
| **Java 17** | Backend programming language and JDK |
| **Spring Boot 3.2.5** | Backend framework |
| **Spring Security** | Application security |
| **RESTful APIs** | Frontend-backend communication |
| **Role-Based Access Control (RBAC)** | Role-based authorization |
| **Apache Maven** | Dependency management and build automation |

---

## 🗄️ Database & Storage

| Technology | Purpose |
|------------|---------|
| **MySQL 8.0** | Primary relational database |
| **Hibernate** | ORM framework |
| **Spring Data JPA** | Data access and repository abstraction |
| **Cloud Clever Database** | Cloud database platform |

### Database Architecture

```text
Frontend
    │
    ▼
REST API
    │
    ▼
Spring Boot
    │
    ▼
Spring Data JPA
    │
    ▼
Hibernate ORM
    │
    ▼
MySQL 8.0
    │
    ▼
Cloud Clever Database
```

---

# 🔐 Authentication & Security

Our project implements secure authentication and authorization using:

### JWT Authentication

- Stateless authentication
- Secure token-based sessions
- Protected API endpoints
- Token-based user verification

### Google OAuth 2.0

- Social login integration
- Simplified authentication
- Secure Google account-based login

### Spring Security

- Authentication management
- Authorization
- Protected routes
- Role-Based Access Control

### User Roles

```text
                    ┌───────────────┐
                    │ Authentication│
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │ Role Detection│
                    └───────┬───────┘
                            │
          ┌─────────────────┼─────────────────┐
          ▼                 ▼                 ▼
      STUDENT            RECRUITER           ADMIN
          │                 │                 │
          ▼                 ▼                 ▼
   Student Portal    Workforce Portal    Admin Panel
```

---

# 🔗 External Integrations

## 🤖 Google Gemini AI

Used for:

- AI Study Buddy
- Intelligent responses
- Learning assistance
- Career guidance
- AI-powered recommendations

Supported Gemini models include:

```text
gemini-1.5-flash
gemini-2.0-flash
```

---

## ▶️ YouTube API

The YouTube API is integrated to support learning content and video-based resources.

### Uses

- Educational video integration
- Video search
- Video embedding
- Learning resource discovery
- Video playback integration

---

# 📂 Project Structure

```text
SkillSphere-Learning-Nexus
│
├── backend
│   │
│   ├── src
│   │   ├── main
│   │   │   ├── java
│   │   │   │   └── com.skillsphere.backend
│   │   │   │       │
│   │   │   │       ├── config
│   │   │   │       ├── controller
│   │   │   │       ├── model
│   │   │   │       ├── repository
│   │   │   │       ├── security
│   │   │   │       ├── service
│   │   │   │       └── BackendApplication.java
│   │   │   │
│   │   │   └── resources
│   │   │       └── application.properties
│   │   │
│   │   └── test
│   │
│   └── pom.xml
│
├── frontend
│   │
│   ├── public
│   │
│   ├── src
│   │   ├── assets
│   │   ├── components
│   │   ├── context
│   │   ├── data
│   │   ├── pages
│   │   ├── styles
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── vite.config.js
│
├── screenshots
│
└── README.md
```

---


<<<<<<< HEAD
## 🎓 Student Modules

- Login & Registration
- Student Dashboard
- Learning Portal
- AI Study Buddy
- Coding Arena
- Flashcards
- Learning Paths
- Resume Builder
- Progress Tracking
- Career Roadmap
- Job Search
- Opportunity Feed
- Certificates
- Assessments
- Skill Analytics
- Team Collaboration

---

## 💼 Workforce Modules

- Recruiter Dashboard
- Workforce Dashboard
- Hiring Portal
- Job Posting
- Applicant Tracking
- Candidate Management
- Team Management
- Recruitment Analytics
- Services Catalog

---

## 👨‍💼 Admin Modules

- Admin Dashboard
- User Management
- Course Management
- Complaint Tracking
- Certification Tracking
- Analytics
- Reports
- Platform Monitoring
- Role Management

---
=======
>>>>>>> 3053f30175176ab6205beb144ba38fb430d99ace

# 👥 User Roles

## 👨‍🎓 Student

Students can:

- Learn courses
- Solve coding problems
- Use AI Study Buddy
- Build resumes
- Practice assessments
- Track learning progress
- Follow career roadmaps
- Search for jobs
- Apply for opportunities
- Earn certificates

---

## 💼 Recruiter

Recruiters can:

- Create job postings
- Manage applicants
- View candidate profiles
- Track recruitment
- Manage hiring workflows
- Schedule interviews
- Discover skilled candidates

---

## 👨‍💻 Administrator

Administrators can:

- Manage users
- Manage courses
- Monitor platform activity
- Handle complaints
- Manage certifications
- View analytics
- Manage roles
- Monitor the overall platform

---

# 🔄 Application Workflow

```text
                         ┌─────────────────────┐
                         │   User Registration │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   Authentication    │
                         │ JWT / Google OAuth  │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │    Role Detection   │
                         └──────────┬──────────┘
                                    │
             ┌──────────────────────┼──────────────────────┐
             │                      │                      │
             ▼                      ▼                      ▼
       ┌───────────┐          ┌────────────┐        ┌───────────┐
       │  Student  │          │ Recruiter  │        │   Admin   │
       │  Portal   │          │   Portal   │        │   Panel   │
       └─────┬─────┘          └──────┬─────┘        └─────┬─────┘
             │                       │                    │
             ▼                       ▼                    ▼
       Learning Hub            Job Management       User Management
             │                       │                    │
             ▼                       ▼                    ▼
       AI Study Buddy         Candidate Tracking     Analytics
             │                       │                    │
             ▼                       ▼                    ▼
       Coding Arena             Recruitment          Platform
             │                       │                 Monitoring
             ▼                       ▼
       Career Roadmap             Hiring
             │
             ▼
       Resume Builder
             │
             ▼
       Job Applications
```

---

# 🧠 System Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                            │
│                                                             │
│ React 19 • Vite • JavaScript • React Router DOM • CSS3      │
└────────────────────────────┬────────────────────────────────┘
                             │
                             │ REST APIs
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                         BACKEND                             │
│                                                             │
│ Java 17 • Spring Boot 3.2.5 • Spring Security • Maven       │
└───────────────┬─────────────────────┬───────────────────────┘
                │                     │
                │                     │
                ▼                     ▼
       ┌────────────────┐    ┌────────────────────┐
       │ Authentication │    │    AI Services     │
       │                │    │                    │
       │ JWT            │    │ Google Gemini AI   │
       │ Google OAuth   │    │ YouTube API        │
       │ RBAC           │    │                    │
       └────────────────┘    └────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────┐
│                     DATA ACCESS LAYER                        │
│                                                             │
│ Spring Data JPA • Hibernate ORM                             │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                     DATABASE LAYER                           │
│                                                             │
│ MySQL 8.0 • Cloud Clever Database                           │
└─────────────────────────────────────────────────────────────┘
```

---

# 🚀 Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/SkillSphere-Learning-Nexus.git
```

```bash
cd SkillSphere-Learning-Nexus
```

---

# 🎨 Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

---

# ⚙️ Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Build the project:

```bash
mvn clean install
```

Run Spring Boot:

```bash
mvn spring-boot:run
```

Backend runs at:

```text
http://localhost:8080
```

---

# 🗄️ Database Configuration

Create a MySQL database:

```sql
CREATE DATABASE skillsphere;
```

Configure the database inside:

```text
backend/src/main/resources/application.properties
```

Example:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/skillsphere
spring.datasource.username=root
spring.datasource.password=your_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
```

---

# 🔐 Environment Configuration

## Frontend `.env`

Create:

```text
frontend/.env
```

Add:

```env
VITE_API_URL=http://localhost:8080/api
```

---

## Backend Configuration

Configure the following securely in your backend environment:

```properties
jwt.secret=your_secure_secret_key
```

For AI integration:

```text
GEMINI_API_KEY=your_gemini_api_key
```

For Google OAuth:

```text
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

For YouTube integration:

```text
YOUTUBE_API_KEY=your_youtube_api_key
```

> **Important:** Never commit API keys, passwords, JWT secrets, or OAuth credentials to GitHub.

---

# 🤖 AI Chatbot Workflow

Enterprise Learning Platform's AI Study Buddy follows a secure API-based workflow:

```text
┌─────────────────┐
│   User enters   │
│     message     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ React Chatbot   │
│    Interface    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Spring Boot API │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Gemini AI API   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Generated AI    │
│    Response     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ React Chatbot   │
│ displays reply  │
└─────────────────┘
```

This architecture keeps the AI integration behind the backend instead of exposing sensitive API credentials directly in the frontend.

---



# 🌟 Future Scope

Our project can be further enhanced with:

- 🤖 AI Mock Interviews
- 🎥 AI Video Interview Analysis
- 💻 Live Coding Interviews
- 💬 Real-Time Chat
- 📄 Advanced AI Resume Analyzer
- 🎮 Advanced Gamification
- 📱 Dedicated Mobile Application
- 🏢 Company & Employer Portal
- 💬 Discussion & Community Forum
- 🔔 Real-Time Notifications
- ☁️ Cloud Deployment
- 🧠 Advanced AI Mentor
- 📊 Predictive Career Analytics
- 🔎 AI-Based Candidate Matching
- 🎯 Personalized Job Recommendations
- 🔐 Advanced Security & Monitoring

---

# 🤝 Contributing

Contributions are welcome.

### 1. Fork the Repository

```bash
git fork
```

### 2. Create a Feature Branch

```bash
git checkout -b feature/NewFeature
```

### 3. Make Your Changes

Implement and test your feature.

### 4. Commit Changes

```bash
git add .
git commit -m "Added New Feature"
```

### 5. Push Changes

```bash
git push origin feature/NewFeature
```

### 6. Open a Pull Request

Create a Pull Request describing your changes.

---

# 👨‍💻 Development Team

<table align="center">

<tr>

<td align="center" width="25%">

### 🎨 Frontend Development

**Tanu Kashyap ,** **Soumitri Roy**

- React.js Development
- UI/UX Design
- Student Portal
- Workforce Portal
- Dashboard Design
- Admin Dashboard
- Responsive Interface
- Frontend Integration
- AI Chatbot Frontend Integration
- Styling
- User Experience

</td>


<td align="center" width="25%">

### ⚙️ Backend Development

**Shabira Begum**

- Spring Boot Development
- REST API Development
- Spring Security
- JWT Authentication
- Google OAuth Integration
- Backend Architecture
- Backend AI Service Integration

</td>

<td align="center" width="25%">

### 🗄️ Database Development

**Sneha Lahudkar,**
**Trisha D**

- MySQL Database
- Database Design
- Hibernate Integration
- Spring Data JPA
- Data Modeling
- Database Integration
- Database Optimization
- Cloud Database Integration
</td>

</tr>

<tr>



<td align="center" width="25%">

</td>

<td align="center" width="25%">

</td>

<td align="center" width="25%">

</td>

</tr>

</table>

---

# 🤖 AI Integration Team

| Developer | Contribution |
|-----------|--------------|
| **Soumitri Roy** | AI Chatbot Integration & Frontend Integration |
| **Shabira Begum** | Backend API Integration & AI Services |

---

# 📌 Project Responsibilities

| Module | Developer(s) |
|--------|--------------|
| 🎨 Frontend Development | **Soumitri Roy**, **Tanu Kashyap** |
| ⚙️ Backend Development | **Shabira Begum** |
| 🗄️ Database Development | **Sneha Lahudkar**, **Trisha D** |
| 💼 Admin Portal | **Tanu Kashyap** |
| 🤖 AI Chatbot Integration | **Soumitri Roy**, **Shabira Begum** |
| 🎓 Student Portal | **Soumitri Roy**, **Tanu Kashyap** |
| 💼 Workforce Portal | **Soumitri Roy** |
| 🔐 Authentication & Security | **Shabira Begum** |
| 🌐 REST API Development | **Shabira Begum** |
| 🗄️ MySQL & Hibernate | **Sneha Lahudkar**, **Trisha D** |
| ☁️ Cloud Database Integration | **Sneha Lahudkar**, **Trisha D** |
| 🎯 UI/UX Design | **Soumitri Roy**, **Tanu Kashyap** |
| 🤖 Gemini AI Integration | **Soumitri Roy**, **Shabira Begum** |

---

# 📊 Technology Architecture Summary

| Layer | Technologies |
|------|--------------|
| 🎨 Frontend | React 19, JavaScript ES6+, Vite, React Router DOM v7, Custom CSS3 |
| ⚙️ Backend | Java 17, Spring Boot 3.2.5, Spring Security, Maven |
| 🗄️ Database | MySQL 8.0, Hibernate, Spring Data JPA |
| ☁️ Cloud Storage | Cloud Clever Database |
| 🔐 Authentication | JWT, Google OAuth 2.0 |
| 🛡️ Security | Spring Security, RBAC |
| 🤖 AI | Google Gemini AI |
| ▶️ External API | YouTube API |
| 🔗 Communication | RESTful APIs |

---

# 🏆 Why SkillSphere?

SkillSphere is more than a learning management system.

It creates a complete bridge between **learning and employment**.

```text
                 ┌───────────────────┐
                 │     LEARNING      │
                 └─────────┬─────────┘
                           │
                           ▼
                 ┌───────────────────┐
                 │  SKILL BUILDING   │
                 └─────────┬─────────┘
                           │
                           ▼
                 ┌───────────────────┐
                 │     PRACTICE      │
                 └─────────┬─────────┘
                           │
                           ▼
                 ┌───────────────────┐
                 │   AI GUIDANCE     │
                 └─────────┬─────────┘
                           │
                           ▼
                 ┌───────────────────┐
                 │ CAREER PREPARATION│
                 └─────────┬─────────┘
                           │
                           ▼
                 ┌───────────────────┐
                 │    JOB SEARCH     │
                 └─────────┬─────────┘
                           │
                           ▼
                 ┌───────────────────┐
                 │     RECRUITMENT   │
                 └─────────┬─────────┘
                           │
                           ▼
                 ┌───────────────────┐
                 │     GET HIRED 🚀  │
                 └───────────────────┘
```

---

# 📜 License

This project is licensed under the **MIT License**.

---

<div align="center">

# ⭐ Enterprise Learning Platform

### Learn • Build • Practice • Grow • Get Hired 🚀

**Empowering Students • Connecting Talent • Transforming Careers**

<br>

⭐ **If you find Enterprise Learning Platform useful, consider giving this repository a Star!**

</div>
