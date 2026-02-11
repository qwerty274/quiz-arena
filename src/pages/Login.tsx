import { useState } from "react";
import { BrainCircuit, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import AnimatedBackground from "@/components/AnimatedBackground";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/dashboard");
    }, 1000);
  };

  return (
    <div className="page-split">
      <AnimatedBackground variant="particles" />

      {/* Left Panel - Form */}
      <div className="auth-panel">
        <div className="auth-form-wrapper animate-fade-in">
          <div className="auth-logo">
            <Link to="/">
              <div className="auth-logo-icon gradient-primary">
                <BrainCircuit style={{ width: "1.75rem", height: "1.75rem", color: "var(--primary-foreground)" }} />
              </div>
              <span className="logo-text" style={{ fontSize: "1.5rem" }}>QuizArena</span>
            </Link>
            <h1 className="auth-title">Welcome back!</h1>
            <p className="auth-subtitle">Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="label" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input"
              />
            </div>

            <div className="form-group">
              <div className="form-row">
                <label className="label" htmlFor="password">Password</label>
                <button type="button" className="form-link">Forgot password?</button>
              </div>
              <div className="input-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="input-toggle">
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-gradient btn-lg btn-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : <><span>Sign in</span> <ArrowRight style={{ width: "1.25rem", height: "1.25rem" }} /></>}
            </button>
          </form>

          <p className="auth-footer">
            Don't have an account? <Link to="/signup">Sign up for free</Link>
          </p>
        </div>
      </div>

      {/* Right Panel - Decorative */}
      <div className="auth-deco gradient-primary">
        <div className="auth-deco-orb animate-float" style={{ top: "5rem", left: "2.5rem", width: "5rem", height: "5rem" }} />
        <div className="auth-deco-orb animate-float-delayed" style={{ bottom: "5rem", right: "2.5rem", width: "8rem", height: "8rem", background: "hsla(0, 0%, 100%, 0.05)" }} />
        <div className="auth-deco-orb animate-float-slow" style={{ top: "50%", right: "5rem", width: "4rem", height: "4rem" }} />

        <div className="auth-deco-content">
          <h2>Ready to Challenge Yourself?</h2>
          <p>Join thousands of students testing their knowledge across multiple game modes.</p>
          <div className="auth-features">
            {["4 Game Modes", "Real-time Battles", "Daily Challenges", "Leaderboards"].map((feature) => (
              <div key={feature} className="auth-feature">
                <div className="auth-feature-dot" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
