import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
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

const MODE_ICONS = {
  normal: BookOpen,
  daily: Calendar,
  battle: Swords,
  speed: Zap,
};

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState(null);
  const [quizResults, setQuizResults] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState("");
  const [avatarPickerOpen, setAvatarPickerOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    fetchProfile();
    fetchQuizResults();
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();
    if (data) {
      setProfile({ full_name: data.full_name, email: data.email, avatar_index: data.avatar_index });
      setNewName(data.full_name);
    }
    setLoading(false);
  };

  const fetchQuizResults = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("quiz_results")
      .select("*")
      .eq("user_id", user.id)
      .order("completed_at", { ascending: false });
    if (data) setQuizResults(data);
  };

  const updateName = async () => {
    if (!user || !newName.trim()) return;
    await supabase.from("profiles").update({ full_name: newName.trim() }).eq("user_id", user.id);
    setProfile((p) => p ? { ...p, full_name: newName.trim() } : p);
    setEditingName(false);
  };

  const updateAvatar = async (index) => {
    if (!user) return;
    await supabase.from("profiles").update({ avatar_index: index }).eq("user_id", user.id);
    setProfile((p) => p ? { ...p, avatar_index: index } : p);
    setAvatarPickerOpen(false);
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 8) { setPasswordMsg("Password must be at least 8 characters"); return; }
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) { setPasswordMsg(error.message); } else {
      setPasswordMsg("Password updated successfully!");
      setNewPassword("");
      setTimeout(() => { setPasswordMsg(""); setChangingPassword(false); }, 2000);
    }
  };

  if (loading || !profile) {
    return (
      <div className="page">
        <AnimatedBackground variant="mesh" />
        <Header />
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
          <div className="animate-spin" style={{ width: 40, height: 40, border: "3px solid var(--border)", borderTopColor: "var(--primary)", borderRadius: "50%" }} />
        </div>
      </div>
    );
  }

  const totalScore = quizResults.reduce((s, r) => s + r.score, 0);
  const totalQuizzes = quizResults.length;
  const totalCorrect = quizResults.reduce((s, r) => s + r.correct_answers, 0);
  const totalQuestions = quizResults.reduce((s, r) => s + r.total_questions, 0);
  const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const currentAvatar = AVATARS[profile.avatar_index] || AVATARS[0];

  return (
    <div className="page">
      <AnimatedBackground variant="mesh" />
      <Header />

      <main className="container" style={{ paddingTop: "2rem", paddingBottom: "2rem" }}>
        {/* Profile Header */}
        <div className="profile-header card glow-border animate-fade-in" style={{ padding: "2rem", marginBottom: "1.5rem" }}>
          <div className="profile-header-inner">
            <div className="profile-avatar-section">
              <button className="profile-avatar-btn" onClick={() => setAvatarPickerOpen(!avatarPickerOpen)}>
                <div className="profile-avatar" style={{ background: currentAvatar.bg }}>
                  <span style={{ fontSize: "2.5rem" }}>{currentAvatar.emoji}</span>
                </div>
                <div className="profile-avatar-edit">
                  <Camera style={{ width: "0.875rem", height: "0.875rem" }} />
                </div>
              </button>

              {avatarPickerOpen && (
                <div className="avatar-picker animate-scale-in">
                  <p style={{ fontSize: "0.75rem", color: "var(--muted-foreground)", marginBottom: "0.5rem" }}>Choose your avatar</p>
                  <div className="avatar-grid">
                    {AVATARS.map((a) => (
                      <button key={a.id} className={`avatar-option ${a.id === profile.avatar_index ? "selected" : ""}`}
                        style={{ background: a.bg }} onClick={() => updateAvatar(a.id)}>
                        <span style={{ fontSize: "1.25rem" }}>{a.emoji}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="profile-info">
              {editingName ? (
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <input className="input" value={newName} onChange={(e) => setNewName(e.target.value)}
                    style={{ height: "2.25rem", fontSize: "1.25rem", fontWeight: 700, maxWidth: 250 }} autoFocus />
                  <button className="btn btn-primary btn-sm" onClick={updateName}><Check style={{ width: 16, height: 16 }} /></button>
                  <button className="btn btn-ghost btn-sm" onClick={() => { setEditingName(false); setNewName(profile.full_name); }}><X style={{ width: 16, height: 16 }} /></button>
                </div>
              ) : (
                <h1 style={{ fontSize: "1.5rem", fontWeight: 700, cursor: "pointer" }} onClick={() => setEditingName(true)}>
                  {profile.full_name || "Set your name"} <span style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>✏️</span>
                </h1>
              )}
              <p style={{ color: "var(--muted-foreground)", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "0.375rem" }}>
                <Mail style={{ width: 14, height: 14 }} /> {profile.email}
              </p>
              <p style={{ color: "var(--muted-foreground)", fontSize: "0.75rem", marginTop: "0.25rem" }}>
                Member since {new Date(user?.created_at || "").toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </p>
            </div>

            <div className="profile-quick-stats">
              <div className="profile-stat">
                <Trophy style={{ width: 20, height: 20, color: "var(--warning)" }} />
                <div>
                  <p style={{ fontSize: "1.25rem", fontWeight: 700 }}>{totalScore.toLocaleString()}</p>
                  <p style={{ fontSize: "0.7rem", color: "var(--muted-foreground)" }}>Total Score</p>
                </div>
              </div>
              <div className="profile-stat">
                <Target style={{ width: 20, height: 20, color: "var(--primary)" }} />
                <div>
                  <p style={{ fontSize: "1.25rem", fontWeight: 700 }}>{totalQuizzes}</p>
                  <p style={{ fontSize: "0.7rem", color: "var(--muted-foreground)" }}>Quizzes</p>
                </div>
              </div>
              <div className="profile-stat">
                <Flame style={{ width: 20, height: 20, color: "var(--accent)" }} />
                <div>
                  <p style={{ fontSize: "1.25rem", fontWeight: 700 }}>{accuracy}%</p>
                  <p style={{ fontSize: "0.7rem", color: "var(--muted-foreground)" }}>Accuracy</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="profile-tabs" style={{ marginBottom: "1.5rem" }}>
          {["overview", "quizzes", "settings"].map((tab) => (
            <button key={tab} className={`profile-tab ${activeTab === tab ? "active" : ""}`} onClick={() => setActiveTab(tab)}>
              {tab === "overview" && <User style={{ width: 16, height: 16 }} />}
              {tab === "quizzes" && <Award style={{ width: 16, height: 16 }} />}
              {tab === "settings" && <Lock style={{ width: 16, height: 16 }} />}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="animate-fade-in">
            <div className="profile-stats-grid">
              {[
                { label: "Total Score", value: totalScore.toLocaleString(), icon: Trophy, color: "var(--warning)" },
                { label: "Quizzes Played", value: totalQuizzes, icon: Target, color: "var(--primary)" },
                { label: "Correct Answers", value: totalCorrect, icon: Check, color: "var(--success)" },
                { label: "Accuracy", value: `${accuracy}%`, icon: Flame, color: "var(--accent)" },
              ].map((stat, i) => (
                <div key={stat.label} className="card glow-border animate-fade-in" style={{ padding: "1.25rem", animationDelay: `${i * 50}ms` }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <p style={{ fontSize: "0.75rem", color: "var(--muted-foreground)", marginBottom: "0.25rem" }}>{stat.label}</p>
                      <p style={{ fontSize: "1.5rem", fontWeight: 700 }}>{stat.value}</p>
                    </div>
                    <div style={{ width: 42, height: 42, borderRadius: "50%", background: `${stat.color}20`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <stat.icon style={{ width: 20, height: 20, color: stat.color }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Quizzes */}
            <h2 style={{ fontSize: "1.125rem", fontWeight: 600, margin: "1.5rem 0 0.75rem" }}>Recent Activity</h2>
            {quizResults.length === 0 ? (
              <div className="card" style={{ padding: "2rem", textAlign: "center" }}>
                <p style={{ color: "var(--muted-foreground)" }}>No quizzes completed yet. Start playing!</p>
                <button className="btn btn-gradient" style={{ marginTop: "1rem" }} onClick={() => navigate("/dashboard")}>Play Now</button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {quizResults.slice(0, 5).map((r) => {
                  const Icon = MODE_ICONS[r.mode] || BookOpen;
                  return (
                    <div key={r.id} className="card" style={{ padding: "1rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                      <div style={{ width: 36, height: 36, borderRadius: "var(--radius)", background: "var(--secondary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Icon style={{ width: 18, height: 18, color: "var(--primary)" }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 600, fontSize: "0.875rem", textTransform: "capitalize" }}>{r.mode} Quiz</p>
                        <p style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>
                          {new Date(r.completed_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ fontWeight: 700, color: "var(--primary)" }}>{r.score} pts</p>
                        <p style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>
                          {r.correct_answers}/{r.total_questions} correct
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "quizzes" && (
          <div className="animate-fade-in">
            <h2 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "0.75rem" }}>All Quiz Results</h2>
            {quizResults.length === 0 ? (
              <div className="card" style={{ padding: "2rem", textAlign: "center" }}>
                <p style={{ color: "var(--muted-foreground)" }}>No quiz history yet.</p>
              </div>
            ) : (
              <div className="quiz-results-list">
                {quizResults.map((r, i) => {
                  const Icon = MODE_ICONS[r.mode] || BookOpen;
                  const pct = r.total_questions > 0 ? Math.round((r.correct_answers / r.total_questions) * 100) : 0;
                  return (
                    <div key={r.id} className="card quiz-result-card animate-fade-in" style={{ animationDelay: `${i * 30}ms` }}>
                      <div className="quiz-result-header">
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          <div style={{ width: 40, height: 40, borderRadius: "var(--radius)", background: "var(--secondary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Icon style={{ width: 20, height: 20, color: "var(--primary)" }} />
                          </div>
                          <div>
                            <p style={{ fontWeight: 600, textTransform: "capitalize" }}>{r.mode} Quiz</p>
                            <p style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>
                              {new Date(r.completed_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <p style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--primary)" }}>{r.score}</p>
                          <p style={{ fontSize: "0.7rem", color: "var(--muted-foreground)" }}>points</p>
                        </div>
                      </div>
                      <div className="quiz-result-bar-wrap">
                        <div className="quiz-result-bar">
                          <div className="quiz-result-bar-fill" style={{ width: `${pct}%` }} />
                        </div>
                        <span style={{ fontSize: "0.75rem", fontWeight: 600, color: pct >= 70 ? "var(--success)" : pct >= 40 ? "var(--warning)" : "var(--accent)" }}>
                          {pct}%
                        </span>
                      </div>
                      <div style={{ display: "flex", gap: "1.5rem", fontSize: "0.8rem", color: "var(--muted-foreground)" }}>
                        <span>✅ {r.correct_answers} correct</span>
                        <span>❌ {r.total_questions - r.correct_answers} wrong</span>
                        <span>📝 {r.total_questions} total</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "settings" && (
          <div className="animate-fade-in" style={{ maxWidth: 500 }}>
            {/* Email */}
            <div className="card" style={{ padding: "1.25rem", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <Mail style={{ width: 20, height: 20, color: "var(--primary)" }} />
                  <div>
                    <p style={{ fontSize: "0.875rem", fontWeight: 600 }}>Email Address</p>
                    <p style={{ fontSize: "0.8rem", color: "var(--muted-foreground)" }}>{profile.email}</p>
                  </div>
                </div>
                <ChevronRight style={{ width: 16, height: 16, color: "var(--muted-foreground)" }} />
              </div>
            </div>

            {/* Change Password */}
            <div className="card" style={{ padding: "1.25rem", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}
                onClick={() => setChangingPassword(!changingPassword)}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <Lock style={{ width: 20, height: 20, color: "var(--primary)" }} />
                  <div>
                    <p style={{ fontSize: "0.875rem", fontWeight: 600 }}>Change Password</p>
                    <p style={{ fontSize: "0.8rem", color: "var(--muted-foreground)" }}>Update your password</p>
                  </div>
                </div>
                <ChevronRight style={{ width: 16, height: 16, color: "var(--muted-foreground)", transform: changingPassword ? "rotate(90deg)" : "none", transition: "transform 0.2s" }} />
              </div>

              {changingPassword && (
                <div style={{ marginTop: "1rem" }} className="animate-fade-in">
                  <div className="input-wrapper" style={{ marginBottom: "0.75rem" }}>
                    <input className="input" type={showPassword ? "text" : "password"} placeholder="New password (min 8 chars)"
                      value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    <button className="input-toggle" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                  {passwordMsg && (
                    <p style={{ fontSize: "0.8rem", marginBottom: "0.5rem", color: passwordMsg.includes("success") ? "var(--success)" : "var(--accent)" }}>
                      {passwordMsg}
                    </p>
                  )}
                  <button className="btn btn-primary" onClick={handleChangePassword}>Update Password</button>
                </div>
              )}
            </div>

            {/* Sign Out */}
            <button className="btn btn-outline btn-full" style={{ marginTop: "1rem", color: "var(--accent)", borderColor: "var(--accent)" }}
              onClick={async () => { await signOut(); navigate("/login"); }}>
              Sign Out
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;
