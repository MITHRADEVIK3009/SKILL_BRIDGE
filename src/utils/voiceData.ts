export const educationalContent = {
  "python": {
    "function": "In Python, you define a function using the 'def' keyword followed by the function name and parentheses. For example:\n\ndef greet(name):\n    return f\"Hello, {name}!\"\n\nYou can call this function by using: greet(\"John\")",
    "loop": "Python has several types of loops. The most common are 'for' and 'while' loops. For example:\n\nfor i in range(5):\n    print(i)\n\nThis will print numbers 0 through 4.",
    "list": "Lists in Python are collections of items. You create them using square brackets. For example:\n\nmy_list = [1, 2, 3, 4]\n\nYou can access items using my_list[index].",
    "variable": "A variable in Python is a container for storing data values, like numbers, strings, or lists. You don't need to declare variable types explicitly. For example:\n\nx = 10\nname = \"John\"\nmy_list = [1, 2, 3]\n\nPython uses dynamic typing, so the type is determined at runtime."
  },
  "javascript": {
    "function": "In JavaScript, you define a function using the 'function' keyword or arrow notation. For example:\n\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\n\nOr using arrow functions:\n\nconst greet = (name) => `Hello, ${name}!`;",
    "loop": "JavaScript has several types of loops including 'for', 'while', and 'forEach'. For example:\n\nfor (let i = 0; i < 5; i++) {\n  console.log(i);\n}\n\nThis will log numbers 0 through 4.",
    "array": "Arrays in JavaScript are collections of items. You create them using square brackets. For example:\n\nconst myArray = [1, 2, 3, 4];\n\nYou can access items using myArray[index]."
  },
  "html": {
    "form": "In HTML, you create forms using the <form> element. For example:\n\n<form action=\"/submit\" method=\"post\">\n  <input type=\"text\" name=\"username\">\n  <input type=\"submit\" value=\"Submit\">\n</form>",
    "table": "HTML tables are created using <table>, <tr>, <th>, and <td> tags. For example:\n\n<table>\n  <tr>\n    <th>Name</th>\n    <th>Age</th>\n  </tr>\n  <tr>\n    <td>John</td>\n    <td>25</td>\n  </tr>\n</table>",
    "list": "HTML supports ordered lists (<ol>) and unordered lists (<ul>). For example:\n\n<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n</ul>",
    "button": "You can make a button in HTML using the <button> tag or an <input type=\"button\"> element. For example:\n\n<button type=\"button\">Click Me</button>\n\nor\n\n<input type=\"button\" value=\"Click Me\">"
  },
  "java": {
    "class": "A class in Java is a blueprint for creating objects. It defines variables and methods inside it. For example:\n\npublic class Person {\n  private String name;\n  \n  public Person(String name) {\n    this.name = name;\n  }\n  \n  public void sayHello() {\n    System.out.println(\"Hello, my name is \" + name);\n  }\n}"
  },
  "php": {
    "mysql": "In PHP, you can connect to a MySQL database using mysqli_connect() or PDO (PHP Data Objects). For example:\n\n// Using mysqli\n$conn = mysqli_connect(\"localhost\", \"username\", \"password\", \"database\");\n\n// Using PDO\n$pdo = new PDO(\"mysql:host=localhost;dbname=database\", \"username\", \"password\");"
  },
  "node": {
    "intro": "Node.js is a JavaScript runtime environment that allows you to run JavaScript code on the server side. It uses an event-driven, non-blocking I/O model, making it efficient and suitable for building scalable network applications."
  }
};

export const commonQuestions = [
  { 
    question: "What is a variable in Python?", 
    topic: "python", 
    subtopic: "variable" 
  },
  { 
    question: "How do you create a function in JavaScript?", 
    topic: "javascript", 
    subtopic: "function" 
  },
  { 
    question: "How do I make a button in HTML?", 
    topic: "html", 
    subtopic: "button" 
  },
  { 
    question: "What is a class in Java?", 
    topic: "java", 
    subtopic: "class" 
  },
  { 
    question: "How do I connect to a MySQL database in PHP?", 
    topic: "php", 
    subtopic: "mysql" 
  },
  {
    question: "What is Node.js?",
    topic: "node",
    subtopic: "intro"
  }
];

export const casualResponses = {
  "greetings": {
    "hi": "Hi there! How can I help you with your coding journey today?",
    "hello": "Hello! Ready to learn something new today?",
    "hey": "Hey there! What would you like to learn about?",
    "good morning": "Good morning! Your daily dose of coding knowledge awaits.",
    "good afternoon": "Good afternoon! Ready for some productive learning?",
    "good evening": "Good evening! It's never too late to learn something new."
  },
  "introductions": {
    "my name is": "Nice to meet you! How can I help you with your coding journey?",
    "i am": "Great to know you! What coding topics are you interested in learning today?"
  },
  "jokes": [
    "Why do programmers prefer dark mode? Because light attracts bugs!",
    "Why did the developer go broke? Because they lost their cache!",
    "What's a programmer's favorite hangout spot? The Foo Bar!",
    "How many programmers does it take to change a light bulb? None, that's a hardware problem!",
    "Why do Java developers wear glasses? Because they don't C#!",
  ],
  "motivation": [
    "The best way to predict the future is to invent it. Keep coding!",
    "Every expert was once a beginner. Keep practicing!",
    "Code is like humor. When you have to explain it, it's bad!",
    "Programming isn't about what you know; it's about what you can figure out.",
    "The only way to learn a new programming language is by writing programs in it."
  ],
  "tips": [
    "Try to write code every day, even if it's just for 30 minutes.",
    "Build projects that solve your own problems - that's the best motivation.",
    "Read other people's code to learn new techniques and approaches.",
    "Don't be afraid to use debugging tools - they're your best friend.",
    "Practice algorithms and data structures regularly to build a strong foundation."
  ]
};
