// Cache Service for SkillBridge MVP
// Implements client-side caching for better user experience

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

interface CacheConfig {
  defaultTTL: number; // Default time to live (5 minutes)
  maxSize: number; // Maximum number of items in cache
}

class CacheService {
  private cache = new Map<string, CacheItem<any>>();
  private config: CacheConfig = {
    defaultTTL: 5 * 60 * 1000, // 5 minutes
    maxSize: 100 // Maximum 100 items
  };

  // Set item in cache
  set<T>(key: string, data: T, ttl?: number): void {
    try {
      // Check cache size limit
      if (this.cache.size >= this.config.maxSize) {
        this.evictOldest();
      }

      const item: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        ttl: ttl || this.config.defaultTTL
      };

      this.cache.set(key, item);
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  // Get item from cache
  get<T>(key: string): T | null {
    try {
      const item = this.cache.get(key);
      
      if (!item) {
        return null;
      }

      // Check if item has expired
      if (Date.now() - item.timestamp > item.ttl) {
        this.cache.delete(key);
        return null;
      }

      return item.data as T;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  // Check if item exists and is valid
  has(key: string): boolean {
    try {
      const item = this.cache.get(key);
      
      if (!item) {
        return false;
      }

      // Check if item has expired
      if (Date.now() - item.timestamp > item.ttl) {
        this.cache.delete(key);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Cache has error:', error);
      return false;
    }
  }

  // Remove item from cache
  delete(key: string): boolean {
    try {
      return this.cache.delete(key);
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  }

  // Clear all cache
  clear(): void {
    try {
      this.cache.clear();
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }

  // Get cache statistics
  getStats(): { size: number; maxSize: number; hitRate: number } {
    return {
      size: this.cache.size,
      maxSize: this.config.maxSize,
      hitRate: 0 // Could implement hit rate tracking if needed
    };
  }

  // Evict oldest items when cache is full
  private evictOldest(): void {
    try {
      let oldestKey: string | null = null;
      let oldestTime = Date.now();

      for (const [key, item] of this.cache.entries()) {
        if (item.timestamp < oldestTime) {
          oldestTime = item.timestamp;
          oldestKey = key;
        }
      }

      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    } catch (error) {
      console.error('Cache eviction error:', error);
    }
  }

  // Clean expired items
  cleanup(): void {
    try {
      const now = Date.now();
      for (const [key, item] of this.cache.entries()) {
        if (now - item.timestamp > item.ttl) {
          this.cache.delete(key);
        }
      }
    } catch (error) {
      console.error('Cache cleanup error:', error);
    }
  }
}

// Create cache instances for different types of data
export const userCache = new CacheService();
export const courseCache = new CacheService();
export const ragCache = new CacheService();
export const leaderboardCache = new CacheService();

// Cache keys for different data types
export const CACHE_KEYS = {
  USER_PROFILE: 'user_profile',
  USER_STATS: 'user_stats',
  COURSES: 'courses',
  COURSE_PROGRESS: 'course_progress',
  LEADERBOARD: 'leaderboard',
  RAG_QUERY: 'rag_query',
  VOICE_HISTORY: 'voice_history'
} as const;

// Helper functions for common caching operations
export const cacheHelpers = {
  // Cache user profile
  cacheUserProfile: (userId: string, profile: any) => {
    userCache.set(`${CACHE_KEYS.USER_PROFILE}_${userId}`, profile, 10 * 60 * 1000); // 10 minutes
  },

  // Get cached user profile
  getCachedUserProfile: (userId: string) => {
    return userCache.get(`${CACHE_KEYS.USER_PROFILE}_${userId}`);
  },

  // Cache RAG query results
  cacheRAGQuery: (query: string, results: any) => {
    const queryHash = btoa(query).slice(0, 20); // Simple hash
    ragCache.set(`${CACHE_KEYS.RAG_QUERY}_${queryHash}`, results, 30 * 60 * 1000); // 30 minutes
  },

  // Get cached RAG query results
  getCachedRAGQuery: (query: string) => {
    const queryHash = btoa(query).slice(0, 20);
    return ragCache.get(`${CACHE_KEYS.RAG_QUERY}_${queryHash}`);
  },

  // Cache leaderboard
  cacheLeaderboard: (leaderboard: any) => {
    leaderboardCache.set(CACHE_KEYS.LEADERBOARD, leaderboard, 5 * 60 * 1000); // 5 minutes
  },

  // Get cached leaderboard
  getCachedLeaderboard: () => {
    return leaderboardCache.get(CACHE_KEYS.LEADERBOARD);
  },

  // Cache voice interaction (filtered)
  cacheVoiceInteraction: (userId: string, interaction: any) => {
    const key = `${CACHE_KEYS.VOICE_HISTORY}_${userId}`;
    const existing = userCache.get(key) || [];
    const filtered = filterVoiceInteraction(interaction);
    
    if (filtered) {
      existing.push(filtered);
      // Keep only last 10 interactions
      if (existing.length > 10) {
        existing.shift();
      }
      userCache.set(key, existing, 60 * 60 * 1000); // 1 hour
    }
  },

  // Get cached voice interactions
  getCachedVoiceInteractions: (userId: string) => {
    const key = `${CACHE_KEYS.VOICE_HISTORY}_${userId}`;
    return userCache.get(key) || [];
  }
};

// Filter voice interactions to remove filler words
function filterVoiceInteraction(interaction: any): any | null {
  try {
    if (!interaction.text) return null;

    // Remove common filler words
    const fillerWords = ['uhh', 'umm', 'you know', 'like', 'so', 'well', 'actually', 'basically'];
    let filteredText = interaction.text.toLowerCase();

    fillerWords.forEach(filler => {
      filteredText = filteredText.replace(new RegExp(filler, 'g'), '');
    });

    // Remove extra spaces
    filteredText = filteredText.replace(/\s+/g, ' ').trim();

    // Only return if meaningful content remains
    if (filteredText.length > 3) {
      return {
        ...interaction,
        text: filteredText,
        originalText: interaction.text
      };
    }

    return null;
  } catch (error) {
    console.error('Voice interaction filtering error:', error);
    return null;
  }
}

// Initialize cache cleanup interval
setInterval(() => {
  userCache.cleanup();
  courseCache.cleanup();
  ragCache.cleanup();
  leaderboardCache.cleanup();
}, 5 * 60 * 1000); // Cleanup every 5 minutes

export default CacheService;
