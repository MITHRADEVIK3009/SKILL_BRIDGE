import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import authService from './authService';

export interface Badge {
  badge_id: number;
  name: string;
  description: string;
  icon_url: string;
  criteria: any;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points_value: number;
  created_at: string;
  updated_at: string;
}

export interface UserBadge {
  user_badge_id: number;
  user_id: string;
  badge_id: number;
  earned_date: string;
  badge?: Badge;
}

export interface Achievement {
  type: string;
  title: string;
  description: string;
  points: number;
  badge?: Badge;
  timestamp: string;
}

export interface UserStats {
  total_points: number;
  level: number;
  experience_points: number;
  streak: number;
  badges_earned: number;
  challenges_completed: number;
  courses_completed: number;
  study_hours: number;
  rank: number;
}

export interface LeaderboardEntry {
  user_id: string;
  username: string;
  total_points: number;
  level: number;
  rank: number;
  badges_count: number;
  profile_picture?: string;
}

class GamificationService {
  private achievements: Achievement[] = [];
  private achievementCallbacks: ((achievement: Achievement) => void)[] = [];

  // Badge checking and awarding system
  async checkAndAwardBadges(userId: string, activityType: string, data?: any): Promise<Badge[]> {
    try {
      const newBadges: Badge[] = [];
      
      // Get all available badges
      const { data: allBadges } = await supabase
        .from('badges')
        .select('*');

      if (!allBadges) return newBadges;

      // Get user's current badges
      const { data: userBadges } = await supabase
        .from('user_badges')
        .select('badge_id')
        .eq('user_id', userId);

      const earnedBadgeIds = userBadges?.map(ub => ub.badge_id) || [];

      // Check each badge's criteria
      for (const badge of allBadges) {
        if (earnedBadgeIds.includes(badge.badge_id)) continue;

        const shouldAward = await this.checkBadgeCriteria(
          badge.criteria, 
          activityType, 
          userId, 
          data
        );

        if (shouldAward) {
          const awarded = await this.awardBadge(userId, badge.badge_id);
          if (awarded) {
            newBadges.push(badge);
            
            // Create achievement notification
            const achievement: Achievement = {
              type: 'badge_earned',
              title: `Badge Earned: ${badge.name}`,
              description: badge.description,
              points: badge.points_value,
              badge: badge,
              timestamp: new Date().toISOString()
            };
            
            this.addAchievement(achievement);
          }
        }
      }

      return newBadges;
    } catch (error) {
      console.error('Error checking badges:', error);
      return [];
    }
  }

  private async checkBadgeCriteria(
    criteria: any, 
    activityType: string, 
    userId: string, 
    data?: any
  ): Promise<boolean> {
    try {
      switch (criteria.type) {
        case 'lessons_completed':
          return await this.checkLessonsCompleted(userId, criteria.count);
        
        case 'challenges_completed':
          return await this.checkChallengesCompleted(userId, criteria.count);
          
        case 'course_completed':
          return await this.checkCoursesCompleted(userId, criteria.count);
          
        case 'courses_completed':
          return await this.checkCoursesCompleted(userId, criteria.count);
          
        case 'streak':
          return await this.checkStreak(userId, criteria.days);
          
        case 'perfect_scores':
          return await this.checkPerfectScores(userId, criteria.count);
          
        case 'fast_completion':
          return activityType === 'challenge_completed' && 
                 data?.execution_time && 
                 data.execution_time <= criteria.time_limit * 1000;
          
        case 'early_completion':
          return activityType === 'lesson_completed' && 
                 new Date().getHours() < parseInt(criteria.time.split(':')[0]);
          
        case 'late_completion':
          return activityType === 'lesson_completed' && 
                 new Date().getHours() >= parseInt(criteria.time.split(':')[0]);
          
        case 'voice_commands':
          return await this.checkVoiceCommands(userId, criteria.count);
          
        case 'study_hours':
          return await this.checkStudyHours(userId, criteria.hours);
          
        case 'achievements_shared':
          return await this.checkAchievementsShared(userId, criteria.count);
          
        case 'languages_used':
          return await this.checkLanguagesUsed(userId, criteria.count);
          
        default:
          return false;
      }
    } catch (error) {
      console.error('Error checking badge criteria:', error);
      return false;
    }
  }

