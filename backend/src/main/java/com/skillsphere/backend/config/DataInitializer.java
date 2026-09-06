package com.skillsphere.backend.config;

import com.skillsphere.backend.model.Comment;
import com.skillsphere.backend.model.Post;
import com.skillsphere.backend.model.User;
import com.skillsphere.backend.model.Employee;
import com.skillsphere.backend.model.Project;
import com.skillsphere.backend.model.LeaveRequest;
import com.skillsphere.backend.repository.PostRepository;
import com.skillsphere.backend.repository.UserRepository;
import com.skillsphere.backend.repository.EmployeeRepository;
import com.skillsphere.backend.repository.ProjectRepository;
import com.skillsphere.backend.repository.LeaveRequestRepository;
import com.skillsphere.backend.model.Quest;
import com.skillsphere.backend.repository.QuestRepository;
import com.skillsphere.backend.model.Course;
import com.skillsphere.backend.repository.CourseRepository;
import com.skillsphere.backend.model.Assignment;
import com.skillsphere.backend.repository.AssignmentRepository;
import com.skillsphere.backend.model.CodeArenaProblem;
import com.skillsphere.backend.repository.CodeArenaProblemRepository;
import com.skillsphere.backend.model.Opportunity;
import com.skillsphere.backend.repository.OpportunityRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Optional;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final EmployeeRepository employeeRepository;
    private final ProjectRepository projectRepository;
    private final LeaveRequestRepository leaveRequestRepository;
    private final QuestRepository questRepository;
    private final CourseRepository courseRepository;
    private final AssignmentRepository assignmentRepository;
    private final CodeArenaProblemRepository codeArenaProblemRepository;
    private final OpportunityRepository opportunityRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public DataInitializer(
            UserRepository userRepository,
            PostRepository postRepository,
            EmployeeRepository employeeRepository,
            ProjectRepository projectRepository,
            LeaveRequestRepository leaveRequestRepository,
            QuestRepository questRepository,
            CourseRepository courseRepository,
            AssignmentRepository assignmentRepository,
            CodeArenaProblemRepository codeArenaProblemRepository,
            OpportunityRepository opportunityRepository,
            BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.postRepository = postRepository;
        this.employeeRepository = employeeRepository;
        this.projectRepository = projectRepository;
        this.leaveRequestRepository = leaveRequestRepository;
        this.questRepository = questRepository;
        this.courseRepository = courseRepository;
        this.assignmentRepository = assignmentRepository;
        this.codeArenaProblemRepository = codeArenaProblemRepository;
        this.opportunityRepository = opportunityRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Seed default test users
        createTestUserIfMissing("sroy", "S Roy", "sroy@gmail.com", "1234", "STUDENT");
        createTestUserIfMissing("student_demo", "Student Demo", "student@gmail.com", "1234", "STUDENT");
        createTestUserIfMissing("student", "Student Demo", "student@skillsphere.com", "1234", "STUDENT");
        createTestUserIfMissing("employee", "Employee Demo", "employee@skillsphere.com", "1234", "EMPLOYEE");
        createTestUserIfMissing("manager", "Manager Demo", "manager@company.com", "1234", "EMPLOYEE");
        createTestUserIfMissing("workforce", "Workforce Demo", "workforce@company.com", "1234", "EMPLOYEE");

        // Seed initial posts and comments if database is empty
        if (postRepository.count() == 0) {
            seedDefaultPosts();
        }

        // Seed default employees
        if (employeeRepository.count() == 0) {
            employeeRepository.save(new Employee("Jane Doe", "Full-Stack Engineer", "Engineering", "Active", 92));
            employeeRepository.save(new Employee("Mark Smith", "Product Manager", "Product", "Active", 88));
            employeeRepository.save(new Employee("NeonCoder", "UX Developer", "Design", "Active", 95));
            employeeRepository.save(new Employee("Sarah Jenkins", "DevOps specialist", "Infrastructure", "On Leave", 85));
            System.out.println("✅ DataInitializer: Seeded default employees");
        }

        // Seed default projects
        if (projectRepository.count() == 0) {
            projectRepository.save(new Project("SkillSphere Mobile Platform Upgrade", "NeonCoder", 60, "High"));
            projectRepository.save(new Project("OAuth2 & JWT Token Upgrades", "Jane Doe", 35, "Medium"));
            projectRepository.save(new Project("Vite 6 Migration Strategy", "Sarah Jenkins", 80, "Low"));
            System.out.println("✅ DataInitializer: Seeded default projects");
        }

        // Seed default leave requests
        if (leaveRequestRepository.count() == 0) {
            leaveRequestRepository.save(new LeaveRequest("Sarah Jenkins", "Sick Leave", "Requires 2 days off following dental surgery. (June 18-19)", "PENDING"));
            leaveRequestRepository.save(new LeaveRequest("Mark Smith", "Casual Leave", "Annual family getaway (3 days). (July 2-4)", "PENDING"));
            System.out.println("✅ DataInitializer: Seeded default leave requests");
        }

        // Seed default quests
        if (questRepository.count() == 0) {
            questRepository.save(new Quest("Log in and maintain your daily streak", 50));
            questRepository.save(new Quest("Complete the React architecture practice quiz", 150));
            questRepository.save(new Quest("Solve the Spring Boot security challenge", 200));
            System.out.println("✅ DataInitializer: Seeded default quests");
        }

        // Seed default courses
        if (courseRepository.count() == 0) {
            courseRepository.save(new Course("Frontend System Design", "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop", true, 999, "English", "4.8", "5K+", "Go from Zero to Hero in Frontend System Design. Master large-scale application architecture."));
            courseRepository.save(new Course("React", "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=400&fit=crop", true, 499, "English", "4.7", "40K+", "Master React.js. Learn from the ground up and build real-world applications with ease."));
            courseRepository.save(new Course("JavaScript", "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=600&h=400&fit=crop", false, 0, "English", "4.8", "50K+", "A pure in-depth JavaScript Course released for Free."));
            courseRepository.save(new Course("Data Structures & Algorithms (DSA)", "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=600&h=400&fit=crop", true, 1499, "English", "4.9", "100K+", "Comprehensive DSA bootcamp for FAANG interviews. Covers arrays, trees, dynamic programming and more."));
            courseRepository.save(new Course("Generative AI Engineering", "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&h=400&fit=crop", true, 1999, "English", "4.9", "12K+", "Learn to build LLM applications, RAG pipelines, and integrate AI into your software."));
            courseRepository.save(new Course("Machine Learning Foundations", "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&h=400&fit=crop", false, 0, "English", "4.6", "25K+", "A beginner-friendly guide to Machine Learning concepts, models, and Python implementation."));
            courseRepository.save(new Course("Advanced Node.js & Microservices", "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop", true, 799, "English", "4.7", "18K+", "Scale your backend architecture. Learn Docker, Kubernetes, and Node.js microservices."));
            courseRepository.save(new Course("Fullstack Next.js 14", "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop", true, 1299, "English", "4.8", "30K+", "Build SEO-friendly, highly performant web applications using App Router and Server Actions."));
            courseRepository.save(new Course("Web3 & Solidity Development", "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=600&h=400&fit=crop", true, 1999, "English", "4.5", "8K+", "Master blockchain development, smart contracts, and decentralized application (dApp) design."));
            courseRepository.save(new Course("Cloud Computing with AWS", "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop", false, 0, "English", "4.7", "55K+", "Get certified. Learn EC2, S3, Lambda, and complete AWS infrastructure management."));
            courseRepository.save(new Course("Python for Data Science", "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop", true, 899, "English", "4.8", "60K+", "Master Pandas, NumPy, Matplotlib, and data analysis techniques using Python."));
            courseRepository.save(new Course("UI/UX Design Masterclass", "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop", true, 699, "English", "4.9", "22K+", "Learn Figma, design thinking, user research, and build stunning user interfaces."));
            System.out.println("✅ DataInitializer: Seeded default courses");
        }

        // Seed default assignments
        if (assignmentRepository.count() == 0) {
            assignmentRepository.save(new Assignment(
                "Build a React Todo App", "Project", "React Developer Path • Module 3", "react", "2",
                "Create a fully functional Todo application in React with filters, persistent local storage, and custom themes.",
                "Medium", "150 XP", "Individual", "2 days", "Oct 15, 2026", "⚛️", "#00e5ff1b", "#00e5ff"
            ));
            assignmentRepository.save(new Assignment(
                "Data Analysis with Pandas", "Quiz", "Python Data Science • Module 2", "python", "11",
                "Clean, manipulate, and analyze a real-world dataset of global temperatures using pandas and numpy.",
                "Hard", "200 XP", "Individual", "5 days", "Oct 18, 2026", "🐼", "#f973161b", "#f97316"
            ));
            assignmentRepository.save(new Assignment(
                "REST API with Node.js", "Project", "Backend Architect Path • Module 4", "node", "7",
                "Build a secure RESTful API using Node.js, Express, and PostgreSQL with JWT-based authentication.",
                "Hard", "250 XP", "Individual", "1 week", "Oct 22, 2026", "🟢", "#22c55e1b", "#22c55e"
            ));
            assignmentRepository.save(new Assignment(
                "Redesign Dashboard UI", "Design", "UI/UX Masterclass • Module 1", "uiux", "12",
                "Create a high-fidelity Figma prototype for a futuristic learning dashboard with interactive dark mode states.",
                "Medium", "120 XP", "Pair", "3 days", "Oct 16, 2026", "🎨", "#a855f71b", "#a855f7"
            ));
            assignmentRepository.save(new Assignment(
                "JavaScript Quiz Challenge", "Quiz", "JavaScript Basics • Module 1", "javascript", "3",
                "Solve 20 advanced JavaScript coding snippets under 10 minutes covering closure, hoisting, and event loop.",
                "Medium", "80 XP", "Individual", "Expired", "Sep 30, 2026", "JS", "#eab3081b", "#eab308"
            ));
            assignmentRepository.save(new Assignment(
                "Video Presentation Project Walkthrough", "Video", "Fullstack Architect • Module 5", "fsd", "1",
                "Record and submit a 3-minute video presentation (YouTube/Loom URL) showing your system architecture and live walkthrough of your deployed application.",
                "Medium", "150 XP", "Individual", "4 days", "Oct 17, 2026", "📹", "#ff00c81b", "#ff00c8"
            ));
            System.out.println("✅ DataInitializer: Seeded default assignments");
        }

        if (codeArenaProblemRepository.count() == 0) {
            seedCodeArenaProblem("Two Sum", "Amazon", "Easy", 20, "58.23%",
                "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
                "function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const diff = target - nums[i];\n    if (map.has(diff)) return [map.get(diff), i];\n    map.set(nums[i], i);\n  }\n  return [];\n}", "Arrays");

            seedCodeArenaProblem("Merge Intervals", "Google", "Medium", 50, "41.15%",
                "Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals.",
                "function merge(intervals) {\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) last[1] = Math.max(last[1], intervals[i][1]);\n    else res.push(intervals[i]);\n  }\n  return res;\n}", "Arrays");

            seedCodeArenaProblem("LRU Cache", "Microsoft", "Hard", 100, "22.31%",
                "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.",
                "class LRUCache {\n  constructor(capacity) {\n    this.capacity = capacity;\n    this.map = new Map();\n  }\n  get(key) {\n    if (!this.map.has(key)) return -1;\n    const val = this.map.get(key);\n    this.map.delete(key);\n    this.map.set(key, val);\n    return val;\n  }\n}", "Linked List");

            seedCodeArenaProblem("Sliding Window Maximum", "Adobe", "Hard", 120, "18.12%",
                "You are given an array of integers nums, there is a sliding window of size k moving from left to right.",
                "function maxSlidingWindow(nums, k) {\n  const q = [];\n  const res = [];\n  for (let i = 0; i < nums.length; i++) {\n    while (q.length && q[q.length - 1] < nums[i]) q.pop();\n    q.push(nums[i]);\n    if (i >= k - 1) {\n      res.push(q[0]);\n      if (nums[i - k + 1] === q[0]) q.shift();\n    }\n  }\n  return res;\n}", "Heap");

            seedCodeArenaProblem("Rotate Array", "Walmart", "Easy", 15, "64.81%",
                "Given an integer array nums, rotate the array to the right by k steps, where k is non-negative.",
                "function rotate(nums, k) {\n  k %= nums.length;\n  nums.unshift(...nums.splice(nums.length - k));\n}", "Arrays");

            seedCodeArenaProblem("Trapping Rain Water", "Amazon", "Hard", 150, "20.45%",
                "Given n non-negative integers representing an elevation map where width of each bar is 1, compute how much water it can trap after raining.",
                "function trap(height) {\n  let left = 0, right = height.length - 1, res = 0;\n  let maxLeft = 0, maxRight = 0;\n  while (left < right) {\n    if (height[left] <= height[right]) {\n      if (height[left] >= maxLeft) maxLeft = height[left];\n      else res += maxLeft - height[left];\n      left++;\n    } else {\n      if (height[right] >= maxRight) maxRight = height[right];\n      else res += maxRight - height[right];\n      right--;\n    }\n  }\n  return res;\n}", "DP");

            seedCodeArenaProblem("Valid Anagram", "Meta", "Easy", 15, "68.90%",
                "Given two strings s and t, return true if t is an anagram of s, and false otherwise.",
                "function isAnagram(s, t) {\n  if (s.length !== t.length) return false;\n  const count = {};\n  for (let c of s) count[c] = (count[c] || 0) + 1;\n  for (let c of t) {\n    if (!count[c]) return false;\n    count[c]--;\n  }\n  return true;\n}", "Strings");

            seedCodeArenaProblem("Binary Tree Level Order Traversal", "Goldman Sachs", "Medium", 60, "52.10%",
                "Given the root of a binary tree, return the level order traversal of its nodes' values.",
                "function levelOrder(root) {\n  if (!root) return [];\n  const res = [], q = [root];\n  while (q.length) {\n    const size = q.length, level = [];\n    for (let i = 0; i < size; i++) {\n      const curr = q.shift();\n      level.push(curr.val);\n      if (curr.left) q.push(curr.left);\n      if (curr.right) q.push(curr.right);\n    }\n    res.push(level);\n  }\n  return res;\n}", "Trees");

            seedCodeArenaProblem("Longest Consecutive Sequence", "Amazon", "Medium", 75, "48.20%",
                "Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence.",
                "function longestConsecutive(nums) {\n  const set = new Set(nums);\n  let max = 0;\n  for (let num of set) {\n    if (!set.has(num - 1)) {\n      let curr = num;\n      let count = 1;\n      while (set.has(curr + 1)) {\n        curr++;\n        count++;\n      }\n      max = Math.max(max, count);\n    }\n  }\n  return max;\n}", "Arrays");

            System.out.println("✅ DataInitializer: Seeded default CodeArena problems");
        }

        if (opportunityRepository.count() == 0) {
            opportunityRepository.save(new Opportunity("Software Development Intern", "Microsoft", "Internship", "❖", "#0078D4", "Work on real-world projects with Azure and .NET backend architectures.", "Hyderabad, India", "2h ago"));
            opportunityRepository.save(new Opportunity("STEP Intern 2025", "Google", "Internship", "G", "#EA4335", "STEP is a developmental internship for first and second-year undergraduate students.", "Bangalore, India", "5h ago"));
            opportunityRepository.save(new Opportunity("Smart India Hackathon 2025", "National Level", "Hackathon", "IN", "#F97316", "SIH is a nationwide initiative to provide students with a platform to solve some of the pressing problems.", "Online / Hybrid", "1d ago"));
            System.out.println("✅ DataInitializer: Seeded default opportunities");
        }
    }

    private void createTestUserIfMissing(String username, String fullName, String email, String password, String role) {
        Optional<User> opt = userRepository.findByEmail(email);
        if (opt.isEmpty()) {
            User user = new User();
            user.setUsername(username);
            user.setFullName(fullName);
            user.setEmail(email);
            user.setPasswordHash(passwordEncoder.encode(password));
            user.setRole(role);
            user.setProvider("LOCAL");
            user.setIsActive(true);
            user.setXp(0);
            user.setStreak(0);
            user.setLongestStreak(0);
            user.setTotalStudyTime(0);
            user.setLastLoginAt(LocalDateTime.now());
            userRepository.save(user);
            System.out.println("✅ DataInitializer: Created test user -> " + email);
        } else {
            User user = opt.get();
            boolean updated = false;
            if (user.getPasswordHash() == null || !passwordEncoder.matches(password, user.getPasswordHash())) {
                user.setPasswordHash(passwordEncoder.encode(password));
                user.setProvider("LOCAL");
                updated = true;
            }
            if (!Boolean.TRUE.equals(user.getIsActive())) {
                user.setIsActive(true);
                updated = true;
            }
            if (updated) {
                userRepository.save(user);
                System.out.println("✅ DataInitializer: Reset password and active status for test user -> " + email);
            }
        }
    }

    private void seedDefaultPosts() {
        Post post1 = new Post(
            "Alexis Mangin", "A", "Frontend Architect", "System Design",
            "How do you handle micro-frontend state sync across independent React apps?",
            "When splitting a large monolithic web application into micro-frontends using Webpack Module Federation, what is your preferred approach for sharing global auth tokens and theme states without tight coupling?"
        );
        post1.setUpvotes(24);
        post1.getComments().add(new Comment("CypherLearner", "We use CustomEvent bus on the window object combined with RxJS behavior subjects for decoupled pub/sub events!"));
        post1.getComments().add(new Comment("NeonCoder", "Single-SPA with shared React Context wrappers works great for auth headers."));

        Post post2 = new Post(
            "Hitesh Choudhary", "H", "Senior Educator", "React & Frontend",
            "Common React 19 useActionState gotchas for beginners",
            "React 19 introduces useActionState and Server Actions. Make sure you return structured objects containing error messages and pending states instead of mutating local component state manually!"
        );
        post2.setUpvotes(42);
        post2.getComments().add(new Comment("ByteKnight", "Super helpful tip! The optimistic UI updates with useOptimistic are also incredible."));

        Post post3 = new Post(
            "Andrew Ng", "A", "AI Lead", "Generative AI",
            "RAG vs Fine-Tuning: Which should you choose for enterprise docs?",
            "If your underlying knowledge base changes daily or weekly, RAG (Retrieval Augmented Generation) with Vector DBs like Pinecone/FAISS is far superior and more cost-effective than continuous LLM fine-tuning."
        );
        post3.setUpvotes(56);
        post3.getComments().add(new Comment("SynthGuru", "Agreed! HyDE (Hypothetical Document Embeddings) improved our RAG precision by 30%."));

        Post post4 = new Post(
            "Java Guru", "J", "Backend Lead", "Java & Backend",
            "Spring Boot Virtual Threads (Project Loom) performance benchmark",
            "Switching from standard Tomcat thread pools to Spring Boot 3.2 Virtual Threads handled 10,000 concurrent HTTP requests with 80% less memory allocation on JRE 21!"
        );
        post4.setUpvotes(31);

        postRepository.save(post1);
        postRepository.save(post2);
        postRepository.save(post3);
        postRepository.save(post4);

        System.out.println("✅ DataInitializer: Seeded default discussions posts");
    }

    private void seedCodeArenaProblem(String title, String company, String difficulty, Integer xpVal, String acceptance, String description, String starterCode, String topic) {
        CodeArenaProblem prob = new CodeArenaProblem();
        prob.setTitle(title);
        prob.setCompany(company);
        prob.setDifficulty(difficulty);
        prob.setXpVal(xpVal);
        prob.setAcceptance(acceptance);
        prob.setDescription(description);
        prob.setStarterCode(starterCode);
        prob.setTopic(topic);
        codeArenaProblemRepository.save(prob);
    }
}
