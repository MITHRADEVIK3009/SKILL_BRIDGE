
import React, { useState, useEffect } from "react";

const quotes = [
  "The only way to learn to code is to write code every day.",
  "Coding is not about what you know; it's about what you can figure out.",
  "Every expert was once a beginner. Keep learning!",
  "Mistakes are proof that you are trying.",
  "Clean code always looks like it was written by someone who cares.",
  "Programming is not about typing, it's about thinking.",
  "The best error message is the one that never shows up."
];

const MotivationalQuote: React.FC = () => {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);
  }, []);

  return (
    <div className="mt-2 text-skillbridge-indigo italic">
      "{quote}"
    </div>
  );
};

export default MotivationalQuote;
