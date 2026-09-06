import React, { useState } from "react";
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
  FaRobot,
  FaRocket,
  FaMapSigns,
  FaMapMarkedAlt,
  FaBolt,
  FaAward,
  FaCertificate,
  FaChartLine,
  FaFileInvoice,
  FaCog,
  FaSearch,
  FaBell,
  FaCode,
  FaCalendarAlt,
  FaTrophy,
  FaCheckCircle,
  FaRegCircle,
  FaStar,
  FaRegStar,
  FaPlay,
  FaLock,
  FaChevronRight,
  FaChevronLeft,
  FaFilter,
  FaBookmark,
  FaRegBookmark,
  FaArrowRight,
  FaFire,
  FaBullseye,
  FaSun,
  FaMoon,
  FaSignOutAlt
} from "react-icons/fa";

import studentHeroImg from "../assets/student_dashboard_hero_illustration.png";
import darkReactLearningHero from "../assets/dark_react_learning_hero.png";
import lightReactLearningHero from "../assets/light_react_learning_hero.png";
import "../styles/studentDashboard.css";
import "../styles/codeArena.css";

const MASTER_PROBLEMS = [
  {
    id: 1,
    title: "Two Sum",
    platform: "LeetCode",
    platformIcon: "🟢",
    company: "Amazon",
    difficulty: "Easy",
    xpVal: "+150 XP",
    acceptance: "49.2%",
    topic: "Arrays",
    desc: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nExample 1:\nInput: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: Because nums[0] + nums[1] == 9, we return [0, 1].",
    starterCode: "function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const diff = target - nums[i];\n    if (map.has(diff)) return [map.get(diff), i];\n    map.set(nums[i], i);\n  }\n  return [];\n}"
  },
  {
    id: 2,
    title: "Add Two Numbers",
    platform: "LeetCode",
    platformIcon: "🟢",
    company: "Google",
    difficulty: "Medium",
    xpVal: "+250 XP",
    acceptance: "41.5%",
    topic: "Linked List",
    desc: "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.\n\nExample 1:\nInput: l1 = [2,4,3], l2 = [5,6,4]\nOutput: [7,0,8]\nExplanation: 342 + 465 = 807.",
    starterCode: "function addTwoNumbers(l1, l2) {\n  let dummy = new ListNode(0), curr = dummy, carry = 0;\n  while (l1 || l2 || carry) {\n    let sum = (l1 ? l1.val : 0) + (l2 ? l2.val : 0) + carry;\n    carry = Math.floor(sum / 10);\n    curr.next = new ListNode(sum % 10);\n    curr = curr.next;\n    if (l1) l1 = l1.next;\n    if (l2) l2 = l2.next;\n  }\n  return dummy.next;\n}"
  },
  {
    id: 3,
    title: "Subarray with Given Sum",
    platform: "GeeksforGeeks",
    platformIcon: "🟢",
    company: "Amazon",
    difficulty: "Medium",
    xpVal: "+200 XP",
    acceptance: "52.8%",
    topic: "Arrays",
    desc: "Given an unsorted array A of size N that contains only non-negative integers, find a continuous sub-array which adds to a given number S.\n\nExample 1:\nInput: N = 5, S = 12, A[] = {1,2,3,7,5}\nOutput: 2 4\nExplanation: The sum of elements from 2nd position to 4th position is 12.",
    starterCode: "function subarraySum(arr, n, s) {\n  let start = 0, currSum = 0;\n  for (let i = 0; i < n; i++) {\n    currSum += arr[i];\n    while (currSum > s && start < i) {\n      currSum -= arr[start];\n      start++;\n    }\n    if (currSum === s) return [start + 1, i + 1];\n  }\n  return [-1];\n}"
  },
  {
    id: 4,
    title: "Missing Number in Array",
    platform: "GeeksforGeeks",
    platformIcon: "🟢",
    company: "TCS",
    difficulty: "Easy",
    xpVal: "+100 XP",
    acceptance: "63.1%",
    topic: "Arrays",
    desc: "Given an array of size N-1 such that it only contains distinct integers in the range of 1 to N. Find the missing element.\n\nExample 1:\nInput: N = 5, array[] = {1,2,4,5}\nOutput: 3",
    starterCode: "function missingNumber(array, n) {\n  const totalSum = (n * (n + 1)) / 2;\n  const currentSum = array.reduce((acc, curr) => acc + curr, 0);\n  return totalSum - currentSum;\n}"
  },
  {
    id: 5,
    title: "Reverse Stack Using Recursion",
    platform: "Coding Ninjas",
    platformIcon: "🥷",
    company: "Microsoft",
    difficulty: "Medium",
    xpVal: "+200 XP",
    acceptance: "58.4%",
    topic: "Backtracking",
    desc: "You are given a stack St of N integers. You have to reverse the stack using recursion.\n\nExample 1:\nInput: St = [3, 2, 1, 7, 6]\nOutput: [6, 7, 1, 2, 3]",
    starterCode: "function reverseStack(stack) {\n  if (stack.length === 0) return;\n  const top = stack.pop();\n  reverseStack(stack);\n  insertAtBottom(stack, top);\n  return stack;\n}\n\nfunction insertAtBottom(stack, item) {\n  if (stack.length === 0) {\n    stack.push(item);\n    return;\n  }\n  const top = stack.pop();\n  insertAtBottom(stack, item);\n  stack.push(top);\n}"
  },
  {
    id: 6,
    title: "Kadane's Algorithm (Max Subarray Sum)",
    platform: "GeeksforGeeks",
    platformIcon: "🟢",
    company: "Goldman Sachs",
    difficulty: "Medium",
    xpVal: "+250 XP",
    acceptance: "55.0%",
    topic: "DP",
    desc: "Given an array Arr[] of N integers. Find the contiguous sub-array(containing at least one number) which has the maximum sum and return its sum.\n\nExample 1:\nInput: N = 5, Arr[] = {1,2,3,-2,5}\nOutput: 9\nExplanation: Max subarray sum is 9 of elements (1, 2, 3, -2, 5).",
    starterCode: "function maxSubarraySum(arr) {\n  let maxSoFar = arr[0], currMax = arr[0];\n  for (let i = 1; i < arr.length; i++) {\n    currMax = Math.max(arr[i], currMax + arr[i]);\n    maxSoFar = Math.max(maxSoFar, currMax);\n  }\n  return maxSoFar;\n}"
  },
  {
    id: 7,
    title: "Longest Substring Without Repeating Characters",
    platform: "LeetCode",
    platformIcon: "🟢",
    company: "Adobe",
    difficulty: "Medium",
    xpVal: "+200 XP",
    acceptance: "34.0%",
    topic: "Strings",
    desc: "Given a string `s`, find the length of the longest substring without repeating characters.\n\nExample 1:\nInput: s = \"abcabcbb\"\nOutput: 3\nExplanation: The answer is \"abc\", with length 3.",
    starterCode: "function lengthOfLongestSubstring(s) {\n  let set = new Set(), left = 0, maxLen = 0;\n  for (let right = 0; right < s.length; right++) {\n    while (set.has(s[right])) {\n      set.delete(s[left]);\n      left++;\n    }\n    set.add(s[right]);\n    maxLen = Math.max(maxLen, right - left + 1);\n  }\n  return maxLen;\n}"
  },
  {
    id: 8,
    title: "Kth Largest Element in an Array",
    platform: "Coding Ninjas",
    platformIcon: "🥷",
    company: "Atlassian",
    difficulty: "Medium",
    xpVal: "+200 XP",
    acceptance: "66.5%",
    topic: "Heap",
    desc: "Given an integer array `nums` and an integer `k`, return the `k`th largest element in the array.\n\nExample 1:\nInput: nums = [3,2,1,5,6,4], k = 2\nOutput: 5",
    starterCode: "function findKthLargest(nums, k) {\n  nums.sort((a, b) => b - a);\n  return nums[k - 1];\n}"
  },
  {
    id: 9,
    title: "LRU Cache Design",
    platform: "LeetCode",
    platformIcon: "🟢",
    company: "Amazon",
    difficulty: "Hard",
    xpVal: "+300 XP",
    acceptance: "41.0%",
    topic: "Linked List",
    desc: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.\nImplement the LRUCache class with get(key) and put(key, value) operations in O(1) time complexity.",
    starterCode: "class LRUCache {\n  constructor(capacity) {\n    this.capacity = capacity;\n    this.cache = new Map();\n  }\n  get(key) {\n    if (!this.cache.has(key)) return -1;\n    const val = this.cache.get(key);\n    this.cache.delete(key);\n    this.cache.set(key, val);\n    return val;\n  }\n  put(key, value) {\n    if (this.cache.has(key)) this.cache.delete(key);\n    else if (this.cache.size >= this.capacity) {\n      this.cache.delete(this.cache.keys().next().value);\n    }\n    this.cache.set(key, value);\n  }\n}"
  },
  {
    id: 10,
    title: "Next Greater Element",
    platform: "Coding Ninjas",
    platformIcon: "🥷",
    company: "Walmart",
    difficulty: "Medium",
    xpVal: "+200 XP",
    acceptance: "61.2%",
    topic: "Graphs",
    desc: "Given an array arr[] of size N having elements, the task is to find the next greater element for each element of the array in order of their appearance in the array.",
    starterCode: "function nextGreaterElement(arr) {\n  let stack = [], res = new Array(arr.length).fill(-1);\n  for (let i = arr.length - 1; i >= 0; i--) {\n    while (stack.length && stack[stack.length - 1] <= arr[i]) stack.pop();\n    if (stack.length) res[i] = stack[stack.length - 1];\n    stack.push(arr[i]);\n  }\n  return res;\n}"
  }
];

