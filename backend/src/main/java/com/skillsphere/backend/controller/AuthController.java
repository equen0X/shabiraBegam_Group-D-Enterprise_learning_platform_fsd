package com.skillsphere.backend.controller;

import com.skillsphere.backend.model.Employee;
import com.skillsphere.backend.repository.EmployeeRepository;
import com.skillsphere.backend.model.PasswordResetToken;
import com.skillsphere.backend.model.RefreshToken;
import com.skillsphere.backend.model.User;
import com.skillsphere.backend.repository.PasswordResetTokenRepository;
import com.skillsphere.backend.repository.RefreshTokenRepository;
import com.skillsphere.backend.repository.UserRepository;
import com.skillsphere.backend.security.GoogleTokenVerifier;
import com.skillsphere.backend.security.JwtTokenProvider;
import io.jsonwebtoken.Claims;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
public class AuthController {

    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final JwtTokenProvider tokenProvider;
    private final GoogleTokenVerifier googleTokenVerifier;
    private final BCryptPasswordEncoder passwordEncoder;
    private final ObjectMapper objectMapper;

    public AuthController(
            UserRepository userRepository,
            EmployeeRepository employeeRepository,
            RefreshTokenRepository refreshTokenRepository,
            PasswordResetTokenRepository passwordResetTokenRepository,
            JwtTokenProvider tokenProvider,
            GoogleTokenVerifier googleTokenVerifier,
            BCryptPasswordEncoder passwordEncoder,
            ObjectMapper objectMapper) {
        this.userRepository = userRepository;
        this.employeeRepository = employeeRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.tokenProvider = tokenProvider;
        this.googleTokenVerifier = googleTokenVerifier;
        this.passwordEncoder = passwordEncoder;
        this.objectMapper = objectMapper;
    }

    /**
     * Local Sign-Up
     */
    @PostMapping({"/auth/signup", "/register"})
    public ResponseEntity<Map<String, Object>> signup(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String fullName = body.get("full_name");
        String email = body.get("email");
        String password = body.get("password");
        String role = body.get("role");

        Map<String, Object> response = new HashMap<>();

        if (username == null || fullName == null || email == null || password == null) {
            response.put("success", false);
            response.put("message", "All fields (username, full_name, email, password) are required");
            return ResponseEntity.status(400).body(response);
        }

        if (password.length() < 6) {
            response.put("success", false);
            response.put("message", "Password must be at least 6 characters long");
            return ResponseEntity.status(400).body(response);
        }

        if (userRepository.findByEmail(email).isPresent()) {
            response.put("success", false);
            response.put("message", "Email is already registered");
            return ResponseEntity.status(400).body(response);
        }

        if (userRepository.findByUsername(username).isPresent()) {
            response.put("success", false);
            response.put("message", "Username is already taken");
            return ResponseEntity.status(400).body(response);
        }

        // Validate and set role
        String targetRole = Arrays.asList("STUDENT", "EMPLOYEE", "MANAGER", "ADMIN").contains(role) ? role : "STUDENT";

        // Validate email domain based on role
        String normalizedEmail = email.trim().toLowerCase();
        if ("STUDENT".equalsIgnoreCase(targetRole)) {
            if (!normalizedEmail.endsWith("@gmail.com")) {
                response.put("success", false);
                response.put("message", "Students must register with a valid @gmail.com email address");
                return ResponseEntity.status(400).body(response);
            }
        } else if ("EMPLOYEE".equalsIgnoreCase(targetRole) || "MANAGER".equalsIgnoreCase(targetRole)) {
            if (!normalizedEmail.endsWith("@skillsphere.com")) {
                response.put("success", false);
                response.put("message", "Workforce members must register with an official @skillsphere.com corporate email address");
                return ResponseEntity.status(400).body(response);
            }
        }

        User user = new User();
        user.setUsername(username);
        user.setFullName(fullName);
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setRole(targetRole);
        user.setProvider("LOCAL");
        user.setIsActive(true);
        user.setXp(0);
        user.setStreak(0);
        user.setLongestStreak(0);
        user.setTotalStudyTime(0);
        user.setCompletedTopics("");
        user.setBadges("");
        user.setEnrolledCourses("");
        user.setClaimedQuests("");
        user.setActivityMap("{}");

        User savedUser = userRepository.save(user);

        // If registering as EMPLOYEE or MANAGER, ensure employee record exists for workforce management
        if ("EMPLOYEE".equalsIgnoreCase(targetRole) || "MANAGER".equalsIgnoreCase(targetRole)) {
            if (employeeRepository.findByName(fullName).isEmpty()) {
                employeeRepository.save(new Employee(
                        fullName,
                        targetRole.equalsIgnoreCase("MANAGER") ? "Project Manager" : "Associate Engineer",
                        "Engineering",
                        "Active",
                        85
                ));
            }
        }

        // Generate tokens
        String accessToken = tokenProvider.generateAccessToken(savedUser);
        String refreshToken = tokenProvider.generateRefreshToken(savedUser);

        // Save hashed refresh token
        saveHashedRefreshToken(savedUser.getId(), refreshToken);

        response.put("success", true);
        response.put("message", "Registered successfully");
        response.put("accessToken", accessToken);
        response.put("refreshToken", refreshToken);

        Map<String, Object> userData = new HashMap<>();
        userData.put("id", savedUser.getId().toString());
        userData.put("username", savedUser.getUsername());
        userData.put("email", savedUser.getEmail());
        userData.put("full_name", savedUser.getFullName());
        userData.put("role", savedUser.getRole());
        response.put("user", userData);

        return ResponseEntity.status(201).body(response);
    }

