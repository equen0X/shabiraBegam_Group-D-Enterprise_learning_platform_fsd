import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Background from "../components/Background";
import PaperPlaneCursor from "../components/PaperPlaneCursor";
import StudentFooter from "../components/StudentFooter";
import NotificationDropdown from "../components/NotificationDropdown";
import UserAvatar from "../components/UserAvatar";
import FloatingChatbot from "../components/FloatingChatbot";

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
  FaStar,
  FaCheckCircle,
  FaBookmark,
  FaClock,
  FaEllipsisH,
  FaChevronLeft,
  FaChevronRight,
  FaCrown,
  FaSun,
  FaMoon,
  FaArrowLeft,
  FaCalendarAlt,
  FaLock,
  FaShoppingCart,
  FaTimes,
  FaShieldAlt,
  FaShareAlt,
  FaSignOutAlt,
  FaArrowRight
} from "react-icons/fa";

import "../styles/courses.css";
import { useAdmin } from "../context/AdminContext";

import AppLogo from "../components/AppLogo";

export default function CoursesPage() {
  const { user, xp, logout, themeMode, toggleTheme, enrolledCourses, enrollCourse, completedTopics, earnXp } = useAuth();
  const { courses: adminCourses, pendingCourseRequests } = useAdmin();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("courses");
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const isDarkMode = themeMode === "dark";
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Live state sync ticker
  const [, setSyncTick] = useState(0);
  useEffect(() => {
    const handleSync = () => setSyncTick(t => t + 1);
    window.addEventListener('storage', handleSync);
    window.addEventListener('skillsphere_sync_event', handleSync);
    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('skillsphere_sync_event', handleSync);
    };
  }, []);

  // Course Checkout Modal State
  const [selectedCheckoutCourse, setSelectedCheckoutCourse] = useState(null);
  const [isEnrolledToast, setIsEnrolledToast] = useState(false);
  const [saveToast, setSaveToast] = useState(""); // "saved" | "removed" | ""

  // ── Saved / Bookmarked Courses ──────────────────────────────────────────────
  const [savedCourses, setSavedCourses] = useState(() => {
    try {
      const raw = localStorage.getItem(`skillsphere_saved_courses_${(user?.email || user?.username || "default")}`);
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  });

  const toggleSave = (courseId) => {
    const idStr = courseId.toString();
    setSavedCourses(prev => {
      const isSaved = prev.includes(idStr);
      const next = isSaved ? prev.filter(id => id !== idStr) : [...prev, idStr];
      try {
        const key = `skillsphere_saved_courses_${(user?.email || user?.username || "default")}`;
        localStorage.setItem(key, JSON.stringify(next));
      } catch (e) {}
      setSaveToast(isSaved ? "removed" : "saved");
      setTimeout(() => setSaveToast(""), 2000);
      return next;
    });
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error(err);
    } finally {
      navigate("/");
    }
  };

  const userName = user?.full_name || user?.username || "Learner";
  const currentXp = xp ?? 0;

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <FaHome /> },
    { id: "student-profile", label: "Student Profile", icon: <FaAward /> },
    { id: "services-catalog", label: "Services & Catalog", icon: <FaBook /> },
    { id: "assessments", label: "Assessments", icon: <FaBolt /> },
    { id: "certification-tracking", label: "Cert Tracking", icon: <FaCertificate /> },
    { id: "tracking-dashboard", label: "Tracking Dashboard", icon: <FaChartLine /> },
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

  const rawCourses = [
    {
      id: 1,
      title: "JavaScript Fundamentals",
      subtitle: "Learn core JS syntax, ES6+ features, closures, event loop and DOM manipulation.",
      logoText: "JS",
      logoBg: "#FEF08A",
      logoColor: "#CA8A04",
      rating: "4.8",
      reviews: "5.2K",
      lessons: "12 Lessons",
      bannerType: "code",
      topicPrefix: "js_",
      imgSrc: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=600&auto=format&fit=crop&q=80"
    },
    {
      id: 2,
      title: "React.js Development",
      subtitle: "Build modern dynamic web apps using React 18, hooks, state, and context API.",
      logoText: "⚛️",
      logoBg: "#E0F2FE",
      logoColor: "#0284C7",
      rating: "4.9",
      reviews: "8.6K",
      lessons: "18 Lessons",
      bannerType: "react",
      topicPrefix: "react_",
      imgSrc: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&auto=format&fit=crop&q=80"
    },
    {
      id: 3,
      title: "Python for Beginners",
      subtitle: "Start your Python programming journey from basics to real-world data projects.",
      logoText: "🐍",
      logoBg: "#FEF9C3",
      logoColor: "#854D0E",
      rating: "4.7",
      reviews: "6.1K",
      lessons: "16 Lessons",
      bannerType: "python",
      topicPrefix: "python_",
      imgSrc: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80"
    },
    {
      id: 4,
      title: "UI/UX Design Essentials",
      subtitle: "Design stunning user interfaces, wireframes, and design systems in Figma.",
      logoText: "🎨",
      logoBg: "#FCE7F3",
      logoColor: "#DB2777",
      rating: "4.8",
      reviews: "3.8K",
      lessons: "14 Lessons",
      bannerType: "figma",
      topicPrefix: "uiux_",
      imgSrc: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600&auto=format&fit=crop&q=80"
    },
    {
      id: 5,
      title: "Data Structures & Algorithms",
      subtitle: "Master DSA concepts, Big-O analysis, binary trees, dynamic programming and FAANG interviews.",
      logoText: "📊",
      logoBg: "#E0F2FE",
      logoColor: "#0284C7",
      rating: "4.9",
      reviews: "12K",
      lessons: "20 Lessons",
      bannerType: "dsa",
      topicPrefix: "dsa_",
      imgSrc: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80"
    },
    {
      id: 6,
      title: "Node.js & Microservices",
      subtitle: "Build scalable backend REST APIs, authentication, and Docker microservices with Node.js.",
      logoText: "🟩",
      logoBg: "#DCFCE7",
      logoColor: "#166534",
      rating: "4.8",
      reviews: "4.9K",
      lessons: "15 Lessons",
      bannerType: "node",
      topicPrefix: "node_",
      imgSrc: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=600&auto=format&fit=crop&q=80"
    },
    {
      id: 7,
      title: "System Design Architecture",
      subtitle: "Learn high-level system design, load balancing, caching, CDNs, and database sharding.",
      logoText: "📐",
      logoBg: "#F3E8FF",
      logoColor: "#7E22CE",
      rating: "4.9",
      reviews: "5.5K",
      lessons: "10 Lessons",
      bannerType: "system",
      topicPrefix: "fsd_",
      imgSrc: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80"
    },
    {
      id: 8,
      title: "Advanced Machine Learning",
      subtitle: "Dive deep into ML algorithms, regression, random forests, and PyTorch deep learning.",
      isPremium: true,
      logoText: "🤖",
      logoBg: "#F1F5F9",
      logoColor: "#475569",
      rating: "4.9",
      reviews: "3.2K",
      lessons: "24 Lessons",
      bannerType: "ml",
      topicPrefix: "ml_",
      imgSrc: "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=600&auto=format&fit=crop&q=80"
    },
    {
      id: 9,
      title: "Fullstack Next.js 14 Masterclass",
      subtitle: "Master Next.js App Router, Server Components, Server Actions, and Vercel edge deployment.",
      logoText: "▲",
      logoBg: "#000000",
      logoColor: "#FFFFFF",
      rating: "4.9",
      reviews: "7.1K",
      lessons: "16 Lessons",
      bannerType: "nextjs",
      topicPrefix: "nextjs_",
      imgSrc: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=600&auto=format&fit=crop&q=80"
    },
    {
      id: 10,
      title: "Spring Boot Microservices",
      subtitle: "Enterprise Java backend development with Spring Boot 3, Spring Security, and JPA Hibernate.",
      logoText: "🍃",
      logoBg: "#DCFCE7",
      logoColor: "#15803D",
      rating: "4.8",
      reviews: "4.2K",
      lessons: "22 Lessons",
      bannerType: "springboot",
      topicPrefix: "springboot_",
      imgSrc: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80"
    },
    {
      id: 11,
      title: "Generative AI & LLM Engineering",
      subtitle: "Build AI agents, RAG pipelines, LangChain applications, and fine-tune open-source LLMs.",
      isPremium: true,
      logoText: "🧠",
      logoBg: "#F3E8FF",
      logoColor: "#9333EA",
      rating: "5.0",
      reviews: "9.4K",
      lessons: "18 Lessons",
      bannerType: "genai",
      topicPrefix: "genai_",
      imgSrc: "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=600&auto=format&fit=crop&q=80"
    },
    {
      id: 12,
      title: "AWS Cloud & DevOps Essentials",
      subtitle: "Master AWS EC2, S3 buckets, Lambda serverless, Docker containers, and Kubernetes CI/CD.",
      logoText: "☁️",
      logoBg: "#FEF3C7",
      logoColor: "#D97706",
      rating: "4.8",
      reviews: "6.8K",
      lessons: "20 Lessons",
      bannerType: "aws",
      topicPrefix: "aws_",
      imgSrc: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80"
    },
    {
      id: 13,
      title: "Web3 & Solidity Smart Contracts",
      subtitle: "Develop Ethereum dApps, smart contracts in Solidity, Hardhat testing, and ERC-20 tokens.",
      logoText: "🔗",
      logoBg: "#E0E7FF",
      logoColor: "#4338CA",
      rating: "4.7",
      reviews: "2.9K",
      lessons: "15 Lessons",
      bannerType: "web3",
      topicPrefix: "web3_",
      imgSrc: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&auto=format&fit=crop&q=80"
    },
    {
      id: 14,
      title: "Cybersecurity & Ethical Hacking",
      subtitle: "Learn network security, penetration testing, web vulnerability auditing, and defensive security.",
      logoText: "🛡️",
      logoBg: "#FEE2E2",
      logoColor: "#B91C1C",
      rating: "4.9",
      reviews: "5.1K",
      lessons: "16 Lessons",
      bannerType: "cyber",
      topicPrefix: "cyber_",
      imgSrc: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=80"
    },
    {
      id: 15,
      title: "MongoDB & Database Systems",
      subtitle: "Master SQL & NoSQL databases, schema design, aggregation pipelines, and indexing optimization.",
      logoText: "🍃",
      logoBg: "#DCFCE7",
      logoColor: "#166534",
      rating: "4.8",
      reviews: "3.4K",
      lessons: "12 Lessons",
      bannerType: "dbms",
      topicPrefix: "dbms_",
      imgSrc: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop&q=80"
    },
    {
      id: 16,
      title: "React Native Mobile App Dev",
      subtitle: "Build cross-platform iOS and Android mobile apps with React Native, Expo, and Native APIs.",
      logoText: "📱",
      logoBg: "#E0F2FE",
      logoColor: "#0369A1",
      rating: "4.8",
      reviews: "4.1K",
      lessons: "16 Lessons",
      bannerType: "reactnative",
      topicPrefix: "reactnative_",
      imgSrc: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&auto=format&fit=crop&q=80"
    }
  ];

  const userKey = user?.email || user?.username || "default";
  const userCompletedTopics = completedTopics || [];

  // Unified enrolled courses calculation matching Dashboard and Learning Paths
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

  const allEnrolled = getUnifiedEnrolledCourseIds();

  // Read pending course approval requests (for the current user)
  const pendingRequests = (() => {
    try {
      const all = JSON.parse(localStorage.getItem("skillsphere_pending_course_requests") || "[]");
      // Only show requests for this user
      return all.filter(r => r.studentEmail === userKey || r.studentEmail === user?.email);
    } catch (e) {
      return [];
    }
  })();

  // Read admin-added courses from localStorage and merge with rawCourses (admin may add new ones)
  const adminCatalogCourses = (() => {
    try {
      const adminCourses = JSON.parse(localStorage.getItem('admin_courses') || '[]');
      // Map admin courses to the CoursesPage course format
      return adminCourses
        .filter(ac => !rawCourses.some(rc => rc.id === ac.id || rc.title === ac.title))
        .map(ac => ({
          id: ac.id,
          title: ac.title,
          subtitle: ac.description || '',
          logoText: ac.title.slice(0, 2).toUpperCase(),
          logoBg: '#FFF0EB',
          logoColor: '#F9572A',
          rating: ac.rating || '4.5',
          reviews: ac.reviews || '0',
          lessons: '10 Lessons',
          bannerType: 'general',
          topicPrefix: `admin_${ac.id}_`,
          imgSrc: ac.image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
          isPremium: ac.isPremium,
          price: ac.price,
          isAdminAdded: true
        }));
    } catch {
      return [];
    }
  })();

  // Combined course list: base courses + admin-added courses
  const allRawCourses = [...rawCourses, ...adminCatalogCourses];

  const completedSubLessons = (() => {
    try {
      return JSON.parse(localStorage.getItem(`skillsphere_completed_sub_lessons_${userKey}`) || "[]");
    } catch (e) {
      return [];
    }
  })();

  const courseList = allRawCourses.map((c) => {
    const cidStr = c.id.toString();
    
    // Unlocked IF explicitly enrolled by user/admin
    const isEnrolled = allEnrolled.includes(cidStr) || allEnrolled.includes(c.id);
    const topicsDone = userCompletedTopics.filter((id) => typeof id === 'string' && id.startsWith(c.topicPrefix || "")).length;
    const subDone = (completedSubLessons || []).filter(id => typeof id === 'string' && (id.startsWith(c.topicPrefix || "") || (c.id === 2 && !id.startsWith("py-") && !id.startsWith("node-") && !id.startsWith("ui-")))).length;
    const totalDone = topicsDone + subDone;
    const progress = isEnrolled ? (totalDone > 0 ? Math.min(100, Math.round((totalDone / 12) * 100)) : 0) : 0;

    // Check pending approval for THIS user only
    const isPendingApproval = pendingRequests.some(r => r.courseId === cidStr && r.status === "pending");
    // Check if admin approved (status = 'approved') — even if not in DB yet
    const isAdminApproved = pendingRequests.some(r => r.courseId === cidStr && r.status === "approved");

    let status = "not-enrolled";
    let statusText = "Available";

    if (isPendingApproval && !isEnrolled && !isAdminApproved) {
      status = "pending-approval";
      statusText = "⏳ Pending Approval";
    } else if (isEnrolled || isAdminApproved) {
      if (progress >= 100) {
        status = "completed";
        statusText = "Completed";
      } else {
        status = "in-progress";
        statusText = "In Progress";
      }
    }

    return {
      ...c,
      isEnrolled: isEnrolled || isAdminApproved,
      isPendingApproval,
      progress,
      status,
      statusText
    };
  });

  const filteredCourses = (() => {
    const filtered = courseList.filter((c) => {
      const isSaved = savedCourses.includes(c.id.toString());
      if (filter === "all") return true;
      if (filter === "in-progress") return c.status === "in-progress";
      if (filter === "completed") return c.status === "completed";
      if (filter === "saved") return isSaved;
      return true;
    });

    // Apply sorting
    const sorted = [...filtered];
    if (sortBy === "progress") {
      sorted.sort((a, b) => b.progress - a.progress);
    } else if (sortBy === "rating") {
      sorted.sort((a, b) => parseFloat(b.rating || 0) - parseFloat(a.rating || 0));
    } else {
      // "recent" — enrolled/in-progress courses first, then by id descending
      const statusOrder = { "in-progress": 0, "pending-approval": 1, "completed": 2, "not-enrolled": 3 };
      sorted.sort((a, b) => {
        const sa = statusOrder[a.status] ?? 4;
        const sb = statusOrder[b.status] ?? 4;
        if (sa !== sb) return sa - sb;
        return b.id - a.id;
      });
    }
    return sorted;
  })();

  const openCheckoutModal = (course) => {
    const courseToCheckout = course || {
      id: 1,
      title: "Machine Learning Foundations",
      subtitle: "A beginner-friendly guide to Machine Learning concepts, models, and Python implementation.",
      notes: "80 Study Notes Included",
      certificate: "Certificate Included",
      fee: "₹4,999.00"
    };
    setSelectedCheckoutCourse(courseToCheckout);
  };

  const handleCompleteEnrollment = async () => {
    if (!selectedCheckoutCourse) return;

    const cidStr = selectedCheckoutCourse.id.toString();

    // Create a pending request for Admin record
    const newReq = {
      id: `REQ-${Date.now()}`,
      courseId: cidStr,
      courseTitle: selectedCheckoutCourse.title,
      studentName: user?.full_name || user?.name || user?.username || "Student User",
      studentEmail: userKey,
      fee: selectedCheckoutCourse.price ? `₹${selectedCheckoutCourse.price}` : "₹4,999",
      requestDate: new Date().toLocaleString(),
      status: "pending"
    };

    // Store in localStorage for instant sync across components
    const currentReqs = JSON.parse(localStorage.getItem("skillsphere_pending_course_requests") || "[]");
    if (!currentReqs.some(r => r.courseId === cidStr && r.studentEmail === userKey && r.status === "pending")) {
      currentReqs.unshift(newReq);
      localStorage.setItem("skillsphere_pending_course_requests", JSON.stringify(currentReqs));
    }

    // Call backend API if user token is present
    try {
      const token = localStorage.getItem("accessToken") || localStorage.getItem("skillsphere_token");
      if (token && !token.startsWith("mock_token_")) {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
        await fetch(`${API_URL}/api/courses/request-enroll`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            courseId: cidStr,
            courseTitle: selectedCheckoutCourse.title
          })
        });
      }
    } catch (err) {
      console.warn("Backend course request failed, fallback to local request:", err);
    }

    // Trigger sync event so Admin Dashboard updates immediately in real-time
    try {
      window.dispatchEvent(new CustomEvent("skillsphere_sync_event"));
    } catch (e) {
      console.warn("Sync dispatch error:", e);
    }

    if (earnXp) earnXp(100);

    setIsEnrolledToast(true);
    setSelectedCheckoutCourse(null);

    setTimeout(() => {
      setIsEnrolledToast(false);
    }, 3000);
  };

  return (
    <div className={`mcCoursesWrapper ${isDarkMode ? "dark-theme" : ""}`}>
      <Background />
      <PaperPlaneCursor />

      {/* Enroll Toast Notification */}
      {isEnrolledToast && (
        <div className="mcEnrollSuccessToast">
          <FaCheckCircle color="#10B981" />
          <span>Payment Verified! Request Sent for Admin Approval in Admin Dashboard ⏳ (+100 XP)</span>
        </div>
      )}

      {/* Save Toast Notification */}
      {saveToast && (
        <div className={`mcSaveToast ${saveToast}`}>
          <FaBookmark color={saveToast === "saved" ? "#7E22CE" : "#64748B"} />
          <span>{saveToast === "saved" ? "Course saved to your list! 🔖" : "Course removed from saved list"}</span>
        </div>
      )}

      {/* Main Container Grid */}
      <div className="mcMainContainer">
        
        {/* ── LEFT SIDEBAR ── */}
        <aside className="mcLeftSidebar">
          <div>
            <Link to="/" className="sdBrandLogo" style={{ display: "inline-flex", alignItems: "center" }}>
              <AppLogo height="58px" />
            </Link>

            <div className="sdSidebarHomeArchHeader">
              <div className="sdArchLine" />
              <button
                className="sdHomeCircularBtn active"
                onClick={() => navigate("/student-home")}
                title="Dashboard Overview"
              >
                <FaHome />
              </button>
            </div>

            <ul className="sdNavList">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    className={`sdNavItem ${item.id === "courses" ? "active" : ""}`}
                    onClick={() => {
                      if (item.id === "dashboard") navigate("/student-home");
                      else if (item.id === "student-profile") navigate("/student-profile");
                      else if (item.id === "services-catalog") navigate("/services-catalog");
                      else if (item.id === "assessments") navigate("/assessments");
                      else if (item.id === "certification-tracking") navigate("/certification-tracking");
                      else if (item.id === "tracking-dashboard") navigate("/tracking-dashboard");
                      else if (item.id === "complaint-tracking") navigate("/complaint-tracking");
                      else if (item.id === "career-roadmap") navigate("/career-roadmap");
                      else if (item.id === "job-search") navigate("/job-search");
                      else if (item.id === "courses") navigate("/courses");
                      else if (item.id === "learning-paths") navigate("/learning-paths");
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
                      else navigate(`/${item.id}`);
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
              <button className="sdCollapseBtn" onClick={() => navigate(-1)}>
                <FaArrowLeft />
              </button>
            </div>
          </div>
        </aside>

        {/* ── RIGHT MAIN BODY AREA ── */}
        <div className="mcRightBodyArea">
          
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

              {/* Header Bar Logout Button beside Notification Bell */}
              <button
                className="sdLogoutHeaderBtn"
                onClick={handleLogout}
                title="Logout to Landing Page"
              >
                <FaSignOutAlt /> <span>Logout</span>
              </button>

              {/* User Profile Pill with Dropdown */}
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
                    <div className="dropdownItem" onClick={() => { setIsUserMenuOpen(false); navigate("/settings"); }}>
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

          {/* Page Heading */}
          <div className="mcPageHeader">
            <h1>My Courses 📖</h1>
            <p>Continue your learning journey. Keep going!</p>
          </div>

          {/* Main 2-Column Content Grid */}
          <div className="mcGridContainer" style={{ gridTemplateColumns: "minmax(0, 1fr)" }}>
            
            {/* Center Main Column */}
            <div className="mcCenterColumn">
              
              {/* Filter Pills & Sort Bar Row */}
              <div className="mcFilterSortRow">
                <div className="mcFilterPills">
                  <button
                    className={`mcPill ${filter === "all" ? "active" : ""}`}
                    onClick={() => setFilter("all")}
                  >
                    All Courses
                  </button>
                  <button
                    className={`mcPill ${filter === "in-progress" ? "active" : ""}`}
                    onClick={() => setFilter("in-progress")}
                  >
                    In Progress
                  </button>
                  <button
                    className={`mcPill ${filter === "completed" ? "active" : ""}`}
                    onClick={() => setFilter("completed")}
                  >
                    Completed
                  </button>
                  <button
                    className={`mcPill ${filter === "saved" ? "active" : ""}`}
                    onClick={() => setFilter("saved")}
                  >
                    Saved
                  </button>
                </div>

                <div className="mcSortSelectWrapper">
                  <select
                    className="mcSortSelect"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="recent">Sort by: Recent Activity</option>
                    <option value="progress">Sort by: Progress %</option>
                    <option value="rating">Sort by: Rating</option>
                  </select>
                </div>
              </div>

              {/* 8 Courses Grid */}
              <div className="mcCourseGrid">
                {filteredCourses.map((c) => (
                  <div key={c.id} className={`mcCourseCard ${c.status}`} style={c.status === "locked" ? { opacity: 0.85 } : {}}>
                    
                    {/* Top Banner Image Box */}
                    <div className={`mcBannerBox ${c.bannerType}`} style={{ position: "relative", overflow: "hidden" }}>
                      {c.imgSrc && (
                        <img
                          src={c.imgSrc}
                          alt={c.title}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            position: "absolute",
                            top: 0,
                            left: 0,
                            opacity: 0.85,
                            transition: "transform 0.3s ease"
                          }}
                          className="courseBannerImg"
                        />
                      )}
                      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.75) 100%)", zIndex: 1 }} />

                      <div
                        className="mcLogoBadge"
                        style={{ background: c.logoBg, color: c.logoColor, zIndex: 3 }}
                      >
                        {c.logoText}
                      </div>

                      {/* Save / Bookmark Button */}
                      <button
                        className={`mcSaveBtn ${savedCourses.includes(c.id.toString()) ? "saved" : ""}`}
                        style={{ zIndex: 3 }}
                        onClick={(e) => { e.stopPropagation(); toggleSave(c.id); }}
                        title={savedCourses.includes(c.id.toString()) ? "Remove from saved" : "Save course"}
                      >
                        <FaBookmark />
                      </button>

                      <span className={`mcStatusBadge ${c.status}`} style={{ zIndex: 3 }}>
                        {c.statusText}
                      </span>
                    </div>

                    {/* Card Content Body */}
                    <div className="mcCardContent">
                      <h4>{c.title}</h4>
                      <p className="mcCourseSubtitle">{c.subtitle}</p>

                      <div className="mcProgressArea">
                        <div className="mcProgressBarTrack">
                          <div
                            className="mcProgressBarFill"
                            style={{ width: `${c.progress}%` }}
                          />
                        </div>
                        <span className="mcPctLabel">{c.progress}% Complete</span>
                      </div>

                      {c.isPremium && (
                        <div className="mcPremiumBadge">
                          <FaCrown color="#D97706" /> Premium Course
                        </div>
                      )}

                      <div className="mcCardFooterMeta">
                        <span className="ratingText">
                          <FaStar color="#F59E0B" /> {c.rating} ({c.reviews})
                        </span>
                        <span className="lessonsText">{c.lessons}</span>
                      </div>

                      <button
                        className={`btnCourseCardAction ${c.status}`}
                        onClick={() => {
                          if (c.status === "completed" || c.status === "in-progress" || c.isEnrolled) {
                            navigate("/learning-paths", { 
                              state: { 
                                courseId: c.id, 
                                courseTitle: c.title,
                                topicPrefix: c.topicPrefix 
                              } 
                            });
                          } else if (c.status === "pending-approval") {
                            // Pending notice
                          } else {
                            openCheckoutModal(c);
                          }
                        }}
                      >
                        {c.status === "completed"
                          ? "Review in Learning Path →"
                          : c.isEnrolled || c.status === "in-progress"
                          ? "Continue →"
                          : c.status === "pending-approval"
                          ? "⏳ Pending Approval"
                          : "Enroll Now →"}
                      </button>
                    </div>

                  </div>
                ))}
              </div>

              {/* Explore Learning Paths Banner */}
              <div className="mcExplorePathsBanner">
                <div className="bannerLeftInfo">
                  <h3>Explore Learning Paths</h3>
                  <p>Curated paths to help you master skills step by step.</p>
                  <button className="btnBrowsePaths" onClick={() => navigate("/learning-paths")}>
                    Browse Learning Paths →
                  </button>
                </div>
                <div className="mountainGraphicDeco">
                  ⛰️ 🚩
                </div>
              </div>

            </div>

            {/* ── RIGHT COLUMN SIDEBAR (MY LEARNING OVERVIEW) ── */}
            <div className="mcRightSidebar" style={{ display: "none" }}>
              
              {/* My Learning Overview 2x2 Grid */}
              <div className="mcOverviewCard">
                <h4>My Learning Overview</h4>

                <div className="overviewGrid2x2">
                  <div className="overviewBox">
                    <div className="boxIcon orange"><FaBook /></div>
                    <div className="boxValText">
                      <strong>{courseList.filter(c => c.status === "in-progress").length}</strong>
                      <span>In Progress</span>
                    </div>
                  </div>

                  <div className="overviewBox">
                    <div className="boxIcon green"><FaCheckCircle /></div>
                    <div className="boxValText">
                      <strong>{courseList.filter(c => c.status === "completed").length}</strong>
                      <span>Completed</span>
                    </div>
                  </div>

                  <div className="overviewBox">
                    <div className="boxIcon purple"><FaBookmark /></div>
                    <div className="boxValText">
                      <strong>{savedCourses.length}</strong>
                      <span>Saved</span>
                    </div>
                  </div>

                  <div className="overviewBox">
                    <div className="boxIcon purpleLight"><FaClock /></div>
                    <div className="boxValText">
                      <strong>{userCompletedTopics.length * 2}</strong>
                      <span>Total Hours</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Weekly Goal Card */}
              <div className="mcOverviewCard">
                <div className="weeklyGoalHeader">
                  <h4>Weekly Goal</h4>
                  <span className="goalVal">{Math.min(7, userCompletedTopics.length * 2)} / 7 hours</span>
                </div>

                <div className="goalTrack">
                  <div className="goalFill" style={{ width: `${Math.min(100, Math.round(((userCompletedTopics.length * 2) / 7) * 100))}%` }}></div>
                </div>
                <span className="goalSubtext">
                  {userCompletedTopics.length > 0 ? "You're on track! Keep it up! 🔥" : "Start a course to track your weekly progress!"}
                </span>
              </div>

              {/* Continue Learning Widget */}
              <div className="mcOverviewCard">
                <h4>Continue Learning</h4>

                <div className="mcContinueList">
                  {courseList.filter(c => c.status === "in-progress").length > 0 ? (
                    courseList.filter(c => c.status === "in-progress").map(c => (
                      <div className="continueItem" key={c.id}>
                        <div className="itemIcon yellow" style={{ background: c.logoBg, color: c.logoColor }}>
                          {c.logoText}
                        </div>
                        <div className="itemInfo">
                          <h5>{c.title}</h5>
                          <span>{c.lessons}</span>
                        </div>
                        <span className="itemPct">{c.progress}%</span>
                      </div>
                    ))
                  ) : (
                    <p style={{ fontSize: "14px", color: "var(--text-secondary)", padding: "10px 0" }}>
                      No active courses in progress. Unlock a course to start learning!
                    </p>
                  )}
                </div>

                <div className="viewAllProgressLink" onClick={() => navigate("/learning")}>
                  View All In Progress →
                </div>
              </div>

              {/* Recommended For You Carousel Widget */}
            {/*  <div className="mcOverviewCard">
                <div className="recHeaderRow">
                  <h4>Recommended For You</h4>
                  <span className="sdViewAllLink">View All</span>
                </div>

                <div className="recCarouselBox">
                  <button className="carouselArrow left"><FaChevronLeft /></button>
                  <div className="recCard">
                    <div className="recIconBox">🧠</div>
                    <h5>Machine Learning Fundamentals</h5>
                    <div className="recRatingRow">
                      <span><FaStar color="#F59E0B" /> 4.8 (3.1K)</span>
                      <span className="popularPill">Popular</span>
                    </div>
                    <button
                      className="btnExploreCourse"
                      onClick={() =>
                        openCheckoutModal({
                          title: "Machine Learning Foundations",
                          subtitle:
                            "A beginner-friendly guide to Machine Learning concepts, models, and Python implementation.",
                          bannerType: "ml"
                        })
                      }
                    >
                      Explore Course
                    </button>
                  </div>
                  <button className="carouselArrow right"><FaChevronRight /></button>
                </div>
              </div>*/}

              {/* Bottom Right Decor */}
              <div className="mcBottomPlantDecor">
                🪴 📚
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* ── COURSE CHECKOUT MODAL (EXACT 1-TO-1 MATCH OF SCREENSHOT) ── */}
      {selectedCheckoutCourse && (
        <div
          className="chkModalBackdrop"
          onClick={(e) => {
            if (e.target.className === "chkModalBackdrop") setSelectedCheckoutCourse(null);
          }}
        >
          <div className="chkModalCard">
            {/* Top Modal Header */}
            <div className="chkModalHeader">
              <div className="chkHeaderTitleRow">
                <div className="chkCartIconBadge">
                  <FaShoppingCart />
                </div>
                <h2>Course Checkout</h2>
              </div>
              <button
                className="chkCloseBtn"
                onClick={() => setSelectedCheckoutCourse(null)}
                title="Close"
              >
                <FaTimes />
              </button>
            </div>

            {/* Course Information Row */}
            <div className="chkCourseInfoRow">
              <div className="chkCourseThumb">
                <div className="codeThumbGraphic">
                  <code>const ml = model.fit();</code>
                </div>
              </div>

              <div className="chkCourseTextInfo">
                <h3>{selectedCheckoutCourse.title || "Machine Learning Foundations"}</h3>
                <p>
                  {selectedCheckoutCourse.subtitle ||
                    "A beginner-friendly guide to Machine Learning concepts, models, and Python implementation."}
                </p>

                <div className="chkPillBadgesRow">
                  <span className="chkBadgePill orange">
                    📖 80 Study Notes Included
                  </span>
                  <span className="chkBadgePill rose">
                    🏵️ Certificate Included
                  </span>
                </div>
              </div>
            </div>

            {/* Price Breakdown Box */}
            <div className="chkPriceBreakdownBox">
              <div className="chkPriceRow">
                <span>Course Tuition Fee:</span>
                <span className="feeVal">₹4,999.00</span>
              </div>

              <div className="chkPriceRow scholarship">
                <span>SkillSphere Scholarship Grant (100% OFF):</span>
                <span className="discountVal">-₹4,999.00</span>
              </div>

              <div className="chkDividerDashed"></div>

              <div className="chkPriceRow total">
                <strong>Total Due Today:</strong>
                <strong className="totalZeroVal">₹0.00</strong>
              </div>
            </div>

            {/* Perks Row */}
            <div className="chkPerksRow">
              <span>⚡ Instant Access</span>
              <span className="bulletDot">•</span>
              <span>✨ +100 XP Bonus</span>
              <span className="bulletDot">•</span>
              <span>📖 80+ Notes</span>
            </div>

            {/* Main Action CTA Button */}
            <button className="btnCompleteEnrollment" onClick={handleCompleteEnrollment}>
              Complete Enrollment (Free) <FaArrowRight />
            </button>

            {/* Security Subtext */}
            <div className="chkSecuritySubtext">
              <FaShieldAlt color="#94A3B8" /> 100% Secure Checkout. Cancel Anytime.
            </div>

          </div>
        </div>
      )}

      <FloatingChatbot />
      <StudentFooter />
    </div>
  );
}
