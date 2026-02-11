import { useState, useRef, useEffect } from "react";
import { BrainCircuit, LogOut, Settings, User, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  user?: { name: string; email: string };
  onLogout?: () => void;
}

const Header = ({ user, onLogout }: HeaderProps) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="header glass">
      <div className="container header-inner">
        <button onClick={() => navigate("/dashboard")} className="logo-link">
          <div className="logo-icon gradient-primary">
            <BrainCircuit style={{ width: "1.5rem", height: "1.5rem", color: "var(--primary-foreground)" }} />
          </div>
          <span className="logo-text">QuizArena</span>
        </button>

        {user && (
          <nav className="nav-links">
            <button onClick={() => navigate("/dashboard")} className="nav-link">Games</button>
            <button onClick={() => navigate("/leaderboard")} className="nav-link">
              <Trophy style={{ width: "1rem", height: "1rem" }} />
              Leaderboard
            </button>
          </nav>
        )}

        {user ? (
          <div className="dropdown-wrapper" ref={dropdownRef}>
            <button
              className="avatar"
              style={{ background: "var(--primary)", color: "var(--primary-foreground)", border: "2px solid var(--border)" }}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {getInitials(user.name)}
            </button>
            {dropdownOpen && (
              <div className="dropdown-content">
                <div className="dropdown-label">
                  <p style={{ fontWeight: 500, color: "var(--foreground)", fontSize: "0.875rem" }}>{user.name}</p>
                  <p style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>{user.email}</p>
                </div>
                <div className="dropdown-separator" />
                <button className="dropdown-item">
                  <User style={{ width: "1rem", height: "1rem" }} /> Profile
                </button>
                <button className="dropdown-item">
                  <Settings style={{ width: "1rem", height: "1rem" }} /> Settings
                </button>
                <div className="dropdown-separator" />
                <button className="dropdown-item destructive" onClick={() => { setDropdownOpen(false); onLogout?.(); }}>
                  <LogOut style={{ width: "1rem", height: "1rem" }} /> Log out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <button className="btn btn-ghost" onClick={() => navigate("/login")}>Log in</button>
            <button className="btn btn-primary" onClick={() => navigate("/signup")}>Sign up</button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