  private async checkLessonsCompleted(userId: string, requiredCount: number): Promise<boolean> {
    const { count } = await supabase
      .from('user_lesson_progress')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .eq('is_completed', true);
    
    return (count || 0) >= requiredCount;
  }

  private async checkChallengesCompleted(userId: string, requiredCount: number): Promise<boolean> {
    const { count } = await supabase
      .from('user_challenges')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .eq('is_completed', true);
    
    return (count || 0) >= requiredCount;
  }

  private async checkCoursesCompleted(userId: string, requiredCount: number): Promise<boolean> {
    const { count } = await supabase
      .from('user_courses')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .eq('progress', 100);
    
    return (count || 0) >= requiredCount;
  }

  private async checkStreak(userId: string, requiredDays: number): Promise<boolean> {
    const { data: user } = await supabase
      .from('users')
      .select('streak')
      .eq('user_id', userId)
      .single();
    
    return (user?.streak || 0) >= requiredDays;
  }

  private async checkPerfectScores(userId: string, requiredCount: number): Promise<boolean> {
    const { count } = await supabase
      .from('user_lesson_progress')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .eq('quiz_score', 100);
    
    return (count || 0) >= requiredCount;
  }

  private async checkVoiceCommands(userId: string, requiredCount: number): Promise<boolean> {
    const { count } = await supabase
      .from('voice_interactions')
      .select('*', { count: 'exact' })
      .eq('user_id', userId);
    
    return (count || 0) >= requiredCount;
  }

  private async checkStudyHours(userId: string, requiredHours: number): Promise<boolean> {
    const { data: sessions } = await supabase
      .from('study_sessions')
      .select('duration')
      .eq('user_id', userId)
      .not('duration', 'is', null);
    
    const totalMinutes = sessions?.reduce((sum, session) => sum + (session.duration || 0), 0) || 0;
    const totalHours = totalMinutes / 60;
    
    return totalHours >= requiredHours;
  }

  private async checkAchievementsShared(userId: string, requiredCount: number): Promise<boolean> {
    // This would track shared achievements - placeholder for now
    return false;
  }

  private async checkLanguagesUsed(userId: string, requiredCount: number): Promise<boolean> {
    const { data: interactions } = await supabase
      .from('voice_interactions')
      .select('language')
      .eq('user_id', userId);
    
    const uniqueLanguages = new Set(interactions?.map(i => i.language)).size;
    return uniqueLanguages >= requiredCount;
  }

