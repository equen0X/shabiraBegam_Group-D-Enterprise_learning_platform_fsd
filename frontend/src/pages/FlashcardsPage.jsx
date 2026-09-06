import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Background from "../components/Background";
import PaperPlaneCursor from "../components/PaperPlaneCursor";
import StudentFooter from "../components/StudentFooter";
import FloatingChatbot from "../components/FloatingChatbot";
import NotificationDropdown from "../components/NotificationDropdown";

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
  FaCog,
  FaSearch,
  FaBell,
  FaRobot,
  FaRocket,
  FaMapSigns,
  FaSun,
  FaMoon,
  FaArrowLeft,
  FaClone,
  FaPlus,
  FaMagic,
  FaCheck,
  FaRedo,
  FaRandom,
  FaQuestionCircle,
  FaLightbulb,
  FaCode,
  FaCrown,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaStar,
  FaFire,
  FaGraduationCap
} from "react-icons/fa";

import "../styles/flashcardsPage.css";

// ── Initial Mock Decks Data ──
const INITIAL_DECKS = [
  {
    id: "deck-1",
    title: "React & Hooks Mastery",
    desc: "Essential React concepts, useState, useEffect, useMemo, custom hooks, and Virtual DOM internals.",
    category: "frontend",
    categoryLabel: "React & Frontend",
    cardsCount: 8,
    mastery: 85,
    lastReviewed: "2 hours ago",
    cards: [
      {
        id: "c1",
        question: "What is the Virtual DOM and how does React use diffing?",
        answer: "The Virtual DOM is a lightweight JS representation of the real DOM. React creates a new tree on state change, compares it with the previous snapshot using a diffing algorithm, and efficiently updates only changed nodes in the actual DOM.",
        code: "const VirtualDOMExample = () => {\n  const [count, setCount] = useState(0);\n  return <button onClick={() => setCount(count + 1)}>{count}</button>;\n};",
        difficulty: "medium"
      },
      {
        id: "c2",
        question: "When should you use `useCallback` vs `useMemo`?",
        answer: "`useCallback(fn, deps)` caches a function instance across renders, while `useMemo(() => value, deps)` caches the result of a calculation.",
        code: "const memoizedFn = useCallback(() => doSomething(a, b), [a, b]);\nconst memoizedVal = useMemo(() => computeHeavy(a), [a]);",
        difficulty: "medium"
      },
      {
        id: "c3",
        question: "What is the key rule of React Hooks?",
        answer: "Hooks must only be called at the top level of React function components or custom hooks. Never call hooks inside loops, conditions, or nested functions.",
        difficulty: "easy"
      },
      {
        id: "c4",
        question: "Explain React Fiber architecture.",
        answer: "React Fiber is the re-implementation of React's core reconciliation algorithm. It enables incremental rendering, splitting work into chunks across multiple frames for high FPS UI.",
        difficulty: "hard"
      }
    ]
  },
  {
    id: "deck-2",
    title: "Data Structures & Algorithms",
    desc: "Core DSA concepts, Big O notation, Trees, Graphs, Sorting, and Dynamic Programming fundamentals.",
    category: "dsa",
    categoryLabel: "DSA",
    cardsCount: 12,
    mastery: 70,
    lastReviewed: "1 day ago",
    cards: [
      {
        id: "c5",
        question: "What is the time complexity of QuickSort in best vs worst case?",
        answer: "Best & Average Case: O(N log N) when pivot splits array evenly. Worst Case: O(N²) when pivot is always smallest or largest element.",
        code: "// Pivot partitioning strategy\nint partition(int arr[], int low, int high) {\n  int pivot = arr[high]; ...\n}",
        difficulty: "medium"
      },
      {
        id: "c6",
        question: "Explain the difference between BFS and DFS in Graph traversal.",
        answer: "BFS uses a Queue data structure to explore level-by-level (ideal for shortest paths). DFS uses a Stack/Recursion to visit deep paths first.",
        difficulty: "easy"
      },
      {
        id: "c7",
        question: "What is Dynamic Programming and when to apply memoization?",
        answer: "DP solves complex problems by breaking them into overlapping subproblems and optimal substructure. Memoization stores solutions to subproblems to avoid redundant recalculations.",
        difficulty: "hard"
      }
    ]
  },
  {
    id: "deck-3",
    title: "System Design & Microservices",
    desc: "Scalability patterns, Load Balancers, Caching strategies, Database Sharding, and Event-driven Architecture.",
    category: "system",
    categoryLabel: "System Design",
    cardsCount: 10,
    mastery: 60,
    lastReviewed: "3 days ago",
    cards: [
      {
        id: "c8",
        question: "What is the CAP Theorem in Distributed Systems?",
        answer: "CAP states that a distributed system can guarantee at most TWO out of three properties simultaneously: Consistency (C), Availability (A), and Partition Tolerance (P).",
        difficulty: "medium"
      },
      {
        id: "c9",
        question: "What is Database Sharding and Horizontal Scaling?",
        answer: "Sharding partitions a dataset across multiple database instances based on a shard key, enabling horizontal read/write scale beyond a single machine.",
        difficulty: "hard"
      }
    ]
  },
  {
    id: "deck-4",
    title: "Python Async & Backend",
    desc: "Asyncio, Decorators, Generators, FastAPI dependency injection, and RESTful API best practices.",
    category: "backend",
    categoryLabel: "Python Backend",
    cardsCount: 6,
    mastery: 90,
    lastReviewed: "5 hours ago",
    cards: [
      {
        id: "c10",
        question: "How do Python Async / Await and Event Loop work?",
        answer: "Async functions return coroutines. The Event Loop pauses execution at `await` keyword, allowing other non-blocking tasks to run concurrently on a single thread.",
        code: "import asyncio\nasync def fetch_data():\n    await asyncio.sleep(1)\n    return {'status': 'success'}",
        difficulty: "easy"
      }
    ]
  }
];

