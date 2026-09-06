import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Background from '../components/Background';
import PaperPlaneCursor from '../components/PaperPlaneCursor';
import {
  FaGraduationCap,
  FaBriefcase,
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaArrowLeft,
  FaShieldAlt,
  FaExclamationCircle,
  FaCheckCircle,
  FaInfoCircle
} from 'react-icons/fa';

import studentPortalImg from '../assets/student_portal_illustration.png';
import workforcePortalImg from '../assets/workforce_portal_illustration.png';
import darkStudentPortalImg from '../assets/dark_student_portal_illustration.png';
import darkWorkforcePortalImg from '../assets/dark_workforce_portal_illustration.png';

import '../styles/loginPage.css';
import '../styles/registerPage.css';

import AppLogo from "../components/AppLogo";

export default function RegisterPage() {
  const { signupLocal, loginWithGoogle, logout, themeMode } = useAuth();
  const isDarkMode = themeMode === "dark";
  const navigate = useNavigate();
  const location = useLocation();

  const initialRole = location.state?.role || 'STUDENT';
  const initialStep = location.state?.step || 1;

  const [step, setStep] = useState(initialStep); // 1 = Choice, 2 = Form
  const [role, setRole] = useState(initialRole);
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showDevBypass, setShowDevBypass] = useState(true);

  // Form Field Validation States
  const [fieldErrors, setFieldErrors] = useState({
    username: '',
    fullName: '',
    email: '',
    password: ''
  });
  const [touched, setTouched] = useState({
    username: false,
    fullName: false,
    email: false,
    password: false
  });

  const googleBtnRef = useRef(null);
  const roleRef = useRef(role);

  useEffect(() => {
    roleRef.current = role;
  }, [role]);

  // Validate single field according to requirements
  const validateField = (fieldName, value, currentRole = role) => {
    switch (fieldName) {
      case 'username': {
        const trimmed = (value || '').trim();
        if (!trimmed) return 'Username is required';
        if (trimmed.length < 3) return 'Username must be at least 3 characters long';
        if (!/^[a-zA-Z0-9_.-]+$/.test(trimmed)) {
          return 'Only letters, numbers, underscores, or hyphens allowed';
        }
        return '';
      }
      case 'fullName': {
        const trimmed = (value || '').trim();
        if (!trimmed) return 'Full name is required';
        if (trimmed.length < 2) return 'Please enter your full name (at least 2 characters)';
        return '';
      }
      case 'email': {
        const trimmed = (value || '').trim();
        if (!trimmed) return 'Email address is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmed)) {
          return 'Please enter a valid email format';
        }
        const lower = trimmed.toLowerCase();
        if (currentRole === 'STUDENT') {
          if (!lower.endsWith('@gmail.com')) {
            return 'Students must register with a valid @gmail.com email address';
          }
        } else {
          if (!lower.endsWith('@skillsphere.com')) {
            return 'Workforce accounts must register with an official @skillsphere.com corporate email';
          }
        }
        return '';
      }
      case 'password': {
        if (!value) return 'Password is required';
        if (value.length < 6) return 'Password must be at least 6 characters long';
        return '';
      }
      default:
        return '';
    }
  };

  const handleFieldBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    let val = '';
    if (field === 'username') val = username;
    if (field === 'fullName') val = fullName;
    if (field === 'email') val = email;
    if (field === 'password') val = password;
    const err = validateField(field, val, role);
    setFieldErrors(prev => ({ ...prev, [field]: err }));
  };

  const handleFieldChange = (field, value) => {
    if (field === 'username') setUsername(value);
    if (field === 'fullName') setFullName(value);
    if (field === 'email') setEmail(value);
    if (field === 'password') setPassword(value);

    // Live validation if touched
    if (touched[field]) {
      const err = validateField(field, value, role);
      setFieldErrors(prev => ({ ...prev, [field]: err }));
    }
  };

  useEffect(() => {
    const rawClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const clientId = (rawClientId && !rawClientId.includes('your_google_client_id'))
      ? rawClientId
      : '187668431914-r6bca92vusq2seqmopgfa9o5vrub4bi3.apps.googleusercontent.com';

    if (!clientId || clientId === 'google_mock_client_id_for_testing') {
      return;
    }
    const initGoogleSignUp = () => {
      if (window.google) {
        try {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: async (response) => {
              try {
                setError('');
                const registeredUser = await loginWithGoogle(response.credential, roleRef.current);
                if (registeredUser) {
                  const registeredEmail = (registeredUser.email || '').toLowerCase();
                  if (roleRef.current === 'STUDENT' && !registeredEmail.endsWith('@gmail.com')) {
                    setError('Students must sign in using a valid @gmail.com account.');
                    await logout();
                    return;
                  }
                  if (roleRef.current === 'EMPLOYEE' && !registeredEmail.endsWith('@skillsphere.com')) {
                    setError('Workforce members must register using an official @skillsphere.com email.');
                    await logout();
                    return;
                  }
                  if (registeredUser.role === 'STUDENT') {
                    navigate('/student-home');
                  } else {
                    navigate('/workforce-home');
                  }
                }
              } catch (err) {
                setError(err.message || 'Google registration failed');
              }
            }
          });
          if (googleBtnRef.current) {
            window.google.accounts.id.renderButton(
              googleBtnRef.current,
              { theme: 'outline', size: 'large', width: '100%' }
            );
          }
        } catch (err) {
          console.warn('Google accounts initialization warning:', err);
        }
      } else {
        setTimeout(initGoogleSignUp, 100);
      }
    };
    if (step === 2) {
      initGoogleSignUp();
    }
  }, [step, loginWithGoogle]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all as touched
    setTouched({
      username: true,
      fullName: true,
      email: true,
      password: true
    });

    const userErr = validateField('username', username, role);
    const nameErr = validateField('fullName', fullName, role);
    const emailErr = validateField('email', email, role);
    const passErr = validateField('password', password, role);

    const newErrors = {
      username: userErr,
      fullName: nameErr,
      email: emailErr,
      password: passErr
    };
    setFieldErrors(newErrors);

    if (userErr || nameErr || emailErr || passErr) {
      setError(emailErr || userErr || nameErr || passErr);
      return;
    }

    try {
      setError('');
      const registeredUser = await signupLocal(username.trim(), fullName.trim(), email.trim(), password, role);
      if (registeredUser && registeredUser.role === 'STUDENT') {
        navigate('/student-home');
      } else {
        navigate('/workforce-home');
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
  };

  const handleDevBypass = async (e) => {
    e.preventDefault();
    const targetEmail = email || (role === 'STUDENT' ? 'newstudent@gmail.com' : 'newemployee@skillsphere.com');
    const lower = targetEmail.toLowerCase();
    if (role === 'STUDENT' && !lower.endsWith('@gmail.com')) {
      setError('Students must register with a valid @gmail.com email address');
      return;
    }
    if (role === 'EMPLOYEE' && !lower.endsWith('@skillsphere.com')) {
      setError('Workforce members must register with an official @skillsphere.com corporate email');
      return;
    }
    try {
      setError('');
      const registeredUser = await loginWithGoogle(`mock_google_token_${targetEmail}`, role);
      if (registeredUser && registeredUser.role === 'STUDENT') {
        navigate('/student-home');
      } else {
        navigate('/workforce-home');
      }
    } catch (err) {
      setError(err.message || 'Developer bypass registration failed');
    }
  };

  return (
    <div className="registerPageWrapper">
      <Background />
      <PaperPlaneCursor />

      {/* Top Header Bar */}
      <header className="registerHeaderBar">
        <Link to="/" className="registerLogoBrand" style={{ display: "inline-flex", alignItems: "center" }}>
          <AppLogo height="56px" />
        </Link>

        <button className="btnBackHome" onClick={() => navigate('/')}>
          <FaArrowLeft /> Back to Home
        </button>
      </header>

      {/* Main Container */}
      <main className="registerMainContent">
        {/* ── STEP 1: CHOICE PANEL (IMAGE 2) ── */}
        {step === 1 && (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="choiceHeaderSection">
              <div className="choiceHeaderIcon"><FaGraduationCap /></div>
              <h1>Join SkillSphere</h1>
              <p>Choose your account type to get started</p>
            </div>

            <div className="choiceCardsGrid">
              {/* Student Card */}
              <div className="accountTypeCard">
                <div className="typeIconBadge"><FaGraduationCap /></div>
                <h3>Student</h3>
                <p>Enroll in courses, complete quizzes, earn XP and badges.</p>

                <div className="typeIllustrationBox">
                  <img src={isDarkMode ? darkStudentPortalImg : studentPortalImg} alt="Student Portal Graphic" className="typeIllustrationImg" />
                </div>

                <button
                  className="btnSignUpType"
                  onClick={() => {
                    setRole('STUDENT');
                    setStep(2);
                    setError('');
                    setFieldErrors({ username: '', fullName: '', email: '', password: '' });
                    setTouched({ username: false, fullName: false, email: false, password: false });
                  }}
                >
                  Sign Up as Student <FaArrowRight />
                </button>
              </div>

              {/* Workforce Card */}
              <div className="accountTypeCard">
                <div className="typeIconBadge"><FaBriefcase /></div>
                <h3>Workforce</h3>
                <p>Manage workspace profiles, assign projects, track attendance and scores.</p>

                <div className="typeIllustrationBox">
                  <img src={isDarkMode ? darkWorkforcePortalImg : workforcePortalImg} alt="Workforce Portal Graphic" className="typeIllustrationImg" />
                </div>

                <button
                  className="btnSignUpType"
                  onClick={() => {
                    setRole('EMPLOYEE');
                    setStep(2);
                    setError('');
                    setFieldErrors({ username: '', fullName: '', email: '', password: '' });
                    setTouched({ username: false, fullName: false, email: false, password: false });
                  }}
                >
                  Sign Up as Workforce <FaArrowRight />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2: REGISTRATION FORM (IMAGE 3 & IMAGE 4) ── */}
        {step === 2 && (
          <div className="registerFormCard">
            <div className="regHeaderIconBadge">
              {role === 'STUDENT' ? <FaGraduationCap /> : <FaBriefcase />}
            </div>

            <h1>
              {role === 'STUDENT' ? (
                <>Student <span>Registration</span></>
              ) : (
                <>Workforce <span>Registration</span></>
              )}
            </h1>

            <p className="regSubtext">Create your profile using the HTML form or Google</p>
            <div className="orangeUnderline" style={{ marginBottom: '24px' }}></div>

            {error && <div className="errorMessageCard">{error}</div>}

            <form onSubmit={handleSubmit} className="loginFormContent" noValidate>
              {/* Username Field */}
              <div className="inputFieldGroup">
                <label htmlFor="reg-username">Username *</label>
                <div className={`inputWithIconWrapper ${touched.username && fieldErrors.username ? 'has-error' : touched.username && username ? 'has-success' : ''}`}>
                  <FaUser className="fieldPrefixIcon" />
                  <input
                    id="reg-username"
                    type="text"
                    placeholder="johndoe"
                    value={username}
                    onChange={(e) => handleFieldChange('username', e.target.value)}
                    onBlur={() => handleFieldBlur('username')}
                    required
                  />
                </div>
                {touched.username && fieldErrors.username && (
                  <div className="fieldErrorMessage">
                    <FaExclamationCircle /> {fieldErrors.username}
                  </div>
                )}
              </div>

              {/* Full Name Field */}
              <div className="inputFieldGroup">
                <label htmlFor="reg-fullname">Full Name *</label>
                <div className={`inputWithIconWrapper ${touched.fullName && fieldErrors.fullName ? 'has-error' : touched.fullName && fullName ? 'has-success' : ''}`}>
                  <FaUser className="fieldPrefixIcon" />
                  <input
                    id="reg-fullname"
                    type="text"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => handleFieldChange('fullName', e.target.value)}
                    onBlur={() => handleFieldBlur('fullName')}
                    required
                  />
                </div>
                {touched.fullName && fieldErrors.fullName && (
                  <div className="fieldErrorMessage">
                    <FaExclamationCircle /> {fieldErrors.fullName}
                  </div>
                )}
              </div>

              {/* Email Address Field */}
              <div className="inputFieldGroup">
                <label htmlFor="reg-email">Email Address *</label>
                <div className={`inputWithIconWrapper ${touched.email && fieldErrors.email ? 'has-error' : touched.email && email ? 'has-success' : ''}`}>
                  <FaEnvelope className="fieldPrefixIcon" />
                  <input
                    id="reg-email"
                    type="email"
                    placeholder={role === 'STUDENT' ? "johndoe@gmail.com" : "johndoe@skillsphere.com"}
                    value={email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    onBlur={() => handleFieldBlur('email')}
                    required
                  />
                </div>

                {/* Role Domain Requirement Badge */}
                <div className="fieldDomainNotice">
                  <FaInfoCircle />
                  <span>
                    {role === 'STUDENT'
                      ? 'Student requirement: must register with a valid @gmail.com email'
                      : 'Workforce requirement: must register with an official @skillsphere.com email'}
                  </span>
                </div>

                {touched.email && fieldErrors.email && (
                  <div className="fieldErrorMessage">
                    <FaExclamationCircle /> {fieldErrors.email}
                  </div>
                )}
              </div>

              {/* Password Field */}
              <div className="inputFieldGroup">
                <label htmlFor="reg-password">Password *</label>
                <div className={`inputWithIconWrapper ${touched.password && fieldErrors.password ? 'has-error' : touched.password && password ? 'has-success' : ''}`}>
                  <FaLock className="fieldPrefixIcon" />
                  <input
                    id="reg-password"
                    name="reg_sec_code"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    data-lpignore="true"
                    data-1p-ignore="true"
                    data-form-type="other"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => handleFieldChange('password', e.target.value)}
                    onBlur={() => handleFieldBlur('password')}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    className="passwordEyeToggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {touched.password && fieldErrors.password ? (
                  <div className="fieldErrorMessage">
                    <FaExclamationCircle /> {fieldErrors.password}
                  </div>
                ) : (
                  <div className="fieldHelperText">
                    <span>Minimum 6 characters</span>
                  </div>
                )}
              </div>

              {/* Complete Sign-Up Button */}
              <button type="submit" className="btnSubmitLogin" style={{ marginTop: '10px' }}>
                Complete {role === 'STUDENT' ? 'Student' : 'Workforce'} Sign-Up
              </button>

              {/* Divider */}
              <div className="orDividerLine">
                <span>OR</span>
              </div>

              {/* Sign up with Google */}
              <div style={{ width: '100%', display: 'flex', justifyContent: 'center', margin: '8px 0' }}>
                <div ref={googleBtnRef} style={{ width: '100%' }}></div>
              </div>

              <button
                type="button"
                className="btnBackTypes"
                onClick={() => {
                  setStep(1);
                  setError('');
                  setFieldErrors({ username: '', fullName: '', email: '', password: '' });
                  setTouched({ username: false, fullName: false, email: false, password: false });
                }}
              >
                Back to account types
              </button>
            </form>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ textAlign: 'center', fontSize: '13px', color: '#64748B', padding: '20px 0', zIndex: 5 }}>
        &copy; {new Date().getFullYear()} SkillSphere. All rights reserved.
      </footer>
    </div>
  );
}
