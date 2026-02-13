import { useState, useRef, useEffect } from "react";
import { BrainCircuit, LogOut, Settings, User, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const AVATARS = [
  { emoji: "🧠", bg: "hsl(250, 90%, 65%)" },
  { emoji: "🦊", bg: "hsl(20, 90%, 55%)" },
  { emoji: "🐉", bg: "hsl(160, 80%, 45%)" },
  { emoji: "🦅", bg: "hsl(200, 80%, 50%)" },
  { emoji: "🐺", bg: "hsl(230, 50%, 50%)" },
  { emoji: "🦁", bg: "hsl(45, 95%, 55%)" },
  { emoji: "🐙", bg: "hsl(340, 85%, 60%)" },
  { emoji: "🦄", bg: "hsl(280, 85%, 65%)" },
  { emoji: "🐲", bg: "hsl(0, 70%, 50%)" },
  { emoji: "🎯", bg: "hsl(180, 70%, 50%)" },
  { emoji: "⚡", bg: "hsl(50, 90%, 50%)" },
  { emoji: "🔥", bg: "hsl(15, 90%, 55%)" },
];

const Header = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileData, setProfileData] = useState<{ full_name: string; avatar_index: number } | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      supabase.from("profiles").select("full_name, avatar_index").eq("user_id", user.id).single()
        .then(({ data }) => { if (data) setProfileData(data); });
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const avatar = AVATARS[profileData?.avatar_index || 0];

  return (
    <header className="header glass">
      <div className="container header-inner">
        <button onClick={() => navigate(user ? "/dashboard" : "/")} className="logo-link">
          <div className="logo-icon gradient-primary">
            <BrainCircuit style={{ width: "1.5rem", height: "1.5rem", color: "var(--primary-foreground)" }} />
          </div>
          <span className="logo-text">QuizArena</span>
        </button>

        {user && (
          <nav className="nav-links">
            <button onClick={() => navigate("/dashboard")} className="nav-link">Games</button>
            <button onClick={() => navigate("/leaderboard")} className="nav-link">
              <Trophy style={{ width: "1rem", height: "1rem" }} /> Leaderboard
            </button>
          </nav>
        )}

        {user ? (
          <div className="dropdown-wrapper" ref={dropdownRef}>
            <button className="avatar" style={{ background: avatar.bg, fontSize: "1.25rem", border: "2px solid var(--border)" }}
              onClick={() => setDropdownOpen(!dropdownOpen)}>
              {avatar.emoji}
            </button>
            {dropdownOpen && (
              <div className="dropdown-content">
                <div className="dropdown-label">
                  <p style={{ fontWeight: 500, color: "var(--foreground)", fontSize: "0.875rem" }}>{profileData?.full_name || "User"}</p>
                  <p style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>{user.email}</p>
                </div>
                <div className="dropdown-separator" />
                <button className="dropdown-item" onClick={() => { setDropdownOpen(false); navigate("/profile"); }}>
                  <User style={{ width: "1rem", height: "1rem" }} /> Profile
                </button>
                <button className="dropdown-item" onClick={() => { setDropdownOpen(false); navigate("/profile"); }}>
                  <Settings style={{ width: "1rem", height: "1rem" }} /> Settings
                </button>
                <div className="dropdown-separator" />
                <button className="dropdown-item destructive" onClick={async () => { setDropdownOpen(false); await signOut(); navigate("/login"); }}>
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
