# 🎯 SkillBridge – AI-Powered Voice Learning Platform

Transform your coding education with voice-interactive learning, gamification, and AI assistance.

**🚀 Deploy with:** Vercel | **📄 License:** MIT | **💻 Tech Stack:** TypeScript, React, Supabase

## ✨ Features

### 🔐 **Robust Authentication System**
- Secure user registration with password strength validation
- Social login (Google & Facebook OAuth)  
  *(Display an extra page or formal message indicating this feature is not yet enabled or configured)*
- Email verification and password recovery  
  *(Same handling as social login — show a message that it is not yet configured)*
- Multi-language support  
  *(Multi-language support is provided in the authentication system covering UI language preferences and form validation messages)*

### 🎮 **Advanced Gamification**
- **15 Achievement Badges** with smart detection
- Points & XP system with level progression
- Learning streak tracking
- Real-time leaderboard with rankings
- Celebration notifications for achievements

### 🎤 **Multi-Language Voice Assistant**
- **10+ Language Support** (English, Spanish, French, German, Chinese, Japanese, etc.)
- Smart command recognition:
  - "Download study materials" → Resource access
  - "Track my study time" → Session timer
  - "Show my progress" → Analytics display
  - "Show leaderboard" → Rankings view
- Text-to-speech integration with ElevenLabs
- Context-aware responses

### 📊 **Comprehensive Progress Tracking**
- Real-time learning analytics
- Course progress visualization
- Study time tracking
- Performance insights
- Personalized recommendations

### 🏆 **Interactive Learning**
- Structured courses with lessons
- Coding challenges with real-time testing
- Progress-based rewards
- Social features and competition

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Supabase account (free tier)
- Modern browser with microphone support

### 1. Clone & Install
```bash
# Clone the repository
git clone https://github.com/MITHRADEVIK3009/SKILL_BRIDGE.git
cd SKILL_BRIDGE

# Install dependencies
npm install
```

### 2. Environment Setup
```bash
# Copy environment template
cp .env.local .env

# Update with your credentials
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Setup
1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the database schema: Copy `supabase/schema.sql` to Supabase SQL Editor
3. Seed sample data: Copy `supabase/seed.sql` to SQL Editor

### 4. Run Development Server
```bash
npm run dev
```

🎉 **Visit http://localhost:8080 to see your application!**

## 🧪 Testing

We've included a comprehensive test suite with 12 detailed test cases:

### Quick Test Setup
```bash
# Windows users - run automated setup
quick-test.bat

# Or manually
npm run dev
# Then open: src/tests/index.html
```

### Test Coverage
- ✅ User Registration & Authentication
- ✅ Voice Assistant Functionality  
- ✅ Badge & Points System
- ✅ Leaderboard Updates
- ✅ Course Progress Tracking
- ✅ Multi-language Support
- ✅ Social Login Integration

## 🏗️ Tech Stack

### Frontend
- **Vite** - Fast build tool
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **React Router** - Navigation
- **React Query** - Data fetching

### Backend & Services
- **Supabase** - Database & Authentication
- **PostgreSQL** - Relational database
- **Row Level Security** - Data protection
- **ElevenLabs** - Text-to-speech (optional)
- **Web Speech API** - Voice recognition

### Deployment
- **Vercel** - Hosting platform
- **Git** - Version control
- **GitHub** - Repository hosting

## 📁 Project Structure

```
SKILL_BRIDGE/
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/              # Route components
│   ├── services/           # API and business logic
│   │   ├── authService.ts  # Authentication system
│   │   └── gamificationService.ts # Badge & rewards
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   └── types/              # TypeScript definitions
├── supabase/
│   ├── schema.sql          # Database schema
│   └── seed.sql            # Sample data
├── src/tests/
│   └── index.html          # Interactive test suite
└── docs/
    ├── TESTING_GUIDE.md    # Comprehensive testing guide
    └── RELEASE_NOTES.md    # Feature documentation
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **One-Click Deploy:**
   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/MITHRADEVIK3009/SKILL_BRIDGE)

2. **Manual Deploy:**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel --prod
   ```

3. **Environment Variables in Vercel:**
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_ELEVENLABS_API_KEY` (optional)

### Other Platforms
- **Netlify:** `npm run build` then deploy `dist/` folder
- **GitHub Pages:** Use `gh-pages` package
- **Railway:** Connect GitHub repo directly

## 🎯 Key Features Showcase

### 🏆 Gamification System
```typescript
// Automatic badge detection
await gamificationService.trackActivity('lesson_completed');
// Awards points, checks for badges, updates leaderboard
```

### 🎤 Voice Commands
```typescript
// Multi-language voice recognition
const { isListening, startListening } = useVoiceRecognition({
  language: 'en-US', // or 'es-ES', 'fr-FR', etc.
  onCommand: (command) => processCommand(command)
});
```

### 🔐 Authentication
```typescript
// Secure authentication with social login
const result = await authService.signUp({
  username: 'user123',
  email: 'user@example.com',
  password: 'SecurePass123!',
  preferred_language: 'en-US'
});
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

- 📖 **Documentation:** [TESTING_GUIDE.md](TESTING_GUIDE.md)
- 🐛 **Issues:** [GitHub Issues](https://github.com/MITHRADEVIK3009/SKILL_BRIDGE/issues)
- 💬 **Discussions:** [GitHub Discussions](https://github.com/MITHRADEVIK3009/SKILL_BRIDGE/discussions)

## 🌟 Roadmap

- [ ] **Phase 2:** Local ML model with offline RAG system
- [ ] **Phase 3:** Advanced code playground with live execution
- [ ] **Phase 4:** Social features and peer collaboration
- [ ] **Phase 5:** Mobile app development

---

**Built with ❤️ for immersive coding education**

[![Star this repo](https://img.shields.io/github/stars/MITHRADEVIK3009/SKILL_BRIDGE?style=social)](https://github.com/MITHRADEVIK3009/SKILL_BRIDGE/stargazers)

