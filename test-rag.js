// Simple RAG Test Script
// Run with: node test-rag.js

// Mock the RAG service for testing
const KNOWLEDGE_BASE = [
  {
    id: '1',
    title: 'JavaScript Basics',
    content: 'JavaScript is a programming language that adds interactivity to websites. It runs in the browser and can manipulate HTML and CSS. Key concepts include variables, functions, objects, and event handling.',
    category: 'programming',
    tags: ['javascript', 'basics', 'web', 'frontend']
  },
  {
    id: '2',
    title: 'Python Fundamentals',
    content: 'Python is a high-level programming language known for its simplicity and readability. It\'s great for beginners and widely used in data science, web development, and automation.',
    category: 'programming',
    tags: ['python', 'basics', 'data-science', 'automation']
  },
  {
    id: '3',
    title: 'HTML Structure',
    content: 'HTML (HyperText Markup Language) is the standard markup language for creating web pages. It uses tags to structure content and create the foundation of web pages.',
    category: 'web-development',
    tags: ['html', 'markup', 'structure', 'web']
  }
];

function calculateSimilarity(query, document) {
  const queryWords = query.toLowerCase().split(/\s+/);
  const documentText = `${document.title} ${document.content} ${document.tags.join(' ')}`.toLowerCase();
  
  let score = 0;
  queryWords.forEach(word => {
    if (documentText.includes(word)) {
      score += 1;
    }
  });
  
  if (document.title.toLowerCase().includes(query.toLowerCase())) {
    score += 2;
  }
  
  document.tags.forEach(tag => {
    if (query.toLowerCase().includes(tag)) {
      score += 1.5;
    }
  });
  
  return score;
}

function extractRelevantText(query, document) {
  const queryWords = query.toLowerCase().split(/\s+/);
  const sentences = document.content.split(/[.!?]+/);
  
  let bestSentence = sentences[0];
  let bestScore = 0;
  
  sentences.forEach(sentence => {
    let score = 0;
    queryWords.forEach(word => {
      if (sentence.toLowerCase().includes(word)) {
        score += 1;
      }
    });
    if (score > bestScore) {
      bestScore = score;
      bestSentence = sentence;
    }
  });
  
  return bestSentence.trim();
}

async function ragQuery(query, maxResults = 3) {
  const results = KNOWLEDGE_BASE.map(document => ({
    document,
    score: calculateSimilarity(query, document),
    relevantText: extractRelevantText(query, document)
  }));
  
  return results
    .filter(result => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults);
}

function generateResponse(query, searchResults) {
  if (searchResults.length === 0) {
    return "I don't have specific information about that topic. Could you try rephrasing your question or ask about programming, web development, or coding concepts?";
  }
  
  const topResult = searchResults[0];
  
  if (topResult.score >= 3) {
    return `Based on your question about "${query}", here's what I found:\n\n${topResult.relevantText}\n\nThis information comes from our knowledge base about ${topResult.document.title}.`;
  } else if (topResult.score >= 1) {
    return `I found some related information about "${query}":\n\n${topResult.relevantText}\n\nThis might be helpful, but you may want to be more specific with your question.`;
  } else {
    return "I found some loosely related information, but it might not directly answer your question. Could you try being more specific?";
  }
}

async function testRAGAccuracy() {
  const testCases = [
    {
      query: "What is JavaScript?",
      expected: "javascript",
      description: "Simple known query"
    },
    {
      query: "How do I write code in JS?",
      expected: "javascript",
      description: "Paraphrased query"
    },
    {
      query: "What's the weather like?",
      expected: "none",
      description: "Out-of-scope query"
    }
  ];
  
  console.log("🧪 Testing RAG System Accuracy\n");
  
  for (const testCase of testCases) {
    console.log(`📝 Test Case: ${testCase.description}`);
    console.log(`❓ Query: "${testCase.query}"`);
    
    const searchResults = await ragQuery(testCase.query);
    const response = generateResponse(testCase.query, searchResults);
    
    let accuracy = "Low";
    if (testCase.expected === "none" && searchResults.length === 0) {
      accuracy = "High";
    } else if (searchResults.length > 0 && searchResults[0].document.tags.includes(testCase.expected)) {
      accuracy = "High";
    } else if (searchResults.length > 0) {
      accuracy = "Medium";
    }
    
    console.log(`📊 Accuracy: ${accuracy}`);
    console.log(`💬 Response: ${response.substring(0, 100)}...`);
    console.log(`🔍 Results found: ${searchResults.length}`);
    console.log("---\n");
  }
  
  console.log("✅ RAG testing completed!");
}

// Run the test
testRAGAccuracy().catch(console.error);
