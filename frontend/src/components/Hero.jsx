import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiArrowRight } from "react-icons/fi";
import heroIllustration from "../assets/hero_illustration.png";
import darkHeroIllustration from "../assets/dark_hero_illustration.png";
import "../styles/hero.css";

export default function Hero() {
  const { loginWithGoogle, themeMode } = useAuth();
  const navigate = useNavigate();
  const [showDevBypass, setShowDevBypass] = useState(false);
  const googleBtnRef = useRef(null);
  const heroRef = useRef(null);
  const heroCardRef = useRef(null);

  useEffect(() => {
    const rawClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const clientId = (rawClientId && !rawClientId.includes('your_google_client_id'))
      ? rawClientId
      : '187668431914-r6bca92vusq2seqmopgfa9o5vrub4bi3.apps.googleusercontent.com';

    if (!clientId || clientId === 'google_mock_client_id_for_testing') {
      setShowDevBypass(true);
      return;
    }

    const initGoogleSignIn = () => {
      if (window.google) {
        try {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: async (response) => {
              try {
                await loginWithGoogle(response.credential);
                navigate('/');
              } catch (err) {
                console.error(err);
                alert(err.message || 'Google authentication failed');
              }
            }
          });
          
          if (googleBtnRef.current) {
            window.google.accounts.id.renderButton(
              googleBtnRef.current,
              { theme: 'filled_blue', size: 'large', width: '360' }
            );
          }
        } catch (err) {
          console.warn('Google accounts initialization error:', err);
          setShowDevBypass(true);
        }
      } else {
        setTimeout(initGoogleSignIn, 100);
      }
    };

    initGoogleSignIn();
  }, [loginWithGoogle, navigate]);

  // Cursor Parallax Movement for Hero Graphics
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!heroRef.current || !heroCardRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const rotX = (-y / rect.height) * 12;
      const rotY = (x / rect.width) * 12;

      heroCardRef.current.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translate3d(${x * 0.03}px, ${y * 0.03}px, 0)`;
    };

    const section = heroRef.current;
    if (section) {
      section.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (section) {
        section.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, []);

  const handleGoogleClick = () => {
    navigate('/login');
  };

  return (
    <section className="hero" ref={heroRef}>
      <div className="heroLeft">
        {/* Badge */}
        <div className="heroBadge">
          ★ One Platform. Endless Possibilities.
        </div>

        {/* Title */}
        <h1>
          Learn Today.
          <span>Lead Tomorrow.</span>
        </h1>

        {/* Subtitle */}
        <p>
          A unified learning platform for students and professionals to gain skills, earn certifications, and accelerate their careers with industry-relevant learning.
        </p>

        {/* Action Buttons */}
        <div className="heroButtons">
          <button className="primaryHeroBtn" onClick={() => navigate('/courses')}>
            Explore Courses <FiArrowRight />
          </button>

          <button className="secondaryHeroBtn" onClick={() => navigate('/login', { state: { role: 'EMPLOYEE' } })}>
            For Organizations 🏛
          </button>
        </div>

        {/* Google Authentication Divider & Button */}
        <div className="orDivider">
          <span>OR CONTINUE WITH</span>
        </div>

        {showDevBypass ? (
          <button className="googleBtn" onClick={handleGoogleClick}>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
              alt="Google logo"
            />
            Continue with Google
          </button>
        ) : (
          <div style={{ position: 'relative', display: 'inline-block', width: '100%', maxWidth: '360px' }}>
            <button className="googleBtn" type="button" style={{ margin: 0, width: '100%' }}>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                alt="Google logo"
              />
              Continue with Google
            </button>
            <div
              ref={googleBtnRef}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: 0,
                overflow: 'hidden',
                zIndex: 2,
                cursor: 'pointer'
              }}
            ></div>
          </div>
        )}

        {/* Social Proof Avatars */}
        <div className="socialProofRow">
          <div className="avatarStack">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Learner 1" />
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="Learner 2" />
            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="Learner 3" />
            <div className="plusAvatar">+</div>
          </div>
          <div className="socialProofText">
            Join <strong>50,000+</strong> learners from <strong>500+</strong> organizations
          </div>
        </div>
      </div>

      {/* Right Side Moving Illustration with Mouse Parallax Reaction */}
      <div className="heroRight">
        <div className="heroIllustrationContainer" ref={heroCardRef} style={{ transition: 'transform 0.15s ease-out' }}>
          <div className="floatingHeroBadge badgeTopLeft">
            <span className="badgeIcon">🔥</span>
            <span>14-Day Streak</span>
          </div>

          <div className="floatingHeroBadge badgeMidRight">
            <span className="badgeIcon">⚡</span>
            <span>+500 XP Earned</span>
          </div>

          <div className="floatingHeroBadge badgeBottomRight">
            <span className="badgeIcon">🎓</span>
            <span>Certified Scholar</span>
          </div>

          <img
            src={themeMode === "dark" ? darkHeroIllustration : heroIllustration}
            alt="SkillSphere Learning Platform"
            className="heroIllustrationImg"
          />
        </div>
      </div>
    </section>
  );
}