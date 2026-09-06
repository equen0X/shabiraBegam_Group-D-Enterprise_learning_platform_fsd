import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Background from "../components/Background";
import PaperPlaneCursor from "../components/PaperPlaneCursor";
import StudentFooter from "../components/StudentFooter";
import FloatingChatbot from "../components/FloatingChatbot";

import AIStudyBuddy from "../components/AIStudyBuddy";
import OpportunityFeed from "../components/OpportunityFeed";
import StreakHeatmap from "../components/StreakHeatmap";

import {
  FaHome,
  FaBook,
  FaCodeBranch,
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
  FaFire,
  FaRobot,
  FaRocket,
  FaMapMarkedAlt,
  FaMapSigns,
  FaQuestionCircle,
  FaLaptopCode,
  FaUpload,
  FaQuoteLeft,
  FaChevronRight,
  FaCheckCircle,
  FaFlag,
  FaBookOpen,
  FaCode,
  FaBullseye,
  FaGift,
  FaPaperPlane,
  FaBriefcase,
  FaSun,
  FaMoon,
  FaArrowLeft,
  FaEllipsisH,
  FaCalendarAlt,
  FaSignOutAlt
} from "react-icons/fa";

import NotificationDropdown from "../components/NotificationDropdown";
import UserAvatar from "../components/UserAvatar";

import studentHeroImg from "../assets/student_dashboard_hero_illustration.png";
import darkStudentHeroImg from "../assets/dark_student_dashboard_hero_illustration.png";
import "../styles/studentDashboard.css";

import AppLogo from "../components/AppLogo";

