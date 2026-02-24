import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import AnimatedBackground from "@/components/AnimatedBackground";
import {
  User, Mail, Lock, Trophy, Target, Flame, Award,
  Camera, Check, X, Eye, EyeOff, ChevronRight, BookOpen, Calendar, Swords, Zap
} from "lucide-react";

const AVATARS = [
  { id: 0, emoji: "🧠", bg: "hsl(250, 90%, 65%)" },
  { id: 1, emoji: "🦊", bg: "hsl(20, 90%, 55%)" },
  { id: 2, emoji: "🐉", bg: "hsl(160, 80%, 45%)" },
  { id: 3, emoji: "🦅", bg: "hsl(200, 80%, 50%)" },
  { id: 4, emoji: "🐺", bg: "hsl(230, 50%, 50%)" },
  { id: 5, emoji: "🦁", bg: "hsl(45, 95%, 55%)" },
  { id: 6, emoji: "🐙", bg: "hsl(340, 85%, 60%)" },
  { id: 7, emoji: "🦄", bg: "hsl(280, 85%, 65%)" },
  { id: 8, emoji: "🐲", bg: "hsl(0, 70%, 50%)" },
  { id: 9, emoji: "🎯", bg: "hsl(180, 70%, 50%)" },
  { id: 10, emoji: "⚡", bg: "hsl(50, 90%, 50%)" },
  { id: 11, emoji: "🔥", bg: "hsl(15, 90%, 55%)" },
];

const Profile = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState("");
  const [avatarPickerOpen, setAvatarPickerOpen] = useState(false);

  // 🔐 Fetch Profile from Backend
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await fetch("http://localhost:4000/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          navigate("/login");
          return;
        }

        setProfile({
          full_name: data.name,
          email: data.email,
          avatar_index: 0,
          created_at: data.createdAt,
        });

        setNewName(data.name);
      } catch (err) {
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const updateName = async () => {
    const token = localStorage.getItem("token");
    if (!newName.trim()) return;

    await fetch("http://localhost:4000/api/auth/update-name", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: newName.trim() }),
    });

    setProfile((p) => ({ ...p, full_name: newName.trim() }));
    setEditingName(false);
  };

  const handleChangePassword = async () => {
    const token = localStorage.getItem("token");

    if (newPassword.length < 8) {
      setPasswordMsg("Password must be at least 8 characters");
      return;
    }

    const res = await fetch("http://localhost:4000/api/auth/change-password", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ password: newPassword }),
    });

    const data = await res.json();

    if (!res.ok) {
      setPasswordMsg(data.message);
    } else {
      setPasswordMsg("Password updated successfully!");
      setNewPassword("");
      setTimeout(() => {
        setPasswordMsg("");
        setChangingPassword(false);
      }, 2000);
    }
  };

  const signOut = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading || !profile) {
    return (
      <div className="page">
        <AnimatedBackground variant="mesh" />
        <Header />
      </div>
    );
  }

  const currentAvatar = AVATARS[profile.avatar_index] || AVATARS[0];

  return (
    <div className="page">
      <AnimatedBackground variant="mesh" />
      <Header />

      <main className="container" style={{ paddingTop: "2rem", paddingBottom: "2rem" }}>
        <div className="profile-header card glow-border animate-fade-in" style={{ padding: "2rem", marginBottom: "1.5rem" }}>
          <div className="profile-header-inner">
            <div className="profile-avatar-section">
              <button className="profile-avatar-btn">
                <div className="profile-avatar" style={{ background: currentAvatar.bg }}>
                  <span style={{ fontSize: "2.5rem" }}>{currentAvatar.emoji}</span>
                </div>
              </button>
            </div>

            <div className="profile-info">
              {editingName ? (
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <input
                    className="input"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    style={{ height: "2.25rem", fontSize: "1.25rem", fontWeight: 700, maxWidth: 250 }}
                    autoFocus
                  />
                  <button className="btn btn-primary btn-sm" onClick={updateName}><Check size={16} /></button>
                  <button className="btn btn-ghost btn-sm" onClick={() => setEditingName(false)}><X size={16} /></button>
                </div>
              ) : (
                <h1 style={{ fontSize: "1.5rem", fontWeight: 700, cursor: "pointer" }} onClick={() => setEditingName(true)}>
                  {profile.full_name}
                </h1>
              )}

              <p style={{ color: "var(--muted-foreground)", fontSize: "0.875rem" }}>
                <Mail size={14} /> {profile.email}
              </p>
            </div>
          </div>
        </div>

        <button
          className="btn btn-outline btn-full"
          style={{ marginTop: "1rem", color: "var(--accent)", borderColor: "var(--accent)" }}
          onClick={signOut}
        >
          Sign Out
        </button>
      </main>
    </div>
  );
};

export default Profile;
