const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
let db;
const mongoClient = new MongoClient(process.env.MONGODB_URI);

// OpenAI setup (you can replace with your preferred LLM)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    await mongoClient.connect();
    db = mongoClient.db('skillbridge_rag');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}

// Generate embeddings for text
async function generateEmbedding(text) {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small", // or text-embedding-ada-002
      input: text,
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

// Vector similarity search using MongoDB Atlas Vector Search
async function vectorSearch(queryEmbedding, limit = 5) {
  try {
    const collection = db.collection('documents');
    
    const pipeline = [
      {
        $vectorSearch: {
          index: "vector_index", // You need to create this index in Atlas
          path: "embedding",
          queryVector: queryEmbedding,
          numCandidates: 100,
          limit: limit
        }
      },
      {
        $project: {
          _id: 0,
          text: 1,
          metadata: 1,
          score: { $meta: "vectorSearchScore" }
        }
      }
    ];

    const results = await collection.aggregate(pipeline).toArray();
    return results;
  } catch (error) {
    console.error('Vector search error:', error);
    throw error;
  }
}

// RAG endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, chatHistory = [] } = req.body;

    // Generate embedding for user query
    const queryEmbedding = await generateEmbedding(message);

    // Perform vector search
    const relevantDocs = await vectorSearch(queryEmbedding);

    // Prepare context from retrieved documents
    const context = relevantDocs
      .map(doc => `${doc.metadata.title}: ${doc.text}`)
      .join('\n\n');

    // Create prompt with context
    const systemPrompt = `You are Bridgy AI, a helpful learning assistant for SkillBridge platform. 
Use the following context to answer the user's question. If the context doesn't contain relevant information, 
use your general knowledge about programming and learning, but mention that you don't have specific information from the platform.

Context:
${context}

Previous conversation:
${chatHistory.slice(-6).map(msg => `${msg.isUser ? 'User' : 'Assistant'}: ${msg.text}`).join('\n')}`;

    // Get response from LLM
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const response = completion.choices[0].message.content;

    // Store conversation for future context (optional)
    await db.collection('conversations').insertOne({
      userId: req.body.userId || 'anonymous',
      message,
      response,
      timestamp: new Date(),
      relevantDocs: relevantDocs.map(doc => doc.metadata)
    });

    res.json({
      response,
      sources: relevantDocs.map(doc => ({
        title: doc.metadata.title,
        type: doc.metadata.type,
        score: doc.score
      }))
    });

  } catch (error) {
    console.error('Chat endpoint error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Document ingestion endpoint
app.post('/api/ingest', async (req, res) => {
  try {
    const { documents } = req.body; // Array of {text, metadata}

    const processedDocs = [];
    
    for (const doc of documents) {
      const embedding = await generateEmbedding(doc.text);
      
      processedDocs.push({
        text: doc.text,
        embedding: embedding,
        metadata: {
          title: doc.metadata.title,
          source: doc.metadata.source,
          type: doc.metadata.type || 'lesson',
          topic: doc.metadata.topic,
          difficulty: doc.metadata.difficulty || 'beginner',
          createdAt: new Date()
        }
      });
    }

    // Insert documents into MongoDB
    const result = await db.collection('documents').insertMany(processedDocs);
    
    res.json({
      message: 'Documents ingested successfully',
      insertedCount: result.insertedCount
    });

  } catch (error) {
    console.error('Document ingestion error:', error);
    res.status(500).json({ error: 'Failed to ingest documents' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Get conversation history
app.get('/api/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const history = await db.collection('conversations')
      .find({ userId })
      .sort({ timestamp: -1 })
      .limit(50)
      .toArray();
    
    res.json(history);
  } catch (error) {
    console.error('History fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// Start server
async function startServer() {
  await connectToMongoDB();
  
  app.listen(PORT, () => {
    console.log(`RAG Backend server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down server...');
  await mongoClient.close();
  process.exit(0);
});

startServer().catch(console.error);
