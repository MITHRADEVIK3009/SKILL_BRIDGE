
import React from "react";
import { Github, Twitter, Linkedin } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-background border-t py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold gradient-text mb-4">SkillBridge</h3>
            <p className="text-sm text-muted-foreground">
              Empowering developers to master coding skills through interactive
              learning, voice assistance, and daily challenges.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-md font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Home</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Courses</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Dashboard</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Leaderboard</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-md font-semibold mb-4">Learning Paths</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">HTML & CSS</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">JavaScript</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Python</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Java</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-6 text-sm text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} SkillBridge. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
