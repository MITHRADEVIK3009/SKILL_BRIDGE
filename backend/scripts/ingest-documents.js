const { MongoClient } = require('mongodb');
const { OpenAI } = require('openai');
require('dotenv').config();

// Sample learning content for SkillBridge
const learningDocuments = [
  {
    text: "JavaScript is a high-level, dynamic programming language that's widely used for web development. It's the language of the web, running in browsers to create interactive websites. Key features include: dynamic typing, first-class functions, prototype-based object orientation, and event-driven programming.",
    metadata: {
      title: "Introduction to JavaScript",
      source: "JavaScript Basics Course",
      type: "lesson",
      topic: "javascript",
      difficulty: "beginner"
    }
  },
  {
    text: "Python is a high-level, interpreted programming language known for its simplicity and readability. It's excellent for beginners and powerful for experts. Python supports multiple programming paradigms including procedural, object-oriented, and functional programming. Common uses include web development, data analysis, artificial intelligence, and automation.",
    metadata: {
      title: "Python Programming Fundamentals",
      source: "Python Course",
      type: "lesson", 
      topic: "python",
      difficulty: "beginner"
    }
  },
  {
    text: "Variables in programming are containers that store data values. In JavaScript, you can declare variables using var, let, or const keywords. 'let' and 'const' are block-scoped, while 'var' is function-scoped. Use 'const' for values that won't change, 'let' for variables that will change, and avoid 'var' in modern JavaScript.",
    metadata: {
      title: "JavaScript Variables and Scope",
      source: "JavaScript Basics Course",
      type: "lesson",
      topic: "javascript",
      difficulty: "beginner"
    }
  },
  {
    text: "Functions are reusable blocks of code that perform specific tasks. In Python, you define functions using the 'def' keyword followed by the function name and parameters. Functions help organize code, avoid repetition, and make programs more modular and maintainable.",
    metadata: {
      title: "Python Functions",
      source: "Python Course",
      type: "lesson",
      topic: "python", 
      difficulty: "beginner"
    }
  },
  {
    text: "Object-Oriented Programming (OOP) is a programming paradigm based on objects and classes. Key concepts include encapsulation (bundling data and methods), inheritance (creating new classes based on existing ones), polymorphism (objects taking multiple forms), and abstraction (hiding complex implementation details).",
    metadata: {
      title: "Object-Oriented Programming Concepts",
      source: "Advanced Programming Course",
      type: "lesson",
      topic: "programming-concepts",
      difficulty: "intermediate"
    }
  },
  {
    text: "Git is a distributed version control system that tracks changes in source code during software development. Key commands include: git init (initialize repository), git add (stage changes), git commit (save changes), git push (upload to remote), git pull (download from remote), git branch (manage branches).",
    metadata: {
      title: "Git Version Control Basics",
      source: "Developer Tools Course",
      type: "lesson",
      topic: "git",
      difficulty: "beginner"
    }
  },
  {
    text: "HTML (HyperText Markup Language) is the standard markup language for creating web pages. It describes the structure of web content using elements and tags. Key elements include headings (h1-h6), paragraphs (p), links (a), images (img), and containers (div, section, article).",
    metadata: {
      title: "HTML Fundamentals",
      source: "Web Development Course",
      type: "lesson",
      topic: "html",
      difficulty: "beginner"
    }
  },
  {
    text: "CSS (Cascading Style Sheets) is used to style and layout web pages. It controls the appearance of HTML elements including colors, fonts, spacing, and positioning. Key concepts include selectors, properties, values, the box model, flexbox, and grid layout systems.",
    metadata: {
      title: "CSS Styling Basics",
      source: "Web Development Course", 
      type: "lesson",
      topic: "css",
      difficulty: "beginner"
    }
  },
  {
    text: "React is a JavaScript library for building user interfaces, especially single-page applications. Key concepts include components (reusable UI pieces), JSX (JavaScript XML syntax), state (component data), props (data passed to components), and hooks (functions that let you use state in functional components).",
    metadata: {
      title: "React Components and State",
      source: "React Development Course",
      type: "lesson",
      topic: "react",
      difficulty: "intermediate"
    }
  },
  {
    text: "Debugging is the process of finding and fixing errors in code. Common debugging techniques include: using console.log() for output, browser developer tools, breakpoints, step-through debugging, error reading and interpretation, and systematic problem isolation.",
    metadata: {
      title: "Debugging Techniques",
      source: "Programming Best Practices",
      type: "lesson",
      topic: "debugging",
      difficulty: "intermediate"
    }
  }
];

async function ingestDocuments() {
  const mongoClient = new MongoClient(process.env.MONGODB_URI);
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    console.log('Connecting to MongoDB...');
    await mongoClient.connect();
    const db = mongoClient.db('skillbridge_rag');
    const collection = db.collection('documents');

    console.log('Generating embeddings and ingesting documents...');
    
    for (let i = 0; i < learningDocuments.length; i++) {
      const doc = learningDocuments[i];
      console.log(`Processing document ${i + 1}/${learningDocuments.length}: ${doc.metadata.title}`);
      
      try {
        // Generate embedding
        const response = await openai.embeddings.create({
          model: "text-embedding-3-small",
          input: doc.text,
        });
        
        const embedding = response.data[0].embedding;
        
        // Prepare document for insertion
        const documentToInsert = {
          text: doc.text,
          embedding: embedding,
          metadata: {
            ...doc.metadata,
            createdAt: new Date(),
            vectorDimension: embedding.length
          }
        };
        
        // Insert into MongoDB
        await collection.insertOne(documentToInsert);
        console.log(`✅ Inserted: ${doc.metadata.title}`);
        
        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.error(`❌ Error processing ${doc.metadata.title}:`, error.message);
      }
    }
    
    console.log('\n🎉 Document ingestion completed!');
    
    // Show collection stats
    const count = await collection.countDocuments();
    console.log(`Total documents in collection: ${count}`);
    
    // Show sample document structure
    const sampleDoc = await collection.findOne({}, { projection: { embedding: 0 } });
    console.log('\nSample document structure:');
    console.log(JSON.stringify(sampleDoc, null, 2));

  } catch (error) {
    console.error('Error during ingestion:', error);
  } finally {
    await mongoClient.close();
    console.log('MongoDB connection closed.');
  }
}

// Run the ingestion
ingestDocuments().catch(console.error);
