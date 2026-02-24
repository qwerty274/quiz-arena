# 🚀 Quick Start Guide

## How to Run Everything

### 1. Start MongoDB
Make sure MongoDB is running on your system.

### 2. Start Backend Server

```bash
cd Backend
npm start
```
The backend should run on `http://localhost:4000`

### 3. Start Frontend

```bash
cd Frontend
npm run dev
```
The frontend should run on `http://localhost:5173` (or similar)

## Testing the Complete Flow

### Step 1: Register/Login
1. Go to `http://localhost:5173` (Frontend URL)
2. Register with credentials or login
3. Get redirected to Dashboard

### Step 2: Complete a Quiz
1. Click on any game mode (Normal, Daily, Speed, or Battle)
2. Answer 5 quiz questions
3. Submit your answers
4. View results screen
5. **Results are automatically saved to MongoDB** ✅

### Step 3: View Updated Profile
1. Click on Profile in header
2. See all your updated stats:
   - Total Score (accumulated)
   - Quizzes Played (count)
   - Win Rate % (accuracy)
   - Correct Answers (count)
3. Check Statistics tab
4. See Achievements unlocking
5. Click Refresh to get latest data

### Step 4: Edit Profile
1. Click on your name to edit
2. Change password in Security tab
3. View updated stats after each quiz

## What Gets Saved to Database

When you complete a quiz:

```javascript
{
  totalScore: 450 + 320 = 770 (accumulates)
  totalQuizzes: 1 → 2 → 3 (increments)
  correctAnswers: 4 → 8 → 11 (accumulates)
  accuracy: 80% (latest quiz accuracy)
}
```

## Example Stats Display

After completing 3 quizzes with scores of 450, 320, 280:

```
Total Score:        1,050 points ✓
Quizzes Played:     3 ✓
Win Rate:           78% ✓
Correct Answers:    12 ✓
Average Score:      350 ✓
Achievements:
  ✓ First Quiz (1+ quiz)
  ✓ Quiz Starter (5+ quizzes) - locked
  ⭐ Quiz Master (10+ quizzes) - locked
  ✓ Accuracy Pro (78%) - needs 80%
```

## Key Features in Action

### 1. Quiz Results Flow
```
Take Quiz → Answer Questions → Submit Results 
→ Score Calculated → Database Updated → Profile Reflects Stats
```

### 2. Profile Dashboard
```
Real-time Stats → Achievements Progress → Statistics Details 
→ Refresh for Latest → Edit Profile → Change Password
```

### 3. Data Persistence
All stats are saved in MongoDB and persist across sessions:
- Close and reopen app
- Data remains the same
- Stats continue to accumulate

## Troubleshooting

### If stats don't update:
1. Check Backend is running on `:4000`
2. Check token is saved in localStorage
3. Open browser DevTools → Network
4. Look for `quiz-result` POST request
5. Check response status is 200

### If profile page is blank:
1. Make sure you're logged in (check token in localStorage)
2. Check Backend is running
3. Make sure `/api/auth/profile` endpoint responds
4. Check browser console for errors

### If quiz doesn't complete:
1. Make sure to submit all questions
2. Answer all 5 questions
3. Click "See Results" button
4. Results should auto-save

## Database Structure

### User Collection
```javascript
{
  _id: ObjectId,
  name: "John Doe",
  email: "john@gmail.com",
  password: "hashed_password",
  totalScore: 1050,           // Accumulates
  totalQuizzes: 3,            // Increments
  correctAnswers: 12,         // Accumulates
  accuracy: 78,               // Latest %
  createdAt: "2026-02-24",
  updatedAt: "2026-02-24"
}
```

## API Endpoints Available

### POST /api/auth/quiz-result
Save quiz results after completion
```javascript
{
  score: 450,
  correctAnswers: 4,
  totalQuestions: 5,
  mode: "normal"
}
```

### GET /api/auth/profile
Fetch current user profile with stats

### PUT /api/auth/update-name
Update username

### PUT /api/auth/change-password
Change user password

## Performance Tips

1. **Reduce Network Calls**: Stats are fetched once on Profile load
2. **Use Refresh Button**: To get latest data without page reload
3. **Batch Operations**: All quiz data saved in one request
4. **Cache Management**: Browser caches stats, refresh to update

## Next Steps (Optional Enhancements)

- [ ] Add streak calculation
- [ ] Add leaderboard with top players
- [ ] Add quiz history/statistics
- [ ] Add badges/medals display
- [ ] Add social features (friends, challenges)
- [ ] Add data export (CSV/PDF)
- [ ] Add analytics dashboard
- [ ] Add daily bonuses

---

✅ **Everything is ready to use!**

Start your servers and begin taking quizzes to see your stats update in real-time.
