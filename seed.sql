-- Seed data for SkillBridge application

-- Insert sample courses
INSERT INTO courses (title, description, difficulty, thumbnail_url, category, duration_hours, prerequisites, learning_objectives) VALUES
('Python Fundamentals', 'Learn the basics of Python programming language', 'beginner', 'https://images.unsplash.com/photo-1526379879527-8559ecfcaec0?w=500', 'Programming', 20, ARRAY[]::text[], ARRAY['Variables and data types', 'Control structures', 'Functions', 'File handling']),
('JavaScript Essentials', 'Master the fundamentals of JavaScript for web development', 'beginner', 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=500', 'Web Development', 25, ARRAY[]::text[], ARRAY['DOM manipulation', 'Event handling', 'Async programming', 'ES6 features']),
('React Development', 'Build modern web applications with React', 'intermediate', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500', 'Web Development', 35, ARRAY['JavaScript Essentials'], ARRAY['Component architecture', 'State management', 'Hooks', 'Routing']),
('Data Structures & Algorithms', 'Master fundamental computer science concepts', 'intermediate', 'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=500', 'Computer Science', 40, ARRAY['Python Fundamentals'], ARRAY['Arrays and strings', 'Linked lists', 'Trees and graphs', 'Sorting algorithms']),
('Machine Learning Basics', 'Introduction to machine learning concepts and implementation', 'advanced', 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=500', 'AI/ML', 50, ARRAY['Python Fundamentals', 'Data Structures & Algorithms'], ARRAY['Supervised learning', 'Neural networks', 'Model evaluation', 'Feature engineering']),
('HTML & CSS Foundations', 'Learn the building blocks of web development', 'beginner', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500', 'Web Development', 15, ARRAY[]::text[], ARRAY['Semantic HTML', 'CSS layouts', 'Responsive design', 'Accessibility']),
('Database Design', 'Design and implement efficient database systems', 'intermediate', 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=500', 'Backend', 30, ARRAY[]::text[], ARRAY['Relational databases', 'SQL queries', 'Normalization', 'Indexing']),
('API Development with Node.js', 'Build RESTful APIs using Node.js and Express', 'intermediate', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500', 'Backend', 32, ARRAY['JavaScript Essentials'], ARRAY['Express framework', 'Authentication', 'Database integration', 'Testing']),
('Mobile App Development', 'Create cross-platform mobile applications', 'advanced', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500', 'Mobile', 45, ARRAY['React Development'], ARRAY['React Native', 'Native modules', 'Push notifications', 'App store deployment']),
('DevOps Fundamentals', 'Learn modern deployment and infrastructure management', 'intermediate', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500', 'DevOps', 28, ARRAY[]::text[], ARRAY['CI/CD pipelines', 'Docker containerization', 'Cloud platforms', 'Monitoring']);

-- Insert sample lessons for Python Fundamentals course
INSERT INTO lessons (course_id, title, content, video_url, order_index, duration_minutes, resources, quiz_questions) VALUES
(1, 'Getting Started with Python', 'Introduction to Python programming language, installation, and basic syntax.', 'https://www.youtube.com/watch?v=_uQrJ0TkZlc', 1, 30, '{"slides": "python-intro.pdf", "code": "hello_world.py"}', '[{"question": "What is Python?", "options": ["A programming language", "A snake", "A web framework", "A database"], "correct": 0}]'),
(1, 'Variables and Data Types', 'Learn about different data types in Python and how to work with variables.', 'https://www.youtube.com/watch?v=_uQrJ0TkZlc', 2, 45, '{"exercises": "variables_exercises.py", "reference": "data_types_guide.md"}', '[{"question": "Which is a valid Python variable name?", "options": ["2var", "var-name", "var_name", "var name"], "correct": 2}]'),
(1, 'Control Structures', 'Master if statements, loops, and conditional logic in Python.', 'https://www.youtube.com/watch?v=_uQrJ0TkZlc', 3, 50, '{"examples": "control_flow_examples.py", "challenges": "loop_challenges.py"}', '[{"question": "What does the range(5) function return?", "options": ["[1,2,3,4,5]", "[0,1,2,3,4]", "[1,2,3,4]", "[0,1,2,3,4,5]"], "correct": 1}]'),
(1, 'Functions and Modules', 'Create reusable code with functions and organize code into modules.', 'https://www.youtube.com/watch?v=_uQrJ0TkZlc', 4, 40, '{"tutorial": "functions_guide.md", "practice": "function_exercises.py"}', '[{"question": "How do you define a function in Python?", "options": ["function myFunc()", "def myFunc():", "func myFunc()", "define myFunc()"], "correct": 1}]');

-- Insert sample lessons for JavaScript Essentials course
INSERT INTO lessons (course_id, title, content, video_url, order_index, duration_minutes, resources, quiz_questions) VALUES
(2, 'JavaScript Fundamentals', 'Learn the basics of JavaScript syntax, variables, and data types.', 'https://www.youtube.com/watch?v=hdI2bqOjy3c', 1, 35, '{"tutorial": "js_basics.html", "examples": "basic_examples.js"}', '[{"question": "How do you declare a variable in JavaScript?", "options": ["var x;", "variable x;", "v x;", "declare x;"], "correct": 0}]'),
(2, 'DOM Manipulation', 'Learn how to interact with HTML elements using JavaScript.', 'https://www.youtube.com/watch?v=hdI2bqOjy3c', 2, 40, '{"demo": "dom_examples.html", "exercises": "dom_practice.js"}', '[{"question": "Which method is used to find an element by ID?", "options": ["findElementById()", "getElementById()", "getElement()", "findById()"], "correct": 1}]'),
(2, 'Event Handling', 'Master event-driven programming and user interactions.', 'https://www.youtube.com/watch?v=hdI2bqOjy3c', 3, 45, '{"interactive": "event_demo.html", "reference": "events_guide.md"}', '[{"question": "What is an event listener?", "options": ["A function that runs when an event occurs", "A HTML attribute", "A CSS property", "A JavaScript variable"], "correct": 0}]');

-- Insert sample challenges
INSERT INTO challenges (title, description, problem_statement, solution_template, test_cases, difficulty, points_reward, category, tags) VALUES
('Hello World', 'Write your first Python program', 'Create a program that prints "Hello, World!" to the console.', 'def hello_world():\n    # Your code here\n    pass', '[{"input": "", "expected_output": "Hello, World!"}]', 'easy', 10, 'Python Basics', ARRAY['beginner', 'print', 'basics']),
('Sum of Two Numbers', 'Calculate the sum of two integers', 'Write a function that takes two integers and returns their sum.', 'def add_numbers(a, b):\n    # Your code here\n    return 0', '[{"input": "[2, 3]", "expected_output": "5"}, {"input": "[-1, 1]", "expected_output": "0"}, {"input": "[100, 200]", "expected_output": "300"}]', 'easy', 15, 'Python Basics', ARRAY['functions', 'arithmetic', 'basics']),
('Palindrome Check', 'Check if a string is a palindrome', 'Write a function that determines if a given string is a palindrome (reads the same forwards and backwards).', 'def is_palindrome(s):\n    # Your code here\n    return False', '[{"input": "racecar", "expected_output": "true"}, {"input": "hello", "expected_output": "false"}, {"input": "A man a plan a canal Panama", "expected_output": "true"}]', 'medium', 25, 'String Manipulation', ARRAY['strings', 'algorithms', 'logic']),
('FizzBuzz', 'The classic FizzBuzz programming challenge', 'Write a program that prints numbers 1 to 100, but for multiples of 3 print "Fizz", for multiples of 5 print "Buzz", and for multiples of both print "FizzBuzz".', 'def fizz_buzz():\n    # Your code here\n    pass', '[{"input": "15", "expected_output": ["1", "2", "Fizz", "4", "Buzz", "Fizz", "7", "8", "Fizz", "Buzz", "11", "Fizz", "13", "14", "FizzBuzz"]}]', 'easy', 20, 'Logic', ARRAY['loops', 'conditionals', 'classic']),
('Binary Search', 'Implement the binary search algorithm', 'Write a function that performs binary search on a sorted array and returns the index of the target element, or -1 if not found.', 'def binary_search(arr, target):\n    # Your code here\n    return -1', '[{"input": "[[1, 2, 3, 4, 5], 3]", "expected_output": "2"}, {"input": "[[1, 3, 5, 7, 9], 6]", "expected_output": "-1"}]', 'medium', 30, 'Algorithms', ARRAY['search', 'algorithms', 'arrays']),
('Fibonacci Sequence', 'Generate the Fibonacci sequence', 'Write a function that returns the nth number in the Fibonacci sequence.', 'def fibonacci(n):\n    # Your code here\n    return 0', '[{"input": "0", "expected_output": "0"}, {"input": "1", "expected_output": "1"}, {"input": "10", "expected_output": "55"}]', 'medium', 25, 'Algorithms', ARRAY['recursion', 'mathematics', 'sequences']),
('Two Sum Problem', 'Find two numbers that add up to a target', 'Given an array of integers and a target sum, return the indices of two numbers that add up to the target.', 'def two_sum(nums, target):\n    # Your code here\n    return []', '[{"input": "[[2, 7, 11, 15], 9]", "expected_output": "[0, 1]"}, {"input": "[[3, 2, 4], 6]", "expected_output": "[1, 2]"}]', 'medium', 35, 'Arrays', ARRAY['arrays', 'algorithms', 'hashmap']),
('Valid Parentheses', 'Check if parentheses are balanced', 'Given a string containing just the characters "(", ")", "{", "}", "[" and "]", determine if the input string is valid.', 'def is_valid_parentheses(s):\n    # Your code here\n    return False', '[{"input": "()", "expected_output": "true"}, {"input": "()[]{}", "expected_output": "true"}, {"input": "(]", "expected_output": "false"}]', 'easy', 20, 'String Manipulation', ARRAY['strings', 'stack', 'validation']),
('Merge Sorted Arrays', 'Merge two sorted arrays into one', 'Given two sorted arrays, merge them into a single sorted array.', 'def merge_arrays(arr1, arr2):\n    # Your code here\n    return []', '[{"input": "[[1, 3, 5], [2, 4, 6]]", "expected_output": "[1, 2, 3, 4, 5, 6]"}, {"input": "[[1, 2, 3], [4, 5, 6]]", "expected_output": "[1, 2, 3, 4, 5, 6]"}]', 'medium', 30, 'Arrays', ARRAY['arrays', 'sorting', 'merging']),
('Reverse Linked List', 'Reverse a singly linked list', 'Given the head of a singly linked list, reverse the list and return the new head.', 'class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\ndef reverse_list(head):\n    # Your code here\n    return None', '[{"input": "[1,2,3,4,5]", "expected_output": "[5,4,3,2,1]"}, {"input": "[1,2]", "expected_output": "[2,1]"}]', 'medium', 35, 'Data Structures', ARRAY['linked-list', 'pointers', 'algorithms']);

-- Insert badges
INSERT INTO badges (name, description, icon_url, criteria, rarity, points_value) VALUES
('First Steps', 'Complete your first lesson', 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=100', '{"type": "lessons_completed", "count": 1}', 'common', 5),
('Early Bird', 'Complete a lesson before 9 AM', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100', '{"type": "early_completion", "time": "09:00"}', 'common', 5),
('Consistent Learner', 'Maintain a 7-day learning streak', 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=100', '{"type": "streak", "days": 7}', 'rare', 15),
('Problem Solver', 'Complete 10 coding challenges', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100', '{"type": "challenges_completed", "count": 10}', 'rare', 20),
('Speed Demon', 'Complete a challenge in under 5 minutes', 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=100', '{"type": "fast_completion", "time_limit": 300}', 'epic', 25),
('Course Master', 'Complete an entire course', 'https://images.unsplash.com/photo-1523050854058-8df90110c9d1?w=100', '{"type": "course_completed", "count": 1}', 'rare', 30),
('Knowledge Seeker', 'Complete 5 different courses', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', '{"type": "courses_completed", "count": 5}', 'epic', 50),
('Night Owl', 'Complete a lesson after 10 PM', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100', '{"type": "late_completion", "time": "22:00"}', 'common', 5),
('Perfectionist', 'Score 100% on 5 quizzes', 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=100', '{"type": "perfect_scores", "count": 5}', 'epic', 35),
('Dedication', 'Maintain a 30-day learning streak', 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=100', '{"type": "streak", "days": 30}', 'legendary', 100),
('Code Warrior', 'Complete 50 coding challenges', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100', '{"type": "challenges_completed", "count": 50}', 'legendary', 75),
('Voice Master', 'Use voice commands 100 times', 'https://images.unsplash.com/photo-1589149098258-3e9102cd63d3?w=100', '{"type": "voice_commands", "count": 100}', 'rare', 25),
('Study Master', 'Study for 100 hours total', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=100', '{"type": "study_hours", "hours": 100}', 'epic', 40),
('Social Learner', 'Share 10 achievements', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100', '{"type": "achievements_shared", "count": 10}', 'rare', 20),
('Multilingual', 'Complete lessons in 3 different languages', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=100', '{"type": "languages_used", "count": 3}', 'epic', 30);

-- Insert learning paths
INSERT INTO learning_paths (title, description, difficulty, estimated_hours, thumbnail_url) VALUES
('Frontend Developer Path', 'Master the skills needed to become a frontend web developer', 'beginner', 80, 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=500'),
('Backend Developer Path', 'Learn server-side programming and database management', 'intermediate', 95, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500'),
('Full Stack Developer Path', 'Become proficient in both frontend and backend development', 'intermediate', 120, 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500'),
('Data Science Path', 'Learn data analysis, machine learning, and statistical modeling', 'advanced', 110, 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=500'),
('Mobile Developer Path', 'Build cross-platform mobile applications', 'intermediate', 75, 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500');

-- Insert course paths relationships
INSERT INTO course_paths (path_id, course_id, order_in_path) VALUES
-- Frontend Developer Path
(1, 6, 1), -- HTML & CSS Foundations
(1, 2, 2), -- JavaScript Essentials
(1, 3, 3), -- React Development
-- Backend Developer Path
(2, 1, 1), -- Python Fundamentals
(2, 7, 2), -- Database Design
(2, 8, 3), -- API Development with Node.js
(2, 10, 4), -- DevOps Fundamentals
-- Full Stack Developer Path
(3, 6, 1), -- HTML & CSS Foundations
(3, 2, 2), -- JavaScript Essentials
(3, 3, 3), -- React Development
(3, 1, 4), -- Python Fundamentals
(3, 7, 5), -- Database Design
(3, 8, 6), -- API Development with Node.js
-- Data Science Path
(4, 1, 1), -- Python Fundamentals
(4, 4, 2), -- Data Structures & Algorithms
(4, 5, 3), -- Machine Learning Basics
-- Mobile Developer Path
(5, 2, 1), -- JavaScript Essentials
(5, 3, 2), -- React Development
(5, 9, 3); -- Mobile App Development

-- Insert study materials
INSERT INTO study_materials (title, description, file_url, file_type, category, topic, difficulty, size_mb) VALUES
('Python Cheat Sheet', 'Quick reference guide for Python syntax and common functions', 'https://github.com/ehmatthes/pcc/releases/download/v1.0.0/beginners_python_cheat_sheet_pcc.pdf', 'pdf', 'Reference', 'Python', 'beginner', 0.5),
('JavaScript ES6 Guide', 'Comprehensive guide to modern JavaScript features', 'https://example.com/js-es6-guide.pdf', 'pdf', 'Tutorial', 'JavaScript', 'intermediate', 2.1),
('React Component Patterns', 'Best practices for building React components', 'https://example.com/react-patterns.pdf', 'pdf', 'Tutorial', 'React', 'intermediate', 1.8),
('Algorithm Visualization Tool', 'Interactive tool for understanding sorting algorithms', 'https://algorithm-visualizer.org/', 'web', 'Tool', 'Algorithms', 'beginner', 0.0),
('SQL Practice Database', 'Sample database for practicing SQL queries', 'https://example.com/sample-database.sql', 'sql', 'Dataset', 'Database', 'beginner', 5.2),
('Git Commands Reference', 'Complete list of Git commands with examples', 'https://example.com/git-reference.pdf', 'pdf', 'Reference', 'Version Control', 'beginner', 1.0),
('CSS Grid Layout Guide', 'Master CSS Grid with practical examples', 'https://example.com/css-grid-guide.pdf', 'pdf', 'Tutorial', 'CSS', 'intermediate', 3.5),
('Node.js Best Practices', 'Security and performance best practices for Node.js', 'https://example.com/nodejs-best-practices.pdf', 'pdf', 'Guide', 'Node.js', 'advanced', 4.2),
('Machine Learning Datasets', 'Collection of datasets for ML practice', 'https://example.com/ml-datasets.zip', 'zip', 'Dataset', 'Machine Learning', 'intermediate', 25.0),
('Mobile UI Design Patterns', 'Common design patterns for mobile applications', 'https://example.com/mobile-ui-patterns.pdf', 'pdf', 'Design', 'Mobile Development', 'intermediate', 6.8),
('DevOps Toolchain Guide', 'Overview of popular DevOps tools and their usage', 'https://example.com/devops-tools.pdf', 'pdf', 'Guide', 'DevOps', 'intermediate', 2.9),
('Python Data Science Libraries', 'Introduction to NumPy, Pandas, and Matplotlib', 'https://example.com/python-ds-libraries.pdf', 'pdf', 'Tutorial', 'Data Science', 'intermediate', 7.3),
('RESTful API Design Guide', 'Best practices for designing REST APIs', 'https://example.com/api-design-guide.pdf', 'pdf', 'Guide', 'API Development', 'intermediate', 3.1),
('Responsive Web Design Examples', 'Collection of responsive design patterns', 'https://example.com/responsive-examples.zip', 'zip', 'Examples', 'Web Development', 'beginner', 15.6),
('Testing Frameworks Comparison', 'Comparison of popular testing frameworks', 'https://example.com/testing-frameworks.pdf', 'pdf', 'Guide', 'Testing', 'intermediate', 2.7);

-- Create materialized view for leaderboard (refresh function will be called periodically)
CREATE OR REPLACE FUNCTION refresh_leaderboard()
RETURNS void AS $$
BEGIN
    DELETE FROM leaderboard;
    
    INSERT INTO leaderboard (user_id, rank, total_points, weekly_points, monthly_points, last_updated)
    SELECT 
        u.user_id,
        ROW_NUMBER() OVER (ORDER BY u.points DESC) as rank,
        u.points as total_points,
        COALESCE(weekly.points, 0) as weekly_points,
        COALESCE(monthly.points, 0) as monthly_points,
        NOW() as last_updated
    FROM users u
    LEFT JOIN (
        SELECT 
            user_id,
            SUM(points_earned) as points
        FROM user_challenges 
        WHERE completion_date >= NOW() - INTERVAL '7 days'
        GROUP BY user_id
    ) weekly ON u.user_id = weekly.user_id
    LEFT JOIN (
        SELECT 
            user_id,
            SUM(points_earned) as points
        FROM user_challenges 
        WHERE completion_date >= NOW() - INTERVAL '30 days'
        GROUP BY user_id
    ) monthly ON u.user_id = monthly.user_id
    WHERE u.points > 0
    ORDER BY u.points DESC;
END;
$$ LANGUAGE plpgsql;

-- Call the function to populate initial leaderboard
SELECT refresh_leaderboard();