    /**
     * Local Login
     */
    @PostMapping({"/auth/login", "/login"})
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");

        Map<String, Object> response = new HashMap<>();

        if (email == null || password == null) {
            response.put("success", false);
            response.put("message", "Email and password are required");
            return ResponseEntity.status(400).body(response);
        }

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            response.put("success", false);
            response.put("message", "Incorrect email ID");
            return ResponseEntity.status(401).body(response);
        }

        User user = userOpt.get();

        // Allow password login if the account has a password set and password matches
        boolean isPasswordMatch = user.getPasswordHash() != null && passwordEncoder.matches(password, user.getPasswordHash());

        if (!isPasswordMatch) {
            if (user.getPasswordHash() == null) {
                response.put("success", false);
                response.put("message", "Please use Google login for this account");
                return ResponseEntity.status(400).body(response);
            }
            response.put("success", false);
            response.put("message", "Incorrect password");
            return ResponseEntity.status(401).body(response);
        }

        if (!Boolean.TRUE.equals(user.getIsActive())) {
            response.put("success", false);
            response.put("message", "This user account is inactive. Please contact support.");
            return ResponseEntity.status(403).body(response);
        }

        // Update daily streak and activity map
        updateStreakAndActivity(user);

        // Update last login
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        // Generate tokens
        String accessToken = tokenProvider.generateAccessToken(user);
        String refreshToken = tokenProvider.generateRefreshToken(user);

        // Save hashed refresh token
        saveHashedRefreshToken(user.getId(), refreshToken);

        response.put("success", true);
        response.put("message", "Logged in successfully");
        response.put("accessToken", accessToken);
        response.put("refreshToken", refreshToken);

        Map<String, Object> userData = new HashMap<>();
        userData.put("id", user.getId().toString());
        userData.put("username", user.getUsername());
        userData.put("email", user.getEmail());
        userData.put("full_name", user.getFullName());
        userData.put("role", user.getRole());
        response.put("user", userData);

        return ResponseEntity.ok(response);
    }

    /**
     * Google Sign-In / Login
     */
    @PostMapping("/auth/google")
    public ResponseEntity<Map<String, Object>> googleLogin(@RequestBody Map<String, String> body) {
        String credential = body.get("credential");
        String role = body.get("role");

        Map<String, Object> response = new HashMap<>();

        if (credential == null) {
            response.put("success", false);
            response.put("message", "Google credential ID token is required");
            return ResponseEntity.status(400).body(response);
        }

        try {
            GoogleTokenVerifier.GoogleProfile profile = googleTokenVerifier.verifyToken(credential);
            String googleId = profile.getGoogleId();
            String email = profile.getEmail();
            String name = profile.getName();

            Optional<User> userOpt = userRepository.findByProviderAndProviderId("GOOGLE", googleId);
            User user;

            if (userOpt.isPresent()) {
                user = userOpt.get();
                updateStreakAndActivity(user);
                user.setLastLoginAt(LocalDateTime.now());
                userRepository.save(user);
            } else {
                // Check if email already registered
                Optional<User> existingUserOpt = userRepository.findByEmail(email);
                if (existingUserOpt.isPresent()) {
                    user = existingUserOpt.get();
                    user.setProviderId(googleId);
                    updateStreakAndActivity(user);
                    user.setLastLoginAt(LocalDateTime.now());
                    userRepository.save(user);
                } else {
                    // Create new user
                    String usernameBase = email.split("@")[0];
                    String username = usernameBase;

                    int suffix = 1;
                    while (userRepository.findByUsername(username).isPresent()) {
                        username = usernameBase + suffix;
                        suffix++;
                    }

                    String targetRole = Arrays.asList("STUDENT", "EMPLOYEE", "MANAGER", "ADMIN").contains(role) ? role : "STUDENT";

                    user = new User();
                    user.setUsername(username);
                    user.setFullName(name != null ? name : username);
                    user.setEmail(email);
                    user.setProvider("GOOGLE");
                    user.setProviderId(googleId);
                    user.setRole(targetRole);
                    user.setIsActive(true);
                    user.setXp(0);
                    user.setStreak(0);
                    user.setLongestStreak(0);
                    user.setTotalStudyTime(0);
                    user.setCompletedTopics("");
                    user.setBadges("");
                    user.setEnrolledCourses("");
                    user.setClaimedQuests("");
                    user.setActivityMap("{}");
                    user.setLastLoginAt(LocalDateTime.now());
                    user = userRepository.save(user);

                    // If registering as EMPLOYEE or MANAGER, ensure employee record exists for workforce management
                    if ("EMPLOYEE".equalsIgnoreCase(targetRole) || "MANAGER".equalsIgnoreCase(targetRole)) {
                        String empName = user.getFullName() != null ? user.getFullName() : user.getUsername();
                        if (employeeRepository.findByName(empName).isEmpty()) {
                            employeeRepository.save(new Employee(
                                    empName,
                                    targetRole.equalsIgnoreCase("MANAGER") ? "Project Manager" : "Associate Engineer",
                                    "Engineering",
                                    "Active",
                                    85
                            ));
                        }
                    }
                }
            }

            if (!Boolean.TRUE.equals(user.getIsActive())) {
                response.put("success", false);
                response.put("message", "This user account is inactive. Please contact support.");
                return ResponseEntity.status(403).body(response);
            }

            // Generate tokens
            String accessToken = tokenProvider.generateAccessToken(user);
            String refreshToken = tokenProvider.generateRefreshToken(user);

            // Save hashed refresh token
            saveHashedRefreshToken(user.getId(), refreshToken);

            response.put("success", true);
            response.put("message", "Logged in successfully");
            response.put("accessToken", accessToken);
            response.put("refreshToken", refreshToken);

            Map<String, Object> userData = new HashMap<>();
            userData.put("id", user.getId().toString());
            userData.put("username", user.getUsername());
            userData.put("email", user.getEmail());
            userData.put("full_name", user.getFullName());
            userData.put("role", user.getRole());
            response.put("user", userData);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Google authentication failed: " + e.getMessage());
            return ResponseEntity.status(401).body(response);
        }
    }

    /**
     * Token Refresh (Rotation)
     */
    @PostMapping("/auth/refresh")
    public ResponseEntity<Map<String, Object>> refresh(@RequestBody Map<String, String> body) {
        String refreshToken = body.get("refreshToken");
        Map<String, Object> response = new HashMap<>();

        if (refreshToken == null) {
            response.put("success", false);
            response.put("message", "Refresh token is required");
            return ResponseEntity.status(400).body(response);
        }

        try {
            if (!tokenProvider.validateToken(refreshToken, true)) {
                response.put("success", false);
                response.put("message", "Invalid or expired refresh token");
                return ResponseEntity.status(403).body(response);
            }

            Long userId = tokenProvider.getUserIdFromToken(refreshToken, true);

            List<RefreshToken> activeDbTokens = refreshTokenRepository.findByUserIdAndRevoked(userId, false);
            RefreshToken matchedToken = null;

            for (RefreshToken dbToken : activeDbTokens) {
                // Ensure expired check
                if (dbToken.getExpiresAt().isBefore(LocalDateTime.now())) {
                    dbToken.setRevoked(true);
                    refreshTokenRepository.save(dbToken);
                    continue;
                }

                if (passwordEncoder.matches(refreshToken, dbToken.getTokenHash())) {
                    matchedToken = dbToken;
                    break;
                }
            }

            if (matchedToken == null) {
                // Replay attack: Revoke all tokens for this user
                for (RefreshToken dbToken : activeDbTokens) {
                    dbToken.setRevoked(true);
                    refreshTokenRepository.save(dbToken);
                }
                response.put("success", false);
                response.put("message", "Refresh token compromised or revoked. Please log in again.");
                return ResponseEntity.status(403).body(response);
            }

            // Revoke current token
            matchedToken.setRevoked(true);
            refreshTokenRepository.save(matchedToken);

            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty() || !userOpt.get().getIsActive()) {
                response.put("success", false);
                response.put("message", "User account is disabled or does not exist");
                return ResponseEntity.status(403).body(response);
            }

            User user = userOpt.get();

            // Generate new token pair
            String newAccessToken = tokenProvider.generateAccessToken(user);
            String newRefreshToken = tokenProvider.generateRefreshToken(user);

            // Save new hashed token
            saveHashedRefreshToken(user.getId(), newRefreshToken);

            response.put("success", true);
            response.put("accessToken", newAccessToken);
            response.put("refreshToken", newRefreshToken);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Internal server error refreshing token");
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * User Logout
     */
    @PostMapping("/auth/logout")
    public ResponseEntity<Map<String, Object>> logout(@RequestBody(required = false) Map<String, String> body) {
        String plainRefreshToken = body != null ? body.get("refreshToken") : null;
        Map<String, Object> response = new HashMap<>();

        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!(principal instanceof Claims)) {
            response.put("success", false);
            response.put("message", "Unauthorized");
            return ResponseEntity.status(401).body(response);
        }

        Claims claims = (Claims) principal;
        Long userId = Long.parseLong(claims.getSubject());

        List<RefreshToken> activeDbTokens = refreshTokenRepository.findByUserIdAndRevoked(userId, false);

        if (plainRefreshToken != null) {
            for (RefreshToken dbToken : activeDbTokens) {
                if (passwordEncoder.matches(plainRefreshToken, dbToken.getTokenHash())) {
                    dbToken.setRevoked(true);
                    refreshTokenRepository.save(dbToken);
                    break;
                }
            }
        } else {
            // Revoke all
            for (RefreshToken dbToken : activeDbTokens) {
                dbToken.setRevoked(true);
                refreshTokenRepository.save(dbToken);
            }
        }

        response.put("success", true);
        response.put("message", "Logged out successfully");
        return ResponseEntity.ok(response);
    }

    private void saveHashedRefreshToken(Long userId, String plainToken) {
        String hashedToken = passwordEncoder.encode(plainToken);
        RefreshToken dbToken = new RefreshToken();
        dbToken.setUserId(userId);
        dbToken.setTokenHash(hashedToken);
        dbToken.setRevoked(false);
        dbToken.setExpiresAt(LocalDateTime.now().plusDays(7));
        refreshTokenRepository.save(dbToken);
    }

    /**
     * Forgot Password Request
     */
    @PostMapping("/auth/forgot-password")
    public ResponseEntity<Map<String, Object>> forgotPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        Map<String, Object> response = new HashMap<>();

        if (email == null || email.trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "Email is required");
            return ResponseEntity.status(400).body(response);
        }

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            response.put("success", false);
            response.put("message", "No account registered with this email address");
            return ResponseEntity.status(404).body(response);
        }

        User user = userOpt.get();

        // Delete any existing password reset tokens for this user
        passwordResetTokenRepository.deleteByUser(user);

        // Generate token and save
        String token = UUID.randomUUID().toString();
        LocalDateTime expiryDate = LocalDateTime.now().plusMinutes(15);
        PasswordResetToken resetToken = new PasswordResetToken(token, user, expiryDate);
        passwordResetTokenRepository.save(resetToken);

        // Dev/Mock Reset URL structure (usually running on frontend dev port 5173)
        String resetUrl = "http://localhost:5173/reset-password?token=" + token;

        // Print to backend system logs (convenient local console check)
        System.out.println("=================================================================");
        System.out.println("🔑 PASSWORD RESET REQUEST DETECTED!");
        System.out.println("User: " + user.getEmail() + " (" + user.getFullName() + ")");
        System.out.println("Reset Link: " + resetUrl);
        System.out.println("=================================================================");

        response.put("success", true);
        response.put("message", "A password reset link has been generated");
        response.put("resetUrl", resetUrl); // Shared response so frontend can display for easy testing
        return ResponseEntity.ok(response);
    }

    /**
     * Reset Password Action
     */
    @PostMapping("/auth/reset-password")
    public ResponseEntity<Map<String, Object>> resetPassword(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        String newPassword = body.get("newPassword");
        Map<String, Object> response = new HashMap<>();

        if (token == null || token.trim().isEmpty() || newPassword == null || newPassword.trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "Token and new password are required");
            return ResponseEntity.status(400).body(response);
        }

        if (newPassword.length() < 6) {
            response.put("success", false);
            response.put("message", "Password must be at least 6 characters long");
            return ResponseEntity.status(400).body(response);
        }

        Optional<PasswordResetToken> resetTokenOpt = passwordResetTokenRepository.findByToken(token);
        if (resetTokenOpt.isEmpty()) {
            response.put("success", false);
            response.put("message", "Invalid or expired password reset link");
            return ResponseEntity.status(400).body(response);
        }

        PasswordResetToken resetToken = resetTokenOpt.get();
        if (resetToken.isExpired()) {
            passwordResetTokenRepository.delete(resetToken);
            response.put("success", false);
            response.put("message", "This password reset link has expired");
            return ResponseEntity.status(400).body(response);
        }

        User user = resetToken.getUser();
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Delete used token
        passwordResetTokenRepository.delete(resetToken);

        response.put("success", true);
        response.put("message", "Password reset successfully. You can now log in.");
        return ResponseEntity.ok(response);
    }

    private void updateStreakAndActivity(User user) {
        try {
            String mapStr = user.getActivityMap();
            if (mapStr == null || mapStr.trim().isEmpty() || mapStr.equals("{}")) {
                mapStr = "{}";
            }

            Map<String, Integer> activity = objectMapper.readValue(mapStr, new com.fasterxml.jackson.core.type.TypeReference<Map<String, Integer>>() {});

            String today = java.time.LocalDate.now().toString();
            int currentCount = activity.getOrDefault(today, 0);
            activity.put(today, currentCount + 1);

            user.setActivityMap(objectMapper.writeValueAsString(activity));

            // Also check daily streak difference to ensure user.streak is correct
            java.time.LocalDateTime lastLogin = user.getLastLoginAt();
            java.time.LocalDateTime now = java.time.LocalDateTime.now();

            if (lastLogin == null) {
                user.setStreak(0);
            } else {
                long daysDiff = java.time.temporal.ChronoUnit.DAYS.between(lastLogin.toLocalDate(), now.toLocalDate());
                if (daysDiff == 1) {
                    user.setStreak((user.getStreak() != null ? user.getStreak() : 0) + 1);
                } else if (daysDiff > 1) {
                    user.setStreak(1);
                }
            }

            int currentStreak = user.getStreak() != null ? user.getStreak() : 0;
            int longest = user.getLongestStreak() != null ? user.getLongestStreak() : 0;
            if (currentStreak > longest) {
                user.setLongestStreak(currentStreak);
            }
        } catch (Exception e) {
            System.err.println("Error updating streak on login: " + e.getMessage());
        }
    }
}
