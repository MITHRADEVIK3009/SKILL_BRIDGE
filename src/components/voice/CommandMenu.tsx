
import React from 'react';
import {
  BookOpen,
  Clock,
  Download,
  Edit,
  Medal,
  BarChart3,
  TestTube,
  HelpCircle,
  Lightbulb
} from 'lucide-react';

interface CommandOption {
  id: string;
  label: string;
  icon: React.ElementType;
  description: string;
}

interface CommandMenuProps {
  onSelectCommand: (commandId: string) => void;
}

export const commandOptions: CommandOption[] = [
  {
    id: 'DOWNLOAD',
    label: 'Download Study Material',
    icon: Download,
    description: 'Download PDFs, slides and other learning resources'
  },
  {
    id: 'NOTES',
    label: 'Start Taking Notes',
    icon: Edit,
    description: 'Open the note-taking panel for this session'
  },
  {
    id: 'TIMER',
    label: 'Track Study Time',
    icon: Clock,
    description: 'Start tracking your study session time'
  },
  {
    id: 'PROGRESS',
    label: 'Show Progress & Analytics',
    icon: BarChart3,
    description: 'View your learning progress and statistics'
  },
  {
    id: 'LEADERBOARD',
    label: 'Leaderboard Status',
    icon: Medal,
    description: 'Check your ranking on the leaderboard'
  },
  {
    id: 'TEST',
    label: 'Create & Take a Custom Test',
    icon: TestTube,
    description: 'Generate a personalized quiz on any topic'
  },
  {
    id: 'SUGGEST',
    label: 'Suggest What to Learn Next',
    icon: Lightbulb,
    description: 'Get personalized learning recommendations'
  },
  {
    id: 'QUESTION',
    label: 'Ask a Question / Learn a Topic',
    icon: HelpCircle,
    description: 'Get help with any coding or learning question'
  }
];

const CommandMenu: React.FC<CommandMenuProps> = ({ onSelectCommand }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
      {commandOptions.map((command) => {
        const Icon = command.icon;
        return (
          <div 
            key={command.id} 
            className="bg-card border border-border rounded-lg p-4 hover:bg-accent/50 hover:border-primary/50 transition-all cursor-pointer flex flex-col items-center text-center"
            onClick={() => onSelectCommand(command.id)}
          >
            <div className="bg-accent rounded-full p-3 mb-3">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-semibold mb-1">{command.label}</h3>
            <p className="text-xs text-muted-foreground">{command.description}</p>
          </div>
        )}
      )}
    </div>
  );
};

export default CommandMenu;
