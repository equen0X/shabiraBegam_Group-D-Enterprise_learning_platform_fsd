import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ─── Theme CSS variable maps ───────────────────────────────────────────────
const THEME_VARS = {
  dark: {
    '--bg-primary':     '#05060b',
    '--bg-secondary':   '#0a0e1e',
    '--bg-panel':       'rgba(15, 23, 42, 0.85)',
    '--bg-card':        'rgba(10, 14, 30, 0.9)',
    '--text-primary':   '#ffffff',
    '--text-secondary': '#94a3b8',
    '--text-muted':     '#64748b',
    '--border-color':   'rgba(255,255,255,0.08)',
    '--border-subtle':  'rgba(255,255,255,0.04)',
    '--navbar-bg':      'rgba(12,12,16,0.75)',
    '--input-bg':       'rgba(0,0,0,0.5)',
    '--shadow-panel':   '0 10px 35px rgba(0,0,0,0.5)',
    '--btn-primary-bg': 'linear-gradient(135deg, #00e5ff, #8a2eff)',
    '--btn-primary-text': '#ffffff',
    '--btn-secondary-bg': 'rgba(255,255,255,0.06)',
    '--btn-secondary-text': '#ffffff',
    '--btn-secondary-border': 'rgba(255,255,255,0.15)',
  },
  light: {
    '--bg-primary':     '#f0f4f8',
    '--bg-secondary':   '#e2e8f0',
    '--bg-panel':       'rgba(255,255,255,0.95)',
    '--bg-card':        'rgba(248,250,252,0.98)',
    '--text-primary':   '#0f172a',
    '--text-secondary': '#475569',
    '--text-muted':     '#64748b',
    '--border-color':   'rgba(0,0,0,0.12)',
    '--border-subtle':  'rgba(0,0,0,0.05)',
    '--navbar-bg':      'rgba(255,255,255,0.92)',
    '--input-bg':       'rgba(255,255,255,0.9)',
    '--shadow-panel':   '0 10px 35px rgba(0,0,0,0.08)',
    '--btn-primary-bg': 'linear-gradient(135deg, #0284c7, #7c3aed)',
    '--btn-primary-text': '#ffffff',
    '--btn-secondary-bg': '#ffffff',
    '--btn-secondary-text': '#0f172a',
    '--btn-secondary-border': 'rgba(0,0,0,0.15)',
  }
};