export default function FlashcardsPage() {
  const { user, xp, themeMode, toggleTheme, authenticatedFetch } = useAuth();
  const navigate = useNavigate();
  const isDarkMode = themeMode === "dark";

  const userName = user?.full_name || user?.username || "Learner";
  const [currentXp, setCurrentXp] = useState(xp ?? 120);

  // Core State
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchDecks = async () => {
    try {
      const res = await authenticatedFetch(`${API_URL}/api/flashcards`);
      const data = await res.json();
      if (data.success) {
        const parsed = data.decks.map(d => ({
          ...d,
          cards: JSON.parse(d.cardsJson || "[]"),
          desc: d.description
        }));
        setDecks(parsed);
      }
    } catch (err) {
      console.error("Failed to load flashcard decks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDecks();
  }, []);

  // Study Mode State
  const [activeDeck, setActiveDeck] = useState(null);
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [deckCompleted, setDeckCompleted] = useState(false);

  // Modals
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isCreateDeckModalOpen, setIsCreateDeckModalOpen] = useState(false);
  const [aiPromptTopic, setAiPromptTopic] = useState("");
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  // New Deck Form
  const [newDeckTitle, setNewDeckTitle] = useState("");
  const [newDeckDesc, setNewDeckDesc] = useState("");
  const [newDeckCategory, setNewDeckCategory] = useState("frontend");
  const [newCardQuestion, setNewCardQuestion] = useState("");
  const [newCardAnswer, setNewCardAnswer] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  // Keyboard navigation for card flipping
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!activeDeck || deckCompleted) return;
      if (e.code === "Space" || e.code === "Enter") {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.code === "ArrowRight") {
        handleNextCard();
      } else if (e.code === "ArrowLeft") {
        handlePrevCard();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeDeck, cardIndex, isFlipped, deckCompleted]);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <FaHome />, path: "/student-home" },
    { id: "courses", label: "Courses", icon: <FaBook />, path: "/courses" },
    { id: "learning-paths", label: "Learning Paths", icon: <FaCodeBranch />, path: "/learning-paths" },
    { id: "assignments", label: "Assignments", icon: <FaFileAlt />, path: "/assignments" },
    { id: "discussions", label: "Discussions", icon: <FaComments />, path: "/discussions" },
    { id: "ai-buddy", label: "AI Study Buddy", icon: <FaRobot />, path: "/ai-study-buddy", active: true },
    { id: "career-roadmap", label: "Career Roadmap", icon: <FaMapSigns />, path: "/career-roadmap" },
    { id: "opportunity-feed", label: "Opportunity Feed", icon: <FaRocket />, path: "/opportunity-feed" },
    { id: "daily-quests", label: "Daily Quests", icon: <FaBolt />, path: "/daily-quests" },
    { id: "badges", label: "Badges", icon: <FaAward />, path: "/badges" },
    { id: "certificates", label: "Certificates", icon: <FaCertificate />, path: "/certificate" },
    { id: "progress", label: "Progress", icon: <FaChartLine />, path: "/progress" },
    { id: "resume", label: "Resume Builder", icon: <FaFileInvoice />, path: "/resume" },
    { id: "code-arena", label: "CodeArena", icon: <FaCode />, path: "/code-arena" },
    { id: "settings", label: "Settings", icon: <FaCog />, path: "/settings" }
  ];

  // Filtering Decks
  const filteredDecks = decks.filter((deck) => {
    const matchesCategory = selectedCategory === "all" || deck.category === selectedCategory;
    const matchesSearch =
      deck.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deck.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate Metrics
  const totalDecksCount = decks.length;
  const totalCardsCount = decks.reduce((acc, d) => acc + (d.cardsCount || d.cards.length), 0);
  const avgMastery = Math.round(
    decks.reduce((acc, d) => acc + d.mastery, 0) / (totalDecksCount || 1)
  );

  // Handle Study Session Start
  const handleStartStudy = (deck) => {
    setActiveDeck(deck);
    setCardIndex(0);
    setIsFlipped(false);
    setDeckCompleted(false);
    showToast(`Started studying '${deck.title}'! Press Space or click card to flip.`);
  };

  const handleNextCard = () => {
    if (!activeDeck) return;
    setIsFlipped(false);
    if (cardIndex < activeDeck.cards.length - 1) {
      setCardIndex((prev) => prev + 1);
    } else {
      setDeckCompleted(true);
      const earnedXp = 25;
      setCurrentXp((prev) => prev + earnedXp);
      showToast(`🎉 Deck completed! You earned +${earnedXp} XP!`);
    }
  };

  const handlePrevCard = () => {
    if (!activeDeck || cardIndex === 0) return;
    setIsFlipped(false);
    setCardIndex((prev) => prev - 1);
  };

  const handleSelfRating = async (rating) => {
    // Rating: 'again' | 'good' | 'easy'
    if (!activeDeck) return;

    if (rating === "easy") {
      showToast("✨ Marked as Easy (+5 XP bonus)");
      setCurrentXp((prev) => prev + 5);
    } else if (rating === "good") {
      showToast("👍 Card Reviewed (Good)");
    } else {
      showToast("🔄 Saved for Review");
    }

    let nextMastery = activeDeck.mastery;
    if (rating === "easy") nextMastery = Math.min(nextMastery + 10, 100);
    else if (rating === "good") nextMastery = Math.min(nextMastery + 5, 100);

    try {
      await authenticatedFetch(`${API_URL}/api/flashcards/${activeDeck.id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mastery: nextMastery })
      });
      setDecks(prev => prev.map(d => d.id === activeDeck.id ? { ...d, mastery: nextMastery, lastReviewed: "Just now" } : d));
    } catch (err) {
      console.error("Failed to save review session:", err);
    }

    handleNextCard();
  };

  // AI Generator Handler
  const handleGenerateAiDeck = async () => {
    if (!aiPromptTopic.trim()) return;
    setIsGeneratingAi(true);

    const cardsArray = [
      {
        id: `ai-${Date.now()}-1`,
        question: `What is the key objective of ${aiPromptTopic}?`,
        answer: `${aiPromptTopic} aims to optimize performance, improve software modularity, and solve fundamental domain challenges efficiently.`,
        difficulty: "easy"
      },
      {
        id: `ai-${Date.now()}-2`,
        question: `Explain a common best practice when implementing ${aiPromptTopic}.`,
        answer: `Always maintain modular design, write comprehensive unit tests, and leverage asynchronous processing where applicable.`,
        difficulty: "medium"
      },
      {
        id: `ai-${Date.now()}-3`,
        question: `What are common trade-offs in ${aiPromptTopic}?`,
        answer: `Trade-offs usually involve balancing memory footprint vs computational latency, and architectural simplicity vs flexibility.`,
        difficulty: "hard"
      }
    ];

    try {
      const res = await authenticatedFetch(`${API_URL}/api/flashcards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `AI Flashcards: ${aiPromptTopic}`,
          description: `AI-generated study pack covering core principles of ${aiPromptTopic}.`,
          category: "ai",
          categoryLabel: "AI Generated",
          cardsCount: cardsArray.length,
          cardsJson: JSON.stringify(cardsArray)
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`✨ Created AI Deck for '${aiPromptTopic}'! (+30 XP)`);
        setCurrentXp((prev) => prev + 30);
        fetchDecks();
      }
    } catch (err) {
      console.error("Failed to generate AI deck:", err);
      showToast("❌ Failed to generate AI deck");
    } finally {
      setIsGeneratingAi(false);
      setIsAiModalOpen(false);
      setAiPromptTopic("");
    }
  };

  // Custom Deck Form Handler
  const handleCreateDeckSubmit = async (e) => {
    e.preventDefault();
    if (!newDeckTitle.trim() || !newCardQuestion.trim() || !newCardAnswer.trim()) return;

    const cardsArray = [
      {
        id: `c-${Date.now()}-1`,
        question: newCardQuestion,
        answer: newCardAnswer,
        difficulty: "medium"
      }
    ];

    try {
      const res = await authenticatedFetch(`${API_URL}/api/flashcards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newDeckTitle,
          description: newDeckDesc || "Custom created flashcard deck.",
          category: newDeckCategory,
          categoryLabel: newDeckCategory.toUpperCase(),
          cardsCount: cardsArray.length,
          cardsJson: JSON.stringify(cardsArray)
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`⚡ New Deck '${data.deck.title}' created successfully!`);
        fetchDecks();
      }
    } catch (err) {
      console.error("Failed to create custom deck:", err);
      showToast("❌ Failed to create deck");
    }

    setIsCreateDeckModalOpen(false);
    setNewDeckTitle("");
    setNewDeckDesc("");
    setNewCardQuestion("");
    setNewCardAnswer("");
  };

  const currentCard = activeDeck ? activeDeck.cards[cardIndex] : null;

  return (
    <div className={`fcpWrapper ${isDarkMode ? "dark-theme" : "light-theme"}`}>
      <PaperPlaneCursor />
      <Background />

      <div className="fcpMainContainer">
        {/* ── LEFT SIDEBAR ── */}
        <aside className="fcpLeftSidebar">
          <div className="fcpSidebarHomeArchHeader">
            <div className="fcpArchLine"></div>
            <button className="fcpHomeCircularBtn" onClick={() => navigate("/student-home")} title="Return to Dashboard">
              <FaHome />
            </button>
          </div>

          <div className="fcpSidebarLevelWidget">
            <div className="fcpLevelRow">
              <span className="fcpLevelBadge">Lvl 4 Scholar</span>
              <span className="fcpXpText">{currentXp} / 500 XP</span>
            </div>
            <div className="fcpXpProgressTrack">
              <div className="fcpXpProgressBar" style={{ width: `${Math.min((currentXp / 500) * 100, 100)}%` }}></div>
            </div>
          </div>

          <nav className="fcpNavMenu">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className={`fcpNavItem ${item.active ? "active" : ""}`}
              >
                <span className="fcpNavIcon">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="fcpSidebarProWidget">
            <div className="fcpProBadge">
              <FaCrown /> PRO PLAN
            </div>
            <h4>SkillSphere AI+</h4>
            <p>Unlimited AI Flashcards, Automated Spaced Repetition & Exam Prep.</p>
            <button className="fcpBtnUpgradePro">Upgrade Now</button>
          </div>
        </aside>

        {/* ── RIGHT MAIN CONTENT ── */}
        <main className="fcpMainContent">
          {/* TOAST ALERT NOTIFICATION */}
          {toastMessage && (
            <div className="fcpToastAlert">
              <FaStar /> {toastMessage}
            </div>
          )}

          {/* TOP HEADER BAR */}
          <header className="fcpTopHeader">
            <div className="fcpSearchWrapper">
              <FaSearch color="#94A3B8" />
              <input
                type="text"
                placeholder="Search flashcards, topics, or concepts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="fcpTopHeaderActions">
              <button
                className="fcpThemeToggleBtn"
                onClick={toggleTheme}
                title={`Switch to ${isDarkMode ? "Light" : "Dark"} Mode`}
              >
                {isDarkMode ? <FaSun color="#F59E0B" /> : <FaMoon color="#6366F1" />}
              </button>

              <NotificationDropdown type="student" />

              <div className="fcpXpBadgePill">
                <FaBolt /> {currentXp} XP
              </div>

              <div className="fcpUserProfilePill">
                <div className="fcpUserAvatar">{userName.charAt(0).toUpperCase()}</div>
                <div className="fcpUserInfo">
                  <span className="fcpUserName">{userName}</span>
                  <span className="fcpUserRole">Student</span>
                </div>
              </div>
            </div>
          </header>

          {/* ── STUDY MODE OR DECKS DASHBOARD ── */}
          {activeDeck ? (
            /* ── INTERACTIVE 3D STUDY MODE ── */
            <div className="fcpStudySection">
              <div className="fcpStudyHeader">
                <button className="fcpBtnBackToDecks" onClick={() => setActiveDeck(null)}>
                  <FaArrowLeft /> Back to Decks
                </button>

                <div className="fcpStudyTitle">
                  <h2>{activeDeck.title}</h2>
                  <span>
                    Card {cardIndex + 1} of {activeDeck.cards.length}
                  </span>
                </div>

                <div className="fcpViewToggleGroup">
                  <button className="fcpViewBtn active" onClick={() => setIsFlipped(!isFlipped)}>
                    <FaRedo /> Flip Card
                  </button>
                </div>
              </div>

              {/* 3D Card Stage */}
              {!deckCompleted && currentCard ? (
                <div className="fcpCardStage" onClick={() => setIsFlipped(!isFlipped)}>
                  <div className={`fcpFlipCardInner ${isFlipped ? "isFlipped" : ""}`}>
                    {/* Front Side */}
                    <div className="fcpCardFront">
                      <div className="fcpCardTopMeta">
                        <span className="fcpCardBadgeSide">Question</span>
                        <span className={`fcpCardDiffTag ${currentCard.difficulty || "medium"}`}>
                          {currentCard.difficulty || "medium"}
                        </span>
                      </div>

                      <div className="fcpCardMainContent">
                        <div className="fcpQuestionText">{currentCard.question}</div>
                        {currentCard.code && (
                          <pre className="fcpCodeBlockSnippet">
                            <code>{currentCard.code}</code>
                          </pre>
                        )}
                      </div>

                      <div className="fcpCardFlipPrompt">
                        <FaRedo /> Click or press Space to reveal answer
                      </div>
                    </div>

                    {/* Back Side */}
                    <div className="fcpCardBack">
                      <div className="fcpCardTopMeta">
                        <span className="fcpCardBadgeSide">Answer & Key Takeaway</span>
                        <span className="fcpCardDiffTag easy">Verified</span>
                      </div>

                      <div className="fcpCardMainContent">
                        <div className="fcpAnswerText">{currentCard.answer}</div>
                      </div>

                      <div className="fcpCardFlipPrompt">
                        <FaCheck /> Self-rate below to record mastery
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Deck Completion Card */
                <div className="fcpCardStage" style={{ height: "auto" }}>
                  <div className="fcpCardFront" style={{ textDecoration: "none", textAlign: "center", gap: "16px" }}>
                    <div style={{ fontSize: "48px", color: "#F9572A" }}>🎉</div>
                    <h2>Deck Completed!</h2>
                    <p style={{ color: "#64748B", margin: 0 }}>
                      Outstanding job! You've reviewed all cards in <strong>{activeDeck.title}</strong>.
                    </p>
                    <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                      <button className="fcpBtnPrimaryHero" onClick={() => handleStartStudy(activeDeck)}>
                        <FaRedo /> Restart Deck
                      </button>
                      <button className="fcpBtnSecondaryHero" style={{ background: "#F9572A" }} onClick={() => setActiveDeck(null)}>
                        Back to Decks
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Study Navigation & Self Rating Controls */}
              {!deckCompleted && (
                <div className="fcpStudyControls">
                  <div className="fcpNavButtonsRow">
                    <button
                      className="fcpBtnNavControl"
                      onClick={handlePrevCard}
                      disabled={cardIndex === 0}
                    >
                      <FaChevronLeft /> Previous
                    </button>

                    <button className="fcpBtnFlipAction" onClick={() => setIsFlipped(!isFlipped)}>
                      <FaRedo /> {isFlipped ? "Show Question" : "Show Answer"}
                    </button>

                    <button className="fcpBtnNavControl" onClick={handleNextCard}>
                      Next <FaChevronRight />
                    </button>
                  </div>

                  {/* Self Rating Buttons */}
                  {isFlipped && (
                    <div className="fcpSelfRatingBox">
                      <button className="fcpBtnRate again" onClick={() => handleSelfRating("again")}>
                        <strong>Again</strong>
                        <span>Review soon</span>
                      </button>
                      <button className="fcpBtnRate good" onClick={() => handleSelfRating("good")}>
                        <strong>Good</strong>
                        <span>Getting there</span>
                      </button>
                      <button className="fcpBtnRate easy" onClick={() => handleSelfRating("easy")}>
                        <strong>Easy (+5 XP)</strong>
                        <span>Mastered</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* ── DECKS LISTING DASHBOARD ── */
            <>
              {/* HERO BANNER */}
              <section className="fcpHeroBanner">
                <div className="fcpHeroContent">
                  <h1>
                    <FaClone /> Smart Flashcards Studio
                  </h1>
                  <p>
                    Retain concepts 3x faster with AI-powered spaced repetition flashcards. Study pre-made decks or create your own in seconds!
                  </p>
                  <div className="fcpHeroActions">
                    <button className="fcpBtnPrimaryHero" onClick={() => setIsAiModalOpen(true)}>
                      <FaMagic /> Generate with AI
                    </button>
                    <button className="fcpBtnSecondaryHero" onClick={() => setIsCreateDeckModalOpen(true)}>
                      <FaPlus /> Create Custom Deck
                    </button>
                  </div>
                </div>
                <FaGraduationCap className="fcpHeroDecoGraphic" />
              </section>

              {/* METRICS SUMMARY GRID */}
              <section className="fcpMetricsGrid">
                <div className="fcpMetricCard">
                  <div className="fcpMetricIcon orange"><FaClone /></div>
                  <div className="fcpMetricMeta">
                    <label>Total Decks</label>
                    <strong>{totalDecksCount}</strong>
                  </div>
                </div>

                <div className="fcpMetricCard">
                  <div className="fcpMetricIcon purple"><FaGraduationCap /></div>
                  <div className="fcpMetricMeta">
                    <label>Cards Mastered</label>
                    <strong>{totalCardsCount}</strong>
                  </div>
                </div>

                <div className="fcpMetricCard">
                  <div className="fcpMetricIcon green"><FaFire /></div>
                  <div className="fcpMetricMeta">
                    <label>Study Streak</label>
                    <strong>{user?.streak || 0} Days</strong>
                  </div>
                </div>

                <div className="fcpMetricCard">
                  <div className="fcpMetricIcon cyan"><FaChartLine /></div>
                  <div className="fcpMetricMeta">
                    <label>Avg Mastery</label>
                    <strong>{avgMastery}%</strong>
                  </div>
                </div>
              </section>

              {/* CATEGORY TABS & VIEWS */}
              <section className="fcpFilterRow">
                <div className="fcpCategoryTabs">
                  {[
                    { id: "all", label: "All Decks" },
                    { id: "frontend", label: "React & Frontend" },
                    { id: "dsa", label: "DSA" },
                    { id: "system", label: "System Design" },
                    { id: "backend", label: "Python Backend" },
                    { id: "ai", label: "AI & ML" }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      className={`fcpTabBtn ${selectedCategory === tab.id ? "active" : ""}`}
                      onClick={() => setSelectedCategory(tab.id)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </section>

              {/* DECKS GRID */}
              <section className="fcpDecksGrid">
                {filteredDecks.length > 0 ? (
                  filteredDecks.map((deck) => (
                    <div key={deck.id} className="fcpDeckCard">
                      <div className="fcpDeckHeader">
                        <span className={`fcpDeckTopicTag ${deck.category}`}>
                          {deck.categoryLabel}
                        </span>
                        <span className="fcpDeckCardsBadge">
                          {deck.cardsCount || deck.cards.length} Cards
                        </span>
                      </div>

                      <div className="fcpDeckBody">
                        <h3>{deck.title}</h3>
                        <p>{deck.desc}</p>
                      </div>

                      <div className="fcpMasterySection">
                        <div className="fcpMasteryHeader">
                          <span>Mastery</span>
                          <span>{deck.mastery}%</span>
                        </div>
                        <div className="fcpMasteryTrack">
                          <div className="fcpMasteryFill" style={{ width: `${deck.mastery}%` }}></div>
                        </div>
                      </div>

                      <div className="fcpDeckFooter">
                        <span className="fcpLastRev">{deck.lastReviewed}</span>
                        <button className="fcpBtnStudyDeck" onClick={() => handleStartStudy(deck)}>
                          <FaClone /> Study Now
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px", color: "#94A3B8" }}>
                    No flashcard decks found matching your filter criteria.
                  </div>
                )}
              </section>
            </>
          )}

          <StudentFooter />
        </main>
      </div>

      {/* ── AI GENERATOR MODAL ── */}
      {isAiModalOpen && (
        <div className="fcpModalBackdrop" onClick={() => setIsAiModalOpen(false)}>
          <div className="fcpModalBox" onClick={(e) => e.stopPropagation()}>
            <div className="fcpModalHeader">
              <h3>
                <FaMagic color="#F9572A" /> AI Flashcard Generator
              </h3>
              <button className="fcpBtnCloseModal" onClick={() => setIsAiModalOpen(false)}>
                <FaTimes />
              </button>
            </div>

            <div className="fcpModalForm">
              <div className="fcpFormGroup">
                <label>Enter Topic or Paste Notes</label>
                <textarea
                  placeholder="e.g. Docker Containerization, Kubernetes Architecture, Python Decorators..."
                  value={aiPromptTopic}
                  onChange={(e) => setAiPromptTopic(e.target.value)}
                />
              </div>

              <button
                className="fcpBtnSubmitForm"
                onClick={handleGenerateAiDeck}
                disabled={isGeneratingAi || !aiPromptTopic.trim()}
              >
                {isGeneratingAi ? (
                  "Generating AI Deck..."
                ) : (
                  <>
                    <FaMagic /> Generate Instant Deck (+30 XP)
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CREATE CUSTOM DECK MODAL ── */}
      {isCreateDeckModalOpen && (
        <div className="fcpModalBackdrop" onClick={() => setIsCreateDeckModalOpen(false)}>
          <div className="fcpModalBox" onClick={(e) => e.stopPropagation()}>
            <div className="fcpModalHeader">
              <h3>
                <FaPlus color="#F9572A" /> Create New Flashcard Deck
              </h3>
              <button className="fcpBtnCloseModal" onClick={() => setIsCreateDeckModalOpen(false)}>
                <FaTimes />
              </button>
            </div>

            <form className="fcpModalForm" onSubmit={handleCreateDeckSubmit}>
              <div className="fcpFormGroup">
                <label>Deck Title</label>
                <input
                  type="text"
                  placeholder="e.g., GraphQL API Fundamentals"
                  value={newDeckTitle}
                  onChange={(e) => setNewDeckTitle(e.target.value)}
                  required
                />
              </div>

              <div className="fcpFormGroup">
                <label>Category</label>
                <select value={newDeckCategory} onChange={(e) => setNewDeckCategory(e.target.value)}>
                  <option value="frontend">React & Frontend</option>
                  <option value="dsa">Data Structures & Algorithms</option>
                  <option value="system">System Design</option>
                  <option value="backend">Python Backend</option>
                  <option value="ai">AI & Machine Learning</option>
                </select>
              </div>

              <div className="fcpFormGroup">
                <label>Deck Description</label>
                <input
                  type="text"
                  placeholder="Short summary of topics..."
                  value={newDeckDesc}
                  onChange={(e) => setNewDeckDesc(e.target.value)}
                />
              </div>

              <div className="fcpFormGroup">
                <label>First Card - Question (Front)</label>
                <input
                  type="text"
                  placeholder="e.g., What is a Resolver in GraphQL?"
                  value={newCardQuestion}
                  onChange={(e) => setNewCardQuestion(e.target.value)}
                  required
                />
              </div>

              <div className="fcpFormGroup">
                <label>First Card - Answer (Back)</label>
                <textarea
                  placeholder="Detailed answer or explanation..."
                  value={newCardAnswer}
                  onChange={(e) => setNewCardAnswer(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="fcpBtnSubmitForm">
                <FaCheck /> Create Deck
              </button>
            </form>
          </div>
        </div>
      )}

      <FloatingChatbot />
    </div>
  );
}
