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
