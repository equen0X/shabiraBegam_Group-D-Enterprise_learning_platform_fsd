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
  FaSignOutAlt, FaRocket, FaBolt, FaCode, FaRobot, FaCheckCircle, FaLock, FaExternalLinkAlt, FaClock
} from "react-icons/fa";
import "../styles/studentDashboard.css";

import AppLogo from "../components/AppLogo";

export default function CertificationTrackingPage() {
  const { user, xp, logout, themeMode, toggleTheme, completedTopics } = useAuth();
  const navigate = useNavigate();
  const isDarkMode = themeMode === "dark";
  const [searchId, setSearchId] = useState("");
  const [verificationResult, setVerificationResult] = useState(null);

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

  // Dynamic certificate progress calculations based on completedTopics
  const userKey = user?.email || user?.username || "default";
  const isDemoUser = userKey === "soumitriroy@gmail.com" || userKey === "soumitriroy" || userKey === "default" || user?.isDemo;
  const userCompletedTopics = completedTopics || [];

  const completedSubLessonIds = (() => {
    try {
      const saved = localStorage.getItem(`skillsphere_completed_sub_lessons_${userKey}`);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  })();

  const getModulesCompleted = (prefix, totalModules, totalLessons, demoDefault) => {
    const doneTopics = userCompletedTopics.filter(id => typeof id === 'string' && id.startsWith(prefix)).length;
    const doneSub = completedSubLessonIds.filter(id => typeof id === 'string' && (id.startsWith(prefix) || (prefix === "react_" && !id.startsWith("py-") && !id.startsWith("node-") && !id.startsWith("ui-")))).length;
    const totalDone = doneTopics + doneSub;
    if (totalDone > 0) {
      const pct = Math.min(100, Math.round((totalDone / 12) * 100));
      return Math.min(totalModules, Math.ceil((pct / 100) * totalModules));
    }
    return 0;
  };

  const certPaths = [
    {
      id: "react",
      title: "React.js Developer Certificate",
      modulesTotal: 6,
      modulesCompleted: getModulesCompleted("react_", 6, 18, 4),
      topicPrefix: "react_",
      instructor: "Hitesh Choudhary",
      unlockReq: "Complete all 6 React Developer modules (85% completed).",
      credentialId: "SS-25-05-REACT-88910",
      issueDate: "May 15, 2026"
    },
    {
      id: "node",
      title: "Node.js & Backend Architecture Certificate",
      modulesTotal: 5,
      modulesCompleted: getModulesCompleted("node_", 5, 15, 2),
      topicPrefix: "node_",
      instructor: "Telusko",
      unlockReq: "Complete all 5 Node.js microservices modules.",
      credentialId: "SS-25-05-NODE4-12345",
      issueDate: "May 28, 2026"
    },
    {
      id: "js",
      title: "JavaScript Essentials Professional",
      modulesTotal: 6,
      modulesCompleted: getModulesCompleted("js_", 6, 12, 6),
      topicPrefix: "js_",
      instructor: "Akshay Saini",
      unlockReq: "Complete all 6 JavaScript modules to unlock.",
      credentialId: "SS-25-04-JS2-44512",
      issueDate: "April 12, 2026"
    }
  ].map(path => {
    const isEarned = path.modulesCompleted === path.modulesTotal;
    return {
      ...path,
      status: isEarned ? "earned" : "in-progress"
    };
  });

  // Credential registry for instant verification checks
  const credentialRegistry = {
    "SS-25-04-JS2-44512": { title: "JavaScript Essentials Professional", instructor: "Akshay Saini", date: "April 12, 2026" },
    "SS-25-05-REACT-88910": { title: "React.js Developer Certificate", instructor: "Hitesh Choudhary", date: "May 15, 2026" },
    "SS-25-05-NODE4-12345": { title: "Node.js & Backend Architecture Certificate", instructor: "Telusko", date: "May 28, 2026" },
    "SS-25-04-PY2-99812": { title: "Python Data Science Certificate", instructor: "Corey Schafer", date: "April 30, 2026" },
    "SS-25-03-UI1-33412": { title: "Figma UI/UX Masterclass Certificate", instructor: "Dan Walter", date: "March 15, 2026" },
    "SS-25-03-DSA-77123": { title: "Data Structures & Algorithms Certificate", instructor: "Striver (takeUforward)", date: "March 22, 2026" },
    "SS-25-06-NEXT-91023": { title: "Fullstack Next.js 14 Certificate", instructor: "Vercel Academy", date: "June 10, 2026" },
    "SS-25-06-SPRING-11234": { title: "Spring Boot Microservices Certificate", instructor: "In28Minutes", date: "June 25, 2026" }
  };

  const handleVerify = () => {
    const trimmed = searchId.trim();
    if (!trimmed) return;
    const match = credentialRegistry[trimmed];
    if (match) {
      setVerificationResult({
        success: true,
        ...match
      });
    } else {
      setVerificationResult({
        success: false,
        message: "No certificate found matching ID: " + trimmed
      });
    }
  };

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
                    className={`sdNavItem ${item.id === "certification-tracking" ? "active" : ""}`}
                    onClick={() => {
                      if (item.id === "dashboard") navigate("/student-home");
                      else if (item.id === "student-profile") navigate("/student-profile");
                      else if (item.id === "services-catalog") navigate("/services-catalog");
                      else if (item.id === "assessments") navigate("/assessments");
                      else if (item.id === "certification-tracking") navigate("/certification-tracking");
                      
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
              <input type="text" className="sdSearchInput" placeholder="Search certificates..." />
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
            <h1>Certification Tracking Session</h1>
            <p>Track modules completion, unlock credentials, and verify your professional status.</p>
          </div>

          <div className="sdDashboardContentGrid">
            {/* Center column: Cert timelines */}
            <div className="sdCenterMainCol">
              <div className="sdWhitePanelCard" style={{ marginBottom: "24px" }}>
                <h3>Active Certification Goals</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginBottom: "20px" }}>
                  Timelines representing your progression towards professional certifications.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  {certPaths.map((path) => {
                    const progressVal = Math.round((path.modulesCompleted / path.modulesTotal) * 100);
                    return (
                      <div key={path.id} style={{ padding: "20px", background: "var(--bg-secondary)", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "10px" }}>
                          <h4 style={{ margin: 0, color: "var(--text-primary)", fontSize: "16px" }}>{path.title}</h4>
                          <span style={{ fontSize: "11px", padding: "4px 10px", borderRadius: "20px", fontWeight: "bold", background: path.status === "earned" ? "#dcfce7" : "#fffbeb", color: path.status === "earned" ? "#166534" : "#854d0e" }}>
                            {path.status === "earned" ? "Earned & Verified" : "In Progress"}
                          </span>
                        </div>

                        <p style={{ margin: "0 0 16px 0", fontSize: "13px", color: "var(--text-secondary)" }}>
                          Instructor: <strong>{path.instructor}</strong>
                        </p>

                        <div style={{ marginBottom: "16px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--text-secondary)", marginBottom: "6px" }}>
                            <span>Modules: {path.modulesCompleted} / {path.modulesTotal} Completed</span>
                            <span>{progressVal}%</span>
                          </div>
                          <div style={{ width: "100%", height: "8px", background: "rgba(255,255,255,0.05)", borderRadius: "4px" }}>
                            <div style={{ width: `${progressVal}%`, height: "100%", background: path.status === "earned" ? "#10b981" : "var(--accent)", borderRadius: "4px" }}></div>
                          </div>
                        </div>

                        {path.status === "earned" ? (
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg-primary)", padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--border-color)", flexWrap: "wrap", gap: "10px" }}>
                            <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Credential ID: <strong>{path.credentialId}</strong></span>
                            <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Issued: {path.issueDate}</span>
                          </div>
                        ) : (
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                            <div style={{ display: "flex", gap: "8px", alignItems: "center", color: "var(--text-muted)", fontSize: "12px" }}>
                              <FaLock /> <span>{path.unlockReq}</span>
                            </div>
                            <button className="btnContinueCourse" style={{ padding: "6px 12px", fontSize: "12px" }} onClick={() => navigate("/courses")}>
                              Resume Learning
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Verify credential registry lookup */}
            <div className="sdRightColumnSidebar">
              <div className="sdRightWidgetCard">
                <h4>Verify Certificate</h4>
                <p style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: "1.5", margin: "8px 0 16px 0" }}>
                  Verify a SkillSphere issued certificate by its alphanumeric Credential ID.
                </p>
                <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                  <input 
                    type="text" 
                    placeholder="e.g. SS-25-04-JS2-44512" 
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    style={{ flex: 1, padding: "8px 12px", background: "var(--input-bg)", color: "var(--text-primary)", border: "1px solid var(--border-color)", borderRadius: "8px", fontSize: "13px" }} 
                  />
                  <button className="btnContinueCourse" style={{ padding: "8px 14px" }} onClick={handleVerify}>Check</button>
                </div>

                {verificationResult && (
                  <div style={{ padding: "12px", background: verificationResult.success ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)", borderRadius: "8px", border: verificationResult.success ? "1px solid #10b981" : "1px solid #ef4444" }}>
                    {verificationResult.success ? (
                      <div>
                        <span style={{ fontSize: "12px", color: "#10b981", fontWeight: "bold", display: "block" }}>✅ Verified Authenticity</span>
                        <strong style={{ display: "block", fontSize: "13px", marginTop: "4px", color: "var(--text-primary)" }}>{verificationResult.title}</strong>
                        <span style={{ fontSize: "11px", color: "var(--text-secondary)", display: "block", marginTop: "2px" }}>Instructor: {verificationResult.instructor}</span>
                        <span style={{ fontSize: "11px", color: "var(--text-secondary)", display: "block" }}>Recipient: {user?.full_name || "Learner"}</span>
                        <span style={{ fontSize: "11px", color: "var(--text-secondary)", display: "block" }}>Issued: {verificationResult.date}</span>
                      </div>
                    ) : (
                      <span style={{ fontSize: "12px", color: "#ef4444", fontWeight: "bold" }}>❌ Invalid Credential ID</span>
                    )}
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
