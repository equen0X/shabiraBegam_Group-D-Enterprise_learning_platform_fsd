import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { 
  FiUsers, FiBook, FiBriefcase, FiSettings, FiLogOut, FiEdit, FiTrash2, 
  FiPlus, FiCheck, FiX, FiImage, FiBell, FiChevronDown, 
  FiCalendar, FiAward, FiGrid, FiMoreVertical, FiActivity, FiUserPlus, FiPlusCircle, FiFileText, FiClock, FiRefreshCw
} from 'react-icons/fi';
import Background from '../../components/Background';
import AppLogo from '../../components/AppLogo';
import '../../styles/dashboard.css';

export default function AdminDashboard() {
  const { 
    logoutAdmin, courses, addCourse, updateCourse, deleteCourse, 
    users, addStudent, toggleStudentStatus, deleteStudent, 
    workforce, addWorkforce, changeWorkforceStatus, 
    allRegisteredUsers,
    certificates, addCertificate, deleteCertificate,
    pendingCourseRequests, approveCourseRequest, rejectCourseRequest, refreshPendingRequests,
    leaveRequests, approveLeaveRequest, rejectLeaveRequest, refreshLeaveRequests,
    getCourseEnrolledStudents,
    refreshData
  } = useAdmin();
  
  const navigate = useNavigate();
  
  // Navigation & States
  const [activeTab, setActiveTab] = useState('dashboard');

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  // Modals
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showAddWorkforce, setShowAddWorkforce] = useState(false);
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [showIssueCert, setShowIssueCert] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [selectedEnrolledCourse, setSelectedEnrolledCourse] = useState(null); // { course, students }
  
  // Dropdown menus for rows
  const [activeRowMenu, setActiveRowMenu] = useState(null); // { type: 'student'|'workforce', id: number }

  // Format date helper
  const formatDate = (dateStr) => {
    try {
      const d = dateStr ? new Date(dateStr) : new Date();
      const validDate = isNaN(d.getTime()) ? new Date() : d;
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return `${months[validDate.getMonth()]} ${validDate.getDate()}, ${validDate.getFullYear()}`;
    } catch {
      return "Recently";
    }
  };

  // Helper to count enrolled courses for a given student
  const getStudentEnrolledCount = (u) => {
    if (!u) return 0;
    const courseIds = new Set();
    const raw = u.enrolledCourses ?? u.enrolled_courses;
    if (raw) {
      if (Array.isArray(raw)) {
        raw.forEach(c => c && courseIds.add(c.toString().trim()));
      } else if (typeof raw === 'string') {
        const trimmed = raw.trim();
        if (trimmed.startsWith('[')) {
          try {
            const parsed = JSON.parse(trimmed);
            if (Array.isArray(parsed)) parsed.forEach(c => c && courseIds.add(c.toString().trim()));
          } catch (e) {}
        }
        if (courseIds.size === 0 && trimmed) {
          trimmed.split(',').forEach(c => {
            if (c.trim()) courseIds.add(c.trim());
          });
        }
      }
    }
    const uEmail = u.email || u.username;
    if (uEmail) {
      const cleanEmail = uEmail.toLowerCase();
      const keys = [
        `enrolledCourses_${uEmail}`,
        `enrolledCourses_${cleanEmail}`,
        `skillsphere_enrolled_courses_${uEmail}`,
        `skillsphere_enrolled_courses_${cleanEmail}`,
        `enrolled_courses_${uEmail}`,
        `enrolled_courses_${cleanEmail}`
      ];
      keys.forEach(k => {
        try {
          const val = localStorage.getItem(k);
          if (val) {
            const parsed = JSON.parse(val);
            if (Array.isArray(parsed)) parsed.forEach(c => c && courseIds.add(c.toString().trim()));
          }
        } catch (e) {}
      });
    }
    return courseIds.size;
  };

  // Sorted users (newest registered students and workforce first)
  const sortedStudents = [...users].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0) || b.id - a.id);
  const sortedWorkforce = [...workforce].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0) || b.id - a.id);

  // Service Bookings State (for Admin Dashboard)
  const [adminServiceBookings, setAdminServiceBookings] = useState(() => {
    try {
      const stored = localStorage.getItem("skillsphere_admin_service_bookings");
      return stored ? JSON.parse(stored) : [
        { id: "SB-101", studentName: "Soumitri Roy", studentEmail: "soumitriroy@gmail.com", serviceTitle: "1-on-1 Live Mentorship", price: "₹1,499 / session", date: "2026-08-10", time: "16:00", status: "scheduled", bookedAt: "Today" },
        { id: "SB-102", studentName: "Aarav Sharma", studentEmail: "aarav@gmail.com", serviceTitle: "Interactive Mock Interviews", price: "₹2,499 / session", date: "2026-08-12", time: "11:00", status: "scheduled", bookedAt: "Yesterday" }
      ];
    } catch {
      return [];
    }
  });

  const refreshServiceBookings = () => {
    try {
      const stored = localStorage.getItem("skillsphere_admin_service_bookings");
      if (stored) setAdminServiceBookings(JSON.parse(stored));
    } catch (e) {
      console.warn("Service bookings load error:", e);
    }
  };

  useEffect(() => {
    window.addEventListener("skillsphere_sync_event", refreshServiceBookings);
    window.addEventListener("storage", refreshServiceBookings);
    return () => {
      window.removeEventListener("skillsphere_sync_event", refreshServiceBookings);
      window.removeEventListener("storage", refreshServiceBookings);
    };
  }, []);

  // Notifications state — merge static + live registrations + live pending approval notifications + leave notifications
  const [baseNotifications] = useState([
    { id: 1, text: "Aarav Sharma completed Frontend System Design", time: "10 mins ago", read: false },
    { id: 2, text: "New registration request: Frank Mentor (Workforce)", time: "1 hour ago", read: false },
    { id: 3, text: "Daily platform activity report generated", time: "2 hours ago", read: false }
  ]);
  const [readIds, setReadIds] = useState([]);

  const pendingApprovalNotifs = pendingCourseRequests
    .filter(r => r.status === 'pending')
    .map(r => ({
      id: `approval-${r.id}`,
      text: `Course enrollment request: ${r.studentName} → ${r.courseTitle}`,
      time: r.requestDate || 'Recently',
      read: readIds.includes(`approval-${r.id}`),
      isApproval: true
    }));

  const pendingLeaveNotifs = (leaveRequests || [])
    .filter(r => r.status === 'pending')
    .map(r => ({
      id: `leave-${r.id}`,
      text: `Leave request: ${r.employeeName} (${r.leaveType}, ${r.days}d)`,
      time: r.requestDate || 'Recently',
      read: readIds.includes(`leave-${r.id}`),
      isLeaveApproval: true
    }));

  // Real-time notifications for newly registered students and workforce
  const studentNotifs = sortedStudents.slice(0, 3).map(u => ({
    id: `student-reg-${u.id}`,
    text: `New student registration: ${u.name} (${u.email})`,
    time: formatDate(u.createdAt),
    read: readIds.includes(`student-reg-${u.id}`)
  }));

  const workforceNotifs = sortedWorkforce.slice(0, 3).map(w => ({
    id: `wf-reg-${w.id}`,
    text: `New workforce registration: ${w.name} (${w.email} - ${w.role})`,
    time: formatDate(w.createdAt),
    read: readIds.includes(`wf-reg-${w.id}`)
  }));

  const notifications = [
    ...pendingApprovalNotifs,
    ...pendingLeaveNotifs,
    ...studentNotifs,
    ...workforceNotifs,
    ...baseNotifications.map(n => ({ ...n, read: readIds.includes(n.id) }))
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => setReadIds(notifications.map(n => n.id));

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin-login');
  };

  // Close menus on click outside
  useEffect(() => {
    const handleOutsideClick = () => {
      setActiveRowMenu(null);
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  // Today's date for the header
  const todayLabel = formatDate(null);

  return (
    <div className="dashboard-page with-sidebar" style={{ background: '#FFFBF7', minHeight: '100vh', color: '#1E1B18', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Background />
      
      {/* ─── SIDEBAR ─── */}
      <aside style={{
        width: '260px',
        background: '#FFFFFF',
        borderRight: '1px solid #F3EBE1',
        position: 'fixed',
        top: 0, bottom: 0, left: 0,
        display: 'flex', flexDirection: 'column',
        zIndex: 50,
        boxShadow: '0 8px 30px rgba(0,0,0,0.01)'
      }}>
        {/* Logo and Brand */}
        <div style={{ padding: '18px 20px', borderBottom: '1px solid #F3EBE1', display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => setActiveTab('dashboard')}>
          <AppLogo height="48px" />
        </div>
        
        {/* Navigation Items */}
        <nav style={{ padding: '20px 10px', display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
          <SidebarBtn icon={<FiGrid />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarBtn icon={<FiUsers />} label="Student Management" hasChevron active={activeTab === 'students'} onClick={() => setActiveTab('students')} />
          <SidebarBtn icon={<FiBriefcase />} label="Workforce Management" hasChevron active={activeTab === 'workforce'} onClick={() => setActiveTab('workforce')} />
          <SidebarBtn icon={<FiBook />} label="Courses (Admin)" active={activeTab === 'courses'} onClick={() => setActiveTab('courses')} />
          <SidebarBtn 
            icon={<FiClock />} 
            label="Course Approvals" 
            active={activeTab === 'approvals'} 
            onClick={() => { setActiveTab('approvals'); refreshPendingRequests(); }}
            badge={pendingCourseRequests.filter(r => r.status === 'pending').length}
          />
          <SidebarBtn 
            icon={<FiCalendar />} 
            label="Leave Approvals" 
            active={activeTab === 'leaveApprovals'} 
            onClick={() => { setActiveTab('leaveApprovals'); refreshLeaveRequests(); }}
            badge={(leaveRequests || []).filter(r => r.status === 'pending').length}
          />
          <SidebarBtn 
            icon={<FiCalendar />} 
            label="Service Bookings" 
            active={activeTab === 'serviceBookings'} 
            onClick={() => { setActiveTab('serviceBookings'); refreshServiceBookings(); }}
            badge={adminServiceBookings.filter(b => b.status === 'scheduled').length}
          />
          <SidebarBtn icon={<FiAward />} label="Certifications" active={activeTab === 'certifications'} onClick={() => setActiveTab('certifications')} />
          <SidebarBtn icon={<FiSettings />} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        </nav>
        
        {/* Bottom Graphic (Graduation Cap & Books) */}
        <div style={{ padding: '20px', position: 'relative', overflow: 'hidden' }}>
          <div style={{
            background: 'linear-gradient(135deg, #FFF5F2 0%, #FFFBF9 100%)',
            border: '1px solid #FFEBE3',
            borderRadius: '16px',
            padding: '16px',
            textAlign: 'center',
            position: 'relative'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎓</div>
            <div style={{ fontWeight: '800', fontSize: '13px', color: '#1E1B18' }}>Manage with Ease</div>
            <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>Control enrollment, courses, and verify certifications in one unified portal.</div>
          </div>
          
          <button 
            onClick={handleLogout}
            style={{
              width: '100%', padding: '12px', background: '#FFF0ED', color: '#F9572A',
              border: 'none', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              cursor: 'pointer', transition: 'all 0.2s', fontWeight: '800', marginTop: '15px', fontSize: '14px'
            }}
          >
            <FiLogOut /> Logout Admin
          </button>
        </div>
      </aside>

      {/* ─── MAIN CONTENT CONTAINER ─── */}
      <div style={{ marginLeft: '260px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        
        {/* ─── HEADER ─── */}
        <header style={{
          height: '75px',
          background: '#FFFFFF',
          borderBottom: '1px solid #F3EBE1',
          padding: '0 40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 40
        }}>
          {/* Hamburger + Screen Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button style={{ background: 'none', border: 'none', color: '#1E1B18', fontSize: '20px', cursor: 'pointer', padding: 4 }}>
              <FiGrid />
            </button>
            <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#1E1B18' }}>
              {activeTab === 'dashboard' && 'Dashboard'}
              {activeTab === 'students' && 'Student Management'}
              {activeTab === 'workforce' && 'Workforce Management'}
              {activeTab === 'courses' && 'Course Management'}
              {activeTab === 'approvals' && 'Course Pending Approvals'}
              {activeTab === 'leaveApprovals' && 'Workforce Leave Approvals'}
              {activeTab === 'certifications' && 'Certifications'}
              {activeTab === 'settings' && 'Platform Settings'}
            </h1>
          </div>

          {/* Notification + Profile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>

            {/* Notification Bell */}
            <div style={{ position: 'relative' }}>
              <button 
                onClick={(e) => { e.stopPropagation(); setNotificationsOpen(!notificationsOpen); setProfileDropdownOpen(false); }}
                style={{
                  background: '#FAF8F5', border: '1px solid #F3EBE1', width: '42px', height: '42px',
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: '#1E1B18', fontSize: '18px', transition: 'all 0.2s', position: 'relative'
                }}
              >
                <FiBell />
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute', top: '-2px', right: '-2px', background: '#F9572A',
                    color: '#FFFFFF', fontSize: '10px', fontWeight: '800', width: '18px', height: '18px',
                    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '2px solid #FFF'
                  }}>
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popover */}
              {notificationsOpen && (
                <div style={{
                  position: 'absolute', top: '52px', right: 0, width: '320px', background: '#FFFFFF',
                  border: '1px solid #F3EBE1', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                  padding: '16px', zIndex: 60
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px solid #F8FAFC', paddingBottom: '8px' }}>
                    <div style={{ fontWeight: '850', fontSize: '14px' }}>Notifications</div>
                    <button 
                      onClick={markAllRead}
                      style={{ background: 'none', border: 'none', color: '#F9572A', fontSize: '11px', cursor: 'pointer', fontWeight: '700' }}
                    >
                      Mark all read
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '280px', overflowY: 'auto' }}>
                    {notifications.map(n => (
                      <div 
                        key={n.id}
                        onClick={() => { if (n.isApproval) { setActiveTab('approvals'); setNotificationsOpen(false); }}}
                        style={{ 
                          display: 'flex', flexDirection: 'column', gap: '2px', borderBottom: '1px solid #FAF8F5', paddingBottom: '6px',
                          cursor: n.isApproval ? 'pointer' : 'default',
                          background: n.isApproval && !n.read ? '#FFFBEB' : 'transparent',
                          borderRadius: n.isApproval ? '8px' : '0',
                          padding: n.isApproval ? '8px' : '0 0 6px'
                        }}
                      >
                        {n.isApproval && <div style={{ fontSize: '9px', fontWeight: '800', color: '#F59E0B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>⏳ Approval Needed</div>}
                        <div style={{ fontSize: '12.5px', color: '#1E1B18', fontWeight: n.read ? '500' : '750' }}>{n.text}</div>
                        <div style={{ fontSize: '10px', color: '#94A3B8' }}>{n.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Menu */}
            <div style={{ position: 'relative' }}>
              <div 
                onClick={(e) => { e.stopPropagation(); setProfileDropdownOpen(!profileDropdownOpen); setNotificationsOpen(false); }}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
              >
                <div style={{
                  width: '42px', height: '42px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #FFF0EB, #FFE2D8)', border: '1px solid #F9572A',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: '#F9572A'
                }}>
                  AU
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '14px', fontWeight: '750', color: '#1E1B18', lineHeight: '1.2' }}>Admin User</span>
                  <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '600' }}>Super Admin</span>
                </div>
                <FiChevronDown style={{ color: '#64748B' }} />
              </div>

              {/* Profile Dropdown Popover */}
              {profileDropdownOpen && (
                <div style={{
                  position: 'absolute', top: '52px', right: 0, width: '200px', background: '#FFFFFF',
                  border: '1px solid #F3EBE1', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                  padding: '8px', zIndex: 60
                }}>
                  <button 
                    onClick={() => { setActiveTab('settings'); setProfileDropdownOpen(false); }}
                    style={{
                      width: '100%', padding: '10px 14px', background: 'none', border: 'none', borderRadius: '8px',
                      textAlign: 'left', cursor: 'pointer', fontSize: '13.5px', color: '#1E1B18', display: 'flex',
                      alignItems: 'center', gap: '10px', transition: 'all 0.2s'
                    }}
                  >
                    <FiSettings /> Profile Settings
                  </button>
                  <button 
                    onClick={handleLogout}
                    style={{
                      width: '100%', padding: '10px 14px', background: '#FFF2F2', border: 'none', borderRadius: '8px',
                      textAlign: 'left', cursor: 'pointer', fontSize: '13.5px', color: '#EF4444', display: 'flex',
                      alignItems: 'center', gap: '10px', fontWeight: '700', marginTop: '4px'
                    }}
                  >
                    <FiLogOut /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ─── SCROLLABLE PAGE WORKSPACE ─── */}
        <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
          
          {/* ─── VIEW 1: MAIN DASHBOARD HOME ─── */}
          {activeTab === 'dashboard' && (
            <div>
              {/* Welcome Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px' }}>
                <div>
                  <h1 style={{ margin: '0 0 6px', fontSize: '28px', fontWeight: '850', color: '#1E1B18', letterSpacing: '-0.5px' }}>
                    Welcome back, Admin!
                  </h1>
                  <p style={{ color: '#64748B', margin: 0, fontSize: '14.5px', fontWeight: '500' }}>
                    Here's what's happening on your platform today.
                  </p>
                </div>
                {/* Date and Refresh Row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button 
                    onClick={() => refreshData && refreshData()}
                    title="Refresh all admin data and registrations"
                    style={{
                      background: '#FFFFFF', border: '1px solid #F3EBE1', padding: '10px 16px',
                      borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px',
                      fontSize: '13.5px', fontWeight: '750', color: '#1E1B18', cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.01)', transition: 'all 0.2s'
                    }}
                  >
                    <FiRefreshCw style={{ color: '#F9572A' }} />
                    Refresh
                  </button>
                  <button style={{
                    background: '#FFFFFF', border: '1px solid #F3EBE1', padding: '10px 18px',
                    borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px',
                    fontSize: '13.5px', fontWeight: '750', color: '#1E1B18', cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.01)'
                  }}>
                    <FiCalendar style={{ color: '#F9572A' }} />
                    {todayLabel}
                  </button>
                </div>
              </div>

              {/* KPI Cards Row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '35px' }}>
                <KpiCard 
                  title="Total Students" 
                  value={users.length.toLocaleString()} 
                  trend="+12.5%" 
                  icon={<FiUsers />} 
                />
                <KpiCard 
                  title="Workforce" 
                  value={workforce.length.toLocaleString()} 
                  trend="+8.4%" 
                  icon={<FiBriefcase />} 
                />
                <KpiCard 
                  title="Active Courses" 
                  value={courses.length.toString()} 
                  trend="+5.3%" 
                  icon={<FiBook />} 
                />
                <KpiCard 
                  title="Certificates" 
                  value={certificates.length.toLocaleString()} 
                  trend="+15.7%" 
                  icon={<FiAward />} 
                />
                <KpiCard 
                  title="Pending Approvals" 
                  value={pendingCourseRequests.filter(r => r.status === 'pending').length.toString()} 
                  trend="" 
                  icon={<FiClock />}
                  urgent={pendingCourseRequests.filter(r => r.status === 'pending').length > 0}
                />
              </div>

              {/* Dual List Column Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '35px' }}>
                
                {/* Recent Students Card */}
                <div style={{ background: '#FFFFFF', border: '1px solid #F3EBE1', borderRadius: '20px', padding: '24px', position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ margin: 0, fontSize: '16.5px', fontWeight: '850', color: '#1E1B18' }}>Recent Student Registrations</h3>
                    <button 
                      onClick={() => setActiveTab('students')}
                      style={{ background: 'none', border: 'none', color: '#F9572A', fontWeight: '800', fontSize: '13px', cursor: 'pointer' }}
                    >
                      View All
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {sortedStudents.slice(0, 5).map(student => (
                      <div 
                        key={student.id} 
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: '12px 0', borderBottom: '1px solid #FAF8F5', position: 'relative'
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: '750', color: '#1E1B18', fontSize: '13.5px' }}>{student.name}</div>
                          <div style={{ color: '#94A3B8', fontSize: '11px', fontWeight: '500' }}>{student.email}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                          <span style={{ fontSize: '12.5px', color: '#64748B', fontWeight: '600' }}>{formatDate(student.createdAt)}</span>
                          
                          {/* Row Menu Toggle */}
                          <button 
                            onClick={(e) => { e.stopPropagation(); setActiveRowMenu(activeRowMenu?.id === student.id ? null : { type: 'student', id: student.id }); }}
                            style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px' }}
                          >
                            <FiMoreVertical />
                          </button>

                          {activeRowMenu?.type === 'student' && activeRowMenu?.id === student.id && (
                            <div style={{
                              position: 'absolute', right: '10px', top: '35px', width: '130px', background: '#FFFFFF',
                              border: '1px solid #F3EBE1', borderRadius: '10px', zIndex: 70, padding: '4px',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                            }}>
                              <button 
                                onClick={() => toggleStudentStatus(student.id)}
                                style={{ width: '100%', padding: '6px 8px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '11.5px', fontWeight: '700', borderRadius: '6px', color: '#1E1B18' }}
                              >
                                {student.status === 'Active' ? 'Block Access' : 'Unblock'}
                              </button>
                              <button 
                                onClick={() => deleteStudent(student.id)}
                                style={{ width: '100%', padding: '6px 8px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '11.5px', fontWeight: '700', borderRadius: '6px', color: '#EF4444' }}
                              >
                                Delete User
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Workforce Card */}
                <div style={{ background: '#FFFFFF', border: '1px solid #F3EBE1', borderRadius: '20px', padding: '24px', position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ margin: 0, fontSize: '16.5px', fontWeight: '850', color: '#1E1B18' }}>Recent Workforce Registrations</h3>
                    <button 
                      onClick={() => setActiveTab('workforce')}
                      style={{ background: 'none', border: 'none', color: '#F9572A', fontWeight: '800', fontSize: '13px', cursor: 'pointer' }}
                    >
                      View All
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {sortedWorkforce.slice(0, 5).map(wf => (
                      <div 
                        key={wf.id} 
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: '12px 0', borderBottom: '1px solid #FAF8F5', position: 'relative'
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: '750', color: '#1E1B18', fontSize: '13.5px' }}>{wf.name}</div>
                          <div style={{ color: '#94A3B8', fontSize: '11px', fontWeight: '500' }}>{wf.email} ({wf.role})</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                          <span style={{ fontSize: '12.5px', color: '#64748B', fontWeight: '600' }}>{formatDate(wf.createdAt)}</span>
                          
                          {/* Row Menu Toggle */}
                          <button 
                            onClick={(e) => { e.stopPropagation(); setActiveRowMenu(activeRowMenu?.id === wf.id ? null : { type: 'workforce', id: wf.id }); }}
                            style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px' }}
                          >
                            <FiMoreVertical />
                          </button>

                          {activeRowMenu?.type === 'workforce' && activeRowMenu?.id === wf.id && (
                            <div style={{
                              position: 'absolute', right: '10px', top: '35px', width: '130px', background: '#FFFFFF',
                              border: '1px solid #F3EBE1', borderRadius: '10px', zIndex: 70, padding: '4px',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                            }}>
                              <button 
                                onClick={() => changeWorkforceStatus(wf.id, wf.status === 'Approved' ? 'Pending' : 'Approved')}
                                style={{ width: '100%', padding: '6px 8px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '11.5px', fontWeight: '700', borderRadius: '6px', color: '#1E1B18' }}
                              >
                                {wf.status === 'Approved' ? 'Put on Pending' : 'Approve Access'}
                              </button>
                              <button 
                                onClick={() => changeWorkforceStatus(wf.id, 'Rejected')}
                                style={{ width: '100%', padding: '6px 8px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '11.5px', fontWeight: '700', borderRadius: '6px', color: '#EF4444' }}
                              >
                                Reject Access
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Quick Actions Row */}
              <div>
                <h3 style={{ margin: '0 0 16px', fontSize: '16.5px', fontWeight: '850', color: '#1E1B18' }}>Quick Actions</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                  <QuickActionCard label="Add New Student" icon={<FiUserPlus />} onClick={() => setShowAddStudent(true)} />
                  <QuickActionCard label="Add New Workforce" icon={<FiPlusCircle />} onClick={() => setShowAddWorkforce(true)} />
                  <QuickActionCard label="Create Course" icon={<FiBook />} onClick={() => { setActiveTab('courses'); setShowAddCourse(true); }} />
                  <QuickActionCard 
                    label={`Review Approvals${pendingCourseRequests.filter(r => r.status === 'pending').length > 0 ? ` (${pendingCourseRequests.filter(r => r.status === 'pending').length})` : ''}`}
                    icon={<FiClock />} 
                    onClick={() => { setActiveTab('approvals'); refreshPendingRequests(); }}
                    highlight={pendingCourseRequests.filter(r => r.status === 'pending').length > 0}
                  />
                </div>
              </div>

            </div>
          )}

          {/* ─── VIEW 2: STUDENT MANAGEMENT ─── */}
          {activeTab === 'students' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                  <h2 style={{ margin: 0, fontWeight: '850', color: '#1E1B18' }}>Students Database</h2>
                  <p style={{ margin: '5px 0 0', color: '#64748B', fontSize: '14px' }}>Verify, approve access, or block student records.</p>
                </div>
                <button 
                  onClick={() => setShowAddStudent(true)}
                  style={{
                    background: '#F9572A', color: '#FFF', border: 'none', padding: '10px 18px',
                    borderRadius: '99px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px',
                    cursor: 'pointer', boxShadow: '0 4px 12px rgba(249, 87, 42, 0.2)'
                  }}
                >
                  <FiPlus /> Add Student
                </button>
              </div>

              <div style={{ background: '#FFFFFF', border: "1px solid #F3EBE1", borderRadius: '16px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: '#FAF8F5', color: '#64748B', fontSize: '11px', textTransform: 'uppercase', fontWeight: '800', borderBottom: '1px solid #F3EBE1' }}>
                      <th style={{ padding: '16px 20px' }}>ID</th>
                      <th style={{ padding: '16px 20px' }}>Name / Email</th>
                      <th style={{ padding: '16px 20px' }}>Courses Enrolled</th>
                      <th style={{ padding: '16px 20px' }}>Registration Date</th>
                      <th style={{ padding: '16px 20px' }}>Status</th>
                      <th style={{ padding: '16px 20px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedStudents
                      .map(u => (
                        <tr key={u.id} style={{ borderBottom: '1px solid #F3EBE1' }}>
                          <td style={{ padding: '16px 20px', color: '#94A3B8', fontWeight: '600' }}>#{u.id}</td>
                          <td style={{ padding: '16px 20px' }}>
                            <div style={{ fontWeight: '750', color: '#1E1B18' }}>{u.name}</div>
                            <div style={{ fontSize: '12px', color: '#64748B' }}>{u.email}</div>
                          </td>
                          <td style={{ padding: '16px 20px' }}>
                            <span style={{
                              background: getStudentEnrolledCount(u) > 0 ? '#ECFDF5' : '#F1F5F9',
                              color: getStudentEnrolledCount(u) > 0 ? '#10B981' : '#64748B',
                              padding: '4px 10px',
                              borderRadius: '12px',
                              fontSize: '11.5px',
                              fontWeight: '750'
                            }}>
                              {getStudentEnrolledCount(u)} course{getStudentEnrolledCount(u) === 1 ? '' : 's'}
                            </span>
                          </td>
                          <td style={{ padding: '16px 20px', color: '#64748B', fontWeight: '600' }}>{formatDate(u.createdAt)}</td>
                          <td style={{ padding: '16px 20px' }}>
                            <span style={{ 
                              background: u.status === 'Active' ? '#ECFDF5' : '#FEF2F2', 
                              color: u.status === 'Active' ? '#10B981' : '#EF4444', 
                              padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '750' 
                            }}>
                              {u.status}
                            </span>
                          </td>
                          <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                            <button onClick={() => toggleStudentStatus(u.id)} style={{
                              background: '#FFFFFF', border: '1px solid #E2E8F0', color: '#64748B',
                              padding: '6px 12px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', fontWeight: '700',
                              marginRight: '8px', transition: 'all 0.2s'
                            }}>
                              {u.status === 'Active' ? 'Block Access' : 'Unblock'}
                            </button>
                            <button onClick={() => deleteStudent(u.id)} style={{
                              background: '#FEF2F2', border: 'none', color: '#EF4444',
                              padding: '6px 12px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', fontWeight: '700'
                            }}>
                              Delete
                            </button>
                          </td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ─── VIEW 3: WORKFORCE MANAGEMENT ─── */}
          {activeTab === 'workforce' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                  <h2 style={{ margin: 0, fontWeight: '850', color: '#1E1B18' }}>Workforce Database</h2>
                  <p style={{ margin: '5px 0 0', color: '#64748B', fontSize: '14px' }}>Verify, approve status, or block trainers & managers.</p>
                </div>
                <button 
                  onClick={() => setShowAddWorkforce(true)}
                  style={{
                    background: '#F9572A', color: '#FFF', border: 'none', padding: '10px 18px',
                    borderRadius: '99px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px',
                    cursor: 'pointer', boxShadow: '0 4px 12px rgba(249, 87, 42, 0.2)'
                  }}
                >
                  <FiPlus /> Add Workforce
                </button>
              </div>

              <div style={{ background: '#FFFFFF', border: "1px solid #F3EBE1", borderRadius: '16px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: '#FAF8F5', color: '#64748B', fontSize: '11px', textTransform: 'uppercase', fontWeight: '800', borderBottom: '1px solid #F3EBE1' }}>
                      <th style={{ padding: '16px 20px' }}>ID</th>
                      <th style={{ padding: '16px 20px' }}>Name / Email</th>
                      <th style={{ padding: '16px 20px' }}>Role</th>
                      <th style={{ padding: '16px 20px' }}>Status</th>
                      <th style={{ padding: '16px 20px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedWorkforce
                      .map(w => (
                        <tr key={w.id} style={{ borderBottom: '1px solid #F3EBE1' }}>
                          <td style={{ padding: '16px 20px', color: '#94A3B8', fontWeight: '600' }}>#{w.id}</td>
                          <td style={{ padding: '16px 20px' }}>
                            <div style={{ fontWeight: '750', color: '#1E1B18' }}>{w.name}</div>
                            <div style={{ fontSize: '12px', color: '#64748B' }}>{w.email}</div>
                          </td>
                          <td style={{ padding: '16px 20px', color: '#F9572A', fontWeight: '700', fontSize: '13px' }}>{w.role}</td>
                          <td style={{ padding: '16px 20px' }}>
                            <span style={{ 
                              background: w.status === 'Approved' ? '#ECFDF5' : w.status === 'Rejected' ? '#FEF2F2' : '#FFFBEB', 
                              color: w.status === 'Approved' ? '#10B981' : w.status === 'Rejected' ? '#EF4444' : '#F59E0B', 
                              padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '750' 
                            }}>
                              {w.status}
                            </span>
                          </td>
                          <td style={{ padding: '16px 20px', textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                            {w.status !== 'Approved' && (
                              <button onClick={() => changeWorkforceStatus(w.id, 'Approved')} style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#10B981', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '700', fontSize: '12px' }}><FiCheck /> Approve</button>
                            )}
                            {w.status !== 'Rejected' && (
                              <button onClick={() => changeWorkforceStatus(w.id, 'Rejected')} style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#EF4444', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '700', fontSize: '12px' }}><FiX /> Reject</button>
                            )}
                          </td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ─── VIEW 4: COURSE MANAGEMENT ─── */}
          {activeTab === 'courses' && (
            <CourseManagement 
              courses={courses} 
              addCourse={addCourse} 
              updateCourse={updateCourse} 
              deleteCourse={deleteCourse} 
              pendingCourseRequests={pendingCourseRequests}
              users={users}
              workforce={workforce}
              allRegisteredUsers={allRegisteredUsers}
              getCourseEnrolledStudents={getCourseEnrolledStudents}
              editingCourse={editingCourse}
              setEditingCourse={setEditingCourse}
              showAddCourse={showAddCourse}
              setShowAddCourse={setShowAddCourse}
            />
          )}

          {/* ─── VIEW 4B: COURSE PENDING APPROVALS ─── */}
          {activeTab === 'approvals' && (
            <CourseApprovalsView
              requests={pendingCourseRequests}
              onApprove={approveCourseRequest}
              onReject={rejectCourseRequest}
              onRefresh={refreshPendingRequests}
              formatDate={formatDate}
            />
          )}

          {/* ─── VIEW 4C: WORKFORCE LEAVE APPROVALS ─── */}
          {activeTab === 'leaveApprovals' && (
            <LeaveApprovalsView
              requests={leaveRequests || []}
              onApprove={approveLeaveRequest}
              onReject={rejectLeaveRequest}
              onRefresh={refreshLeaveRequests}
              formatDate={formatDate}
            />
          )}

          {/* ─── VIEW 5: CERTIFICATIONS ─── */}
          {activeTab === 'certifications' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                  <h2 style={{ margin: 0, fontWeight: '850', color: '#1E1B18' }}>Certifications Directory</h2>
                  <p style={{ margin: '5px 0 0', color: '#64748B', fontSize: '14px' }}>Issue manual accomplishments or verify credential signatures.</p>
                </div>
                <button 
                  onClick={() => setShowIssueCert(true)}
                  style={{
                    background: '#F9572A', color: '#FFF', border: 'none', padding: '10px 18px',
                    borderRadius: '99px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px',
                    cursor: 'pointer', boxShadow: '0 4px 12px rgba(249, 87, 42, 0.2)'
                  }}
                >
                  <FiAward /> Issue Certificate
                </button>
              </div>

              <div style={{ background: '#FFFFFF', border: "1px solid #F3EBE1", borderRadius: '16px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: '#FAF8F5', color: '#64748B', fontSize: '11px', textTransform: 'uppercase', fontWeight: '800', borderBottom: '1px solid #F3EBE1' }}>
                      <th style={{ padding: '16px 20px' }}>Verification Code</th>
                      <th style={{ padding: '16px 20px' }}>Student Details</th>
                      <th style={{ padding: '16px 20px' }}>Course Title</th>
                      <th style={{ padding: '16px 20px' }}>Issued Date</th>
                      <th style={{ padding: '16px 20px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {certificates
                      .map(c => (
                        <tr key={c.id} style={{ borderBottom: '1px solid #F3EBE1' }}>
                          <td style={{ padding: '16px 20px', color: '#F9572A', fontWeight: '800', fontSize: '13px' }}>{c.verificationCode}</td>
                          <td style={{ padding: '16px 20px' }}>
                            <div style={{ fontWeight: '750', color: '#1E1B18' }}>{c.studentName}</div>
                            <div style={{ fontSize: '11px', color: '#64748B' }}>{c.studentEmail}</div>
                          </td>
                          <td style={{ padding: '16px 20px', fontWeight: '700', color: '#1E1B18' }}>{c.title}</td>
                          <td style={{ padding: '16px 20px', color: '#64748B', fontWeight: '600' }}>{formatDate(c.issuedAt)}</td>
                          <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                            <button onClick={() => deleteCertificate(c.id)} style={{
                              background: '#FFF0ED', border: 'none', color: '#F9572A',
                              padding: '6px 12px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', fontWeight: '700'
                            }}>
                              Revoke
                            </button>
                          </td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ─── VIEW 6: REPORTS & ANALYTICS ─── */}
          {activeTab === 'reports' && (
            <div>
              <h2 style={{ margin: '0 0 6px', fontWeight: '850', color: '#1E1B18' }}>Platform Performance Report</h2>
              <p style={{ margin: '0 0 30px', color: '#64748B', fontSize: '14.5px' }}>Track student metrics, active engagement rate, and learning stats.</p>

              {/* SVG Charts visual mockup */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px', marginBottom: '35px' }}>
                {/* Registration chart */}
                <div style={{ background: '#FFFFFF', border: '1px solid #F3EBE1', borderRadius: '20px', padding: '24px' }}>
                  <h3 style={{ margin: '0 0 20px', fontSize: '16px', fontWeight: '850' }}>Weekly Student Enrollments</h3>
                  <div style={{ height: '240px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '20px 10px 0' }}>
                    <ChartBar label="Mon" height="40%" val="12" />
                    <ChartBar label="Tue" height="55%" val="18" />
                    <ChartBar label="Wed" height="85%" val="28" />
                    <ChartBar label="Thu" height="70%" val="23" />
                    <ChartBar label="Fri" height="95%" val="32" highlight />
                    <ChartBar label="Sat" height="30%" val="10" />
                    <ChartBar label="Sun" height="45%" val="15" />
                  </div>
                </div>

                {/* Course Breakdown categories */}
                <div style={{ background: '#FFFFFF', border: '1px solid #F3EBE1', borderRadius: '20px', padding: '24px' }}>
                  <h3 style={{ margin: '0 0 20px', fontSize: '16px', fontWeight: '850' }}>Popular Tracks</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <ProgressTrack name="Frontend Development" pct={75} count="350 students" color="#F9572A" />
                    <ProgressTrack name="Backend Engineering" pct={58} count="270 students" color="#475569" />
                    <ProgressTrack name="Data Structures & Algorithms" pct={92} count="430 students" color="#10B981" />
                    <ProgressTrack name="Machine Learning / AI" pct={40} count="180 students" color="#F59E0B" />
                  </div>
                </div>
              </div>

              {/* Engagement metrics */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                <AnalyticsBox title="Active Completion Rate" val="82.4%" sub="12% increase vs past month" icon={<FiActivity color="#10B981" />} />
                <AnalyticsBox title="Average Course Rating" val="4.82 ★" sub="Based on 5.4K student reviews" icon={<FiAward color="#F59E0B" />} />
                <AnalyticsBox title="Monthly Active Users (MAU)" val="9,820" sub="84% login frequency rate" icon={<FiUsers color="#F9572A" />} />
              </div>
            </div>
          )}

          {/* ─── VIEW 8: SERVICE BOOKINGS MANAGEMENT ─── */}
          {activeTab === 'serviceBookings' && (
            <div style={{ background: '#FFFFFF', borderRadius: '24px', padding: '28px', border: '1px solid #F3EBE1', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <h2 style={{ margin: 0, fontWeight: '850', color: '#1E1B18', fontSize: '22px' }}>Student Service Bookings 📅</h2>
                  <p style={{ margin: '4px 0 0', color: '#64748B', fontSize: '14px' }}>
                    Live bookings for 1-on-1 Mentorship, Mock Interviews, Resume Reviews, and Code Audits.
                  </p>
                </div>
                <button 
                  onClick={refreshServiceBookings}
                  style={{
                    padding: '10px 18px', borderRadius: '99px', background: '#FFF0EB', color: '#F9572A',
                    border: '1px solid #FAD6C8', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px'
                  }}
                >
                  <FiRefreshCw /> Refresh Bookings List
                </button>
              </div>

              <div style={{ border: '1px solid #F3EBE1', borderRadius: '16px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: '#FAF8F5', color: '#64748B', fontSize: '11px', textTransform: 'uppercase', fontWeight: '800', borderBottom: '1px solid #F3EBE1' }}>
                      <th style={{ padding: '14px 18px' }}>Student</th>
                      <th style={{ padding: '14px 18px' }}>Service Booked</th>
                      <th style={{ padding: '14px 18px' }}>Price (INR)</th>
                      <th style={{ padding: '14px 18px' }}>Scheduled Slot</th>
                      <th style={{ padding: '14px 18px' }}>Status</th>
                      <th style={{ padding: '14px 18px', textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminServiceBookings.length === 0 ? (
                      <tr>
                        <td colSpan="6" style={{ padding: '30px', textAlign: 'center', color: '#64748B', fontSize: '14px' }}>
                          No student service bookings registered yet.
                        </td>
                      </tr>
                    ) : (
                      adminServiceBookings.map((b) => (
                        <tr key={b.id} style={{ borderBottom: '1px solid #F3EBE1', fontSize: '13.5px' }}>
                          <td style={{ padding: '14px 18px' }}>
                            <div style={{ fontWeight: '800', color: '#1E1B18' }}>{b.studentName}</div>
                            <div style={{ fontSize: '11px', color: '#64748B' }}>{b.studentEmail}</div>
                          </td>
                          <td style={{ padding: '14px 18px', fontWeight: '750', color: '#1E1B18' }}>
                            {b.serviceTitle}
                          </td>
                          <td style={{ padding: '14px 18px', color: '#F9572A', fontWeight: '850', fontSize: '14px' }}>
                            {b.price}
                          </td>
                          <td style={{ padding: '14px 18px', color: '#1E1B18' }}>
                            📅 <strong>{b.date}</strong> at <strong>{b.time}</strong>
                          </td>
                          <td style={{ padding: '14px 18px' }}>
                            <span style={{
                              padding: '4px 12px', borderRadius: '99px', fontSize: '11px', fontWeight: '800',
                              background: b.status === 'completed' ? '#ECFDF5' : '#FEF3C7',
                              color: b.status === 'completed' ? '#10B981' : '#D97706'
                            }}>
                              {b.status === 'completed' ? '✓ Completed' : '● Scheduled'}
                            </span>
                          </td>
                          <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                            {b.status !== 'completed' ? (
                              <button 
                                onClick={() => {
                                  const updated = adminServiceBookings.map(item => item.id === b.id ? { ...item, status: 'completed' } : item);
                                  setAdminServiceBookings(updated);
                                  localStorage.setItem("skillsphere_admin_service_bookings", JSON.stringify(updated));
                                  window.dispatchEvent(new CustomEvent("skillsphere_sync_event"));
                                }}
                                style={{
                                  padding: '6px 14px', borderRadius: '8px', background: '#10B981', color: '#FFFFFF',
                                  border: 'none', cursor: 'pointer', fontWeight: '800', fontSize: '12px'
                                }}
                              >
                                Mark Completed
                              </button>
                            ) : (
                              <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: '600' }}>Done</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ─── VIEW 7: SETTINGS PANEL ─── */}
          {activeTab === 'settings' && <SettingsPanel />}

        </main>
      </div>

      {/* ─── MODALS ─── */}

      {/* 1. Add Student Modal */}
      {showAddStudent && (
        <ModalWrapper title="Add New Student" onClose={() => setShowAddStudent(false)}>
          <StudentForm onSubmit={(data) => {
            addStudent(data);
            setShowAddStudent(false);
          }} onClose={() => setShowAddStudent(false)} />
        </ModalWrapper>
      )}

      {/* 2. Add Workforce Modal */}
      {showAddWorkforce && (
        <ModalWrapper title="Add New Workforce Member" onClose={() => setShowAddWorkforce(false)}>
          <WorkforceForm onSubmit={(data) => {
            addWorkforce(data);
            setShowAddWorkforce(false);
          }} onClose={() => setShowAddWorkforce(false)} />
        </ModalWrapper>
      )}

      {/* 3. Issue Certificate Modal */}
      {showIssueCert && (
        <ModalWrapper title="Issue Certificate" onClose={() => setShowIssueCert(false)}>
          <IssueCertForm students={users} courses={courses} onSubmit={(data) => {
            addCertificate(data);
            setShowIssueCert(false);
          }} onClose={() => setShowIssueCert(false)} />
        </ModalWrapper>
      )}

      {/* 4. Generate Report Modal */}
      {showReport && (
        <ModalWrapper title="Generate System Report" onClose={() => setShowReport(false)}>
          <ReportDialog stats={{
            students: users.length,
            workforce: workforce.length,
            courses: courses.length,
            certificates: certificates.length
          }} onClose={() => setShowReport(false)} />
        </ModalWrapper>
      )}

    </div>
  );
}

// ─── HELPER COMPONENTS ───

// Sidebar Navigation Button
function SidebarBtn({ icon, label, hasChevron, active, onClick, badge }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', justifyItems: 'center', gap: '12px', padding: '12px 16px',
      background: active ? '#FFF0EB' : 'transparent',
      border: 'none', borderLeft: active ? '3px solid #F9572A' : '3px solid transparent',
      color: active ? '#F9572A' : '#64748B', borderRadius: '0 10px 10px 0',
      cursor: 'pointer', fontSize: '14.5px', fontWeight: active ? '800' : '600',
      transition: 'all 0.2s', width: '100%', textAlign: 'left'
    }}>
      <span style={{ fontSize: '18px', display: 'flex', alignItems: 'center' }}>{icon}</span>
      <span style={{ flex: 1 }}>{label}</span>
      {badge > 0 && (
        <span style={{
          background: '#F9572A', color: '#FFF', fontSize: '10px', fontWeight: '800',
          borderRadius: '999px', padding: '2px 6px', minWidth: '18px', textAlign: 'center'
        }}>{badge}</span>
      )}
      {hasChevron && <span style={{ fontSize: '12px', opacity: 0.6 }}>›</span>}
    </button>
  );
}

// ── Course Approvals View Component ──
function CourseApprovalsView({ requests, onApprove, onReject, onRefresh, formatDate }) {
  const [filterStatus, setFilterStatus] = React.useState('pending');

  const filtered = requests.filter(r => {
    if (filterStatus === 'all') return true;
    return r.status === filterStatus;
  });

  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const approvedCount = requests.filter(r => r.status === 'approved').length;
  const rejectedCount = requests.filter(r => r.status === 'rejected').length;

  const statusStyle = (status) => {
    if (status === 'approved') return { background: '#ECFDF5', color: '#10B981' };
    if (status === 'rejected') return { background: '#FEF2F2', color: '#EF4444' };
    return { background: '#FFFBEB', color: '#F59E0B' };
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2 style={{ margin: 0, fontWeight: '850', color: '#1E1B18' }}>Course Enrollment Approvals</h2>
          <p style={{ margin: '5px 0 0', color: '#64748B', fontSize: '14px' }}>Review and approve or reject student course enrollment requests.</p>
        </div>
        <button
          onClick={onRefresh}
          style={{
            background: '#FFFFFF', border: '1px solid #F3EBE1', padding: '10px 18px',
            borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px',
            fontSize: '13.5px', fontWeight: '750', color: '#1E1B18', cursor: 'pointer'
          }}
        >
          <FiRefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', marginBottom: '28px' }}>
        {[
          { label: 'Pending', count: pendingCount, color: '#F59E0B', bg: '#FFFBEB', filter: 'pending' },
          { label: 'Approved', count: approvedCount, color: '#10B981', bg: '#ECFDF5', filter: 'approved' },
          { label: 'Rejected', count: rejectedCount, color: '#EF4444', bg: '#FEF2F2', filter: 'rejected' },
        ].map(stat => (
          <button
            key={stat.filter}
            onClick={() => setFilterStatus(stat.filter)}
            style={{
              background: filterStatus === stat.filter ? stat.bg : '#FFFFFF',
              border: `1px solid ${filterStatus === stat.filter ? stat.color : '#F3EBE1'}`,
              borderRadius: '16px', padding: '18px 22px', display: 'flex', alignItems: 'center',
              gap: '14px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s'
            }}
          >
            <div style={{ fontSize: '26px', fontWeight: '850', color: stat.color }}>{stat.count}</div>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#64748B' }}>{stat.label}</div>
          </button>
        ))}
      </div>

      {/* Filter Pills */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        {['all', 'pending', 'approved', 'rejected'].map(f => (
          <button
            key={f}
            onClick={() => setFilterStatus(f)}
            style={{
              padding: '6px 16px', borderRadius: '99px', fontSize: '12.5px', fontWeight: '700', cursor: 'pointer',
              background: filterStatus === f ? '#F9572A' : '#FFFFFF',
              color: filterStatus === f ? '#FFFFFF' : '#64748B',
              border: filterStatus === f ? 'none' : '1px solid #E2E8F0',
              textTransform: 'capitalize'
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: '#FFFFFF', border: '1px solid #F3EBE1', borderRadius: '16px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#FAF8F5', color: '#64748B', fontSize: '11px', textTransform: 'uppercase', fontWeight: '800', borderBottom: '1px solid #F3EBE1' }}>
              <th style={{ padding: '16px 20px' }}>Request ID</th>
              <th style={{ padding: '16px 20px' }}>Student</th>
              <th style={{ padding: '16px 20px' }}>Course</th>
              <th style={{ padding: '16px 20px' }}>Fee</th>
              <th style={{ padding: '16px 20px' }}>Date</th>
              <th style={{ padding: '16px 20px' }}>Status</th>
              <th style={{ padding: '16px 20px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#94A3B8', fontWeight: '600' }}>
                  {filterStatus === 'pending' ? '🎉 No pending approvals at this time.' : `No ${filterStatus} requests found.`}
                </td>
              </tr>
            ) : (
              filtered.map(req => (
                <tr key={req.id} style={{ borderBottom: '1px solid #F3EBE1' }}>
                  <td style={{ padding: '16px 20px', color: '#F9572A', fontWeight: '800', fontSize: '12px' }}>{req.id}</td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ fontWeight: '750', color: '#1E1B18', fontSize: '13.5px' }}>{req.studentName}</div>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>{req.studentEmail}</div>
                  </td>
                  <td style={{ padding: '16px 20px', fontWeight: '700', color: '#1E1B18', fontSize: '13px', maxWidth: '200px' }}>
                    {req.courseTitle}
                    <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '500', marginTop: '2px' }}>Course ID: {req.courseId}</div>
                  </td>
                  <td style={{ padding: '16px 20px', color: '#10B981', fontWeight: '800', fontSize: '13px' }}>{req.fee || '-'}</td>
                  <td style={{ padding: '16px 20px', color: '#64748B', fontWeight: '600', fontSize: '12px' }}>{req.requestDate || formatDate(null)}</td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{
                      ...statusStyle(req.status), padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '750', textTransform: 'capitalize'
                    }}>
                      {req.status === 'pending' ? '⏳ Pending' : req.status === 'approved' ? '✅ Approved' : '❌ Rejected'}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    {req.status === 'pending' && (
                      <>
                        <button
                          onClick={() => onApprove(req.id)}
                          style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#10B981', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '700', fontSize: '12px' }}
                        >
                          <FiCheck /> Approve
                        </button>
                        <button
                          onClick={() => onReject(req.id)}
                          style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#EF4444', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '700', fontSize: '12px' }}
                        >
                          <FiX /> Reject
                        </button>
                      </>
                    )}
                    {req.status !== 'pending' && (
                      <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: '600' }}>No actions</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// KPI Statistic Card
function KpiCard({ title, value, trend, icon, urgent }) {
  return (
    <div style={{
      background: urgent ? 'linear-gradient(135deg, #FFFBEB, #FFF7E0)' : '#FFFFFF',
      border: urgent ? '1px solid #FCD34D' : '1px solid #F3EBE1',
      borderRadius: '20px', padding: '20px',
      display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.01)',
      position: 'relative'
    }}>
      <div style={{
        width: '48px', height: '48px', borderRadius: '50%',
        background: urgent ? '#FEF3C7' : '#FFF0EB',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: urgent ? '#F59E0B' : '#F9572A',
        fontSize: '20px'
      }}>
        {icon}
      </div>
      <div>
        <div style={{ color: '#64748B', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{title}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginTop: '4px' }}>
          <span style={{ fontSize: '22px', fontWeight: '850', color: urgent ? '#D97706' : '#1E1B18' }}>{value}</span>
          {trend && <span style={{ fontSize: '12px', color: '#10B981', fontWeight: '750' }}>{trend}</span>}
        </div>
        <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px', fontWeight: '500' }}>
          {urgent && parseInt(value) > 0 ? '⚠️ Needs attention' : trend ? 'from last month' : 'All time total'}
        </div>
      </div>
    </div>
  );
}

// Quick Action Card
function QuickActionCard({ label, icon, onClick, highlight }) {
  return (
    <button 
      onClick={onClick}
      style={{
        background: highlight ? 'linear-gradient(135deg, #FFF5F2, #FFFBF9)' : '#FFFFFF',
        border: highlight ? '1px solid #FFCAB4' : '1px solid #F3EBE1',
        borderRadius: '16px', padding: '20px',
        display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer', transition: 'all 0.2s',
        boxShadow: highlight ? '0 4px 16px rgba(249, 87, 42, 0.08)' : '0 4px 16px rgba(0,0,0,0.01)',
        textAlign: 'left', width: '100%', outline: 'none'
      }}
      onMouseEnter={(e) => e.currentTarget.style.border = '1px solid #FFE2D8'}
      onMouseLeave={(e) => e.currentTarget.style.border = highlight ? '1px solid #FFCAB4' : '1px solid #F3EBE1'}
    >
      <div style={{
        width: '42px', height: '42px', borderRadius: '10px',
        background: highlight ? '#F9572A' : '#FFF0EB',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: highlight ? '#FFFFFF' : '#F9572A', fontSize: '18px'
      }}>
        {icon}
      </div>
      <span style={{ fontWeight: '800', fontSize: '14px', color: '#1E1B18' }}>{label}</span>
    </button>
  );
}

// Modal Container Wrapper
function ModalWrapper({ title, onClose, children }) {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(30, 27, 24, 0.4)',
      zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        background: '#FFFFFF', border: '1px solid #F3EBE1', borderRadius: '24px',
        width: '480px', padding: '30px', boxShadow: '0 15px 50px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '850', color: '#1E1B18' }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', fontSize: '20px' }}><FiX /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── FORM COMPONENTS ───

const inputStyle = {
  width: '100%', padding: '12px 14px', background: '#FFFFFF', border: '1px solid #E2E8F0',
  borderRadius: '10px', color: '#1E1B18', fontSize: '14px', outline: 'none', marginTop: '6px'
};

const labelStyle = {
  fontSize: '12.5px', fontWeight: '750', color: '#64748B'
};

function StudentForm({ onSubmit, onClose }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    onSubmit({ name, email });
  };

  return (
    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <div>
        <label style={labelStyle}>Full Name</label>
        <input required placeholder="e.g. Aarav Sharma" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
      </div>
      <div>
        <label style={labelStyle}>Email Address</label>
        <input type="email" required placeholder="e.g. aarav@example.com" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
      </div>
      <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
        <button type="button" onClick={onClose} style={{ flex: 1, padding: '12px', background: '#FAF8F5', border: '1px solid #E2E8F0', color: '#64748B', borderRadius: '10px', cursor: 'pointer', fontWeight: '700' }}>Cancel</button>
        <button type="submit" style={{ flex: 1, padding: '12px', background: '#F9572A', border: 'none', color: '#FFFFFF', borderRadius: '10px', fontWeight: '800', cursor: 'pointer' }}>Register Student</button>
      </div>
    </form>
  );
}

function WorkforceForm({ onSubmit, onClose }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('EMPLOYEE');

  const handleSave = (e) => {
    e.preventDefault();
    onSubmit({ name, email, role });
  };

  return (
    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <div>
        <label style={labelStyle}>Full Name</label>
        <input required placeholder="e.g. Neha Singh" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
      </div>
      <div>
        <label style={labelStyle}>Email Address</label>
        <input type="email" required placeholder="e.g. neha@skillsphere.com" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
      </div>
      <div>
        <label style={labelStyle}>Workforce Role</label>
        <select value={role} onChange={e => setRole(e.target.value)} style={inputStyle}>
          <option value="EMPLOYEE">Trainer / Employee</option>
          <option value="MANAGER">Manager</option>
        </select>
      </div>
      <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
        <button type="button" onClick={onClose} style={{ flex: 1, padding: '12px', background: '#FAF8F5', border: '1px solid #E2E8F0', color: '#64748B', borderRadius: '10px', cursor: 'pointer', fontWeight: '700' }}>Cancel</button>
        <button type="submit" style={{ flex: 1, padding: '12px', background: '#F9572A', border: 'none', color: '#FFFFFF', borderRadius: '10px', fontWeight: '800', cursor: 'pointer' }}>Register Member</button>
      </div>
    </form>
  );
}

function IssueCertForm({ students, courses, onSubmit, onClose }) {
  const [student, setStudent] = useState(students[0] ? `${students[0].name}|${students[0].email}` : '');
  const [course, setCourse] = useState(courses[0] ? courses[0].title : '');

  const handleSave = (e) => {
    e.preventDefault();
    const [studentName, studentEmail] = student.split('|');
    onSubmit({ studentName, studentEmail, title: course });
  };

  return (
    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <div>
        <label style={labelStyle}>Select Student</label>
        <select value={student} onChange={e => setStudent(e.target.value)} style={inputStyle}>
          {students.map(s => (
            <option key={s.id} value={`${s.name}|${s.email}`}>{s.name} ({s.email})</option>
          ))}
        </select>
      </div>
      <div>
        <label style={labelStyle}>Select Course</label>
        <select value={course} onChange={e => setCourse(e.target.value)} style={inputStyle}>
          {courses.map(c => (
            <option key={c.id} value={c.title}>{c.title}</option>
          ))}
        </select>
      </div>
      <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
        <button type="button" onClick={onClose} style={{ flex: 1, padding: '12px', background: '#FAF8F5', border: '1px solid #E2E8F0', color: '#64748B', borderRadius: '10px', cursor: 'pointer', fontWeight: '700' }}>Cancel</button>
        <button type="submit" style={{ flex: 1, padding: '12px', background: '#F9572A', border: 'none', color: '#FFFFFF', borderRadius: '10px', fontWeight: '800', cursor: 'pointer' }}>Issue Accomplishment</button>
      </div>
    </form>
  );
}

function ReportDialog({ stats, onClose }) {
  const downloadCsv = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Metric,Count\n"
      + `Total Students,${stats.students}\n`
      + `Total Workforce,${stats.workforce}\n`
      + `Active Courses,${stats.courses}\n`
      + `Certifications Issued,${stats.certificates}\n`
      + `Generated Timestamp,${new Date().toISOString()}\n`;
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `skillsphere_system_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <p style={{ margin: 0, fontSize: '14px', color: '#64748B' }}>Here is a summary of the metrics which will be exported to a CSV spreadsheet:</p>
      
      <div style={{ background: '#FAF8F5', border: '1px solid #F3EBE1', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px' }}>
          <span style={{ fontWeight: '700', color: '#64748B' }}>Total Students:</span>
          <span style={{ fontWeight: '800', color: '#1E1B18' }}>{stats.students}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px' }}>
          <span style={{ fontWeight: '700', color: '#64748B' }}>Total Workforce:</span>
          <span style={{ fontWeight: '800', color: '#1E1B18' }}>{stats.workforce}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px' }}>
          <span style={{ fontWeight: '700', color: '#64748B' }}>Active Courses:</span>
          <span style={{ fontWeight: '800', color: '#1E1B18' }}>{stats.courses}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px' }}>
          <span style={{ fontWeight: '700', color: '#64748B' }}>Certifications Issued:</span>
          <span style={{ fontWeight: '800', color: '#1E1B18' }}>{stats.certificates}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
        <button type="button" onClick={onClose} style={{ flex: 1, padding: '12px', background: '#FAF8F5', border: '1px solid #E2E8F0', color: '#64748B', borderRadius: '10px', cursor: 'pointer', fontWeight: '700' }}>Close</button>
        <button type="button" onClick={downloadCsv} style={{ flex: 1, padding: '12px', background: '#10B981', border: 'none', color: '#FFFFFF', borderRadius: '10px', fontWeight: '800', cursor: 'pointer' }}>Export to CSV</button>
      </div>
    </div>
  );
}

// ─── ANALYTICS CHART ELEMENTS ───

function ChartBar({ label, height, val, highlight }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, height: '100%' }}>
      <span style={{ fontSize: '11px', fontWeight: '750', color: highlight ? '#F9572A' : '#64748B', marginBottom: '6px' }}>{val}</span>
      <div style={{
        width: '28px', height: height,
        background: highlight ? 'linear-gradient(180deg, #FF6B4A, #F9572A)' : '#E2E8F0',
        borderRadius: '6px 6px 0 0', transition: 'height 0.8s ease'
      }} />
      <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748B', marginTop: '8px' }}>{label}</span>
    </div>
  );
}

function ProgressTrack({ name, pct, count, color }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px', fontWeight: '700' }}>
        <span style={{ color: '#1E1B18' }}>{name}</span>
        <span style={{ color: '#64748B' }}>{count}</span>
      </div>
      <div style={{ height: '8px', background: '#FAF8F5', border: '1px solid #F3EBE1', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: '4px' }} />
      </div>
    </div>
  );
}

// Course Management Sub-Tab implementation
function CourseManagement(props) {
  const adminCtx = useAdmin();
  const courses = props.courses ?? adminCtx.courses ?? [];
  const addCourse = props.addCourse ?? adminCtx.addCourse;
  const updateCourse = props.updateCourse ?? adminCtx.updateCourse;
  const deleteCourse = props.deleteCourse ?? adminCtx.deleteCourse;
  const pendingCourseRequests = props.pendingCourseRequests ?? adminCtx.pendingCourseRequests ?? [];
  const users = props.users ?? adminCtx.users ?? [];
  const workforce = props.workforce ?? adminCtx.workforce ?? [];
  const allRegisteredUsers = props.allRegisteredUsers ?? adminCtx.allRegisteredUsers ?? [];
  const getCourseEnrolledStudents = props.getCourseEnrolledStudents ?? adminCtx.getCourseEnrolledStudents;
  const editingCourse = props.editingCourse;
  const setEditingCourse = props.setEditingCourse;
  const showAddCourse = props.showAddCourse;
  const setShowAddCourse = props.setShowAddCourse;

  const [selectedEnrolledCourse, setSelectedEnrolledCourse] = useState(null);

  // If the parent opened the modal externally (e.g. Quick Action), initialize a blank course
  React.useEffect(() => {
    if (showAddCourse && !editingCourse) {
      setEditingCourse({
        title: '', description: '', image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop',
        isPremium: false, price: 0, category: 'General', language: 'English'
      });
    }
  }, [showAddCourse]);

  const handleOpenForm = (course = null) => {
    if (course) {
      setEditingCourse(course);
    } else {
      setEditingCourse({
        title: '', description: '', image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop', 
        isPremium: false, price: 0, category: 'General', language: 'English'
      });
    }
    setShowAddCourse(true);
  };


  const handleSave = async (e) => {
    e.preventDefault();
    if (editingCourse.id) {
      await updateCourse(editingCourse.id, editingCourse);
    } else {
      await addCourse(editingCourse);
    }
    setShowAddCourse(false);
    setEditingCourse(null);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2 style={{ margin: 0, fontWeight: '850', color: '#1E1B18' }}>Course Catalog</h2>
          <p style={{ margin: '5px 0 0', color: '#64748B', fontSize: '14px' }}>Add new training programs, modify properties, or remove records.</p>
        </div>
        <button onClick={() => handleOpenForm()} style={{
          background: '#F9572A', color: '#FFFFFF', border: 'none',
          padding: '10px 18px', borderRadius: '99px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px',
          cursor: 'pointer', boxShadow: '0 4px 12px rgba(249, 87, 42, 0.2)'
        }}>
          <FiPlus /> Add Course
        </button>
      </div>

      <div style={{ background: '#FFFFFF', border: "1px solid #F3EBE1", borderRadius: '16px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#FAF8F5', color: '#64748B', fontSize: '11px', textTransform: 'uppercase', fontWeight: '800', borderBottom: '1px solid #F3EBE1' }}>
              <th style={{ padding: '16px 20px' }}>Course</th>
              <th style={{ padding: '16px 20px' }}>Type</th>
              <th style={{ padding: '16px 20px' }}>Price</th>
              <th style={{ padding: '16px 20px' }}>Enrollments</th>
              <th style={{ padding: '16px 20px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses
              .map(course => {
                const candidateLearners = [
                  ...(allRegisteredUsers && allRegisteredUsers.length > 0 ? allRegisteredUsers : []),
                  ...(users || []),
                  ...(workforce || [])
                ];
                const { totalEnrolled, enrolledStudents, pendingCount } = getCourseEnrolledStudents
                  ? getCourseEnrolledStudents(course, candidateLearners, pendingCourseRequests)
                  : { totalEnrolled: 0, enrolledStudents: [], pendingCount: 0 };

                return (
                <tr key={course.id} style={{ borderBottom: '1px solid #F3EBE1' }}>
                  <td style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <img src={course.image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop'} alt="" style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '6px' }} />
                    <div>
                      <div style={{ fontWeight: '750', color: '#1E1B18', fontSize: '13.5px' }}>{course.title}</div>
                      <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '500' }}>{course.language || 'English'} • {course.rating || '4.8'} ⭐</div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    {course.isPremium ? 
                      <span style={{ background: '#FFFBEB', color: '#F59E0B', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '750' }}>👑 Premium</span> 
                      : <span style={{ background: '#ECFDF5', color: '#10B981', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '750' }}>Free</span>}
                  </td>
                  <td style={{ padding: '16px 20px', color: '#F9572A', fontWeight: '800', fontSize: '14px' }}>
                    {course.isPremium ? `₹${course.price}` : 'Free'}
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <span 
                        style={{ 
                          fontSize: '13.5px', 
                          fontWeight: '850', 
                          color: totalEnrolled > 0 ? '#10B981' : '#64748B',
                          cursor: totalEnrolled > 0 ? 'pointer' : 'default',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                        title={totalEnrolled > 0 ? enrolledStudents.map(s => `${s.name} (${s.email})`).join('\n') : 'No registered learners enrolled yet'}
                        onClick={() => {
                          if (totalEnrolled > 0) {
                            setSelectedEnrolledCourse({ course, students: enrolledStudents });
                          }
                        }}
                      >
                        {totalEnrolled} enrolled
                        {totalEnrolled > 0 && (
                          <span style={{ fontSize: '11px', color: '#10B981', opacity: 0.8, textDecoration: 'underline' }}>(view)</span>
                        )}
                      </span>
                      {pendingCount > 0 && (
                        <span style={{ fontSize: '11px', fontWeight: '750', color: '#F59E0B' }}>⏳ {pendingCount} pending approval</span>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    <button onClick={() => handleOpenForm(course)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', marginRight: '15px' }}><FiEdit size={16} /></button>
                    <button onClick={() => deleteCourse(course.id)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}><FiTrash2 size={16} /></button>
                  </td>
                </tr>
              )})}
          </tbody>
        </table>
      </div>

      {/* Enrolled Learners Details Modal */}
      {selectedEnrolledCourse && (
        <ModalWrapper 
          title={`Enrolled Learners: ${selectedEnrolledCourse.course?.title}`} 
          onClose={() => setSelectedEnrolledCourse(null)}
        >
          <div style={{ maxHeight: '420px', overflowY: 'auto' }}>
            <p style={{ margin: '0 0 14px', fontSize: '13.5px', color: '#64748B' }}>
              Total of <strong style={{ color: '#10B981' }}>{selectedEnrolledCourse.students?.length}</strong> registered learner(s) currently enrolled in this program:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {selectedEnrolledCourse.students?.map((stu, idx) => (
                <div 
                  key={stu.id || idx} 
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    padding: '11px 15px', 
                    background: '#FAF8F5', 
                    borderRadius: '10px', 
                    border: '1px solid #F3EBE1' 
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '750', fontSize: '13.5px', color: '#1E1B18' }}>{stu.name}</div>
                    <div style={{ fontSize: '11.5px', color: '#64748B' }}>{stu.email}</div>
                  </div>
                  <span style={{ 
                    fontSize: '11px', 
                    fontWeight: '750', 
                    background: (stu.role || '').toUpperCase() === 'STUDENT' ? '#EFF6FF' : '#FEF3C7', 
                    color: (stu.role || '').toUpperCase() === 'STUDENT' ? '#2563EB' : '#D97706', 
                    padding: '4px 10px', 
                    borderRadius: '12px' 
                  }}>
                    {stu.role || 'STUDENT'}
                  </span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setSelectedEnrolledCourse(null)}
                style={{ 
                  padding: '9px 18px', 
                  background: '#F9572A', 
                  color: '#FFFFFF', 
                  border: 'none', 
                  borderRadius: '8px', 
                  fontWeight: '750', 
                  cursor: 'pointer' 
                }}
              >
                Close
              </button>
            </div>
          </div>
        </ModalWrapper>
      )}

      {showAddCourse && editingCourse && (
        <ModalWrapper title={editingCourse.id ? 'Edit Course' : 'Create Course'} onClose={() => setShowAddCourse(false)}>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label style={labelStyle}>Course Title</label>
              <input required value={editingCourse.title} onChange={e => setEditingCourse({...editingCourse, title: e.target.value})} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Image URL</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input required value={editingCourse.image} onChange={e => setEditingCourse({...editingCourse, image: e.target.value})} style={inputStyle} />
                <div style={{ width: '42px', height: '42px', borderRadius: '8px', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1px solid #F3EBE1', marginTop: '6px' }}>
                  {editingCourse.image ? <img src={editingCourse.image} style={{width:'100%', height:'100%', objectFit:'cover'}} /> : <FiImage color="#94A3B8" />}
                </div>
              </div>
            </div>
            <div>
              <label style={labelStyle}>Description</label>
              <textarea required value={editingCourse.description} onChange={e => setEditingCourse({...editingCourse, description: e.target.value})} style={{...inputStyle, height: '80px', resize: 'none'}} />
            </div>
            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Course Type</label>
                <select value={editingCourse.isPremium ? "Premium" : "Free"} onChange={e => setEditingCourse({...editingCourse, isPremium: e.target.value === "Premium"})} style={inputStyle}>
                  <option value="Free">Free</option>
                  <option value="Premium">Premium</option>
                </select>
              </div>
              <div style={{ flex: 1, opacity: editingCourse.isPremium ? 1 : 0.5 }}>
                <label style={labelStyle}>Price (₹)</label>
                <input type="number" required={editingCourse.isPremium} disabled={!editingCourse.isPremium} value={editingCourse.price} onChange={e => setEditingCourse({...editingCourse, price: parseInt(e.target.value) || 0})} style={inputStyle} />
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
              <button type="button" onClick={() => setShowAddCourse(false)} style={{ flex: 1, padding: '12px', background: 'transparent', border: '1px solid #CBD5E1', color: '#64748B', borderRadius: '10px', cursor: 'pointer', fontWeight: '750' }}>Cancel</button>
              <button type="submit" style={{ flex: 1, padding: '12px', background: '#F9572A', border: 'none', color: '#FFFFFF', borderRadius: '10px', fontWeight: '800', cursor: 'pointer' }}>Save Course</button>
            </div>
          </form>
        </ModalWrapper>
      )}
    </div>
  );
}

function AnalyticsBox({ title, val, sub, icon }) {
  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #F3EBE1', borderRadius: '16px', padding: '20px', display: 'flex', gap: '15px' }}>
      <div style={{ fontSize: '24px', display: 'flex', alignItems: 'center' }}>{icon}</div>
      <div>
        <div style={{ fontSize: '12px', fontWeight: '750', color: '#64748B', textTransform: 'uppercase' }}>{title}</div>
        <div style={{ fontSize: '20px', fontWeight: '850', color: '#1E1B18', marginTop: '2px' }}>{val}</div>
        <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>{sub}</div>
      </div>
    </div>
  );
}

// Platform settings panel (re-styled)
function SettingsPanel() {
  const [platformName, setPlatformName] = useState('SkillSphere');
  const [notifyEmail, setNotifyEmail] = useState('admin@skillsphere.com');
  const [taxRate, setTaxRate] = useState('18');
  const [success, setSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div>
      <h2 style={{ margin: '0 0 6px', fontWeight: '850', color: '#1E1B18' }}>Platform Configuration</h2>
      <p style={{ margin: '0 0 30px', color: '#64748B', fontSize: '14px' }}>Modify platform branding identity, email triggers, and tax metrics.</p>

      {success && (
        <div style={{ background: '#ECFDF5', border: '1px solid #10B981', color: '#10B981', padding: '12px', borderRadius: '12px', marginBottom: '20px', fontWeight: '700', fontSize: '13.5px' }}>
          ✓ Platform settings updated successfully! (Local state simulation)
        </div>
      )}

      <form onSubmit={handleSave} style={{ maxWidth: '600px', background: '#FFFFFF', border: "1px solid #F3EBE1", borderRadius: '16px', padding: '30px' }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>Platform Identity Title</label>
          <input value={platformName} onChange={e => setPlatformName(e.target.value)} style={inputStyle} />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>Admin System Email</label>
          <input type="email" value={notifyEmail} onChange={e => setNotifyEmail(e.target.value)} style={inputStyle} />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>Billing Tax Rate (%)</label>
          <input value={taxRate} type="number" onChange={e => setTaxRate(e.target.value)} style={inputStyle} />
        </div>
        <button type="submit" style={{
          padding: '12px 24px', background: '#F9572A', border: 'none', color: '#FFFFFF', borderRadius: '10px', fontWeight: '800', cursor: 'pointer'
        }}>
          Save Platform Changes
        </button>
      </form>
    </div>
  );
}

function LeaveApprovalsView({ requests, onApprove, onReject, onRefresh, formatDate }) {
  const pending = (requests || []).filter(r => r.status === 'pending');
  const processed = (requests || []).filter(r => r.status !== 'pending');

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: 0, fontWeight: '850', color: '#1E1B18' }}>Workforce Leave Approvals</h2>
          <p style={{ margin: '4px 0 0', color: '#64748B', fontSize: '14px' }}>
            Review, approve, or reject leave requests submitted by workforce employees and managers in real-time.
          </p>
        </div>
        <button
          onClick={onRefresh}
          style={{
            background: '#FAF8F5', border: '1px solid #F3EBE1', padding: '9px 16px',
            borderRadius: '99px', fontWeight: '750', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'
          }}
        >
          <FiRefreshCw /> Sync Requests
        </button>
      </div>

      {/* Pending Leave Requests */}
      <div style={{ marginBottom: '36px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '800', margin: '0 0 16px', color: '#1E1B18', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>⏳ Pending Leave Requests</span>
          {pending.length > 0 && (
            <span style={{ background: '#FFF0ED', color: '#F9572A', fontSize: '12px', padding: '2px 8px', borderRadius: '12px' }}>
              {pending.length} pending
            </span>
          )}
        </h3>

        {pending.length === 0 ? (
          <div style={{ background: '#FFFFFF', border: '1px dashed #E2E8F0', borderRadius: '16px', padding: '36px', textAlign: 'center', color: '#64748B' }}>
            <FiCheck style={{ fontSize: '28px', color: '#10B981', marginBottom: '8px' }} />
            <p style={{ margin: 0, fontWeight: '700' }}>All caught up! No pending leave requests to review.</p>
          </div>
        ) : (
          <div style={{ background: '#FFFFFF', border: '1px solid #F3EBE1', borderRadius: '16px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#FAF8F5', color: '#64748B', fontSize: '11px', textTransform: 'uppercase', fontWeight: '800', borderBottom: '1px solid #F3EBE1' }}>
                  <th style={{ padding: '16px 20px' }}>Employee</th>
                  <th style={{ padding: '16px 20px' }}>Leave Type</th>
                  <th style={{ padding: '16px 20px' }}>Dates & Duration</th>
                  <th style={{ padding: '16px 20px' }}>Reason</th>
                  <th style={{ padding: '16px 20px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pending.map(r => (
                  <tr key={r.id} style={{ borderBottom: '1px solid #F3EBE1' }}>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ fontWeight: '750', color: '#1E1B18', fontSize: '14px' }}>{r.employeeName}</div>
                      <div style={{ fontSize: '12px', color: '#64748B' }}>{r.employeeEmail} • {r.dept || 'Engineering'}</div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ background: '#FFF5F2', color: '#F9572A', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '750' }}>
                        {r.leaveType}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ fontWeight: '700', fontSize: '13px', color: '#1E1B18' }}>{r.startDate} to {r.endDate}</div>
                      <div style={{ fontSize: '12px', color: '#64748B' }}>{r.days} {r.days === 1 ? 'day' : 'days'}</div>
                    </td>
                    <td style={{ padding: '16px 20px', fontSize: '13px', color: '#475569', maxWidth: '240px' }}>
                      {r.reason}
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <button
                          onClick={() => onApprove(r.id)}
                          style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#10B981', padding: '7px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: '750', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <FiCheck /> Approve
                        </button>
                        <button
                          onClick={() => onReject(r.id)}
                          style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#EF4444', padding: '7px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: '750', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <FiX /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Processed Leave History */}
      <div>
        <h3 style={{ fontSize: '16px', fontWeight: '800', margin: '0 0 16px', color: '#1E1B18' }}>📋 Processed Leave History</h3>
        <div style={{ background: '#FFFFFF', border: '1px solid #F3EBE1', borderRadius: '16px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#FAF8F5', color: '#64748B', fontSize: '11px', textTransform: 'uppercase', fontWeight: '800', borderBottom: '1px solid #F3EBE1' }}>
                <th style={{ padding: '16px 20px' }}>Employee</th>
                <th style={{ padding: '16px 20px' }}>Leave Type</th>
                <th style={{ padding: '16px 20px' }}>Dates</th>
                <th style={{ padding: '16px 20px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {processed.map(r => (
                <tr key={r.id} style={{ borderBottom: '1px solid #F3EBE1' }}>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ fontWeight: '750', color: '#1E1B18', fontSize: '13.5px' }}>{r.employeeName}</div>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>{r.employeeEmail}</div>
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: '13px', fontWeight: '600', color: '#475569' }}>{r.leaveType}</td>
                  <td style={{ padding: '16px 20px', fontSize: '13px', color: '#64748B' }}>{r.startDate} to {r.endDate} ({r.days}d)</td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{
                      background: r.status === 'approved' ? '#ECFDF5' : '#FEF2F2',
                      color: r.status === 'approved' ? '#10B981' : '#EF4444',
                      padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '750', textTransform: 'capitalize'
                    }}>
                      {r.status === 'approved' ? '✓ Approved' : '✕ Rejected'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

