import React, { useState, useEffect, useRef } from "react";
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
  FaSignOutAlt, FaUser, FaEnvelope, FaMapMarkerAlt, FaUniversity,
  FaGraduationCap, FaLink, FaEdit, FaCheck, FaTimes, FaRobot, FaRocket, FaBolt, FaCode,
  FaCamera, FaLock, FaLinkedin, FaGithub, FaGlobe, FaShieldAlt, FaHeadset, FaCheckCircle, FaExclamationTriangle, FaArrowRight, FaDownload,
  FaFileAlt, FaComments, FaTrophy, FaMapSigns, FaBell, FaCalendarAlt, FaLaptop, FaMobileAlt, FaKey, FaExternalLinkAlt, FaQuestionCircle
} from "react-icons/fa";
import "../styles/studentDashboard.css";
import "../styles/profileSettings.css";

import AppLogo from "../components/AppLogo";

export default function StudentProfilePage() {
  const { user, xp, logout, themeMode, toggleTheme, completedTopics, updateUserProfile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const isDarkMode = themeMode === "dark";
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "edit" | "settings"
  const [toastMessage, setToastMessage] = useState("");
  const photoInputRef = useRef(null);

  // Modals state
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);

  // Bio state
  const [bio, setBio] = useState(user?.bio || "Passionate software engineering student looking to build next-generation applications.");
  const [tempBio, setTempBio] = useState(bio);

  const userKey = user?.email || user?.username || "default";
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
        }
      } catch (err) {
        console.error("Failed to fetch claimed certs count:", err);
      }
    };
    fetchClaimedCerts();
  }, [user, userKey, isDemoUser]);


  // Profile Form State
  const [profileData, setProfileData] = useState({
    fullName: user?.full_name || "Alex Morgan",
    username: user?.username || "alex_student",
    email: user?.email || "alex.morgan@skillsphere.edu",
    phone: user?.phone || "+1 (555) 019-2834",
    bio: user?.bio || bio,
    location: user?.location || "San Francisco, CA",
    dob: user?.date_of_birth || "2003-05-15",
    college: user?.college || "Global Institute of Technology",
    branch: user?.branch || "Computer Science & Engineering",
    linkedin: user?.linkedin || "https://linkedin.com/in/alexmorgan",
    github: user?.github || "https://github.com/alexmorgan",
    website: user?.portfolio || "",
    title: user?.title || "",
    skills: user?.skills || "",
    contactEmail: user?.contact_email || "",
    avatarUrl: ""
  });

  // Account Preferences State
  const [accountPrefs, setAccountPrefs] = useState({
    language: user?.preferred_language || "English",
    timezone: user?.timezone || "(GMT+05:30) Asia/Kolkata",
    country: user?.country || "India",
    dateFormat: user?.date_format || "DD MMM YYYY",
    enable2FA: !!user?.enable_2fa
  });

  // Sync state with user context when loaded
  useEffect(() => {
    if (user) {
      setBio(user.bio || "");
      setTempBio(user.bio || "");
      setProfileData({
        fullName: user.full_name || "",
        username: user.username || "",
        email: user.email || "",
        phone: user.phone || "",
        bio: user.bio || "",
        location: user.location || "San Francisco, CA",
        dob: user.date_of_birth || "",
        college: user.college || "",
        branch: user.branch || "",
        linkedin: user.linkedin || "",
        github: user.github || "",
        website: user.portfolio || "",
        title: user.title || "",
        skills: user.skills || "",
        contactEmail: user.contact_email || "",
        avatarUrl: user.avatar_url || user.profile_picture || ""
      });
      setAccountPrefs({
        language: user.preferred_language || "English",
        timezone: user.timezone || "(GMT+05:30) Asia/Kolkata",
        country: user.country || "India",
        dateFormat: user.date_format || "DD MMM YYYY",
        enable2FA: !!user.enable_2fa
      });
    }
  }, [user]);
  
  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error(err);
    } finally {
      navigate("/");
    }
  };

  const saveBio = async () => {
    setBio(tempBio);
    if (updateUserProfile) {
      await updateUserProfile({ bio: tempBio });
    }
    setToastMessage("📝 Biography updated successfully!");
    setTimeout(() => setToastMessage(""), 4000);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result;
      setProfileData((prev) => ({ ...prev, avatarUrl: dataUrl }));
      if (updateUserProfile) {
        await updateUserProfile({
          avatar_url: dataUrl,
          profile_picture: dataUrl
        });
      }
      setToastMessage("📸 Profile picture updated successfully!");
      setTimeout(() => setToastMessage(""), 4000);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    try {
      if (updateUserProfile) {
        await updateUserProfile({
          full_name: profileData.fullName,
          username: profileData.username,
          email: profileData.email,
          phone: profileData.phone,
          bio: profileData.bio,
          location: profileData.location,
          date_of_birth: profileData.dob,
          college: profileData.college,
          branch: profileData.branch,
          linkedin: profileData.linkedin,
          github: profileData.github,
          portfolio: profileData.website,
          title: profileData.title,
          skills: profileData.skills,
          contact_email: profileData.contactEmail,
          avatar_url: profileData.avatarUrl || user?.avatar_url || user?.profile_picture || "",
          profile_picture: profileData.avatarUrl || user?.profile_picture || user?.avatar_url || ""
        });
        setToastMessage("💾 Profile settings saved successfully!");
        if (refreshProfile) {
          await refreshProfile();
        }
      }
    } catch (e) {
      console.error(e);
      setToastMessage("❌ Failed to save profile settings.");
    }
    setTimeout(() => setToastMessage(""), 4000);
  };

  const handleSaveAccount = async () => {
    try {
      if (updateUserProfile) {
        await updateUserProfile({
          full_name: profileData.fullName,
          username: profileData.username,
          email: profileData.email,
          phone: profileData.phone,
          preferred_language: accountPrefs.language,
          timezone: accountPrefs.timezone,
          country: accountPrefs.country,
          date_format: accountPrefs.dateFormat,
          enable_2fa: String(accountPrefs.enable2FA)
        });
        setToastMessage("🔒 Account settings saved successfully!");
        if (refreshProfile) {
          await refreshProfile();
        }
      }
    } catch (e) {
      console.error(e);
      setToastMessage("❌ Failed to save account settings.");
    }
    setTimeout(() => setToastMessage(""), 4000);
  };

  const userName = user?.full_name || user?.username || "Learner";
  const currentXp = xp ?? 0;
  const level = Math.floor(currentXp / 2000) + 1;
  const xpInCurrentLevel = currentXp % 2000;
  const progressPct = currentXp > 0 ? Math.min(100, Math.round((xpInCurrentLevel / 2000) * 100)) : 0;

  // Sidebar navItems
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

  // Dynamic Skill Ratings based on completed topics
  const userCompletedTopics = completedTopics || [];

  const getSkillProgress = (prefixes, totalLessons) => {
    const doneCount = userCompletedTopics.filter(topicId =>
      prefixes.some(pref => topicId.startsWith(pref))
    ).length;
    if (doneCount > 0) {
      return Math.min(100, Math.round((doneCount / totalLessons) * 100));
    }
    return 0;
  };

  const skills = [
    { name: "Frontend Development", value: getSkillProgress(["js_", "react_", "nextjs_"], 36), color: "#3b82f6" },
    { name: "Backend Architecture", value: getSkillProgress(["node_", "system_", "springboot_"], 31), color: "#10b981" },
    { name: "Python & Data Science", value: getSkillProgress(["python_", "ml_"], 40), color: "#f59e0b" },
    { name: "UI/UX Design", value: getSkillProgress(["uiux_"], 14), color: "#ec4899" }
  ];

  // Profile completion calculations
  const getProfileCompletion = () => {
    let score = 0;
    let total = 7;
    const checks = {
      fullName: !!user?.full_name,
      bio: !!user?.bio,
      location: !!user?.location,
      socials: !!(user?.linkedin || user?.github || user?.portfolio),
      dob: !!user?.date_of_birth,
      college: !!user?.college,
      branch: !!user?.branch
    };
    if (checks.fullName) score++;
    if (checks.bio) score++;
    if (checks.location) score++;
    if (checks.socials) score++;
    if (checks.dob) score++;
    if (checks.college) score++;
    if (checks.branch) score++;

    const percent = Math.round((score / total) * 100);
    return { percent, checks };
  };

  const { percent: compPercent, checks: compChecks } = getProfileCompletion();

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
                    className={`sdNavItem ${item.id === "student-profile" ? "active" : ""}`}
                    onClick={() => {
                      if (item.id === "dashboard") navigate("/student-home");
                      else if (item.id === "courses") navigate("/courses");
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
              <input type="text" className="sdSearchInput" placeholder="Search profile activities..." />
            </div>
            <div className="sdHeaderActionsRow">
              <div className="sdXpBadgePill">
                <FaBolt color="#F9572A" /> <span>{currentXp} XP</span>
              </div>
              <NotificationDropdown type="student" />
              <button className="sdLogoutHeaderBtn" onClick={handleLogout}>
                <FaSignOutAlt /> <span>Logout</span>
              </button>
              <div className="sdUserProfilePillWrapper">
                <div className="sdUserProfilePill" onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
                  <UserAvatar user={user} style={{ width: "36px", height: "36px" }} />
                  <div className="sdUserInfoText">
                    <strong>{userName}</strong>
                    <span>Student</span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <div className="sdGreetingHeader" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h1>Student Profile</h1>
              <p>Showcase details, update skills, or customize preferences.</p>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button className="btnOutlineOrange" onClick={() => navigate("/resume")}>
                📄 View Resume
              </button>
            </div>
          </div>

          {/* Sub-Tabs Selector */}
          <div style={{ display: "flex", gap: "12px", borderBottom: "1px solid var(--border-color)", paddingBottom: "12px", marginBottom: "24px" }}>
            <button
              style={{
                background: activeTab === "overview" ? "var(--accent)" : "none",
                color: activeTab === "overview" ? "black" : "var(--text-primary)",
                border: activeTab === "overview" ? "none" : "1px solid var(--border-color)",
                padding: "8px 16px",
                borderRadius: "8px",
                fontWeight: "bold",
                cursor: "pointer"
              }}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>
            <button
              style={{
                background: activeTab === "edit" ? "var(--accent)" : "none",
                color: activeTab === "edit" ? "black" : "var(--text-primary)",
                border: activeTab === "edit" ? "none" : "1px solid var(--border-color)",
                padding: "8px 16px",
                borderRadius: "8px",
                fontWeight: "bold",
                cursor: "pointer"
              }}
              onClick={() => setActiveTab("edit")}
            >
              👤 Edit Profile details
            </button>
            <button
              style={{
                background: activeTab === "settings" ? "var(--accent)" : "none",
                color: activeTab === "settings" ? "black" : "var(--text-primary)",
                border: activeTab === "settings" ? "none" : "1px solid var(--border-color)",
                padding: "8px 16px",
                borderRadius: "8px",
                fontWeight: "bold",
                cursor: "pointer"
              }}
              onClick={() => setActiveTab("settings")}
            >
              ⚙️ Preferences & Security
            </button>
          </div>

          {toastMessage && (
            <div style={{ background: "var(--accent)", color: "black", padding: "12px", borderRadius: "8px", marginBottom: "20px", fontWeight: "bold", textAlign: "center" }}>
              {toastMessage}
            </div>
          )}

          {/* Tab contents */}
          {activeTab === "overview" && (
            <div className="sdDashboardContentGrid">
              <div className="sdCenterMainCol">
                {/* Profile Card Header */}
                <div className="sdWhitePanelCard" style={{ padding: "30px", marginBottom: "24px" }}>
                  <div style={{ display: "flex", gap: "24px", alignItems: "center", flexWrap: "wrap" }}>
                    <div style={{ width: "80px", height: "80px", borderRadius: "50%", overflow: "hidden", background: "var(--border-color)", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid var(--accent)", flexShrink: 0 }}>
                      {(profileData.avatarUrl || user?.avatar_url || user?.profile_picture) ? (
                        <img src={profileData.avatarUrl || user?.avatar_url || user?.profile_picture} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <span style={{ fontSize: "40px" }}>🧑‍🎓</span>
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h2 style={{ color: "var(--text-primary)", margin: "0 0 8px 0" }}>{userName}</h2>
                      <p style={{ color: "var(--text-secondary)", margin: "0 0 12px 0", fontSize: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
                        <FaMapMarkerAlt /> {user?.location || "San Francisco, CA"}
                      </p>
                      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                        <span className="sdLevelTagPill">Level {level}</span>
                        <span style={{ background: "var(--btn-secondary-bg)", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", color: "var(--text-primary)", border: "1px solid var(--border-color)" }}>
                          🎓 CS Student
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: "24px", borderTop: "1px solid var(--border-color)", paddingTop: "20px" }}>
                    <h4 style={{ color: "var(--text-primary)", marginBottom: "10px" }}>Biography</h4>
                    <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.6", margin: 0 }}>{bio || "No biography added yet. Go to 'Edit Profile details' to set one."}</p>
                  </div>
                </div>

                {/* Learning Progress Section */}
                <div className="sdWhitePanelCard" style={{ marginBottom: "24px" }}>
                  <h3>Academic & Skill Progress</h3>
                  <div style={{ marginTop: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span style={{ color: "var(--text-secondary)", fontSize: "14px" }}>Current Level Progression</span>
                      <span style={{ color: "var(--accent)", fontSize: "14px", fontWeight: "bold" }}>{xpInCurrentLevel} / 2000 XP ({progressPct}%)</span>
                    </div>
                    <div className="sdXpProgressBarTrack" style={{ height: "12px" }}>
                      <div className="sdXpProgressBarFill" style={{ width: `${progressPct}%` }}></div>
                    </div>
                  </div>

                  <div style={{ marginTop: "24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                    {skills.map((skill, index) => (
                      <div key={index} style={{ padding: "16px", background: "var(--bg-secondary)", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
                        <span style={{ color: "var(--text-secondary)", fontSize: "12px" }}>{skill.name}</span>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "8px 0" }}>
                          <strong style={{ color: "var(--text-primary)", fontSize: "20px" }}>{skill.value}%</strong>
                        </div>
                        <div style={{ width: "100%", height: "6px", background: "rgba(255,255,255,0.05)", borderRadius: "3px" }}>
                          <div style={{ width: `${skill.value}%`, height: "100%", background: skill.color, borderRadius: "3px" }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Academic Affiliations */}
                <div className="sdWhitePanelCard">
                  <h3>Education & Institution Details</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "16px" }}>
                    <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                      <div style={{ fontSize: "24px", color: "var(--accent)" }}><FaUniversity /></div>
                      <div>
                        <h4 style={{ margin: "0 0 4px 0", color: "var(--text-primary)" }}>{user?.college || "Global Institute of Technology"}</h4>
                        <p style={{ margin: 0, fontSize: "13px", color: "var(--text-secondary)" }}>{user?.branch || "Computer Science & Engineering"}</p>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                      <div style={{ fontSize: "24px", color: "var(--accent)" }}><FaEnvelope /></div>
                      <div>
                        <h4 style={{ margin: "0 0 4px 0", color: "var(--text-primary)" }}>Official Contact Address</h4>
                        <p style={{ margin: 0, fontSize: "13px", color: "var(--text-secondary)" }}>{user?.email || "alex.morgan@skillsphere.edu"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column Sidebar Widgets */}
              <div className="sdRightColumnSidebar">
                <div className="sdRightWidgetCard">
                  <h4>Accomplishments</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "var(--text-secondary)", fontSize: "14px" }}>Total XP</span>
                      <strong style={{ color: "var(--text-primary)" }}>{currentXp}</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "var(--text-secondary)", fontSize: "14px" }}>Rank Level</span>
                      <strong style={{ color: "var(--accent)" }}>Lvl {level}</strong>
                    </div>
                    {(() => {
                      const userBadgesList = Array.isArray(user?.badges)
                        ? user.badges
                        : (typeof user?.badges === 'string' && user.badges ? user.badges.split(',').filter(Boolean) : []);

                      return (
                        <>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ color: "var(--text-secondary)", fontSize: "14px" }}>Badges Won</span>
                            <strong style={{ color: "var(--text-primary)" }}>{userBadgesList.length}</strong>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ color: "var(--text-secondary)", fontSize: "14px" }}>Certificates Earned</span>
                            <strong style={{ color: "var(--accent)" }}>{earnedCertsCount}</strong>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>

                {(() => {
                  const userBadgesList = Array.isArray(user?.badges)
                    ? user.badges
                    : (typeof user?.badges === 'string' && user.badges ? user.badges.split(',').filter(Boolean) : []);

                  return (
                    <div className="sdRightWidgetCard">
                      <h4>Unlocked Badges ({userBadgesList.length})</h4>
                      {userBadgesList.length === 0 ? (
                        <p style={{ margin: "16px 0 0 0", fontSize: "13px", color: "var(--text-secondary)" }}>
                          0 badges unlocked yet. Complete lessons and quizzes to earn badges!
                        </p>
                      ) : (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginTop: "16px" }}>
                          {userBadgesList.map((badge, idx) => (
                            <div key={idx} style={{ fontSize: "20px", background: "var(--bg-secondary)", width: "45px", height: "45px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "10px", border: "1px solid var(--border-color)", cursor: "pointer" }} title={typeof badge === 'string' ? badge : `Badge #${idx + 1}`}>
                              🏅
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {activeTab === "edit" && (
            <div className="psWorkspaceGrid">
              <div className="psFormBlock">
                <h3>Profile Settings</h3>
                <p className="subText">Update your personal information and how others see you on SkillSphere.</p>

                <div className="avatarSectionRow">
                  <div className="avatarCircleBox" onClick={() => photoInputRef.current?.click()} style={{ cursor: "pointer", position: "relative" }}>
                    {(profileData.avatarUrl || user?.avatar_url || user?.profile_picture) ? (
                      <img src={profileData.avatarUrl || user?.avatar_url || user?.profile_picture} alt="Avatar" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                    ) : (
                      <div className="avatarPlaceholder">🧑‍🎓</div>
                    )}
                    <button className="cameraBtn" title="Upload Photo" type="button" onClick={(e) => { e.stopPropagation(); photoInputRef.current?.click(); }}>
                      <FaCamera />
                    </button>
                    <input
                      type="file"
                      ref={photoInputRef}
                      style={{ display: "none" }}
                      accept="image/*"
                      onChange={handlePhotoUpload}
                    />
                  </div>
                  <span className="photoSub">JPG, PNG or WEBP. Max size 2MB</span>
                </div>

                <div className="psForm2Col">
                  <div className="inputGroup">
                    <label>Full Name</label>
                    <input
                      type="text"
                      value={profileData.fullName}
                      onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                    />
                  </div>

                  <div className="inputGroup">
                    <label>Username</label>
                    <input
                      type="text"
                      value={profileData.username}
                      onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                    />
                  </div>
                </div>

                <div className="psForm2Col">
                  <div className="inputGroup">
                    <label>Email Address</label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    />
                  </div>

                  <div className="inputGroup">
                    <label>Phone Number</label>
                    <input
                      type="text"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="inputGroup">
                  <label>Bio</label>
                  <textarea
                    rows="3"
                    maxLength="150"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  />
                  <span className="charCounter">{profileData.bio.length}/150</span>
                </div>

                <div className="psForm2Col">
                  <div className="inputGroup">
                    <label>Location</label>
                    <select
                      value={profileData.location}
                      onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                    >
                      <option value="Bhubaneswar, Odisha">Bhubaneswar, Odisha</option>
                      <option value="Bangalore, Karnataka">Bangalore, Karnataka</option>
                      <option value="Hyderabad, Telangana">Hyderabad, Telangana</option>
                      <option value="Delhi, NCR">Delhi, NCR</option>
                      <option value="San Francisco, CA">San Francisco, CA</option>
                    </select>
                  </div>

                  <div className="inputGroup">
                    <label>Date of Birth</label>
                    <input
                      type="date"
                      value={profileData.dob}
                      onChange={(e) => setProfileData({ ...profileData, dob: e.target.value })}
                    />
                  </div>
                </div>

                <div className="psForm2Col">
                  <div className="inputGroup">
                    <label>College / University</label>
                    <input
                      type="text"
                      value={profileData.college}
                      onChange={(e) => setProfileData({ ...profileData, college: e.target.value })}
                    />
                  </div>

                  <div className="inputGroup">
                    <label>Branch / Field of Study</label>
                    <input
                      type="text"
                      value={profileData.branch}
                      onChange={(e) => setProfileData({ ...profileData, branch: e.target.value })}
                    />
                  </div>
                </div>

                <div className="socialLinksSection">
                  <label>Social Links</label>
                  <div className="social3Row">
                    <div className="socialInputGroup">
                      <FaLinkedin className="sIcon" />
                      <input
                        type="text"
                        placeholder="LinkedIn URL"
                        value={profileData.linkedin}
                        onChange={(e) => setProfileData({ ...profileData, linkedin: e.target.value })}
                      />
                    </div>

                    <div className="socialInputGroup">
                      <FaGithub className="sIcon" />
                      <input
                        type="text"
                        placeholder="GitHub URL"
                        value={profileData.github}
                        onChange={(e) => setProfileData({ ...profileData, github: e.target.value })}
                      />
                    </div>

                    <div className="socialInputGroup">
                      <FaGlobe className="sIcon" />
                      <input
                        type="text"
                        placeholder="Website URL"
                        value={profileData.website}
                        onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="psForm2Col" style={{ marginTop: "16px" }}>
                  <div className="inputGroup">
                    <label>Professional Title / Headline</label>
                    <input
                      type="text"
                      placeholder="e.g. Full Stack Developer Trainee"
                      value={profileData.title}
                      onChange={(e) => setProfileData({ ...profileData, title: e.target.value })}
                    />
                  </div>
                  <div className="inputGroup">
                    <label>Alternate Contact Email</label>
                    <input
                      type="email"
                      placeholder="e.g. alternative@skillsphere.edu"
                      value={profileData.contactEmail}
                      onChange={(e) => setProfileData({ ...profileData, contactEmail: e.target.value })}
                    />
                  </div>
                </div>

                <div className="inputGroup" style={{ marginTop: "16px" }}>
                  <label>Professional Skills (Comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. React, Java, Spring Boot, Python, SQL"
                    value={profileData.skills}
                    onChange={(e) => setProfileData({ ...profileData, skills: e.target.value })}
                  />
                </div>

                <div className="btnFormRow" style={{ marginTop: "24px" }}>
                  <button className="btnSavePrimary" onClick={handleSaveProfile}>Save Profile changes</button>
                </div>
              </div>

              <div className="psRightSidebarCol">
                <div className="psWidgetCard">
                  <div className="widgetTitleRow">
                    <h4>Profile Completion</h4>
                    <span className="pctGreen">{compPercent}% Completed</span>
                  </div>
                  <div className="pTrack"><div className="pFill" style={{ width: `${compPercent}%` }}></div></div>

                  <ul className="completionChecklist" style={{ paddingLeft: 0, listStyle: "none" }}>
                    <li>{compChecks.fullName ? <FaCheckCircle color="#10B981" /> : <FaExclamationTriangle color="#F59E0B" />} <span style={{ marginLeft: "8px" }}>Full Name</span></li>
                    <li>{compChecks.bio ? <FaCheckCircle color="#10B981" /> : <FaExclamationTriangle color="#F59E0B" />} <span style={{ marginLeft: "8px" }}>Bio</span></li>
                    <li>{compChecks.location ? <FaCheckCircle color="#10B981" /> : <FaExclamationTriangle color="#F59E0B" />} <span style={{ marginLeft: "8px" }}>Location</span></li>
                    <li>{compChecks.socials ? <FaCheckCircle color="#10B981" /> : <FaExclamationTriangle color="#F59E0B" />} <span style={{ marginLeft: "8px" }}>Social Links</span></li>
                    <li>{compChecks.dob ? <FaCheckCircle color="#10B981" /> : <FaExclamationTriangle color="#F59E0B" />} <span style={{ marginLeft: "8px" }}>Date of Birth</span></li>
                    <li>{compChecks.college ? <FaCheckCircle color="#10B981" /> : <FaExclamationTriangle color="#F59E0B" />} <span style={{ marginLeft: "8px" }}>College</span></li>
                    <li>{compChecks.branch ? <FaCheckCircle color="#10B981" /> : <FaExclamationTriangle color="#F59E0B" />} <span style={{ marginLeft: "8px" }}>Branch</span></li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="psWorkspaceGrid">
              <div className="psFormBlock">
                <h3>Account Settings & Preferences</h3>
                <p className="subText">Manage your security settings and language preferences.</p>

                <div className="formGroupBlock">
                  <h4>Account Security</h4>
                  <div className="inputGroup">
                    <label>Password</label>
                    <div className="pwdInputRow">
                      <input type="password" value="••••••••••••" readOnly style={{ width: "100%", background: "var(--input-bg)", color: "var(--text-primary)", border: "1px solid var(--border-color)", padding: "10px", borderRadius: "8px" }} />
                      <button className="btnContinueCourse" onClick={() => setIsPasswordModalOpen(true)} style={{ marginLeft: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                        <FaLock /> Change
                      </button>
                    </div>
                  </div>
                </div>

                <div className="formGroupBlock" style={{ marginTop: "24px" }}>
                  <h4>Account Preferences</h4>

                  <div className="psForm2Col">
                    <div className="inputGroup">
                      <label>Preferred Language</label>
                      <select
                        value={accountPrefs.language}
                        onChange={(e) => setAccountPrefs({ ...accountPrefs, language: e.target.value })}
                      >
                        <option value="English">English</option>
                        <option value="Hindi">Hindi</option>
                        <option value="Spanish">Spanish</option>
                      </select>
                    </div>

                    <div className="inputGroup">
                      <label>Timezone</label>
                      <select
                        value={accountPrefs.timezone}
                        onChange={(e) => setAccountPrefs({ ...accountPrefs, timezone: e.target.value })}
                      >
                        <option value="(GMT+05:30) Asia/Kolkata">(GMT+05:30) Asia/Kolkata</option>
                        <option value="(GMT+00:00) UTC">(GMT+00:00) UTC</option>
                        <option value="(GMT-05:00) Eastern Time">(GMT-05:00) Eastern Time</option>
                      </select>
                    </div>
                  </div>

                  <div className="psForm2Col" style={{ marginTop: "12px" }}>
                    <div className="inputGroup">
                      <label>Country</label>
                      <select
                        value={accountPrefs.country}
                        onChange={(e) => setAccountPrefs({ ...accountPrefs, country: e.target.value })}
                      >
                        <option value="India">India</option>
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                      </select>
                    </div>

                    <div className="inputGroup">
                      <label>Date Format</label>
                      <select
                        value={accountPrefs.dateFormat}
                        onChange={(e) => setAccountPrefs({ ...accountPrefs, dateFormat: e.target.value })}
                      >
                        <option value="DD MMM YYYY">DD MMM YYYY</option>
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>
                  </div>

                  <div className="checkboxGroup" style={{ marginTop: "20px" }}>
                    <label style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <input
                        type="checkbox"
                        checked={accountPrefs.enable2FA}
                        onChange={(e) => setAccountPrefs({ ...accountPrefs, enable2FA: e.target.checked })}
                      />
                      <span><strong>Enable 2FA (Two-Factor Authentication)</strong></span>
                    </label>
                  </div>
                </div>

                <div className="deactivateBlock" style={{ marginTop: "32px", borderTop: "1px solid var(--border-color)", paddingTop: "20px" }}>
                  <div>
                    <h4 style={{ color: "#EF4444" }}>Deactivate Account</h4>
                    <p style={{ color: "var(--text-secondary)", fontSize: "12px" }}>Temporarily deactivate your account. You can reactivate anytime.</p>
                  </div>
                  <button className="btnDeactivate" onClick={() => setIsDeactivateModalOpen(true)}>
                    Deactivate Account
                  </button>
                </div>

                <div className="btnFormRow" style={{ marginTop: "24px" }}>
                  <button className="btnSavePrimary" onClick={handleSaveAccount}>Save Preference changes</button>
                </div>
              </div>

              <div className="psRightSidebarCol">
                <div className="psWidgetCard">
                  <h4>Security Overview</h4>
                  <ul className="secChecklist" style={{ paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "10px", marginTop: "16px" }}>
                    <li><FaCheckCircle color="#10B981" /> Strong Password</li>
                    <li><FaCheckCircle color="#10B981" /> 2FA Status: {accountPrefs.enable2FA ? "ON" : "OFF"}</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* CHANGE PASSWORD MODAL */}
      {isPasswordModalOpen && (
        <div className="psModalOverlay" onClick={() => setIsPasswordModalOpen(false)}>
          <div className="psModalContent" onClick={(e) => e.stopPropagation()}>
            <button className="btnCloseModal" onClick={() => setIsPasswordModalOpen(false)}>
              <FaTimes />
            </button>

            <h3>🔒 Change Password</h3>
            <p className="modalSub">Enter your current password and a new secure password.</p>

            <div className="inputGroup">
              <label>Current Password</label>
              <input type="password" autoComplete="current-password" data-lpignore="true" data-1p-ignore="true" data-form-type="other" placeholder="Enter current password" />
            </div>

            <div className="inputGroup">
              <label>New Password</label>
              <input type="password" autoComplete="new-password" data-lpignore="true" data-1p-ignore="true" data-form-type="other" placeholder="Enter new password" />
            </div>

            <div className="inputGroup">
              <label>Confirm New Password</label>
              <input type="password" autoComplete="new-password" data-lpignore="true" data-1p-ignore="true" data-form-type="other" placeholder="Confirm new password" />
            </div>

            <div className="modalBtnRow">
              <button
                className="btnSavePrimary"
                onClick={() => {
                  setIsPasswordModalOpen(false);
                  setToastMessage("🔑 Password changed successfully!");
                  setTimeout(() => setToastMessage(""), 4000);
                }}
              >
                Update Password
              </button>
              <button className="btnCancelOutline" onClick={() => setIsPasswordModalOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DEACTIVATE ACCOUNT MODAL */}
      {isDeactivateModalOpen && (
        <div className="psModalOverlay" onClick={() => setIsDeactivateModalOpen(false)}>
          <div className="psModalContent" onClick={(e) => e.stopPropagation()}>
            <button className="btnCloseModal" onClick={() => setIsDeactivateModalOpen(false)}>
              <FaTimes />
            </button>

            <h3 style={{ color: "#EF4444" }}>⚠️ Deactivate Account</h3>
            <p className="modalSub">Are you sure you want to deactivate your SkillSphere account? You will be logged out immediately.</p>

            <div className="modalBtnRow">
              <button
                className="btnDeactivate"
                onClick={() => {
                  setIsDeactivateModalOpen(false);
                  navigate("/login");
                }}
              >
                Confirm Deactivation
              </button>
              <button className="btnCancelOutline" onClick={() => setIsDeactivateModalOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <StudentFooter />
    </div>
  );
}
