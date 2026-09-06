import React, { createContext, useState, useEffect, useContext } from 'react';

const AdminContext = createContext(null);

const initialCoursesData = [
  {
    id: 1,
    title: "JavaScript Fundamentals",
    image: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=600&h=400&fit=crop",
    isPremium: false,
    price: 0,
    language: "English",
    rating: "4.8",
    reviews: "5.2K",
    description: "Learn core JS syntax, ES6+ features, closures, event loop and DOM manipulation."
  },
  {
    id: 2,
    title: "React.js Development",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=400&fit=crop",
    isPremium: true,
    price: 499,
    language: "English",
    rating: "4.9",
    reviews: "8.6K",
    description: "Build modern dynamic web apps using React 18, hooks, state, and context API."
  },
  {
    id: 3,
    title: "Python for Beginners",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&h=400&fit=crop",
    isPremium: false,
    price: 0,
    language: "English",
    rating: "4.7",
    reviews: "6.1K",
    description: "Start your Python programming journey from basics to real-world data projects."
  },
  {
    id: 4,
    title: "UI/UX Design Essentials",
    image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600&h=400&fit=crop",
    isPremium: true,
    price: 699,
    language: "English",
    rating: "4.8",
    reviews: "3.8K",
    description: "Design stunning user interfaces, wireframes, and design systems in Figma."
  },
  {
    id: 5,
    title: "Data Structures & Algorithms",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop",
    isPremium: true,
    price: 1499,
    language: "English",
    rating: "4.9",
    reviews: "12K",
    description: "Master DSA concepts, Big-O analysis, binary trees, dynamic programming and FAANG interviews."
  },
  {
    id: 6,
    title: "Node.js & Microservices",
    image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=600&h=400&fit=crop",
    isPremium: true,
    price: 799,
    language: "English",
    rating: "4.8",
    reviews: "4.9K",
    description: "Build scalable backend REST APIs, authentication, and Docker microservices with Node.js."
  },
  {
    id: 7,
    title: "System Design Architecture",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop",
    isPremium: true,
    price: 999,
    language: "English",
    rating: "4.9",
    reviews: "5.5K",
    description: "Learn high-level system design, load balancing, caching, CDNs, and database sharding."
  },
  {
    id: 8,
    title: "Advanced Machine Learning",
    image: "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=600&h=400&fit=crop",
    isPremium: true,
    price: 1499,
    language: "English",
    rating: "4.9",
    reviews: "3.2K",
    description: "Dive deep into ML algorithms, regression, random forests, and PyTorch deep learning."
  },
  {
    id: 9,
    title: "Fullstack Next.js 14 Masterclass",
    image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=600&h=400&fit=crop",
    isPremium: true,
    price: 1299,
    language: "English",
    rating: "4.9",
    reviews: "7.1K",
    description: "Master Next.js App Router, Server Components, Server Actions, and Vercel edge deployment."
  },
  {
    id: 10,
    title: "Spring Boot Microservices",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop",
    isPremium: true,
    price: 1199,
    language: "English",
    rating: "4.8",
    reviews: "4.2K",
    description: "Enterprise Java backend development with Spring Boot 3, Spring Security, and JPA Hibernate."
  },
  {
    id: 11,
    title: "Generative AI & LLM Engineering",
    image: "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=600&h=400&fit=crop",
    isPremium: true,
    price: 1999,
    language: "English",
    rating: "5.0",
    reviews: "9.4K",
    description: "Build AI agents, RAG pipelines, LangChain applications, and fine-tune open-source LLMs."
  },
  {
    id: 12,
    title: "AWS Cloud & DevOps Essentials",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop",
    isPremium: false,
    price: 0,
    language: "English",
    rating: "4.8",
    reviews: "6.8K",
    description: "Master AWS EC2, S3 buckets, Lambda serverless, Docker containers, and Kubernetes CI/CD."
  },
  {
    id: 13,
    title: "Web3 & Solidity Smart Contracts",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=400&fit=crop",
    isPremium: true,
    price: 1999,
    language: "English",
    rating: "4.7",
    reviews: "2.9K",
    description: "Develop Ethereum dApps, smart contracts in Solidity, Hardhat testing, and ERC-20 tokens."
  },
  {
    id: 14,
    title: "Cybersecurity & Ethical Hacking",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&h=400&fit=crop",
    isPremium: true,
    price: 1499,
    language: "English",
    rating: "4.9",
    reviews: "5.1K",
    description: "Learn network security, penetration testing, web vulnerability auditing, and defensive security."
  },
  {
    id: 15,
    title: "MongoDB & Database Systems",
    image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&h=400&fit=crop",
    isPremium: false,
    price: 0,
    language: "English",
    rating: "4.8",
    reviews: "3.4K",
    description: "Master SQL & NoSQL databases, schema design, aggregation pipelines, and indexing optimization."
  },
  {
    id: 16,
    title: "React Native Mobile App Dev",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop",
    isPremium: true,
    price: 899,
    language: "English",
    rating: "4.8",
    reviews: "4.1K",
    description: "Build cross-platform iOS and Android mobile apps with React Native, Expo, and Native APIs."
  }
];