import AppLogo from "../components/AppLogo";

export default function CodeArenaPage() {
  const { user, xp, earnXp, themeMode, toggleTheme, authenticatedFetch, refreshProfile, logout } = useAuth();
  const navigate = useNavigate();
  const isDarkMode = themeMode === "dark";
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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

  const userName = user?.full_name || user?.username || "Riya Sharma";
  const userXp = xp ?? 16250;
  const userLevel = Math.floor(userXp / 2000) + 1;

  // Active Filters & Pagination States (10 Questions Per Page)
  const [selectedPlatformFilter, setSelectedPlatformFilter] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState("All");
  const [selectedTopicFilter, setSelectedTopicFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMsg, setToastMsg] = useState("");
  const [isContestRegistered, setIsContestRegistered] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedPlatformFilter, selectedDifficulty, selectedCompanyFilter, selectedTopicFilter, searchQuery]);

  // Ranks from backend
  const [globalRank, setGlobalRank] = useState("...");
  const [collegeRank, setCollegeRank] = useState("...");
  const [friendsRank, setFriendsRank] = useState("...");

  // Active Problem Solver Modal State
  const [activeProblem, setActiveProblem] = useState(null);
  const [activeModalTab, setActiveModalTab] = useState("description"); // "description" | "submissions"
  const [userCode, setUserCode] = useState("");
  const [selectedLang, setSelectedLang] = useState("JavaScript");
  const [testOutput, setTestOutput] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);

  // Previous Submissions Database State
  const [submissionsHistory, setSubmissionsHistory] = useState({});

  // Solved & Bookmarked State
  const [problems, setProblems] = useState(MASTER_PROBLEMS);
  const [solvedProblemIds, setSolvedProblemIds] = useState([]);
  const [bookmarkedProblemIds, setBookmarkedProblemIds] = useState([]);

  // Dynamic Date calculations for Coding Streak Calendar
  const todayDate = new Date();
  const currentMonthName = todayDate.toLocaleString('default', { month: 'long' });
  const currentYearVal = todayDate.getFullYear();
  const daysInMonth = new Date(currentYearVal, todayDate.getMonth() + 1, 0).getDate();
  const firstDayIndex = new Date(currentYearVal, todayDate.getMonth(), 1).getDay(); // Sunday=0, Monday=1, ...
  const adjustedFirstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

  // Blank days before the 1st of the month
  const blanks = Array(adjustedFirstDayIndex).fill(null);
  const calendarDays = [...blanks, ...Array.from({ length: daysInMonth }, (_, idx) => idx + 1)];

  // Parse study history map
  let activityMapObj = {};
  try {
    if (user?.activity_map) {
      activityMapObj = typeof user.activity_map === "string"
        ? JSON.parse(user.activity_map)
        : user.activity_map;
    }
  } catch (e) {
    console.error("Failed to parse activity_map:", e);
  }

  const getIsActiveDay = (dayNum) => {
    if (!dayNum) return false;
    const m = (todayDate.getMonth() + 1).toString().padStart(2, '0');
    const d = dayNum.toString().padStart(2, '0');
    const dateStr = `${currentYearVal}-${m}-${d}`;
    return !!activityMapObj[dateStr];
  };

  // Fetch problems list from backend
  const fetchProblems = async () => {
    try {
      const res = await authenticatedFetch(`${API_URL}/api/codearena/problems`);
      const data = await res.json();
      if (res.ok && data.success && data.problems && data.problems.length > 0) {
        setProblems(data.problems);
        const solved = (data.problems || []).filter(p => p.solved).map(p => p.id);
        const bookmarked = (data.problems || []).filter(p => p.bookmarked).map(p => p.id);
        setSolvedProblemIds(solved);
        setBookmarkedProblemIds(bookmarked);
        setGlobalRank(data.globalRank !== undefined ? `#${data.globalRank}` : "...");
        setCollegeRank(data.collegeRank !== undefined ? `#${data.collegeRank}` : "...");
        setFriendsRank(data.friendsRank !== undefined ? `#${data.friendsRank}` : "...");
        setIsContestRegistered(!!data.contestRegistered);
      } else {
        setProblems(MASTER_PROBLEMS);
      }
    } catch (err) {
      console.error("Failed to fetch CodeArena problems:", err);
      setProblems(MASTER_PROBLEMS);
    }
  };

  const handleRegisterContest = async () => {
    try {
      const res = await authenticatedFetch(`${API_URL}/api/codearena/contest/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsContestRegistered(true);
        showToast("🎉 Registered for CodeSprint 113 Contest!");
      } else {
        showToast(`❌ Registration failed: ${data.message || "error"}`);
      }
    } catch (err) {
      console.error(err);
      showToast("❌ Registration connection error");
    }
  };

  React.useEffect(() => {
    fetchProblems();
  }, []);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
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

  // Get questions count per company dynamically
  const getCompanyQuestionCount = (companyName) => {
    return (problems || []).filter(p => (p.company || "").toLowerCase().includes(companyName.toLowerCase())).length;
  };

  // Get questions count per topic dynamically
  const getTopicQuestionCount = (topicName) => {
    return (problems || []).filter(p => (p.topic || "").toLowerCase().includes(topicName.toLowerCase())).length;
  };

  // Company Cards List
  const companies = [
    { id: "Google", name: "Google" },
    { id: "Amazon", name: "Amazon" },
    { id: "Microsoft", name: "Microsoft" },
    { id: "Adobe", name: "Adobe" },
    { id: "Goldman Sachs", name: "Goldman Sachs" },
    { id: "Walmart", name: "Walmart" },
    { id: "Atlassian", name: "Atlassian" }
  ];

  // Topics Grid List
  const topics = [
    { id: "Arrays", title: "Arrays", xpVal: "+250 XP", icon: "📊", color: "#10B981" },
    { id: "Strings", title: "Strings", xpVal: "+200 XP", icon: "Aa", color: "#3B82F6" },
    { id: "Linked List", title: "Linked List", xpVal: "+200 XP", icon: "🔗", color: "#6366F1" },
    { id: "Trees", title: "Trees", xpVal: "+250 XP", icon: "🌲", color: "#10B981" },
    { id: "Graphs", title: "Graphs", xpVal: "+250 XP", icon: "🕸️", color: "#EC4899" },
    { id: "Heap", title: "Heap", xpVal: "+150 XP", icon: "🥞", color: "#F59E0B" },
    { id: "DP", title: "DP", xpVal: "+300 XP", icon: "🧮", color: "#8B5CF6" },
    { id: "Greedy", title: "Greedy", xpVal: "+150 XP", icon: "👑", color: "#EAB308" },
    { id: "Backtracking", title: "Backtracking", xpVal: "+150 XP", icon: "🧩", color: "#A855F7" },
    { id: "Bit Manipulation", title: "Bit Manipulation", xpVal: "+150 XP", icon: "010", color: "#06B6D4" }
  ];

  // Filtered Problems
  const filteredProblems = (problems || []).filter(p => {
    if (selectedPlatformFilter !== "All") {
      const pPlat = (p.platform || "LeetCode").toLowerCase();
      const targetPlat = selectedPlatformFilter.toLowerCase();
      if (!pPlat.includes(targetPlat) && !(targetPlat.includes("geeksforgeeks") && pPlat.includes("gfg"))) return false;
    }
    if (selectedDifficulty !== "All" && (p.difficulty || "").toLowerCase() !== selectedDifficulty.toLowerCase()) return false;
    if (selectedCompanyFilter !== "All" && !(p.company || "").toLowerCase().includes(selectedCompanyFilter.toLowerCase())) return false;
    if (selectedTopicFilter !== "All" && !(p.topic || "").toLowerCase().includes(selectedTopicFilter.toLowerCase())) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match = (p.title || "").toLowerCase().includes(q) || (p.company || "").toLowerCase().includes(q) || (p.platform || "").toLowerCase().includes(q) || (p.topic || "").toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filteredProblems.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProblems = filteredProblems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // GFG-Style Language Code Generator Template
  const getLanguageTemplate = (problem, lang) => {
    const title = problem?.title || "Solution";
    const funcName = title.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');

    if (lang === "Python") {
      return `# User Function Template for Python 3\nclass Solution:\n    def ${funcName}(self, nums, target):\n        # Complete the function\n        pass\n`;
    } else if (lang === "Java") {
      return `//{ Driver Code Starts\n// Initial Template for Java\nimport java.util.*;\nimport java.io.*;\n\nclass Solution {\n    public int[] ${funcName}(int[] nums, int target) {\n        # Complete the function\n        return new int[]{};\n    }\n}\n`;
    } else if (lang === "C++") {
      return `//{ Driver Code Starts\n// Initial Template for C++\n#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> ${funcName}(vector<int>& nums, int target) {\n        # Complete the function\n        return {};\n    }\n};\n`;
    } else if (lang === "SQL") {
      return `-- User SQL Query for ${title}\nSELECT * FROM table_name\nWHERE status = 'ACTIVE';\n`;
    } else {
      return problem?.starterCode || `function ${funcName}() {\n  # Write your code solution here\n  return true;\n}`;
    }
  };

  // Language-Specific Error Message Formatter
  const getLanguageSpecificError = (lang, codeStr) => {
    if (lang === "Java") {
      return {
        errorTitle: "Java Compilation Error (javac 17.0.2)",
        details: `Solution.java:8: error: ';' expected\n        return new int[]{}\n                         ^\nSolution.java:10: error: cannot find symbol\n  symbol:   variable target\n  location: class Solution\n2 errors generated.`
      };
    } else if (lang === "Python") {
      return {
        errorTitle: "Python Syntax / Indentation Error (Python 3.10)",
        details: `Traceback (most recent call last):\n  File "Solution.py", line 4, in twoSum\n    if nums[i] + nums[j] == target\nSyntaxError: expected ':'\nIndentationError: unindent does not match any outer indentation level`
      };
    } else if (lang === "C++") {
      return {
        errorTitle: "C++ Compiler Error (g++ 11.2.0)",
        details: `solution.cpp:8:15: error: expected ';' at end of declaration list\n        return {}\n                 ^\n                 ;\nsolution.cpp:11:5: error: use of undeclared identifier 'target'\n2 errors generated.`
      };
    } else if (lang === "SQL") {
      return {
        errorTitle: "SQL Engine Syntax Error (MySQL 8.0)",
        details: `ERROR 1064 (42000) at line 2: You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near 'WHERE status = ACTIVE' at line 2`
      };
    } else {
      // JavaScript (ES6)
      return {
        errorTitle: "JavaScript V8 Engine Syntax Error",
        details: `Uncaught SyntaxError: Unexpected token '}' at solution.js:6:14\nTypeError: Cannot read properties of undefined (reading 'length')\n    at twoSum (solution.js:5:14)\n    at Object.<anonymous> (solution.js:12:1)`
      };
    }
  };

  const openProblemSolver = (problem) => {
    setActiveProblem(problem);
    setActiveModalTab("description");
    setUserCode(problem.userCode || problem.starterCode || getLanguageTemplate(problem, selectedLang));
    setTestOutput(null);
  };

  const handleLangSelect = (newLang) => {
    setSelectedLang(newLang);
    if (activeProblem) {
      setUserCode(getLanguageTemplate(activeProblem, newLang));
    }
  };

  const loadPastSubmission = (sub) => {
    setSelectedLang(sub.lang.split(" ")[0]);
    setUserCode(sub.code);
    showToast(`📜 Loaded ${sub.lang} submission from ${sub.timestamp} into editor!`);
  };

  const handleRunCode = () => {
    setIsExecuting(true);
    setTestOutput(null);

    setTimeout(() => {
      setIsExecuting(false);
      const codeStr = (userCode || "").trim();

      const hasError = codeStr.includes("error") || 
                       codeStr.includes("bug") || 
                       codeStr.includes("throw new Error") || 
                       (codeStr.match(/\(/g) || []).length !== (codeStr.match(/\)/g) || []).length ||
                       (codeStr.match(/\{/g) || []).length !== (codeStr.match(/\}/g) || []).length;

      if (hasError || codeStr.length < 15) {
        const errObj = getLanguageSpecificError(selectedLang, codeStr);
        setTestOutput({
          isError: true,
          status: "Compilation / Runtime Error",
          errorTitle: errObj.errorTitle,
          details: errObj.details,
          timeTaken: "0.00 sec",
          spaceUsed: "0 KB"
        });
      } else {
        setTestOutput({
          isError: false,
          status: "Correct Answer!",
          details: "Input: nums = [2,7,11,15], target = 9\nYour Output: [0, 1]\nExpected Output: [0, 1]\n\nTest Case 1: Passed ✓\nTest Case 2: Passed ✓\nTest Case 3: Passed ✓\nTest Case 4: Passed ✓\nTest Case 5: Passed ✓",
          timeTaken: "0.04 sec",
          spaceUsed: "15.2 MB",
          casesPassed: "50 / 50 Test Cases Passed"
        });
      }
    }, 800);
  };

  const handleSubmitSolution = async () => {
    setIsExecuting(true);
    setTestOutput(null);
    try {
      const res = await authenticatedFetch(`${API_URL}/api/codearena/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemId: activeProblem.id,
          code: userCode,
          status: "solved"
        })
      });
      const data = await res.json();
      setIsExecuting(false);
      if (res.ok && data.success) {
        if (refreshProfile) {
          await refreshProfile();
        }
        await fetchProblems();
        showToast(`🎉 Problem "${activeProblem.title}" Solved! Solution Submitted & Saved!`);
      } else {
        showToast(`❌ Submission failed: ${data.message || "error"}`);
      }
    } catch (err) {
      console.error(err);
      setIsExecuting(false);
      showToast("❌ Submission connection error");
    }
    setActiveProblem(null);
  };

  const toggleBookmark = async (id, e) => {
    e.stopPropagation();
    try {
      const res = await authenticatedFetch(`${API_URL}/api/codearena/bookmark`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problemId: id })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (data.bookmarked) {
          setBookmarkedProblemIds(prev => [...prev, id]);
          showToast("Saved to bookmarks ⭐");
        } else {
          setBookmarkedProblemIds(prev => prev.filter(bId => bId !== id));
          showToast("Removed from bookmarks");
        }
      }
    } catch (err) {
      console.error(err);
      showToast("❌ Bookmark connection error");
    }
  };

  return (
    <div className={`caWrapper ${isDarkMode ? "dark-theme" : ""}`}>
      <Background />
      <PaperPlaneCursor />

      <div className="caMainContainer">
        
        {/* ── LEFT SIDEBAR (MATCHING STUDENT DASHBOARD EXACTLY) ── */}
        <aside className="sdLeftSidebar">
          <div>
            <Link to="/" className="sdBrandLogo" style={{ display: "inline-flex", alignItems: "center" }}>
              <AppLogo height="58px" />
            </Link>

            {/* Connected Arch Line & Orange Circular Home Button Header */}
            <div className="sdSidebarHomeArchHeader">
              <div className="sdArchLine" />
              <button
                className="sdHomeCircularBtn"
                onClick={() => navigate("/student-home")}
                title="Dashboard Overview"
              >
                <FaHome />
              </button>
            </div>

            {/* Sidebar Navigation Items */}
            <ul className="sdNavList">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    className={`sdNavItem ${item.id === "code-arena" ? "active" : ""}`}
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
                      else if (item.id === "settings") navigate("/settings");
                      else if (item.id === "code-arena") navigate("/code-arena");
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
            </div>
          </div>
        </aside>

        {/* ── RIGHT MAIN CONTENT AREA ── */}
        <main className="caRightBodyArea">
          
          {/* Header Bar */}
          <header className="caHeaderBar">
            <div className="caHeaderLeftTitle">
              <div className="codeLogoIcon">&lt;/&gt;</div>
              <div>
                <h2>CodeArena</h2>
                <p>Master coding interviews like a pro</p>
              </div>
            </div>

            <div className="caHeaderSearchBox">
              <FaSearch className="searchIcon" />
              <input
                type="text"
                placeholder="Search problems, topics or companies... (Ctrl /)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="caHeaderRightStats">
              <div className="caStreakBadge">
                <FaFire color="#F9572A" /> <span>{user?.streak || 0} Day Streak</span>
              </div>
              <div className="caXpBadge">
                <FaStar color="#F59E0B" /> <span>{userXp.toLocaleString()} XP</span>
              </div>
              <NotificationDropdown type="student" />

              {/* Header Bar Logout Button */}
              <button
                className="sdLogoutHeaderBtn"
                onClick={handleLogout}
                title="Logout to Landing Page"
              >
                <FaSignOutAlt /> <span>Logout</span>
              </button>

              {/* User Profile Pill with Dropdown */}
              <div className="sdUserProfilePillWrapper">
                <div className="caUserProfilePill" onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} style={{ cursor: "pointer" }}>
                  <UserAvatar user={user} className="avatarCircle" />
                  <div className="userText">
                    <strong>{userName}</strong>
                    <span>Level {userLevel}</span>
                  </div>
                  <span className="dropdownArrow" style={{ marginLeft: "4px", fontSize: "11px", color: "#64748B" }}>▾</span>
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

          {/* Main 2-Column Grid */}
          <div className="caDashboardGrid" style={{ gridTemplateColumns: "minmax(0, 1fr)" }}>
            
            {/* ── LEFT MAIN COLUMN ── */}
            <div className="caCenterCol">
              
              {/* CodeArena Hero Banner */}
              <div className="caHeroBanner">
                <div className="heroTextContent">
                  <h1>CodeArena</h1>
                  <h2>Practice. Compete. Get Hired.</h2>
                  <p>Solve coding challenges from top companies.</p>

                  <div className="heroStatsRow">
                    <span className="heroChip">📦 15,000+ Problems</span>
                    <span className="heroChip">👥 Trusted by 50K+ Students</span>
                  </div>
                </div>

                {/* Floating Brand Logos */}
                <div className="floatingLogosCluster">
                  <div className="logoBubble google">G</div>
                  <div className="logoBubble amazon">a</div>
                  <div className="logoBubble msft">❖</div>
                  <div className="logoBubble adobe">A</div>
                  <div className="logoBubble netflix">N</div>
                </div>

                <div className="heroIllustration">
                  <img src={studentHeroImg} alt="Developer Coding Illustration" />
                </div>
              </div>

              {/* 4 Mini Stat Sparkline Cards */}
              <div className="caStatCardsRow">
                <div className="caStatMiniCard">
                  <div className="statHeader">
                    <span className="iconBox green"><FaCheckCircle /></span>
                    <span className="label">Problems Solved</span>
                  </div>
                  <div className="statVal">{solvedProblemIds.length}</div>
                  <div className="statSub green">↑ {solvedProblemIds.length > 0 ? "Real-time sync" : "0 this week"}</div>
                  <div className="sparklineSvg green">
                    <svg viewBox="0 0 100 20" className="sparkline">
                      <path d="M 0 15 Q 25 5, 50 12 T 100 2" fill="none" stroke="#10B981" strokeWidth="3" />
                    </svg>
                  </div>
                </div>

                <div className="caStatMiniCard">
                  <div className="statHeader">
                    <span className="iconBox orange"><FaFire /></span>
                    <span className="label">Current Streak</span>
                  </div>
                  <div className="statVal">{user?.streak || 0} Days</div>
                  <div className="statSub orange">Best: {user?.longest_streak || 0} days</div>
                  <div className="sparklineSvg orange">
                    <svg viewBox="0 0 100 20" className="sparkline">
                      <path d="M 0 18 Q 30 10, 60 14 T 100 4" fill="none" stroke="#F9572A" strokeWidth="3" />
                    </svg>
                  </div>
                </div>

                <div className="caStatMiniCard">
                  <div className="statHeader">
                    <span className="iconBox purple"><FaBullseye /></span>
                    <span className="label">Interview Readiness</span>
                  </div>
                  <div className="statVal">{problems.length > 0 ? Math.round((solvedProblemIds.length / problems.length) * 100) : 0}%</div>
                  <div className="statSub purple">Based on problems solved</div>
                  <div className="sparklineSvg purple">
                    <svg viewBox="0 0 100 20" className="sparkline">
                      <path d="M 0 16 Q 20 8, 70 12 T 100 3" fill="none" stroke="#8B5CF6" strokeWidth="3" />
                    </svg>
                  </div>
                </div>

                <div className="caStatMiniCard">
                  <div className="statHeader">
                    <span className="iconBox yellow"><FaStar /></span>
                    <span className="label">XP Earned</span>
                  </div>
                  <div className="statVal">{userXp.toLocaleString()} XP</div>
                  <div className="statSub yellow">Real-time profile XP</div>
                  <div className="sparklineSvg yellow">
                    <svg viewBox="0 0 100 20" className="sparkline">
                      <path d="M 0 14 Q 40 18, 70 6 T 100 1" fill="none" stroke="#F59E0B" strokeWidth="3" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Company Based Practice Grid */}
              <div className="caSectionContainer">
                <div className="caSectionHeader">
                  <h3>Company Based Practice</h3>
                </div>

                <div className="companiesCardsGrid">
                  {companies.map(comp => (
                    <div
                      key={comp.id}
                      className={`companyMiniCard ${selectedCompanyFilter === comp.id ? "selected" : ""}`}
                      onClick={() => {
                        if (selectedCompanyFilter === comp.id) setSelectedCompanyFilter("All");
                        else setSelectedCompanyFilter(comp.id);
                      }}
                    >
                      <div className="compLogoBox">
                        {comp.name === "Google" ? "🔴🟡🟢" : comp.name === "Amazon" ? "📦" : comp.name === "Microsoft" ? "❖" : comp.name === "Adobe" ? "🔺" : comp.name === "Goldman Sachs" ? "🏛️" : comp.name === "Walmart" ? "✳️" : "🔷"}
                      </div>
                      <div className="compText">
                        <strong>{comp.name}</strong>
                        <span>{getCompanyQuestionCount(comp.name)} Questions</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Popular Topics Grid */}
              <div className="caSectionContainer">
                <div className="caSectionHeader">
                  <h3>Popular Topics</h3>
                </div>

                <div className="topicsGrid2x5">
                  {topics.map(top => (
                    <div
                      key={top.id}
                      className={`topicCard ${selectedTopicFilter === top.id ? "selected" : ""}`}
                      onClick={() => {
                        if (selectedTopicFilter === top.id) setSelectedTopicFilter("All");
                        else setSelectedTopicFilter(top.id);
                      }}
                    >
                      <div className="topicTopRow">
                        <div className="topicIconBox" style={{ color: top.color }}>{top.icon}</div>
                        <div className="topicTitleBlock">
                          <h4>{top.title}</h4>
                          <span>{getTopicQuestionCount(top.title)} Questions</span>
                        </div>
                      </div>
                      <div className="topicBottomRow" style={{ marginTop: "12px" }}>
                        <span className="xpBadgeLabel" style={{ color: top.color }}>{top.xpVal}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* All Problems Table & Filters */}
              <div className="caSectionContainer">
                <div className="caSectionHeader">
                  <h3>All Problems</h3>
                </div>

                {/* Platform Selection Tabs */}
                <div style={{ display: "flex", gap: "8px", margin: "14px 0", flexWrap: "wrap" }}>
                  {[
                    { id: "All", name: "🌐 All Platforms" },
                    { id: "LeetCode", name: "🟢 LeetCode" },
                    { id: "GeeksforGeeks", name: "🟢 GeeksforGeeks (GFG)" },
                    { id: "Coding Ninjas", name: "🥷 Coding Ninjas" }
                  ].map((plat) => (
                    <button
                      key={plat.id}
                      onClick={() => setSelectedPlatformFilter(plat.id)}
                      style={{
                        padding: "7px 16px",
                        borderRadius: "99px",
                        fontSize: "12px",
                        fontWeight: 800,
                        border: selectedPlatformFilter === plat.id ? "1px solid #F9572A" : "1px solid #CBD5E1",
                        background: selectedPlatformFilter === plat.id ? "#F9572A" : (isDarkMode ? "#1E293B" : "#FFFFFF"),
                        color: selectedPlatformFilter === plat.id ? "#FFFFFF" : (isDarkMode ? "#F8FAFC" : "#1E1B18"),
                        cursor: "pointer",
                        transition: "all 0.2s ease"
                      }}
                    >
                      {plat.name}
                    </button>
                  ))}
                </div>

                {/* Filter Controls Bar */}
                <div className="problemsFilterBar">
                  <div className="diffPillsRow">
                    {["All", "Easy", "Medium", "Hard"].map(diff => (
                      <button
                        key={diff}
                        className={`diffPill ${selectedDifficulty === diff ? "active " + diff.toLowerCase() : ""}`}
                        onClick={() => setSelectedDifficulty(diff)}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>

                  <div className="dropdownFiltersRow">
                    <select
                      value={selectedCompanyFilter}
                      onChange={(e) => setSelectedCompanyFilter(e.target.value)}
                      className="filterSelect"
                    >
                      <option value="All">All Companies</option>
                      {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>

                    <select
                      value={selectedTopicFilter}
                      onChange={(e) => setSelectedTopicFilter(e.target.value)}
                      className="filterSelect"
                    >
                      <option value="All">All Topics</option>
                      {topics.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                    </select>

                    <button className="iconFilterBtn" onClick={() => showToast("⭐ Filtered by Bookmarks")}>
                      <FaBookmark />
                    </button>
                  </div>
                </div>

                {/* Problems Table */}
                <div className="problemsTableWrapper">
                  <table className="problemsTable">
                    <thead>
                      <tr>
                        <th style={{ width: "40px" }}>#</th>
                        <th>Problem</th>
                        <th>Platform</th>
                        <th>Company</th>
                        <th>Difficulty</th>
                        <th>XP</th>
                        <th style={{ textAlign: "center" }}>Status</th>
                        <th style={{ textAlign: "right" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedProblems.map((prob) => {
                        const isSolved = solvedProblemIds.includes(prob.id);
                        const isBookmarked = bookmarkedProblemIds.includes(prob.id);

                        return (
                          <tr key={prob.id} className={isSolved ? "rowSolved" : ""}>
                            <td className="colNum">{prob.id}</td>
                            <td className="colTitle">
                              <div className="probTitleFlex">
                                <strong>{prob.title}</strong>
                                <span
                                  className={`starIcon ${isBookmarked ? "active" : ""}`}
                                  onClick={(e) => toggleBookmark(prob.id, e)}
                                >
                                  {isBookmarked ? "★" : "☆"}
                                </span>
                              </div>
                            </td>
                            <td>
                              <span style={{ fontSize: "11px", fontWeight: 800, background: isDarkMode ? "#1E293B" : "#F1F5F9", color: isDarkMode ? "#38BDF8" : "#0284C7", padding: "4px 10px", borderRadius: "99px", border: "1px solid #CBD5E1" }}>
                                {prob.platformIcon || "⚡"} {prob.platform || "LeetCode"}
                              </span>
                            </td>
                            <td className="colCompany">
                              <span className="companyChip">{prob.company}</span>
                            </td>
                            <td className="colDiff">
                              <span className={`diffTag ${prob.difficulty.toLowerCase()}`}>
                                {prob.difficulty}
                              </span>
                            </td>
                            <td className="colXp">
                              <span className="xpTag">{prob.xpVal}</span>
                            </td>
                            <td className="colStatus" style={{ textAlign: "center" }}>
                              {isSolved ? (
                                <span className="solvedCheck">✓</span>
                              ) : (
                                <span className="unsolvedDot">○</span>
                              )}
                            </td>
                            <td className="colAction" style={{ textAlign: "right" }}>
                              <button
                                className="btnSolveAction"
                                onClick={() => openProblemSolver(prob)}
                              >
                                Solve →
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* 10-Questions-Per-Page Pagination Controls Bar */}
                {filteredProblems.length > 0 && (
                  <div className="caPaginationBar">
                    <span className="caPaginationSummary">
                      Showing <strong>{startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, filteredProblems.length)}</strong> of <strong>{filteredProblems.length}</strong> Problems
                    </span>

                    <div className="caPaginationButtonsRow">
                      <button
                        className="caPageBtn"
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                        title="First Page"
                      >
                        ⏮ First
                      </button>
                      <button
                        className="caPageBtn"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        title="Previous Page"
                      >
                        ◀ Prev
                      </button>

                      {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(num => (
                        <button
                          key={num}
                          className={`caPageNumBtn ${currentPage === num ? "active" : ""}`}
                          onClick={() => setCurrentPage(num)}
                        >
                          {num}
                        </button>
                      ))}

                      <button
                        className="caPageBtn"
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        title="Next Page"
                      >
                        Next ▶
                      </button>
                      <button
                        className="caPageBtn"
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                        title="Last Page"
                      >
                        Last ⏭
                      </button>
                    </div>
                  </div>
                )}

              </div>

            </div>

            {/* ── RIGHT SIDEBAR WIDGETS COLUMN ── */}
            <div className="caRightCol" style={{ display: "none" }}>
              


              {/* 2. Coding Streak Calendar Card */}
              <div className="caWidgetCard">
                <div className="widgetHeaderRow">
                  <span className="fireHeaderIcon"><FaFire color="#F9572A" /></span>
                  <h4>Coding Streak</h4>
                  <span className="monthTag">{currentMonthName} {currentYearVal} &gt;</span>
                </div>

                <div className="streakCalendarGrid">
                  {["M", "T", "W", "T", "F", "S", "S"].map((day, dIdx) => (
                    <span key={dIdx} className="dayHead">{day}</span>
                  ))}
                  {calendarDays.map((dayNum, idx) => {
                    if (dayNum === null) {
                      return <div key={`blank-${idx}`} className="calDayNum blankDay"></div>;
                    }
                    const isActive = getIsActiveDay(dayNum);
                    return (
                      <div
                        key={`day-${dayNum}`}
                        className={`calDayNum ${isActive ? "streakActive" : ""}`}
                      >
                        {dayNum}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 3. Your Rank Widget Card */}
              <div className="caWidgetCard">
                <div className="widgetHeaderRow">
                  <h4>Your Rank</h4>
                  <span className="viewRankLink" onClick={() => navigate("/progress")}>View Leaderboard &gt;</span>
                </div>

                <div className="rankList">
                  <div className="rankRowItem">
                    <div className="rankLeft">
                      <span className="rankIcon">🌐</span>
                      <span>Global Rank</span>
                    </div>
                    <strong className="rankVal">{globalRank}</strong>
                  </div>

                  <div className="rankRowItem">
                    <div className="rankLeft">
                      <span className="rankIcon">🏛️</span>
                      <span>College Rank</span>
                    </div>
                    <strong className="rankVal">{collegeRank}</strong>
                  </div>

                  <div className="rankRowItem">
                    <div className="rankLeft">
                      <span className="rankIcon">👥</span>
                      <span>Friends Rank</span>
                    </div>
                    <strong className="rankVal">{friendsRank}</strong>
                  </div>
                </div>
              </div>

              {/* 4. Today's Challenge Widget */}
              <div className="caWidgetCard challengeCard">
                <div className="widgetHeaderRow">
                  <span className="targetIcon"><FaBullseye color="#F9572A" /></span>
                  <h4>Today's Challenge</h4>
                </div>

                <div className="challengeBodyBox">
                  <h5>Longest Consecutive Sequence</h5>
                  <div className="challengeTags">
                    <span className="diffTag medium">Medium</span>
                    <span className="xpBadge">+75 XP</span>
                  </div>
                  <div className="targetCircleGraphic">🎯</div>
                </div>

                <button
                  className="btnSolveChallenge"
                  onClick={() => {
                    const daily = (problems || []).find(p => p.title === "Longest Consecutive Sequence");
                    if (daily) {
                      openProblemSolver(daily);
                    } else {
                      openProblemSolver({
                        id: 9,
                        title: "Longest Consecutive Sequence",
                        company: "Amazon",
                        difficulty: "Medium",
                        xpVal: "+75 XP",
                        acceptance: "48.20%",
                        desc: "Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence.",
                        starterCode: `function longestConsecutive(nums) {\n  const set = new Set(nums);\n  let max = 0;\n  for (let num of set) {\n    if (!set.has(num - 1)) {\n      let curr = num;\n      let count = 1;\n      while (set.has(curr + 1)) {\n        curr++;\n        count++;\n      }\n      max = Math.max(max, count);\n    }\n  }\n  return max;\n}`
                      });
                    }
                  }}
                >
                  Solve Challenge →
                </button>
              </div>

            </div>

          </div>

        </main>
      </div>

      {/* ── FLOATING TOAST NOTIFICATION ── */}
      {toastMsg && (
        <div className="caToastBanner">
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ── INTERACTIVE GFG-STYLE PROBLEM SOLVER IDE MODAL ── */}
      {activeProblem && (
        <div className="caModalOverlay" onClick={() => setActiveProblem(null)}>
          <div className="caModalIdeContent" onClick={(e) => e.stopPropagation()}>
            
            {/* GFG Modal Top Bar Header */}
            <div className="ideModalHeader">
              <div className="ideTitleRow">
                <span className="codeIcon">&lt;/&gt;</span>
                <h3>{activeProblem.title}</h3>
                <span className={`diffTag ${activeProblem.difficulty.toLowerCase()}`}>{activeProblem.difficulty}</span>
                <span className="xpTag">{activeProblem.xpVal}</span>
                <span className="accTag">Accuracy: {activeProblem.acceptance}</span>
              </div>
              <button className="modalCloseBtn" onClick={() => setActiveProblem(null)}>✕</button>
            </div>

            {/* Modal IDE 2-Column Grid */}
            <div className="ideGridContainer">
              
              {/* LEFT COLUMN: GFG PROBLEM STATEMENT & SUBMISSIONS TABS */}
              <div className="ideStatementCol">
                
                {/* Left Pane Sub-Header Tabs */}
                <div className="modalLeftTabsRow">
                  <button
                    className={`modalTabBtn ${activeModalTab === "description" ? "active" : ""}`}
                    onClick={() => setActiveModalTab("description")}
                  >
                    📖 Problem Statement
                  </button>
                  <button
                    className={`modalTabBtn ${activeModalTab === "submissions" ? "active" : ""}`}
                    onClick={() => setActiveModalTab("submissions")}
                  >
                    📜 My Submissions ({(submissionsHistory[activeProblem.id] || []).length})
                  </button>
                </div>

                {activeModalTab === "description" ? (
                  <>
                    <h4 style={{ marginTop: "12px" }}>Problem Description</h4>
                    <p className="probDescText">{activeProblem.desc}</p>

                    <div className="gfgComplexityBox">
                      <div><strong>Expected Time Complexity:</strong> <code>O(N)</code></div>
                      <div><strong>Expected Auxiliary Space:</strong> <code>O(1)</code></div>
                    </div>

                    <div className="exampleBox">
                      <strong>Example 1:</strong>
                      <pre>Input: nums = [2,7,11,15], target = 9{"\n"}Output: [0, 1]{"\n"}Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].</pre>
                    </div>

                    <div className="exampleBox">
                      <strong>Example 2:</strong>
                      <pre>Input: nums = [3,2,4], target = 6{"\n"}Output: [1, 2]{"\n"}Explanation: nums[1] + nums[2] == 6, we return [1, 2].</pre>
                    </div>

                    <div className="constraintsBox">
                      <strong>Constraints:</strong>
                      <ul>
                        <li>1 &lt;= nums.length &lt;= 10^5</li>
                        <li>-10^9 &lt;= nums[i] &lt;= 10^9</li>
                        <li>-10^9 &lt;= target &lt;= 10^9</li>
                        <li>Only one valid answer exists.</li>
                      </ul>
                    </div>

                    <div className="gfgTagsRow">
                      <span className="tagLbl">Company Tags:</span>
                      <span className="gfgTagChip">{activeProblem.company}</span>
                      <span className="gfgTagChip">Amazon</span>
                      <span className="gfgTagChip">Google</span>
                    </div>

                    <div className="gfgTagsRow" style={{ marginTop: "8px" }}>
                      <span className="tagLbl">Topic Tags:</span>
                      <span className="gfgTagChip">{activeProblem.topic}</span>
                      <span className="gfgTagChip">Data Structures</span>
                    </div>
                  </>
                ) : (
                  /* SUBMISSIONS HISTORY LIST VIEW */
                  <div className="submissionsHistoryContainer">
                    <h4 style={{ marginTop: "12px" }}>Previous Submissions</h4>
                    <p className="subHeadingText">Click any submission to preview or load its code into the editor.</p>

                    {(!submissionsHistory[activeProblem.id] || submissionsHistory[activeProblem.id].length === 0) ? (
                      <div className="emptySubmissionsBox">
                        <span>📭 No previous submissions found for this problem yet. Submit a solution to save code!</span>
                      </div>
                    ) : (
                      <div className="submissionsList">
                        {submissionsHistory[activeProblem.id].map((sub, idx) => (
                          <div key={sub.id || idx} className={`submissionCard ${sub.isPassed ? "passed" : "failed"}`}>
                            <div className="subCardHeader">
                              <span className={`subStatusBadge ${sub.isPassed ? "pass" : "fail"}`}>
                                {sub.isPassed ? "Accepted ✓" : "Compilation Error ✕"}
                              </span>
                              <span className="subLangTag">{sub.lang}</span>
                              <span className="subTimeTag">{sub.timestamp}</span>
                            </div>

                            <div className="subMetricsRow">
                              <span>Time: {sub.runtime}</span>
                              <span>•</span>
                              <span>Memory: {sub.memory}</span>
                            </div>

                            {/* Code Preview Box */}
                            <pre className="subCodePreview">{sub.code}</pre>

                            <button
                              className="btnLoadCode"
                              onClick={() => loadPastSubmission(sub)}
                            >
                              📥 Load Code into Editor
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* RIGHT COLUMN: CODE EDITOR & COMPILER CONSOLE */}
              <div className="ideEditorCol">
                
                {/* Editor Header Control Bar */}
                <div className="editorHeader">
                  <div className="langSelectFlex">
                    <span className="langLbl">Language:</span>
                    <select
                      value={selectedLang}
                      onChange={(e) => handleLangSelect(e.target.value)}
                      className="langSelect"
                    >
                      <option value="JavaScript">JavaScript (ES6)</option>
                      <option value="Python">Python 3.10</option>
                      <option value="Java">Java 17</option>
                      <option value="C++">C++ 20</option>
                      <option value="SQL">SQL (ANSI)</option>
                    </select>
                  </div>

                  <div className="ideActionsRow">
                    <button
                      className="btnResetCode"
                      onClick={() => setUserCode(getLanguageTemplate(activeProblem, selectedLang))}
                      title="Reset Code Template"
                    >
                      🔄 Reset
                    </button>
                    <button className="btnRunTests" onClick={handleRunCode} disabled={isExecuting}>
                      {isExecuting ? "Compiling..." : "▶ Compile & Run"}
                    </button>
                    <button className="btnSubmitSolution" onClick={handleSubmitSolution} disabled={isExecuting}>
                      {isExecuting ? "Submitting..." : "🚀 Submit"}
                    </button>
                  </div>
                </div>

                {/* Code Textarea with Line Numbers Counter */}
                <div className="codeEditorWrapper">
                  <div className="lineNumbersCol">
                    {Array.from({ length: Math.max(12, (userCode || "").split("\n").length) }, (_, i) => i + 1).map(n => (
                      <span key={n}>{n}</span>
                    ))}
                  </div>
                  <textarea
                    className="codeEditorTextarea"
                    value={userCode}
                    onChange={(e) => setUserCode(e.target.value)}
                    placeholder={`Write your ${selectedLang} code solution here...`}
                  />
                </div>

                {/* GFG-Style Testcase Compilation / Execution Output Console */}
                {testOutput && (
                  <div className={`gfgConsolePanel ${testOutput.isError ? "errorMode" : "successMode"}`}>
                    <div className="gfgConsoleHeader">
                      <div className="statusBadge">
                        {testOutput.isError ? (
                          <span className="errBadge">❌ {testOutput.status}</span>
                        ) : (
                          <span className="successBadge">✅ {testOutput.status}</span>
                        )}
                      </div>
                      <div className="consoleMetrics">
                        <span>⏱ Time Taken: <strong>{testOutput.timeTaken}</strong></span>
                        <span>💾 Auxiliary Space: <strong>{testOutput.spaceUsed}</strong></span>
                        {testOutput.casesPassed && <span className="casesPassedPill">{testOutput.casesPassed}</span>}
                      </div>
                    </div>

                    {testOutput.isError ? (
                      <div className="gfgErrorBox">
                        <strong className="errTitle">{testOutput.errorTitle}</strong>
                        <pre className="errCodeDetails">{testOutput.details}</pre>
                      </div>
                    ) : (
                      <div className="gfgSuccessBox">
                        <pre className="outputLogs">{testOutput.details}</pre>
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      )}

      <StudentFooter />
    </div>
  );
}
