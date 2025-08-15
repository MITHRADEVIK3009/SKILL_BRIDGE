
// Simple RAG (Retrieval-Augmented Generation) Service
// This is a lightweight implementation for demonstration purposes

interface Document {
  id: string;
  content: string;
  title: string;
  category: string;
  tags: string[];
}

interface SearchResult {
  document: Document;
  score: number;
  relevantText: string;
}

// Enhanced knowledge base with 15 programming concepts for showcase
const KNOWLEDGE_BASE: Document[] = [
  {
    id: '1',
    title: 'JavaScript Basics',
    content: 'JavaScript is a programming language that adds interactivity to websites. It runs in the browser and can manipulate HTML and CSS. Key concepts include variables, functions, objects, and event handling. Example: const greeting = "Hello World"; console.log(greeting);',
    category: 'programming',
    tags: ['javascript', 'basics', 'web', 'frontend', 'js']
  },
  {
    id: '2',
    title: 'Python Fundamentals',
    content: 'Python is a high-level programming language known for its simplicity and readability. It\'s great for beginners and widely used in data science, web development, and automation. Example: print("Hello, World!") or name = input("What\'s your name?")',
    category: 'programming',
    tags: ['python', 'basics', 'data-science', 'automation', 'py']
  },
  {
    id: '3',
    title: 'HTML Structure',
    content: 'HTML (HyperText Markup Language) is the standard markup language for creating web pages. It uses tags to structure content and create the foundation of web pages. Example: <h1>Title</h1>, <p>Paragraph</p>, <div>Container</div>',
    category: 'web-development',
    tags: ['html', 'markup', 'structure', 'web', 'hypertext']
  },
  {
    id: '4',
    title: 'CSS Styling',
    content: 'CSS (Cascading Style Sheets) is used to style and layout web pages. It controls colors, fonts, spacing, and responsive design. Example: .button { background-color: blue; padding: 10px; border-radius: 5px; }',
    category: 'web-development',
    tags: ['css', 'styling', 'design', 'layout', 'cascading']
  },
  {
    id: '5',
    title: 'React Components',
    content: 'React is a JavaScript library for building user interfaces. Components are reusable UI pieces that can be composed together to create complex applications. Example: function Welcome(props) { return <h1>Hello, {props.name}</h1>; }',
    category: 'frontend',
    tags: ['react', 'components', 'ui', 'javascript', 'jsx']
  },
  {
    id: '6',
    title: 'Node.js Backend',
    content: 'Node.js is a JavaScript runtime that allows you to run JavaScript on the server side. It\'s perfect for building scalable network applications. Example: const http = require("http"); const server = http.createServer((req, res) => { res.end("Hello World"); });',
    category: 'backend',
    tags: ['nodejs', 'backend', 'server', 'javascript', 'runtime']
  },
  {
    id: '7',
    title: 'SQL Database Queries',
    content: 'SQL (Structured Query Language) is used to manage and manipulate relational databases. It allows you to create, read, update, and delete data. Example: SELECT * FROM users WHERE age > 18; INSERT INTO users (name, email) VALUES ("John", "john@email.com");',
    category: 'database',
    tags: ['sql', 'database', 'queries', 'relational', 'mysql']
  },
  {
    id: '8',
    title: 'Git Version Control',
    content: 'Git is a distributed version control system that tracks changes in source code. It enables collaboration and maintains a history of all changes. Example: git add . git commit -m "Add new feature" git push origin main',
    category: 'tools',
    tags: ['git', 'version-control', 'collaboration', 'development', 'vcs']
  },
  {
    id: '9',
    title: 'TypeScript Fundamentals',
    content: 'TypeScript is a superset of JavaScript that adds static typing to the language. It helps catch errors at compile time and improves code maintainability. Example: interface User { name: string; age: number; } const user: User = { name: "John", age: 25 };',
    category: 'programming',
    tags: ['typescript', 'typing', 'javascript', 'superset', 'ts']
  },
  {
    id: '10',
    title: 'REST API Design',
    content: 'REST APIs use HTTP methods (GET, POST, PUT, DELETE) to perform operations on resources. They follow stateless architecture and use JSON for data exchange. Example: GET /api/users, POST /api/users, PUT /api/users/1, DELETE /api/users/1',
    category: 'backend',
    tags: ['rest', 'api', 'http', 'json', 'endpoints']
  },
  {
    id: '11',
    title: 'Responsive Web Design',
    content: 'Responsive design ensures websites work well on all devices and screen sizes. It uses CSS media queries and flexible layouts. Example: @media (max-width: 768px) { .container { width: 100%; padding: 10px; } }',
    category: 'web-development',
    tags: ['responsive', 'design', 'mobile', 'css', 'media-queries']
  },
  {
    id: '12',
    title: 'Async JavaScript',
    content: 'Asynchronous JavaScript allows code to run in the background without blocking other operations. It uses callbacks, promises, and async/await. Example: async function fetchData() { const response = await fetch("/api/data"); return response.json(); }',
    category: 'programming',
    tags: ['async', 'javascript', 'promises', 'await', 'callbacks']
  },
  {
    id: '13',
    title: 'MongoDB NoSQL',
    content: 'MongoDB is a NoSQL database that stores data in flexible, JSON-like documents. It\'s great for applications with changing data structures. Example: db.users.insertOne({ name: "John", email: "john@email.com", age: 25 })',
    category: 'database',
    tags: ['mongodb', 'nosql', 'document', 'database', 'bson']
  },
  {
    id: '14',
    title: 'Docker Containers',
    content: 'Docker allows you to package applications with their dependencies into containers. It ensures consistency across different environments. Example: FROM node:16 WORKDIR /app COPY package*.json ./ RUN npm install COPY . . EXPOSE 3000 CMD ["npm", "start"]',
    category: 'devops',
    tags: ['docker', 'containers', 'deployment', 'devops', 'virtualization']
  },
  {
    id: '15',
    title: 'Testing with Jest',
    content: 'Jest is a JavaScript testing framework that makes it easy to write and run tests. It provides mocking, assertions, and code coverage. Example: test("adds 1 + 2 to equal 3", () => { expect(sum(1, 2)).toBe(3); });',
    category: 'testing',
    tags: ['jest', 'testing', 'javascript', 'unit-tests', 'mocking']
  }
];

