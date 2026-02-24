# 📋 Developer Reference Card

## Quick Facts

| Aspect | Details |
|--------|---------|
| **Frontend Framework** | React with Vite |
| **Backend Framework** | Node.js with Express |
| **Database** | MongoDB |
| **Authentication** | JWT Tokens |
| **Styling** | CSS with CSS Variables |
| **Icons** | Lucide React |
| **UI Pattern** | Glass Morphism + Glow Effects |

## Key Features at a Glance

```
✅ Quiz Results Save to DB (Auto-save on completion)
✅ Real-time Profile Stats (Fetches from MongoDB)
✅ 6 Unlockable Achievements (Based on thresholds)
✅ Edit Profile (Name & Password)
✅ Refresh Stats (Real-time updates)
✅ Responsive Design (Mobile-friendly)
✅ Professional UI (Dark theme with gradients)
✅ Security (JWT + Password hashing)
```

## Code Snippets

### Frontend - Save Quiz Result

```javascript
// In Quiz.jsx when quiz is finished
const saveResult = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch("http://localhost:4000/api/auth/quiz-result", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      score,
      correctAnswers,
      totalQuestions,
      mode,
    }),
  });
  const data = await response.json();
  console.log("Quiz result saved:", data);
};
```

### Backend - Save Quiz Result

```javascript
// In authController.js
export const saveQuizResult = async (req, res) => {
  try {
    const { score, correctAnswers, totalQuestions, mode } = req.body;
    const userId = req.user._id;

    const newAccuracy = Math.round((correctAnswers / totalQuestions) * 100);

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $inc: {
          totalScore: score,
          totalQuizzes: 1,
          correctAnswers: correctAnswers,
        },
        $set: {
          accuracy: newAccuracy,
        }
      },
      { new: true }
    );

    res.json({
      message: 'Quiz result saved successfully',
      stats: {
        totalScore: user.totalScore,
        totalQuizzes: user.totalQuizzes,
        correctAnswers: user.correctAnswers,
        accuracy: user.accuracy,
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
```

### Frontend - Fetch Profile

```javascript
// In Profile.jsx
const fetchProfile = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch("http://localhost:4000/api/auth/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  setProfile({
    full_name: data.name,
    email: data.email,
    totalScore: data.totalScore || 0,
    totalQuizzes: data.totalQuizzes || 0,
    correctAnswers: data.correctAnswers || 0,
    accuracy: data.accuracy || 0,
  });
};
```

## Database Queries

### Update User Stats After Quiz

```javascript
// MongoDB Command
db.users.findByIdAndUpdate(
  userId,
  {
    $inc: {
      totalScore: score,
      totalQuizzes: 1,
      correctAnswers: correctAnswers,
    },
    $set: {
      accuracy: newAccuracy,
    }
  },
  { new: true }
)
```

### Fetch User Profile

```javascript
// MongoDB Command
db.users.findById(userId)
  .select('-password')
```

## Color Reference

```css
Primary:   hsl(250, 90%, 65%)  /* Purple */
Accent:    hsl(340, 85%, 60%)  /* Red */
Success:   hsl(160, 80%, 45%)  /* Green */
Warning:   hsl(45, 95%, 55%)   /* Yellow */
Background: hsl(230, 25%, 5%)  /* Dark */
Card:      hsl(230, 25%, 8%)   /* Darker */
Border:    hsl(230, 25%, 15%)  /* Gray */
Muted:     hsl(215, 20%, 65%)  /* Light Gray */
```

## Component Props

### Profile Component
```javascript
{
  profile: {
    full_name: String,
    email: String,
    avatar_index: Number,
    created_at: DateTime,
    totalScore: Number,
    totalQuizzes: Number,
    correctAnswers: Number,
    accuracy: Number,
  }
}
```

### Stat Card
```javascript
{
  label: String,        // "Total Score"
  value: Number,        // 1050
  icon: Component,      // Trophy
  trend: {
    value: Number,      // 12
    isPositive: Boolean // true
  }
}
```

## API Response Formats

### GET /api/auth/profile
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@gmail.com",
  "createdAt": "2026-02-24T10:30:00Z",
  "totalScore": 1050,
  "totalQuizzes": 3,
  "correctAnswers": 11,
  "accuracy": 80
}
```

### POST /api/auth/quiz-result
```json
{
  "message": "Quiz result saved successfully",
  "stats": {
    "totalScore": 1050,
    "totalQuizzes": 3,
    "correctAnswers": 11,
    "accuracy": 80
  }
}
```

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Stats not updating | Check token, verify Backend running on :4000 |
| Profile shows blank | Ensure logged in, check network requests |
| Quiz doesn't save | Complete all 5 questions, click Submit |
| Wrong stats | Refresh page or use Refresh button |
| Password change fails | Check password requirements (8+, 1 uppercase, 1 number) |
| Username taken | Choose different username, check DB |

## Testing Checklist

- [ ] Register new account
- [ ] Login successfully
- [ ] Complete one quiz
- [ ] Check profile updated
- [ ] Do 3 more quizzes
- [ ] Verify total score = sum of all quizzes
- [ ] Check achievements unlock
- [ ] Test refresh button
- [ ] Edit username
- [ ] Change password
- [ ] Verify responsive design on mobile

## File Locations

```
/Backend
├── models/
│   └── userModel.js ..................... User Schema
├── controllers/
│   └── authController.js ................ Business Logic
├── Routes/
│   └── authRoutes.js .................... API Routes
└── server.js ............................ Main Server

/Frontend
├── src/
│   ├── pages/
│   │   ├── Quiz.jsx ..................... Quiz Game
│   │   └── Profile.jsx .................. Profile Page
│   ├── components/
│   │   ├── Header.jsx ................... Navigation
│   │   ├── StatsCard.jsx ................ Stat Display
│   │   └── AnimatedBackground.jsx ....... Effects
│   └── index.css ........................ All Styles
```

## Performance Tips

1. **Cache Profile Data** - Store in localStorage for quick access
2. **Batch Requests** - Combine multiple stats in one API call
3. **Lazy Load** - Load achievements only when tab is clicked
4. **Optimize Images** - Keep avatar emojis lightweight
5. **Minimize Re-renders** - Use React.memo for stat cards

## Future Enhancements

```
Phase 2:
- [ ] Leaderboard with rankings
- [ ] Daily streak calculation
- [ ] User statistics graphs
- [ ] Export stats as CSV/PDF
- [ ] Social features (friends, challenges)
- [ ] Badges and medals system

Phase 3:
- [ ] Real-time multiplayer battles
- [ ] Analytics dashboard
- [ ] Achievements notifications
- [ ] Weekly/Monthly challenges
- [ ] Tournament mode
```

## Debugging Commands

### Check Token
```javascript
localStorage.getItem('token')
```

### Check User Data
```javascript
fetch('http://localhost:4000/api/auth/profile', {
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
}).then(r => r.json()).then(console.log)
```

### Save Test Quiz Result
```javascript
fetch('http://localhost:4000/api/auth/quiz-result', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`
  },
  body: JSON.stringify({
    score: 450,
    correctAnswers: 4,
    totalQuestions: 5,
    mode: 'normal'
  })
}).then(r => r.json()).then(console.log)
```

## Dependencies

### Backend
```
express, mongoose, bcryptjs, jsonwebtoken, cors, dotenv
```

### Frontend
```
react, react-router-dom, lucide-react, vite
```

---

**Keep this card handy for quick reference!** 📌

Last Updated: February 24, 2026
Version: 1.0 - Complete Implementation
