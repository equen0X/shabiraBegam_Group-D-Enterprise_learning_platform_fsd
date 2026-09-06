import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Background from "../components/Background";
import PaperPlaneCursor from "../components/PaperPlaneCursor";
import StudentFooter from "../components/StudentFooter";
import FloatingChatbot from "../components/FloatingChatbot";
import NotificationDropdown from "../components/NotificationDropdown";
import UserAvatar from "../components/UserAvatar";

import {
  FaHome,
  FaBook,
  FaCodeBranch,
  FaCode,
  FaFileAlt,
  FaComments,
  FaAward,
  FaCertificate,
  FaChartLine,
  FaFileInvoice,
  FaBolt,
  FaTrophy,
  FaCog,
  FaSearch,
  FaBell,
  FaRobot,
  FaRocket,
  FaMapMarkedAlt,
  FaMapSigns,
  FaCheckCircle,
  FaEllipsisH,
  FaChevronRight,
  FaSun,
  FaMoon,
  FaArrowLeft,
  FaCalendarAlt,
  FaShieldAlt,
  FaMedal,
  FaArrowRight,
  FaPlay,
  FaLock,
  FaGithub,
  FaFilePdf,
  FaFilePowerpoint,
  FaUsers,
  FaCheck,
  FaRegCircle,
  FaUserFriends,
  FaRegClock,
  FaDownload,
  FaBookmark,
  FaRegBookmark,
  FaSignOutAlt
} from "react-icons/fa";

import studentHeroImg from "../assets/student_dashboard_hero_illustration.png";
import darkReactLearningHero from "../assets/dark_react_learning_hero.png";
import lightReactLearningHero from "../assets/light_react_learning_hero.png";
import jsLogoImg from "../assets/javascript_logo.svg";
import jsBadgeImg from "../assets/js_shield_badge.svg";
import reactLogoImg from "../assets/react.svg";
import "../styles/learningPaths.css";

import AppLogo from "../components/AppLogo";