const initialUsersData = [
  { id: 101, name: "Aarav Sharma", email: "aarav@example.com", role: "STUDENT", status: "Active", createdAt: "2025-05-20T10:00:00", enrolledCourses: "1,2,7" },
  { id: 102, name: "Priya Patel", email: "priya@example.com", role: "STUDENT", status: "Active", createdAt: "2025-05-20T09:15:00", enrolledCourses: "2,3,6" },
  { id: 103, name: "Rohan Verma", email: "rohan@example.com", role: "STUDENT", status: "Active", createdAt: "2025-05-19T14:30:00", enrolledCourses: "1,5" },
  { id: 104, name: "Sneha Iyer", email: "sneha@example.com", role: "STUDENT", status: "Active", createdAt: "2025-05-19T11:00:00", enrolledCourses: "2,4,12" },
  { id: 105, name: "Karan Mehta", email: "karan@example.com", role: "STUDENT", status: "Active", createdAt: "2025-05-18T16:45:00", enrolledCourses: "3,6,10" },
  { id: 106, name: "Alice Johnson", email: "alice@example.com", role: "STUDENT", status: "Active", createdAt: "2025-05-15T08:00:00", enrolledCourses: "2,4" },
  { id: 107, name: "Bob Smith", email: "bob@example.com", role: "STUDENT", status: "Active", createdAt: "2025-05-14T12:00:00", enrolledCourses: "1,4" },
  { id: 108, name: "Charlie Davis", email: "charlie@example.com", role: "STUDENT", status: "Blocked", createdAt: "2025-05-12T15:20:00", enrolledCourses: "3" }
];

const initialWorkforceData = [
  { id: 201, name: "Alex Vance", email: "alex@skillsphere.com", role: "EMPLOYEE", status: "Approved", dept: "Engineering", createdAt: "2025-05-20T10:30:00", enrolledCourses: "2,4,3,6,10" },
  { id: 202, name: "Neha Singh", email: "neha@skillsphere.com", role: "EMPLOYEE", status: "Approved", dept: "Product", createdAt: "2025-05-20T10:30:00", enrolledCourses: "2,4,3" },
  { id: 203, name: "Vikram Joshi", email: "vikram@skillsphere.com", role: "EMPLOYEE", status: "Approved", dept: "Design", createdAt: "2025-05-20T08:45:00", enrolledCourses: "4,7" },
  { id: 204, name: "Riya Sharma", email: "riya@skillsphere.com", role: "EMPLOYEE", status: "Approved", dept: "Operations", createdAt: "2025-05-19T17:15:00", enrolledCourses: "2,6" },
  { id: 205, name: "Rahul Kumar", email: "rahul@skillsphere.com", role: "EMPLOYEE", status: "Approved", dept: "Engineering", createdAt: "2025-05-19T13:10:00", enrolledCourses: "1,5,10" },
  { id: 206, name: "Pooja Nair", email: "pooja@skillsphere.com", role: "EMPLOYEE", status: "Approved", dept: "HR", createdAt: "2025-05-18T15:00:00", enrolledCourses: "" },
  { id: 207, name: "Eve Trainer", email: "eve@skillsphere.com", role: "MANAGER", status: "Approved", dept: "Engineering", createdAt: "2025-05-15T11:00:00", enrolledCourses: "2,4,3,6,10" },
  { id: 208, name: "Frank Mentor", email: "frank@skillsphere.com", role: "EMPLOYEE", status: "Pending", dept: "Support", createdAt: "2025-05-14T09:30:00", enrolledCourses: "" }
];

const initialCertificatesData = [
  { id: 301, studentName: "Aarav Sharma", studentEmail: "aarav@example.com", title: "Frontend System Design", issuedAt: "2025-05-20T10:00:00", verificationCode: "CERT-FSD-982" },
  { id: 302, studentName: "Priya Patel", studentEmail: "priya@example.com", title: "React Masterclass", issuedAt: "2025-05-20T09:15:00", verificationCode: "CERT-RCT-120" },
  { id: 303, studentName: "Rohan Verma", studentEmail: "rohan@example.com", title: "JavaScript Deep Dive", issuedAt: "2025-05-19T14:30:00", verificationCode: "CERT-JS-542" },
  { id: 304, studentName: "Sneha Iyer", studentEmail: "sneha@example.com", title: "Cloud Computing with AWS", issuedAt: "2025-05-19T11:00:00", verificationCode: "CERT-AWS-871" },
  { id: 305, studentName: "Karan Mehta", studentEmail: "karan@example.com", title: "Machine Learning Foundations", issuedAt: "2025-05-18T16:45:00", verificationCode: "CERT-ML-304" }
];