export default function StudentHome() {
  const { user, xp, logout, themeMode, toggleTheme, enrolledCourses, completedTopics, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const isDarkMode = themeMode === "dark";
  const [widgetChatInput, setWidgetChatInput] = useState("");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    if (refreshProfile) {
      refreshProfile().catch(err => console.error("Error refreshing profile on StudentHome mount:", err));
    }
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error(err);
    } finally {
      navigate("/");
    }
  };

  const userKey = user?.email || user?.username || "default";

  // Unified enrolled courses calculation
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
  const userEnrolledCount = activeEnrolledIds.length;

  // Real Dynamic Earned Certificates Count from database
  const [earnedCertsCount, setEarnedCertsCount] = useState(0);

  useEffect(() => {
    const fetchClaimedCerts = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) return;
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${API_URL}/api/certificates`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok && data.certificates) {
          setEarnedCertsCount(data.certificates.length);
        } else {
          const local = localStorage.getItem(`skillsphere_earned_certs_${userKey}`);
          const parsed = local ? JSON.parse(local) : [];
          setEarnedCertsCount(parsed.length);
        }
      } catch (err) {
        const local = localStorage.getItem(`skillsphere_earned_certs_${userKey}`);
        const parsed = local ? JSON.parse(local) : [];
        setEarnedCertsCount(parsed.length);
      }
    };
    fetchClaimedCerts();
  }, [user, userKey]);

  // Real Dynamic Badges Earned Count
  const localEarnedBadges = (user?.badges && user.badges.length > 0)
    ? user.badges
    : (() => {
        try {
          const stored = localStorage.getItem(`skillsphere_earned_badges_${userKey}`);
          return stored ? JSON.parse(stored) : [];
        } catch (e) {
          return [];
        }
      })();
  const earnedBadgesCount = localEarnedBadges.length;

  const userName = user?.full_name || user?.name || user?.username || "Learner";
  const currentXp = xp ?? user?.xp ?? 0;
  const level = Math.floor(currentXp / 2000) + 1;
  const xpInCurrentLevel = currentXp % 2000;
  const xpToNext = 2000 - xpInCurrentLevel;
  const progressPct = currentXp > 0 ? Math.min(100, Math.round((xpInCurrentLevel / 2000) * 100)) : 0;

  // ── COURSE CATALOG (mirrors CoursesPage) ─────────────────────────────
  const COURSE_CATALOG = [
    { id: 1, title: "JavaScript Fundamentals", icon: "JS",  iconBg: "#FEF08A", iconColor: "#CA8A04", topicPrefix: "js_",     lessons: 12 },
    { id: 2, title: "React.js Development",    icon: "⚛️", iconBg: "#E0F2FE", iconColor: "#0284C7", topicPrefix: "react_",  lessons: 18 },
    { id: 3, title: "Python for Beginners",    icon: "🐍",  iconBg: "#FEF9C3", iconColor: "#854D0E", topicPrefix: "python_", lessons: 16 },
    { id: 4, title: "UI/UX Design Essentials", icon: "🎨",  iconBg: "#FCE7F3", iconColor: "#DB2777", topicPrefix: "uiux_",  lessons: 14 },
    { id: 5, title: "Data Structures & Algo",  icon: "📊",  iconBg: "#E0F2FE", iconColor: "#0284C7", topicPrefix: "dsa_",   lessons: 20 },
    { id: 6, title: "Node.js Essentials",       icon: "🟢",  iconBg: "#DCFCE7", iconColor: "#166534", topicPrefix: "node_",  lessons: 15 },
    { id: 7, title: "System Design Basics",     icon: "📐",  iconBg: "#F3E8FF", iconColor: "#7E22CE", topicPrefix: "system_",lessons: 10 },
    { id: 8, title: "Advanced Machine Learning",icon: "🧠",  iconBg: "#FEE2E2", iconColor: "#B91C1C", topicPrefix: "ml_",    lessons: 24 },
  ];

  const completedSubLessonIds = (() => {
    try {
      const saved = localStorage.getItem(`skillsphere_completed_sub_lessons_${userKey}`);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  })();

  // Build enrolled course cards with real progress matching Learning Paths
  const enrolledCourseCards = COURSE_CATALOG
    .filter(c => activeEnrolledIds.some(id => id.toString() === c.id.toString()))
    .map(c => {
      const doneTopics = (completedTopics || []).filter(id => typeof id === 'string' && id.startsWith(c.topicPrefix)).length;
      const doneSub = (completedSubLessonIds || []).filter(id => typeof id === 'string' && (id.startsWith(c.topicPrefix) || (c.id === 2 && !id.startsWith("py-") && !id.startsWith("node-") && !id.startsWith("ui-")))).length;
      const totalDone = doneTopics + doneSub;
      const initialDone = totalDone;
      const pct = Math.min(100, Math.round((initialDone / c.lessons) * 100));
      return { ...c, done: initialDone, pct };
    });

  // ── STREAK CALCULATION ────────────────────────────────────────────────
  // We track activity days in localStorage as "ss_activity_days" = Set of YYYY-MM-DD strings
  const todayStr = new Date().toISOString().slice(0, 10);
  const activityKey = `ss_activity_${user?.email || user?.username || "guest"}`;
  const activityRaw = localStorage.getItem(activityKey);
  const activityDays = new Set(activityRaw ? JSON.parse(activityRaw) : []);

  // Mark today active if user has any XP or completed topics
  if ((currentXp > 0 || (completedTopics?.length || 0) > 0) && !activityDays.has(todayStr)) {
    activityDays.add(todayStr);
    localStorage.setItem(activityKey, JSON.stringify([...activityDays]));
  }

  // Compute current streak (consecutive days going back from today)
  const computeStreak = () => {
    let streak = 0;
    let d = new Date();
    while (true) {
      const s = d.toISOString().slice(0, 10);
      if (activityDays.has(s)) {
        streak++;
        d.setDate(d.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };
  const currentStreak = computeStreak();

  // Days of current week (Sun-Sat) for the 7 circles
  const DAYS_LABELS = ["S", "M", "T", "W", "T", "F", "S"];
  const weekDayActivity = DAYS_LABELS.map((lbl, i) => {
    const d = new Date();
    const todayDow = d.getDay(); // 0=Sun…6=Sat
    const diff = i - todayDow;
    d.setDate(d.getDate() + diff);
    const dStr = d.toISOString().slice(0, 10);
    return { label: lbl, active: activityDays.has(dStr) && diff <= 0 };
  });

  // Heatmap rows: 4 weeks back
  const getWeekHeatRow = (weeksBack) => {
    const squares = [];
    for (let dow = 0; dow < 7; dow++) {
      const d = new Date();
      const startOfWeek = d.getDate() - d.getDay(); // Sunday of current week
      d.setDate(startOfWeek - weeksBack * 7 + dow);
      const dStr = d.toISOString().slice(0, 10);
      // intensity based on completed topics that day (approx via presence)
      squares.push(activityDays.has(dStr) ? "l3" : "l0");
    }
    return squares;
  };

  const getWeekLabel = (weeksBack) => {
    const d = new Date();
    const startOfWeek = d.getDate() - d.getDay();
    const start = new Date(d); start.setDate(startOfWeek - weeksBack * 7);
    const end   = new Date(start); end.setDate(start.getDate() + 6);
    const fmt = (dt) => dt.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    if (weeksBack === 0) return "This Week";
    if (weeksBack === 1) return "Last Week";
    return `${fmt(start)} – ${fmt(end)}`;
  };



  // Exact 1-to-1 Sidebar Items matching unified dashboard structure
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

  return (
    <div className={`sdDashboardWrapper ${isDarkMode ? "dark-theme" : ""}`}>
      <Background />
      <PaperPlaneCursor />

      {/* Main Grid Layout Container */}
      <div className="sdMainContainer">
        
        {/* ── LEFT SIDEBAR COLUMN ── */}
        <aside className="sdLeftSidebar">
          <div>
            <Link to="/" className="sdBrandLogo" style={{ display: "inline-flex", alignItems: "center" }}>
              <AppLogo height="58px" />
            </Link>

            
            {/* Connected Arch Line & Orange Circular Home Button Header */}
            <div className="sdSidebarHomeArchHeader">
              <div className="sdArchLine" />
              <button
                className={`sdHomeCircularBtn ${activeTab === "dashboard" ? "active" : ""}`}
                onClick={() => setActiveTab("dashboard")}
                title="Dashboard Overview"
              >
                <FaHome />
              </button>
            </div>

            {/* Sidebar Navigation Items */}
            <ul className="sdNavList">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    className={`sdNavItem ${activeTab === item.id ? "active" : ""}`}
                    onClick={() => {
                      if (item.id === "courses") navigate("/courses");
                      else if (item.id === "learning-paths") navigate("/learning-paths");
                      else if (item.id === "assignments") navigate("/assignments");
                      else if (item.id === "ai-buddy") navigate("/ai-buddy");
                      else if (item.id === "career-roadmap") navigate("/career-roadmap");
                      else if (item.id === "opportunity-feed") navigate("/opportunity-feed");
                      else if (item.id === "badges") navigate("/badges");
                      else if (item.id === "discussions") navigate("/discussions");
                      else if (item.id === "certificates") navigate("/certificate");
                      else if (item.id === "progress") navigate("/progress");
                      else if (item.id === "daily-quests") navigate("/daily-quests");
                      else if (item.id === "resume") navigate("/resume");
                      else if (item.id === "code-arena") navigate("/code-arena");
                      else if (item.id === "student-profile") navigate("/student-profile");
                      else if (item.id === "services-catalog") navigate("/services-catalog");
                      else if (item.id === "assessments") navigate("/assessments");
                      else if (item.id === "certification-tracking") navigate("/certification-tracking");
                      
                      else if (item.id === "complaint-tracking") navigate("/complaint-tracking");
                      else if (item.id === "job-search") navigate("/job-search");
                      else setActiveTab(item.id);
                    }}
                  >
                    <span className="navIcon">{item.icon}</span>
                    <span className="navLabel">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom Sidebar Container: Rocket Graphic + Theme Controls */}
          <div className="sdSidebarBottomSection">
            <div className="sdRocketIllustrationBox">
              <span className="sdRocketEmoji">🚀</span>
              <div className="sdCloudDeco"></div>
            </div>

            <div className="sdSidebarFooterControls">
              <button className="sdThemeToggleBtn" onClick={toggleTheme} title={`Switch to ${isDarkMode ? "Light" : "Dark"} Mode`}>
                {isDarkMode ? <FaSun /> : <FaMoon />}
              </button>
              <span className="sdControlDivider">|</span>
              <button className="sdCollapseBtn" title="Collapse Menu">
                <FaArrowLeft />
              </button>
            </div>
          </div>
        </aside>

        {/* ── RIGHT MAIN BODY AREA ── */}
        <div className="sdRightBodyArea">
          
          {/* Top Header Bar matching Screenshot */}
          <header className="sdTopHeaderBar">
            <div className="sdSearchWrapper">
              <FaSearch className="sdSearchIcon" />
              <input
                type="text"
                className="sdSearchInput"
                placeholder="Search for courses, skills..."
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

          {/* DYNAMIC TAB VIEW ROUTING */}
          {activeTab === "ai-buddy" ? (
            <AIStudyBuddy />
          ) : activeTab === "opportunity-feed" ? (
            <OpportunityFeed />
          ) : activeTab === "streak-heatmap" ? (
            <StreakHeatmap />
          ) : (
            /* ── DASHBOARD OVERVIEW (EXACT 1-TO-1 MATCH OF SCREENSHOT) ── */
            <>
              {/* Greeting Header */}
              <div className="sdGreetingHeader">
                <h1>Welcome back, {userName}! 👋</h1>
                <p>Keep learning, keep growing. You're doing great!</p>
              </div>

              {/* 2-Column Main Dashboard Grid */}
              <div className="sdDashboardContentGrid">
                
                {/* ── CENTER COLUMN ── */}
                <div className="sdCenterMainCol">
                  
                  {/* Your Progress Hero Card */}
                  <div className="sdProgressHeroCard">
                    <div className="sdProgressLeftInfo">
                      <span className="sdLevelTagPill">Level {level}</span>
                      <div className="sdProgressTitle">Your Progress</div>
                      <div className="sdXpNumbersHeading">
                        {xpInCurrentLevel} / 2000 XP
                      </div>

                      <div className="sdXpProgressBarTrack">
                        <div
                          className="sdXpProgressBarFill"
                          style={{ width: `${progressPct}%` }}
                        ></div>
                      </div>
                      <span className="sdXpToNextLevelText">{xpToNext} XP to Level {level + 1}</span>
                    </div>

                    <div className="sdHeroIllustrationBox">
                      <img
                        src={isDarkMode ? darkStudentHeroImg : studentHeroImg}
                        alt="Students Studying Illustration"
                        className="sdHeroIllustrationImg"
                      />
                    </div>
                  </div>

                  {/* 4 Stat Cards Row */}
                  <div className="sdStatCardsRow">
                    <div className="sdMiniStatCard" onClick={() => navigate("/courses")} style={{ cursor: "pointer" }}>
                      <div className="sdStatIconBox orangeBox">
                        <FaBook />
                      </div>
                      <div className="sdStatValueText">
                        <span className="statLabel">Courses Enrolled</span>
                        <strong>{userEnrolledCount}</strong>
                        <span className="sdStatSublink orange">Active Courses</span>
                      </div>
                    </div>

                    <div className="sdMiniStatCard" onClick={() => navigate("/certificate")} style={{ cursor: "pointer" }}>
                      <div className="sdStatIconBox purpleBox">
                        <FaCertificate />
                      </div>
                      <div className="sdStatValueText">
                        <span className="statLabel">Certificates Earned</span>
                        <strong>{earnedCertsCount}</strong>
                        <span className="sdStatSublink orange">View All</span>
                      </div>
                    </div>

                    <div className="sdMiniStatCard" onClick={() => navigate("/badges")} style={{ cursor: "pointer" }}>
                      <div className="sdStatIconBox yellowBox">
                        <FaTrophy />
                      </div>
                      <div className="sdStatValueText">
                        <span className="statLabel">Badges Earned</span>
                        <strong>{earnedBadgesCount}</strong>
                        <span className="sdStatSublink orange">View All</span>
                      </div>
                    </div>

                    <div className="sdMiniStatCard" onClick={() => navigate("/progress")} style={{ cursor: "pointer" }}>
                      <div className="sdStatIconBox orangeBox">
                        <FaBolt />
                      </div>
                      <div className="sdStatValueText">
                        <span className="statLabel">Total XP</span>
                        <strong>{currentXp}</strong>
                        <span className="sdStatSublink orange">Keep Learning!</span>
                      </div>
                    </div>
                  </div>


                  {/* Daily Quests Widget */}
                  <div className="sdWhitePanelCard" style={{ marginTop: "24px" }}>
                    <div className="sdPanelHeaderRow">
                      <h3>Daily Quests</h3>
                      <span className="sdTimerText">Resets in 12:34:56</span>
                    </div>

                    <div className="sdQuestsList">
                      <div className="sdQuestRow">
                        <div className="questRowLeft">
                          <div className="questIconBox orange"><FaFileAlt /></div>
                          <span>Complete 1 Lesson</span>
                        </div>
                        <div className="questRowRight">
                          <span className="questFraction">0 / 1</span>
                          <span className="questRewardPill">+20 XP 🎁</span>
                        </div>
                      </div>

                      <div className="sdQuestRow">
                        <div className="questRowLeft">
                          <div className="questIconBox cyan"><FaCode /></div>
                          <div className="questTitleWithProgress">
                            <span>Solve 3 Coding Problems</span>
                            <div className="miniTrack">
                              <div className="miniFill" style={{ width: "0%" }}></div>
                            </div>
                          </div>
                        </div>
                        <div className="questRowRight">
                          <span className="questFraction">0 / 3</span>
                          <span className="questRewardPill">+30 XP 🎁</span>
                        </div>
                      </div>

                      <div className="sdQuestRow">
                        <div className="questRowLeft">
                          <div className="questIconBox yellow"><FaComments /></div>
                          <span>Participate in Discussion</span>
                        </div>
                        <div className="questRowRight">
                          <span className="questFraction">0 / 1</span>
                          <span className="questRewardPill">+10 XP 🎁</span>
                        </div>
                      </div>
                    </div>

                    <button className="btnSolidOrangeClaim" onClick={() => navigate("/daily-quests")}>
                      🎁 Claim All Rewards
                    </button>
                  </div>

                  {/* Continue Learning Cards Grid */}
                  <div className="sdWhitePanelCard" style={{ marginTop: "24px" }}>
                    <div className="sdPanelHeaderRow">
                      <h3>Continue Learning</h3>
                      <span className="sdViewAllLink" onClick={() => navigate("/courses")}>View All</span>
                    </div>

                    {enrolledCourseCards.length > 0 ? (
                      <div className="sdContinueLearningGrid">
                        {enrolledCourseCards.map(c => (
                          <div
                            key={c.id}
                            className="sdCourseCardBox"
                            onClick={() => navigate("/courses")}
                            style={{ cursor: "pointer" }}
                          >
                            <div className="sdCourseHeaderRow">
                              <div
                                className="sdCourseIconBadge"
                                style={{ background: c.iconBg, color: c.iconColor }}
                              >
                                {c.icon}
                              </div>
                              <FaEllipsisH className="moreDots" />
                            </div>
                            <h4>{c.title}</h4>
                            <p style={{ fontSize: "10px", color: "var(--text-secondary, #64748B)", margin: "0 0 8px 0" }}>
                              {c.done} / {c.lessons} lessons done
                            </p>
                            <div className="sdCourseProgressBar">
                              <div className="sdCourseProgressFill" style={{ width: `${c.pct}%` }}></div>
                            </div>
                            <div className="sdCourseFooterRow">
                              <span className="sdCoursePctText">{c.pct}% Complete</span>
                              <button
                                className="btnContinueCourse"
                                onClick={e => { e.stopPropagation(); navigate("/courses"); }}
                              >
                                Continue
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="sdEmptyStateBox" style={{ textAlign: "center", padding: "32px", background: "#FAF8F5", borderRadius: "16px", border: "1px dashed #FAD6C8", marginTop: "16px" }}>
                        <div style={{ fontSize: "32px", marginBottom: "12px" }}>📚</div>
                        <h4 style={{ margin: "0 0 8px 0", color: "#1E1B18" }}>No Courses Enrolled</h4>
                        <p style={{ fontSize: "12px", color: "#64748B", margin: "0 0 16px 0" }}>You haven't enrolled in any courses yet. Explore our catalog to start learning!</p>
                        <button className="btnOutlineOrange" onClick={() => navigate("/courses")}>
                          Browse Courses
                        </button>
                      </div>
                    )}
                  </div>


                  {/* Build Your Career Ready Profile Promotional Card */}
                  <div className="sdCareerProfileCard">
                    <div className="careerCardLeft">
                      <h3>Build Your Career Ready Profile</h3>
                      <p>Create a professional resume, showcase your skills and stand out to top recruiters.</p>
                       <button className="btnCreateResume" onClick={() => navigate("/student-profile")}>
                        Create Profile
                      </button>
                    </div>
                    <div className="careerCardRight">
                      <div className="clipboardGraphic">
                        📋 🪴
                      </div>
                    </div>
                  </div>

                  {/* Motivational Quote Footer Banner */}
                 {/* <div className="sdQuoteBanner">
                    <FaQuoteLeft className="quoteIcon" />
                    <span>"The beautiful thing about learning is nobody can take it away from you."</span>
                    <strong className="quoteAuthor">— B.B. King</strong>
                  </div>*/}

                </div>

                {/* ── RIGHT COLUMN SIDEBAR WIDGETS (EXACT SCREENSHOT) ── */}
                <div className="sdRightColumnSidebar">
                  
                  {/* Learning Streak Card */}
                  <div className="sdRightWidgetCard">
                    <div className="sdStreakHeaderRow">
                      <span className="widgetTitle">Learning Streak 🔥</span>
                    </div>
                    <div className="sdStreakBigVal">{currentStreak} {currentStreak === 1 ? "Day" : "Days"}</div>
                    <div className="sdStreakSub">
                      {currentStreak === 0
                        ? "Start learning today to build your streak!"
                        : currentStreak < 3
                        ? "Great start! Keep going!"
                        : currentStreak < 7
                        ? `${currentStreak} days strong — you're on a roll! 🚀`
                        : `Amazing! ${currentStreak}-day streak! 🏆`}
                    </div>

                    <div className="sdDaysRow">
                      {weekDayActivity.map((day, i) => (
                        <div key={i} className={`dayCol${day.active ? " active" : ""}`}>
                          <span>{day.label}</span>
                          <div className={`dayCircle${day.active ? " flame" : ""}`}>
                            {day.active ? "🔥" : ""}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Learning Streak Heatmap Widget */}
                  <div className="sdRightWidgetCard">
                    <div className="widgetTitleRow">
                      <h4>Activity Heatmap</h4>
                    </div>

                    <div className="miniHeatmapWrapper">
                      <div className="heatmapHeaderDays">
                        <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
                      </div>

                      {[0, 1, 2, 3].map(weeksBack => (
                        <div key={weeksBack} className="heatmapRowItem">
                          <span className="rowLabel">{getWeekLabel(weeksBack)}</span>
                          <div className="squaresRow">
                            {getWeekHeatRow(weeksBack).map((lvl, j) => (
                              <span key={j} className={`sq ${lvl}`}></span>
                            ))}
                          </div>
                        </div>
                      ))}

                      <div className="heatmapLegendFooter">
                        <span>Less</span>
                        <span className="legendBox sq l0"></span>
                        <span className="legendBox sq l1"></span>
                        <span className="legendBox sq l2"></span>
                        <span className="legendBox sq l3"></span>
                        <span className="legendBox sq l4"></span>
                        <span>More</span>
                        {currentStreak >= 3 && <span className="greatPill">Great! 🔥</span>}
                      </div>
                    </div>
                  </div>


                  {/* AI Study Buddy Interactive Chat Widget */}
                  <div className="sdRightWidgetCard">
                    <div className="widgetTitleRow">
                      <h4>AI Study Buddy</h4>
                    </div>

                    <div className="miniAiBuddyBox">
                      <div className="aiBotGreeting">
                        <div className="botAvatar">🤖</div>
                        <div className="botBubble">
                          Hi {userName}! 👋 How can I help you today?
                        </div>
                      </div>

                      <div className="aiQuickChips">
                        <button onClick={() => setWidgetChatInput("Explain a topic")}>Explain a topic</button>
                        <button onClick={() => setWidgetChatInput("Quiz me")}>Quiz me</button>
                        <button onClick={() => setWidgetChatInput("Suggest resources")}>Suggest resources</button>
                      </div>

                      <div className="aiWidgetInputRow">
                        <input
                          type="text"
                          placeholder="Ask me anything..."
                          value={widgetChatInput}
                          onChange={(e) => setWidgetChatInput(e.target.value)}
                        />
                        <button
                          className="btnWidgetSend"
                          onClick={() => {
                            if (widgetChatInput.trim()) {
                              setActiveTab("ai-buddy");
                            }
                          }}
                        >
                          <FaPaperPlane />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Opportunity Feed Widget */}
                  <div className="sdRightWidgetCard">
                    <div className="sdPanelHeaderRow">
                      <h4>Opportunity Feed</h4>
                      <span className="sdViewAllLink" onClick={() => navigate("/opportunity-feed")}>View All</span>
                    </div>

                    <div className="miniOppFeedList">
                      <div className="oppFeedItem">
                        <div className="oppIconBox blue"><FaBriefcase /></div>
                        <div className="oppItemDetails">
                          <h5>Web Dev Internship</h5>
                          <span>Acme Corp • Internship</span>
                        </div>
                        <div className="oppItemMeta">
                          <span className="badgeNew">New</span>
                          <span className="timeAgo">2h ago</span>
                        </div>
                      </div>

                      <div className="oppFeedItem">
                        <div className="oppIconBox purple"><FaCode /></div>
                        <div className="oppItemDetails">
                          <h5>React Developer (Fresher)</h5>
                          <span>TechNova • Full-time</span>
                        </div>
                        <div className="oppItemMeta">
                          <span className="badgeNew">New</span>
                          <span className="timeAgo">5h ago</span>
                        </div>
                      </div>

                      <div className="oppFeedItem">
                        <div className="oppIconBox green"><FaLaptopCode /></div>
                        <div className="oppItemDetails">
                          <h5>UI/UX Design Challenge</h5>
                          <span>DesignVerse • Competition</span>
                        </div>
                        <div className="oppItemMeta">
                          <span className="badgeNew">New</span>
                          <span className="timeAgo">1d ago</span>
                        </div>
                      </div>
                    </div>

                    <div className="exploreOppLink" onClick={() => navigate("/opportunity-feed")}>
                      Explore More Opportunities →
                    </div>
                  </div>

                  {/* Quick Actions 3x2 Grid */}
                  <div className="sdRightWidgetCard">
                    <div className="widgetTitleRow">
                      <h4>Quick Actions</h4>
                    </div>

                    <div className="sdQuickActionsGrid">
                      <div className="sdQuickActionItem" onClick={() => navigate("/courses")}>
                        <div className="sdQuickActionIcon"><FaBook /></div>
                        <span>Browse Courses</span>
                      </div>

                      <div className="sdQuickActionItem" onClick={() => navigate("/resume")}>
                        <div className="sdQuickActionIcon"><FaFileInvoice /></div>
                        <span>Resume Builder</span>
                      </div>

                      <div className="sdQuickActionItem" onClick={() => navigate("/progress")}>
                        <div className="sdQuickActionIcon"><FaChartLine /></div>
                        <span>Progress</span>
                      </div>

                      <div className="sdQuickActionItem" onClick={() => navigate("/certificate")}>
                        <div className="sdQuickActionIcon"><FaAward /></div>
                        <span>Certificate Center</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Right Illustration Decor: Books & Plant */}
                  <div className="sdBottomPlantBooksDecor">
                    🪴 📚
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