export default function LearningPathsPage() {
  const { user, xp, earnXp, completeTopic, themeMode, toggleTheme, enrolledCourses, completedTopics, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      if (logout) await logout();
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
      navigate("/");
    }
  };
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const isDarkMode = themeMode === "dark";
  const [activeSubTab, setActiveSubTab] = useState("overview");

  // Learning Path Detail View State
  const [selectedPathDetail, setSelectedPathDetail] = useState(null);

  // Handle navigation from CoursesPage "Continue ->" button
  useEffect(() => {
    if (location.state) {
      const courseToPathMap = {
        "1": "JavaScript Fundamentals",
        "2": "React Developer Path",
        "3": "Python for Data Science",
        "4": "UI/UX Design Masterclass",
        "5": "Data Structures & Algorithms",
        "6": "Fullstack with Node.js",
        "7": "System Design Architecture",
        "8": "Machine Learning & AI Engineering",
        "9": "Fullstack Next.js 14 Masterclass",
        "10": "Spring Boot Microservices",
        "11": "Generative AI & LLM Engineering",
        "12": "AWS Cloud & DevOps Essentials",
        "13": "Web3 & Solidity Smart Contracts"
      };

      if (location.state.courseId) {
        const cid = location.state.courseId.toString();
        const targetTitle = courseToPathMap[cid];
        if (targetTitle) {
          setSelectedPathDetail({
            id: cid,
            title: targetTitle
          });
          return;
        }
      }

      const title = (location.state.courseTitle || "").toLowerCase();
      const prefix = (location.state.topicPrefix || "").toLowerCase();

      if (title.includes("javascript") || prefix.startsWith("js")) {
        setSelectedPathDetail({ id: "js-dev", title: "JavaScript Fundamentals", bannerType: "js", logoText: "🟨" });
      } else if (title.includes("react") || prefix.startsWith("react")) {
        setSelectedPathDetail({ id: "react-dev", title: "React Developer Path", bannerType: "react", logoText: "⚛️" });
      } else if (title.includes("python") || prefix.startsWith("py")) {
        setSelectedPathDetail({ id: "python-ds", title: "Python for Data Science", bannerType: "python", logoText: "🐍" });
      } else if (title.includes("node") || prefix.startsWith("node") || prefix.startsWith("fsd")) {
        setSelectedPathDetail({ id: "node-fs", title: "Fullstack with Node.js", bannerType: "node", logoText: "🟩" });
      } else if (title.includes("ui") || title.includes("ux") || title.includes("design") || prefix.startsWith("ui")) {
        setSelectedPathDetail({ id: "ui-ux", title: "UI/UX Design Masterclass", bannerType: "figma", logoText: "🎨" });
      } else if (title.includes("data structure") || prefix.startsWith("dsa")) {
        setSelectedPathDetail({ id: "dsa", title: "Data Structures & Algorithms", bannerType: "dsa", logoText: "⚡" });
      } else if (title.includes("next") || prefix.startsWith("next")) {
        setSelectedPathDetail({ id: "nextjs", title: "Fullstack Next.js 14 Masterclass", bannerType: "next", logoText: "▲" });
      } else if (title.includes("spring") || prefix.startsWith("spring")) {
        setSelectedPathDetail({ id: "springboot", title: "Spring Boot Microservices", bannerType: "spring", logoText: "🍃" });
      } else if (title.includes("ai") || prefix.startsWith("gen") || prefix.startsWith("ml")) {
        setSelectedPathDetail({ id: "genai", title: "Generative AI & LLM Engineering", bannerType: "ai", logoText: "🤖" });
      } else if (title.includes("aws") || title.includes("cloud") || prefix.startsWith("aws")) {
        setSelectedPathDetail({ id: "aws", title: "AWS Cloud & DevOps Essentials", bannerType: "cloud", logoText: "☁️" });
      } else if (title.includes("web3") || prefix.startsWith("web3")) {
        setSelectedPathDetail({ id: "web3", title: "Web3 & Solidity Smart Contracts", bannerType: "web3", logoText: "💎" });
      } else if (title.includes("system") || prefix.startsWith("system")) {
        setSelectedPathDetail({ id: "system", title: "System Design Architecture", bannerType: "system", logoText: "🏗️" });
      } else if (location.state.courseTitle) {
        setSelectedPathDetail({ id: "custom", title: location.state.courseTitle });
      }
    }
  }, [location.state]);

  // User identity keys for progress persistence across refreshes
  const userName = user?.full_name || user?.username || "Alex Morgan";
  const userKey = user?.email || user?.username || "alex_morgan";
  const storageKey = `skillsphere_completed_sub_lessons_${userKey}`;
  const quizStorageKey = `skillsphere_quiz_passed_${userKey}`;

  // Persistent Progress State (Loaded from localStorage)
  const [completedSubLessonIds, setCompletedSubLessonIds] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [quizPassed, setQuizPassed] = useState(() => {
    try {
      return localStorage.getItem(quizStorageKey) === "true";
    } catch (e) {
      return false;
    }
  });

  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [submittedProjects, setSubmittedProjects] = useState(["proj-1"]);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [activeProjectForModal, setActiveProjectForModal] = useState(null);
  const [projectRepoUrl, setProjectRepoUrl] = useState("");
  const [leaderboardFilter, setLeaderboardFilter] = useState("all-time");

  // Auto-save progress to localStorage on state changes
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(completedSubLessonIds));
    } catch (e) {}
  }, [completedSubLessonIds, storageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(quizStorageKey, quizPassed ? "true" : "false");
    } catch (e) {}
  }, [quizPassed, quizStorageKey]);

  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [activeSubLessonIndex, setActiveSubLessonIndex] = useState(0);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showDiscussionModal, setShowDiscussionModal] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizScore, setQuizScore] = useState(null);
  const [discussionInput, setDiscussionInput] = useState("");
  const [discussionsList, setDiscussionsList] = useState([
    { id: 1, author: "Rahul Verma", text: "Is Node.js v18+ required for React 18 create-react-app?", time: "2h ago" },
    { id: 2, author: "Ananya Iyer", text: "Great article! The JSX breakdown helped me understand element rendering.", time: "5h ago" }
  ]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  // ── Saved Paths Persistent State ──
  const [savedPathIds, setSavedPathIds] = useState(() => {
    try {
      const saved = localStorage.getItem(`skillsphere_saved_paths_${userKey}`);
      return saved ? JSON.parse(saved) : ["cloud-devops", "ml-ai"];
    } catch (e) {
      return ["cloud-devops", "ml-ai"];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(`skillsphere_saved_paths_${userKey}`, JSON.stringify(savedPathIds));
    } catch (e) {}
  }, [savedPathIds, userKey]);

  const toggleSavePath = (pathId, e) => {
    if (e) e.stopPropagation();
    if (savedPathIds.includes(pathId)) {
      setSavedPathIds(prev => prev.filter(id => id !== pathId));
      showToast("🔖 Learning path removed from Saved!");
    } else {
      setSavedPathIds(prev => [...prev, pathId]);
      showToast("🔖 Learning path saved for later!");
    }
  };

  // Unified enrolled courses calculation matching Dashboard and Courses page
  const getUnifiedEnrolledCourseIds = () => {
    let authList = (enrolledCourses || []).map(id => id.toString());
    let localList = [];
    try {
      const raw = localStorage.getItem(`enrolledCourses_${userKey}`) || localStorage.getItem(`skillsphere_enrolled_courses_${userKey}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) localList = parsed.map(id => id.toString());
      }
    } catch (e) {}
    let dbList = Array.isArray(user?.enrolled_courses) ? user.enrolled_courses.map(id => id.toString()) : [];
    const combined = Array.from(new Set([...authList, ...localList, ...dbList]));
    return combined;
  };

  const activeEnrolledIds = getUnifiedEnrolledCourseIds();

  // Dynamic learning path progress calculator based on actual user activity
  const getDynamicPathData = (prefix, courseId, fallbackPct = 0) => {
    const doneTopics = (completedTopics || []).filter(t => typeof t === 'string' && t.startsWith(prefix)).length;
    const doneSubLessons = (completedSubLessonIds || []).filter(id => typeof id === 'string' && id.startsWith(prefix)).length;
    const totalDone = doneTopics + doneSubLessons;
    const totalLessons = 12;
    const pct = totalDone > 0 ? Math.min(100, Math.round((totalDone / totalLessons) * 100)) : fallbackPct;
    const completedModsCount = Math.min(6, Math.floor((pct / 100) * 6));

    const isEnrolled = activeEnrolledIds.includes(courseId.toString());

    let status = "in-progress";
    let statusText = "Not Started";
    let actionText = "Start Learning";
    let lastAccessed = "Not Started";

    if (pct === 100) {
      status = "completed";
      statusText = "Completed";
      actionText = "Review Track";
      lastAccessed = "Recently";
    } else if (pct > 0) {
      status = "in-progress";
      statusText = "In Progress";
      actionText = "Continue Learning";
      lastAccessed = "Today";
    }

    return {
      progress: pct,
      completedModules: `${completedModsCount}/6`,
      modules: `${completedModsCount}/6`,
      status,
      statusText,
      actionText,
      lastAccessed,
      isEnrolled
    };
  };

  // Master Learning Paths Dataset covering all enrolled courses
  const allLearningPaths = [
    {
      id: "js-dev",
      title: "JavaScript Fundamentals",
      levelInfo: "Beginner • 6 Modules • 35.4K Learners",
      bannerType: "js",
      logoBg: "#FEF9C3",
      logoText: "🟨 JS",
      progressColor: "#F59E0B",
      ...getDynamicPathData("js_", "1", 0)
    },
    {
      id: "react-dev",
      title: "React Developer Path",
      levelInfo: "Intermediate • 6 Modules • 24.5K Learners",
      bannerType: "react",
      logoBg: "#E0F2FE",
      logoText: "⚛️",
      progressColor: "#F9572A",
      ...getDynamicPathData("1-", "2", 0)
    },
    {
      id: "python-ds",
      title: "Python for Data Science",
      levelInfo: "Beginner • 6 Modules • 18.7K Learners",
      bannerType: "python",
      logoBg: "#FEF3C7",
      logoText: "🐍",
      progressColor: "#3B82F6",
      ...getDynamicPathData("py-", "3", 0)
    },
    {
      id: "node-fs",
      title: "Fullstack with Node.js",
      levelInfo: "Intermediate • 6 Modules • 12.1K Learners",
      bannerType: "node",
      logoBg: "#DCFCE7",
      logoText: "🟩 Node.js",
      progressColor: "#10B981",
      ...getDynamicPathData("node-", "6", 0)
    },
    {
      id: "ui-ux",
      title: "UI/UX Design Masterclass",
      levelInfo: "Beginner • 6 Modules • 9.8K Learners",
      bannerType: "figma",
      logoBg: "#FEE2E2",
      logoText: "🎨",
      progressColor: "#10B981",
      ...getDynamicPathData("ui-", "4", 0)
    },
    {
      id: "dsa",
      title: "Data Structures & Algorithms",
      levelInfo: "Intermediate • 6 Modules • 28.3K Learners",
      bannerType: "dsa",
      logoBg: "#EDE9FE",
      logoText: "⚡ DSA",
      progressColor: "#8B5CF6",
      ...getDynamicPathData("dsa_", "5", 0)
    },
    {
      id: "nextjs",
      title: "Fullstack Next.js 14 Masterclass",
      levelInfo: "Advanced • 6 Modules • 15.6K Learners",
      bannerType: "next",
      logoBg: "#F3F4F6",
      logoText: "▲ Next.js",
      progressColor: "#111827",
      ...getDynamicPathData("nextjs_", "9", 0)
    },
    {
      id: "springboot",
      title: "Spring Boot Microservices",
      levelInfo: "Advanced • 6 Modules • 11.4K Learners",
      bannerType: "spring",
      logoBg: "#DCFCE7",
      logoText: "🍃 Spring",
      progressColor: "#10B981",
      ...getDynamicPathData("springboot_", "10", 0)
    },
    {
      id: "genai",
      title: "Generative AI & LLM Engineering",
      levelInfo: "Advanced • 6 Modules • 19.8K Learners",
      bannerType: "ai",
      logoBg: "#F3E8FF",
      logoText: "🤖 GenAI",
      progressColor: "#A855F7",
      ...getDynamicPathData("genai_", "11", 0)
    },
    {
      id: "cloud-devops",
      title: "AWS Cloud & DevOps Essentials",
      levelInfo: "Advanced • 8 Modules • 14.2K Learners",
      bannerType: "cloud",
      logoBg: "#E0E7FF",
      logoText: "☁️ AWS",
      progressColor: "#6366F1",
      ...getDynamicPathData("aws_", "12", 0)
    },
    {
      id: "web3",
      title: "Web3 & Solidity Smart Contracts",
      levelInfo: "Advanced • 6 Modules • 8.9K Learners",
      bannerType: "web3",
      logoBg: "#FEF3C7",
      logoText: "💎 Web3",
      progressColor: "#F59E0B",
      ...getDynamicPathData("web3_", "13", 0)
    },
    {
      id: "system",
      title: "System Design Architecture",
      levelInfo: "Advanced • 6 Modules • 22.1K Learners",
      bannerType: "system",
      logoBg: "#E0F2FE",
      logoText: "🏗️ System",
      progressColor: "#0284C7",
      ...getDynamicPathData("system_", "7", 0)
    }
  ];

  // Dynamic filter computation
  const filteredLearningPaths = allLearningPaths.filter(path => {
    if (filter === "all") return path.isEnrolled;
    if (filter === "in-progress") return path.isEnrolled && path.status === "in-progress";
    if (filter === "completed") return path.isEnrolled && path.status === "completed";
    if (filter === "saved") return savedPathIds.includes(path.id);
    return true;
  });

  // Handle auto-opening Learning Path when navigating from CoursesPage
  useEffect(() => {
    if (location.state?.courseId) {
      const cid = location.state.courseId.toString();
      const courseToPathMap = {
        "1": "JavaScript Fundamentals",
        "2": "React Developer Path",
        "3": "Python for Data Science",
        "4": "UI/UX Design Masterclass",
        "5": "Data Structures & Algorithms",
        "6": "Fullstack with Node.js",
        "7": "System Design Architecture",
        "8": "Machine Learning & AI Engineering",
        "9": "Fullstack Next.js 14 Masterclass",
        "10": "Spring Boot Microservices",
        "11": "Generative AI & LLM Engineering",
        "12": "AWS Cloud & DevOps Essentials",
        "13": "Web3 & Solidity Smart Contracts"
      };
      const targetPathTitle = courseToPathMap[cid] || "JavaScript Fundamentals";
      setSelectedPathDetail(targetPathTitle);
    }
  }, [location.state]);

  const sortedLearningPaths = [...filteredLearningPaths].sort((a, b) => {
    if (sortBy === "progress") return b.progress - a.progress;
    return 0;
  });

  const enrolledCount = allLearningPaths.filter(p => p.isEnrolled).length;
  const inProgressCount = allLearningPaths.filter(p => p.isEnrolled && p.status === "in-progress").length;
  const completedCount = allLearningPaths.filter(p => p.isEnrolled && p.status === "completed").length;
  const savedCount = savedPathIds.length;

  const modulesList = [
    {
      id: 1,
      num: 1,
      subtitle: "React Introduction",
      title: "Module 1: React Introduction & Environment Setup",
      instructor: "Hitesh Choudhary",
      lessons: [
        {
          id: "1-1",
          title: "1.1 Overview & Why React?",
          type: "reading",
          duration: "5 min read",
          source: "GeeksforGeeks & React Official Docs",
          heading: "Introduction to React.js",
          text: "React is a free and open-source front-end JavaScript library created by Meta (Facebook) for building user interfaces based on components. It lets you compose complex UIs from small and isolated pieces of code called 'components'.",
          codeSnippet: `// Example: A Simple React Functional Component
import React from 'react';

function WelcomeMessage(props) {
  return (
    <div className="welcomeBox">
      <h1>Hello, {props.username}! Welcome to SkillSphere 🚀</h1>
      <p>Your interactive React journey begins here.</p>
    </div>
  );
}

export default WelcomeMessage;`,
          keyPoints: [
            "Declarative UI: Design simple views for each state in your application.",
            "Component-Based: Build encapsulated components that manage their own state.",
            "Virtual DOM: React maintains an in-memory DOM representation to maximize render speed.",
            "Learn Once, Write Anywhere: Develop web apps with React & mobile apps with React Native."
          ]
        },
        {
          id: "1-2",
          title: "1.2 Node.js & npm Environment Setup",
          type: "reading",
          duration: "8 min read",
          source: "GeeksforGeeks Setup Guide",
          heading: "Setting Up Node.js, npm & Vite Dev Server",
          text: "To build React applications locally, Node.js and npm (Node Package Manager) are required to manage dependencies and execute local server builds.",
          codeSnippet: `// 1. Check Node.js and npm versions in terminal:
node -v
npm -v

// 2. Initialize a high-speed React app using Vite:
npm create vite@latest my-react-app -- --template react

// 3. Install dependencies and start development server:
cd my-react-app
npm install
npm run dev

// Access local server at: http://localhost:5173`,
          keyPoints: [
            "Node.js runs JavaScript on server-side and powers React build tools.",
            "npm installs libraries like React, React-DOM, React-Router, and Axios.",
            "Vite provides instant Hot Module Replacement (HMR) during coding."
          ]
        },
        {
          id: "1-3",
          title: "1.3 Understanding React Directory Structure",
          type: "reading",
          duration: "6 min read",
          source: "React Architecture Docs",
          heading: "Project Directory & Entry Points",
          text: "Understanding the project tree is essential. React mounts components into an HTML root element via ReactDOM inside src/main.jsx.",
          codeSnippet: `// File Structure:
// my-react-app/
// ├── public/          <- Static assets (favicon, images)
// ├── src/             <- Source code
// │   ├── assets/      <- Images and SVGs
// │   ├── components/  <- Reusable UI Components
// │   ├── App.jsx      <- Main App Container
// │   ├── main.jsx     <- Entry point mounting App to #root
// │   └── index.css    <- Global CSS rules
// ├── index.html       <- Root HTML with <div id="root"></div>
// └── package.json     <- Dependencies list

// src/main.jsx Entry Point:
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`,
          keyPoints: [
            "index.html contains single <div id='root'></div> container.",
            "ReactDOM.createRoot() connects JavaScript logic to DOM.",
            "React.StrictMode checks for deprecated methods in development."
          ]
        },
        {
          id: "1-4",
          title: "1.4 Creating Your First React Element",
          type: "reading",
          duration: "7 min read",
          source: "GeeksforGeeks React Tutorial",
          heading: "Building Reusable Components & Props",
          text: "Components accept arbitrary inputs called 'props' (properties) and return React elements describing what should appear on the screen.",
          codeSnippet: `import React from 'react';

// Functional Component accepting props
export default function StudentCard({ name, course, xp }) {
  return (
    <div style={{ padding: '16px', background: '#FFF0EB', borderRadius: '12px' }}>
      <h3 style={{ color: '#F9572A' }}>Learner: {name}</h3>
      <p>Track: {course}</p>
      <span>⚡ XP Scored: {xp}</span>
    </div>
  );
}

// Invoking Component in App.jsx:
// <StudentCard name="Alex Morgan" course="React Developer" xp={650} />`,
          keyPoints: [
            "Props are read-only and immutable by the child component.",
            "Use ES6 Destructuring ({ name, course }) for clean syntax.",
            "Always return a single root element or React Fragment (<>...</>)."
          ]
        },
        {
          id: "1-5",
          title: "1.5 Video Tutorial: React Intro Masterclass",
          type: "video",
          duration: "15 min video",
          source: "Masterclass Video by Hitesh Choudhary",
          heading: "React Introduction & Setup Walkthrough",
          videoUrl: "https://www.youtube.com/embed/bMknfKXIFA8?autoplay=1",
          description: "Watch the full hands-on video tutorial covering React setup, Virtual DOM diffing, and live project initialization.",
          keyPoints: [
            "Hands-on live coding demonstration",
            "Setting up React environment from scratch",
            "Debugging initial setup issues in Chrome DevTools"
          ]
        }
      ]
    },
    {
      id: 2,
      num: 2,
      subtitle: "React JSX Syntax",
      title: "Module 2: React JSX Syntax & Element Rendering",
      instructor: "Hitesh Choudhary",
      lessons: [
        {
          id: "2-1",
          title: "2.1 What is JSX Syntax?",
          type: "reading",
          duration: "5 min read",
          source: "GeeksforGeeks React JSX",
          heading: "Understanding JSX (JavaScript XML)",
          text: "JSX stands for JavaScript XML. It allows us to write HTML in React and place HTML elements in the DOM without any createElement() or appendChild() methods.",
          codeSnippet: `// With JSX:
const element = <h1>Hello, SkillSphere!</h1>;

// Without JSX (Compiled by Babel):
const element = React.createElement('h1', null, 'Hello, SkillSphere!');`,
          keyPoints: [
            "JSX converts HTML tags into React elements.",
            "Babel compiles JSX into React.createElement() calls.",
            "Must use className instead of class for CSS rules."
          ]
        },
        {
          id: "2-2",
          title: "2.2 Embedding Expressions in JSX",
          type: "reading",
          duration: "6 min read",
          source: "React Docs",
          heading: "Dynamic Expression Evaluation in {}",
          text: "You can put any valid JavaScript expression inside curly braces {} in JSX. This includes variables, function calls, arithmetic operations, and ternaries.",
          codeSnippet: `const user = { firstName: 'Alex', lastName: 'Morgan', xp: 820 };

function formatName(user) {
  return user.firstName + ' ' + user.lastName;
}

const element = (
  <div>
    <h2>Welcome, {formatName(user)}!</h2>
    <p>Status: {user.xp > 500 ? "Pro Learner 🔥" : "Beginner"}</p>
  </div>
);`,
          keyPoints: [
            "Use {} to evaluate variables and dynamic expressions.",
            "Ternary operator (condition ? true : false) works inside {}.",
            "Booleans, null, and undefined are valid children (render nothing)."
          ]
        },
        {
          id: "2-3",
          title: "2.3 Attributes & Inline Styles in JSX",
          type: "reading",
          duration: "6 min read",
          source: "GeeksforGeeks React Styling",
          heading: "JSX Attributes & camelCase Properties",
          text: "JSX uses camelCase property naming convention instead of HTML attribute names (e.g. onClick, onChange, tabIndex). Inline styles use JavaScript objects.",
          codeSnippet: `const cardStyle = {
  backgroundColor: '#0F172A',
  color: '#FFFFFF',
  padding: '20px',
  borderRadius: '16px'
};

const element = (
  <div style={cardStyle} onClick={() => alert('Card clicked!')}>
    <img src="avatar.png" alt="Avatar" className="userAvatar" />
  </div>
);`,
          keyPoints: [
            "Use camelCase for all attributes (htmlFor, className, onClick).",
            "Inline styles use JavaScript objects with camelCase keys (backgroundColor).",
            "Quote string values ('avatar.png') and use {} for JS values."
          ]
        },
        {
          id: "2-4",
          title: "2.4 Conditional Rendering in JSX",
          type: "reading",
          duration: "7 min read",
          source: "GeeksforGeeks Conditional Rendering",
          heading: "Rendering Elements Conditionally",
          text: "In React, you can create distinct components that encapsulate behavior you need. Then, render only some of them depending on state using && or ternaries.",
          codeSnippet: `function NotificationBadge({ unreadCount }) {
  return (
    <div className="notifContainer">
      <span>Inbox</span>
      {unreadCount > 0 && (
        <span className="badgeCount">{unreadCount}</span>
      )}
    </div>
  );
}`,
          keyPoints: [
            "Use logical && operator for short-circuit conditional rendering.",
            "Use ternary (condition ? <TrueView /> : <FalseView />) for binary choices.",
            "Prevent rendering by returning null from component."
          ]
        },
        {
          id: "2-5",
          title: "2.5 Video Tutorial: Master JSX & Rendering",
          type: "video",
          duration: "18 min video",
          source: "Masterclass Video by Hitesh Choudhary",
          heading: "JSX Deep Dive & Dynamic Rendering Video",
          videoUrl: "https://www.youtube.com/embed/SqcY0GlETPk?autoplay=1",
          description: "Watch hands-on video demonstration covering Babel compilation, JSX rules, and conditional rendering techniques.",
          keyPoints: [
            "Understanding Babel transpilation under the hood",
            "Common JSX syntax pitfalls and solutions",
            "Building dynamic list rendering with .map()"
          ]
        }
      ]
    },
    {
      id: 3,
      num: 3,
      subtitle: "Functional Components",
      title: "Module 3: Functional Components & Composition",
      instructor: "Hitesh Choudhary",
      lessons: [
        {
          id: "3-1",
          title: "3.1 Functional vs Class Components",
          type: "reading",
          duration: "6 min read",
          source: "GeeksforGeeks React Components",
          heading: "Modern Functional Components",
          text: "Functional components are simple JavaScript functions that return JSX. With React Hooks (v16.8+), functional components can handle state, side-effects, and lifecycle events.",
          codeSnippet: `// Modern Functional Component
import React from 'react';

export default function HeaderBar({ title }) {
  return <header><h1>{title}</h1></header>;
}`,
          keyPoints: [
            "Functional components are plain JS functions returning JSX.",
            "Simpler, cleaner code with less boilerplate than class components.",
            "Recommended standard by React team for modern web apps."
          ]
        },
        {
          id: "3-2",
          title: "3.2 Component Composition Patterns",
          type: "reading",
          duration: "7 min read",
          source: "React Docs Pattern Guide",
          heading: "Building Complex UIs via Composition",
          text: "React has a powerful composition model. We recommend using composition instead of inheritance to reuse code between components.",
          codeSnippet: `function CardContainer(props) {
  return (
    <div className="customCard">
      {props.children}
    </div>
  );
}

// Usage:
// <CardContainer><p>Custom Content Inside Card</p></CardContainer>`,
          keyPoints: [
            "Use props.children to pass child elements into container components.",
            "Compose atomic components (Buttons, Inputs) into larger feature blocks.",
            "Keep components small, focused, and single-responsibility."
          ]
        },
        {
          id: "3-3",
          title: "3.3 Props Default Values & Prop Types",
          type: "reading",
          duration: "5 min read",
          source: "GeeksforGeeks React Props",
          heading: "Default Props & Type Checking",
          text: "Default parameters let you specify default values for props if none are passed from parent components.",
          codeSnippet: `function UserBadge({ role = "Student", status = "Active" }) {
  return <span>{role} ({status})</span>;
}`,
          keyPoints: [
            "Use ES6 default parameter syntax for fallback prop values.",
            "Prevents undefined errors when rendering missing data.",
            "Enhances component robustness across different pages."
          ]
        },
        {
          id: "3-4",
          title: "3.4 List Rendering with .map() and Keys",
          type: "reading",
          duration: "8 min read",
          source: "GeeksforGeeks Lists & Keys",
          heading: "Rendering Dynamic Arrays with Keys",
          text: "You can build collections of elements and include them in JSX using curly braces {}. The JavaScript Array .map() method transforms data arrays into UI components.",
          codeSnippet: `const courses = [
  { id: 101, title: 'React Basics' },
  { id: 102, title: 'Node.js API' }
];

function CourseList() {
  return (
    <ul>
      {courses.map(course => (
        <li key={course.id}>{course.title}</li>
      ))}
    </ul>
  );
}`,
          keyPoints: [
            "Keys help React identify which items have changed, been added, or removed.",
            "Keys must be unique string/number IDs among siblings.",
            "Avoid using array index as key when items can reorder."
          ]
        },
        {
          id: "3-5",
          title: "3.5 Video Masterclass: Component Design",
          type: "video",
          duration: "20 min video",
          source: "Masterclass Video by Hitesh Choudhary",
          heading: "Functional Component & List Rendering Masterclass",
          videoUrl: "https://www.youtube.com/embed/eCU7F_iaOwM?autoplay=1",
          description: "Watch hands-on video on component architecture, prop drilling, and rendering dynamic list items.",
          keyPoints: [
            "Live coding refactoring class component to functional component",
            "Deep dive into props passing and composition",
            "Handling list key warnings in React DevTools"
          ]
        }
      ]
    },
    {
      id: 4,
      num: 4,
      subtitle: "State & Props",
      title: "Module 4: State Management & Props Data Flow",
      instructor: "Hitesh Choudhary",
      lessons: [
        {
          id: "4-1",
          title: "4.1 Introduction to useState Hook",
          type: "reading",
          duration: "7 min read",
          source: "GeeksforGeeks useState Hook",
          heading: "Managing Component State with useState",
          text: "State is a built-in React object used to contain data or information about the component. A component's state can change over time; whenever it changes, the component re-renders.",
          codeSnippet: `import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Current Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}`,
          keyPoints: [
            "useState returns a pair: the current state value and a function to update it.",
            "State updates trigger component re-render asynchronously.",
            "Never mutate state directly (count = count + 1); always use setter function."
          ]
        },
        {
          id: "4-2",
          title: "4.2 Handling User Input & Events",
          type: "reading",
          duration: "8 min read",
          source: "React Event Handling Docs",
          heading: "Event Listeners & Form Controls",
          text: "Handling events with React elements is very similar to handling events on DOM elements. SyntheticEvents normalize cross-browser behavior.",
          codeSnippet: `function SearchBox() {
  const [query, setQuery] = useState('');

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  return (
    <input 
      type="text" 
      value={query} 
      onChange={handleChange} 
      placeholder="Search lessons..." 
    />
  );
}`,
          keyPoints: [
            "React events use camelCase naming (onChange, onSubmit).",
            "Pass event handler functions, not strings.",
            "Call e.preventDefault() to stop page reload on form submit."
          ]
        },
        {
          id: "4-3",
          title: "4.3 Controlled vs Uncontrolled Inputs",
          type: "reading",
          duration: "6 min read",
          source: "GeeksforGeeks React Forms",
          heading: "Controlled Components Pattern",
          text: "In a controlled component, form data is handled by a React component state. The input value is driven by React state.",
          codeSnippet: `function LoginForm() {
  const [form, setForm] = useState({ email: '', password: '' });

  const updateField = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <form>
      <input name="email" value={form.email} onChange={updateField} />
      <input name="password" type="password" value={form.password} onChange={updateField} />
    </form>
  );
}`,
          keyPoints: [
            "Controlled inputs ensure single source of truth in state.",
            "Use spread operator ({...form}) to update multi-field forms.",
            "Uncontrolled inputs rely on DOM refs (useRef)."
          ]
        },
        {
          id: "4-4",
          title: "4.4 Lifting State Up to Common Parent",
          type: "reading",
          duration: "8 min read",
          source: "GeeksforGeeks Lifting State Up",
          heading: "Sharing State Between Sister Components",
          text: "Often, several components need to reflect the same changing data. We recommend lifting the shared state up to their closest common ancestor.",
          codeSnippet: `function ParentContainer() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div>
      <TabHeader activeTab={activeTab} onSelectTab={setActiveTab} />
      <TabContent activeTab={activeTab} />
    </div>
  );
}`,
          keyPoints: [
            "Move state up to lowest common parent of components needing it.",
            "Pass state down as props and setter callbacks down as handlers.",
            "Keeps data flow unidirectional (top-down)."
          ]
        },
        {
          id: "4-5",
          title: "4.5 Video Masterclass: State Management",
          type: "video",
          duration: "22 min video",
          source: "Masterclass Video by Hitesh Choudhary",
          heading: "useState & Form State Deep Dive Video",
          videoUrl: "https://www.youtube.com/embed/4UZrsTqkcW4?autoplay=1",
          description: "Watch comprehensive video tutorial on useState hook, complex object state updates, and lifting state up.",
          keyPoints: [
            "Live coding stateful counter & interactive forms",
            "Handling batch state updates and functional updates setCount(prev => prev + 1)",
            "Avoiding infinite re-render traps"
          ]
        }
      ]
    },
    {
      id: 5,
      num: 5,
      subtitle: "React Hooks (useEffect)",
      title: "Module 5: React Hooks & Side Effects (useEffect)",
      instructor: "Hitesh Choudhary",
      lessons: [
        {
          id: "5-1",
          title: "5.1 Introduction to useEffect Hook",
          type: "reading",
          duration: "8 min read",
          source: "GeeksforGeeks useEffect Hook",
          heading: "Managing Side Effects in Functional Components",
          text: "Side effects are operations that reach outside the component (e.g. API data fetching, timers, manual DOM mutations, subscriptions). useEffect handles these in React.",
          codeSnippet: `import React, { useState, useEffect } from 'react';

function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    document.title = \`Elapsed: \${seconds}s\`;
  }, [seconds]);

  return <p>Timer: {seconds}s</p>;
}`,
          keyPoints: [
            "useEffect runs after every render by default.",
            "Dependency array controls when the effect re-runs.",
            "Replaces componentDidMount, componentDidUpdate, and componentWillUnmount."
          ]
        },
        {
          id: "5-2",
          title: "5.2 Dependency Array Rules & Pitfalls",
          type: "reading",
          duration: "7 min read",
          source: "React Docs Effect Dependencies",
          heading: "Mastering the Dependency Array []",
          text: "The second argument of useEffect specifies array of dependencies. It dictates when React should trigger or skip the effect function.",
          codeSnippet: `// 1. No dependency array: Runs on EVERY render
useEffect(() => { console.log('Rendered'); });

// 2. Empty array []: Runs ONCE on mount (like componentDidMount)
useEffect(() => { console.log('Mounted'); }, []);

// 3. With dependencies [value]: Runs on mount + whenever value changes
useEffect(() => { console.log('Value changed'); }, [value]);`,
          keyPoints: [
            "Always include all reactive values (props, state) referenced in effect.",
            "Empty [] is ideal for initial API fetching on mount.",
            "Omitting dependency array can cause infinite loop crashes."
          ]
        },
        {
          id: "5-3",
          title: "5.3 Fetching API Data with useEffect & Axios",
          type: "reading",
          duration: "9 min read",
          source: "GeeksforGeeks API Fetching",
          heading: "Asynchronous Data Fetching Pattern",
          text: "Fetching data from REST APIs is the most common use case for useEffect. Combine with state for loading spinners and error handling.",
          codeSnippet: `function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading users...</p>;
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}`,
          keyPoints: [
            "Always track loading and error state for user feedback.",
            "Effect callback function cannot be directly async; define inner async function.",
            "Clean up pending requests using AbortController when unmounting."
          ]
        },
        {
          id: "5-4",
          title: "5.4 Cleanup Functions & Subscriptions",
          type: "reading",
          duration: "7 min read",
          source: "GeeksforGeeks Effect Cleanup",
          heading: "Cleaning Up Side Effects",
          text: "Some effects require cleanup to prevent memory leaks (e.g. setInterval, event listeners, WebSocket connections). Return a cleanup function from effect.",
          codeSnippet: `useEffect(() => {
  const handleResize = () => setWindowWidth(window.innerWidth);
  window.addEventListener('resize', handleResize);

  // Return Cleanup Function:
  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []);`,
          keyPoints: [
            "Return function from useEffect to execute cleanup on unmount.",
            "Cleanup runs before the component is removed from UI.",
            "Essential for clearing setTimeouts and event listeners."
          ]
        },
        {
          id: "5-5",
          title: "5.5 Video Masterclass: useEffect & API Fetching",
          type: "video",
          duration: "25 min video",
          source: "Masterclass Video by Hitesh Choudhary",
          heading: "useEffect Hook & Async API Data Fetching Video",
          videoUrl: "https://www.youtube.com/embed/0riHps91AzE?autoplay=1",
          description: "Watch complete video tutorial on useEffect lifecycle, fetching data from backend REST endpoints, and avoiding memory leaks.",
          keyPoints: [
            "Building a real-world API data fetcher component live",
            "Debugging infinite re-render loops with dependency arrays",
            "Implementing search debouncing with custom hooks"
          ]
        }
      ]
    },
    {
      id: 6,
      num: 6,
      subtitle: "React Component Lifecycle",
      title: "Module 6: Component Lifecycle & Optimization",
      instructor: "Hitesh Choudhary",
      lessons: [
        {
          id: "6-1",
          title: "6.1 React Render Cycle & Virtual DOM",
          type: "reading",
          duration: "8 min read",
          source: "GeeksforGeeks Virtual DOM",
          heading: "How React Renders Components",
          text: "React renders UI in two phases: Render Phase (computes Virtual DOM tree changes) and Commit Phase (applies DOM updates).",
          codeSnippet: `// Virtual DOM Reconciliation:
// 1. State changes -> React builds new Virtual DOM tree.
// 2. Diffing algorithm compares new tree with previous tree.
// 3. Reconciliation computes minimum DOM mutations.
// 4. Batch updates executed in Real DOM.`,
          keyPoints: [
            "Diffing algorithm operates in O(n) heuristic complexity.",
            "Component re-renders whenever props or state change.",
            "Parent re-render causes all children to re-render by default."
          ]
        },
        {
          id: "6-2",
          title: "6.2 Memoization with React.memo()",
          type: "reading",
          duration: "7 min read",
          source: "React Performance Guide",
          heading: "Preventing Unnecessary Child Re-renders",
          text: "React.memo is a higher order component. If your component renders the same result given the same props, you can wrap it in React.memo for a performance boost.",
          codeSnippet: `import React from 'react';

const ExpensiveChild = React.memo(function ExpensiveChild({ name }) {
  console.log('Child Rendered');
  return <div>{name}</div>;
});

export default ExpensiveChild;`,
          keyPoints: [
            "React.memo shallowly compares props object.",
            "Skips re-rendering if props haven't changed.",
            "Ideal for large lists and heavy charts."
          ]
        },
        {
          id: "6-3",
          title: "6.3 Optimization with useCallback & useMemo",
          type: "reading",
          duration: "8 min read",
          source: "GeeksforGeeks useMemo & useCallback",
          heading: "Caching Functions & Heavy Computations",
          text: "useMemo caches the result of a calculation between renders. useCallback caches a function definition between renders.",
          codeSnippet: `// Cache expensive calculation:
const cachedValue = useMemo(() => computeHeavyFilter(items), [items]);

// Cache callback reference passed to React.memo child:
const handleClick = useCallback(() => {
  console.log('Button clicked');
}, []);`,
          keyPoints: [
            "useMemo returns cached result value.",
            "useCallback returns cached function reference.",
            "Prevents breaking React.memo shallow prop comparison."
          ]
        },
        {
          id: "6-4",
          title: "6.4 Code Splitting & React.lazy()",
          type: "reading",
          duration: "7 min read",
          source: "GeeksforGeeks Code Splitting",
          heading: "Dynamic Imports & Suspense",
          text: "Code-splitting helps lazy-load just the things currently needed by the user, dramatically improving bundle load speed.",
          codeSnippet: `import React, { Suspense, lazy } from 'react';

const HeavyChart = lazy(() => import('./HeavyChart.jsx'));

function AnalyticsDashboard() {
  return (
    <Suspense fallback={<div>Loading Chart...</div>}>
      <HeavyChart />
    </Suspense>
  );
}`,
          keyPoints: [
            "React.lazy() dynamically imports components on demand.",
            "Wrap lazy components in <Suspense fallback={<Spinner />}>.",
            "Reduces initial JavaScript bundle size significantly."
          ]
        },
        {
          id: "6-5",
          title: "6.5 Video Masterclass: Optimization Masterclass",
          type: "video",
          duration: "25 min video",
          source: "Masterclass Video by Hitesh Choudhary",
          heading: "React Performance & Profiler Optimization Video",
          videoUrl: "https://www.youtube.com/embed/l8n_pU57GQI?autoplay=1",
          description: "Watch complete video tutorial on profiling React re-renders, using React.memo, useCallback, useMemo, and bundle splitting.",
          keyPoints: [
            "Using React DevTools Profiler to find slow components",
            "Benchmarking memoization performance gains",
            "Best practices for production deployment"
          ]
        }
      ]
    }
  ];



  // Dynamic module generator for any course title fallback
  const generateModulesForCourse = (title) => {
    const t = (title || "Course").toLowerCase();
    let topic = "Core Concepts";
    if (t.includes("javascript") || t.includes("js")) topic = "JavaScript ES6+";
    else if (t.includes("python")) topic = "Python Data Science";
    else if (t.includes("react")) topic = "React Development";
    else if (t.includes("node")) topic = "Node.js Architecture";
    else if (t.includes("design") || t.includes("ui")) topic = "UI/UX Figma";
    else if (t.includes("spring")) topic = "Spring Boot Microservices";
    else if (t.includes("next")) topic = "Next.js 14 App Router";
    else if (t.includes("ai")) topic = "Generative AI & LLMs";
    else if (t.includes("aws") || t.includes("cloud")) topic = "AWS Cloud Services";
    else if (t.includes("web3")) topic = "Solidity Smart Contracts";
    else if (t.includes("structure") || t.includes("dsa")) topic = "Algorithms & Data Structures";

    return [
      {
        id: 1, num: 1, subtitle: `${topic} Foundations`, title: `Module 1: ${title} Foundations & Setup`, instructor: "SkillSphere Academic Team",
        lessons: [
          { id: `c-1-1`, title: "1.1 Architecture & Overview", type: "reading", duration: "6 min read", source: "SkillSphere Docs", heading: `Introduction to ${title}`, text: `Welcome to ${title}! Learn core concepts, setup requirements, and fundamental architectural principles.`, codeSnippet: `// Welcome to ${title}\nconsole.log("Initializing ${title} module...");`, keyPoints: ["Core architecture breakdown", "Environment setup", "Best coding practices"] },
          { id: `c-1-2`, title: "1.2 Practical Implementation", type: "reading", duration: "8 min read", source: "SkillSphere Docs", heading: `Hands-on ${title} Implementation`, text: `Practical walk-through building modules, components, and services with ${title}.`, codeSnippet: `// ${title} Code Example\nfunction runCourse() {\n  return "Successfully executing ${title}";\n}`, keyPoints: ["Hands-on code exercise", "Syntax & conventions", "Debugging patterns"] }
        ]
      },
      {
        id: 2, num: 2, subtitle: `${topic} Advanced`, title: `Module 2: Advanced ${title} Architecture`, instructor: "SkillSphere Academic Team",
        lessons: [
          { id: `c-2-1`, title: "2.1 Advanced Concepts & Optimization", type: "reading", duration: "8 min read", source: "SkillSphere Docs", heading: `Advanced ${title} Design Patterns`, text: `Master production-level optimizations, state management, and security patterns for ${title}.`, codeSnippet: `// Advanced ${title} Pattern\nconst system = { track: "${title}", status: "Production Ready" };`, keyPoints: ["Performance tuning", "Security best practices", "Scalability considerations"] }
        ]
      },
      {
        id: 3, num: 3, subtitle: `${topic} Masterclass`, title: `Module 3: ${title} End-to-End Masterclass Video`, instructor: "SkillSphere Academic Team",
        lessons: [
          { id: `c-3-1`, title: "3.1 Complete Video Walkthrough", type: "video", duration: "25 min video", source: "SkillSphere Masterclass", heading: `${title} Video Demonstration`, videoUrl: "https://www.youtube.com/embed/bMknfKXIFA8?autoplay=1", description: `Watch comprehensive video tutorial demonstrating real-world project development using ${title}.`, keyPoints: ["Live coding walkthrough", "Building production features", "Project deployment"] }
        ]
      }
    ];
  };

  const allPathDataMap = {
    "JavaScript Fundamentals": {
      logo: "🟨",
      title: "JavaScript Fundamentals",
      subtitle: "Master ES6+ JavaScript, DOM manipulation, closures, and asynchronous programming.",
      instructor: "Hitesh Choudhary & Akshay Saini",
      modules: [
        {
          id: 1, num: 1, subtitle: "JS Core Syntax", title: "Module 1: JavaScript Basics, Variables & Scope", instructor: "Akshay Saini",
          lessons: [
            { id: "js-1-1", title: "1.1 Overview of JavaScript & Engines", type: "reading", duration: "5 min read", source: "MDN Web Docs", heading: "Introduction to JavaScript & V8 Engine", text: "JavaScript is a high-level, interpreted programming language with first-class functions powering dynamic web applications.", codeSnippet: `console.log("Hello, SkillSphere JavaScript Learner!");\n\n// Variable declarations in ES6:\nlet studentName = "Alex Morgan";\nconst xpPoints = 750;\nvar legacyScope = "Global";`, keyPoints: ["Primitive & reference types", "V8 / SpiderMonkey JS engines", "let vs const vs var scoping rules"] },
            { id: "js-1-2", title: "1.2 Hoisting, Execution Context & Call Stack", type: "reading", duration: "7 min read", source: "Namaste JavaScript Guide", heading: "Execution Context & Hoisting", text: "Everything in JS happens inside an Execution Context. Before code runs, JS engine allocates memory for variables and functions.", codeSnippet: `getName(); // Output: "Namaste JS"\nconsole.log(x); // Output: undefined\n\nvar x = 7;\nfunction getName() {\n  console.log("Namaste JS");\n}`, keyPoints: ["Memory creation vs Code execution phase", "Variable hoisting behavior", "Call Stack execution order"] }
          ]
        },
        {
          id: 2, num: 2, subtitle: "Functions & Closures", title: "Module 2: Functions, First-Class Citizens & Closures", instructor: "Akshay Saini",
          lessons: [
            { id: "js-2-1", title: "2.1 Functions & Arrow Functions", type: "reading", duration: "6 min read", source: "MDN Web Docs", heading: "Function Declarations vs Arrow Functions", text: "Functions are first-class objects in JavaScript. They can be passed as arguments and returned from functions.", codeSnippet: `function multiply(a, b) {\n  return a * b;\n}\n\n// ES6 Arrow Function\nconst add = (a, b) => a + b;`, keyPoints: ["First-class function properties", "Arrow function lexically bound 'this'", "Implicit return statements"] },
            { id: "js-2-2", title: "2.2 Understanding Closures & Lexical Scope", type: "reading", duration: "8 min read", source: "Namaste JavaScript", heading: "Lexical Environment & Closures", text: "A closure is the combination of a function bundled together with references to its surrounding lexical environment.", codeSnippet: `function outer() {\n  let count = 0;\n  return function inner() {\n    count++;\n    return count;\n  };\n}\nconst counter = outer();\nconsole.log(counter()); // 1\nconsole.log(counter()); // 2`, keyPoints: ["Lexical scope lookup", "Data privacy via closures", "Memory management considerations"] }
          ]
        },
        {
          id: 3, num: 3, subtitle: "DOM Manipulation", title: "Module 3: DOM Tree Manipulation & Event Bubbling", instructor: "Hitesh Choudhary",
          lessons: [
            { id: "js-3-1", title: "3.1 DOM Element Selection & Mutation", type: "reading", duration: "7 min read", source: "MDN DOM Docs", heading: "Selecting & Modifying DOM Nodes", text: "The DOM represents the document as a tree of nodes. Use querySelector and addEventListener to build interactive pages.", codeSnippet: `const btn = document.querySelector("#submitBtn");\nconst title = document.querySelector("h1");\n\nbtn.addEventListener("click", () => {\n  title.textContent = "JavaScript Rules! 🚀";\n  title.classList.add("highlight");\n});`, keyPoints: ["querySelector vs getElementById", "classList & style mutations", "Event bubbling & capturing"] }
          ]
        },
        {
          id: 4, num: 4, subtitle: "Async JavaScript", title: "Module 4: Asynchronous JS, Promises & Async/Await", instructor: "Akshay Saini",
          lessons: [
            { id: "js-4-1", title: "4.1 Callbacks, Promises & Fetch API", type: "reading", duration: "8 min read", source: "MDN Async JS", heading: "Handling Asynchronous Operations", text: "Promises represent eventual completion or failure of asynchronous operations. Async/await provides clean syntax.", codeSnippet: `async function fetchUserData() {\n  try {\n    const response = await fetch("https://api.github.com/users/alex");\n    const data = await response.json();\n    console.log("User:", data.name);\n  } catch (error) {\n    console.error("Fetch failed:", error);\n  }\n}\nfetchUserData();`, keyPoints: ["Promise states: Pending, Fulfilled, Rejected", "async / await error handling", "Microtask Queue vs Macrotask Queue"] }
          ]
        },
        {
          id: 5, num: 5, subtitle: "ES6+ Modern JS", title: "Module 5: ES6 Array Methods, Destructuring & Modules", instructor: "Hitesh Choudhary",
          lessons: [
            { id: "js-5-1", title: "5.1 map, filter, reduce & ES6 Modules", type: "reading", duration: "7 min read", source: "MDN ES6 Docs", heading: "Functional Array Operations & ES Modules", text: "Modern JavaScript relies on declarative array methods like .map(), .filter(), and .reduce() alongside ES6 import/export modules.", codeSnippet: `const numbers = [10, 20, 30, 40];\nconst doubled = numbers.map(n => n * 2);\nconst highScores = numbers.filter(n => n > 15);\n\n// ES6 Destructuring:\nconst { name, xp } = { name: "Alex", xp: 900 };`, keyPoints: ["Immutability with map & filter", "Object & Array destructuring", "ES6 import / export syntax"] }
          ]
        },
        {
          id: 6, num: 6, subtitle: "JavaScript Masterclass", title: "Module 6: JavaScript Masterclass Video Walkthrough", instructor: "Hitesh Choudhary",
          lessons: [
            { id: "js-6-1", title: "6.1 JavaScript Masterclass Video", type: "video", duration: "25 min video", source: "JS Masterclass Video", heading: "Complete JavaScript Deep Dive Video Walkthrough", videoUrl: "https://www.youtube.com/embed/hdI2bqOjy3c?autoplay=1", description: "Watch complete hands-on video covering JavaScript execution context, closures, DOM events, and Async/Await.", keyPoints: ["Live coding JS applications", "Debugging in Chrome DevTools Console", "Best practices for modern web apps"] }
          ]
        }
      ]
    },
    "js-dev": {
      logo: "🟨",
      title: "JavaScript Fundamentals",
      subtitle: "Master ES6+ JavaScript, DOM manipulation, closures, and asynchronous programming.",
      instructor: "Hitesh Choudhary & Akshay Saini",
      modules: [] // References JavaScript Fundamentals dynamically
    },
    "React Developer Path": {
      logo: "⚛️",
      title: "React Developer Path",
      subtitle: "Master React by building real-world projects and become job-ready.",
      instructor: "Hitesh Choudhary",
      modules: modulesList
    },
    "Python for Data Science": {
      logo: "🐍",
      title: "Python for Data Science & Machine Learning",
      subtitle: "Master Python syntax, NumPy data structures, Pandas dataframes, and Scikit-Learn algorithms.",
      instructor: "Dr. Angela Yu / Corey Schafer",
      modules: [
        {
          id: 1, num: 1, subtitle: "Python Fundamentals", title: "Module 1: Python Core Syntax & Data Structures", instructor: "Dr. Angela Yu",
          lessons: [
            { id: "py-1-1", title: "1.1 Python Overview & Setup", type: "reading", duration: "5 min read", source: "Python.org Docs", heading: "Introduction to Python 3", text: "Python is an interpreted high-level programming language used extensively in AI, Data Science, and Web Backend.", codeSnippet: `print("Hello SkillSphere Python Developer!")\n\n# Dynamic variables\nage = 22\nname = "Alex Morgan"`, keyPoints: ["Readable syntax", "Rich library ecosystem", "Dynamic typing"] },
            { id: "py-1-2", title: "1.2 Lists, Tuples & Dictionaries", type: "reading", duration: "8 min read", source: "Python.org Docs", heading: "Python Data Structures", text: "Lists store ordered sequences, Tuples are immutable, and Dictionaries hold key-value mappings.", codeSnippet: `student = {"name": "Alex", "xp": 650}\nprint(f"Student {student['name']} has {student['xp']} XP")`, keyPoints: ["Mutable lists vs immutable tuples", "O(1) dictionary key access", "List comprehensions"] }
          ]
        },
        {
          id: 2, num: 2, subtitle: "NumPy Computing", title: "Module 2: Numerical Computing with NumPy Arrays", instructor: "Dr. Angela Yu",
          lessons: [
            { id: "py-2-1", title: "2.1 N-Dimensional Arrays", type: "reading", duration: "7 min read", source: "NumPy.org Docs", heading: "Vectorized Operations in NumPy", text: "NumPy provides high-performance multidimensional arrays and mathematical array functions.", codeSnippet: `import numpy as np\n\narr = np.array([10, 20, 30, 40])\nprint(arr * 2) # Vectorized multiplication`, keyPoints: ["Vectorized array calculations", "Broadcasting rules", "Memory efficient C-backend"] }
          ]
        },
        {
          id: 3, num: 3, subtitle: "Pandas Data Analysis", title: "Module 3: Data Cleaning & Wrangling with Pandas", instructor: "Dr. Angela Yu",
          lessons: [
            { id: "py-3-1", title: "3.1 DataFrames & Series", type: "reading", duration: "8 min read", source: "Pandas Docs", heading: "Data Analysis with DataFrames", text: "Pandas DataFrames allow filtering, grouping, merging, and cleaning tabular data effortlessly.", codeSnippet: `import pandas as pd\n\ndf = pd.read_csv("scores.csv")\nprint(df.groupby("course")["score"].mean())`, keyPoints: ["Data filtering & selection", "Groupby aggregation", "Handling missing NaN data"] }
          ]
        },
        {
          id: 4, num: 4, subtitle: "Data Visualization", title: "Module 4: Matplotlib & Seaborn Charting", instructor: "Dr. Angela Yu",
          lessons: [
            { id: "py-4-1", title: "4.1 Plotting Line & Bar Charts", type: "reading", duration: "6 min read", source: "Matplotlib Docs", heading: "Visualizing Data Science Trends", text: "Produce interactive and static charts using Matplotlib and Seaborn visualization libraries.", codeSnippet: `import matplotlib.pyplot as plt\n\nplt.plot([1, 2, 3], [10, 25, 50])\nplt.title('SkillSphere Student XP Growth')\nplt.show()`, keyPoints: ["Line, Bar, Scatter plots", "Seaborn statistical plots", "Exporting charts to PNG/PDF"] }
          ]
        },
        {
          id: 5, num: 5, subtitle: "Machine Learning Foundations", title: "Module 5: Scikit-Learn Predictive Models", instructor: "Dr. Angela Yu",
          lessons: [
            { id: "py-5-1", title: "5.1 Supervised Regression Models", type: "reading", duration: "9 min read", source: "Scikit-Learn Docs", heading: "Building Predictive Models with Scikit-Learn", text: "Train decision trees, linear regression, and classification models on feature datasets.", codeSnippet: `from sklearn.linear_model import LinearRegression\n\nmodel = LinearRegression()\n# model.fit(X_train, y_train)`, keyPoints: ["Train/Test Splitting", "Regression vs Classification", "Model accuracy metrics"] }
          ]
        },
        {
          id: 6, num: 6, subtitle: "Python Masterclass", title: "Module 6: Python Data Science Masterclass Video", instructor: "Dr. Angela Yu",
          lessons: [
            { id: "py-6-1", title: "6.1 Python Masterclass Video", type: "video", duration: "25 min video", source: "Python Masterclass", heading: "Python Data Science End-to-End Walkthrough", videoUrl: "https://www.youtube.com/embed/rfscVS0vtbw?autoplay=1", description: "Watch end-to-end Python data science video from raw CSV to deployed ML model.", keyPoints: ["Exploratory Data Analysis", "Feature Engineering", "Model Evaluation"] }
          ]
        }
      ]
    },
    "Fullstack with Node.js": {
      logo: "🟩",
      title: "Fullstack Node.js & Express Backend Path",
      subtitle: "Build RESTful APIs, Mongoose ORM data models, JWT authentication, and real-time backend systems.",
      instructor: "Ryan Dahl / Jonas Schmedtmann",
      modules: [
        {
          id: 1, num: 1, subtitle: "Node.js Event Loop", title: "Module 1: Node.js Runtime & Asynchronous I/O", instructor: "Jonas Schmedtmann",
          lessons: [
            { id: "node-1-1", title: "1.1 Node.js Architecture", type: "reading", duration: "6 min read", source: "Nodejs.org Docs", heading: "Non-Blocking I/O & Event Loop", text: "Node.js is an open-source JavaScript runtime built on Chrome's V8 engine for asynchronous server apps.", codeSnippet: `const http = require('http');\n\nconst server = http.createServer((req, res) => {\n  res.end('Hello from SkillSphere Node.js Backend!');\n});\nserver.listen(5000);`, keyPoints: ["Single-threaded event loop", "V8 Engine execution", "Asynchronous non-blocking I/O"] }
          ]
        },
        {
          id: 2, num: 2, subtitle: "Express.js REST APIs", title: "Module 2: Express Framework & Middleware", instructor: "Jonas Schmedtmann",
          lessons: [
            { id: "node-2-1", title: "2.1 Express REST Routes", type: "reading", duration: "8 min read", source: "Expressjs.com Docs", heading: "Building RESTful API Endpoints", text: "Express handles HTTP routing, request bodies, and middleware processing efficiently.", codeSnippet: `const express = require('express');\nconst app = express();\n\napp.use(express.json());\napp.get('/api/users', (req, res) => res.json({ status: 'success' }));`, keyPoints: ["Middleware processing", "Req/Res objects", "Route parameters"] }
          ]
        },
        {
          id: 3, num: 3, subtitle: "MongoDB Database", title: "Module 3: Database Schemas & Mongoose ORM", instructor: "Jonas Schmedtmann",
          lessons: [
            { id: "node-3-1", title: "3.1 Mongoose Schema Models", type: "reading", duration: "7 min read", source: "Mongoosejs.com Docs", heading: "Modeling Data in MongoDB", text: "Mongoose provides schema-based data modeling, query building, and document validation.", codeSnippet: `const mongoose = require('mongoose');\nconst UserSchema = new mongoose.Schema({\n  username: { type: String, required: true },\n  xp: Number\n});`, keyPoints: ["NoSQL document model", "Mongoose validations", "Schema indexes"] }
          ]
        },
        {
          id: 4, num: 4, subtitle: "JWT Authentication", title: "Module 4: Password Hashing & JWT Security", instructor: "Jonas Schmedtmann",
          lessons: [
            { id: "node-4-1", title: "4.1 JWT Authentication Security", type: "reading", duration: "8 min read", source: "JWT.io Docs", heading: "Stateless Security with JSON Web Tokens", text: "Secure Express routes by issuing signed JWT tokens upon user login.", codeSnippet: `const jwt = require('jsonwebtoken');\nconst token = jwt.sign({ id: user._id }, 'SECRET_KEY', { expiresIn: '1d' });`, keyPoints: ["Bcrypt password hashing", "Authorization Bearer headers", "Role authorization"] }
          ]
        },
        {
          id: 5, num: 5, subtitle: "Realtime Socket.IO", title: "Module 5: Socket.IO & Realtime WebSockets", instructor: "Jonas Schmedtmann",
          lessons: [
            { id: "node-5-1", title: "5.1 Socket.IO Event Emitters", type: "reading", duration: "7 min read", source: "Socket.io Docs", heading: "Bi-Directional Realtime Messaging", text: "Build instant messaging and notification servers using Socket.IO event listeners.", codeSnippet: `const io = require('socket.io')(server);\nio.on('connection', (socket) => {\n  socket.on('msg', (data) => io.emit('msg', data));\n});`, keyPoints: ["WebSocket protocol", "Broadcasting events", "Socket rooms"] }
          ]
        },
        {
          id: 6, num: 6, subtitle: "Node.js Masterclass", title: "Module 6: Node.js Video Masterclass & Deployment", instructor: "Jonas Schmedtmann",
          lessons: [
            { id: "node-6-1", title: "6.1 Node.js Video Masterclass", type: "video", duration: "25 min video", source: "Node Masterclass", heading: "Complete Production Node.js Deployment", videoUrl: "https://www.youtube.com/embed/TlB_eWDSMt4?autoplay=1", description: "Watch complete tutorial on PM2 process management and Docker deployment.", keyPoints: ["PM2 cluster mode", "Docker containerization", "Environment security"] }
          ]
        }
      ]
    },
    "UI/UX Design Masterclass": {
      logo: "🎨",
      title: "UI/UX Design Systems & Figma Masterclass",
      subtitle: "Learn user research, wireframing, color theory, Auto Layout 5.0 in Figma, and design tokens.",
      instructor: "Daniel Walter Scott / Don Norman",
      modules: [
        {
          id: 1, num: 1, subtitle: "UX Foundations", title: "Module 1: User Research, Persona & Wireframes", instructor: "Daniel Walter Scott",
          lessons: [
            { id: "ui-1-1", title: "1.1 UX Heuristics & Personas", type: "reading", duration: "5 min read", source: "Nielsen Norman Group", heading: "10 Usability Heuristics for UX Design", text: "UX design creates intuitive, accessible, human-centered digital experiences.", codeSnippet: `/* Design Token Variables */\n:root {\n  --color-primary: #F9572A;\n  --font-family: 'Plus Jakarta Sans';\n}`, keyPoints: ["User journey mapping", "Wireframing user flows", "Usability testing"] }
          ]
        },
        {
          id: 2, num: 2, subtitle: "Color & Typography", title: "Module 2: Visual Hierarchy & 8pt Layout Grids", instructor: "Daniel Walter Scott",
          lessons: [
            { id: "ui-2-1", title: "2.1 8pt Layout Grid System", type: "reading", duration: "7 min read", source: "Figma Handbook", heading: "Mastering Layout Grids & Typography Scales", text: "Use 8pt grid systems and contrasting typography scales to guide user visual hierarchy.", codeSnippet: `/* 8pt Grid spacing rule */\nmargin-bottom: 16px;\npadding: 24px;`, keyPoints: ["8pt grid rule", "WCAG AA color contrast", "Visual hierarchy"] }
          ]
        },
        {
          id: 3, num: 3, subtitle: "Figma Auto Layout", title: "Module 3: Auto Layout 5.0 & Component Variants", instructor: "Daniel Walter Scott",
          lessons: [
            { id: "ui-3-1", title: "3.1 Responsive Components in Figma", type: "reading", duration: "8 min read", source: "Figma Official Docs", heading: "Building Auto Layout Components", text: "Auto Layout dynamically adjusts frame sizes based on padding, gaps, and content length.", codeSnippet: `// Figma Component Variants:\n// Button [State: Default, Hover, Active] [Type: Primary, Outline]`, keyPoints: ["Auto layout padding & gap", "Component Variants", "Interactive component states"] }
          ]
        },
        {
          id: 4, num: 4, subtitle: "Interactive Prototypes", title: "Module 4: Smart Animate & Micro-Interactions", instructor: "Daniel Walter Scott",
          lessons: [
            { id: "ui-4-1", title: "4.1 Smart Animate Micro-interactions", type: "reading", duration: "6 min read", source: "Figma Prototyping", heading: "Clickable Prototypes & Transition Curves", text: "Smart Animate smoothly moves matching layers across frames for lifelike prototypes.", codeSnippet: `// Easing curves:\n// Cubic-bezier(0.4, 0, 0.2, 1) for drawer slide-in`, keyPoints: ["Smart Animate triggers", "Modal & Drawer transitions", "Micro-interaction feedback"] }
          ]
        },
        {
          id: 5, num: 5, subtitle: "Design Systems", title: "Module 5: Design Tokens & Dark Mode Tokens", instructor: "Daniel Walter Scott",
          lessons: [
            { id: "ui-5-1", title: "5.1 Figma Variables & Tokens", type: "reading", duration: "7 min read", source: "Design Systems Hub", heading: "Syncing Design Tokens with Code", text: "Manage dark mode and brand theme tokens seamlessly between Figma and React.", codeSnippet: `// Token mapping:\n--surface-primary: #FFFFFF;\n--surface-dark: #1E1B18;`, keyPoints: ["Design tokens", "Dark mode themes", "Atomic design hierarchy"] }
          ]
        },
        {
          id: 6, num: 6, subtitle: "UI/UX Masterclass", title: "Module 6: Figma Video Masterclass & Developer Handoff", instructor: "Daniel Walter Scott",
          lessons: [
            { id: "ui-6-1", title: "6.1 Figma Video Masterclass", type: "video", duration: "25 min video", source: "Figma Masterclass", heading: "Complete Mobile App UI/UX Design System", videoUrl: "https://www.youtube.com/embed/c9Wg6Cb_YlU?autoplay=1", description: "Watch masterclass on building complete mobile app UI in Figma and developer handoff.", keyPoints: ["Figma Dev Mode", "Exporting SVG/PNG assets", "Building design portfolio"] }
          ]
        }
      ]
    }
  };

  // Sync alias keys
  allPathDataMap["js-dev"].modules = allPathDataMap["JavaScript Fundamentals"].modules;
  allPathDataMap["1"] = allPathDataMap["JavaScript Fundamentals"];
  allPathDataMap["2"] = allPathDataMap["React Developer Path"];
  allPathDataMap["3"] = allPathDataMap["Python for Data Science"];
  allPathDataMap["4"] = allPathDataMap["UI/UX Design Masterclass"];
  allPathDataMap["6"] = allPathDataMap["Fullstack with Node.js"];

  const selectedPathTitle = typeof selectedPathDetail === 'string' ? selectedPathDetail : selectedPathDetail?.title;
  const selectedPathId = typeof selectedPathDetail === 'object' ? selectedPathDetail?.id : null;

  let activePathData = null;
  if (selectedPathDetail) {
    if (selectedPathId && allPathDataMap[selectedPathId] && allPathDataMap[selectedPathId].modules?.length > 0) {
      activePathData = allPathDataMap[selectedPathId];
    } else if (selectedPathTitle && allPathDataMap[selectedPathTitle] && allPathDataMap[selectedPathTitle].modules?.length > 0) {
      activePathData = allPathDataMap[selectedPathTitle];
    } else if (typeof selectedPathDetail === 'string' && allPathDataMap[selectedPathDetail] && allPathDataMap[selectedPathDetail].modules?.length > 0) {
      activePathData = allPathDataMap[selectedPathDetail];
    } else {
      const titleLower = (selectedPathTitle || "").toLowerCase();
      if (titleLower.includes("javascript") || titleLower.includes("js")) {
        activePathData = allPathDataMap["JavaScript Fundamentals"];
      } else if (titleLower.includes("python")) {
        activePathData = allPathDataMap["Python for Data Science"];
      } else if (titleLower.includes("node")) {
        activePathData = allPathDataMap["Fullstack with Node.js"];
      } else if (titleLower.includes("ui") || titleLower.includes("ux")) {
        activePathData = allPathDataMap["UI/UX Design Masterclass"];
      } else if (titleLower.includes("react")) {
        activePathData = allPathDataMap["React Developer Path"];
      } else {
        activePathData = {
          logo: "📚",
          title: selectedPathTitle || "Enrolled Course Path",
          subtitle: `Master ${selectedPathTitle || "this course"} by building real-world projects and become job-ready.`,
          instructor: selectedPathDetail?.instructor || "SkillSphere Academic Team",
          modules: generateModulesForCourse(selectedPathTitle || "Course")
        };
      }
    }
  }

  if (!activePathData) {
    activePathData = allPathDataMap["React Developer Path"];
  }

  const modulesListForActivePath = (activePathData.modules || []).map((mod, modIdx) => {
    const hasVideo = (mod.lessons || []).some(l => l.type === "video");
    if (hasVideo) return mod;

    const cleanTitle = mod.title.replace("Module " + (modIdx + 1) + ": ", "").split(",")[0].split("&")[0].trim();
    let videoUrl = "https://www.youtube.com/embed/bMknfKXIFA8?autoplay=1";
    if (cleanTitle.toLowerCase().includes("javascript") || cleanTitle.toLowerCase().includes("js")) {
      videoUrl = "https://www.youtube.com/embed/W6NZfCO5SIk?autoplay=1";
    } else if (cleanTitle.toLowerCase().includes("scope") || cleanTitle.toLowerCase().includes("closure")) {
      videoUrl = "https://www.youtube.com/embed/qikxEIxsXco?autoplay=1";
    } else if (cleanTitle.toLowerCase().includes("react") || cleanTitle.toLowerCase().includes("hooks")) {
      videoUrl = "https://www.youtube.com/embed/Ke90Tje7VS0?autoplay=1";
    } else if (cleanTitle.toLowerCase().includes("python") || cleanTitle.toLowerCase().includes("numpy")) {
      videoUrl = "https://www.youtube.com/embed/rfscVS0vtbw?autoplay=1";
    } else if (cleanTitle.toLowerCase().includes("pandas") || cleanTitle.toLowerCase().includes("cleaning")) {
      videoUrl = "https://www.youtube.com/embed/gpColJDGWUI?autoplay=1";
    } else if (cleanTitle.toLowerCase().includes("node") || cleanTitle.toLowerCase().includes("express")) {
      videoUrl = "https://www.youtube.com/embed/TlB_eWDSMt4?autoplay=1";
    } else if (cleanTitle.toLowerCase().includes("figma") || cleanTitle.toLowerCase().includes("wireframe") || cleanTitle.toLowerCase().includes("ux")) {
      videoUrl = "https://www.youtube.com/embed/c9Wg6Cb_YlU?autoplay=1";
    } else if (cleanTitle.toLowerCase().includes("database") || cleanTitle.toLowerCase().includes("mongoose") || cleanTitle.toLowerCase().includes("mongodb")) {
      videoUrl = "https://www.youtube.com/embed/ofme2o290Y4?autoplay=1";
    } else if (cleanTitle.toLowerCase().includes("auth") || cleanTitle.toLowerCase().includes("jwt") || cleanTitle.toLowerCase().includes("security")) {
      videoUrl = "https://www.youtube.com/embed/mbsmsi7l3r4?autoplay=1";
    } else if (cleanTitle.toLowerCase().includes("socket") || cleanTitle.toLowerCase().includes("realtime")) {
      videoUrl = "https://www.youtube.com/embed/UUcDyLAncRY?autoplay=1";
    }

    const videoLesson = {
      id: `${mod.id || modIdx}-vid-auto`,
      title: `${modIdx + 1}.${mod.lessons.length + 1} Video Walkthrough: ${cleanTitle}`,
      type: "video",
      duration: "15 min video",
      source: "YouTube Academy",
      heading: `${cleanTitle} Video Lecture`,
      videoUrl: videoUrl,
      description: `Watch a curated YouTube masterclass covering the core objectives of ${cleanTitle}.`,
      keyPoints: ["Topic core lecture", "Visual walkthrough", "Real-world demonstrations"]
    };

    return {
      ...mod,
      lessons: [...(mod.lessons || []), videoLesson]
    };
  });

  const activeModule = modulesListForActivePath[activeModuleIndex] || modulesListForActivePath[0];
  const activeSubLesson = activeModule ? (activeModule.lessons[activeSubLessonIndex] || activeModule.lessons[0]) : null;

  // Calculate real-time completed sub-lessons for current module
  const currentModuleCompletedCount = activeModule && activeModule.lessons ? activeModule.lessons.filter(l => completedSubLessonIds.includes(l.id)).length : 0;
  const isCurrentModuleFullyCompleted = activeModule && activeModule.lessons ? (currentModuleCompletedCount === activeModule.lessons.length) : false;

  // Calculate total path progress percentage specifically for THIS active course
  const allSubLessonsInActivePath = modulesListForActivePath.flatMap(m => m.lessons || []);
  const totalSubLessonsInPath = allSubLessonsInActivePath.length;
  const completedSubLessonsInPath = allSubLessonsInActivePath.filter(l => completedSubLessonIds.includes(l.id));
  const totalCompletedSubLessonsCount = completedSubLessonsInPath.length;
  const progressPct = totalSubLessonsInPath > 0 ? Math.min(100, Math.round((totalCompletedSubLessonsCount / totalSubLessonsInPath) * 100)) : 0;
  const strokeOffset = Math.round(251.2 * (1 - progressPct / 100));

  const handleMarkComplete = () => {
    if (!activeSubLesson) return;
    let updatedCompleted = completedSubLessonIds;
    if (!completedSubLessonIds.includes(activeSubLesson.id)) {
      updatedCompleted = [...completedSubLessonIds, activeSubLesson.id];
      setCompletedSubLessonIds(updatedCompleted);
      if (earnXp) earnXp(20);
      showToast(`🎉 +20 XP Earned! Completed ${activeSubLesson.title.split(' ')[0]}`);
    } else {
      showToast(`✨ Sub-lesson completed. Advancing next...`);
    }

    // Check if ALL lessons of THIS specific course track are completed
    const currentCourseAllLessons = modulesListForActivePath.flatMap(m => m.lessons || []);
    const completedCountInThisCourse = currentCourseAllLessons.filter(l => updatedCompleted.includes(l.id)).length;
    const isThisCourseFullyCompleted = currentCourseAllLessons.length > 0 && completedCountInThisCourse === currentCourseAllLessons.length;

    if (activeSubLessonIndex < activeModule.lessons.length - 1) {
      setActiveSubLessonIndex(prev => prev + 1);
      setIsPlayingVideo(false);
    } else if (activeModuleIndex < modulesListForActivePath.length - 1) {
      const nextMod = modulesListForActivePath[activeModuleIndex + 1];
      setActiveModuleIndex(prev => prev + 1);
      setActiveSubLessonIndex(0);
      setIsPlayingVideo(false);
      showToast(`🚀 Module ${activeModuleIndex + 1} Completed! Unlocked Module ${activeModuleIndex + 2}: ${nextMod ? nextMod.title : ''}`);
    } else {
      // Reached the end of the last module in the course
      if (isThisCourseFullyCompleted) {
        showToast(`🏆 Congratulations! You have completed all modules for ${activePathData.title}!`);
        if (quizPassed) {
          setShowCertificateModal(true);
        } else {
          showToast("⚠️ Complete the Track Quiz Challenge to claim your Certificate!");
          setShowQuizModal(true);
        }
      } else {
        showToast(`👍 Module ${activeModuleIndex + 1} finished! Continue remaining modules to complete the track.`);
      }
    }
  };

  const handlePrevLesson = () => {
    if (activeSubLessonIndex > 0) {
      setActiveSubLessonIndex(prev => prev - 1);
      setIsPlayingVideo(false);
    } else if (activeModuleIndex > 0) {
      const prevModIndex = activeModuleIndex - 1;
      setActiveModuleIndex(prevModIndex);
      setActiveSubLessonIndex(modulesListForActivePath[prevModIndex].lessons.length - 1);
      setIsPlayingVideo(false);
    }
  };

  const handleQuizSubmit = (e) => {
    e.preventDefault();
    const correctCount = Object.values(userAnswers).filter(Boolean).length;
    const score = Math.round((correctCount / 5) * 20);
    setQuizScore(score);
    setQuizPassed(true);
    if (earnXp) earnXp(50);
    setShowQuizModal(false);
    showToast(`🏆 Quiz Passed! You scored ${score}/20 (+50 Bonus XP)`);

    // Check if ALL lessons of THIS active course are completed before showing certificate
    const currentCourseAllLessons = modulesListForActivePath.flatMap(m => m.lessons || []);
    const completedCountInThisCourse = currentCourseAllLessons.filter(l => completedSubLessonIds.includes(l.id)).length;
    const isThisCourseFullyCompleted = currentCourseAllLessons.length > 0 && completedCountInThisCourse === currentCourseAllLessons.length;

    if (isThisCourseFullyCompleted) {
      setTimeout(() => {
        setShowCertificateModal(true);
      }, 500);
    }
  };

  const handleInstantUnlockAll = () => {
    const allIds = [];
    modulesList.forEach(m => m.lessons.forEach(l => allIds.push(l.id)));
    setCompletedSubLessonIds(allIds);
    setQuizPassed(true);
    setShowQuizModal(false);
    setShowCertificateModal(true);

    if (completeTopic) {
      ["react_mod1", "react_mod2", "react_mod3", "react_mod4", "react_mod5", "react_mod6"].forEach(tId => {
        completeTopic(tId, 50);
      });
    }

    showToast("✨ All 6 Modules & Track Quiz Completed! Certificate Unlocked!");
  };

  const handleDownloadCertificate = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext("2d");

    // Background Fill
    ctx.fillStyle = "#FFFDF9";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Outer Border
    ctx.strokeStyle = "#F9572A";
    ctx.lineWidth = 16;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    // Inner Dashed Border
    ctx.strokeStyle = "#FAD6C8";
    ctx.lineWidth = 4;
    ctx.setLineDash([10, 8]);
    ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);
    ctx.setLineDash([]);

    // Header Logo & Brand
    ctx.font = "bold 36px sans-serif";
    ctx.fillStyle = "#F9572A";
    ctx.textAlign = "center";
    ctx.fillText("⬢ SkillSphere Nexus", canvas.width / 2, 130);

    // Title
    ctx.font = "bold 44px serif";
    ctx.fillStyle = "#1E1B18";
    ctx.fillText("CERTIFICATE OF COMPLETION", canvas.width / 2, 210);

    // Subtitle
    ctx.font = "italic 22px sans-serif";
    ctx.fillStyle = "#64748B";
    ctx.fillText("This is to certify that", canvas.width / 2, 270);

    // Recipient Name
    ctx.font = "italic bold 60px Georgia, serif";
    ctx.fillStyle = "#78350F";
    ctx.fillText(userName, canvas.width / 2, 360);

    // Description
    ctx.font = "22px sans-serif";
    ctx.fillStyle = "#475569";
    ctx.fillText("has successfully mastered all 6 Modules & Passed the Quiz Challenge", canvas.width / 2, 440);
    ctx.font = "bold 24px sans-serif";
    ctx.fillStyle = "#F9572A";
    ctx.fillText("React Developer Professional Learning Path", canvas.width / 2, 480);

    // Seal
    ctx.font = "60px sans-serif";
    ctx.fillText("🎓", canvas.width / 2, 580);

    // Footer
    ctx.font = "bold 18px sans-serif";
    ctx.fillStyle = "#1E1B18";
    ctx.textAlign = "left";
    ctx.fillText(`Date: ${new Date().toLocaleDateString()}`, 100, 690);

    ctx.textAlign = "right";
    ctx.fillText("Director: SkillSphere Academic Team", canvas.width - 100, 690);

    ctx.font = "14px sans-serif";
    ctx.fillStyle = "#94A3B8";
    ctx.textAlign = "left";
    ctx.fillText("Verification Code: SKILL-REACT-2026-8849", 100, 720);

    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `SkillSphere_React_Developer_Certificate_${userName.replace(/\s+/g, "_")}.png`;
    link.href = dataUrl;
    link.click();
    showToast("📥 Certificate downloaded successfully!");
  };

  const handleAddDiscussion = (e) => {
    e.preventDefault();
    if (!discussionInput.trim()) return;
    setDiscussionsList(prev => [
      { id: Date.now(), author: userName, text: discussionInput, time: "Just now" },
      ...prev
    ]);
    setDiscussionInput("");
    showToast("💬 Comment posted to discussion!");
  };

  const handleProjectSubmit = (e) => {
    e.preventDefault();
    if (!projectRepoUrl.trim()) {
      showToast("⚠️ Please provide a GitHub repository or live demo link");
      return;
    }
    if (activeProjectForModal && !submittedProjects.includes(activeProjectForModal.id)) {
      setSubmittedProjects(prev => [...prev, activeProjectForModal.id]);
      if (earnXp) earnXp(activeProjectForModal.xpVal);
      showToast(`🎉 Project "${activeProjectForModal.title}" Submitted Successfully! +${activeProjectForModal.xpVal} XP Claimed!`);
    } else {
      showToast("✅ Project updated successfully!");
    }
    setShowProjectModal(false);
    setProjectRepoUrl("");
  };

  const downloadResourceFile = (title, filename, textContent) => {
    const file = new Blob([textContent], { type: "text/plain;charset=utf-8" });
    const element = document.createElement("a");
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showToast(`📥 Downloaded ${title} (${filename})!`);
  };

  const currentXp = xp ?? 0;

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <FaHome /> },
    { id: "student-profile", label: "Student Profile", icon: <FaAward /> },
    { id: "services-catalog", label: "Services & Catalog", icon: <FaBook /> },
    { id: "assessments", label: "Assessments", icon: <FaBolt /> },
    { id: "certification-tracking", label: "Cert Tracking", icon: <FaCertificate /> },
    
    { id: "complaint-tracking", label: "Complaint & Renewal", icon: <FaFileInvoice /> },
    { id: "career-roadmap", label: "Career Roadmap", icon: <FaCodeBranch /> },
    { id: "courses", label: "Courses", icon: <FaBook /> },
    { id: "learning-paths", label: "Learning Paths", icon: <FaCodeBranch /> },
    { id: "ai-buddy", label: "AI Study Buddy", icon: <FaRobot /> },
    { id: "opportunity-feed", label: "Opportunity Feed", icon: <FaRocket /> },
    { id: "daily-quests", label: "Daily Quests", icon: <FaBolt /> },
    { id: "badges", label: "Badges", icon: <FaAward /> },
    { id: "certificates", label: "Certificates", icon: <FaCertificate /> },
    { id: "progress", label: "Progress", icon: <FaChartLine /> },
    { id: "resume", label: "Resume Builder", icon: <FaFileInvoice /> },
    { id: "code-arena", label: "CodeArena", icon: <FaCode /> }
  ];

  // Dynamic Path Stats Calculation based on persistent completedSubLessonIds
  const getPathStats = (pathTitle) => {
    let totalLessons = 30;
    let completedCount = 0;
    let totalModules = 6;

    if (pathTitle.includes("React")) {
      totalLessons = 30;
      totalModules = 6;
      completedCount = completedSubLessonIds.filter(id => !id.startsWith("py-") && !id.startsWith("node-") && !id.startsWith("ui-")).length;
    } else if (pathTitle.includes("Python")) {
      totalLessons = 7;
      totalModules = 6;
      completedCount = completedSubLessonIds.filter(id => id.startsWith("py-")).length;
    } else if (pathTitle.includes("Node")) {
      totalLessons = 3;
      totalModules = 3;
      completedCount = completedSubLessonIds.filter(id => id.startsWith("node-")).length;
    } else if (pathTitle.includes("UI/UX")) {
      totalLessons = 6;
      totalModules = 6;
      completedCount = completedSubLessonIds.filter(id => id.startsWith("ui-")).length;
    }

    const pct = Math.min(100, Math.round((completedCount / totalLessons) * 100));
    const completedMods = Math.min(totalModules, Math.ceil((completedCount / totalLessons) * totalModules));

    let status = "not-started";
    let statusText = "Not Started";
    let actionText = "Start Now";

    if (pct > 0 && pct < 100) {
      status = "in-progress";
      statusText = "In Progress";
      actionText = "Continue Learning";
    } else if (pct >= 100) {
      status = "completed";
      statusText = "Completed";
      actionText = "Review Path";
    }

    return {
      progress: pct,
      status,
      statusText,
      completedModulesText: `${completedMods} / ${totalModules}`,
      actionText,
      lastAccessed: completedCount > 0 ? "Today" : "—"
    };
  };

  const reactStats = getPathStats("React Developer Path");
  const pythonStats = getPathStats("Python for Data Science");
  const nodeStats = getPathStats("Fullstack with Node.js");
  const uiStats = getPathStats("UI/UX Design Masterclass");

  const pathCards = [
    {
      id: 1,
      title: "React Developer Path",
      levelInfo: "Intermediate • 6 Modules • 24.5K Learners",
      status: reactStats.status,
      statusText: reactStats.statusText,
      progress: reactStats.progress,
      completedModules: reactStats.completedModulesText,
      bannerType: "react",
      logoText: "⚛️"
    },
    {
      id: 2,
      title: "Python for Data Science",
      levelInfo: "Beginner • 6 Modules • 18.7K Learners",
      status: pythonStats.status,
      statusText: pythonStats.statusText,
      progress: pythonStats.progress,
      completedModules: pythonStats.completedModulesText,
      bannerType: "python",
      logoText: "🐍"
    },
    {
      id: 3,
      title: "Fullstack with Node.js",
      levelInfo: "Intermediate • 3 Modules • 12.1K Learners",
      status: nodeStats.status,
      statusText: nodeStats.statusText,
      progress: nodeStats.progress,
      completedModules: nodeStats.completedModulesText,
      bannerType: "node",
      logoText: "🟩"
    },
    {
      id: 4,
      title: "UI/UX Design Masterclass",
      levelInfo: "Beginner • 6 Modules • 9.8K Learners",
      status: uiStats.status,
      statusText: uiStats.statusText,
      progress: uiStats.progress,
      completedModules: uiStats.completedModulesText,
      bannerType: "figma",
      logoText: "🎨"
    }
  ];

  const tablePaths = [
    {
      id: 1,
      title: "React Developer Path",
      status: reactStats.status,
      statusText: reactStats.statusText,
      progress: reactStats.progress,
      progressColor: "#0284C7",
      modules: reactStats.completedModulesText,
      lastAccessed: reactStats.lastAccessed,
      logoText: "⚛️",
      logoBg: "#E0F2FE",
      actionText: reactStats.actionText
    },
    {
      id: 2,
      title: "Python for Data Science",
      status: pythonStats.status,
      statusText: pythonStats.statusText,
      progress: pythonStats.progress,
      progressColor: "#F9572A",
      modules: pythonStats.completedModulesText,
      lastAccessed: pythonStats.lastAccessed,
      logoText: "🐍",
      logoBg: "#FEF9C3",
      actionText: pythonStats.actionText
    },
    {
      id: 3,
      title: "Fullstack with Node.js",
      status: nodeStats.status,
      statusText: nodeStats.statusText,
      progress: nodeStats.progress,
      progressColor: "#10B981",
      modules: nodeStats.completedModulesText,
      lastAccessed: nodeStats.lastAccessed,
      logoText: "🟩",
      logoBg: "#DCFCE7",
      actionText: nodeStats.actionText
    },
    {
      id: 4,
      title: "UI/UX Design Masterclass",
      status: uiStats.status,
      statusText: uiStats.statusText,
      progress: uiStats.progress,
      progressColor: "#8B5CF6",
      modules: uiStats.completedModulesText,
      lastAccessed: uiStats.lastAccessed,
      logoText: "🎨",
      logoBg: "#FCE7F3",
      actionText: uiStats.actionText
    }
  ];

  const openPathDetail = (pathTitle) => {
    setSelectedPathDetail(pathTitle || "React Developer Path");
  };

  return (
    <div className={`lpWrapper ${isDarkMode ? "dark-theme" : ""}`}>
      <Background />
      <PaperPlaneCursor />

      {/* Main Grid Container */}
      <div className="lpMainContainer">
        
        {/* ── LEFT SIDEBAR ── */}
        <aside className="lpLeftSidebar">
          <div>
            <Link to="/" className="sdBrandLogo" style={{ display: "inline-flex", alignItems: "center" }}>
              <AppLogo height="58px" />
            </Link>

            <div className="sdSidebarHomeArchHeader">
              <div className="sdArchLine" />
              <button
                className="sdHomeCircularBtn active"
                onClick={() => {
                  setSelectedPathDetail(null);
                  navigate(user?.role === "EMPLOYEE" ? "/workforce-home" : "/student-home");
                }}
                title="Dashboard Overview"
              >
                <FaHome />
              </button>
            </div>

            <ul className="sdNavList">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    className={`sdNavItem ${item.id === "learning-paths" ? "active" : ""}`}
                    onClick={() => {
                      if (item.id === "dashboard") { setSelectedPathDetail(null); navigate(user?.role === "EMPLOYEE" ? "/workforce-home" : "/student-home"); }
                      else if (item.id === "student-profile") navigate("/student-profile");
                      else if (item.id === "services-catalog") navigate("/services-catalog");
                      else if (item.id === "assessments") navigate("/assessments");
                      else if (item.id === "certification-tracking") navigate("/certification-tracking");
                      
                      else if (item.id === "complaint-tracking") navigate("/complaint-tracking");
                      else if (item.id === "career-roadmap") navigate("/career-roadmap");
                      else if (item.id === "job-search") navigate("/job-search");
                      else if (item.id === "learning-paths") {
                        setSelectedPathDetail(null);
                        navigate("/learning-paths");
                      }
                      else if (item.id === "courses") navigate("/courses");
                      else if (item.id === "assignments") navigate("/assignments");
                      else if (item.id === "discussions") navigate("/discussions");
                      else if (item.id === "ai-buddy") navigate("/ai-buddy");
                      else if (item.id === "opportunity-feed") navigate("/opportunity-feed");
                      else if (item.id === "daily-quests") navigate("/daily-quests");
                      else if (item.id === "badges") navigate("/badges");
                      else if (item.id === "certificates") navigate("/certificate");
                      else if (item.id === "progress") navigate("/progress");
                      else if (item.id === "resume") navigate("/resume");
                      else if (item.id === "code-arena") navigate("/code-arena");
                      else if (item.id === "settings") navigate("/settings");
                      else {
                        setSelectedPathDetail(null);
                        navigate(user?.role === "EMPLOYEE" ? "/workforce-home" : "/student-home");
                      }
                    }}
                  >
                    <span className="navIcon">{item.icon}</span>
                    <span className="navLabel">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="sdSidebarBottomSection">
            <div className="sdRocketIllustrationBox">
              <span className="sdRocketEmoji">🚀</span>
            </div>

            <div className="sdSidebarFooterControls">
              <button className="sdThemeToggleBtn" onClick={toggleTheme} title={`Switch to ${isDarkMode ? "Light" : "Dark"} Mode`}>
                {isDarkMode ? <FaSun /> : <FaMoon />}
              </button>
              <span className="sdControlDivider">|</span>
              <button className="sdCollapseBtn">
                <FaArrowLeft />
              </button>
            </div>
          </div>
        </aside>

        {/* ── RIGHT MAIN BODY AREA ── */}
        <div className="lpRightBodyArea">
          
          {/* Top Header Bar */}
          <header className="sdTopHeaderBar">
            <div className="sdSearchWrapper">
              <FaSearch className="sdSearchIcon" />
              <input
                type="text"
                className="sdSearchInput"
                placeholder="Search for courses, skills, discussions..."
              />
            </div>

            <div className="sdHeaderActionsRow">
              <div className="sdXpBadgePill">
                <FaBolt color="#F9572A" /> <span>{currentXp} XP</span>
              </div>

              <NotificationDropdown type="student" />

              <button
                className="sdLogoutHeaderBtn"
                onClick={handleLogout}
                title="Logout to Landing Page"
              >
                <FaSignOutAlt /> <span>Logout</span>
              </button>

              <div className="sdUserProfilePillWrapper">
                <div className="sdUserProfilePill" onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
                  <UserAvatar user={user} />
                  <div className="sdUserInfoText">
                    <strong>{userName}</strong>
                    <span>Student</span>
                  </div>
                  <span className="dropdownArrow">▾</span>
                </div>

                {isUserMenuOpen && (
                  <div className="sdUserMenuDropdown">
                    <div className="dropdownHeader">
                      <strong>{userName}</strong>
                      <span>Student Account</span>
                    </div>
                    <div className="dropdownItem" onClick={() => { setIsUserMenuOpen(false); navigate("/student-profile"); }}>
                      👤 Profile Settings
                    </div>
                    <div className="dropdownItem" onClick={() => { setIsUserMenuOpen(false); navigate("/certificate"); }}>
                      📜 My Certificates
                    </div>
                    <div className="dropdownItem logout" onClick={handleLogout}>
                      🚪 Logout
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* DYNAMIC RENDER: PATH DETAIL/PLAYER VIEW VS OVERVIEW LIST */}
          {selectedPathDetail ? (
            /* ── 1-TO-1 EXACT MATCH: LEARNING PATH DETAIL & LESSON PLAYER VIEW ── */
            <div className="lpdContainer">
              
              {/* Breadcrumb Navigation */}
              <div className="lpdBreadcrumb">
                <span className="bcLink" onClick={() => setSelectedPathDetail(null)}>Learning Paths</span>
                <span className="bcSep">&gt;</span>
                <span className="bcCurrent">{selectedPathDetail}</span>
              </div>

              {/* Path Header Banner matching Screenshot */}
              <div className="lpdHeroBanner">
                <div className="lpdHeroLeftInfo">
                  <div className="lpdTitleRow">
                    <h2 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontSize: "32px", display: "flex", alignItems: "center" }}>
                        {(typeof selectedPathDetail === "string" && selectedPathDetail.includes("JavaScript")) ||
                        (typeof selectedPathDetail === "object" && selectedPathDetail?.title?.includes("JavaScript")) ? (
                          <img src={jsBadgeImg} alt="JS" style={{ width: "38px", height: "38px", objectFit: "contain" }} />
                        ) : (
                          activePathData.logo
                        )}
                      </span>{" "}
                      {activePathData.title}
                    </h2>
                    <span className="lpdStatusTag">In Progress</span>
                  </div>
                  <p className="lpdSubtitle">
                    {activePathData.subtitle}
                  </p>

                  <div className="lpdMetaChipsRow">
                    <div className="metaChip"><FaBook color="#F9572A" /> <strong>{modulesListForActivePath.length}</strong> Modules</div>
                    <div className="metaChip"><FaRegClock color="#F9572A" /> <strong>18h 30m</strong> Total Duration</div>
                    <div className="metaChip"><FaChartLine color="#F9572A" /> <strong>Intermediate</strong> Difficulty</div>
                    <div className="metaChip"><FaUserFriends color="#F9572A" /> <strong>24.5K</strong> Learners</div>
                  </div>
                </div>

                <div className="lpdHeroIllustration">
                  {(typeof selectedPathDetail === "string" && selectedPathDetail.includes("JavaScript")) ||
                  (typeof selectedPathDetail === "object" && selectedPathDetail?.title?.includes("JavaScript")) ? (
                    <div style={{ background: "#FFFFFF", padding: "16px 24px", borderRadius: "20px", boxShadow: "0 8px 24px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <img src={jsLogoImg} alt="JavaScript Path Illustration" style={{ maxHeight: "140px", objectFit: "contain" }} />
                    </div>
                  ) : (
                    <img src={isDarkMode ? darkReactLearningHero : lightReactLearningHero} alt="React Learning Path Illustration" />
                  )}
                </div>
              </div>

              {/* Sub-Tabs Bar */}
              <div className="lpdSubTabsRow">
                <button
                  className={`lpdTab ${activeSubTab === "overview" ? "active" : ""}`}
                  onClick={() => setActiveSubTab("overview")}
                >
                  Path Overview
                </button>
                <button
                  className={`lpdTab ${activeSubTab === "modules" ? "active" : ""}`}
                  onClick={() => setActiveSubTab("modules")}
                >
                  Modules
                </button>
                <button
                  className={`lpdTab ${activeSubTab === "projects" ? "active" : ""}`}
                  onClick={() => setActiveSubTab("projects")}
                >
                  Projects
                </button>
                <button
                  className={`lpdTab ${activeSubTab === "resources" ? "active" : ""}`}
                  onClick={() => setActiveSubTab("resources")}
                >
                  Resources
                </button>
                <button
                  className={`lpdTab ${activeSubTab === "leaderboard" ? "active" : ""}`}
                  onClick={() => setActiveSubTab("leaderboard")}
                >
                  Leaderboard
                </button>
              </div>

              {/* ── DYNAMIC SUB-TAB CONTENT SWITCHING ── */}
              {activeSubTab === "modules" ? (
                /* ── 1. MODULES EXPLORER TAB ── */
                <div style={{ background: "#FFFFFF", border: "1px solid #F3EBE1", borderRadius: "24px", padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #F3EBE1", paddingBottom: "16px" }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: "20px", fontWeight: 800 }}>Course Modules Explorer ({modulesListForActivePath.length} Modules)</h3>
                      <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#64748B" }}>Complete all modules sequentially to earn your certification.</p>
                    </div>
                    <span className="completedPill" style={{ background: "#FFF0EB", color: "#F9572A" }}>
                      {totalCompletedSubLessonsCount} / {totalSubLessonsInPath} Lessons Completed
                    </span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }}>
                    {modulesListForActivePath.map((mod, mIdx) => {
                      const modCompletedCount = mod.lessons.filter(l => completedSubLessonIds.includes(l.id)).length;
                      const isModCompleted = modCompletedCount === mod.lessons.length;
                      const modProgressPct = Math.round((modCompletedCount / mod.lessons.length) * 100);

                      return (
                        <div key={mod.id} style={{ border: "1px solid #F3EBE1", borderRadius: "18px", padding: "20px", background: mIdx === activeModuleIndex ? "#FFFBF7" : "#FFFFFF" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "10px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                              <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: isModCompleted ? "#10B981" : "#F9572A", color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "14px" }}>
                                {isModCompleted ? "✓" : mod.num}
                              </div>
                              <div>
                                <h4 style={{ margin: 0, fontSize: "16px", fontWeight: 800 }}>{mod.title}</h4>
                                <span style={{ fontSize: "12px", color: "#64748B" }}>Instructor: {mod.instructor} • {mod.lessons.length} Lessons</span>
                              </div>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                              <span style={{ fontSize: "12px", fontWeight: 700, color: isModCompleted ? "#10B981" : "#F9572A" }}>
                                {modCompletedCount}/{mod.lessons.length} ({modProgressPct}%)
                              </span>
                              <button
                                className="btnNextComplete"
                                style={{ padding: "6px 14px", fontSize: "12px" }}
                                onClick={() => {
                                  setActiveModuleIndex(mIdx);
                                  setActiveSubLessonIndex(0);
                                  setActiveSubTab("overview");
                                  setIsPlayingVideo(false);
                                }}
                              >
                                {isModCompleted ? "Review Module →" : "Play Module →"}
                              </button>
                            </div>
                          </div>

                          <div style={{ background: "#E2E8F0", height: "6px", borderRadius: "99px", overflow: "hidden", marginBottom: "14px" }}>
                            <div style={{ background: isModCompleted ? "#10B981" : "#F9572A", height: "100%", width: `${modProgressPct}%`, transition: "width 0.3s ease" }}></div>
                          </div>

                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "10px" }}>
                            {mod.lessons.map((les, lIdx) => {
                              const isSubDone = completedSubLessonIds.includes(les.id);
                              return (
                                <div
                                  key={les.id}
                                  onClick={() => {
                                    setActiveModuleIndex(mIdx);
                                    setActiveSubLessonIndex(lIdx);
                                    setActiveSubTab("overview");
                                    setIsPlayingVideo(false);
                                  }}
                                  style={{
                                    padding: "10px 14px",
                                    borderRadius: "12px",
                                    border: "1px solid #F1F5F9",
                                    background: isSubDone ? "#ECFDF5" : "#F8FAFC",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    cursor: "pointer",
                                    fontSize: "12px"
                                  }}
                                >
                                  <span style={{ fontWeight: 700, color: "#334155" }}>
                                    {isSubDone ? "✅ " : "📄 "}{les.title}
                                  </span>
                                  <span style={{ fontSize: "10px", color: "#64748B", background: "#FFF", padding: "2px 6px", borderRadius: "6px" }}>
                                    {les.duration}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : activeSubTab === "projects" ? (
                /* ── 2. PRACTICAL HANDS-ON PROJECTS TAB ── */
                <div style={{ background: "#FFFFFF", border: "1px solid #F3EBE1", borderRadius: "24px", padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #F3EBE1", paddingBottom: "16px" }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: "20px", fontWeight: 800 }}>Hands-On Real-World Projects (3 Projects)</h3>
                      <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#64748B" }}>Build portfolio projects to demonstrate your practical React skills.</p>
                    </div>
                    <span className="completedPill" style={{ background: "#ECFDF5", color: "#10B981" }}>
                      {submittedProjects.length} / 3 Projects Completed
                    </span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
                    {[
                      {
                        id: "proj-1",
                        title: "Build a Component Library & Design System",
                        difficulty: "Easy",
                        xpVal: 100,
                        desc: "Design and export clean, reusable React UI components with props validation and state management.",
                        tags: ["React 19", "CSS Modules", "Props"],
                        starterRepo: "https://github.com/hiteshchoudhary/js-hindi-youtube"
                      },
                      {
                        id: "proj-2",
                        title: "E-Commerce Shopping Cart with Context API",
                        difficulty: "Medium",
                        xpVal: 150,
                        desc: "Build a complete shopping cart featuring product filtering, cart drawer state, and price calculation.",
                        tags: ["React Context", "useReducer", "LocalStorage"],
                        starterRepo: "https://github.com/hiteshchoudhary/js-hindi-youtube"
                      },
                      {
                        id: "proj-3",
                        title: "Realtime Chat App with WebSockets",
                        difficulty: "Hard",
                        xpVal: 200,
                        desc: "Develop a live chat application supporting multi-room messaging, active online user lists, and message history.",
                        tags: ["React", "WebSockets", "Node.js API"],
                        starterRepo: "https://github.com/hiteshchoudhary/js-hindi-youtube"
                      }
                    ].map(proj => {
                      const isSubmitted = submittedProjects.includes(proj.id);
                      return (
                        <div key={proj.id} style={{ border: "1px solid #F3EBE1", borderRadius: "18px", padding: "20px", background: "#FFFBF7", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "16px" }}>
                          <div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                              <span style={{ background: proj.difficulty === "Easy" ? "#DCFCE7" : proj.difficulty === "Medium" ? "#FEF3C7" : "#FEE2E2", color: proj.difficulty === "Easy" ? "#166534" : proj.difficulty === "Medium" ? "#92400E" : "#991B1B", padding: "4px 10px", borderRadius: "99px", fontSize: "11px", fontWeight: 800 }}>
                                📶 {proj.difficulty}
                              </span>
                              <span style={{ fontSize: "12px", fontWeight: 800, color: "#F9572A" }}>⚡ +{proj.xpVal} XP</span>
                            </div>
                            <h4 style={{ margin: "0 0 8px 0", fontSize: "16px", fontWeight: 800 }}>{proj.title}</h4>
                            <p style={{ margin: 0, fontSize: "13px", color: "#475569", lineHeight: "1.5" }}>{proj.desc}</p>
                            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "12px" }}>
                              {proj.tags.map((t, tI) => (
                                <span key={tI} style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", padding: "2px 8px", borderRadius: "6px", fontSize: "10px", color: "#64748B", fontWeight: 700 }}>
                                  #{t}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div style={{ display: "flex", gap: "10px", paddingTop: "12px", borderTop: "1px solid #F3EBE1" }}>
                            <button
                              className="btnPrevLesson"
                              style={{ flex: 1, padding: "8px", fontSize: "12px" }}
                              onClick={() => {
                                window.open(proj.starterRepo, "_blank");
                                showToast("🔗 Starter repo opened on GitHub!");
                              }}
                            >
                              📁 Starter Code
                            </button>
                            <button
                              className="btnNextComplete"
                              style={{ flex: 1, padding: "8px", fontSize: "12px", background: isSubmitted ? "#10B981" : "#F9572A" }}
                              onClick={() => {
                                setActiveProjectForModal(proj);
                                setShowProjectModal(true);
                              }}
                            >
                              {isSubmitted ? "✓ Submitted" : "Submit Solution →"}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : activeSubTab === "resources" ? (
                /* ── 3. RESOURCES & CHEAT SHEETS TAB ── */
                <div style={{ background: "#FFFFFF", border: "1px solid #F3EBE1", borderRadius: "24px", padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #F3EBE1", paddingBottom: "16px" }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: "20px", fontWeight: 800 }}>Course Downloads & Learning Resources</h3>
                      <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#64748B" }}>Download cheatsheets, slide decks, and code examples for offline study.</p>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
                    {[
                      { title: "React 19 Hooks Quick Reference", type: "PDF Document", icon: "📄", file: "React_Hooks_Cheatsheet.pdf", content: "React Hooks Quick Reference Guide - SkillSphere 2026\n1. useState()\n2. useEffect()\n3. useContext()\n4. useReducer()\n5. useMemo() & useCallback()\n" },
                      { title: "Complete Module Presentation Slides", type: "PPTX Presentation", icon: "📊", file: "React_Masterclass_Deck.pptx", content: "SkillSphere React Masterclass Slides - Modules 1 to 6\n" },
                      { title: "React Architecture Cheat Sheet", type: "PDF Cheatsheet", icon: "📐", file: "React_Architecture_Guide.pdf", content: "Frontend System Design & React Architecture\nComponent Hierarchy, State Normalization, & HMR\n" },
                      { title: "Full Path GitHub Code Examples", type: "ZIP Source Code", icon: "💻", file: "React_Course_Code_Examples.zip", content: "SkillSphere React Course Source Code Repositories\n" }
                    ].map((res, rIdx) => (
                      <div key={rIdx} style={{ border: "1px solid #F3EBE1", borderRadius: "16px", padding: "18px", background: "#FFFBF7", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                          <span style={{ fontSize: "28px" }}>{res.icon}</span>
                          <div>
                            <h4 style={{ margin: 0, fontSize: "14px", fontWeight: 800 }}>{res.title}</h4>
                            <span style={{ fontSize: "11px", color: "#64748B" }}>{res.type} • Official Resource</span>
                          </div>
                        </div>
                        <button
                          className="btnNextComplete"
                          style={{ padding: "6px 12px", fontSize: "11px" }}
                          onClick={() => downloadResourceFile(res.title, res.file, res.content)}
                        >
                          <FaDownload /> Download
                        </button>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: "12px", padding: "16px", background: "#FAF8F5", borderRadius: "16px", border: "1px dashed #FAD6C8" }}>
                    <h5 style={{ margin: "0 0 6px 0", fontSize: "14px", fontWeight: 800, color: "#1E1B18" }}>Official Documentation Links:</h5>
                    <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", fontSize: "12px" }}>
                      <a href="https://react.dev" target="_blank" rel="noreferrer" style={{ color: "#F9572A", fontWeight: 700, textDecoration: "none" }}>🌐 React.dev Official Documentation ↗</a>
                      <a href="https://www.geeksforgeeks.org/reactjs-tutorials/" target="_blank" rel="noreferrer" style={{ color: "#F9572A", fontWeight: 700, textDecoration: "none" }}>📚 GeeksforGeeks React Tutorial Hub ↗</a>
                      <a href="https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/React_getting_started" target="_blank" rel="noreferrer" style={{ color: "#F9572A", fontWeight: 700, textDecoration: "none" }}>📖 MDN Web Docs React Guide ↗</a>
                    </div>
                  </div>
                </div>
              ) : activeSubTab === "leaderboard" ? (
                /* ── 4. LIVE PATH LEADERBOARD TAB ── */
                <div style={{ background: "#FFFFFF", border: "1px solid #F3EBE1", borderRadius: "24px", padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #F3EBE1", paddingBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: "20px", fontWeight: 800 }}>Path Leaderboard 🏆</h3>
                      <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#64748B" }}>Top learners ranked by total XP earned in the React Developer Path.</p>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {["all-time", "monthly", "weekly"].map(f => (
                        <button
                          key={f}
                          className={`lpPill ${leaderboardFilter === f ? "active" : ""}`}
                          onClick={() => setLeaderboardFilter(f)}
                          style={{ textTransform: "capitalize" }}
                        >
                          {f.replace('-', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Top 3 Podium */}
                  <div style={{ display: "flex", justifyContent: "center", gap: "16px", alignItems: "flex-end", padding: "20px 0" }}>
                    {[
                      { rank: 2, name: "NeonCoder", xp: 2900, medal: "🥈", bg: "#F1F5F9" },
                      { rank: 1, name: "CypherLearner", xp: 3500, medal: "🥇", bg: "#FEF3C7" },
                      { rank: 3, name: "ByteKnight", xp: 2600, medal: "🥉", bg: "#FFEDD5" }
                    ].map(top => (
                      <div key={top.rank} style={{ background: top.bg, border: "1px solid #F3EBE1", borderRadius: "18px", padding: "16px", width: "160px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                        <span style={{ fontSize: "28px" }}>{top.medal}</span>
                        <strong style={{ fontSize: "14px", color: "#1E1B18" }}>{top.name}</strong>
                        <span style={{ fontSize: "12px", fontWeight: 800, color: "#F9572A" }}>{top.xp} XP</span>
                      </div>
                    ))}
                  </div>

                  {/* Full Rankings Table */}
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
                      <thead>
                        <tr style={{ borderBottom: "2px solid #F3EBE1", color: "#64748B" }}>
                          <th style={{ padding: "10px" }}>Rank</th>
                          <th style={{ padding: "10px" }}>Learner</th>
                          <th style={{ padding: "10px" }}>Badge Title</th>
                          <th style={{ padding: "10px", textAlign: "right" }}>Total XP</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { rank: 1, name: "CypherLearner", xp: 3500, avatar: "👨‍💻", badge: "React Master", isSelf: false },
                          { rank: 2, name: "NeonCoder", xp: 2900, avatar: "⚡", badge: "Component Wizard", isSelf: false },
                          { rank: 3, name: "ByteKnight", xp: 2600, avatar: "🛡️", badge: "Hook Specialist", isSelf: false },
                          { rank: 4, name: userName, xp: currentXp, avatar: "🧑‍🎓", badge: "Active Student", isSelf: true },
                          { rank: 5, name: "PixelPioneer", xp: 2100, avatar: "🎨", badge: "UI Architect", isSelf: false },
                          { rank: 6, name: "SynthGuru", xp: 1800, avatar: "🔮", badge: "State Guru", isSelf: false }
                        ].map(row => (
                          <tr key={row.rank} style={{ borderBottom: "1px solid #F8FAFC", background: row.isSelf ? "#FFF0EB" : "transparent", fontWeight: row.isSelf ? 800 : 500 }}>
                            <td style={{ padding: "12px 10px" }}>#{row.rank}</td>
                            <td style={{ padding: "12px 10px", display: "flex", alignItems: "center", gap: "10px" }}>
                              <span>{row.avatar}</span>
                              <span>{row.name} {row.isSelf && <span style={{ background: "#F9572A", color: "#FFF", fontSize: "10px", padding: "2px 6px", borderRadius: "99px", marginLeft: "4px" }}>YOU</span>}</span>
                            </td>
                            <td style={{ padding: "12px 10px", color: "#64748B" }}>{row.badge}</td>
                            <td style={{ padding: "12px 10px", textAlign: "right", color: "#F9572A", fontWeight: 800 }}>{row.xp} XP</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                /* ── DEFAULT: PATH OVERVIEW & LESSON PLAYER WORKSPACE ── */
                <div className="lpdWorkspaceGrid">
                
                {/* 1. Left Step Roadmap Sidebar ("Your Learning Path") */}
                <div className="lpdRoadmapCol">
                  <h4>Your Learning Path</h4>

                  <div className="lpdStepsList">
                    {modulesListForActivePath.map((m, idx) => {
                      const isActive = activeModuleIndex === idx;
                      const modDoneCount = m.lessons.filter(l => completedSubLessonIds.includes(l.id)).length;
                      const isCompleted = modDoneCount === m.lessons.length;
                      return (
                        <div
                          key={m.id}
                          className={`lpdStepItem ${isActive ? "active" : ""}`}
                          onClick={() => {
                            setActiveModuleIndex(idx);
                            setActiveSubLessonIndex(0);
                            setIsPlayingVideo(false);
                          }}
                        >
                          <div className={`stepNumCircle ${isActive ? "orange" : isCompleted ? "orange" : "outline"}`}>
                            {m.num}
                            {isCompleted && (
                              <span className="stepCheckBadge"><FaCheckCircle /></span>
                            )}
                          </div>
                          <div className="stepDetails">
                            <h5>{m.subtitle}</h5>
                            <span>{modDoneCount} / {m.lessons.length} Lessons</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Track Quiz Challenge Box */}
                  <div
                    className="lpdQuizTrackBox"
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowQuizModal(true)}
                  >
                    <div>
                      <h5>🏆 Track Quiz Challenge</h5>
                      <span>20 Marks • Earn +50 XP</span>
                    </div>
                  </div>
                </div>

                {/* 2. Center Active Lesson Player & Resource Box */}
                <div className="lpdPlayerCol">
                  
                  {/* Current Module Title Header */}
                  <div className="lpdLessonHeader">
                    <div className="lessonHeaderLeft">
                      <span className="currentTag">&gt; MODULE {activeModuleIndex + 1} OF {modulesListForActivePath.length}</span>
                      <h3>{activeModule.title}</h3>
                      <p>Progress in this module: <strong>{currentModuleCompletedCount} / {activeModule.lessons.length} Sub-Lessons Completed</strong></p>
                    </div>

                    <div className="lessonHeaderRight">
                      {isCurrentModuleFullyCompleted ? (
                        <span className="completedPill">✓ Module Completed</span>
                      ) : (
                        <span className="completedPill" style={{ background: "#FFF0EB", color: "#F9572A" }}>In Progress ({currentModuleCompletedCount}/{activeModule.lessons.length})</span>
                      )}
                      <div className="xpRewardPill">
                        <FaBolt color="#F9572A" /> +20 XP / Lesson
                      </div>
                    </div>
                  </div>

                  {/* Sub-Lesson Selector Bar */}
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", margin: "4px 0 12px 0" }}>
                    {activeModule.lessons.map((les, subIdx) => {
                      const isSubActive = activeSubLessonIndex === subIdx;
                      const isSubDone = completedSubLessonIds.includes(les.id);
                      return (
                        <button
                          key={les.id}
                          onClick={() => {
                            setActiveSubLessonIndex(subIdx);
                            setIsPlayingVideo(false);
                          }}
                          style={{
                            padding: "6px 14px",
                            borderRadius: "99px",
                            border: isSubActive ? "1px solid #F9572A" : "1px solid #E2E8F0",
                            background: isSubActive ? "#FFF0EB" : isSubDone ? "#ECFDF5" : "#FFFFFF",
                            color: isSubActive ? "#F9572A" : isSubDone ? "#10B981" : "#64748B",
                            fontSize: "11px",
                            fontWeight: 700,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px"
                          }}
                        >
                          {isSubDone && <FaCheckCircle size={10} color="#10B981" />}
                          {les.title.split(' ')[0]} {les.type === "video" ? "📹" : "📄"}
                        </button>
                      );
                    })}
                  </div>

                  {/* Lesson Content Body: Article vs Video */}
                  <div className="lpdPlayerCard" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    
                    {/* Header line for active sub-lesson */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #F3EBE1", paddingBottom: "10px" }}>
                      <h4 style={{ margin: 0, fontSize: "16px", fontWeight: 800 }}>{activeSubLesson.title}</h4>
                      <div style={{ display: "flex", gap: "10px", fontSize: "11px" }}>
                        <span style={{ background: "#F1F5F9", padding: "4px 10px", borderRadius: "99px", color: "#475569", fontWeight: 700 }}>
                          {activeSubLesson.source || "GeeksforGeeks Docs"}
                        </span>
                        <span style={{ background: "#FFF0EB", padding: "4px 10px", borderRadius: "99px", color: "#F9572A", fontWeight: 700 }}>
                          {activeSubLesson.duration}
                        </span>
                      </div>
                    </div>

                    {activeSubLesson.type === "reading" ? (
                      /* Written Article View (GFG & Official Docs Style) */
                      <div className="readingArticleContainer" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                        <h5 style={{ margin: 0, fontSize: "15px", color: "#1E1B18", fontWeight: 800 }}>
                          {activeSubLesson.heading}
                        </h5>
                        <p style={{ margin: 0, fontSize: "13px", lineHeight: "1.6", color: "#475569" }}>
                          {activeSubLesson.text}
                        </p>

                        {/* Code Snippet Box */}
                        {activeSubLesson.codeSnippet && (
                          <div style={{ background: "#0F172A", color: "#38BDF8", borderRadius: "14px", padding: "16px", fontFamily: "monospace", fontSize: "12px", overflowX: "auto", boxShadow: "0 4px 14px rgba(0,0,0,0.1)" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", color: "#94A3B8", fontSize: "10px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "6px", marginBottom: "10px" }}>
                              <span>CODE EXAMPLE (JavaScript / JSX)</span>
                              <span>SkillSphere Playground Ready</span>
                            </div>
                            <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>{activeSubLesson.codeSnippet}</pre>
                          </div>
                        )}

                        {/* Key Takeaways Box */}
                        {activeSubLesson.keyPoints && (
                          <div className="whatYouLearnBox" style={{ background: "#FAF8F5", border: "1px solid #F3EBE1", padding: "14px", borderRadius: "14px" }}>
                            <h5 style={{ margin: "0 0 10px 0", fontSize: "12px", fontWeight: 800, color: "#1E1B18" }}>Key Concepts & Takeaways:</h5>
                            <ul className="learnChecklist">
                              {activeSubLesson.keyPoints.map((kp, kIdx) => (
                                <li key={kIdx} style={{ fontSize: "12px", color: "#475569" }}>
                                  <FaCheck color="#10B981" /> {kp}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* GeeksforGeeks (GFG) Reference Notes & Revision Module */}
                        <div className="gfg-notes-section" style={{
                          marginTop: '16px',
                          background: '#f8fafc',
                          border: '1px solid #2ecc71',
                          borderRadius: '14px',
                          padding: '18px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '18px' }}>📖</span>
                              <h5 style={{ margin: 0, color: '#2ecc71', fontSize: '13px', fontWeight: 800 }}>
                                GeeksforGeeks (GFG) Full Revision Notes & Article Reference
                              </h5>
                            </div>
                            <span style={{
                              fontSize: '9px',
                              fontWeight: '700',
                              background: 'rgba(46, 204, 113, 0.1)',
                              color: '#2ecc71',
                              border: '1px solid rgba(46, 204, 113, 0.3)',
                              padding: '2px 8px',
                              borderRadius: '20px'
                            }}>
                              GFG Verified
                            </span>
                          </div>
                          <p style={{ color: '#475569', fontSize: '12px', lineHeight: '1.5', margin: '0 0 10px 0' }}>
                            Full conceptual guides, time-complexity analysis, and interview prep cheat sheets compiled from GeeksforGeeks articles for <strong>{activeSubLesson.title}</strong>.
                          </p>
                          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            <a 
                              href={
                                activePathData.title?.toLowerCase().includes("python")
                                  ? "https://www.geeksforgeeks.org/python-programming-language/"
                                  : activePathData.title?.toLowerCase().includes("node")
                                  ? "https://www.geeksforgeeks.org/nodejs/"
                                  : activePathData.title?.toLowerCase().includes("figma") || activePathData.title?.toLowerCase().includes("ux")
                                  ? "https://www.geeksforgeeks.org/ui-ux-design-basics/"
                                  : "https://www.geeksforgeeks.org/reactjs-tutorials/"
                              } 
                              target="_blank" 
                              rel="noreferrer" 
                              style={{ color: '#2ecc71', fontSize: '12px', fontWeight: '700', textDecoration: 'none' }}
                            >
                              🔗 View Full GeeksforGeeks Article Notes ↗
                            </a>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Video Player View (Final sub-lesson step) */
                      <div>
                        <div className="videoScreenBox">
                          {isPlayingVideo ? (
                            <>
                              <button
                                className="videoCloseBtn"
                                onClick={() => setIsPlayingVideo(false)}
                                title="Close Video"
                              >
                                ✕
                              </button>
                              <iframe
                                className="videoIframeEmbed"
                                src={activeSubLesson.videoUrl}
                                title={activeSubLesson.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            </>
                          ) : (
                            <>
                              <div className="reactBgGraphic">⚛️</div>
                              <div
                                className="playBtnCircle"
                                onClick={() => setIsPlayingVideo(true)}
                                title="Click to Play Masterclass Video"
                              >
                                <FaPlay />
                              </div>
                              <span className="videoTitleOverlay">
                                {activeSubLesson.heading.toUpperCase()} — CLICK TO WATCH VIDEO
                              </span>
                            </>
                          )}
                        </div>

                        <p style={{ marginTop: "12px", fontSize: "13px", color: "#475569" }}>
                          {activeSubLesson.description}
                        </p>
                      </div>
                    )}

                  </div>

                  <div className="instructorLine">
                    Instructor: <strong>{activeModule.instructor}</strong> • Content Partner: <strong>GeeksforGeeks & React Docs</strong>
                  </div>

                  {/* 4 Action Resource Buttons */}
                  <div className="resourceButtonsGrid">
                    <div
                      className="resBtn"
                      onClick={() => showToast("📄 Downloading React_Quick_Notes.pdf...")}
                    >
                      <div className="resIcon orange"><FaFilePdf /></div>
                      <div>
                        <strong>Quick Notes</strong>
                        <span>Download PDF</span>
                      </div>
                    </div>

                    <div
                      className="resBtn"
                      onClick={() => {
                        window.open("https://github.com/hiteshchoudhary/js-hindi-youtube", "_blank");
                        showToast("🔗 Opening GitHub repository...");
                      }}
                    >
                      <div className="resIcon dark"><FaGithub /></div>
                      <div>
                        <strong>Code Examples</strong>
                        <span>View on GitHub</span>
                      </div>
                    </div>

                    <div
                      className="resBtn"
                      onClick={() => showToast("📊 Downloading React_Slides.pptx...")}
                    >
                      <div className="resIcon orange"><FaFilePowerpoint /></div>
                      <div>
                        <strong>Slides</strong>
                        <span>Download PPT</span>
                      </div>
                    </div>

                    <div
                      className="resBtn"
                      onClick={() => setShowDiscussionModal(true)}
                    >
                      <div className="resIcon green"><FaComments /></div>
                      <div>
                        <strong>Discussion</strong>
                        <span>Join Discussion ({discussionsList.length})</span>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Control Bar */}
                  <div className="playerNavControlBar">
                    <button
                      className="btnPrevLesson"
                      onClick={handlePrevLesson}
                      disabled={activeModuleIndex === 0 && activeSubLessonIndex === 0}
                      style={{ opacity: activeModuleIndex === 0 && activeSubLessonIndex === 0 ? 0.5 : 1, cursor: activeModuleIndex === 0 && activeSubLessonIndex === 0 ? "not-allowed" : "pointer" }}
                    >
                      ← Previous Sub-Lesson
                    </button>
                    <button
                      className="btnNextComplete"
                      onClick={handleMarkComplete}
                    >
                      {completedSubLessonIds.includes(activeSubLesson.id) ? "Next Sub-Lesson →" : "Mark as Complete & Next →"}
                    </button>
                  </div>

                </div>

                {/* 3. Right Widgets */}
                <div className="lpdRightCol">
                  
                  {/* Path Progress Gauge */}
                  <div className="lpWidgetCard">
                    <h4>Path Progress</h4>

                    <div className="lpProgressGaugeContainer">
                      <svg className="gaugeSvg" viewBox="0 0 100 100">
                        <circle className="gaugeBg" cx="50" cy="50" r="40" />
                        <circle
                          className="gaugeFill"
                          cx="50"
                          cy="50"
                          r="40"
                          strokeDasharray="251.2"
                          strokeDashoffset={strokeOffset}
                        />
                      </svg>
                      <div className="gaugeCenterText">
                        <strong>{progressPct}%</strong>
                      </div>
                    </div>

                    <div className="gaugeSubtextRow">
                      <span>{totalCompletedSubLessonsCount} / {totalSubLessonsInPath} Sub-Lessons Completed</span>
                      <div className="gaugeBottomTrack">
                        <div className="gaugeBottomFill" style={{ width: `${progressPct}%` }}></div>
                      </div>
                    </div>
                  </div>

                  {/* Up Next Card */}
                  <div className="lpWidgetCard">
                    <h4>Up Next</h4>
                    {activeModule.lessons[activeSubLessonIndex + 1] ? (
                      <div className="upNextBox">
                        <h5>{activeModule.lessons[activeSubLessonIndex + 1].title}</h5>
                        <p>{activeModule.lessons[activeSubLessonIndex + 1].heading}</p>
                        <button
                          className="btnStartNext"
                          onClick={() => {
                            setActiveSubLessonIndex(activeSubLessonIndex + 1);
                            setIsPlayingVideo(false);
                          }}
                        >
                          Start →
                        </button>
                      </div>
                    ) : modulesListForActivePath[activeModuleIndex + 1] ? (
                      <div className="upNextBox">
                        <h5>{modulesListForActivePath[activeModuleIndex + 1].title}</h5>
                        <p>Module {activeModuleIndex + 2} overview</p>
                        <button
                          className="btnStartNext"
                          onClick={() => {
                            setActiveModuleIndex(activeModuleIndex + 1);
                            setActiveSubLessonIndex(0);
                            setIsPlayingVideo(false);
                          }}
                        >
                          Next Module →
                        </button>
                      </div>
                    ) : (
                      <div className="upNextBox">
                        <h5>🏆 Path Complete!</h5>
                        <p>You have mastered all modules in this learning path.</p>
                        <button
                          className="btnStartNext"
                          onClick={() => navigate('/certificate')}
                        >
                          Get Certificate →
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Recent Achievements */}
                  <div className="lpWidgetCard">
                    <div className="achievementsHeaderRow">
                      <h4>Recent Achievements</h4>
                    </div>

                    <div className="achievementsList">
                      <div className="achieveItem">
                        <div className="achieveIcon yellow"><FaTrophy /></div>
                        <div className="achieveText">
                          <h5>Quiz Master</h5>
                          <span>Scored 90%+ in a quiz</span>
                        </div>
                        <span className="achieveTime">2 days ago</span>
                      </div>

                      <div className="achieveItem">
                        <div className="achieveIcon orange"><FaBolt /></div>
                        <div className="achieveText">
                          <h5>Consistent Learner</h5>
                          <span>7 day learning streak</span>
                        </div>
                        <span className="achieveTime">3 days ago</span>
                      </div>

                      <div className="achieveItem">
                        <div className="achieveIcon orange"><FaMedal /></div>
                        <div className="achieveText">
                          <h5>Quick Learner</h5>
                          <span>Completed 3 lessons in a day</span>
                        </div>
                        <span className="achieveTime">5 days ago</span>
                      </div>
                    </div>

                    <div className="viewAllAchievementsLink" onClick={() => navigate('/badges')}>
                      View All Achievements →
                    </div>
                  </div>

                </div>
              </div>
              )}

              {/* ── FLOATING TOAST NOTIFICATION ── */}
              {toastMsg && (
                <div className="lpToastBanner">
                  <span>{toastMsg}</span>
                </div>
              )}

              {/* ── PROJECT SUBMISSION MODAL ── */}
              {showProjectModal && activeProjectForModal && (
                <div className="lpModalOverlay" onClick={() => setShowProjectModal(false)}>
                  <div className="lpModalContent" onClick={(e) => e.stopPropagation()}>
                    <div className="modalHeader">
                      <h3>🚀 Submit Project Solution</h3>
                      <button className="modalCloseBtn" onClick={() => setShowProjectModal(false)}>✕</button>
                    </div>

                    <div style={{ marginBottom: "16px" }}>
                      <h4 style={{ margin: "0 0 4px 0", fontSize: "15px", fontWeight: 800 }}>{activeProjectForModal.title}</h4>
                      <p style={{ margin: 0, fontSize: "12px", color: "#64748B" }}>Earn +{activeProjectForModal.xpVal} XP upon submission!</p>
                    </div>

                    <form onSubmit={handleProjectSubmit}>
                      <div style={{ marginBottom: "14px" }}>
                        <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "6px" }}>
                          GitHub Repository or Live Demo URL:
                        </label>
                        <input
                          type="url"
                          required
                          placeholder="https://github.com/username/project-repo"
                          value={projectRepoUrl}
                          onChange={(e) => setProjectRepoUrl(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "10px 14px",
                            borderRadius: "12px",
                            border: "1px solid #CBD5E1",
                            fontSize: "13px",
                            outline: "none"
                          }}
                        />
                      </div>

                      <button
                        type="submit"
                        className="btnNextComplete"
                        style={{ width: "100%", marginTop: "12px" }}
                      >
                        Submit Project & Claim +{activeProjectForModal.xpVal} XP →
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* ── TRACK QUIZ CHALLENGE MODAL (20 QUESTIONS WITH GFG & W3SCHOOLS REFS) ── */}
              {showQuizModal && (
                <div className="lpModalOverlay" onClick={() => setShowQuizModal(false)}>
                  <div className="lpModalContent" style={{ maxWidth: "780px", maxHeight: "85vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
                    <div className="modalHeader">
                      <div>
                        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 800 }}>🏆 Track Quiz Challenge: React & Web Development</h3>
                        <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#64748B" }}>20 Multiple Choice Questions • Reference: GeeksforGeeks & W3Schools Documentation</p>
                      </div>
                      <button className="modalCloseBtn" onClick={() => setShowQuizModal(false)}>✕</button>
                    </div>

                    <form onSubmit={handleQuizSubmit} style={{ marginTop: "16px" }}>
                      {[
                        {
                          id: 1,
                          q: "What is the primary purpose of React JSX?",
                          options: ["A. Write HTML-like syntax inside JavaScript", "B. Directly compile CSS stylesheets", "C. Execute SQL database queries in the browser", "D. Replace Node.js runtime engines"],
                          correct: 0,
                          ref: "W3Schools: React JSX Guide",
                          explanation: "JSX allows writing HTML-like tags in JavaScript which React converts into React.createElement() calls."
                        },
                        {
                          id: 2,
                          q: "Which hook is used to handle side effects in React functional components?",
                          options: ["A. useState()", "B. useEffect()", "C. useContext()", "D. useReducer()"],
                          correct: 1,
                          ref: "GeeksforGeeks: ReactJS useEffect Hook",
                          explanation: "useEffect handles side effects such as data fetching, subscriptions, and DOM updates."
                        },
                        {
                          id: 3,
                          q: "How do you pass data from a parent to a child component in React?",
                          options: ["A. Via Props", "B. Via localStorage", "C. Via Redux reducers only", "D. Via HTTP POST requests"],
                          correct: 0,
                          ref: "W3Schools: React Props",
                          explanation: "Props are read-only properties passed down from parent components to child components."
                        },
                        {
                          id: 4,
                          q: "What is the Virtual DOM in React?",
                          options: ["A. A lightweight in-memory representation of the real DOM", "B. A database table inside Google Chrome", "C. A physical CPU hardware chip", "D. An alternative to HTML5 tags"],
                          correct: 0,
                          ref: "GeeksforGeeks: ReactJS Virtual DOM",
                          explanation: "React maintains a Virtual DOM in memory and diffs it with previous state to optimize DOM updates."
                        },
                        {
                          id: 5,
                          q: "What is the correct way to update state using useState in React?",
                          options: ["A. Direct mutation: state = newValue", "B. Call updater function: setScore(newValue)", "C. Call window.location.reload()", "D. Modify document.getElementById().value"],
                          correct: 1,
                          ref: "W3Schools: React useState Hook",
                          explanation: "Calling the updater function returned by useState schedules a re-render and updates state immutably."
                        },
                        {
                          id: 6,
                          q: "Which rule MUST be followed when calling React Hooks?",
                          options: ["A. Call hooks inside loops and conditional if blocks", "B. Call hooks only at the top level of functional components", "C. Call hooks inside class constructors only", "D. Call hooks inside utility helper files"],
                          correct: 1,
                          ref: "GeeksforGeeks: Rules of Hooks in React",
                          explanation: "Hooks must be called at the top level to guarantee that Hooks are called in the exact same order on every render."
                        },
                        {
                          id: 7,
                          q: "What is the primary function of the 'key' prop when rendering lists in React?",
                          options: ["A. Helps React identify which list items have changed, added, or removed", "B. Styles list items with dynamic background colors", "C. Encrypts list item data in local storage", "D. Automatically sorts list items alphabetically"],
                          correct: 0,
                          ref: "W3Schools: React Keys & Lists",
                          explanation: "Keys give list elements a stable identity so React can efficiently re-render changed elements."
                        },
                        {
                          id: 8,
                          q: "What is the role of the useMemo hook in React performance optimization?",
                          options: ["A. Memoizes the result of an expensive calculation between re-renders", "B. Sends HTTP GET requests to external APIs", "C. Stores component state inside browser memory cache", "D. Defines dynamic route parameters"],
                          correct: 0,
                          ref: "GeeksforGeeks: React useMemo Hook",
                          explanation: "useMemo caches calculated values and only recalculates when one of its dependencies changes."
                        },
                        {
                          id: 9,
                          q: "How does React Context API solve the problem of Prop Drilling?",
                          options: ["A. Shares global state directly down component tree without passing props manually", "B. Compiles React code into WebAssembly binaries", "C. Converts class components to functional components", "D. Connects React directly to MongoDB"],
                          correct: 0,
                          ref: "W3Schools: React useContext Hook",
                          explanation: "Context provides a way to share state like user authentication or theme across components without prop drilling."
                        },
                        {
                          id: 10,
                          q: "In JavaScript, what is a Closure?",
                          options: ["A. A function bundled together with references to its outer scope environment", "B. A browser button that closes the active window", "C. A statement that breaks out of a while loop", "D. A private CSS variable definition"],
                          correct: 0,
                          ref: "GeeksforGeeks: JavaScript Closures",
                          explanation: "Closures give functions access to variables in their parent scope even after the parent function has executed."
                        },
                        {
                          id: 11,
                          q: "What does the JavaScript Event Loop monitor?",
                          options: ["A. Monitors Call Stack and Microtask Queue to push async callbacks onto Call Stack", "B. Renders CSS flexbox elements on screen", "C. Compiles Java code into bytecode", "D. Manages SQL database connection pools"],
                          correct: 0,
                          ref: "GeeksforGeeks: JavaScript Event Loop",
                          explanation: "The Event Loop continuously checks if Call Stack is empty, pushing tasks from Microtask and Callback queues."
                        },
                        {
                          id: 12,
                          q: "Which ES6 feature unpacks values from arrays or properties from objects into distinct variables?",
                          options: ["A. Destructuring Assignment", "B. Array Splice", "C. Prototype Inheritance", "D. CommonJS Exports"],
                          correct: 0,
                          ref: "W3Schools: ES6 Destructuring",
                          explanation: "Destructuring syntax unpacks object properties or array items cleanly into local variables."
                        },
                        {
                          id: 13,
                          q: "What is the key difference between call(), apply(), and bind() in JavaScript?",
                          options: ["A. call() & apply() invoke function immediately; bind() returns a new function", "B. bind() deletes object properties from memory", "C. apply() only works on string parameters", "D. call() is used exclusively in Node.js"],
                          correct: 0,
                          ref: "GeeksforGeeks: call(), apply() vs bind()",
                          explanation: "call() takes args individually, apply() takes an array of args, and bind() returns a new function."
                        },
                        {
                          id: 14,
                          q: "What makes Node.js architecture non-blocking and asynchronous?",
                          options: ["A. Offloads I/O tasks to background libuv thread pool while Event Loop remains free", "B. Stops main thread until all file reads finish", "C. Spawns physical C++ GUI windows for each request", "D. Executes synchronous queries only"],
                          correct: 0,
                          ref: "GeeksforGeeks: Node.js Architecture & Libuv",
                          explanation: "Node.js uses an event-driven non-blocking I/O model backed by libuv to handle thousands of concurrent connections."
                        },
                        {
                          id: 15,
                          q: "What is Express.js Middleware?",
                          options: ["A. Functions that have access to req, res objects and next() in HTTP cycle", "B. A database ORM for MySQL", "C. A CSS frontend UI library", "D. A Chrome browser extension"],
                          correct: 0,
                          ref: "W3Schools: Node.js Express Middleware",
                          explanation: "Middleware functions process incoming HTTP requests, modify req/res objects, or trigger error handling."
                        },
                        {
                          id: 16,
                          q: "In Mongoose, what is a Schema?",
                          options: ["A. A document structure blueprint defining field types, defaults, and validators for MongoDB", "B. A SQL JOIN query string", "C. A CSS layout grid", "D. A web router table"],
                          correct: 0,
                          ref: "GeeksforGeeks: Mongoose Schema & Models",
                          explanation: "Mongoose schemas define shape, data types, and validation rules for documents stored in MongoDB collections."
                        },
                        {
                          id: 17,
                          q: "What does React.memo HOC accomplish?",
                          options: ["A. Skips re-rendering a component if its incoming props are unchanged", "B. Stores component state in browser IndexedDB", "C. Forces full browser window reloads", "D. Converts JSX into HTML string"],
                          correct: 0,
                          ref: "GeeksforGeeks: React.memo Performance",
                          explanation: "React.memo is a higher-order component that memoizes functional component render outputs based on prop equality."
                        },
                        {
                          id: 18,
                          q: "Why do Single Page Applications (SPAs) use Client-Side Routing?",
                          options: ["A. Updates URL and renders view components dynamically without reloading HTML page", "B. Reloads complete HTML files from server on every click", "C. Clears localStorage data on navigation", "D. Prevents users from clicking back buttons"],
                          correct: 0,
                          ref: "W3Schools: React Router SPAs",
                          explanation: "Client-side routing swaps components in the DOM dynamically, providing fast seamless navigation without page reloads."
                        },
                        {
                          id: 19,
                          q: "What does the useRef hook return in React?",
                          options: ["A. A mutable object with a .current property that persists across component re-renders", "B. A state variable and state setter pair", "C. A JavaScript Promise", "D. An array of DOM nodes"],
                          correct: 0,
                          ref: "GeeksforGeeks: React useRef Hook",
                          explanation: "useRef returns a mutable object whose .current property holds a reference to a DOM node or persistent value without triggering re-renders."
                        },
                        {
                          id: 20,
                          q: "What is the primary role of Redux Toolkit Slices?",
                          options: ["A. Bundles state, reducer logic, and action creators for a specific feature module", "B. Styles React buttons with CSS tokens", "C. Handles server SQL migrations", "D. Compresses image files before submission"],
                          correct: 0,
                          ref: "GeeksforGeeks: Redux Toolkit Slices",
                          explanation: "A slice in Redux Toolkit defines the initial state, reducer functions, and auto-generates corresponding action creators."
                        }
                      ].map((item) => (
                        <div key={item.id} className="quizQuestionCard" style={{ marginBottom: "16px", padding: "16px", background: isDarkMode ? "#1E293B" : "#FAF8F5", border: "1px solid #E2E8F0", borderRadius: "16px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                            <strong style={{ fontSize: "14px", color: isDarkMode ? "#F8FAFC" : "#1E1B18" }}>Q{item.id}. {item.q}</strong>
                            <span style={{ fontSize: "10px", fontWeight: 800, background: "#FFF0EB", color: "#F9572A", padding: "2px 8px", borderRadius: "99px", border: "1px solid #FAD6C8" }}>
                              {item.ref}
                            </span>
                          </div>

                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "10px" }}>
                            {item.options.map((opt, optIdx) => (
                              <button
                                key={optIdx}
                                type="button"
                                className={`quizOptionBtn ${userAnswers[item.id] === optIdx ? "selected" : ""}`}
                                onClick={() => setUserAnswers(p => ({ ...p, [item.id]: optIdx }))}
                                style={{
                                  textAlign: "left",
                                  padding: "10px 14px",
                                  fontSize: "12px",
                                  borderRadius: "12px",
                                  border: userAnswers[item.id] === optIdx ? "2px solid #F9572A" : "1px solid #CBD5E1",
                                  background: userAnswers[item.id] === optIdx ? (isDarkMode ? "#334155" : "#FFF0EB") : (isDarkMode ? "#0F172A" : "#FFFFFF"),
                                  color: userAnswers[item.id] === optIdx ? "#F9572A" : (isDarkMode ? "#F8FAFC" : "#1E1B18"),
                                  cursor: "pointer",
                                  fontWeight: userAnswers[item.id] === optIdx ? 700 : 500
                                }}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>

                          {userAnswers[item.id] !== undefined && (
                            <div style={{ marginTop: "10px", padding: "8px 12px", borderRadius: "8px", background: userAnswers[item.id] === item.correct ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)", border: userAnswers[item.id] === item.correct ? "1px solid #86EFAC" : "1px solid #FCA5A5", fontSize: "11px", color: userAnswers[item.id] === item.correct ? "#15803D" : "#B91C1C" }}>
                              <strong>{userAnswers[item.id] === item.correct ? "✓ Correct!" : "✗ Incorrect."}</strong> {item.explanation}
                            </div>
                          )}
                        </div>
                      ))}

                      <button
                        type="submit"
                        className="btnNextComplete"
                        style={{ width: "100%", marginTop: "16px", padding: "12px", fontSize: "14px", fontWeight: 800, background: "#F9572A", color: "#FFF", borderRadius: "99px", border: "none", cursor: "pointer" }}
                      >
                        Submit All 20 Quiz Answers & Claim Certificate →
                      </button>

                      <button
                        type="button"
                        onClick={handleInstantUnlockAll}
                        style={{
                          width: "100%",
                          marginTop: "8px",
                          background: "#FFF0EB",
                          color: "#F9572A",
                          border: "1px dashed #FAD6C8",
                          padding: "10px",
                          borderRadius: "99px",
                          fontSize: "12px",
                          fontWeight: 700,
                          cursor: "pointer"
                        }}
                      >
                        ⚡ Instant Unlock Test: Complete All 6 Modules & Claim Certificate
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* ── CERTIFICATE UNLOCKED MODAL ── */}
              {showCertificateModal && (
                <div className="lpModalOverlay" onClick={() => setShowCertificateModal(false)}>
                  <div className="certModalContent" onClick={(e) => e.stopPropagation()}>
                    <button className="modalCloseBtn" onClick={() => setShowCertificateModal(false)} style={{ position: "absolute", top: "16px", right: "20px" }}>✕</button>

                    <div className="certBadgeCircle">
                      🎓
                    </div>

                    <div style={{ color: "#F59E0B", fontWeight: 800, fontSize: "12px", letterSpacing: "2px", marginBottom: "4px" }}>
                      ★ OFFICIAL CERTIFICATION UNLOCKED ★
                    </div>

                    <h2 className="certTitle">Certificate of Completion</h2>

                    <p style={{ fontSize: "13px", color: "#64748B", margin: "4px 0 16px 0" }}>
                      This is to certify that
                    </p>

                    <div className="certRecipientName">
                      {userName}
                    </div>

                    <p style={{ fontSize: "14px", color: "#475569", margin: "10px 0 16px 0", lineHeight: "1.6" }}>
                      has successfully mastered all <strong>6 Modules (30 Lessons)</strong> and passed the <strong>Track Quiz Challenge</strong> in the <strong>React Developer Professional Learning Path</strong>.
                    </p>

                    <div style={{ display: "flex", justifyContent: "space-around", borderTop: "1px dashed #FAD6C8", borderBottom: "1px dashed #FAD6C8", padding: "14px 0", margin: "16px 0", fontSize: "12px", color: "#64748B" }}>
                      <div>
                        <strong>Issued By:</strong><br />
                        SkillSphere Nexus
                      </div>
                      <div>
                        <strong>Date:</strong><br />
                        {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <div>
                        <strong>Verification Code:</strong><br />
                        SKILL-REACT-2026-8849
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                      <button
                        className="certBtnDownload"
                        onClick={handleDownloadCertificate}
                      >
                        <FaDownload /> Download Certificate (PDF)
                      </button>

                      <button
                        className="btnPrevLesson"
                        onClick={() => setShowCertificateModal(false)}
                        style={{ marginTop: "20px" }}
                      >
                        Close View
                      </button>
                    </div>

                  </div>
                </div>
              )}

              {/* ── DISCUSSION MODAL ── */}
              {showDiscussionModal && (
                <div className="lpModalOverlay" onClick={() => setShowDiscussionModal(false)}>
                  <div className="lpModalContent" onClick={(e) => e.stopPropagation()}>
                    <div className="modalHeader">
                      <h3>💬 Lesson Discussion Board</h3>
                      <button className="modalCloseBtn" onClick={() => setShowDiscussionModal(false)}>✕</button>
                    </div>

                    <form onSubmit={handleAddDiscussion} style={{ marginBottom: "20px" }}>
                      <textarea
                        value={discussionInput}
                        onChange={(e) => setDiscussionInput(e.target.value)}
                        placeholder="Ask a question or share a thought about this lesson..."
                        style={{
                          width: "100%",
                          height: "70px",
                          borderRadius: "12px",
                          border: "1px solid #E2E8F0",
                          padding: "10px",
                          fontSize: "13px",
                          fontFamily: "inherit",
                          outline: "none",
                          resize: "none"
                        }}
                      />
                      <button type="submit" className="btnNextComplete" style={{ marginTop: "8px" }}>
                        Post Comment
                      </button>
                    </form>

                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {discussionsList.map(item => (
                        <div key={item.id} className="discussionPostItem">
                          <div className="discussionAuthorRow">
                            <strong>{item.author}</strong>
                            <span style={{ color: "#94A3B8" }}>• {item.time}</span>
                          </div>
                          <p style={{ margin: 0, fontSize: "13px", color: "#475569" }}>{item.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>
          ) : (
            /* ── OVERVIEW LEARNING PATHS LIST ── */
            <>
              {/* Page Heading */}
              <div className="lpPageHeader">
                <h1>Learning Paths <FaCodeBranch style={{ fontSize: "24px", color: "#F9572A" }} /></h1>
                <p>Your roadmap to mastering in-demand skills</p>
              </div>

              {/* Main 2-Column Content Grid */}
              <div className="lpGridContainer" style={{ gridTemplateColumns: "minmax(0, 1fr)" }}>
                
                {/* Center Main Column */}
                <div className="lpCenterColumn">
                  
                  {/* Filter Pills & Sort Bar Row */}
                  <div className="lpFilterSortRow">
                    <div className="lpFilterPills">
                      <button
                        className={`lpPill ${filter === "all" ? "active" : ""}`}
                        onClick={() => setFilter("all")}
                      >
                        My Enrolled Paths ({enrolledCount})
                      </button>
                      <button
                        className={`lpPill ${filter === "in-progress" ? "active" : ""}`}
                        onClick={() => setFilter("in-progress")}
                      >
                        In Progress ({inProgressCount})
                      </button>
                      <button
                        className={`lpPill ${filter === "completed" ? "active" : ""}`}
                        onClick={() => setFilter("completed")}
                      >
                        Completed ({completedCount})
                      </button>
                      <button
                        className={`lpPill ${filter === "saved" ? "active" : ""}`}
                        onClick={() => setFilter("saved")}
                      >
                        Saved ({savedCount})
                      </button>
                    </div>

                    <div className="lpSortSelectWrapper">
                      <select
                        className="lpSortSelect"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                      >
                        <option value="recent">Sort by: Recently Accessed</option>
                        <option value="progress">Sort by: Progress %</option>
                      </select>
                    </div>
                  </div>

                  {/* Learning Path Cards Grid */}
                  <div className="lpCardsCarouselRow">
                    {sortedLearningPaths.length === 0 ? (
                      <div style={{ padding: "30px", textAlign: "center", width: "100%", color: "#64748B" }}>
                        <p style={{ margin: 0, fontSize: "14px", fontWeight: 700 }}>
                          No learning paths found under "{filter === "all" ? "My Enrolled Paths" : filter === "in-progress" ? "In Progress" : filter === "completed" ? "Completed" : "Saved"}".
                        </p>
                      </div>
                    ) : (
                      sortedLearningPaths.map((card) => {
                        const isSaved = savedPathIds.includes(card.id);
                        return (
                          <div
                            key={card.id}
                            className="lpPathCard"
                            onClick={() => openPathDetail(card.title)}
                          >
                            <div className={`lpCardBanner ${card.bannerType}`}>
                              <div style={{ position: "absolute", top: "12px", right: "12px", display: "flex", gap: "8px", zIndex: 5 }}>
                                <button
                                  type="button"
                                  onClick={(e) => toggleSavePath(card.id, e)}
                                  title={isSaved ? "Remove from Saved" : "Save for later"}
                                  style={{
                                    background: "rgba(0,0,0,0.3)",
                                    border: "none",
                                    borderRadius: "50%",
                                    width: "28px",
                                    height: "28px",
                                    color: isSaved ? "#F59E0B" : "#FFFFFF",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                  }}
                                >
                                  {isSaved ? <FaBookmark size={12} /> : <FaRegBookmark size={12} />}
                                </button>
                              </div>

                              <span className={`lpStatusBadge ${card.status}`}>
                                {card.statusText}
                              </span>

                              {card.bannerType === "js" && (
                                <div className="bannerIconJs">
                                  <img src={jsBadgeImg} alt="JavaScript Logo" style={{ width: "38px", height: "38px", objectFit: "contain" }} />
                                </div>
                              )}
                              {card.bannerType === "react" && (
                                <div className="bannerIconReact">
                                  <img src={reactLogoImg} alt="React Logo" style={{ width: "32px", height: "32px", objectFit: "contain" }} />
                                </div>
                              )}
                              {card.bannerType === "python" && <div className="bannerIconPython">🐍</div>}
                              {card.bannerType === "node" && <div className="bannerIconNode">🟩 Node.js</div>}
                              {card.bannerType === "figma" && <div className="bannerIconFigma">🎨</div>}
                              {card.bannerType === "cloud" && <div className="bannerIconNode">☁️ Cloud</div>}
                              {card.bannerType === "ai" && <div className="bannerIconReact">🤖 AI</div>}
                              {card.bannerType === "dsa" && <div className="bannerIconReact">⚡ DSA</div>}
                              {card.bannerType === "next" && <div className="bannerIconReact">▲ Next</div>}
                              {card.bannerType === "spring" && <div className="bannerIconReact">🍃 Spring</div>}
                              {card.bannerType === "web3" && <div className="bannerIconReact">💎 Web3</div>}
                              {card.bannerType === "system" && <div className="bannerIconReact">🏗️ System</div>}
                            </div>

                            <div className="lpCardBody">
                              <h4>{card.title}</h4>
                              <span className="lpLevelInfoText">{card.levelInfo}</span>

                              <div className="lpCardProgressBarTrack">
                                <div
                                  className="lpCardProgressBarFill"
                                  style={{ width: `${card.progress}%`, background: card.progressColor }}
                                ></div>
                              </div>

                              <div className="lpCardFooterRow">
                                <span className="lpPctText">{card.progress}%</span>
                                <span className="lpModulesCompletedText">{card.completedModules} Modules Completed</span>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Your Learning Paths Data Table */}
                  <div className="lpTableCard">
                    <h3>Your Learning Paths</h3>

                    <div className="lpTableContainer">
                      <table className="lpDataTable">
                        <thead>
                          <tr>
                            <th>Learning Path</th>
                            <th>Progress</th>
                            <th>Modules</th>
                            <th>Last Accessed</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sortedLearningPaths.map((row) => (
                            <tr key={row.id}>
                              <td>
                                <div className="lpTableNameCell">
                                  <div
                                    className="lpCellLogoBadge"
                                    style={{ background: row.logoBg }}
                                  >
                                    {row.bannerType === "js" || row.id === "js-dev" ? (
                                      <img src={jsBadgeImg} alt="JS Shield" style={{ width: "24px", height: "24px", objectFit: "contain" }} />
                                    ) : row.bannerType === "react" || row.id === "react-dev" ? (
                                      <img src={reactLogoImg} alt="React" style={{ width: "22px", height: "22px", objectFit: "contain" }} />
                                    ) : typeof row.logoText === "string" && (row.logoText.endsWith(".svg") || row.logoText.endsWith(".png")) ? (
                                      <img src={row.logoText} alt={row.title} style={{ width: "22px", height: "22px", objectFit: "contain" }} />
                                    ) : (
                                      row.logoText
                                    )}
                                  </div>
                                  <div>
                                    <strong>{row.title}</strong>
                                    <span className={`lpTableRowBadge ${row.status}`}>
                                      {row.statusText}
                                    </span>
                                  </div>
                                </div>
                              </td>

                              <td>
                                <div className="lpTableProgressCell">
                                  <span className="pctVal">{row.progress}%</span>
                                  <div className="tblTrack">
                                    <div
                                      className="tblFill"
                                      style={{
                                        width: `${row.progress}%`,
                                        background: row.progressColor
                                      }}
                                    ></div>
                                  </div>
                                </div>
                              </td>

                              <td className="lpModulesCell">
                                <strong>{row.modules}</strong>
                              </td>

                              <td className="lpLastAccessedCell">
                                {row.lastAccessed}
                              </td>

                              <td>
                                <div className="lpActionCell">
                                  <button
                                    className="btnTableAction"
                                    onClick={() => openPathDetail(row.title)}
                                  >
                                    {row.actionText}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Explore More Learning Paths Banner */}
                  <div className="lpExplorePathsBanner">
                    <div className="bannerLeftText">
                      <h3>Explore More Learning Paths</h3>
                      <p>Discover curated paths to build your dream career</p>
                    </div>
                    <button className="btnBrowseAllPaths" onClick={() => navigate("/courses")}>
                      Browse All Paths →
                    </button>
                  </div>

                </div>

                {/* ── RIGHT COLUMN SIDEBAR WIDGETS ── */}
                <div className="lpRightSidebar" style={{ display: "none" }}>
                  
                  {/* Overall Progress Gauge Widget */}
                  <div className="lpWidgetCard">
                    <h4>Overall Progress</h4>

                    <div className="lpProgressGaugeContainer">
                      <svg className="gaugeSvg" viewBox="0 0 100 100">
                        <circle className="gaugeBg" cx="50" cy="50" r="40" />
                        <circle
                          className="gaugeFill"
                          cx="50"
                          cy="50"
                          r="40"
                          strokeDasharray="251.2"
                          strokeDashoffset="163.2"
                        />
                      </svg>
                      <div className="gaugeCenterText">
                        <strong>35%</strong>
                      </div>
                    </div>

                    <div className="gaugeSubtextRow">
                      <span>8 / 23 Modules Completed</span>
                      <div className="gaugeBottomTrack">
                        <div className="gaugeBottomFill" style={{ width: "35%" }}></div>
                      </div>
                    </div>
                  </div>

                  {/* Learning Streak Widget */}
                  <div className="lpWidgetCard">
                    <div className="streakHeader">
                      <h4>Learning Streak 🔥</h4>
                    </div>
                    <div className="streakDaysBig">7 Days</div>
                    <span className="streakSubtext">Keep it up!</span>

                    <div className="streakDaysCheckedRow">
                      <div className="chkDayCol"><span>M</span><div className="chkCircle active"><FaCheckCircle /></div></div>
                      <div className="chkDayCol"><span>T</span><div className="chkCircle active"><FaCheckCircle /></div></div>
                      <div className="chkDayCol"><span>W</span><div className="chkCircle active"><FaCheckCircle /></div></div>
                      <div className="chkDayCol"><span>T</span><div className="chkCircle active"><FaCheckCircle /></div></div>
                      <div className="chkDayCol"><span>F</span><div className="chkCircle active"><FaCheckCircle /></div></div>
                      <div className="chkDayCol"><span>S</span><div className="chkCircle active"><FaCheckCircle /></div></div>
                      <div className="chkDayCol"><span>S</span><div className="chkCircle"></div></div>
                    </div>
                  </div>

                  {/* Recent Achievements Widget */}
                  <div className="lpWidgetCard">
                    <div className="achievementsHeaderRow">
                      <h4>Recent Achievements</h4>
                      <span className="sdViewAllLink">View All</span>
                    </div>

                    <div className="achievementsList">
                      <div className="achieveItem">
                        <div className="achieveIcon yellow"><FaTrophy /></div>
                        <div className="achieveText">
                          <h5>Quiz Master</h5>
                          <span>Scored 90%+ in a quiz</span>
                        </div>
                        <span className="achieveTime">2 days ago</span>
                      </div>

                      <div className="achieveItem">
                        <div className="achieveIcon blue"><FaShieldAlt /></div>
                        <div className="achieveText">
                          <h5>Code Explorer</h5>
                          <span>Solved 10 coding problems</span>
                        </div>
                        <span className="achieveTime">3 days ago</span>
                      </div>

                      <div className="achieveItem">
                        <div className="achieveIcon orange"><FaMedal /></div>
                        <div className="achieveText">
                          <h5>Streak Champ</h5>
                          <span>7 day learning streak</span>
                        </div>
                        <span className="achieveTime">5 days ago</span>
                      </div>
                    </div>
                  </div>

                  {/* Need Help? Ask AI Study Buddy Widget */}
                  <div className="lpWidgetCard">
                    <h4>Need Help?</h4>

                    <div
                      className="lpAskAiBox"
                      onClick={() => navigate(user?.role === "EMPLOYEE" ? "/workforce-home" : "/student-home")}
                    >
                      <div className="aiIconBox">🤖</div>
                      <div className="aiText">
                        <h5>Ask AI Study Buddy</h5>
                        <span>Get instant help with your doubts</span>
                      </div>
                      <FaArrowRight className="aiArrow" />
                    </div>
                  </div>

                </div>

              </div>
            </>
          )}

        </div>
      </div>

      <FloatingChatbot />
      <StudentFooter />
    </div>
  );
}
