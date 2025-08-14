# SkillBridge Deployment Preparation Script
Write-Host "🚀 Starting SkillBridge deployment preparation..." -ForegroundColor Green

# 1. Remove unnecessary files to reduce size
Write-Host "📦 Cleaning up unnecessary files..." -ForegroundColor Yellow
Remove-Item -Path ".env" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "dist" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path ".vercel" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "*.log" -Force -ErrorAction SilentlyContinue

# 2. Initialize Git repository if not exists
Write-Host "📋 Setting up Git repository..." -ForegroundColor Yellow
if (!(Test-Path ".git")) {
    git init
    git branch -M main
}

# 3. Add all files to Git
Write-Host "📝 Adding files to Git..." -ForegroundColor Yellow
git add .
git commit -m "feat: Production-ready SkillBridge with optimized deployment configuration

- Fixed Vercel runtime configuration issue
- Added comprehensive environment template
- Optimized project structure for deployment
- Professional README with complete setup instructions
- Ready for production deployment with Supabase integration"

# 4. Set up remote repository
Write-Host "🔗 Connecting to GitHub repository..." -ForegroundColor Yellow
git remote remove origin 2>$null
git remote add origin https://github.com/MITHRADEVIK3009/SKILL_BRIDGE.git

# 5. Check final project size
Write-Host "📊 Final project size check..." -ForegroundColor Yellow
$size = (Get-ChildItem -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
Write-Host "Project size: $([math]::Round($size, 2)) MB" -ForegroundColor Green

# 6. Push to repository
Write-Host "🚀 Pushing to GitHub..." -ForegroundColor Yellow
git push -u origin main --force

Write-Host "✅ Deployment preparation complete!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Go to https://vercel.com/new" -ForegroundColor White
Write-Host "2. Import your GitHub repository: MITHRADEVIK3009/SKILL_BRIDGE" -ForegroundColor White
Write-Host "3. Add these environment variables in Vercel:" -ForegroundColor White
Write-Host "   - VITE_SUPABASE_URL=https://fppjthrafhounxobvorm.supabase.co" -ForegroundColor White
Write-Host "   - VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwcGp0aHJhZmhvdW54b2JtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxNDgwNjksImV4cCI6MjA3MDcyNDA2OX0.cbRBxmXZ-2S6bOqIcahkOWNwfF2Qm8k_DpYHsnKWOuM" -ForegroundColor White
Write-Host "   - VITE_ELEVENLABS_API_KEY=sk_74174f519b914338f89c90736e5ca033606833410b18a9e0" -ForegroundColor White
Write-Host "4. Deploy!" -ForegroundColor White