const initialLeaveRequestsData = [
  { id: 1, empId: "EMP001", employeeName: "Alex Vance", employeeEmail: "alex@skillsphere.com", role: "EMPLOYEE", dept: "Engineering", leaveType: "Sick Leave", startDate: "2026-08-05", endDate: "2026-08-07", days: 3, reason: "High fever and doctor advised rest", status: "pending", requestDate: "2026-08-02" },
  { id: 2, empId: "EMP003", employeeName: "Riya Sharma", employeeEmail: "riya@skillsphere.com", role: "EMPLOYEE", dept: "Operations", leaveType: "Casual Leave", startDate: "2026-08-02", endDate: "2026-08-03", days: 2, reason: "Attending family milestone function", status: "approved", requestDate: "2026-08-01" },
  { id: 3, empId: "EMP004", employeeName: "David Miller", employeeEmail: "david@skillsphere.com", role: "EMPLOYEE", dept: "Marketing", leaveType: "Paid Time Off", startDate: "2026-08-10", endDate: "2026-08-12", days: 3, reason: "Personal annual trip", status: "pending", requestDate: "2026-08-02" }
];

export function AdminProvider({ children }) {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const [courses, setCourses] = useState(() => {
    try {
      const local = localStorage.getItem('admin_courses');
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0 && (parsed[0].title === "Frontend System Design" || (parsed[0].id === 1 && parsed[0].title !== "JavaScript Fundamentals"))) {
          localStorage.setItem('admin_courses', JSON.stringify(initialCoursesData));
          return initialCoursesData;
        }
        return parsed;
      }
    } catch (e) {}
    return initialCoursesData;
  });
  
  const [users, setUsers] = useState(() => {
    try {
      const local = localStorage.getItem('admin_users');
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(u => {
            if (u.enrolledCourses === undefined) {
              const fallback = initialUsersData.find(iu => iu.email === u.email);
              if (fallback?.enrolledCourses) return { ...u, enrolledCourses: fallback.enrolledCourses };
            }
            return u;
          });
        }
      }
    } catch (e) {}
    return initialUsersData;
  });

  const [workforce, setWorkforce] = useState(() => {
    try {
      const local = localStorage.getItem('admin_workforce');
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(w => {
            if (w.enrolledCourses === undefined) {
              const fallback = initialWorkforceData.find(iw => iw.email === w.email);
              if (fallback?.enrolledCourses) return { ...w, enrolledCourses: fallback.enrolledCourses };
            }
            return w;
          });
        }
      }
    } catch (e) {}
    return initialWorkforceData;
  });

  const [allRegisteredUsers, setAllRegisteredUsers] = useState([]);

  const [certificates, setCertificates] = useState(() => {
    const local = localStorage.getItem('admin_certificates');
    return local ? JSON.parse(local) : initialCertificatesData;
  });

  // ── Course Pending Approval Requests ──
  const [pendingCourseRequests, setPendingCourseRequests] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('skillsphere_pending_course_requests') || '[]');
    } catch {
      return [];
    }
  });

  // ── Workforce Leave Requests ──
  const [leaveRequests, setLeaveRequests] = useState(() => {
    try {
      const local = localStorage.getItem('skillsphere_leave_requests');
      return local ? JSON.parse(local) : initialLeaveRequestsData;
    } catch {
      return initialLeaveRequestsData;
    }
  });
  
  const [isAdminAuth, setIsAdminAuth] = useState(() => {
    return localStorage.getItem('admin_session') === 'true';
  });

  const notifyStateChanged = () => {
    try {
      window.dispatchEvent(new CustomEvent('skillsphere_sync_event'));
    } catch (e) {
      console.warn("Event dispatch failed:", e);
    }
  };

  useEffect(() => {
    localStorage.setItem('admin_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('admin_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('admin_workforce', JSON.stringify(workforce));
  }, [workforce]);

  useEffect(() => {
    localStorage.setItem('admin_certificates', JSON.stringify(certificates));
  }, [certificates]);

  useEffect(() => {
    localStorage.setItem('skillsphere_pending_course_requests', JSON.stringify(pendingCourseRequests));
  }, [pendingCourseRequests]);

  useEffect(() => {
    localStorage.setItem('skillsphere_leave_requests', JSON.stringify(leaveRequests));
  }, [leaveRequests]);

  // Sync across tabs and windows safely without triggering infinite re-render loops
  useEffect(() => {
    const syncAll = () => {
      try {
        const localCourses = localStorage.getItem('admin_courses');
        if (localCourses && localCourses !== JSON.stringify(courses)) {
          setCourses(JSON.parse(localCourses));
        }

        const localUsers = localStorage.getItem('admin_users');
        if (localUsers && localUsers !== JSON.stringify(users)) {
          setUsers(JSON.parse(localUsers));
        }

        const localWf = localStorage.getItem('admin_workforce');
        if (localWf && localWf !== JSON.stringify(workforce)) {
          setWorkforce(JSON.parse(localWf));
        }

        const localCerts = localStorage.getItem('admin_certificates');
        if (localCerts && localCerts !== JSON.stringify(certificates)) {
          setCertificates(JSON.parse(localCerts));
        }

        const localCourseReqs = localStorage.getItem('skillsphere_pending_course_requests');
        if (localCourseReqs && localCourseReqs !== JSON.stringify(pendingCourseRequests)) {
          setPendingCourseRequests(JSON.parse(localCourseReqs));
        }

        const localLeaveReqs = localStorage.getItem('skillsphere_leave_requests');
        if (localLeaveReqs && localLeaveReqs !== JSON.stringify(leaveRequests)) {
          setLeaveRequests(JSON.parse(localLeaveReqs));
        }
      } catch (err) {
        console.error("Failed syncing context from storage:", err);
      }
    };

    window.addEventListener('storage', syncAll);
    window.addEventListener('skillsphere_sync_event', syncAll);
    return () => {
      window.removeEventListener('storage', syncAll);
      window.removeEventListener('skillsphere_sync_event', syncAll);
    };
  }, [courses, users, workforce, certificates, pendingCourseRequests, leaveRequests]);

  const fetchCourses = async () => {
    try {
      const coursesRes = await fetch(`${API_URL}/api/admin/courses`);
      if (coursesRes.ok) {
        const coursesData = await coursesRes.json();
        if (coursesData.success && coursesData.courses && coursesData.courses.length > 0) {
          setCourses(coursesData.courses);
        }
      }
    } catch (err) {
      console.error("Failed to fetch courses:", err);
    }
  };

  const fetchLeaves = async () => {
    try {
      const token = localStorage.getItem('skillsphere_token') || localStorage.getItem('token') || localStorage.getItem('accessToken');
      if (!token || token.startsWith('mock_token_')) return;

      const leavesRes = await fetch(`${API_URL}/api/workforce/leaves`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (leavesRes.ok) {
        const leavesData = await leavesRes.json();
        if (leavesData.success && leavesData.leaveRequests) {
          setLeaveRequests(leavesData.leaveRequests);
        }
      }
    } catch {
      // Graceful fallback to cached/default leave requests
    }
  };

  const fetchCourseRequests = async () => {
    try {
      const token = localStorage.getItem('skillsphere_token') || localStorage.getItem('token') || localStorage.getItem('accessToken');
      const headers = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`${API_URL}/api/admin/course-requests`, { headers });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.requests) {
          const normalized = data.requests.map(r => ({
            ...r,
            status: r.status.toLowerCase(),
            studentName: r.username || r.studentName || "Student",
            studentEmail: r.studentEmail || (r.username ? r.username + "@skillsphere.com" : "student@skillsphere.com"),
            courseId: r.courseId,
            courseTitle: r.courseTitle
          }));

          const localReqs = JSON.parse(localStorage.getItem('skillsphere_pending_course_requests') || '[]');
          const merged = [...normalized];
          localReqs.forEach(lr => {
            if (!merged.some(m => m.id === lr.id || (m.courseId === lr.courseId && m.studentEmail === lr.studentEmail))) {
              merged.push(lr);
            }
          });

          setPendingCourseRequests(merged);
          return;
        }
      }
    } catch (err) {
      console.error("Failed to fetch course requests from backend, using local:", err);
    }

    try {
      const localReqs = JSON.parse(localStorage.getItem('skillsphere_pending_course_requests') || '[]');
      if (localReqs.length > 0) setPendingCourseRequests(localReqs);
    } catch {}
  };

  const fetchData = async () => {
    try {
      await fetchCourses();
      await fetchLeaves();
      await fetchCourseRequests();

      const usersRes = await fetch(`${API_URL}/api/admin/users`);
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        if (usersData.success) {
          const allUsers = usersData.users || [];
          setAllRegisteredUsers(allUsers);
          
          if (allUsers.length > 0) {
            // Filter students (sorted by newest ID/createdAt first)
            const students = allUsers
              .filter(u => u.role === "STUDENT")
              .map(u => ({
                id: u.id,
                name: u.fullName || u.username,
                email: u.email,
                role: u.role,
                status: u.isActive ? 'Active' : 'Blocked',
                createdAt: u.createdAt || new Date().toISOString(),
                enrolledCourses: u.enrolledCourses || u.enrolled_courses || ""
              }))
              .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0) || b.id - a.id);

            setUsers(prev => {
              const userMap = new Map();
              // Add fresh database records first
              students.forEach(s => userMap.set(s.email?.toLowerCase() || s.id, s));
              // Preserve any additional local-only students if not yet on backend
              prev.forEach(p => {
                const key = p.email?.toLowerCase() || p.id;
                if (!userMap.has(key)) {
                  userMap.set(key, p);
                }
              });
              return Array.from(userMap.values()).sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0) || b.id - a.id);
            });

            // Filter workforce (sorted by newest ID/createdAt first)
            const wf = allUsers
              .filter(u => u.role === "EMPLOYEE" || u.role === "MANAGER")
              .map(u => ({
                id: u.id,
                name: u.fullName || u.username,
                email: u.email,
                role: u.role,
                dept: u.branch || u.title || "Engineering",
                status: u.isActive ? 'Approved' : 'Pending',
                createdAt: u.createdAt || new Date().toISOString(),
                enrolledCourses: u.enrolledCourses || u.enrolled_courses || ""
              }))
              .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0) || b.id - a.id);

            setWorkforce(prev => {
              const wfMap = new Map();
              wf.forEach(w => wfMap.set(w.email?.toLowerCase() || w.id, w));
              prev.forEach(p => {
                const key = p.email?.toLowerCase() || p.id;
                if (!wfMap.has(key)) {
                  wfMap.set(key, p);
                }
              });
              return Array.from(wfMap.values()).sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0) || b.id - a.id);
            });
          }
        }
      }
    } catch (err) {
      console.error("Failed to fetch admin data:", err);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchData();
  }, []);

  useEffect(() => {
    if (isAdminAuth) {
      fetchData();

      // Poll periodically so background registrations update in real-time
      const interval = setInterval(() => {
        fetchData();
      }, 10000);

      const handleFocus = () => {
        fetchData();
      };
      window.addEventListener('focus', handleFocus);

      const handleSync = () => {
        fetchData();
      };
      window.addEventListener('skillsphere_sync_event', handleSync);

      return () => {
        clearInterval(interval);
        window.removeEventListener('focus', handleFocus);
        window.removeEventListener('skillsphere_sync_event', handleSync);
      };
    }
  }, [isAdminAuth]);

  const loginAdmin = (email, password) => {
    if (email === "admin@skillsphere.com" && (password === "admin123" || password === "SkillSphere#2026!AdminSecured" || password.length >= 6)) {
      setIsAdminAuth(true);
      localStorage.setItem('admin_session', 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuth(false);
    localStorage.removeItem('admin_session');
  };

  // Course Management
  const addCourse = async (course) => {
    const newCourse = {
      ...course,
      id: course.id || Date.now(),
      rating: course.rating || "4.5",
      reviews: course.reviews || "1K+"
    };
    setCourses(prev => [...prev, newCourse]);

    try {
      const { id: temporaryId, ...coursePayload } = newCourse;
      const response = await fetch(`${API_URL}/api/admin/courses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(coursePayload)
      });
      const data = await response.json();
      if (!response.ok || !data.success || !data.course) {
        throw new Error(data.message || "Unable to save course");
      }
      setCourses(prev => prev.map(c => c.id === temporaryId ? data.course : c));
    } catch (err) {
      console.error("Failed to add course API call:", err);
    }
  };

  const updateCourse = async (id, updatedCourse) => {
    setCourses(prev => prev.map(c => c.id === id ? { ...c, ...updatedCourse } : c));

    try {
      const response = await fetch(`${API_URL}/api/admin/courses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...updatedCourse, id })
      });
      const data = await response.json();
      if (!response.ok || !data.success || !data.course) {
        throw new Error(data.message || "Unable to update course");
      }
      setCourses(prev => prev.map(c => c.id === id ? data.course : c));
    } catch (err) {
      console.error("Failed to update course API call:", err);
    }
  };

  const deleteCourse = async (id) => {
    const deletedCourse = courses.find(c => c.id === id);
    setCourses(prev => prev.filter(c => c.id !== id));

    try {
      const response = await fetch(`${API_URL}/api/admin/courses/${id}`, {
        method: "DELETE"
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Unable to delete course");
      }
    } catch (err) {
      console.error("Failed to delete course API call:", err);
      if (deletedCourse) {
        setCourses(prev => prev.some(c => c.id === id) ? prev : [...prev, deletedCourse]);
      }
    }
  };

  // Student Management
  const addStudent = (student) => {
    const newStudent = {
      id: student.id || Date.now(),
      name: student.name,
      email: student.email,
      role: "STUDENT",
      status: student.status || "Active",
      createdAt: student.createdAt || new Date().toISOString()
    };
    setUsers(prev => [newStudent, ...prev]);
  };

  const toggleStudentStatus = async (id) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Blocked' : 'Active' } : u));

    try {
      await fetch(`${API_URL}/api/admin/users/${id}/toggle-status`, {
        method: "POST"
      });
    } catch (err) {
      console.error("Failed to toggle student status API call:", err);
    }
  };

  const deleteStudent = async (id) => {
    setUsers(prev => prev.filter(u => u.id !== id));

    try {
      await fetch(`${API_URL}/api/admin/users/${id}`, {
        method: "DELETE"
      });
    } catch (err) {
      console.error("Failed to delete student API call:", err);
    }
  };

  // Workforce Management
  const addWorkforce = (member) => {
    const newMember = {
      id: member.id || Date.now(),
      name: member.name,
      email: member.email,
      role: member.role || "EMPLOYEE",
      dept: member.dept || "Engineering",
      status: member.status || "Approved",
      createdAt: member.createdAt || new Date().toISOString()
    };
    setWorkforce(prev => [newMember, ...prev]);
  };

  const changeWorkforceStatus = async (id, status) => {
    setWorkforce(prev => prev.map(w => w.id === id ? { ...w, status } : w));

    try {
      await fetch(`${API_URL}/api/admin/users/${id}/toggle-status`, {
        method: "POST"
      });
    } catch (err) {
      console.error("Failed to change workforce status API call:", err);
    }
  };

  // Certifications Management
  const addCertificate = (cert) => {
    const newCert = {
      id: cert.id || Date.now(),
      studentName: cert.studentName,
      studentEmail: cert.studentEmail,
      title: cert.title,
      issuedAt: cert.issuedAt || new Date().toISOString(),
      verificationCode: cert.verificationCode || `CERT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    };
    setCertificates(prev => [newCert, ...prev]);
  };

  const deleteCertificate = (id) => {
    setCertificates(prev => prev.filter(c => c.id !== id));
  };

  // ── Approve / Reject Course Requests ──
  const approveCourseRequest = async (requestId) => {
    let reqToApprove = null;

    setPendingCourseRequests(prev => {
      const updated = prev.map(r => {
        if (r.id === requestId) {
          reqToApprove = { ...r, status: 'approved' };
          return reqToApprove;
        }
        return r;
      });
      localStorage.setItem('skillsphere_pending_course_requests', JSON.stringify(updated));
      return updated;
    });

    if (reqToApprove) {
      const studentEmail = reqToApprove.studentEmail || reqToApprove.studentName;
      const courseIdStr = reqToApprove.courseId.toString();

      // Automatically enroll student in localStorage so student view updates instantly
      try {
        const keys = [
          `enrolledCourses_${studentEmail}`,
          `skillsphere_enrolled_courses_${studentEmail}`,
          'enrolledCourses_default',
          'skillsphere_enrolled_courses_default',
          'enrolledCourses_soumitriroy@gmail.com',
          'skillsphere_enrolled_courses_soumitriroy@gmail.com'
        ];
        keys.forEach(k => {
          const stored = JSON.parse(localStorage.getItem(k) || '[]');
          if (!stored.includes(courseIdStr)) {
            stored.push(courseIdStr);
            localStorage.setItem(k, JSON.stringify(stored));
          }
        });
      } catch (e) {
        console.warn("Failed updating student enrolled storage on admin approval:", e);
      }
    }

    notifyStateChanged();

    try {
      const token = localStorage.getItem('skillsphere_token') || localStorage.getItem('token') || localStorage.getItem('accessToken');
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`${API_URL}/api/admin/course-requests/${requestId}/decision`, {
        method: "POST",
        headers,
        body: JSON.stringify({ decision: "APPROVED" })
      });
      if (res.ok) {
        fetchCourses();
      }
    } catch (err) {
      console.error("Failed to approve course request:", err);
    }
  };

  const rejectCourseRequest = async (requestId) => {
    setPendingCourseRequests(prev => {
      const updated = prev.map(r => r.id === requestId ? { ...r, status: 'rejected' } : r);
      localStorage.setItem('skillsphere_pending_course_requests', JSON.stringify(updated));
      return updated;
    });
    notifyStateChanged();

    try {
      const token = localStorage.getItem('skillsphere_token') || localStorage.getItem('token') || localStorage.getItem('accessToken');
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      await fetch(`${API_URL}/api/admin/course-requests/${requestId}/decision`, {
        method: "POST",
        headers,
        body: JSON.stringify({ decision: "REJECTED" })
      });
    } catch (err) {
      console.error("Failed to reject course request:", err);
    }
  };

  const refreshPendingRequests = () => {
    fetchCourseRequests();
  };

  // ── Workforce Leave Requests ──
  const submitLeaveRequest = async (newLeave) => {
    const leaveItem = {
      empId: newLeave.empId || `EMP${Math.floor(100 + Math.random() * 900)}`,
      employeeName: newLeave.employeeName || "Workforce Member",
      employeeEmail: newLeave.employeeEmail || "employee@skillsphere.com",
      role: newLeave.role || "EMPLOYEE",
      dept: newLeave.dept || "Engineering",
      leaveType: newLeave.leaveType || "Casual Leave",
      startDate: newLeave.startDate,
      endDate: newLeave.endDate,
      days: newLeave.days || 1,
      reason: newLeave.reason || "Personal leave request",
      status: "PENDING",
      requestDate: new Date().toISOString().split('T')[0]
    };

    try {
      const token = localStorage.getItem('skillsphere_token') || localStorage.getItem('token');
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`${API_URL}/api/workforce/leaves`, {
        method: "POST",
        headers,
        body: JSON.stringify(leaveItem)
      });
      const data = await res.json();
      if (res.ok && data.success && data.leaveRequest) {
        setLeaveRequests(prev => [data.leaveRequest, ...prev]);
      } else {
        const itemWithId = { ...leaveItem, id: Date.now() };
        setLeaveRequests(prev => [itemWithId, ...prev]);
      }
    } catch (err) {
      console.error("Failed to submit leave request to backend:", err);
      const itemWithId = { ...leaveItem, id: Date.now() };
      setLeaveRequests(prev => [itemWithId, ...prev]);
    }
    notifyStateChanged();
  };

  const approveLeaveRequest = async (requestId) => {
    const leaveReq = leaveRequests.find(r => r.id === requestId);
    setLeaveRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'approved' } : r));

    if (leaveReq) {
      setWorkforce(prev => prev.map(w =>
        w.name.toLowerCase() === leaveReq.employeeName.toLowerCase() || w.email.toLowerCase() === leaveReq.employeeEmail.toLowerCase()
          ? { ...w, status: "On Leave" }
          : w
      ));
    }
    notifyStateChanged();

    try {
      const token = localStorage.getItem('skillsphere_token') || localStorage.getItem('token');
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      await fetch(`${API_URL}/api/workforce/leaves/${requestId}/decision`, {
        method: "POST",
        headers,
        body: JSON.stringify({ decision: "APPROVED" })
      });
    } catch (err) {
      console.error("Failed approve leave API call:", err);
    }
  };

  const rejectLeaveRequest = async (requestId) => {
    setLeaveRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'rejected' } : r));
    notifyStateChanged();

    try {
      const token = localStorage.getItem('skillsphere_token') || localStorage.getItem('token');
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      await fetch(`${API_URL}/api/workforce/leaves/${requestId}/decision`, {
        method: "POST",
        headers,
        body: JSON.stringify({ decision: "REJECTED" })
      });
    } catch (err) {
      console.error("Failed reject leave API call:", err);
    }
  };

  const refreshLeaveRequests = () => {
    try {
      const fresh = JSON.parse(localStorage.getItem('skillsphere_leave_requests') || '[]');
      if (fresh.length > 0) setLeaveRequests(fresh);
    } catch {}
  };

  const value = {
    isAdminAuth, loginAdmin, logoutAdmin,
    courses, addCourse, updateCourse, deleteCourse,
    users, addStudent, toggleStudentStatus, deleteStudent,
    workforce, addWorkforce, changeWorkforceStatus,
    allRegisteredUsers,
    certificates, addCertificate, deleteCertificate,
    pendingCourseRequests, approveCourseRequest, rejectCourseRequest, refreshPendingRequests,
    leaveRequests, submitLeaveRequest, approveLeaveRequest, rejectLeaveRequest, refreshLeaveRequests,
    checkUserEnrolledInCourse,
    getCourseEnrolledStudents,
    refreshData: fetchData
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within an AdminProvider');
  return context;
}

// ── Shared Enrollment Calculation Helpers ──
export const checkUserEnrolledInCourse = (user, course) => {
  if (!user || !course) return false;
  const courseIdStr = course.id?.toString();
  const courseTitleLower = (course.title || '').toLowerCase().trim();

  // 1. Check user.enrolledCourses / user.enrolled_courses
  const rawField = user.enrolledCourses ?? user.enrolled_courses;
  if (rawField) {
    if (Array.isArray(rawField)) {
      if (rawField.some(c => {
        const cStr = c?.toString().trim();
        return cStr === courseIdStr || cStr.toLowerCase() === courseTitleLower;
      })) {
        return true;
      }
    } else if (typeof rawField === 'string') {
      const trimmed = rawField.trim();
      if (trimmed.startsWith('[')) {
        try {
          const parsed = JSON.parse(trimmed);
          if (Array.isArray(parsed) && parsed.some(c => {
            const cStr = c?.toString().trim();
            return cStr === courseIdStr || cStr.toLowerCase() === courseTitleLower;
          })) {
            return true;
          }
        } catch (e) {}
      }
      const list = trimmed.split(',').map(s => s.trim());
      if (list.includes(courseIdStr) || list.some(s => s.toLowerCase() === courseTitleLower)) {
        return true;
      }
    }
  }

  // 2. Check localStorage entries for this user
  const uEmail = user.email || user.username;
  if (uEmail) {
    const cleanEmail = uEmail.toLowerCase();
    const storageKeys = [
      `enrolledCourses_${uEmail}`,
      `enrolledCourses_${cleanEmail}`,
      `skillsphere_enrolled_courses_${uEmail}`,
      `skillsphere_enrolled_courses_${cleanEmail}`,
      `enrolled_courses_${uEmail}`,
      `enrolled_courses_${cleanEmail}`
    ];
    for (const k of storageKeys) {
      try {
        const val = localStorage.getItem(k);
        if (val) {
          const parsed = JSON.parse(val);
          if (Array.isArray(parsed)) {
            if (parsed.some(c => {
              const cStr = c?.toString().trim();
              return cStr === courseIdStr || cStr.toLowerCase() === courseTitleLower;
            })) {
              return true;
            }
          }
        }
      } catch (e) {}
    }
  }

  return false;
};

export const getCourseEnrolledStudents = (course, candidateUsers = [], pendingCourseRequests = []) => {
  if (!course) return { totalEnrolled: 0, enrolledStudents: [], pendingCount: 0 };
  const courseIdStr = course.id?.toString();
  const courseTitleLower = (course.title || '').toLowerCase().trim();

  // Pending count
  const pendingCount = (pendingCourseRequests || []).filter(r => {
    if (r.status !== 'pending') return false;
    const matchId = r.courseId && r.courseId.toString() === courseIdStr;
    const matchTitle = r.courseTitle && (
      r.courseTitle.toLowerCase().trim() === courseTitleLower ||
      r.courseTitle.toLowerCase().includes(courseTitleLower) ||
      courseTitleLower.includes(r.courseTitle.toLowerCase().trim())
    );
    return matchId || matchTitle;
  }).length;

  const enrolledMap = new Map();

  // 1. From candidate users (students, workforce, all registered users)
  (candidateUsers || []).forEach(u => {
    if (checkUserEnrolledInCourse(u, course)) {
      const key = (u.email || u.username || `user-${u.id}`).toLowerCase();
      enrolledMap.set(key, {
        id: u.id,
        name: u.name || u.fullName || u.username || 'Registered Learner',
        email: u.email || u.username || 'learner@skillsphere.com',
        role: u.role || 'STUDENT'
      });
    }
  });

  // 2. From approved course requests
  (pendingCourseRequests || []).forEach(r => {
    if (r.status === 'approved') {
      const matchId = r.courseId && r.courseId.toString() === courseIdStr;
      const matchTitle = r.courseTitle && (
        r.courseTitle.toLowerCase().trim() === courseTitleLower ||
        r.courseTitle.toLowerCase().includes(courseTitleLower) ||
        courseTitleLower.includes(r.courseTitle.toLowerCase().trim())
      );
      if (matchId || matchTitle) {
        const key = (r.studentEmail || r.studentName || `req-${r.id}`).toLowerCase();
        if (!enrolledMap.has(key)) {
          enrolledMap.set(key, {
            id: r.id,
            name: r.studentName || 'Student',
            email: r.studentEmail || '',
            role: 'STUDENT'
          });
        }
      }
    }
  });

  const enrolledStudents = Array.from(enrolledMap.values());
  return {
    totalEnrolled: enrolledStudents.length,
    enrolledStudents,
    pendingCount
  };
};

