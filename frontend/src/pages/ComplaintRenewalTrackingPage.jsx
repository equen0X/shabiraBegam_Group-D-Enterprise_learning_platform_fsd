import React, { useState, useEffect } from "react";
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
  FaSignOutAlt, FaExclamationTriangle, FaPlus, FaWrench, FaRobot, FaRocket, FaBolt, FaCode, FaTimes
} from "react-icons/fa";
import "../styles/studentDashboard.css";

import AppLogo from "../components/AppLogo";

export default function ComplaintRenewalTrackingPage() {
  const { user, xp, logout, themeMode, toggleTheme, authenticatedFetch } = useAuth();
  const navigate = useNavigate();
  const isDarkMode = themeMode === "dark";

  const [tickets, setTickets] = useState([]);

  const [renewals] = useState([]);

  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketCategory, setTicketCategory] = useState("Course Error");
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error(err);
    } finally {
      navigate("/");
    }
  };

  // Load tickets on mount
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await authenticatedFetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/tickets/my`);
        const data = await response.json();
        if (response.ok && data.success) {
          setTickets(data.tickets || []);
        } else {
          setTickets([]);
        }
      } catch (e) {
        setTickets([]);
      }
    };
    fetchTickets();
  }, [user, authenticatedFetch]);

  const handleAddTicket = async (e) => {
    e.preventDefault();
    if (!ticketSubject) return;
    
    const newTicket = {
      subject: ticketSubject,
      category: ticketCategory
    };

    try {
      if (authenticatedFetch) {
        const response = await authenticatedFetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/tickets/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newTicket),
        });
        const data = await response.json();
        if (response.ok && data.success) {
          setTickets([data.ticket, ...tickets]);
        } else {
          const fallback = {
            id: `T-${Math.floor(1000 + Math.random() * 9000)}`,
            ticketId: `T-${Math.floor(1000 + Math.random() * 9000)}`,
            subject: ticketSubject,
            category: ticketCategory,
            status: "Open",
            date: new Date().toISOString().slice(0, 10)
          };
          setTickets([fallback, ...tickets]);
        }
      }
    } catch (err) {
      const fallback = {
        id: `T-${Math.floor(1000 + Math.random() * 9000)}`,
        ticketId: `T-${Math.floor(1000 + Math.random() * 9000)}`,
        subject: ticketSubject,
        category: ticketCategory,
        status: "Open",
        date: new Date().toISOString().slice(0, 10)
      };
      setTickets([fallback, ...tickets]);
    }

    setTicketSubject("");
    setShowSubmitModal(false);
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
                    className={`sdNavItem ${item.id === "complaint-tracking" ? "active" : ""}`}
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
              <input type="text" className="sdSearchInput" placeholder="Search renewals and tickets..." />
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
            <h1>Complaint & Renewal Tracking</h1>
            <p>Monitor validity of your credentials and submit academic or technical grievance queries.</p>
          </div>

          <div className="sdDashboardContentGrid">
            {/* Center column: Renewal tracker & Grievance tickets list */}
            <div className="sdCenterMainCol">
              {/* Credentials Renewals */}
              <div className="sdWhitePanelCard" style={{ marginBottom: "24px" }}>
                <h3>Credential Renewal Tracker</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginBottom: "20px" }}>
                  Certifications that expire and require a renewal test to maintain verified status.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {renewals.length === 0 ? (
                    <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: 0 }}>No credential renewals scheduled yet.</p>
                  ) : (
                    renewals.map((r) => (
                      <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", background: "var(--bg-secondary)", borderRadius: "10px", border: "1px solid var(--border-color)", flexWrap: "wrap", gap: "12px" }}>
                        <div>
                          <strong style={{ color: "var(--text-primary)", display: "block" }}>{r.title}</strong>
                          <span style={{ fontSize: "12px", color: "var(--text-secondary)", display: "block", marginTop: "4px" }}>
                            Expires: {r.expiry} ({r.daysLeft} days remaining)
                          </span>
                        </div>
                        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                          <span style={{ fontSize: "11px", fontWeight: "bold", padding: "4px 8px", borderRadius: "4px", background: r.daysLeft <= 90 ? "#fee2e2" : "#dcfce7", color: r.daysLeft <= 90 ? "#b91c1c" : "#15803d" }}>
                            {r.status}
                          </span>
                          {r.daysLeft <= 90 && (
                            <button className="btnContinueCourse" onClick={() => navigate("/assessments")}>
                              Schedule Exam
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Support & Complaints Tickets list */}
              <div className="sdWhitePanelCard">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <h3>Learning Support Tickets</h3>
                  <button className="btnOutlineOrange" onClick={() => setShowSubmitModal(true)}>
                    <FaPlus /> Submit Support Ticket
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {tickets.length === 0 ? (
                    <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: 0 }}>No support tickets filed yet.</p>
                  ) : (
                    tickets.map((t) => (
                      <div key={t.id || t.ticketId} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", background: "var(--bg-secondary)", borderRadius: "10px", border: "1px solid var(--border-color)", flexWrap: "wrap", gap: "10px" }}>
                        <div>
                          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                            <span style={{ fontSize: "11px", background: "var(--border-color)", padding: "2px 6px", borderRadius: "4px", color: "var(--text-secondary)", fontWeight: "mono" }}>{t.ticketId || t.ticket_id || t.id}</span>
                            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{t.category}</span>
                          </div>
                          <strong style={{ color: "var(--text-primary)", display: "block", marginTop: "8px", fontSize: "14px" }}>{t.subject}</strong>
                        </div>
                        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{t.createdAt ? new Date(t.createdAt).toLocaleDateString() : t.date}</span>
                          <span style={{ fontSize: "11px", fontWeight: "bold", padding: "4px 8px", borderRadius: "12px", background: t.status === "Open" ? "#fffbeb" : "#dcfce7", color: t.status === "Open" ? "#b45309" : "#15803d" }}>
                            {t.status}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ticket Modal */}
      {showSubmitModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
          <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)", padding: "30px", borderRadius: "16px", maxWidth: "450px", width: "100%", position: "relative" }}>
            <button style={{ position: "absolute", top: "16px", right: "16px", background: "none", border: "none", color: "var(--text-primary)", fontSize: "18px", cursor: "pointer" }} onClick={() => setShowSubmitModal(false)}><FaTimes /></button>
            <form onSubmit={handleAddTicket}>
              <h3 style={{ color: "var(--text-primary)", margin: "0 0 20px 0" }}>File a Grievance/Support Request</h3>
              
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", color: "var(--text-secondary)", fontSize: "12px", marginBottom: "6px" }}>Issue Category</label>
                <select value={ticketCategory} onChange={e => setTicketCategory(e.target.value)} style={{ width: "100%", padding: "10px", background: "var(--input-bg)", color: "var(--text-primary)", border: "1px solid var(--border-color)", borderRadius: "8px" }}>
                  <option value="Course Error">Course Error</option>
                  <option value="UI Bug">UI Bug / CSS Issue</option>
                  <option value="Video Issue">Video Playback Issue</option>
                  <option value="Certificate Bug">Certificate Verification Problem</option>
                </select>
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", color: "var(--text-secondary)", fontSize: "12px", marginBottom: "6px" }}>Describe the Issue</label>
                <textarea required value={ticketSubject} onChange={e => setTicketSubject(e.target.value)} placeholder="Provide detailed information regarding the bug or query..." style={{ width: "100%", minHeight: "80px", padding: "10px", background: "var(--input-bg)", color: "var(--text-primary)", border: "1px solid var(--border-color)", borderRadius: "8px", fontFamily: "inherit", fontSize: "13px", resize: "vertical" }} />
              </div>

              <button type="submit" className="btnSolidOrangeClaim" style={{ width: "100%" }}>Submit Support Ticket</button>
            </form>
          </div>
        </div>
      )}

      <StudentFooter />
    </div>
  );
}
