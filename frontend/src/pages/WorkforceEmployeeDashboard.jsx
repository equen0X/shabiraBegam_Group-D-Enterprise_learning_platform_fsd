import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AppLogo from "../components/AppLogo";
import Background from "../components/Background";
import {
  FaHome,
  FaShieldAlt,
  FaClock,
  FaSignOutAlt,
  FaPlus,
  FaCheckCircle,
  FaHourglassHalf,
  FaSun,
  FaMoon,
  FaLock,
  FaUnlock,
  FaTrophy,
  FaCertificate,
  FaBolt,
  FaFilePdf,
  FaLinkedin,
  FaArrowRight,
  FaArrowLeft,
  FaExclamationTriangle
} from "react-icons/fa";
import "../styles/workforceDashboard.css";

export default function WorkforceEmployeeDashboard() {
  const { user, logout, authenticatedFetch, themeMode, toggleTheme, earnXp } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Overview");
  const [isSidebarOpen] = useState(true);

  // API URL
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Leave Requests state synced with backend database
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [newLeave, setNewLeave] = useState({ type: "Casual Leave", startDate: "", endDate: "", reason: "" });
  const [showApplyLeaveModal, setShowApplyLeaveModal] = useState(false);

  // Interactive Assessments state (30 difficult questions per topic, total 120 questions)
  const [assessments, setAssessments] = useState([
    {
      id: "js",
      title: "JavaScript Engine & Core Architecture",
      duration: "30 mins",
      xpReward: 300,
      passed: false,
      questions: [
        { q: "Which event loop phase executes setImmediate() callbacks?", options: ["Timers phase", "Poll phase", "Check phase", "Close callbacks phase"], answer: 2 },
        { q: "What is the output of 'typeof null' in standard ECMAScript?", options: ["null", "undefined", "object", "string"], answer: 2 },
        { q: "What happens when you reference a variable defined with 'let' before its declaration in the scope?", options: ["Returns undefined", "Throws ReferenceError due to Temporal Dead Zone", "Evaluates to null", "Initializes in global scope"], answer: 1 },
        { q: "Which of the following creates a new object inheriting directly from the prototype of a target object?", options: ["Object.create()", "Object.assign()", "Object.freeze()", "new Object()"], answer: 0 },
        { q: "What is the primary difference between a WeakMap and a Map in JS?", options: ["WeakMap allows primitive keys only", "WeakMap keys must be objects and are weakly held (garbage-collectable)", "Map is single-threaded", "WeakMap has no size property"], answer: 1 },
        { q: "Which function invocation method allows binding a specific 'this' context and returns a new function?", options: ["call()", "apply()", "bind()", "invoke()"], answer: 2 },
        { q: "What does the garbage collector do to an object referenced only by a WeakRef?", options: ["Keeps it in memory permanently", "Garbage-collects it when there are no strong references left", "Throws a TypeError", "Converts it to a Map"], answer: 1 },
        { q: "What is the output of console.log(0.1 + 0.2 === 0.3) in JavaScript?", options: ["true", "false due to floating-point binary precision limitations", "undefined", "Throws SyntaxError"], answer: 1 },
        { q: "Which standard keyword prevents prototype property modifications on an object?", options: ["Object.freeze()", "Object.seal()", "Object.preventExtensions()", "All of the above"], answer: 3 },
        { q: "What is executed first in standard JavaScript: Microtasks or Macrotasks?", options: ["Macrotasks", "Microtasks (e.g. Promises) after the current script stack clears", "They run concurrently", "Depends on execution runtime settings"], answer: 1 },
        { q: "Which JS engine optimization compiler turns hot code into machine code?", options: ["Parser", "Ignition Interpreter", "TurboFan JIT Compiler", "Garbage Collector"], answer: 2 },
        { q: "What is the difference between Object.seal and Object.preventExtensions?", options: ["Object.seal allows deleting properties", "Object.seal prevents adding or deleting properties, while preventExtensions only prevents adding", "preventExtensions seals the prototype chain", "There is no difference"], answer: 1 },
        { q: "Which ECMAScript feature allows capturing unresolved promises globally?", options: ["window.onerror", "process.on('uncaughtException')", "window.onunhandledrejection", "Promise.catchAll"], answer: 2 },
        { q: "What is the correct way to clone a deeply nested object natively in modern JS?", options: ["JSON.parse(JSON.stringify(obj))", "Object.assign({}, obj)", "structuredClone(obj)", "Spread operator {...obj}"], answer: 2 },
        { q: "In a script tag, what is the difference between async and defer attributes?", options: ["async blocks HTML parsing, defer does not", "async loads and executes script as soon as possible (blocking HTML), while defer loads during parsing and executes after HTML is fully parsed", "defer runs before DOMContentLoaded, async runs after", "async works for inline scripts only"], answer: 1 },
        { q: "Which of the following values is NOT falsy in JavaScript?", options: ["0", "NaN", "[]", "'' (empty string)"], answer: 2 },
        { q: "What does the void operator do in JavaScript?", options: ["Evaluates an expression and returns undefined", "Deletes a variable from memory", "Throws an empty exception", "Declares an empty type pointer"], answer: 0 },
        { q: "Which keyword refers to the global object in any standard JS environment (browser, node, worker)?", options: ["window", "global", "self", "globalThis"], answer: 3 },
        { q: "Which method checks if an object has a property as a direct property rather than inherited?", options: ["prop in obj", "Object.hasOwn(obj, prop)", "obj.hasOwnProperty(prop)", "Both B and C"], answer: 3 },
        { q: "What is the output of 'console.log(typeof NaN)'?", options: ["'NaN'", "'number'", "'undefined'", "'object'"], answer: 1 },
        { q: "Which array method mutates the original array in place?", options: ["map()", "filter()", "splice()", "slice()"], answer: 2 },
        { q: "What is a closure in JavaScript?", options: ["A method to close browser tabs", "A function that has access to its outer lexical scope even after the outer function has returned", "A secure private class constructor", "A garbage collection event handler"], answer: 1 },
        { q: "How does standard JS handle hoisting for variables declared with var vs let/const?", options: ["let/const are not hoisted at all", "Both are hoisted; let/const are initialized as undefined, var is not", "Both are hoisted; var is initialized as undefined, let/const are in Temporal Dead Zone until execution reaches declaration", "Only var is hoisted"], answer: 2 },
        { q: "Which console method displays data in a formatted tabular layout?", options: ["console.tab()", "console.table()", "console.grid()", "console.list()"], answer: 1 },
        { q: "What does the 'use strict' directive do?", options: ["Forces HTTPS security connections", "Enables strict runtime error checks and prevents accidental global variables, duplicate parameter names, etc.", "Enforces static type checking", "Imports strict ES6 libraries"], answer: 1 },
        { q: "What is the value of 'this' inside an arrow function?", options: ["Always points to the global window", "Lexically bound to the surrounding context where the arrow function was defined", "Always points to null", "Dynamic depending on who called it"], answer: 1 },
        { q: "Which method parses a JSON string into a JavaScript object?", options: ["JSON.stringify()", "JSON.parse()", "JSON.toObject()", "JSON.convert()"], answer: 1 },
        { q: "Which Symbol property is used to define custom iterator functions for an object?", options: ["Symbol.iterator", "Symbol.generator", "Symbol.iterable", "Symbol.loop"], answer: 0 },
        { q: "What is the output of '[] + []' in JavaScript?", options: ["[]", "'' (empty string)", "undefined", "NaN"], answer: 1 },
        { q: "What does the Promise.allSettled() method do?", options: ["Rejects if any promise rejects", "Resolves only if all promises resolve", "Resolves after all input promises have either resolved or rejected, returning an array of their outcomes", "Suspends thread execution"], answer: 2 }
      ]
    },
    {
      id: "react",
      title: "React Hooks & Fiber Architecture",
      duration: "30 mins",
      xpReward: 300,
      passed: false,
      questions: [
        { q: "Which hook should be used to memoize complex computational values to prevent redundant calculations?", options: ["useEffect", "useCallback", "useMemo", "useRef"], answer: 2 },
        { q: "Can hooks be called inside conditional statements or loops in React?", options: ["Yes, absolutely", "No, it violates Hooks rules and breaks fiber render order", "Only inside useEffect", "Only in dev mode"], answer: 1 },
        { q: "What is the second argument of useEffect called?", options: ["Dependency array", "Cleanup handler", "State callback", "Prop map"], answer: 0 },
        { q: "Which hook is designed to read and subscribe to external data sources synchronously?", options: ["useLayoutEffect", "useSyncExternalStore", "useTransition", "useDeferredValue"], answer: 1 },
        { q: "What is the primary difference between useEffect and useLayoutEffect?", options: ["useEffect runs synchronously before paint", "useLayoutEffect runs synchronously after DOM mutations but before browser paint", "useLayoutEffect runs on server side only", "There is no difference"], answer: 1 },
        { q: "Which hook allows maintaining a mutable reference that does not trigger component re-render on updates?", options: ["useState", "useRef", "useReducer", "useContext"], answer: 1 },
        { q: "In React 18, what does the useTransition hook return?", options: ["A promise and resolve function", "A boolean pending state and a startTransition function", "A custom dispatch hook", "A memoized callback function"], answer: 1 },
        { q: "How does React prevent context value changes from causing re-renders in consumer components?", options: ["By using memoization or separate custom provider wrappers", "By ignoring prop changes", "React context cannot prevent consumer re-renders by default", "By placing them in refs"], answer: 0 },
        { q: "Which hook should you use to pass ref handlers down to child components in a controlled way?", options: ["useImperativeHandle", "useForwardRef", "useCallbackRef", "useRef"], answer: 0 },
        { q: "What is the purpose of keys in React lists?", options: ["To style elements uniquely", "To identify which items changed, are added, or are removed for efficient reconciliation", "To index arrays automatically", "To secure component context"], answer: 1 },
        { q: "Which phase of React 18 Concurrent renderer can be paused and resumed?", options: ["Render Phase", "Commit Phase", "Layout Phase", "Schedule Phase"], answer: 0 },
        { q: "What hook generates unique IDs for web accessibility?", options: ["useId", "useAccessibility", "useUniqueId", "useGuid"], answer: 0 },
        { q: "What does the useDeferredValue hook do?", options: ["Runs code inside worker threads", "Postpones updating non-urgent parts of screen matching state values", "Caches HTTP responses", "None of the above"], answer: 1 },
        { q: "What causes 'Hydration failed' error in Next.js/React SSR?", options: ["Component state missing", "Mismatch between server-rendered HTML and client-rendered DOM", "Slow network connections", "Corrupted context elements"], answer: 1 },
        { q: "How to batch state updates manually in React 17 before automatic batching in React 18?", options: ["unstable_batchedUpdates", "forceUpdate()", "render()", "None of the above"], answer: 0 },
        { q: "Which hook returns the current execution transition status?", options: ["useTransition", "useDeferredValue", "useTransitionStatus", "useLoadStatus"], answer: 0 },
        { q: "What is the custom wrapper tag to check legacy lifecycle vulnerabilities in development?", options: ["React.StrictMode", "React.Fragment", "React.Profiler", "React.Suspense"], answer: 0 },
        { q: "What does useInsertionEffect do in React 18?", options: ["Triggers database injections", "Allows injecting CSS styles synchronously before useLayoutEffect reads layouts", "Logs network assets", "Imports styles dynamically"], answer: 1 },
        { q: "Which function clears the side effects of useEffect?", options: ["The cleanup callback function returned by the effect", "useEffect.clear()", "useState reset", "React garbage collector"], answer: 0 },
        { q: "What is state mutation in React called?", options: ["Immutability pattern violation", "Virtual DOM optimization", "Fiber scheduler refresh", "State mapping"], answer: 0 },
        { q: "What is the maximum nested hooks call depth?", options: ["3 levels", "1 level (hooks must be top-level)", "10 levels", "No depth limit"], answer: 1 },
        { q: "How to render children outside parent container DOM hierarchy?", options: ["React.lazy()", "ReactDOM.createPortal()", "React.createRef()", "React.forwardRef()"], answer: 1 },
        { q: "Which API helps load components asynchronously?", options: ["React.lazy()", "React.suspense()", "React.async()", "React.promise()"], answer: 0 },
        { q: "How to catch errors in child components?", options: ["Try-catch block around render", "ErrorBoundary component via getDerivedStateFromError", "window.onerror", "None of the above"], answer: 1 },
        { q: "Does changing a useRef ref value trigger component re-render?", options: ["Yes, immediately", "No, never", "Only in production mode", "Only inside useEffect"], answer: 1 },
        { q: "What does useTransition do?", options: ["Schedules low-priority rendering transitions", "Triggers layout changes", "Fetches database records", "Saves session states"], answer: 0 },
        { q: "How to optimize high-frequency inputs in React state?", options: ["Using ref or useDeferredValue", "Call setState in loop", "Add sleep timers", "None of the above"], answer: 0 },
        { q: "Which renderer renders React components into native canvas elements?", options: ["React Canvas renderer", "ReactDOM", "React Native", "React Fiber"], answer: 0 },
        { q: "What is the purpose of React.memo?", options: ["Prevents garbage collection", "Memoizes components to prevent re-renders on identical props", "Caches network logs", "Forces rendering loop"], answer: 1 },
        { q: "Can custom hooks return state set functions?", options: ["Yes, they can return any value/array/object", "No, custom hooks only return variables", "Only if wrapped in useMemo", "Only in StrictMode"], answer: 0 }
      ]
    },
    {
      id: "spring",
      title: "Spring Boot Microservices & JPA Expert",
      duration: "30 mins",
      xpReward: 350,
      passed: false,
      questions: [
        { q: "Which annotation registers a class as a Spring Boot Rest controller returning JSON/XML directly?", options: ["@Controller", "@RestController", "@Service", "@Component"], answer: 1 },
        { q: "Which JPA relationship maps a unique single target record to a source record?", options: ["@OneToMany", "@ManyToOne", "@OneToOne", "@ManyToMany"], answer: 2 },
        { q: "What does the @Autowired annotation accomplish in Spring?", options: ["Auto-compilation", "Dependency Injection / wiring of beans", "Web Security filters", "Auto-testing"], answer: 1 },
        { q: "What is the JPA N+1 query problem and how do you resolve it?", options: ["An infinite loop; resolve with @Transactional", "One query for parent, N queries for children; resolve with JOIN FETCH or Entity Graphs", "A database connection leak; resolve by scaling connection pools", "Multiple primary key duplicates; resolve with @GeneratedValue"], answer: 1 },
        { q: "Which Transactional propagation setting guarantees running inside a new independent transaction?", options: ["REQUIRED", "REQUIRES_NEW", "NESTED", "MANDATORY"], answer: 1 },
        { q: "What is the default scope of a Spring Bean?", options: ["Prototype", "Singleton", "Request", "Session"], answer: 1 },
        { q: "Which filter chain configures cross-origin security rules in Spring Security?", options: ["csrf()", "cors()", "authorizeHttpRequests()", "headers()"], answer: 1 },
        { q: "What is the lifecycle of a Spring Bean?", options: ["Instantiation -> Populate Properties -> InitializingBean -> destroy", "Compile -> Load -> Run -> GC", "Start -> Bind -> Execute -> End", "Request -> Filter -> Response"], answer: 0 },
        { q: "Which annotative marker handles JPA optimistic locking to prevent dirty writes?", options: ["@Lock", "@Version", "@Column(unique=true)", "@Transient"], answer: 1 },
        { q: "In a microservices architecture, which tool serves as Eureka's service discovery registration?", options: ["Spring Cloud Config", "Netflix Eureka Server", "Spring Cloud Gateway", "Resilience4j Circuit Breaker"], answer: 1 },
        { q: "Which annotation maps application properties to Java config objects?", options: ["@Value", "@ConfigurationProperties", "@PropertySource", "@EnvValue"], answer: 1 },
        { q: "How to handle database migration scripts automatically in Spring Boot?", options: ["Flyway or Liquibase", "Auto-compile", "Database schema reload", "Hibernate.hbm2ddl.auto"], answer: 0 },
        { q: "Which Spring Boot starter supports custom system metrics and health checks?", options: ["spring-boot-starter-actuator", "spring-boot-starter-metric", "spring-boot-starter-health", "spring-boot-starter-system"], answer: 0 },
        { q: "What does Resilience4j Circuit Breaker do when target services fail?", options: ["Transitions from Closed to Open state, blocking calls and returning fallback responses", "Restarts the server", "Retries database operations", "None of the above"], answer: 0 },
        { q: "What is the difference between Spring MVC and Spring WebFlux?", options: ["Spring MVC is thread-per-request blocking, WebFlux is non-blocking reactive stream", "Spring MVC is faster", "WebFlux is only for serverless", "MVC has no security filters"], answer: 0 },
        { q: "Which annotation handles global exceptions across all controllers?", options: ["@ExceptionHandler", "@ControllerAdvice / @RestControllerAdvice", "@CatchException", "@FallbackAdvice"], answer: 1 },
        { q: "How do you secure method-level calls in Spring controllers?", options: ["@PreAuthorize", "@SecureController", "@RolesAllowed", "Both A and C"], answer: 3 },
        { q: "What JPA annotation defines database primary key generation strategy?", options: ["@Id", "@GeneratedValue", "@SequenceGenerator", "@ColumnId"], answer: 1 },
        { q: "Which class maps incoming security credentials to user details?", options: ["UserDetailsService", "SecurityContext", "JwtFilter", "AuthenticationManager"], answer: 0 },
        { q: "What is the role of Spring Cloud Gateway?", options: ["Serves as API gateway for routing, rate limiting, and authentications", "Acts as database repository", "Generates security tokens", "Compiles microservices"], answer: 0 },
        { q: "What annotation declares a method as asynchronous in Spring Boot?", options: ["@Async", "@Scheduled", "@Threaded", "@Future"], answer: 0 },
        { q: "Which database isolation level prevents dirty reads but allows phantom reads?", options: ["READ_UNCOMMITTED", "READ_COMMITTED", "REPEATABLE_READ", "SERIALIZABLE"], answer: 1 },
        { q: "How to override Spring Boot properties during docker run command?", options: ["Pass them as environment variables e.g. -Dspring.datasource.url", "Hardcode in Dockerfile", "Use external YAML file only", "None of the above"], answer: 0 },
        { q: "What is lazy loading exception in Hibernate?", options: ["LazyInitializationException when accessing uninitialized collections outside transactional session", "NullPointerException during query execution", "Out of Memory error", "Database timeout"], answer: 0 },
        { q: "Which repository interface supports sorting and pagination out-of-the-box?", options: ["CrudRepository", "PagingAndSortingRepository", "JpaRepository", "Both B and C"], answer: 3 },
        { q: "Which annotation configures scheduled cron tasks in Spring?", options: ["@Scheduled", "@Cron", "@TimerTask", "@Interval"], answer: 0 },
        { q: "What is the purpose of BeanPostProcessor?", options: ["Intersects bean initialization to modify bean instances before/after init calls", "Compiles bean models", "Wires SQL variables", "GC collector cleanup"], answer: 0 },
        { q: "What does @Profile annotation do?", options: ["Configures beans to load only under specific runtime active profile targets", "Saves user profile image", "Locks controller route access", "None of the above"], answer: 0 },
        { q: "How does Spring Boot handle cross-site request forgery?", options: ["CSRF tokens via Spring Security filters", "Blocking CORS rules", "Forcing SSL connections", "Encrypting database headers"], answer: 0 },
        { q: "What is the role of Zipkin in microservices?", options: ["Distributed tracing collection server mapping latency spans", "Docker container registries", "Log files analyzer", "Gateway controller router"], answer: 0 }
      ]
    },
    {
      id: "aws",
      title: "AWS Cloud Architecture & SysOps",
      duration: "30 mins",
      xpReward: 300,
      passed: false,
      questions: [
        { q: "Which service provides scalable virtual servers in AWS?", options: ["S3", "EC2", "RDS", "VPC"], answer: 1 },
        { q: "What is the AWS service primarily used for access control, roles, and user policies?", options: ["S3", "VPC", "IAM", "CloudFront"], answer: 2 },
        { q: "Which AWS pricing model charges based on precise execution runtime only?", options: ["On-demand EC2", "Reserved Instances", "AWS Lambda", "Spot Instances"], answer: 2 },
        { q: "Which VPC component enables instances in private subnets to download updates from the internet securely?", options: ["Internet Gateway", "NAT Gateway", "Route Table", "VPC Peering"], answer: 1 },
        { q: "What is the default evaluation behavior of an IAM policy with conflicting Allow and Deny rules?", options: ["Allow takes precedence", "Deny takes precedence (explicit deny overrides all)", "Rules are combined", "Returns policy validation error"], answer: 1 },
        { q: "Which service acts as a low-latency content delivery network (CDN) in AWS?", options: ["Elastic Load Balancing", "CloudFront", "Route 53", "S3 Transfer Acceleration"], answer: 1 },
        { q: "What does Multi-AZ deployment accomplish for Amazon RDS?", options: ["Improves read performance", "Provides high availability and failover support", "Reduces storage costs", "Allows database schema migrations"], answer: 1 },
        { q: "In IAM, what is the difference between a Role and a User?", options: ["Users are only for console logins", "Roles are assumed dynamically by services/users without credentials sharing", "Roles possess no permissions", "There is no difference"], answer: 1 },
        { q: "Which AWS storage class is optimized for archiving data that is rarely accessed but requires long-term storage?", options: ["S3 Standard", "S3 Intelligent-Tiering", "S3 Glacier Flexible Retrieval", "S3 One Zone-IA"], answer: 2 },
        { q: "What does the term 'drifting' mean in AWS CloudFormation?", options: ["Infrastructure templates transferring regions", "Manual configuration changes that differ from the template's declared state", "Server instance crashes", "Auto-scaling actions"], answer: 1 },
        { q: "Which IAM entity allows federating external identity providers like Google/Okta?", options: ["IAM Identity Providers via SAML 2.0 / OIDC", "IAM Access Analyzer", "AWS Single Sign-On", "None of the above"], answer: 0 },
        { q: "What AWS tool monitors API calls made by users and services?", options: ["AWS Config", "AWS CloudTrail", "Amazon CloudWatch", "AWS Inspector"], answer: 1 },
        { q: "Which storage service provides file storage accessible concurrently by multiple EC2 instances?", options: ["Amazon EBS", "Amazon EFS", "Amazon S3 Glacier", "Amazon Storage Gateway"], answer: 1 },
        { q: "What is the difference between Security Groups and Network ACLs (NACL)?", options: ["Security Groups are stateful at instance level; NACLs are stateless at subnet level", "NACLs are stateful, SG is stateless", "SGs apply to entire regions", "There is no difference"], answer: 0 },
        { q: "Which AWS service is a managed NoSQL database service?", options: ["Amazon RDS", "Amazon DynamoDB", "Amazon Redshift", "Amazon Aurora"], answer: 1 },
        { q: "What AWS route routing policy routes traffic based on lowest network latency?", options: ["Simple Routing", "Latency Routing", "Failover Routing", "Geoproximity Routing"], answer: 1 },
        { q: "How can you run containerized tasks on AWS without managing server instances?", options: ["ECS with EC2 launch type", "AWS Fargate", "AWS Elastic Beanstalk", "AWS Lambda"], answer: 1 },
        { q: "Which service automatically scales resources based on target load metrics?", options: ["Elastic Load Balancing", "AWS Auto Scaling", "Amazon Route 53", "AWS Config"], answer: 1 },
        { q: "What AWS service collects and aggregates system logs and metrics?", options: ["Amazon CloudWatch", "AWS CloudTrail", "AWS VPC Flow Logs", "AWS X-Ray"], answer: 0 },
        { q: "Which tool helps secure application traffic by managing free SSL/TLS certificates?", options: ["AWS Certificate Manager ACM", "AWS Directory Service", "AWS IAM", "AWS Shield"], answer: 0 },
        { q: "What AWS database caching engine speeds up read-intensive workloads?", options: ["Amazon ElastiCache Redis/Memcached", "Amazon DynamoDB Accelerator", "Amazon RDS Proxy", "None of the above"], answer: 0 },
        { q: "What does an Application Load Balancer (ALB) operate on in the OSI model?", options: ["Layer 4 - Transport layer", "Layer 7 - Application layer", "Layer 3 - Network layer", "Layer 2 - Data Link layer"], answer: 1 },
        { q: "Which service provides decoupled message queues in AWS?", options: ["Amazon SNS", "Amazon SQS", "Amazon SES", "AWS Kinesis"], answer: 1 },
        { q: "What is S3 Transfer Acceleration?", options: ["Uses AWS Edge Locations to accelerate data uploads into S3 buckets", "Compresses S3 files", "Uses multi-thread uploads directly", "None of the above"], answer: 0 },
        { q: "What service provides a virtual private network connecting corporate data centers to AWS VPC?", options: ["AWS VPN / AWS Direct Connect", "Internet Gateway", "Route Table Peering", "NAT Instance"], answer: 0 },
        { q: "Which tool acts as a managed Web Application Firewall to block common SQL injections?", options: ["AWS WAF", "AWS Shield", "Amazon GuardDuty", "AWS Firewall Manager"], answer: 0 },
        { q: "What is the difference between RDS Read Replicas and Multi-AZ deployments?", options: ["Read Replicas scale read queries asynchronously; Multi-AZ is synchronous replication for HA failover", "Read Replicas support automated backups only", "Multi-AZ is for dev environments only", "None of the above"], answer: 0 },
        { q: "Which service manages DNS registers globally in AWS?", options: ["Amazon Route 53", "AWS Directory Service", "AWS Cloud Map", "Route 101"], answer: 0 },
        { q: "What does AWS KMS do?", options: ["Manages cryptographic keys to encrypt and decrypt data at rest", "Logs server actions", "Blocks malicious SQL traffic", "None of the above"], answer: 0 },
        { q: "Which service is a fully managed data warehouse utilizing columnar storage?", options: ["Amazon RDS", "Amazon DynamoDB", "Amazon Redshift", "Amazon Athena"], answer: 2 }
      ]
    }
  ]);

  // Track active quiz taking
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

  // Certificates list calculated dynamically based on passed assessments
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  // Promotion Flowchart track state: "fullstack" | "devops" | "ai"
  const [promotionTrack, setPromotionTrack] = useState("fullstack");

  // Fetch leaves from database on mount
  const fetchLeaves = async () => {
    try {
      const res = await authenticatedFetch(`${API_URL}/api/workforce/leaves`);
      const data = await res.json();
      if (res.ok && data.success) {
        const userEmail = user?.email || "employee@skillsphere.com";
        const filtered = (data.leaveRequests || []).filter(
          r => r.employeeEmail && r.employeeEmail.toLowerCase() === userEmail.toLowerCase()
        );
        setLeaveRequests(filtered);
      }
    } catch (e) {
      console.error("Failed to fetch leaves:", e);
    }
  };

  const fetchMyAssessments = async () => {
    try {
      const res = await authenticatedFetch(`${API_URL}/api/assessments`);
      const data = await res.json();
      if (res.ok && data.success) {
        const passedQuizIds = (data.results || [])
          .filter(r => r.score === r.totalQuestions)
          .map(r => r.quizId);
          
        setAssessments(prev => prev.map(a => 
          passedQuizIds.includes(a.id) ? { ...a, passed: true } : a
        ));
      }
    } catch (e) {
      console.error("Failed to fetch assessments:", e);
    }
  };

  useEffect(() => {
    fetchLeaves();
    fetchMyAssessments();
  }, [user]);

  // Timer Effect
  useEffect(() => {
    if (!activeQuiz || quizSubmitted) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          triggerAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeQuiz, quizSubmitted]);

  // Apply for leave API integration (connectivity)
  const handleApplyLeave = async (e) => {
    e.preventDefault();
    if (!newLeave.startDate || !newLeave.endDate || !newLeave.reason) return;

    const start = new Date(newLeave.startDate);
    const end = new Date(newLeave.endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const payload = {
      employeeName: user?.full_name || user?.username || "Employee Demo",
      employeeEmail: user?.email || "employee@skillsphere.com",
      role: user?.role || "EMPLOYEE",
      dept: "Engineering",
      leaveType: newLeave.type,
      startDate: newLeave.startDate,
      endDate: newLeave.endDate,
      days: diffDays,
      reason: newLeave.reason,
      empId: `EMP${user?.id || 101}`,
      requestDate: new Date().toISOString().split("T")[0]
    };

    try {
      const res = await authenticatedFetch(`${API_URL}/api/workforce/leaves`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setLeaveRequests(prev => [data.leaveRequest, ...prev]);
      }
    } catch (err) {
      console.error("Failed to submit leave request to server:", err);
      setLeaveRequests(prev => [{ ...payload, id: Date.now(), status: "PENDING" }, ...prev]);
    }

    setNewLeave({ type: "Casual Leave", startDate: "", endDate: "", reason: "" });
    setShowApplyLeaveModal(false);
  };

  // Submit assessment quiz
  const handleQuizSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!activeQuiz) return;

    let correct = 0;
    activeQuiz.questions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.answer) {
        correct++;
      }
    });

    const passed = correct === activeQuiz.questions.length;
    setQuizScore(correct);
    setQuizSubmitted(true);

    if (passed) {
      const payload = {
        quizId: activeQuiz.id,
        quizTitle: activeQuiz.title,
        score: correct,
        totalQuestions: activeQuiz.questions.length
      };

      try {
        const res = await authenticatedFetch(`${API_URL}/api/assessments/submit`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setAssessments(prev => prev.map(a => a.id === activeQuiz.id ? { ...a, passed: true } : a));
        }
      } catch (err) {
        console.error("Failed to submit quiz result:", err);
        setAssessments(prev => prev.map(a => a.id === activeQuiz.id ? { ...a, passed: true } : a));
      }

      if (earnXp) {
        earnXp(activeQuiz.xpReward);
      }
    }
  };

  const triggerAutoSubmit = () => {
    alert("⏰ Time is up! Your assessment is being submitted automatically.");
    handleQuizSubmit(null);
  };

  const handleStartQuiz = (a) => {
    setActiveQuiz(a);
    setCurrentQuestionIdx(0);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
    setTimeLeft(30 * 60); // 30 minutes in seconds
  };

  // Format time (MM:SS)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Navigation Items
  const navItems = [
    { id: "Overview", label: "Overview", icon: <FaHome /> },
    { id: "Assessments", label: "Assessments", icon: <FaBolt /> },
    { id: "Certificates", label: "My Certificates", icon: <FaCertificate /> },
    { id: "CareerPromotion", label: "Promotion Flowchart", icon: <FaTrophy /> },
    { id: "Attendance", label: "My Leaves & Attendance", icon: <FaClock /> }
  ];

  return (
    <div className="wf-dashboard-container">
      <Background />

      {/* SIDEBAR */}
      <aside className={`wf-sidebar open`} style={{ zIndex: 10 }}>
        <div className="wf-sidebar-header">
          <AppLogo height="54px" />
        </div>

        <nav className="wf-sidebar-nav">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`wf-nav-item ${activeTab === item.id ? "active" : ""}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="wf-nav-icon">{item.icon}</span>
              <span className="wf-nav-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <button className="wf-sidebar-logout-btn" onClick={async () => { await logout(); navigate("/"); }}>
          <FaSignOutAlt /> Sign Out
        </button>
      </aside>

      {/* MAIN VIEWPORT */}
      <main className="wf-main-content" style={{ flex: 1, padding: "30px", overflowY: "auto", position: "relative", zIndex: 1 }}>
        
        {/* HEADER BAR */}
        <header className="wf-main-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 800 }}>Workforce Employee Portal</h2>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <button className="themeToggleNavBtn" onClick={toggleTheme}>
              {themeMode === 'dark' ? <FaSun /> : <FaMoon />}
              <span>{themeMode === 'dark' ? 'Light' : 'Dark'}</span>
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "var(--bg-secondary)", padding: "6px 16px", borderRadius: "99px", border: "1px solid var(--border-color)" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#16a34a" }} />
              <strong style={{ fontSize: "13px" }}>{user?.full_name || user?.username} (Employee)</strong>
            </div>
          </div>
        </header>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "Overview" && (
          <>
            <section className="wf-welcome-banner wf-hero-banner-enhanced">
              <div className="wf-welcome-text">
                <h1>Welcome back, {user?.full_name || user?.username}! 👋</h1>
                <p>Track your assignments, learning targets, and skill progress in one single place.</p>
              </div>
            </section>

            {/* KPI STATS */}
            <section className="wf-metrics-grid" style={{ marginTop: "24px" }}>
              <div className="wf-metric-card" onClick={() => setActiveTab("Assessments")}>
                <div className="wf-metric-header">
                  <div className="wf-metric-icon-box" style={{ background: "#fae8de" }}><FaBolt /></div>
                  <span className="wf-metric-title">Assessments Taken</span>
                </div>
                <div className="wf-metric-value">
                  {assessments.filter(a => a.passed).length} / {assessments.length}
                </div>
                <div className="wf-metric-trend">Verified certifications</div>
              </div>
              <div className="wf-metric-card" onClick={() => setActiveTab("Certificates")}>
                <div className="wf-metric-header">
                  <div className="wf-metric-icon-box" style={{ background: "#faf0e6" }}><FaCertificate /></div>
                  <span className="wf-metric-title">My Certificates</span>
                </div>
                <div className="wf-metric-value">
                  {assessments.filter(a => a.passed).length} Earned
                </div>
                <div className="wf-metric-trend">Direct download PDF</div>
              </div>
              <div className="wf-metric-card" onClick={() => setActiveTab("CareerPromotion")}>
                <div className="wf-metric-header">
                  <div className="wf-metric-icon-box" style={{ background: "#e6f4ea" }}><FaTrophy /></div>
                  <span className="wf-metric-title">Promotion Target</span>
                </div>
                <div className="wf-metric-value">Lv. {assessments.filter(a => a.passed).length}</div>
                <div className="wf-metric-trend">Senior Engineer Track</div>
              </div>
              <div className="wf-metric-card" onClick={() => setActiveTab("Attendance")}>
                <div className="wf-metric-header">
                  <div className="wf-metric-icon-box" style={{ background: "#fff7ed", color: "#c2410c" }}><FaClock /></div>
                  <span className="wf-metric-title">My Leaves Filed</span>
                </div>
                <div className="wf-metric-value">{leaveRequests.length} Requests</div>
                <div className="wf-metric-trend">Synced with HR</div>
              </div>
            </section>

            {/* TASK AND SPRINT */}
            <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "30px", marginTop: "30px" }}>
              <div className="wf-card" style={{ padding: "24px" }}>
                <h3 className="wf-card-title">My Active Team Tasks</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "16px" }}>
                  <div style={{ padding: "28px 16px", textAlign: "center", background: "var(--bg-primary)", borderRadius: "12px", border: "1px dashed var(--border-color)" }}>
                    <p style={{ margin: 0, fontSize: "13px", color: "var(--text-secondary)" }}>0 Active Tasks — No active team tasks assigned yet.</p>
                  </div>
                </div>
              </div>

              {(() => {
                const casualTaken = leaveRequests
                  .filter(r => (r.status === "APPROVED" || r.status === "approved") && (r.leaveType?.toLowerCase().includes("casual") || r.type?.toLowerCase().includes("casual")))
                  .reduce((sum, r) => sum + (Number(r.days) || 1), 0);
                const sickTaken = leaveRequests
                  .filter(r => (r.status === "APPROVED" || r.status === "approved") && (r.leaveType?.toLowerCase().includes("sick") || r.type?.toLowerCase().includes("sick")))
                  .reduce((sum, r) => sum + (Number(r.days) || 1), 0);
                const casualLeft = Math.max(0, 12 - casualTaken);
                const sickLeft = Math.max(0, 8 - sickTaken);

                return (
                  <div className="wf-card" style={{ padding: "24px" }}>
                    <h3 className="wf-card-title">Leave Balance</h3>
                    <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "6px" }}>
                          <span>Casual Leaves</span>
                          <strong>{casualLeft} / 12 Days Left</strong>
                        </div>
                        <div style={{ height: "8px", background: "var(--border-color)", borderRadius: "4px", overflow: "hidden" }}>
                          <div style={{ width: `${(casualLeft / 12) * 100}%`, height: "100%", background: "#8c5338", transition: "width 0.3s ease" }} />
                        </div>
                      </div>
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "6px" }}>
                          <span>Sick Leaves</span>
                          <strong>{sickLeft} / 8 Days Left</strong>
                        </div>
                        <div style={{ height: "8px", background: "var(--border-color)", borderRadius: "4px", overflow: "hidden" }}>
                          <div style={{ width: `${(sickLeft / 8) * 100}%`, height: "100%", background: "#10b981", transition: "width 0.3s ease" }} />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </>
        )}

        {/* TAB 2: ASSESSMENTS */}
        {activeTab === "Assessments" && (
          <div className="wf-card" style={{ padding: "28px" }}>
            <h2 className="wf-card-title">Upskilling Assessments</h2>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "20px" }}>Pass these verification assessments to unlock official certificates and qualify for career promotions.</p>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              {assessments.map(a => (
                <div key={a.id} style={{ padding: "20px", background: "var(--bg-primary)", borderRadius: "14px", border: "1px solid var(--border-color)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                      <span style={{ fontSize: "11px", color: "#8c5338", fontWeight: "bold" }}>{a.duration} Limit</span>
                      <span style={{ fontSize: "11px", color: "#16A34A", fontWeight: "bold" }}>+{a.xpReward} XP</span>
                    </div>
                    <strong style={{ fontSize: "16px", display: "block", marginBottom: "8px" }}>{a.title}</strong>
                    <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Contains 30 Advanced Engineering Questions</span>
                  </div>

                  <div style={{ marginTop: "20px" }}>
                    {a.passed ? (
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#16A34A", fontWeight: "bold", fontSize: "14px" }}>
                        <FaCheckCircle /> Passed (100% Score)
                      </div>
                    ) : (
                      <button 
                        className="wf-btn-primary" 
                        style={{ width: "100%", padding: "10px", background: "#8c5338", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}
                        onClick={() => handleStartQuiz(a)}
                      >
                        Start Assessment
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: CERTIFICATES */}
        {activeTab === "Certificates" && (
          <div className="wf-card" style={{ padding: "28px" }}>
            <h2 className="wf-card-title">My Verified Certificates</h2>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "24px" }}>Official digital certificates automatically issued upon passing upskill assessments.</p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
              {assessments.map(a => (
                <div key={a.id} style={{ 
                  padding: "24px", 
                  background: a.passed ? "linear-gradient(135deg, var(--bg-primary) 0%, rgba(140,95,60,0.05) 100%)" : "var(--bg-primary)", 
                  borderRadius: "14px", 
                  border: a.passed ? "2px solid #8c5338" : "1px solid var(--border-color)",
                  position: "relative"
                }}>
                  <div style={{ fontSize: "32px", marginBottom: "12px" }}>
                    {a.id === "js" ? "💛" : a.id === "react" ? "⚛️" : a.id === "spring" ? "🍃" : "☁️"}
                  </div>
                  <strong style={{ display: "block", fontSize: "16px", marginBottom: "4px" }}>{a.title.replace(" Check", "").replace(" Proficiency", "")} Certificate</strong>
                  <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Issued by SkillSphere Workforce</span>

                  <div style={{ marginTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    {a.passed ? (
                      <>
                        <button 
                          className="wf-btn-primary" 
                          style={{ padding: "8px 14px", background: "#8c5338", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", fontSize: "12px" }}
                          onClick={() => setSelectedCertificate(a)}
                        >
                          View Certificate
                        </button>
                        <span style={{ fontSize: "11px", color: "#16A34A", fontWeight: "bold" }}>Verified ✔</span>
                      </>
                    ) : (
                      <>
                        <span style={{ fontSize: "12px", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "6px" }}>
                          <FaLock /> Locked
                        </span>
                        <button 
                          className="loginBtn" 
                          style={{ padding: "6px 12px", fontSize: "11px" }}
                          onClick={() => setActiveTab("Assessments")}
                        >
                          Unlock Assessment
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: CAREER PATH & PROMOTION FLOWCHART */}
        {activeTab === "CareerPromotion" && (
          <div className="wf-card" style={{ padding: "28px" }}>
            <h2 className="wf-card-title">Career Path & Promotion Roadmap</h2>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "20px" }}>
              Select a specialized track to view the promotional flowchart. Checkpoints automatically unlock as you pass the corresponding verified assessments.
            </p>

            {/* Track Selector Buttons */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "30px" }}>
              {[
                { id: "fullstack", label: "Full-Stack Developer Path" },
                { id: "devops", label: "DevOps Architect Path" },
                { id: "ai", label: "AI/ML Engineer Path" }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setPromotionTrack(t.id)}
                  style={{
                    padding: "10px 20px",
                    borderRadius: "8px",
                    border: "1px solid var(--border-color)",
                    fontWeight: "bold",
                    cursor: "pointer",
                    fontSize: "13px",
                    background: promotionTrack === t.id ? "#8c5338" : "var(--bg-primary)",
                    color: promotionTrack === t.id ? "#fff" : "var(--text-primary)"
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* CONNECTED NODE FLOWCHART */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "15px", position: "relative" }}>
              
              {/* Node 1: Associate Engineer */}
              <div style={{
                width: "100%",
                maxWidth: "500px",
                background: "var(--bg-primary)",
                border: "1px solid #16A34A",
                boxShadow: "0 0 10px rgba(22, 163, 74, 0.15)",
                padding: "20px",
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "11px", background: "#E6F4EA", color: "#16A34A", padding: "2px 6px", borderRadius: "6px", fontWeight: "bold" }}>Lvl 1</span>
                    <strong style={{ fontSize: "15px" }}>Associate Engineer</strong>
                  </div>
                  <p style={{ margin: "6px 0 0 0", fontSize: "12px", color: "var(--text-secondary)" }}>
                    Requires: JavaScript Basics Check passed.
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#16A34A", fontWeight: "bold", fontSize: "12px" }}>
                  <FaUnlock /> Unlocked
                </div>
              </div>

              {/* Connector line 1 */}
              <div style={{ width: "2px", height: "30px", background: "var(--border-color)", position: "relative" }}>
                <div style={{ position: "absolute", bottom: "-5px", left: "-4px", width: "10px", height: "10px", borderRight: "2px solid var(--border-color)", borderBottom: "2px solid var(--border-color)", transform: "rotate(45deg)" }} />
              </div>

              {/* Node 2: Professional Specialist */}
              {(() => {
                const isUnlocked = assessments.find(a => a.id === "react")?.passed;

                return (
                  <>
                    <div style={{
                      width: "100%",
                      maxWidth: "500px",
                      background: "var(--bg-primary)",
                      border: isUnlocked ? "1px solid #16A34A" : "1px solid var(--border-color)",
                      boxShadow: isUnlocked ? "0 0 10px rgba(22, 163, 74, 0.15)" : "none",
                      padding: "20px",
                      borderRadius: "14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ fontSize: "11px", background: isUnlocked ? "#E6F4EA" : "var(--bg-secondary)", color: isUnlocked ? "#16A34A" : "var(--text-secondary)", padding: "2px 6px", borderRadius: "6px", fontWeight: "bold" }}>Lvl 2</span>
                          <strong style={{ fontSize: "15px" }}>Mid-Level Specialist</strong>
                        </div>
                        <p style={{ margin: "6px 0 0 0", fontSize: "12px", color: "var(--text-secondary)" }}>
                          Requires: React Hooks Proficiency assessment passed.
                        </p>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", color: isUnlocked ? "#16A34A" : "#B06000", fontWeight: "bold", fontSize: "12px" }}>
                        {isUnlocked ? <><FaUnlock /> Unlocked</> : <><FaLock /> Locked</>}
                      </div>
                    </div>

                    {/* Connector line 2 */}
                    <div style={{ width: "2px", height: "30px", background: "var(--border-color)", position: "relative" }}>
                      <div style={{ position: "absolute", bottom: "-5px", left: "-4px", width: "10px", height: "10px", borderRight: "2px solid var(--border-color)", borderBottom: "2px solid var(--border-color)", transform: "rotate(45deg)" }} />
                    </div>
                  </>
                );
              })()}

              {/* Node 3: Tech Lead / Team Lead */}
              {(() => {
                const isUnlocked = assessments.find(a => a.id === "spring")?.passed;

                return (
                  <>
                    <div style={{
                      width: "100%",
                      maxWidth: "500px",
                      background: "var(--bg-primary)",
                      border: isUnlocked ? "1px solid #16A34A" : "1px solid var(--border-color)",
                      boxShadow: isUnlocked ? "0 0 10px rgba(22, 163, 74, 0.15)" : "none",
                      padding: "20px",
                      borderRadius: "14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ fontSize: "11px", background: isUnlocked ? "#E6F4EA" : "var(--bg-secondary)", color: isUnlocked ? "#16A34A" : "var(--text-secondary)", padding: "2px 6px", borderRadius: "6px", fontWeight: "bold" }}>Lvl 3</span>
                          <strong style={{ fontSize: "15px" }}>Team Tech Lead</strong>
                        </div>
                        <p style={{ margin: "6px 0 0 0", fontSize: "12px", color: "var(--text-secondary)" }}>
                          Requires: Spring Boot Microservices & JPA assessment passed.
                        </p>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", color: isUnlocked ? "#16A34A" : "#B06000", fontWeight: "bold", fontSize: "12px" }}>
                        {isUnlocked ? <><FaUnlock /> Unlocked</> : <><FaLock /> Locked</>}
                      </div>
                    </div>

                    {/* Connector line 3 */}
                    <div style={{ width: "2px", height: "30px", background: "var(--border-color)", position: "relative" }}>
                      <div style={{ position: "absolute", bottom: "-5px", left: "-4px", width: "10px", height: "10px", borderRight: "2px solid var(--border-color)", borderBottom: "2px solid var(--border-color)", transform: "rotate(45deg)" }} />
                    </div>
                  </>
                );
              })()}

              {/* Node 4: Principal Architect */}
              {(() => {
                const isUnlocked = assessments.find(a => a.id === "aws")?.passed;

                return (
                  <div style={{
                    width: "100%",
                    maxWidth: "500px",
                    background: "var(--bg-primary)",
                    border: isUnlocked ? "1px solid #16A34A" : "1px solid var(--border-color)",
                    boxShadow: isUnlocked ? "0 0 10px rgba(22, 163, 74, 0.15)" : "none",
                    padding: "20px",
                    borderRadius: "14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                  }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "11px", background: isUnlocked ? "#E6F4EA" : "var(--bg-secondary)", color: isUnlocked ? "#16A34A" : "var(--text-secondary)", padding: "2px 6px", borderRadius: "6px", fontWeight: "bold" }}>Lvl 4</span>
                        <strong style={{ fontSize: "15px" }}>Principal Solutions Architect</strong>
                      </div>
                      <p style={{ margin: "6px 0 0 0", fontSize: "12px", color: "var(--text-secondary)" }}>
                        Requires: AWS Cloud & Infrastructure Essentials passed.
                      </p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", color: isUnlocked ? "#16A34A" : "#B06000", fontWeight: "bold", fontSize: "12px" }}>
                      {isUnlocked ? <><FaUnlock /> Unlocked</> : <><FaLock /> Locked</>}
                    </div>
                  </div>
                );
              })()}

            </div>
          </div>
        )}

        {/* TAB 5: ATTENDANCE */}
        {activeTab === "Attendance" && (
          <div className="wf-card" style={{ padding: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <h2 className="wf-card-title">My Leaves & Attendance</h2>
                <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Submit requests and check real-time approval status synced with HR dashboard.</p>
              </div>
              <button className="wf-btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#f9572a" }} onClick={() => setShowApplyLeaveModal(true)}>
                <FaPlus /> Apply for Leave
              </button>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border-color)", color: "var(--text-secondary)" }}>
                    <th style={{ padding: "12px 8px" }}>Leave Type</th>
                    <th style={{ padding: "12px 8px" }}>Start Date</th>
                    <th style={{ padding: "12px 8px" }}>End Date</th>
                    <th style={{ padding: "12px 8px" }}>Days</th>
                    <th style={{ padding: "12px 8px" }}>Reason</th>
                    <th style={{ padding: "12px 8px" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveRequests.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ padding: "20px 8px", textAlign: "center", color: "var(--text-secondary)" }}>No leave applications filed yet.</td>
                    </tr>
                  ) : (
                    leaveRequests.map(lr => (
                      <tr key={lr.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                        <td style={{ padding: "12px 8px", fontWeight: "bold" }}>{lr.leaveType || lr.type}</td>
                        <td style={{ padding: "12px 8px" }}>{lr.startDate}</td>
                        <td style={{ padding: "12px 8px" }}>{lr.endDate}</td>
                        <td style={{ padding: "12px 8px" }}>{lr.days}</td>
                        <td style={{ padding: "12px 8px" }}>{lr.reason}</td>
                        <td style={{ padding: "12px 8px" }}>
                          <span style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            padding: "2px 8px",
                            borderRadius: "10px",
                            fontSize: "11px",
                            fontWeight: "bold",
                            background: lr.status === "APPROVED" || lr.status === "approved" ? "#E6F4EA" : lr.status === "REJECTED" || lr.status === "rejected" ? "#FFEBE9" : "#FEF7E0",
                            color: lr.status === "APPROVED" || lr.status === "approved" ? "#16A34A" : lr.status === "REJECTED" || lr.status === "rejected" ? "#D9381E" : "#B06000"
                          }}>
                            {lr.status === "APPROVED" || lr.status === "approved" ? <FaCheckCircle /> : <FaHourglassHalf />}
                            {lr.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}



      </main>

      {/* FULL-SCREEN EXAMINATION CONSOLE */}
      {activeQuiz && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "var(--bg-secondary)",
          color: "var(--text-primary)",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          fontFamily: "'Outfit', sans-serif"
        }}>
          {/* Header */}
          <header style={{
            height: "75px",
            background: "var(--bg-primary)",
            borderBottom: "1px solid var(--border-color)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 30px"
          }}>
            <div>
              <span style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", color: "var(--text-secondary)", fontWeight: "bold" }}>Official Upskilling Exam</span>
              <h3 style={{ margin: 0, fontSize: "18px", color: "#8c5338" }}>{activeQuiz.title}</h3>
            </div>
            
            {/* Timer and Progress */}
            {!quizSubmitted && (
              <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: timeLeft < 180 ? "rgba(217,56,30,0.1)" : "var(--bg-secondary)",
                  color: timeLeft < 180 ? "#D9381E" : "#8c5338",
                  padding: "8px 18px",
                  borderRadius: "99px",
                  border: `1px solid ${timeLeft < 180 ? "#D9381E" : "var(--border-color)"}`,
                  fontWeight: "bold",
                  animation: timeLeft < 180 ? "pulse 1s infinite" : "none"
                }}>
                  <FaClock />
                  <span style={{ fontSize: "16px", fontFamily: "monospace" }}>{formatTime(timeLeft)}</span>
                </div>
                
                <button 
                  onClick={() => {
                    if (window.confirm("Are you sure you want to cancel? Your progress will be lost!")) {
                      setActiveQuiz(null);
                    }
                  }}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "8px",
                    background: "transparent",
                    color: "var(--text-secondary)",
                    border: "1px solid var(--border-color)",
                    cursor: "pointer",
                    fontWeight: "bold"
                  }}
                >
                  Cancel Exam
                </button>
              </div>
            )}
          </header>

          {/* Body Split View */}
          <div style={{ flex: 1, display: "grid", gridTemplateColumns: "3fr 1fr", overflow: "hidden" }}>
            
            {/* Left Question panel */}
            <div style={{ padding: "40px", overflowY: "auto", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "var(--bg-secondary)" }}>
              {!quizSubmitted ? (
                <>
                  <div>
                    {/* Question Card */}
                    <div style={{
                      background: "var(--bg-primary)",
                      padding: "30px",
                      borderRadius: "16px",
                      border: "1px solid var(--border-color)",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.05)"
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                        <span style={{ fontSize: "12px", background: "rgba(140,83,56,0.1)", color: "#8c5338", padding: "4px 10px", borderRadius: "6px", fontWeight: "bold" }}>
                          Question {currentQuestionIdx + 1} of {activeQuiz.questions.length}
                        </span>
                        <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Weight: Single Choice</span>
                      </div>

                      <h2 style={{ fontSize: "20px", fontWeight: 700, lineHeight: "1.4", marginBottom: "24px" }}>
                        {activeQuiz.questions[currentQuestionIdx].q}
                      </h2>

                      {/* Options */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {activeQuiz.questions[currentQuestionIdx].options.map((opt, idx) => {
                          const isSelected = quizAnswers[currentQuestionIdx] === idx;
                          return (
                            <label 
                              key={idx}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                padding: "16px 20px",
                                background: isSelected ? "rgba(140,83,56,0.05)" : "var(--bg-secondary)",
                                borderRadius: "10px",
                                border: `1px solid ${isSelected ? "#8c5338" : "var(--border-color)"}`,
                                cursor: "pointer",
                                transition: "all 0.2s"
                              }}
                            >
                              <input
                                type="radio"
                                name={`q-${currentQuestionIdx}`}
                                checked={isSelected}
                                onChange={() => setQuizAnswers(prev => ({ ...prev, [currentQuestionIdx]: idx }))}
                                style={{ accentColor: "#8c5338", width: "18px", height: "18px" }}
                              />
                              <span style={{ fontSize: "14px", fontWeight: isSelected ? "bold" : "normal" }}>{opt}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Navigation controls */}
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "30px", borderTop: "1px solid var(--border-color)", paddingTop: "20px" }}>
                    <button
                      onClick={() => setCurrentQuestionIdx(prev => Math.max(0, prev - 1))}
                      disabled={currentQuestionIdx === 0}
                      style={{
                        padding: "12px 24px",
                        borderRadius: "8px",
                        background: "var(--bg-primary)",
                        border: "1px solid var(--border-color)",
                        color: "var(--text-primary)",
                        fontWeight: "bold",
                        cursor: currentQuestionIdx === 0 ? "not-allowed" : "pointer",
                        opacity: currentQuestionIdx === 0 ? 0.5 : 1,
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                      }}
                    >
                      <FaArrowLeft /> Previous Question
                    </button>

                    {currentQuestionIdx < activeQuiz.questions.length - 1 ? (
                      <button
                        onClick={() => setCurrentQuestionIdx(prev => prev + 1)}
                        style={{
                          padding: "12px 24px",
                          borderRadius: "8px",
                          background: "#8c5338",
                          border: "none",
                          color: "#fff",
                          fontWeight: "bold",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px"
                        }}
                      >
                        Next Question <FaArrowRight />
                      </button>
                    ) : (
                      <button
                        onClick={handleQuizSubmit}
                        style={{
                          padding: "12px 30px",
                          borderRadius: "8px",
                          background: "#16A34A",
                          border: "none",
                          color: "#fff",
                          fontWeight: "bold",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px"
                        }}
                      >
                        Submit Exam
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <div style={{ textAlign: "center", padding: "40px 0", maxWidth: "500px", margin: "0 auto" }}>
                  {quizScore === activeQuiz.questions.length ? (
                    <>
                      <div style={{ fontSize: "64px", color: "#16A34A", marginBottom: "20px" }}>🎉</div>
                      <h2 style={{ fontSize: "24px", color: "#16A34A", margin: "0 0 10px 0" }}>Perfect Score! Certification Unlocked</h2>
                      <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                        Congratulations! You answered all {activeQuiz.questions.length} questions correctly, demonstrating expert-level proficiency.
                      </p>
                      <div style={{ background: "rgba(22,163,74,0.05)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(22,163,74,0.2)", margin: "24px 0" }}>
                        <strong style={{ display: "block", color: "#16A34A" }}>Reward: +{activeQuiz.xpReward} XP Added</strong>
                        <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Your verified digital certificate is now available under "My Certificates".</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: "64px", color: "#D9381E", marginBottom: "20px" }}>⚠️</div>
                      <h2 style={{ fontSize: "24px", color: "#D9381E", margin: "0 0 10px 0" }}>Assessment Incomplete</h2>
                      <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                        You scored {quizScore} out of {activeQuiz.questions.length} correct answers. To secure promotion and earn verified certificates, you must achieve a perfect 100% pass score.
                      </p>
                      <button 
                        className="wf-btn-primary" 
                        style={{ marginTop: "24px", padding: "12px 24px", background: "#8c5338" }}
                        onClick={() => handleStartQuiz(activeQuiz)}
                      >
                        Retry Assessment
                      </button>
                    </>
                  )}
                  <button 
                    className="loginBtn" 
                    style={{ marginTop: "12px", width: "100%", padding: "12px" }} 
                    onClick={() => setActiveQuiz(null)}
                  >
                    Return to Hub
                  </button>
                </div>
              )}
            </div>

            {/* Right Question selector side panel */}
            <div style={{
              background: "var(--bg-primary)",
              borderLeft: "1px solid var(--border-color)",
              padding: "30px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "24px"
            }}>
              <div>
                <h4 style={{ margin: "0 0 10px 0", fontSize: "14px", color: "var(--text-secondary)" }}>Question Sheet</h4>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "8px" }}>
                  {activeQuiz.questions.map((_, idx) => {
                    const isAnswered = quizAnswers[idx] !== undefined;
                    const isCurrent = currentQuestionIdx === idx;
                    
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          if (!quizSubmitted) setCurrentQuestionIdx(idx);
                        }}
                        style={{
                          aspectRatio: "1",
                          borderRadius: "8px",
                          border: isCurrent ? "2px solid #8c5338" : "1px solid var(--border-color)",
                          background: isAnswered ? "rgba(140,83,56,0.15)" : "var(--bg-secondary)",
                          color: isAnswered ? "#8c5338" : "var(--text-primary)",
                          fontWeight: "bold",
                          cursor: quizSubmitted ? "not-allowed" : "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "12px"
                        }}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "20px" }}>
                <h4 style={{ margin: "0 0 12px 0", fontSize: "13px" }}>Color Legend</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "12px", color: "var(--text-secondary)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "16px", height: "16px", borderRadius: "4px", background: "rgba(140,83,56,0.15)", border: "1px solid #8c5338" }} />
                    <span>Answered Questions</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "16px", height: "16px", borderRadius: "4px", background: "var(--bg-secondary)", border: "1px solid var(--border-color)" }} />
                    <span>Unanswered Questions</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "16px", height: "16px", borderRadius: "4px", border: "2px solid #8c5338", background: "var(--bg-secondary)" }} />
                    <span>Current Active Question</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* VIEW CERTIFICATE MODAL */}
      {selectedCertificate && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "#fff", color: "#332219", padding: "40px", borderRadius: "16px", width: "700px", border: "10px solid #8c5338", boxShadow: "0 10px 30px rgba(0,0,0,0.3)", position: "relative" }}>
            
            {/* Close */}
            <button 
              onClick={() => setSelectedCertificate(null)}
              style={{ position: "absolute", top: "15px", right: "20px", background: "none", border: "none", fontSize: "20px", fontWeight: "bold", cursor: "pointer", color: "#8c5338" }}
            >
              ✕
            </button>

            <div style={{ textAlign: "center", border: "2px solid rgba(140,83,56,0.2)", padding: "30px", background: "#faf8f5" }}>
              <div style={{ marginBottom: "10px" }}><AppLogo height="45px" /></div>
              <h2 style={{ fontFamily: "Georgia, serif", fontSize: "28px", color: "#8c5338", margin: "0 0 5px 0" }}>Certificate of Completion</h2>
              <span style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "#a39285" }}>SkillSphere Verified Upskilling</span>
              
              <div style={{ margin: "30px 0" }}>
                <span style={{ fontSize: "13px", color: "#66554d", fontStyle: "italic" }}>This is proudly presented to</span>
                <h3 style={{ fontSize: "24px", color: "#332219", borderBottom: "1px solid #8c5338", display: "inline-block", padding: "0 20px 5px 20px", margin: "10px 0" }}>
                  {user?.full_name || user?.username}
                </h3>
                <p style={{ fontSize: "13px", color: "#66554d", maxWidth: "450px", margin: "10px auto 0 auto", lineHeight: "1.5" }}>
                  for successfully mastering all professional criteria and passing the official verification assessment for:
                </p>
                <strong style={{ fontSize: "18px", color: "#8c5338", display: "block", marginTop: "8px" }}>
                  {selectedCertificate.title.replace(" Check", "").replace(" Proficiency", "").replace(" Expert", "")}
                </strong>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "40px" }}>
                <div style={{ textAlign: "left" }}>
                  <span style={{ fontSize: "11px", color: "#8c5338", display: "block", fontWeight: "bold" }}>VERIFICATION ID</span>
                  <span style={{ fontSize: "10px", color: "var(--text-secondary)" }}>SS-{selectedCertificate.id.toUpperCase()}-{Math.floor(100000 + Math.random() * 900000)}</span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontFamily: "Brush Script MT, cursive, sans-serif", fontSize: "22px", color: "#8c5338", display: "block" }}>SkillSphere HR</span>
                  <span style={{ fontSize: "10px", color: "#a39285", borderTop: "1px solid #ebdcd0", paddingWidth: "80px", display: "inline-block", paddingTop: "4px" }}>AUTHORIZED SIGNATURE</span>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "20px" }}>
              <button className="wf-btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#8c5338" }} onClick={() => alert("Certificate download initiated as PDF!")}>
                <FaFilePdf /> Download PDF
              </button>
              <button
                className="loginBtn"
                style={{ display: "inline-flex", alignItems: "center", gap: "6px", border: "1px solid #0077b5", color: "#0077b5", cursor: "pointer" }}
                onClick={() => {
                  const certId = `SS-${selectedCertificate.id.toUpperCase()}-CERT`;
                  const verifyUrl = `https://skillsphere.edu/verify/${certId}`;
                  const now = new Date();
                  const url = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(selectedCertificate.title)}&organizationName=${encodeURIComponent("SkillSphere Nexus")}&issueYear=${now.getFullYear()}&issueMonth=${now.getMonth() + 1}&certUrl=${encodeURIComponent(verifyUrl)}&certId=${encodeURIComponent(certId)}`;
                  window.open(url, "_blank", "noopener,noreferrer");
                }}
              >
                <FaLinkedin /> Add to LinkedIn
              </button>
            </div>
          </div>
        </div>
      )}

      {/* APPLY LEAVE MODAL */}
      {showApplyLeaveModal && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "var(--bg-secondary)", padding: "30px", borderRadius: "16px", width: "400px", border: "1px solid var(--border-color)" }}>
            <h3 style={{ margin: "0 0 20px 0" }}>Apply for Leave</h3>
            <form onSubmit={handleApplyLeave}>
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "12px", marginBottom: "6px" }}>Leave Type</label>
                <select
                  value={newLeave.type}
                  onChange={(e) => setNewLeave(prev => ({ ...prev, type: e.target.value }))}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-primary)", color: "var(--text-primary)" }}
                >
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Earned Leave">Earned Leave</option>
                </select>
              </div>
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "12px", marginBottom: "6px" }}>Start Date</label>
                <input
                  type="date"
                  value={newLeave.startDate}
                  onChange={(e) => setNewLeave(prev => ({ ...prev, startDate: e.target.value }))}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-primary)", color: "var(--text-primary)" }}
                  required
                />
              </div>
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "12px", marginBottom: "6px" }}>End Date</label>
                <input
                  type="date"
                  value={newLeave.endDate}
                  onChange={(e) => setNewLeave(prev => ({ ...prev, endDate: e.target.value }))}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-primary)", color: "var(--text-primary)" }}
                  required
                />
              </div>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "12px", marginBottom: "6px" }}>Reason for Leave</label>
                <textarea
                  value={newLeave.reason}
                  onChange={(e) => setNewLeave(prev => ({ ...prev, reason: e.target.value }))}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-primary)", color: "var(--text-primary)", height: "80px", resize: "none" }}
                  required
                />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button type="button" className="loginBtn" onClick={() => setShowApplyLeaveModal(false)}>Cancel</button>
                <button type="submit" className="wf-btn-primary" style={{ background: "#f9572a" }}>Submit Application</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
