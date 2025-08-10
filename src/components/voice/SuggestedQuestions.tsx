
import React from 'react';

interface SuggestedQuestionsProps {
  questions: string[];
  onQuestionSelect: (question: string) => void;
}

const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({
  questions,
  onQuestionSelect,
}) => {
  if (questions.length === 0) return null;

  return (
    <div className="mb-4">
      <h4 className="font-medium mb-2 text-sm text-muted-foreground">Try asking:</h4>
      <div className="flex flex-wrap gap-2">
        {questions.map((question, index) => (
          <button
            key={index}
            onClick={() => onQuestionSelect(question)}
            className="bg-accent/50 hover:bg-accent text-sm px-3 py-1 rounded-full transition-colors"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SuggestedQuestions;
