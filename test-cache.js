// Cache System Test Script
// Run with: node test-cache.js

// Mock the cache service for testing
class MockCacheService {
  constructor() {
    this.cache = new Map();
    this.config = {
      defaultTTL: 5 * 60 * 1000, // 5 minutes
      maxSize: 10 // Smaller for testing
    };
  }

  set(key, data, ttl = this.config.defaultTTL) {
    if (this.cache.size >= this.config.maxSize) {
      this.evictOldest();
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  has(key) {
    const item = this.cache.get(key);
    if (!item) return false;

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  delete(key) {
    return this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }

  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.config.maxSize,
      hitRate: 0
    };
  }

  evictOldest() {
    let oldestKey = null;
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
  }

  cleanup() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

// Test voice interaction filtering
function filterVoiceInteraction(interaction) {
  if (!interaction.text) return null;

  const fillerWords = ['uhh', 'umm', 'you know', 'like', 'so', 'well', 'actually', 'basically'];
  let filteredText = interaction.text.toLowerCase();

  fillerWords.forEach(filler => {
    filteredText = filteredText.replace(new RegExp(filler, 'g'), '');
  });

  filteredText = filteredText.replace(/\s+/g, ' ').trim();

  if (filteredText.length > 3) {
    return {
      ...interaction,
      text: filteredText,
      originalText: interaction.text
    };
  }

  return null;
}

async function testCacheSystem() {
  console.log("🧪 Testing Cache System\n");

  const cache = new MockCacheService();

  // Test 1: Basic Set/Get
  console.log("📝 Test 1: Basic Set/Get Operations");
  cache.set('test_key', 'test_value');
  const result = cache.get('test_key');
  console.log(`✅ Set/Get: ${result === 'test_value' ? 'PASS' : 'FAIL'}`);
  console.log(`   Expected: test_value, Got: ${result}\n`);

  // Test 2: Cache Expiration
  console.log("📝 Test 2: Cache Expiration");
  cache.set('expire_key', 'expire_value', 100); // 100ms TTL
  await new Promise(resolve => setTimeout(resolve, 150)); // Wait for expiration
  const expiredResult = cache.get('expire_key');
  console.log(`✅ Expiration: ${expiredResult === null ? 'PASS' : 'FAIL'}`);
  console.log(`   Expected: null, Got: ${expiredResult}\n`);

  // Test 3: Cache Size Limit
  console.log("📝 Test 3: Cache Size Limit");
  for (let i = 0; i < 12; i++) {
    cache.set(`key_${i}`, `value_${i}`);
  }
  const stats = cache.getStats();
  console.log(`✅ Size Limit: ${stats.size <= stats.maxSize ? 'PASS' : 'FAIL'}`);
  console.log(`   Cache Size: ${stats.size}, Max Size: ${stats.maxSize}\n`);

  // Test 4: Voice Interaction Filtering
  console.log("📝 Test 4: Voice Interaction Filtering");
  
  const testCases = [
    {
      input: { text: "uhh what is javascript you know" },
      expected: "what is javascript"
    },
    {
      input: { text: "umm like how do I write code" },
      expected: "how do I write code"
    },
    {
      input: { text: "hello world" },
      expected: "hello world"
    },
    {
      input: { text: "uhh umm" },
      expected: null
    }
  ];

  testCases.forEach((testCase, index) => {
    const result = filterVoiceInteraction(testCase.input);
    const expected = testCase.expected;
    const actual = result ? result.text : null;
    const passed = actual === expected;
    
    console.log(`   Test ${index + 1}: ${passed ? 'PASS' : 'FAIL'}`);
    console.log(`   Input: "${testCase.input.text}"`);
    console.log(`   Expected: "${expected}", Got: "${actual}"`);
  });
  console.log();

  // Test 5: Cache Performance
  console.log("📝 Test 5: Cache Performance");
  const startTime = Date.now();
  
  // Simulate multiple cache operations
  for (let i = 0; i < 1000; i++) {
    cache.set(`perf_key_${i}`, `perf_value_${i}`);
    cache.get(`perf_key_${i}`);
  }
  
  const endTime = Date.now();
  const duration = endTime - startTime;
  console.log(`✅ Performance: ${duration < 1000 ? 'PASS' : 'FAIL'}`);
  console.log(`   Duration: ${duration}ms for 1000 operations\n`);

  // Test 6: Cache Cleanup
  console.log("📝 Test 6: Cache Cleanup");
  cache.set('cleanup_key', 'cleanup_value', 50); // Short TTL
  await new Promise(resolve => setTimeout(resolve, 100));
  cache.cleanup();
  const cleanupResult = cache.get('cleanup_key');
  console.log(`✅ Cleanup: ${cleanupResult === null ? 'PASS' : 'FAIL'}`);
  console.log(`   Expected: null, Got: ${cleanupResult}\n`);

  console.log("✅ Cache testing completed!");
  console.log(`📊 Final Cache Stats: ${JSON.stringify(cache.getStats())}`);
}

// Run the tests
testCacheSystem().catch(console.error);
