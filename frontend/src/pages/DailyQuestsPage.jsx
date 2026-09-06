import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  FaBullseye,
  FaFire,
  FaQuestionCircle,
  FaCode,
  FaLock,
  FaGift,
  FaCrown,
  FaTimes,
  FaInfoCircle,
  FaHourglassHalf,
  FaLightbulb,
  FaShieldAlt,
  FaSignOutAlt
} from "react-icons/fa";

import "../styles/studentDashboard.css";
import "../styles/dailyQuestsPage.css";

import AppLogo from "../components/AppLogo";

export default function DailyQuestsPage() {
  const { user, xp, authenticatedFetch, themeMode, toggleTheme, logout } = useAuth();
  const navigate = useNavigate();
  const isDarkMode = themeMode === "dark";

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
  const [toastMessage, setToastMessage] = useState("");
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

  const [activeActionQuest, setActiveActionQuest] = useState(null);
  const [timeLeft, setTimeLeft] = useState(12 * 3600 + 45 * 60 + 30);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 24 * 3600));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m.toString().padStart(2, "0")}m ${s.toString().padStart(2, "0")}s`;
  };

  const userName = user?.full_name || user?.username || "Learner";
  const [currentXp, setCurrentXp] = useState(xp ?? 0);

  const [quests, setQuests] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchQuests = async () => {
    try {
      const res = await authenticatedFetch(`${API_URL}/api/quests`);
      const data = await res.json();
      if (res.ok && data.success) {
        const mapped = (data.quests || []).map(q => {
          let icon = <FaBook />;
          let color = "olive";
          let desc = "Daily challenge on SkillSphere platform";
          let progressText = "0/1";
          
          if (q.id === 1) {
            icon = <FaBolt />;
            color = "orange";
            desc = "Log in daily and build your streak streak!";
            progressText = `${user?.streak || 0}/1`;
          } else if (q.id === 2) {
            icon = <FaCode />;
            color = "green";
            desc = "Learn React architecture components & lifecycle";
            const reactCompletedCount = (user?.completed_topics || []).filter(t => t.startsWith("react_")).length;
            progressText = `${reactCompletedCount}/3`;
          } else if (q.id === 3) {
            icon = <FaShieldAlt />;
            color = "brown";
            desc = "Implement security configuration in Spring Boot";
            const hasSecurity = (user?.completed_topics || []).includes("springboot_security");
            progressText = hasSecurity ? "1/1" : "0/1";
          }

          return {
            id: q.id,
            title: q.title,
            desc: desc,
            xp: `+${q.xpReward} XP`,
            xpVal: q.xpReward,
            progress: progressText,
            isCompleted: q.status === "COMPLETED",
            isClaimable: q.status === "CLAIMABLE",
            icon: icon,
            color: color
          };
        });
        setQuests(mapped);
      }
    } catch (e) {
      console.error("Error fetching quests:", e);
    }
  };

  useEffect(() => {
    fetchQuests();
  }, [user]);
  const completedCount = quests.filter((q) => q.isCompleted).length;

  // Handler to Execute / Complete a Quest
  const handleCompleteQuest = async (quest) => {
    try {
      const res = await authenticatedFetch(`${API_URL}/api/quests/claim`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questId: quest.id })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchQuests();
        setCurrentXp((prev) => prev + quest.xpVal);
        setActiveActionQuest(null);
        setToastMessage(`🎉 Quest reward claimed successfully! You earned +${quest.xpVal} XP!`);
        setTimeout(() => setToastMessage(""), 4000);
      } else {
        setToastMessage(`⚠️ ${data.message || "Could not claim quest reward"}`);
        setTimeout(() => setToastMessage(""), 4000);
      }
    } catch (err) {
      console.error("Failed to claim quest:", err);
    }
  };

  // Nav items
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
    <div className={`dqpWrapper ${isDarkMode ? "dark-theme" : ""}`} data-theme={isDarkMode ? "dark" : "light"}>
      <Background />
      <PaperPlaneCursor />

      {/* Main Grid Container */}
      <div className="dqpMainContainer">
        
        {/* ── LEFT SIDEBAR ── */}
        <aside className="dqpLeftSidebar">
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
                    className={`sdNavItem ${item.id === "daily-quests" ? "active" : ""}`}
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
        <div className="dqpRightBodyArea">
          
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

          {/* Page Heading Row */}
          <div className="dqpPageHeaderRow">
            <div className="dqpPageHeader">
              <h1>🎯 Daily Quests</h1>
              <p>Complete quests, earn XP and keep your streak alive!</p>
            </div>

            <button className="btnHowQuestsWork" onClick={() => setIsHowItWorksOpen(true)}>
              How Daily Quests Work? <FaInfoCircle />
            </button>
          </div>

          {/* Toast Notification Alert */}
          {toastMessage && (
            <div className="dqpToastAlert">
              <span>{toastMessage}</span>
            </div>
          )}

          {/* TOP METRICS CARDS ROW (3 CARDS) */}
          <div className="dqpTopMetricsRow">
            
            {/* Daily Progress Donut Gauge */}
            <div className="metricCard">
              <span className="cardTitle">Daily Progress</span>

              <div className="metricContentRow">
                <div className="donutGaugeBox">
                  <svg viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke={isDarkMode ? "#1E293B" : "#F1F5F9"} strokeWidth="10" fill="none" />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#F9572A"
                      strokeWidth="10"
                      fill="none"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 - (251.2 * completedCount) / 6}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="donutCenterText">
                    <strong>{completedCount}/6</strong>
                  </div>
                </div>

                <div className="metricDetailsText">
                  <strong>{completedCount}/6 Quests</strong>
                  <span className="sub">Quests Completed</span>
                  <div className="xpEarnedToday">⭐ +{completedCount * 30} XP earned today</div>
                </div>
              </div>
            </div>

            {/* Today's Streak Card */}
            <div className="metricCard">
              <span className="cardTitle">Today's Streak</span>

              <div className="metricContentRow">
                <div className="streakFlameIcon">🔥</div>
                <div className="metricDetailsText">
                  <strong className="streakNumber">{user?.streak || 5}</strong>
                  <span className="sub">Active Days</span>
                  <div className="bestStreakSub">🏆 Best Streak: {user?.longest_streak || 14} days</div>
                </div>
              </div>
            </div>

            {/* Next Milestone Card */}
            <div className="metricCard">
              <span className="cardTitle">Next Milestone</span>

              <div className="metricContentRow">
                <div className="chestIcon">📦</div>
                <div className="metricDetailsText">
                  <strong>Complete 6 quests</strong>
                  <span className="sub">to earn bonus reward!</span>
                  <div className="mTrack"><div className="mFill" style={{ width: `${(completedCount / 6) * 100}%` }}></div></div>
                  <span className="mFraction">{completedCount}/6</span>
                </div>
              </div>
            </div>

          </div>


          {/* 2-COLUMN MAIN WORKSPACE GRID */}
          <div className="dqpGridContainer" style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "24px" }}>
            
            {/* CENTER COLUMN: TODAY'S QUESTS LIST */}
            <div className="dqpCenterColumn">
              
              <div className="dqpQuestsBlock">
                
                {/* Header Row with Countdown Timer */}
                <div className="questsBlockHeaderRow">
                  <h3>📅 Today's Quests</h3>
                  <span className="resetTimerTag">
                    <FaHourglassHalf color="#F9572A" /> Resets in {formatCountdown(timeLeft)}
                  </span>
                </div>

                {/* 6 QUESTS LIST */}
                <div className="questsList">
                  {quests.map((q) => (
                    <div key={q.id} className={`questItemCard ${q.isCompleted ? "completed" : ""}`}>
                      <div className={`questIconBox ${q.color}`}>{q.icon}</div>

                      <div className="questMainInfo">
                        <h4>{q.title}</h4>
                        <p>{q.desc}</p>
                      </div>

                      <div className="questXpCol">
                        <span className="xpPill">{q.xp}</span>
                      </div>

                      <div className="questProgressCol">
                        {q.isCompleted ? (
                          <button className="btnCompletedPill">
                            <FaCheckCircle /> Completed
                          </button>
                        ) : q.isClaimable ? (
                          <div className="goActionBox">
                            <div className="miniTrack"><div className="miniFill" style={{ width: "100%" }}></div></div>
                            <span className="frac">{q.progress}</span>
                            <button
                              className="btnGoPrimary claimBtn"
                              style={{ background: "#F59E0B", color: "#fff" }}
                              onClick={() => handleCompleteQuest(q)}
                            >
                              Claim
                            </button>
                          </div>
                        ) : (
                          <div className="goActionBox">
                            <div className="miniTrack"><div className="miniFill" style={{ width: "0%" }}></div></div>
                            <span className="frac">{q.progress}</span>
                            <button
                              className="btnGoPrimary"
                              style={{ opacity: 0.6 }}
                              onClick={() => {
                                setToastMessage(`⚠️ Keep learning! Complete requirements to claim this quest.`);
                                setTimeout(() => setToastMessage(""), 3000);
                              }}
                            >
                              Go
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom Mountain Trail Banner */}
                <div className="mountainTrailBanner">
                  <div className="bannerTextRow">
                    <FaCrown color="#F59E0B" fontSize="20px" />
                    <strong>Complete all quests to earn 50 XP bonus!</strong>
                  </div>
                  <div className="landscapeIllustration">🌄</div>
                </div>

              </div>

            </div>

            {/* RIGHT COLUMN SIDEBAR WIDGETS */}
            <div className="dqpRightSidebar">
              {/* Leaderboard Widget */}
             <div className="dqpWidgetCard">
                <div className="widgetTitleRow">
                  <h4>Leaderboard</h4>
                  <span className="viewAllLink" onClick={() => setToastMessage("Full Leaderboard view loaded!")}>
                    View All
                  </span>
                </div>

                <div className="leaderboardRankList">
                  <div className="rankItem gold">
                    <span className="rankBadge">1</span>
                    <div className="userAvatarMini">🧑‍🎓</div>
                    <strong className="userName">Aarav Mehta</strong>
                    <span className="rankXp">920 XP</span>
                  </div>

                  <div className="rankItem silver">
                    <span className="rankBadge">2</span>
                    <div className="userAvatarMini">👩‍🎓</div>
                    <strong className="userName">Neha Kumari</strong>
                    <span className="rankXp">730 XP</span>
                  </div>

                  <div className="rankItem bronze activeUser">
                    <span className="rankBadge">3</span>
                    <UserAvatar user={user} className="userAvatarMini" size="28px" />
                    <strong className="userName">{userName} (You)</strong>
                    <span className="rankXp">{currentXp} XP</span>
                  </div>

                  <div className="rankItem">
                    <span className="rankBadge">4</span>
                    <div className="userAvatarMini">🧑‍💻</div>
                    <strong className="userName">Rohit Sharma</strong>
                    <span className="rankXp">610 XP</span>
                  </div>
                </div>
              </div>

              {/* Did You Know? Box */}
             <div className="didYouKnowCard">
                <FaLightbulb className="bulbIcon" />
                <div>
                  <h5>Did you know?</h5>
                  <p>Students who complete daily quests learn 2x faster and earn 3x more XP!</p>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* QUEST EXECUTION ACTION MODAL */}
      {activeActionQuest && (
        <div className="questModalOverlay" onClick={() => setActiveActionQuest(null)}>
          <div className="questModalContent" onClick={(e) => e.stopPropagation()}>
            <button className="btnCloseModal" onClick={() => setActiveActionQuest(null)}>
              <FaTimes />
            </button>

            <div className="modalQuestIconHex">{activeActionQuest.icon}</div>
            <h2>{activeActionQuest.title}</h2>
            <p className="modalSub">{activeActionQuest.desc}</p>
            <div className="modalXpPill">{activeActionQuest.xp} Reward</div>

            <div className="questActionInteractiveBox">
              <p>Execute this quest now to claim your +{activeActionQuest.xpVal} XP bonus!</p>
              <button
                className="btnClaimQuest"
                onClick={() => handleCompleteQuest(activeActionQuest)}
              >
                Complete Quest & Claim XP ⭐
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HOW DAILY QUESTS WORK GUIDE MODAL */}
      {isHowItWorksOpen && (
        <div className="questModalOverlay" onClick={() => setIsHowItWorksOpen(false)}>
          <div className="questModalContent guide" onClick={(e) => e.stopPropagation()}>
            <button className="btnCloseModal" onClick={() => setIsHowItWorksOpen(false)}>
              <FaTimes />
            </button>

            <h2>How Daily Quests Work? 🎯</h2>
            <p className="modalSub">Complete 6 daily quests to boost your learning and earn bonus rewards!</p>

            <ul className="guideStepsList">
              <li>1. Daily quests reset every 24 hours at midnight.</li>
              <li>2. Complete quests like finishing lessons, solving code problems, or joining discussions.</li>
              <li>3. Completing all 6 quests unlocks the +50 XP Daily Bonus reward box!</li>
            </ul>

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