// Simple text similarity function using keyword matching
function calculateSimilarity(query: string, document: Document): number {
  const queryWords = query.toLowerCase().split(/\s+/);
  const documentText = `${document.title} ${document.content} ${document.tags.join(' ')}`.toLowerCase();
  
  let score = 0;
  queryWords.forEach(word => {
    if (documentText.includes(word)) {
      score += 1;
    }
  });
  
  // Bonus for title matches
  if (document.title.toLowerCase().includes(query.toLowerCase())) {
    score += 2;
  }
  
  // Bonus for tag matches
  document.tags.forEach(tag => {
    if (query.toLowerCase().includes(tag)) {
      score += 1.5;
    }
  });
  
  return score;
}

// Extract relevant text snippet from document
function extractRelevantText(query: string, document: Document): string {
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

// Main RAG function
export async function ragQuery(query: string, maxResults: number = 3): Promise<SearchResult[]> {
  try {
    // Simulate async processing
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Calculate similarity scores for all documents
    const results: SearchResult[] = KNOWLEDGE_BASE.map(document => ({
      document,
      score: calculateSimilarity(query, document),
      relevantText: extractRelevantText(query, document)
    }));
    
    // Sort by score and return top results
    return results
      .filter(result => result.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults);
      
  } catch (error) {
    console.error('RAG query error:', error);
    return [];
  }
}

// Generate response based on search results
export function generateResponse(query: string, searchResults: SearchResult[]): string {
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

// Test function for RAG accuracy
export async function testRAGAccuracy(): Promise<{ testCase: string; result: string; accuracy: string }[]> {
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
  
  const results = [];
  
  for (const testCase of testCases) {
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
    
    results.push({
      testCase: testCase.description,
      result: response.substring(0, 100) + "...",
      accuracy
    });
  }
  
  return results;
}
