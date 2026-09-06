import React, { useState } from "react";
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
  FaMapSigns,
  FaCheckCircle,
  FaSun,
  FaMoon,
  FaArrowLeft,
  FaCalendarAlt,
  FaInfoCircle,
  FaLock,
  FaShareAlt,
  FaFire,
  FaQuestionCircle,
  FaCode,
  FaClipboardList,
  FaStar,
  FaBullseye,
  FaCubes,
  FaMountain,
  FaGem,
  FaTimes,
  FaGift,
  FaCrown,
  FaChevronRight,
  FaGraduationCap,
  FaUsers,
  FaUserGraduate,
  FaHandshake,
  FaBullhorn,
  FaPaperPlane,
  FaSignOutAlt
} from "react-icons/fa";

import "../styles/studentDashboard.css";
import "../styles/badgesPage.css";

import AppLogo from "../components/AppLogo";

export default function BadgesPage() {
  const { user, xp, logout, themeMode, toggleTheme } = useAuth();
  const navigate = useNavigate();
  const isDarkMode = themeMode === "dark";
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState("overview"); // "overview" | "more-badges"
  const [moreCategory, setMoreCategory] = useState("all");
  const [toastMessage, setToastMessage] = useState("");
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

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

  const userKey = user?.email || user?.username || "default";
  const userBadges = user?.badges || [];
  const completedSubLessonIds = (() => {
    try {
      const saved = localStorage.getItem(`skillsphere_completed_sub_lessons_${userKey}`);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  })();
  const totalSubCount = completedSubLessonIds.length;

  const earnedBadges = [
    { id: 1, title: "Getting Started", desc: "Complete your first lesson", xp: "+50 XP", date: "Earned", icon: <FaTrophy />, color: "orange", isEarned: userBadges.includes("Getting Started") || userBadges.includes("1") || (user?.completed_topics || []).length >= 1 || totalSubCount >= 1 },
    { id: 2, title: "Lesson Learner", desc: "Complete 10 lessons", xp: "+100 XP", date: "Earned", icon: <FaBook />, color: "green", isEarned: userBadges.includes("Lesson Learner") || userBadges.includes("2") || (user?.completed_topics || []).length >= 10 || totalSubCount >= 10 },
    { id: 3, title: "Quiz Master", desc: "Score 90% or more in a quiz", xp: "+150 XP", date: "Earned", icon: <FaQuestionCircle />, color: "purple", isEarned: userBadges.includes("Quiz Master") || userBadges.includes("3") },
    { id: 4, title: "Code Explorer", desc: "Solve 20 coding problems", xp: "+200 XP", date: "Earned", icon: <FaCode />, color: "brown", isEarned: userBadges.includes("Code Explorer") || userBadges.includes("4") },
    { id: 5, title: "Streak Starter", desc: "Maintain a 3-day streak", xp: "+75 XP", date: "Earned", icon: <FaFire />, color: "red", isEarned: (user?.streak || 0) >= 3 || userBadges.includes("Streak Starter") },
    { id: 6, title: "Consistent Learner", desc: "Maintain a 7-day streak", xp: "+150 XP", date: "Earned", icon: <FaCalendarAlt />, color: "blue", isEarned: (user?.streak || 0) >= 7 || userBadges.includes("Consistent Learner") },
    { id: 7, title: "Assignment Ace", desc: "Submit 5 assignments", xp: "+100 XP", date: "Earned", icon: <FaClipboardList />, color: "teal", isEarned: userBadges.includes("Assignment Ace") },
    { id: 8, title: "Discussion Star", desc: "Make 5 helpful discussions", xp: "+50 XP", date: "Earned", icon: <FaStar />, color: "yellow", isEarned: userBadges.includes("Discussion Star") },
    { id: 9, title: "Early Bird", desc: "Complete a lesson before 9 AM", xp: "+30 XP", date: "Earned", icon: <FaSun />, color: "gold", isEarned: userBadges.includes("Early Bird") },
    { id: 10, title: "Weekend Warrior", desc: "Complete 5 lessons on weekend", xp: "+75 XP", date: "Earned", icon: <FaBullseye />, color: "indigo", isEarned: userBadges.includes("Weekend Warrior") },
    { id: 11, title: "Project Builder", desc: "Complete a hands-on project", xp: "+250 XP", date: "Earned", icon: <FaCubes />, color: "emerald", isEarned: userBadges.includes("Project Builder") },
    { id: 12, title: "Path Pioneer", desc: "Complete your first learning path", xp: "+300 XP", date: "Earned", icon: <FaMountain />, color: "violet", isEarned: userBadges.includes("Path Pioneer") || (user?.completed_topics || []).length >= 5 || totalSubCount >= 5 }
  ];

  // 24 MORE DISCOVERABLE LOCKED BADGES DATA (Matching Screenshot 1-to-1)
  const moreBadges = [
    { id: 101, title: "Speed Coder", desc: "Complete any challenge in 15 minutes", xp: "+150 XP", category: "coding", icon: "⚡", bg: "blue", isLocked: true },
    { id: 102, title: "Full Stack Explorer", desc: "Complete Frontend + Backend + Database", xp: "+400 XP", category: "learning", icon: "🥞", bg: "darkblue", isLocked: true },
    { id: 103, title: "React Pro", desc: "Finish the React Developer Track", xp: "+300 XP", category: "coding", icon: "⚛️", bg: "cyan", isLocked: true },
    { id: 104, title: "Spring Boot Expert", desc: "Finish the Spring Boot Path", xp: "+300 XP", category: "coding", icon: "🍃", bg: "green", isLocked: true },
    { id: 105, title: "Python Wizard", desc: "Complete Python Learning Path", xp: "+300 XP", category: "coding", icon: "🐍", bg: "darkblue", isLocked: true },
    { id: 106, title: "Java Champion", desc: "Complete Java Master Path", xp: "+300 XP", category: "coding", icon: "☕", bg: "red", isLocked: true },

    { id: 107, title: "Course Collector", desc: "Complete 10 Courses", xp: "+200 XP", category: "learning", icon: "📚", bg: "orange", isLocked: true },
    { id: 108, title: "Learning Legend", desc: "Complete 20 Courses", xp: "+400 XP", category: "learning", icon: "🎓", bg: "pink", isLocked: true },
    { id: 109, title: "Knowledge Seeker", desc: "Complete first Learning Path", xp: "+150 XP", category: "learning", icon: "💡", bg: "teal", isLocked: true },
    { id: 110, title: "Curriculum Master", desc: "Finish every module of one Track", xp: "+300 XP", category: "learning", icon: "👑", bg: "purple", isLocked: true },
    { id: 111, title: "Perfectionist", desc: "Score 100% in any Final Assessment", xp: "+250 XP", category: "achievements", icon: "🏆", bg: "gold", isLocked: true },
    { id: 112, title: "Chapter Crusher", desc: "Finish 50 Lessons", xp: "+200 XP", category: "learning", icon: "📗", bg: "lime", isLocked: true },

    { id: 113, title: "Week Warrior", desc: "Maintain a 7-Day Streak", xp: "+150 XP", category: "achievements", icon: "🔥", bg: "orange", isLocked: true },
    { id: 114, title: "Month Warrior", desc: "Maintain a 30-Day Streak", xp: "+300 XP", category: "achievements", icon: "📅", bg: "rose", isLocked: true },
    { id: 115, title: "XP Millionaire", desc: "Earn 10,000 XP", xp: "+500 XP", category: "achievements", icon: "💎", bg: "purple", isLocked: true },
    { id: 116, title: "Quest Hunter", desc: "Complete 100 Daily Quests", xp: "+300 XP", category: "achievements", icon: "🎯", bg: "blue", isLocked: true },
    { id: 117, title: "SkillSphere Elite", desc: "Reach Level 25", xp: "+500 XP", category: "career", icon: "⭐", bg: "darkpurple", isLocked: true },
    { id: 118, title: "Grandmaster", desc: "Reach Level 50", xp: "+800 XP", category: "career", icon: "👑", bg: "gold", isLocked: true },

    { id: 119, title: "Discussion Starter", desc: "Create your first discussion", xp: "+100 XP", category: "community", icon: "💬", bg: "green", isLocked: true },
    { id: 120, title: "Community Helper", desc: "Receive 50 Upvotes", xp: "+200 XP", category: "community", icon: "🤲", bg: "pink", isLocked: true },
    { id: 121, title: "Mentor", desc: "Answer 100 Questions", xp: "+300 XP", category: "community", icon: "🧑‍🏫", bg: "purple", isLocked: true },
    { id: 122, title: "Most Helpful", desc: "Marked as Best Answer 25 times", xp: "+400 XP", category: "community", icon: "🏅", bg: "teal", isLocked: true },
    { id: 123, title: "Collaboration Star", desc: "Participate in a Team Hackathon", xp: "+300 XP", category: "career", icon: "👥", bg: "blue", isLocked: true },
    { id: 124, title: "Knowledge Sharer", desc: "Publish 10 Notes/Articles", xp: "+200 XP", category: "community", icon: "📣", bg: "orange", isLocked: true }
  ];

  // Filtered More Badges based on category tab
  const filteredMoreBadges = moreBadges.filter((b) => {
    if (moreCategory === "all") return true;
    return b.category === moreCategory;
  });

  const handleShareBadge = (badge) => {
    const shareUrl = `https://skillsphere.edu/badge/${badge.title.toLowerCase().replace(/\s+/g, "-")}`;
    navigator.clipboard.writeText(`I unlocked the "${badge.title}" badge on SkillSphere! Check it out: ${shareUrl}`);
    setToastMessage(`🔗 Badge link for "${badge.title}" copied to clipboard!`);
    setTimeout(() => setToastMessage(""), 4000);
  };

  return (
    <div className={`bpWrapper ${isDarkMode ? "dark-theme" : ""}`}>
      <Background />
      <PaperPlaneCursor />

      {/* Main Grid Container */}
      <div className="bpMainContainer">
        
        {/* ── LEFT SIDEBAR ── */}
        <aside className="bpLeftSidebar">
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
                    className={`sdNavItem ${item.id === "badges" ? "active" : ""}`}
                    onClick={() => {
                      if (item.id === "dashboard") navigate("/student-home");
                      else if (item.id === "courses") navigate("/courses");
                      else if (item.id === "learning-paths") navigate("/learning-paths");
                      else if (item.id === "assignments") navigate("/assignments");
                      else if (item.id === "discussions") navigate("/discussions");
                      else if (item.id === "ai-buddy") navigate("/ai-buddy");
                      else if (item.id === "career-roadmap") navigate("/career-roadmap");
                      else if (item.id === "opportunity-feed") navigate("/opportunity-feed");
                      else if (item.id === "daily-quests") navigate("/daily-quests");
                      else if (item.id === "badges") navigate("/badges");
                      else if (item.id === "certificates") navigate("/certificate");
                      else if (item.id === "progress") navigate("/progress");
                      else if (item.id === "resume") navigate("/resume");
                      else if (item.id === "code-arena") navigate("/code-arena");
                      else if (item.id === "settings") navigate("/settings");
                      else navigate("/student-home");
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
        <div className="bpRightBodyArea">
          
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

          {/* Toast Notification Alert */}
          {toastMessage && (
            <div className="bpToastAlert">
              <span>{toastMessage}</span>
            </div>
          )}

          {/* ── OVERVIEW VIEW MODE ── */}
          {viewMode === "overview" && (
            <>
              {/* Page Heading */}
              <div className="bpPageHeaderRow">
                <div className="bpPageHeader">
                  <h1>My Badges 🏅</h1>
                  <p>Achievements that show your progress and dedication.</p>
                </div>
                <button className="btnHowBadgesWork" onClick={() => setIsHowItWorksOpen(true)}>
                  How Badges Work? <FaInfoCircle />
                </button>
              </div>

              {/* Sub-Tabs Bar */}
              <div className="bpSubTabsRow">
                <button
                  className={`bpTab ${activeTab === "all" ? "active" : ""}`}
                  onClick={() => setActiveTab("all")}
                >
                  All Badges
                </button>
                <button
                  className={`bpTab ${activeTab === "earned" ? "active" : ""}`}
                  onClick={() => setActiveTab("earned")}
                >
                  Earned
                </button>
                <button
                  className={`bpTab ${activeTab === "in-progress" ? "active" : ""}`}
                  onClick={() => setActiveTab("in-progress")}
                >
                  In Progress
                </button>
                <button
                  className={`bpTab ${activeTab === "locked" ? "active" : ""}`}
                  onClick={() => setActiveTab("locked")}
                >
                  Locked
                </button>
                <button
                  className="bpTab highlightMore"
                  onClick={() => setViewMode("more-badges")}
                >
                  🏅 More Badges (24 New)
                </button>
              </div>

              {/* 4 Stat Summary Cards Row */}
              {(() => {
                const actuallyEarnedList = earnedBadges.filter(b => b.isEarned);
                const totalEarnedCount = actuallyEarnedList.length;
                const totalBadgesCount = earnedBadges.length + moreBadges.length;
                const inProgressCount = totalEarnedCount > 0 && totalEarnedCount < totalBadgesCount ? 1 : 0;
                const lockedCount = Math.max(0, totalBadgesCount - totalEarnedCount);
                const totalXpFromBadges = actuallyEarnedList.reduce((sum, b) => {
                  const match = (b.xp || "").match(/\d+/);
                  return sum + (match ? parseInt(match[0], 10) : 0);
                }, 0);
                const earnedPct = Math.round((totalEarnedCount / totalBadgesCount) * 100);

                return (
                  <div className="bpStatCardsRow">
                    <div className="bpStatCard">
                      <div className="statIcon orange"><FaTrophy /></div>
                      <div>
                        <strong>{totalEarnedCount}</strong>
                        <span>Badges Earned</span>
                        <div className="statBarTrack">
                          <div className="statBarFill" style={{ width: `${earnedPct}%` }}></div>
                        </div>
                        <span className="statSub">Out of {totalBadgesCount}</span>
                      </div>
                    </div>

                    <div className="bpStatCard">
                      <div className="statIcon blue"><FaFire /></div>
                      <div>
                        <strong>{inProgressCount}</strong>
                        <span>In Progress</span>
                        <span className="statSubText">{totalEarnedCount === 0 ? "Start a lesson!" : "Keep it up!"}</span>
                      </div>
                    </div>

                    <div className="bpStatCard">
                      <div className="statIcon purple"><FaLock /></div>
                      <div>
                        <strong>{lockedCount}</strong>
                        <span>Locked</span>
                        <span className="statSubText">Keep learning!</span>
                      </div>
                    </div>

                    <div className="bpStatCard">
                      <div className="statIcon green"><FaGem /></div>
                      <div>
                        <strong>{totalXpFromBadges}</strong>
                        <span>Total XP from Badges</span>
                        <span className="statSubText">{totalEarnedCount === 0 ? "Earn badges!" : "Amazing!"}</span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* 2-Column Main Workspace */}
              <div className="bpGridContainer">
                
                {/* Center Main Column */}
                <div className="bpCenterColumn">
                  
                  {/* Earned Badges Section */}
                  {(activeTab === "all" || activeTab === "earned") && (
                    <div className="bpSectionBlock">
                      <div className="sectionHeaderRow">
                        <h3>Earned Badges (18)</h3>
                        <span className="viewAllLink" onClick={() => setViewMode("more-badges")}>
                          View All More Badges →
                        </span>
                      </div>

                      <div className="earnedBadgesGrid">
                        {earnedBadges.map((b) => (
                          <div
                            key={b.id}
                            className="badgeHexCard"
                            onClick={() => setSelectedBadge(b)}
                          >
                            <div className="badgeHexBadgeCircle">
                              <FaCheckCircle className="chkBadge" />
                              <div className={`hexIconBox ${b.color}`}>
                                {b.icon}
                              </div>
                            </div>

                            <h4>{b.title}</h4>
                            <p>{b.desc}</p>
                            <span className="xpText">{b.xp}</span>
                            <span className="dateText">{b.date}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* In Progress & Locked Row */}
                  <div className="bpBottomSplitRow">
                    
                    {/* In Progress Badges */}
                    <div className="bpProgressCol">
                      <div className="sectionHeaderRow">
                        <h3>In Progress (3)</h3>
                        <span className="viewAllLink">View All →</span>
                      </div>

                      <div className="progressCardsList">
                        <div className="progressBadgeItem" onClick={() => setSelectedBadge({ title: "Knowledge Seeker", desc: "Complete 25 lessons", xp: "+150 XP", progress: "0 / 25" })}>
                          <div className="pBadgeIcon yellow"><FaBook /></div>
                          <div className="pBadgeDetails">
                            <h5>Knowledge Seeker</h5>
                            <span>Complete 25 lessons</span>
                            <div className="pTrack"><div className="pFill" style={{ width: "72%" }}></div></div>
                            <span className="pFraction">0 / 25</span>
                          </div>
                        </div>

                        <div className="progressBadgeItem" onClick={() => setSelectedBadge({ title: "Quiz Champion", desc: "Score 90% in 5 quizzes", xp: "+200 XP", progress: "2 / 5" })}>
                          <div className="pBadgeIcon blue"><FaQuestionCircle /></div>
                          <div className="pBadgeDetails">
                            <h5>Quiz Champion</h5>
                            <span>Score 90% in 5 quizzes</span>
                            <div className="pTrack"><div className="pFill" style={{ width: "40%" }}></div></div>
                            <span className="pFraction">2 / 5</span>
                          </div>
                        </div>

                        <div className="progressBadgeItem" onClick={() => setSelectedBadge({ title: "Code Solver", desc: "Solve 50 coding problems", xp: "+300 XP", progress: "28 / 50" })}>
                          <div className="pBadgeIcon orange"><FaCode /></div>
                          <div className="pBadgeDetails">
                            <h5>Code Solver</h5>
                            <span>Solve 50 coding problems</span>
                            <div className="pTrack"><div className="pFill" style={{ width: "56%" }}></div></div>
                            <span className="pFraction">28 / 50</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Locked Badges */}
                    <div className="bpLockedCol">
                      <div className="sectionHeaderRow">
                        <h3>Locked Badges (21)</h3>
                        <span className="viewAllLink" onClick={() => setViewMode("more-badges")}>
                          Discover All 24 More →
                        </span>
                      </div>

                      <div className="lockedCardsList">
                        <div className="lockedBadgeItem" onClick={() => setViewMode("more-badges")}>
                          <div className="lockedHexIcon"><FaLock /></div>
                          <h5>Marathon Learner</h5>
                          <span>Complete 100 lessons</span>
                        </div>

                        <div className="lockedBadgeItem" onClick={() => setViewMode("more-badges")}>
                          <div className="lockedHexIcon"><FaLock /></div>
                          <h5>Top Performer</h5>
                          <span>Be in top 10 on leaderboard</span>
                        </div>

                        <div className="lockedBadgeItem" onClick={() => setViewMode("more-badges")}>
                          <div className="lockedHexIcon"><FaLock /></div>
                          <h5>Mentor</h5>
                          <span>Help 10 peers in discussions</span>
                        </div>
                      </div>
                    </div>

                  </div>

                </div>

                {/* ── RIGHT COLUMN SIDEBAR WIDGETS ── */}
                <div className="bpRightSidebar">
                  
                  {/* Badge Collector Gauge Widget */}
                  <div className="bpWidgetCard">
                    <h4>Badge Collector</h4>

                    <div className="collectorGaugeContainer">
                      <svg className="gaugeSvg" viewBox="0 0 100 100">
                        <circle className="gaugeBg" cx="50" cy="50" r="40" />
                        <circle className="gaugeFill" cx="50" cy="50" r="40" strokeDasharray="251.2" strokeDashoffset="145.7" />
                      </svg>
                      <div className="gaugeCenterText">
                        <FaTrophy color="#F59E0B" style={{ fontSize: "20px" }} />
                        <strong>18 / 42</strong>
                        <span>Badges Collected</span>
                      </div>
                    </div>

                    <div className="collectorPctSub">
                      <span><strong>42%</strong> Completed</span>
                      <div className="collectorTrack"><div className="collectorFill" style={{ width: "42%" }}></div></div>
                    </div>

                    <p className="collectorSubtext">Collect more badges to unlock exclusive rewards!</p>
                  </div>

                  {/* Rarest Badge Earned Widget */}
                  <div className="bpWidgetCard">
                    <h4>Rarest Badge Earned</h4>

                    <div className="rareBadgeCard">
                      <div className="rareBadgeHex"><FaMountain /></div>
                      <h5>Path Pioneer</h5>
                      <p>Only 8% of learners earned this rare badge!</p>

                      <button
                        className="btnShareAchievement"
                        onClick={() => handleShareBadge({ title: "Path Pioneer" })}
                      >
                        <FaShareAlt /> Share Achievement
                      </button>
                    </div>
                  </div>

                  {/* Recent Badge Earned Widget */}
                  <div className="bpWidgetCard">
                    <h4>Recent Badge Earned</h4>

                    <div className="recentBadgeItem">
                      <div className="rBadgeHex"><FaCalendarAlt /></div>
                      <div>
                        <h5>Consistent Learner</h5>
                        <span>Maintain a 7-day streak</span>
                        <span className="dateSub">Earned on 30 Apr 2025</span>
                      </div>
                    </div>

                    <span className="viewHistoryLink" onClick={() => setViewMode("more-badges")}>
                      View All Badge History →
                    </span>
                  </div>

                </div>

              </div>
            </>
          )}

          {/* ── 1-TO-1 MORE BADGES VIEW MODE (REFERENCE SCREENSHOT 2) ── */}
          {viewMode === "more-badges" && (
            <div className="moreBadgesViewContainer">
              
              {/* Header Row */}
              <div className="moreBadgesHeaderRow">
                <div>
                  <button className="btnBackOverview" onClick={() => setViewMode("overview")}>
                    ← Back to Overview
                  </button>
                  <h1 className="moreTitle">More Badges 🏅</h1>
                  <p className="moreSub">Discover all 24 more badges you can earn and showcase your achievements!</p>
                </div>

                {/* Top Counter Card */}
                <div className="topTotalBadgesCard">
                  <div className="starIconGold">⭐</div>
                  <div>
                    <strong>42 Total Badges</strong>
                    <span>18 Earned • 24 To Earn</span>
                  </div>
                </div>
              </div>

              {/* Category Sub-Tabs Bar */}
              <div className="moreCategoryTabsRow">
                <button
                  className={`moreCatTab ${moreCategory === "all" ? "active" : ""}`}
                  onClick={() => setMoreCategory("all")}
                >
                  All Badges
                </button>
                <button
                  className={`moreCatTab ${moreCategory === "learning" ? "active" : ""}`}
                  onClick={() => setMoreCategory("learning")}
                >
                  Learning
                </button>
                <button
                  className={`moreCatTab ${moreCategory === "coding" ? "active" : ""}`}
                  onClick={() => setMoreCategory("coding")}
                >
                  Coding
                </button>
                <button
                  className={`moreCatTab ${moreCategory === "community" ? "active" : ""}`}
                  onClick={() => setMoreCategory("community")}
                >
                  Community
                </button>
                <button
                  className={`moreCatTab ${moreCategory === "career" ? "active" : ""}`}
                  onClick={() => setMoreCategory("career")}
                >
                  Career
                </button>
                <button
                  className={`moreCatTab ${moreCategory === "ai-tools" ? "active" : ""}`}
                  onClick={() => setMoreCategory("ai-tools")}
                >
                  AI & Tools
                </button>
                <button
                  className={`moreCatTab ${moreCategory === "achievements" ? "active" : ""}`}
                  onClick={() => setMoreCategory("achievements")}
                >
                  Achievements
                </button>
                <button
                  className={`moreCatTab ${moreCategory === "secret" ? "active" : ""}`}
                  onClick={() => setMoreCategory("secret")}
                >
                  Secret
                </button>
              </div>

              {/* 24 BADGES GRID (4 ROWS x 6 COLS) */}
              <div className="moreBadgesGrid24">
                {filteredMoreBadges.map((badge) => (
                  <div
                    key={badge.id}
                    className="moreBadgeCardItem"
                    onClick={() => setSelectedBadge(badge)}
                  >
                    <FaLock className="lockTopRightIcon" />

                    <div className={`moreBadgeHexBox ${badge.bg}`}>
                      {badge.icon}
                    </div>

                    <h4>{badge.title}</h4>
                    <p>{badge.desc}</p>
                    <span className="badgeXpPill">{badge.xp}</span>
                  </div>
                ))}
              </div>

              {/* Bottom Promotional Banner */}
              <div className="moreBadgesBottomBanner">
                <div className="lockBannerIcon">🔒</div>
                <div className="bannerText">
                  <strong>Keep learning, keep growing!</strong>
                  <p>Complete courses, engage in activities, and unlock all badges.</p>
                </div>
                <div className="giftGraphic">🎁⭐</div>
              </div>

            </div>
          )}

        </div>
      </div>

      {/* INTERACTIVE BADGE DETAIL MODAL */}
      {selectedBadge && (
        <div className="badgeModalOverlay" onClick={() => setSelectedBadge(null)}>
          <div className="badgeModalContent" onClick={(e) => e.stopPropagation()}>
            <button className="btnCloseModal" onClick={() => setSelectedBadge(null)}>
              <FaTimes />
            </button>

            <div className={`modalBadgeIconHex ${selectedBadge.bg || selectedBadge.color || "orange"}`}>
              {selectedBadge.icon || "🏅"}
            </div>

            <h2>{selectedBadge.title}</h2>
            <p className="modalBadgeDesc">{selectedBadge.desc}</p>
            <div className="modalXpBadge">{selectedBadge.xp || "+150 XP"}</div>

            <div className="modalStatusBox">
              <span>{selectedBadge.isEarned ? "✓ Badge Unlocked & Earned!" : "🔒 Currently Locked"}</span>
              <small>{selectedBadge.date || "Complete the required course modules to unlock this badge."}</small>
            </div>

            <div className="modalActionsRow">
              <button className="btnModalShare" onClick={() => handleShareBadge(selectedBadge)}>
                <FaShareAlt /> Share Badge Achievement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HOW BADGES WORK GUIDE MODAL */}
      {isHowItWorksOpen && (
        <div className="badgeModalOverlay" onClick={() => setIsHowItWorksOpen(false)}>
          <div className="badgeModalContent guide" onClick={(e) => e.stopPropagation()}>
            <button className="btnCloseModal" onClick={() => setIsHowItWorksOpen(false)}>
              <FaTimes />
            </button>

            <h2>How Badges Work? 🏅</h2>
            <p className="modalBadgeDesc">Badges showcase your milestones, streaks, and engagement on SkillSphere.</p>

            <div className="guideTiersList">
              <div className="tierItem">
                <span className="tierIcon">🥉</span>
                <div><strong>Bronze Tiers</strong><span>Earn +30 XP to +100 XP for early milestone lessons.</span></div>
              </div>
              <div className="tierItem">
                <span className="tierIcon">🥈</span>
                <div><strong>Silver Tiers</strong><span>Earn +150 XP to +300 XP for streaks and completing learning paths.</span></div>
              </div>
              <div className="tierItem">
                <span className="tierIcon">🥇</span>
                <div><strong>Gold & Diamond Tiers</strong><span>Earn +400 XP to +800 XP for reaching Level 50 & 10,000 XP!</span></div>
              </div>
            </div>

            <button className="btnGotIt" onClick={() => setIsHowItWorksOpen(false)}>
              Got It!
            </button>
          </div>
        </div>
      )}

      <FloatingChatbot />
      <StudentFooter />
    </div>
  );
}