function applyGlobalTheme(mode = 'dark', accent) {
  const vars = THEME_VARS[mode] || THEME_VARS.dark;
  const root = document.documentElement;
  Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
  root.style.setProperty('--accent', accent || '#00e5ff');
  root.setAttribute('data-theme', mode);
  if (mode === 'light') {
    root.classList.add('light-theme');
    root.classList.remove('dark-theme');
    if (document.body) {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
  } else {
    root.classList.add('dark-theme');
    root.classList.remove('light-theme');
    if (document.body) {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    }
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [xp, setXp] = useState(0);
  const [completedTopics, setCompletedTopics] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const navigate = useNavigate();

  // ─── Theme state ──────────────────────────────────────────────────────
  const [themeMode, setThemeMode] = useState(() =>
    localStorage.getItem('skillsphere_theme_mode') || 'dark'
  );
  const [themeAccent, setThemeAccent] = useState(() =>
    localStorage.getItem('skillsphere_theme_accent') || '#00e5ff'
  );

  // Workforce theme is scoped specifically to Workforce pages
  const [workforceTheme, setWorkforceTheme] = useState(() =>
    localStorage.getItem('skillsphere_wf_theme') || 'dark'
  );

  const toggleTheme = () => {
    setThemeMode(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Re-apply theme CSS vars whenever themeMode or themeAccent changes
  useEffect(() => {
    applyGlobalTheme(themeMode, themeAccent);
    localStorage.setItem('skillsphere_theme_mode', themeMode);
    localStorage.setItem('skillsphere_theme_accent', themeAccent);
  }, [themeMode, themeAccent]);

  const updateWorkforceTheme = (mode) => {
    setWorkforceTheme(mode);
    localStorage.setItem('skillsphere_wf_theme', mode);
  };

  const updateTheme = ({ mode, accent }) => {
    if (mode !== undefined) setThemeMode(mode);
    if (accent !== undefined) setThemeAccent(accent);
  };

  useEffect(() => {
    if (user) {
      const userKey = user.email || user.username || user.id || 'default';

      const initialXp = user.xp !== undefined && user.xp !== null ? user.xp : 0;
      setXp(initialXp);

      const initialTopics = (user.completed_topics && user.completed_topics.length > 0)
        ? user.completed_topics
        : [];
      setCompletedTopics(initialTopics);

      const initialCourses = (user.enrolled_courses && user.enrolled_courses.length > 0)
        ? user.enrolled_courses
        : [];
      setEnrolledCourses(initialCourses.map(id => id.toString()));
    } else {
      setXp(0);
      setCompletedTopics([]);
      setEnrolledCourses([]);
    }
  }, [user]);

  const earnXp = async (amount) => {
    if (!user) return;
    try {
      const response = await authenticatedFetch(`${API_URL}/api/xp/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ points: amount }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setXp(data.xp);
        setUser(prev => ({
          ...prev,
          xp: data.xp,
          streak: data.streak !== undefined ? data.streak : prev.streak,
          longest_streak: data.longestStreak !== undefined ? data.longestStreak : prev.longest_streak,
          total_study_time: data.totalStudyTime !== undefined ? data.totalStudyTime : prev.total_study_time,
          activity_map: data.activityMap !== undefined ? data.activityMap : prev.activity_map,
        }));
      }
    } catch (err) {
      console.error('Failed to save XP to database:', err);
      // Fallback local storage
      setXp(prev => {
        const next = prev + amount;
        localStorage.setItem(`xp_${user.email || user.username}`, next.toString());
        return next;
      });
    }
  };

  const enrollCourse = async (courseId) => {
    if (!user) return;
    const stringId = courseId.toString();
    try {
      const response = await authenticatedFetch(`${API_URL}/api/course/enroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: stringId }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setEnrolledCourses(prev => {
          if (prev.includes(stringId)) return prev;
          return [...prev, stringId];
        });
        setUser(prev => {
          const currentCourses = prev.enrolled_courses || [];
          const updatedCourses = currentCourses.includes(stringId) ? currentCourses : [...currentCourses, stringId];
          return { ...prev, enrolled_courses: updatedCourses };
        });
      }
    } catch (err) {
      console.error('Failed to enroll in course in database:', err);
      // Fallback local storage
      setEnrolledCourses(prev => {
        if (prev.includes(stringId)) return prev;
        const next = [...prev, stringId];
        localStorage.setItem(`enrolled_courses_${user.email || user.username}`, JSON.stringify(next));
        return next;
      });
    }
  };

  const completeTopic = async (topicId, xpReward) => {
    if (!user) return;
    try {
      const response = await authenticatedFetch(`${API_URL}/api/topic/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topicId, xpReward }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setXp(data.xp);
        setCompletedTopics(prev => {
          if (prev.includes(topicId)) return prev;
          return [...prev, topicId];
        });
        setUser(prev => {
          const currentTopics = prev.completed_topics || [];
          const updatedTopics = currentTopics.includes(topicId) ? currentTopics : [...currentTopics, topicId];
          return {
            ...prev,
            xp: data.xp,
            completed_topics: updatedTopics,
            streak: data.streak !== undefined ? data.streak : prev.streak,
            longest_streak: data.longestStreak !== undefined ? data.longestStreak : prev.longest_streak,
            total_study_time: data.totalStudyTime !== undefined ? data.totalStudyTime : prev.total_study_time,
            activity_map: data.activityMap !== undefined ? data.activityMap : prev.activity_map,
          };
        });
      }
    } catch (err) {
      console.error('Failed to complete topic in database:', err);
      // Fallback local storage
      setCompletedTopics(prev => {
        if (prev.includes(topicId)) return prev;
        const next = [...prev, topicId];
        localStorage.setItem(`completed_topics_${user.email || user.username}`, JSON.stringify(next));
        earnXp(xpReward);
        return next;
      });
    }
  };

  const clearUserLocalData = (emailOrKey) => {
    if (!emailOrKey) return;
    const cleanKey = emailOrKey.toLowerCase();
    const keys = [
      `enrolledCourses_${cleanKey}`,
      `skillsphere_enrolled_courses_${cleanKey}`,
      `skillsphere_completed_sub_lessons_${cleanKey}`,
      `skillsphere_earned_badges_${cleanKey}`,
      `skillsphere_earned_certs_${cleanKey}`,
      `ss_activity_${cleanKey}`,
      `skillsphere_saved_courses_${cleanKey}`,
      `skillsphere_user_profile_${cleanKey}`,
      `skillsphere_assessments_passed_${cleanKey}`
    ];
    keys.forEach(k => {
      try { localStorage.removeItem(k); } catch (e) {}
    });
  };

  const clearSession = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  const refreshSession = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) throw new Error('No refresh token');

    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await response.json();
    if (!response.ok || !data.accessToken) {
      clearSession();
      throw new Error('Session expired. Please log in again.');
    }

    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.accessToken;
  };

  const fetchProfile = async (token, isRetry = false, throwOnError = false) => {
    try {
      const response = await fetch(`${API_URL}/me`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Backend not reachable');
      }

      const data = await response.json();

      if ((response.status === 401 || response.status === 403) && !isRetry) {
        const newToken = await refreshSession();
        return fetchProfile(newToken, true, throwOnError);
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to fetch profile');
      }

      let finalUser = data.user;
      const userKey = finalUser.email || finalUser.username || finalUser.id || 'default';
      try {
        const savedProfile = localStorage.getItem(`skillsphere_user_profile_${userKey}`);
        if (savedProfile) {
          const parsed = JSON.parse(savedProfile);
          finalUser = { ...finalUser, ...parsed };
        }
      } catch (e) {
        console.error("Error reading stored user profile:", e);
      }
      setUser(finalUser);
    } catch (err) {
      console.error('Session restore failed:', err.message);
      clearSession();
      if (throwOnError) throw err;
    }
  };

  const refreshProfile = async () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      await fetchProfile(token);
    }
  };

  const updateUserProfile = async (details) => {
    if (!user) return;
    const userKey = user.email || user.username || user.id || 'default';
    const updated = { ...user, ...details };

    setUser(updated);
    try {
      localStorage.setItem(`skillsphere_user_profile_${userKey}`, JSON.stringify(updated));
      localStorage.setItem('skillsphere_user', JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save profile locally:", e);
    }

    try {
      await authenticatedFetch(`${API_URL}/api/profile/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(details),
      });
    } catch (err) {
      console.error('Failed to update profile in database:', err);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          await fetchProfile(token);
        } catch (e) {
          console.warn("Session restore warning, initializing local student session:", e);
        }
      }
      
      // Ensure user is populated so protected student routes like /ai-study-buddy never redirect to login
      setUser(prev => {
        if (prev) return prev;
        const storedUser = localStorage.getItem('skillsphere_user');
        if (storedUser) {
          try { return JSON.parse(storedUser); } catch {}
        }
        return {
          id: 'demo_student_id',
          username: 'student_learner',
          email: 'student@skillsphere.com',
          full_name: 'Student Learner',
          role: 'STUDENT',
          xp: 0,
          streak: 0
        };
      });
      setLoading(false);
    };
    initializeAuth();
  }, []);

  const syncNewUserToAdminCache = (userData, userRole, fullName, username, email) => {
    try {
      const isStudent = (userRole || 'STUDENT').toUpperCase() === 'STUDENT';
      const storageKey = isStudent ? 'admin_users' : 'admin_workforce';
      const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const id = Number(userData?.id) || Date.now();
      const name = fullName || userData?.full_name || userData?.fullName || username || userData?.username || 'User';
      const userEmail = email || userData?.email;

      const newEntry = isStudent ? {
        id,
        name,
        email: userEmail,
        role: "STUDENT",
        status: "Active",
        createdAt: new Date().toISOString()
      } : {
        id,
        name,
        email: userEmail,
        role: (userRole || 'EMPLOYEE').toUpperCase(),
        dept: "Engineering",
        status: "Approved",
        createdAt: new Date().toISOString()
      };

      if (!existing.some(item => item.email?.toLowerCase() === userEmail?.toLowerCase())) {
        const updated = [newEntry, ...existing];
        localStorage.setItem(storageKey, JSON.stringify(updated));
      }

      // Dispatch event so Admin Dashboard updates immediately in real-time
      window.dispatchEvent(new CustomEvent('skillsphere_sync_event'));
    } catch (e) {
      console.warn("Failed updating admin cache on registration:", e);
    }
  };

  const loginWithGoogle = async (credential, role) => {
    const response = await fetch(`${API_URL}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential, role }),
    });
    const data = await response.json();
    if (!response.ok || !data.success) throw new Error(data.message || 'Authentication failed');
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    await fetchProfile(data.accessToken, false, true);
    syncNewUserToAdminCache(data.user, role, data.user?.full_name, data.user?.username, data.user?.email);
    return data.user;
  };

  const signupLocal = async (username, full_name, email, password, role) => {
    clearUserLocalData(email);
    clearUserLocalData(username);
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, full_name, email, password, role }),
    });
    let data;
    try { data = await response.json(); } catch { throw new Error('Server returned an invalid response.'); }
    if (!response.ok || !data.success) throw new Error(data.message || 'Registration failed');
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    await fetchProfile(data.accessToken, false, true);
    syncNewUserToAdminCache(data.user, role, full_name, username, email);
    return data.user;
  };

  const loginLocal = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      let data;
      try { data = await response.json(); } catch { throw new Error('Server returned an invalid response.'); }
      
      if (response.ok && data.success) {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        await fetchProfile(data.accessToken, false, true);
        return data.user;
      } else {
        // If password explicitly doesn't match an existing registered user, inform user
        if (data.message === "Incorrect password" || data.message === "Please use Google login for this account") {
          throw new Error(data.message);
        }
        // Fallback for new/demo accounts
        throw new Error(data.message || 'Login failed');
      }
    } catch (err) {
      if (err.message === "Incorrect password" || err.message === "Please use Google login for this account") {
        throw err;
      }
      console.warn("Backend login unverified, providing local session for demo/dev mode:", err.message);
      
      const cleanName = email.split('@')[0] || 'student';
      const formattedName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
      const isWorkforce = email.includes('workforce') || email.includes('employee');
      
      const mockUser = {
        id: `local_id_${Date.now()}`,
        username: cleanName,
        email: email,
        full_name: `${formattedName} Learner`,
        role: isWorkforce ? 'EMPLOYEE' : 'STUDENT',
        xp: 0,
        streak: 0
      };

      const mockToken = `mock_token_${Date.now()}`;
      localStorage.setItem('accessToken', mockToken);
      localStorage.setItem('refreshToken', `mock_refresh_${Date.now()}`);
      localStorage.setItem(`skillsphere_user_profile_${email}`, JSON.stringify(mockUser));
      setUser(mockUser);
      return mockUser;
    }
  };

  const logout = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      if (accessToken && refreshToken) {
        await fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
          body: JSON.stringify({ refreshToken }),
        });
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      clearSession();
      navigate('/');
    }
  };

  const authenticatedFetch = async (url, options = {}) => {
    let token = localStorage.getItem('accessToken');
    const makeRequest = (t) => fetch(url, {
      ...options,
      headers: { ...options.headers, 'Authorization': `Bearer ${t || ''}` },
    });

    if (!token || token.startsWith('mock_token_')) {
      try {
        const res = await fetch(url, options);
        return res;
      } catch (e) {
        return new Response(JSON.stringify({ success: false, messages: [] }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    try {
      let response = await makeRequest(token);
      if (response.status === 401 || response.status === 403) {
        try {
          const newToken = await refreshSession();
          response = await makeRequest(newToken);
        } catch (err) {
          console.warn("Session refresh unavailable for API call:", err);
          return response;
        }
      }
      return response;
    } catch (networkErr) {
      console.warn("authenticatedFetch network error:", networkErr);
      return new Response(JSON.stringify({ success: false, messages: [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  };

  const unlockBadge = async (badgeId) => {
    if (!user) return;
    try {
      const response = await authenticatedFetch(`${API_URL}/api/badge/unlock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ badgeId }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setUser(prev => {
          const currentBadges = prev.badges || [];
          const updatedBadges = currentBadges.includes(badgeId) ? currentBadges : [...currentBadges, badgeId];
          return { ...prev, badges: updatedBadges };
        });
      }
    } catch (err) {
      console.error('Failed to unlock badge in database:', err);
      // Fallback local storage
      localStorage.setItem(`badge_${badgeId}_badge_${user.email || user.username}`, 'true');
      setUser(prev => {
        const currentBadges = prev.badges || [];
        const updatedBadges = currentBadges.includes(badgeId) ? currentBadges : [...currentBadges, badgeId];
        return { ...prev, badges: updatedBadges };
      });
    }
  };

  const value = {
    user, loading,
    loginWithGoogle, signupLocal, loginLocal, logout, authenticatedFetch,
    xp, earnXp,
    completedTopics, completeTopic,
    enrolledCourses, enrollCourse,
    updateUserProfile,
    unlockBadge,
    refreshProfile,
    themeMode, themeAccent, toggleTheme, setThemeMode, updateTheme,
    workforceTheme, updateWorkforceTheme,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
