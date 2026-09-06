import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Background from "../components/Background";
import PaperPlaneCursor from "../components/PaperPlaneCursor";
import StudentFooter from "../components/StudentFooter";
import NotificationDropdown from "../components/NotificationDropdown";
import UserAvatar from "../components/UserAvatar";
import {
  FaHome, FaBook, FaCodeBranch, FaAward, FaCertificate, FaChartLine,
  FaFileInvoice, FaCog, FaSearch, FaSun, FaMoon, FaArrowLeft,
  FaSignOutAlt, FaCheckCircle, FaHourglassHalf, FaList, FaRegCheckCircle, FaRobot, FaRocket, FaBolt, FaCode
} from "react-icons/fa";
import "../styles/studentDashboard.css";

import AppLogo from "../components/AppLogo";

export default function TrackingDashboardPage() {
  const { user, xp, logout, themeMode, toggleTheme, enrolledCourses, completedTopics } = useAuth();
  const navigate = useNavigate();
  const isDarkMode = themeMode === "dark";
  const [activeTab, setActiveTab] = useState("learning"); // "learning" | "enrolled" | "paths" | "completed"

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error(err);
    } finally {
      navigate("/");
    }
  };

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

  // Course Catalog Database matching StudentHome
  const COURSE_CATALOG = [
    { id: 1, title: "JavaScript Fundamentals", icon: "JS", topicPrefix: "js_", lessons: 12 },
    { id: 2, title: "React.js Development", icon: "⚛️", topicPrefix: "react_", lessons: 18 },
    { id: 3, title: "Python for Beginners", icon: "🐍", topicPrefix: "python_", lessons: 16 },
    { id: 4, title: "UI/UX Design Essentials", icon: "🎨", topicPrefix: "uiux_", lessons: 14 },
    { id: 5, title: "Data Structures & Algo", icon: "📊", topicPrefix: "dsa_", lessons: 20 },
    { id: 6, title: "Node.js Essentials", icon: "🟢", topicPrefix: "node_", lessons: 15 }
  ];

  // Map progress stats
  const trackCourses = COURSE_CATALOG.map(c => {
    const doneCount = (completedTopics || []).filter(id => typeof id === 'string' && id.startsWith(c.topicPrefix)).length;
    const pct = Math.min(100, Math.round((doneCount / c.lessons) * 100));
    return { ...c, done: doneCount, pct };
  });

  const enrolledCourseIds = (enrolledCourses || []).map(id => id.toString());
  // Filter based on requested tracking items:
  // i) Courses Learning (progress > 0% and < 100%)
  const learningCourses = trackCourses.filter(c => enrolledCourseIds.includes(c.id.toString()) && c.pct > 0 && c.pct < 100);

  // ii) Enrolled Courses (all active enrolled courses)
  const enrolledList = trackCourses.filter(c => enrolledCourseIds.includes(c.id.toString()));

  // iii) Learning Paths (enrolled career pathways)
  const feDone = (completedTopics || []).filter(id => typeof id === 'string' && (id.startsWith("react_") || id.startsWith("js_"))).length;
  const fePct = Math.min(100, Math.round((feDone / 30) * 100));
  const feMods = Math.min(6, Math.floor((fePct / 100) * 6));

  const beDone = (completedTopics || []).filter(id => typeof id === 'string' && (id.startsWith("node_") || id.startsWith("springboot_"))).length;
  const bePct = Math.min(100, Math.round((beDone / 25) * 100));
  const beMods = Math.min(5, Math.floor((bePct / 100) * 5));

  const learningPaths = [
    { id: 1, title: "Frontend Developer Path", progress: fePct, completedModules: feMods, totalModules: 6 },
    { id: 2, title: "Backend Systems Architect Path", progress: bePct, completedModules: beMods, totalModules: 5 }
  ];

  // iv) Completed Courses (courses at 100%)
  const completedList = trackCourses.filter(c => c.pct === 100);

  return (
    <div className={`sdDashboardWrapper ${isDarkMode ? "dark-theme" : ""}`}>
      <Background />
      <PaperPlaneCursor />

      <div className="sdMainContainer">
        {/* Left Sidebar */}
        <aside className="sdLeftSidebar">
          <div>
            <Link to="/" className="sdBrandLogo" style={{ display: "inline-flex", alignItems: "center" }}>
              <AppLogo height="58px" />
            </Link>
            <div className="sdSidebarHomeArchHeader">
              <div className="sdArchLine" />
              <button className="sdHomeCircularBtn" onClick={() => navigate("/student-home")}>
                <FaHome />
              </button>
            </div>
            <ul className="sdNavList">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    className={`sdNavItem ${item.id === "tracking-dashboard" ? "active" : ""}`}
                    onClick={() => {
                      if (item.id === "dashboard") navigate("/student-home");
                      else if (item.id === "settings") navigate("/settings");
                      else if (item.id === "courses") navigate("/courses");
                      else if (item.id === "learning-paths") navigate("/learning-paths");
                      else if (item.id === "assignments") navigate("/assignments");
                      else if (item.id === "ai-buddy") navigate("/ai-buddy");
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
                      else if (item.id === "tracking-dashboard") navigate("/tracking-dashboard");
                      else if (item.id === "complaint-tracking") navigate("/complaint-tracking");
                      else if (item.id === "career-roadmap") navigate("/career-roadmap");
                      else if (item.id === "job-search") navigate("/job-search");
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
            <div className="sdSidebarFooterControls">
              <button className="sdThemeToggleBtn" onClick={toggleTheme}>
                {isDarkMode ? <FaSun /> : <FaMoon />}
              </button>
              <span className="sdControlDivider">|</span>
              <button className="sdCollapseBtn" onClick={() => navigate(-1)}>
                <FaArrowLeft />
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="sdRightBodyArea">
          <header className="sdTopHeaderBar">
            <div className="sdSearchWrapper">
              <FaSearch className="sdSearchIcon" />
              <input type="text" className="sdSearchInput" placeholder="Search trackings..." />
            </div>
            <div className="sdHeaderActionsRow">
              <div className="sdXpBadgePill">
                <FaBolt color="#F9572A" /> <span>{xp ?? 0} XP</span>
              </div>
              <NotificationDropdown type="student" />
              <button className="sdLogoutHeaderBtn" onClick={handleLogout}>
                <FaSignOutAlt /> <span>Logout</span>
              </button>
              <div className="sdUserProfilePillWrapper">
                <div className="sdUserProfilePill">
                  <UserAvatar user={user} />
                  <div className="sdUserInfoText">
                    <strong>{user?.full_name || "Learner"}</strong>
                    <span>Student</span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <div className="sdGreetingHeader">
            <h1>Tracking Dashboard</h1>
            <p>Analyse your progression across active study tracks, learning programs, and certified paths.</p>
          </div>

          {/* Sub Navigation Tabs */}
          <div style={{ display: "flex", gap: "10px", margin: "0 0 24px 0", borderBottom: "1px solid var(--border-color)", paddingBottom: "10px", flexWrap: "wrap" }}>
            <button
              onClick={() => setActiveTab("learning")}
              style={{
                padding: "10px 20px",
                background: activeTab === "learning" ? "var(--btn-primary-bg)" : "none",
                color: activeTab === "learning" ? "var(--btn-primary-text)" : "var(--text-secondary)",
                border: "none",
                borderRadius: "20px",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              📚 Courses Learning
            </button>
            <button
              onClick={() => setActiveTab("enrolled")}
              style={{
                padding: "10px 20px",
                background: activeTab === "enrolled" ? "var(--btn-primary-bg)" : "none",
                color: activeTab === "enrolled" ? "var(--btn-primary-text)" : "var(--text-secondary)",
                border: "none",
                borderRadius: "20px",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              📝 Enrolled Courses
            </button>
            <button
              onClick={() => setActiveTab("paths")}
              style={{
                padding: "10px 20px",
                background: activeTab === "paths" ? "var(--btn-primary-bg)" : "none",
                color: activeTab === "paths" ? "var(--btn-primary-text)" : "var(--text-secondary)",
                border: "none",
                borderRadius: "20px",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              🛣️ Learning Paths
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              style={{
                padding: "10px 20px",
                background: activeTab === "completed" ? "var(--btn-primary-bg)" : "none",
                color: activeTab === "completed" ? "var(--btn-primary-text)" : "var(--text-secondary)",
                border: "none",
                borderRadius: "20px",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              ✓ Completed Courses
            </button>
          </div>

          <div className="sdDashboardContentGrid">
            {/* Center column: dynamic content */}
            <div className="sdCenterMainCol">
              <div className="sdWhitePanelCard">
                {activeTab === "learning" && (
                  <div>
                    <h3>Currently Learning</h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: "13px", marginBottom: "20px" }}>Courses you are actively reading with lessons left.</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      {learningCourses.length > 0 ? learningCourses.map(c => (
                        <div key={c.id} style={{ padding: "16px", background: "var(--bg-secondary)", borderRadius: "10px", border: "1px solid var(--border-color)" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                            <strong style={{ color: "var(--text-primary)" }}>{c.title}</strong>
                            <span style={{ fontSize: "12px", color: "var(--accent)" }}>{c.pct}% complete</span>
                          </div>
                          <div style={{ width: "100%", height: "6px", background: "rgba(255,255,255,0.05)", borderRadius: "3px" }}>
                            <div style={{ width: `${c.pct}%`, height: "100%", background: "var(--accent)", borderRadius: "3px" }}></div>
                          </div>
                        </div>
                      )) : <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>No courses currently in-progress.</p>}
                    </div>
                  </div>
                )}

                {activeTab === "enrolled" && (
                  <div>
                    <h3>All Enrolled Courses</h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: "13px", marginBottom: "20px" }}>Complete overview of all classes you joined.</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      {enrolledList.length > 0 ? enrolledList.map(c => (
                        <div key={c.id} style={{ padding: "16px", background: "var(--bg-secondary)", borderRadius: "10px", border: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                          <div>
                            <strong style={{ color: "var(--text-primary)", display: "block" }}>{c.title}</strong>
                            <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{c.done} of {c.lessons} lessons completed</span>
                          </div>
                          <button className="btnContinueCourse" onClick={() => navigate("/courses")}>Study</button>
                        </div>
                      )) : <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>No enrolled courses found.</p>}
                    </div>
                  </div>
                )}

                {activeTab === "paths" && (
                  <div>
                    <h3>Career Learning Paths</h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: "13px", marginBottom: "20px" }}>Structured roadmap curriculums aligned to job roles.</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      {learningPaths.map(p => (
                        <div key={p.id} style={{ padding: "16px", background: "var(--bg-secondary)", borderRadius: "10px", border: "1px solid var(--border-color)" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                            <strong style={{ color: "var(--text-primary)" }}>{p.title}</strong>
                            <span style={{ fontSize: "12px", color: "var(--accent)" }}>{p.progress}%</span>
                          </div>
                          <div style={{ width: "100%", height: "6px", background: "rgba(255,255,255,0.05)", borderRadius: "3px", marginBottom: "8px" }}>
                            <div style={{ width: `${p.progress}%`, height: "100%", background: "var(--accent)", borderRadius: "3px" }}></div>
                          </div>
                          <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>{p.completedModules} of {p.totalModules} modules unlocked</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "completed" && (
                  <div>
                    <h3>Completed & Graduated Courses</h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: "13px", marginBottom: "20px" }}>Your academic achievements that earned certificates.</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      {completedList.map(c => (
                        <div key={c.id} style={{ padding: "16px", background: "var(--bg-secondary)", borderRadius: "10px", border: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <strong style={{ color: "var(--text-primary)", display: "block" }}>{c.title}</strong>
                            <span style={{ fontSize: "12px", color: "#10b981" }}>Passed with 100% marks</span>
                          </div>
                          <button className="btnOutlineOrange" onClick={() => navigate("/certificate")}>View Certificate</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <StudentFooter />
    </div>
  );
}