  private async awardBadge(userId: string, badgeId: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_badges')
        .insert({
          user_id: userId,
          badge_id: badgeId,
          earned_date: new Date().toISOString()
        });

      if (error) {
        console.error('Error awarding badge:', error);
        return false;
      }

      // Update user points
      const { data: badge } = await supabase
        .from('badges')
        .select('points_value, name')
        .eq('badge_id', badgeId)
        .single();

      if (badge) {
        await this.addPoints(userId, badge.points_value);
        
        // Show celebration notification
        toast.success(`🎉 Badge Earned: ${badge.name}!`, {
          description: `You earned ${badge.points_value} points!`,
          duration: 5000,
        });
      }

      return true;
    } catch (error) {
      console.error('Error awarding badge:', error);
      return false;
    }
  }

  // Points and XP management
  async addPoints(userId: string, points: number): Promise<void> {
    try {
      const { data: currentUser } = await supabase
        .from('users')
        .select('points, experience_points, level')
        .eq('user_id', userId)
        .single();

      if (currentUser) {
        const newPoints = currentUser.points + points;
        const newXP = currentUser.experience_points + points;
        const newLevel = this.calculateLevel(newXP);

        await supabase
          .from('users')
          .update({
            points: newPoints,
            experience_points: newXP,
            level: newLevel
          })
          .eq('user_id', userId);

        // Check for level up
        if (newLevel > currentUser.level) {
          const achievement: Achievement = {
            type: 'level_up',
            title: `Level Up!`,
            description: `You reached level ${newLevel}!`,
            points: newLevel * 10,
            timestamp: new Date().toISOString()
          };
          
          this.addAchievement(achievement);
          
          toast.success(`🚀 Level Up! You're now level ${newLevel}!`, {
            description: `You earned ${newLevel * 10} bonus points!`,
            duration: 5000,
          });

          await this.addPoints(userId, newLevel * 10);
        }

        // Update leaderboard
        await this.updateLeaderboard();
      }
    } catch (error) {
      console.error('Error adding points:', error);
    }
  }

  private calculateLevel(xp: number): number {
    // Level calculation: Level = floor(sqrt(XP / 100)) + 1
    return Math.floor(Math.sqrt(xp / 100)) + 1;
  }

  // Streak management
  async updateStreak(userId: string): Promise<void> {
    try {
      const today = new Date().toDateString();
      
      const { data: lastActivity } = await supabase
        .from('user_lesson_progress')
        .select('completion_date')
        .eq('user_id', userId)
        .eq('is_completed', true)
        .order('completion_date', { ascending: false })
        .limit(1);

      const { data: user } = await supabase
        .from('users')
        .select('streak')
        .eq('user_id', userId)
        .single();

      let newStreak = user?.streak || 0;
      
      if (lastActivity?.[0]) {
        const lastActivityDate = new Date(lastActivity[0].completion_date).toDateString();
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
        
        if (lastActivityDate === today) {
          // Already counted today
          return;
        } else if (lastActivityDate === yesterday) {
          // Continue streak
          newStreak += 1;
        } else {
          // Reset streak
          newStreak = 1;
        }
      } else {
        // First activity
        newStreak = 1;
      }

      await supabase
        .from('users')
        .update({ streak: newStreak })
        .eq('user_id', userId);

      // Check for streak badges
      await this.checkAndAwardBadges(userId, 'streak_updated', { streak: newStreak });

    } catch (error) {
      console.error('Error updating streak:', error);
    }
  }

  // Leaderboard management
  async updateLeaderboard(): Promise<void> {
    try {
      // This would normally be done by a database function
      // For now, we'll trigger it manually
      const { error } = await supabase.rpc('refresh_leaderboard');
      if (error) {
        console.error('Error updating leaderboard:', error);
      }
    } catch (error) {
      console.error('Error updating leaderboard:', error);
    }
  }

  async getLeaderboard(limit: number = 10): Promise<LeaderboardEntry[]> {
    try {
      const { data } = await supabase
        .from('leaderboard')
        .select(`
          user_id,
          rank,
          total_points,
          users!inner(
            username,
            level,
            profile_picture
          )
        `)
        .order('rank', { ascending: true })
        .limit(limit);

      if (!data) return [];

      return data.map((entry: any) => ({
        user_id: entry.user_id,
        username: entry.users.username,
        total_points: entry.total_points,
        level: entry.users.level,
        rank: entry.rank,
        badges_count: 0, // This would be calculated
        profile_picture: entry.users.profile_picture
      }));
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      return [];
    }
  }

  // User stats
  async getUserStats(userId: string): Promise<UserStats> {
    try {
      const { data: user } = await supabase
        .from('users')
        .select('points, level, experience_points, streak')
        .eq('user_id', userId)
        .single();

      const { count: badgesCount } = await supabase
        .from('user_badges')
        .select('*', { count: 'exact' })
        .eq('user_id', userId);

      const { count: challengesCount } = await supabase
        .from('user_challenges')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .eq('is_completed', true);

      const { count: coursesCount } = await supabase
        .from('user_courses')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .eq('progress', 100);

      const { data: sessions } = await supabase
        .from('study_sessions')
        .select('duration')
        .eq('user_id', userId)
        .not('duration', 'is', null);

      const { data: rank } = await supabase
        .from('leaderboard')
        .select('rank')
        .eq('user_id', userId)
        .single();

      const totalStudyMinutes = sessions?.reduce((sum, session) => sum + (session.duration || 0), 0) || 0;
      const studyHours = Math.round((totalStudyMinutes / 60) * 10) / 10;

      return {
        total_points: user?.points || 0,
        level: user?.level || 1,
        experience_points: user?.experience_points || 0,
        streak: user?.streak || 0,
        badges_earned: badgesCount || 0,
        challenges_completed: challengesCount || 0,
        courses_completed: coursesCount || 0,
        study_hours: studyHours,
        rank: rank?.rank || 0
      };
    } catch (error) {
      console.error('Error fetching user stats:', error);
      return {
        total_points: 0,
        level: 1,
        experience_points: 0,
        streak: 0,
        badges_earned: 0,
        challenges_completed: 0,
        courses_completed: 0,
        study_hours: 0,
        rank: 0
      };
    }
  }

  async getUserBadges(userId: string): Promise<UserBadge[]> {
    try {
      const { data } = await supabase
        .from('user_badges')
        .select(`
          *,
          badge:badges(*)
        `)
        .eq('user_id', userId)
        .order('earned_date', { ascending: false });

      return data || [];
    } catch (error) {
      console.error('Error fetching user badges:', error);
      return [];
    }
  }

  // Achievement notifications
  addAchievement(achievement: Achievement): void {
    this.achievements.unshift(achievement);
    
    // Notify subscribers
    this.achievementCallbacks.forEach(callback => callback(achievement));
  }

  onAchievement(callback: (achievement: Achievement) => void): () => void {
    this.achievementCallbacks.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.achievementCallbacks.indexOf(callback);
      if (index > -1) {
        this.achievementCallbacks.splice(index, 1);
      }
    };
  }

  getRecentAchievements(): Achievement[] {
    return this.achievements.slice(0, 10);
  }

  clearAchievements(): void {
    this.achievements = [];
  }

  // Activity tracking
  async trackActivity(activityType: string, data?: any): Promise<void> {
    const user = authService.getCurrentUser();
    if (!user) return;

    try {
      // Award points based on activity type
      let points = 0;
      
      switch (activityType) {
        case 'lesson_completed':
          points = 10;
          await this.updateStreak(user.user_id);
          break;
        case 'challenge_completed':
          points = data?.points_reward || 20;
          break;
        case 'course_completed':
          points = 100;
          break;
        case 'voice_command_used':
          points = 1;
          break;
        case 'daily_login':
          points = 5;
          break;
        default:
          points = 0;
      }

      if (points > 0) {
        await this.addPoints(user.user_id, points);
      }

      // Check for new badges
      await this.checkAndAwardBadges(user.user_id, activityType, data);

      // Create activity achievement
      if (points > 0) {
        const achievement: Achievement = {
          type: activityType,
          title: this.getActivityTitle(activityType),
          description: `You earned ${points} points!`,
          points,
          timestamp: new Date().toISOString()
        };
        
        this.addAchievement(achievement);
      }
    } catch (error) {
      console.error('Error tracking activity:', error);
    }
  }

  private getActivityTitle(activityType: string): string {
    switch (activityType) {
      case 'lesson_completed': return 'Lesson Completed!';
      case 'challenge_completed': return 'Challenge Completed!';
      case 'course_completed': return 'Course Completed!';
      case 'voice_command_used': return 'Voice Command Used!';
      case 'daily_login': return 'Daily Login Bonus!';
      default: return 'Activity Completed!';
    }
  }
}

// Export singleton instance
export const gamificationService = new GamificationService();
export default gamificationService;
