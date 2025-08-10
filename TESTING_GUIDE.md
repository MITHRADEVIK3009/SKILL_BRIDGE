# SkillBridge Testing & Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- A Supabase account (free tier works)
- Modern browser with microphone support

### 1. Environment Setup

1. **Copy the environment file:**
   ```bash
   cp .env.local .env
   ```

2. **Update your environment variables** in `.env`:
   ```env
   # Required for basic functionality
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # Optional for enhanced features
   VITE_ELEVENLABS_API_KEY=your_elevenlabs_api_key
   VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
   VITE_FACEBOOK_APP_ID=your_facebook_app_id
   ```

### 2. Database Setup

1. **Create a new Supabase project** at [supabase.com](https://supabase.com)

2. **Run the database schema:**
   - Go to your Supabase dashboard
   - Navigate to SQL Editor
   - Copy and paste the contents of `supabase/schema.sql`
   - Click "Run"

3. **Seed the database:**
   - In the SQL Editor, copy and paste `supabase/seed.sql`
   - Click "Run"

4. **Configure Authentication:**
   - Go to Authentication → Settings
   - Enable Google and Facebook providers if desired
   - Set redirect URLs to your domain

### 3. Install and Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:8080`

## 🧪 Testing Instructions

### Automated Test Suite

1. **Open the test suite:**
   ```
   Open src/tests/index.html in your browser
   ```

2. **Interactive Testing:**
   - Each test case has detailed steps
   - Run tests manually and mark results
   - Track overall progress in the summary

### Manual Testing Checklist

#### ✅ Core Features Test (Priority: High)

1. **User Registration & Authentication**
   - [ ] Sign up with email works
   - [ ] Password strength validation works
   - [ ] Social login (Google/Facebook) works
   - [ ] Email verification sent
   - [ ] Login redirects to dashboard
   - [ ] Logout works properly

2. **Voice Assistant**
   - [ ] Microphone permission granted
   - [ ] Voice recognition works
   - [ ] Commands are processed correctly
   - [ ] Multi-language support works
   - [ ] Text-to-speech responses work (if API key provided)

3. **Gamification System**
   - [ ] Points awarded for activities
   - [ ] Badges earned and displayed
   - [ ] Level progression works
   - [ ] Achievement notifications appear
   - [ ] Leaderboard updates correctly

#### ⚙️ Advanced Features Test (Priority: Medium)

4. **Course Progress**
   - [ ] Course enrollment works
   - [ ] Lesson completion tracked
   - [ ] Progress bars update
   - [ ] Course completion badges awarded

5. **Challenge System**
   - [ ] Challenges load correctly
   - [ ] Code submission works
   - [ ] Points awarded for completion

6. **User Profile**
   - [ ] Profile updates save
   - [ ] Statistics display correctly
   - [ ] Badges showcase works

## 🔧 Troubleshooting

### Common Issues

#### 1. "Supabase connection failed"
- **Solution:** Check your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env`
- **Verify:** Your Supabase project is active and credentials are correct

#### 2. "Voice recognition not working"
- **Solution:** Ensure you're using HTTPS or localhost
- **Check:** Browser microphone permissions are granted
- **Try:** Different browsers (Chrome, Edge, Safari work best)

#### 3. "Database errors during registration"
- **Solution:** Ensure the database schema has been applied
- **Check:** RLS policies are enabled in Supabase
- **Verify:** All tables exist in your database

#### 4. "Social login not working"
- **Solution:** Configure OAuth providers in Supabase Authentication settings
- **Set:** Correct redirect URLs in OAuth provider settings
- **Check:** Client IDs and secrets are properly configured

#### 5. "Toast notifications not appearing"
- **Solution:** Check browser console for JavaScript errors
- **Verify:** Sonner toast library is properly imported

## 📊 Test Results Template

Use this template to track your testing:

```
=== SkillBridge Test Results ===
Date: [Today's Date]
Tester: [Your Name]
Browser: [Chrome/Firefox/Safari/Edge]
Environment: [Development/Staging/Production]

CORE FEATURES:
✅ User Registration: PASSED
✅ User Login: PASSED  
✅ Voice Assistant: PASSED
✅ Badge System: PASSED
✅ Points System: PASSED
✅ Leaderboard: PASSED

ADVANCED FEATURES:
⏳ Course Progress: PENDING
⏳ Challenge System: PENDING  
⏳ Multi-language: PENDING

TOTAL: [X]/12 tests passed

NOTES:
- [Any specific issues found]
- [Performance observations]
- [User experience feedback]
```

## 🚦 Test Priority Levels

### 🔴 High Priority (Must Pass)
- User Registration & Login
- Voice Assistant Basic Functionality  
- Badge & Points System
- Core Navigation

### 🟡 Medium Priority (Should Pass)
- Social Login
- Multi-language Support
- Leaderboard
- Course Progress

### 🟢 Low Priority (Nice to Have)
- Advanced Badge Conditions
- Voice Command Edge Cases
- UI Polish Details

## 📈 Performance Expectations

### ⚡ Performance Benchmarks
- **Initial Load:** < 3 seconds
- **Voice Recognition Start:** < 1 second
- **Database Queries:** < 500ms
- **Badge Notifications:** Immediate
- **Page Transitions:** < 200ms

### 🎯 User Experience Goals
- **Intuitive Navigation:** Users can find features without help
- **Responsive Design:** Works on mobile and desktop
- **Clear Feedback:** Users always know what's happening
- **Error Handling:** Graceful failure with helpful messages

## 🔄 Continuous Testing

### Daily Smoke Tests
1. User login
2. Voice assistant basic command
3. Points awarded for activity
4. Navigation between pages

### Weekly Comprehensive Tests  
1. Run full test suite
2. Test all badge conditions
3. Verify multi-language support
4. Check database consistency

### Before Deployment
1. All high-priority tests pass
2. Performance benchmarks met
3. Cross-browser compatibility verified
4. Mobile responsiveness confirmed

## 📝 Reporting Issues

When reporting issues, please include:
1. **Steps to reproduce**
2. **Expected behavior**
3. **Actual behavior** 
4. **Browser and version**
5. **Console error messages**
6. **Screenshots if applicable**

## 🎉 Success Criteria

The application is ready for production when:
- ✅ 10/12 core tests pass
- ✅ No critical security vulnerabilities
- ✅ Performance benchmarks met
- ✅ Works on Chrome, Firefox, Safari, Edge
- ✅ Mobile responsive on iOS and Android
- ✅ Accessibility standards met (WCAG 2.1 AA)

---

**Happy Testing! 🚀**

For questions or issues, please create a GitHub issue with the "testing" label.
