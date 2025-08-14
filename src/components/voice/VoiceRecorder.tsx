
import React from 'react';
import { Mic, StopCircle } from 'lucide-react';

interface VoiceRecorderProps {
  isListening: boolean;
  onStartListening: () => void;
  onStopListening: () => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  isListening,
  onStartListening,
  onStopListening,
}) => {
  return (
    <div className="flex flex-col items-center mb-6">
      <div
        className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 transition-all duration-300 ${
          isListening ? "bg-red-500 animate-pulse shadow-lg scale-110" : "bg-primary"
        }`}
      >
        {isListening ? (
          <StopCircle
            className="h-10 w-10 text-white cursor-pointer"
            onClick={onStopListening}
          />
        ) : (
          <Mic
            className="h-10 w-10 text-white cursor-pointer"
            onClick={onStartListening}
          />
        )}
      </div>
      <h3 className="text-lg font-semibold">Ask SkillBridge Assistant</h3>
      <p className="text-sm text-muted-foreground text-center mt-1">
        {isListening ? "Listening... Speak now" : "Tap the microphone and ask a coding question"}
      </p>
    </div>
  );
};

export default VoiceRecorder;
