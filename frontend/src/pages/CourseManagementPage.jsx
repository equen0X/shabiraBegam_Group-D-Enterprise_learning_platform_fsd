import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Background from "../components/Background";
import StudentFooter from "../components/StudentFooter";
import NotificationDropdown from "../components/NotificationDropdown";
import {
  FaHome, FaBook, FaCodeBranch, FaAward, FaCertificate, FaChartLine,
  FaFileInvoice, FaCog, FaSearch, FaSun, FaMoon, FaArrowLeft,
  FaSignOutAlt, FaPlus, FaTrash, FaEdit, FaCheck, FaTimes, FaRobot, FaRocket, FaBolt, FaCode
} from "react-icons/fa";
import "../styles/studentDashboard.css";

import { useAdmin } from "../context/AdminContext";

import AppLogo from "../components/AppLogo";

export default function CourseManagementPage() {
  const { user, xp, logout, themeMode, toggleTheme } = useAuth();
  const { courses: adminCourses, pendingCourseRequests, users, workforce, allRegisteredUsers, getCourseEnrolledStudents } = useAdmin();
  const navigate = useNavigate();
  const isDarkMode = themeMode === "dark";

  const defaultCourses = [
    { id: 1, title: "JavaScript Fundamentals", category: "Development", lessons: 12, enrollments: 1420 },
    { id: 2, title: "React.js Development", category: "Development", lessons: 18, enrollments: 2450 },
    { id: 3, title: "Python for Beginners", category: "Data Science", lessons: 16, enrollments: 1890 },
    { id: 4, title: "UI/UX Design Essentials", category: "Design", lessons: 14, enrollments: 1250 }
  ];

  const [customCourses, setCustomCourses] = useState([]);
  const courses = [...defaultCourses, ...customCourses];

  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Development");
  const [newLessons, setNewLessons] = useState(10);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error(err);
    } finally {
      navigate("/");
    }
  };

  const handleAddCourse = (e) => {
    e.preventDefault();
    if (!newTitle) return;
    const newCourse = {
      id: Date.now(),
      title: newTitle,
      category: newCategory,
      lessons: parseInt(newLessons),
      enrollments: 0
    };
    setCourses([...courses, newCourse]);
    setNewTitle("");
    setShowAddForm(false);
  };

  const handleDeleteCourse = (id) => {
    setCourses(courses.filter(c => c.id !== id));
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

  return (
    <div className={`sdDashboardWrapper ${isDarkMode ? "dark-theme" : ""}`}>
      <Background />

      <div className="sdMainContainer">
        {/* Left Sidebar */}
        <aside className="sdLeftSidebar">
          <div>
            <Link to="/" className="sdBrandLogo" style={{ display: "inline-flex", alignItems: "center" }}>
              <AppLogo height="58px" />
            </Link>
            <div className="sdSidebarHomeArchHeader">
              <div className="sdArchLine" />
              <button className="sdHomeCircularBtn" onClick={() => navigate("/admin-dashboard")}>
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
              <input type="text" className="sdSearchInput" placeholder="Search managed courses..." />
            </div>
            <div className="sdHeaderActionsRow">
              <div className="sdXpBadgePill">
                <FaBolt color="#F9572A" /> <span>{xp ?? 0} XP</span>
              </div>
              <NotificationDropdown type="admin" />
              <button className="sdLogoutHeaderBtn" onClick={handleLogout}>
                <FaSignOutAlt /> <span>Logout</span>
              </button>
              <div className="sdUserProfilePillWrapper">
                <div className="sdUserProfilePill">
                  <div className="sdUserAvatarImg">🛠️</div>
                  <div className="sdUserInfoText">
                    <strong>Admin Portal</strong>
                    <span>Administrator</span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <div className="sdGreetingHeader" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h1>Course Management</h1>
              <p>Construct curricula, assign lectures, and monitor platform enrollment distributions.</p>
            </div>
            <button className="btnSolidOrangeClaim" onClick={() => setShowAddForm(true)}>
              <FaPlus /> Add New Course
            </button>
          </div>

          <div className="sdDashboardContentGrid">
            {/* Center column: Admin courses management table */}
            <div className="sdCenterMainCol">
              <div className="sdWhitePanelCard">
                <h3>Managed Curricula</h3>
                <div style={{ overflowX: "auto", marginTop: "16px" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "10px" }}>
                        <th style={{ padding: "12px", color: "var(--text-secondary)" }}>Course Title</th>
                        <th style={{ padding: "12px", color: "var(--text-secondary)" }}>Category</th>
                        <th style={{ padding: "12px", color: "var(--text-secondary)" }}>Lessons Count</th>
                        <th style={{ padding: "12px", color: "var(--text-secondary)" }}>Total Enrollments</th>
                        <th style={{ padding: "12px", color: "var(--text-secondary)", textAlign: "center" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {courses.map((course) => {
                        const candidateLearners = [
                          ...(allRegisteredUsers && allRegisteredUsers.length > 0 ? allRegisteredUsers : []),
                          ...(users || []),
                          ...(workforce || [])
                        ];
                        const { totalEnrolled, pendingCount } = getCourseEnrolledStudents
                          ? getCourseEnrolledStudents(course, candidateLearners, pendingCourseRequests)
                          : { totalEnrolled: 0, pendingCount: 0 };

                        return (
                        <tr key={course.id} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                          <td style={{ padding: "16px 12px", color: "var(--text-primary)", fontWeight: "bold" }}>{course.title}</td>
                          <td style={{ padding: "16px 12px", color: "var(--text-secondary)" }}>{course.category}</td>
                          <td style={{ padding: "16px 12px", color: "var(--text-primary)" }}>{course.lessons}</td>
                          <td style={{ padding: "16px 12px" }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                              <span style={{ color: "#10B981", fontWeight: "bold" }}>{totalEnrolled} enrolled</span>
                              {pendingCount > 0 && (
                                <span style={{ fontSize: "11px", color: "#F59E0B", fontWeight: "bold" }}>⏳ {pendingCount} pending</span>
                              )}
                            </div>
                          </td>
                          <td style={{ padding: "16px 12px", display: "flex", gap: "10px", justifyContent: "center" }}>
                            <button style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "16px" }} onClick={() => handleDeleteCourse(course.id)}>
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Course Modal */}
      {showAddForm && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
          <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)", padding: "30px", borderRadius: "16px", maxWidth: "450px", width: "100%", position: "relative" }}>
            <button style={{ position: "absolute", top: "16px", right: "16px", background: "none", border: "none", color: "var(--text-primary)", fontSize: "18px", cursor: "pointer" }} onClick={() => setShowAddForm(false)}><FaTimes /></button>
            <form onSubmit={handleAddCourse}>
              <h3 style={{ color: "var(--text-primary)", margin: "0 0 20px 0" }}>Create New Course</h3>
              
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", color: "var(--text-secondary)", fontSize: "12px", marginBottom: "6px" }}>Course Title</label>
                <input type="text" required value={newTitle} onChange={e => setNewTitle(e.target.value)} style={{ width: "100%", padding: "10px", background: "var(--input-bg)", color: "var(--text-primary)", border: "1px solid var(--border-color)", borderRadius: "8px" }} />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", color: "var(--text-secondary)", fontSize: "12px", marginBottom: "6px" }}>Category</label>
                <select value={newCategory} onChange={e => setNewCategory(e.target.value)} style={{ width: "100%", padding: "10px", background: "var(--input-bg)", color: "var(--text-primary)", border: "1px solid var(--border-color)", borderRadius: "8px" }}>
                  <option value="Development">Development</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Design">Design</option>
                </select>
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", color: "var(--text-secondary)", fontSize: "12px", marginBottom: "6px" }}>Lessons Count</label>
                <input type="number" min="1" max="100" value={newLessons} onChange={e => setNewLessons(e.target.value)} style={{ width: "100%", padding: "10px", background: "var(--input-bg)", color: "var(--text-primary)", border: "1px solid var(--border-color)", borderRadius: "8px" }} />
              </div>

              <button type="submit" className="btnSolidOrangeClaim" style={{ width: "100%" }}>Create Course</button>
            </form>
          </div>
        </div>
      )}

      <StudentFooter />
    </div>
  );
}
