
// Import the educational content and casual responses
import { educationalContent, casualResponses, commonQuestions } from './voiceData';

export const findAnswer = (query: string) => {
  query = query.toLowerCase();
  
  // Check for name introductions
  if (query.includes("my name is") || query.includes("i am") || query.includes("i'm")) {
    const nameMatch = query.match(/my name is (\w+)/i) || 
                     query.match(/i am (\w+)/i) || 
                     query.match(/i'm (\w+)/i);
    
    if (nameMatch && nameMatch[1]) {
      const name = nameMatch[1].charAt(0).toUpperCase() + nameMatch[1].slice(1);
      return `Hi ${name}! It's nice to meet you. How can I help you with your coding journey today?`;
    }
  }
  
  // Check for greetings
  for (const greeting in casualResponses.greetings) {
    if (query.includes(greeting)) {
      return casualResponses.greetings[greeting as keyof typeof casualResponses.greetings];
    }
  }
  
  // Check for joke requests
  if (query.includes("joke") || query.includes("funny")) {
    const jokes = casualResponses.jokes;
    return jokes[Math.floor(Math.random() * jokes.length)];
  }
  
  // Check for motivation requests
  if (query.includes("motivate") || query.includes("inspiration") || query.includes("quote")) {
    const quotes = casualResponses.motivation;
    return quotes[Math.floor(Math.random() * quotes.length)];
  }
  
  // Check for tips
  if (query.includes("tip") || query.includes("advice") || query.includes("improve")) {
    const tips = casualResponses.tips;
    return tips[Math.floor(Math.random() * tips.length)];
  }
  
  // Search educational content
  for (const topic in educationalContent) {
    if (query.includes(topic)) {
      for (const subtopic in educationalContent[topic as keyof typeof educationalContent]) {
        if (query.includes(subtopic)) {
          return educationalContent[topic as keyof typeof educationalContent][subtopic as any];
        }
      }
    }
  }
  
  // Match common questions
  const matchedQuestion = commonQuestions.find(item => 
    query.includes(item.question.toLowerCase()) || 
    (query.includes(item.topic) && query.includes(item.subtopic))
  );

  if (matchedQuestion) {
    const { topic, subtopic } = matchedQuestion;
    return educationalContent[topic as keyof typeof educationalContent][subtopic as any];
  }
  
  // Fallback responses
  if (query.includes("variable") && query.includes("python")) {
    return educationalContent.python.variable;
  }
  
  if (query.includes("function") && query.includes("javascript")) {
    return educationalContent.javascript.function;
  }
  
  if (query.includes("button") && query.includes("html")) {
    return educationalContent.html.button;
  }
  
  if (query.includes("how") && 
      (query.includes("code") || query.includes("program") || query.includes("learn"))) {
    return "To get better at coding, practice regularly by building small projects. Start with simple concepts and gradually move to more complex ones. Online resources like tutorials, documentation, and forums can be very helpful in your learning journey.";
  }
  
  return "I'm not sure I understood that question. Could you rephrase it or ask about a specific programming topic like Python variables, JavaScript functions, or HTML elements?";
};
