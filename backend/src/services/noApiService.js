// Template-based quiz generation (no API required)
const questionDatabase = {
  javascript: {
    easy: [
      {
        text: "What is the correct way to declare a variable in JavaScript?",
        options: ["var myVar = 5;", "variable myVar = 5;", "v myVar = 5;", "declare myVar = 5;"],
        correctOptionIndex: 0,
        marks: 1,
        type: "single-choice",
        explanation: "The 'var' keyword is used to declare variables in JavaScript."
      },
      {
        text: "Which method is used to add an element to the end of an array?",
        options: ["push()", "pop()", "shift()", "unshift()"],
        correctOptionIndex: 0,
        marks: 1,
        type: "single-choice",
        explanation: "The push() method adds elements to the end of an array."
      },
      {
        text: "What does '===' operator do in JavaScript?",
        options: ["Assignment", "Equality check", "Strict equality check", "Not equal"],
        correctOptionIndex: 2,
        marks: 1,
        type: "single-choice",
        explanation: "The '===' operator checks for strict equality (value and type)."
      },
      {
        text: "How do you write a single-line comment in JavaScript?",
        options: ["// This is a comment", "<!-- This is a comment -->", "# This is a comment", "** This is a comment **"],
        correctOptionIndex: 0,
        marks: 1,
        type: "single-choice",
        explanation: "Single-line comments in JavaScript start with '//'."
      },
      {
        text: "Which of the following is NOT a JavaScript data type?",
        options: ["String", "Boolean", "Integer", "Number"],
        correctOptionIndex: 2,
        marks: 1,
        type: "single-choice",
        explanation: "JavaScript has Number type, but not specifically Integer type."
      },
      {
        text: "What is the output of: typeof undefined?",
        options: ["null", "undefined", "object", "string"],
        correctOptionIndex: 1,
        marks: 1,
        type: "single-choice",
        explanation: "typeof undefined returns 'undefined'."
      },
      {
        text: "Which operator is used for string concatenation?",
        options: ["+", "&", ".", "concat"],
        correctOptionIndex: 0,
        marks: 1,
        type: "single-choice",
        explanation: "The + operator is used for string concatenation in JavaScript."
      },
      {
        text: "How do you create an array in JavaScript?",
        options: ["var arr = [];", "var arr = {};", "var arr = ();", "var arr = <>;"],
        correctOptionIndex: 0,
        marks: 1,
        type: "single-choice",
        explanation: "Arrays are created using square brackets []."
      },
      {
        text: "What is the correct way to write a JavaScript function?",
        options: ["function myFunction() {}", "def myFunction() {}", "func myFunction() {}", "method myFunction() {}"],
        correctOptionIndex: 0,
        marks: 1,
        type: "single-choice",
        explanation: "Functions in JavaScript are declared using the 'function' keyword."
      },
      {
        text: "Which method removes the last element from an array?",
        options: ["pop()", "push()", "shift()", "unshift()"],
        correctOptionIndex: 0,
        marks: 1,
        type: "single-choice",
        explanation: "The pop() method removes and returns the last element from an array."
      },
      {
        text: "What does NaN stand for?",
        options: ["Not a Number", "Null and None", "New Array Node", "Not a Name"],
        correctOptionIndex: 0,
        marks: 1,
        type: "single-choice",
        explanation: "NaN stands for 'Not a Number' and represents an invalid number."
      },
      {
        text: "How do you check if a variable is an array?",
        options: ["Array.isArray()", "typeof array", "array.isArray()", "isArray()"],
        correctOptionIndex: 0,
        marks: 1,
        type: "single-choice",
        explanation: "Array.isArray() is the correct method to check if a variable is an array."
      },
      {
        text: "What is the result of 5 + '5' in JavaScript?",
        options: ["10", "55", "'55'", "Error"],
        correctOptionIndex: 2,
        marks: 1,
        type: "single-choice",
        explanation: "JavaScript converts the number 5 to a string and concatenates, resulting in '55'."
      },
      {
        text: "Which keyword is used to create a constant in JavaScript?",
        options: ["const", "constant", "final", "static"],
        correctOptionIndex: 0,
        marks: 1,
        type: "single-choice",
        explanation: "The 'const' keyword is used to declare constants in JavaScript."
      },
      {
        text: "What is the correct way to write an if statement?",
        options: ["if (condition) {}", "if condition {}", "if (condition) then {}", "if condition then {}"],
        correctOptionIndex: 0,
        marks: 1,
        type: "single-choice",
        explanation: "If statements in JavaScript use parentheses around the condition."
      }
    ],
    medium: [
      {
        text: "What is closure in JavaScript?",
        options: ["A way to close the browser", "A function with access to outer scope", "A loop structure", "An error handling mechanism"],
        correctOptionIndex: 1,
        marks: 1,
        type: "single-choice",
        explanation: "A closure is a function that has access to variables in its outer scope even after the outer function returns."
      },
      {
        text: "What does 'this' keyword refer to in JavaScript?",
        options: ["The current function", "The global object", "The object that calls the function", "The previous function"],
        correctOptionIndex: 2,
        marks: 1,
        type: "single-choice",
        explanation: "'this' refers to the object that is calling the function."
      },
      {
        text: "What is the output of: console.log(typeof null)?",
        options: ["null", "undefined", "object", "boolean"],
        correctOptionIndex: 2,
        marks: 1,
        type: "single-choice",
        explanation: "typeof null returns 'object' due to a historical bug in JavaScript."
      },
      {
        text: "What is hoisting in JavaScript?",
        options: ["Moving variables to top", "Variable and function declarations are moved to top", "Lifting objects", "Error handling"],
        correctOptionIndex: 1,
        marks: 1,
        type: "single-choice",
        explanation: "Hoisting moves variable and function declarations to the top of their scope."
      },
      {
        text: "What is the difference between let and var?",
        options: ["No difference", "let has block scope, var has function scope", "var is newer", "let is faster"],
        correctOptionIndex: 1,
        marks: 1,
        type: "single-choice",
        explanation: "let has block scope while var has function scope."
      },
      {
        text: "What is a Promise in JavaScript?",
        options: ["A guarantee", "An object representing eventual completion of async operation", "A loop", "A variable type"],
        correctOptionIndex: 1,
        marks: 1,
        type: "single-choice",
        explanation: "A Promise represents the eventual completion or failure of an asynchronous operation."
      },
      {
        text: "What does the spread operator (...) do?",
        options: ["Spreads elements", "Creates arrays", "Copies objects", "All of the above"],
        correctOptionIndex: 3,
        marks: 1,
        type: "single-choice",
        explanation: "The spread operator can spread elements, create arrays, and copy objects."
      },
      {
        text: "What is destructuring in JavaScript?",
        options: ["Breaking code", "Extracting values from arrays/objects", "Deleting variables", "Error handling"],
        correctOptionIndex: 1,
        marks: 1,
        type: "single-choice",
        explanation: "Destructuring allows extracting values from arrays or objects into variables."
      },
      {
        text: "What is the difference between == and ===?",
        options: ["No difference", "== checks type, === doesn't", "=== checks type and value", "== is deprecated"],
        correctOptionIndex: 2,
        marks: 1,
        type: "single-choice",
        explanation: "=== checks both type and value, while == only checks value with type coercion."
      },
      {
        text: "What is an arrow function?",
        options: ["() => {}", "function() {}", "=> function", "arrow()"],
        correctOptionIndex: 0,
        marks: 1,
        type: "single-choice",
        explanation: "Arrow functions use the () => {} syntax and have lexical 'this' binding."
      }
    ],
    hard: [
      {
        text: "What is the difference between call() and apply() methods?",
        options: ["No difference", "call() takes arguments separately, apply() takes array", "apply() is faster", "call() is deprecated"],
        correctOptionIndex: 1,
        marks: 1,
        type: "single-choice",
        explanation: "call() takes arguments separately while apply() takes arguments as an array."
      },
      {
        text: "What is event bubbling?",
        options: ["Events move from child to parent", "Events move from parent to child", "Events are cancelled", "Events are duplicated"],
        correctOptionIndex: 0,
        marks: 1,
        type: "single-choice",
        explanation: "Event bubbling means events propagate from the target element up to its parents."
      },
      {
        text: "What is the prototype chain?",
        options: ["A chain of functions", "Inheritance mechanism in JavaScript", "A data structure", "Error handling"],
        correctOptionIndex: 1,
        marks: 1,
        type: "single-choice",
        explanation: "The prototype chain is JavaScript's inheritance mechanism."
      },
      {
        text: "What is the difference between bind(), call(), and apply()?",
        options: ["No difference", "bind() returns new function, call/apply invoke immediately", "bind() is faster", "call() is deprecated"],
        correctOptionIndex: 1,
        marks: 1,
        type: "single-choice",
        explanation: "bind() returns a new function, while call() and apply() invoke the function immediately."
      },
      {
        text: "What is a generator function?",
        options: ["function*", "A function that generates code", "A constructor", "An async function"],
        correctOptionIndex: 0,
        marks: 1,
        type: "single-choice",
        explanation: "Generator functions are declared with function* and can pause and resume execution."
      },
      {
        text: "What is the difference between async/await and Promises?",
        options: ["No difference", "async/await is syntactic sugar for Promises", "Promises are faster", "async/await is deprecated"],
        correctOptionIndex: 1,
        marks: 1,
        type: "single-choice",
        explanation: "async/await is syntactic sugar that makes Promise-based code easier to read and write."
      },
      {
        text: "What is a WeakMap in JavaScript?",
        options: ["A weak reference map", "A map with weak keys", "A small map", "An error type"],
        correctOptionIndex: 1,
        marks: 1,
        type: "single-choice",
        explanation: "WeakMap is a collection where keys are weakly referenced and must be objects."
      },
      {
        text: "What is the temporal dead zone?",
        options: ["A time zone", "Period where let/const variables exist but can't be accessed", "A debugging tool", "An error state"],
        correctOptionIndex: 1,
        marks: 1,
        type: "single-choice",
        explanation: "Temporal dead zone is the period where let/const variables exist but cannot be accessed before declaration."
      },
      {
        text: "What is currying in JavaScript?",
        options: ["A cooking method", "Transforming function with multiple args into sequence of functions", "Error handling", "Variable declaration"],
        correctOptionIndex: 1,
        marks: 1,
        type: "single-choice",
        explanation: "Currying transforms a function with multiple arguments into a sequence of functions each taking a single argument."
      },
      {
        text: "What is the difference between Object.freeze() and Object.seal()?",
        options: ["No difference", "freeze() prevents all changes, seal() allows property value changes", "seal() is stronger", "freeze() is deprecated"],
        correctOptionIndex: 1,
        marks: 1,
        type: "single-choice",
        explanation: "Object.freeze() prevents all changes, while Object.seal() allows changing existing property values but not adding/removing properties."
      }
    ]
  },
  python: {
    easy: [
      {
        text: "How do you create a comment in Python?",
        options: ["// comment", "# comment", "<!-- comment -->", "** comment **"],
        correctOptionIndex: 1,
        marks: 1,
        type: "single-choice",
        explanation: "Python uses # for single-line comments."
      },
      {
        text: "Which of the following is the correct way to create a list in Python?",
        options: ["list = {1, 2, 3}", "list = [1, 2, 3]", "list = (1, 2, 3)", "list = <1, 2, 3>"],
        correctOptionIndex: 1,
        marks: 1,
        type: "single-choice",
        explanation: "Lists in Python are created using square brackets []."
      },
      {
        text: "How do you print 'Hello World' in Python?",
        options: ["print('Hello World')", "echo 'Hello World'", "console.log('Hello World')", "printf('Hello World')"],
        correctOptionIndex: 0,
        marks: 1,
        type: "single-choice",
        explanation: "The print() function is used to output text in Python."
      },
      {
        text: "What is the correct way to create a variable in Python?",
        options: ["var x = 5", "x = 5", "int x = 5", "declare x = 5"],
        correctOptionIndex: 1,
        marks: 1,
        type: "single-choice",
        explanation: "Python uses simple assignment without type declaration."
      },
      {
        text: "Which of the following is a Python data type?",
        options: ["list", "array", "vector", "matrix"],
        correctOptionIndex: 0,
        marks: 1,
        type: "single-choice",
        explanation: "List is a built-in data type in Python."
      },
      {
        text: "How do you create a dictionary in Python?",
        options: ["dict = []", "dict = {}", "dict = ()", "dict = <>"],
        correctOptionIndex: 1,
        marks: 1,
        type: "single-choice",
        explanation: "Dictionaries in Python are created using curly braces {}."
      },
      {
        text: "What is the correct way to create a string in Python?",
        options: ["'Hello'", "\"Hello\"", "Both A and B", "string('Hello')"],
        correctOptionIndex: 2,
        marks: 1,
        type: "single-choice",
        explanation: "Python strings can be created with either single or double quotes."
      },
      {
        text: "How do you get the length of a list in Python?",
        options: ["list.length", "len(list)", "list.size()", "length(list)"],
        correctOptionIndex: 1,
        marks: 1,
        type: "single-choice",
        explanation: "The len() function returns the length of a list in Python."
      },
      {
        text: "What is the correct way to create a for loop in Python?",
        options: ["for i in range(5):", "for (i=0; i<5; i++):", "for i = 1 to 5:", "foreach i in 5:"],
        correctOptionIndex: 0,
        marks: 1,
        type: "single-choice",
        explanation: "Python for loops use the 'for variable in iterable:' syntax."
      },
      {
        text: "How do you define a function in Python?",
        options: ["function myFunc():", "def myFunc():", "func myFunc():", "define myFunc():"],
        correctOptionIndex: 1,
        marks: 1,
        type: "single-choice",
        explanation: "Functions in Python are defined using the 'def' keyword."
      }
    ],
    medium: [
      {
        text: "What is a lambda function in Python?",
        options: ["A named function", "An anonymous function", "A class method", "A built-in function"],
        correctOptionIndex: 1,
        marks: 1,
        type: "single-choice",
        explanation: "Lambda functions are anonymous functions defined using the lambda keyword."
      },
      {
        text: "What is list comprehension in Python?",
        options: ["A way to create lists", "A type of loop", "A function", "A class"],
        correctOptionIndex: 0,
        marks: 1,
        type: "single-choice",
        explanation: "List comprehensions provide a concise way to create lists in Python."
      },
      {
        text: "What is the difference between append() and extend()?",
        options: ["No difference", "append() adds single element, extend() adds multiple", "extend() is faster", "append() is deprecated"],
        correctOptionIndex: 1,
        marks: 1,
        type: "single-choice",
        explanation: "append() adds a single element, while extend() adds multiple elements from an iterable."
      },
      {
        text: "What is a tuple in Python?",
        options: ["Mutable sequence", "Immutable sequence", "A function", "A class"],
        correctOptionIndex: 1,
        marks: 1,
        type: "single-choice",
        explanation: "Tuples are immutable sequences in Python."
      },
      {
        text: "What does the 'self' parameter represent?",
        options: ["The class", "The instance of the class", "A global variable", "A function"],
        correctOptionIndex: 1,
        marks: 1,
        type: "single-choice",
        explanation: "'self' refers to the instance of the class in Python methods."
      },
      {
        text: "What is the difference between is and ==?",
        options: ["No difference", "is checks identity, == checks equality", "== is faster", "is is deprecated"],
        correctOptionIndex: 1,
        marks: 1,
        type: "single-choice",
        explanation: "'is' checks object identity, while '==' checks value equality."
      },
      {
        text: "What is a generator in Python?",
        options: ["A function that returns iterator", "A class", "A module", "A variable type"],
        correctOptionIndex: 0,
        marks: 1,
        type: "single-choice",
        explanation: "Generators are functions that return iterators using yield."
      },
      {
        text: "What is the purpose of __init__ method?",
        options: ["Initialize class", "Initialize instance", "Delete instance", "Import modules"],
        correctOptionIndex: 1,
        marks: 1,
        type: "single-choice",
        explanation: "__init__ is the constructor method that initializes new instances."
      }
    ],
    hard: [
      {
        text: "What is the Global Interpreter Lock (GIL) in Python?",
        options: ["A security feature", "A mutex that protects Python objects", "A compilation step", "A debugging tool"],
        correctOptionIndex: 1,
        marks: 1,
        type: "single-choice",
        explanation: "GIL is a mutex that protects access to Python objects, preventing multiple threads from executing Python bytecodes simultaneously."
      },
      {
        text: "What is a decorator in Python?",
        options: ["A design pattern", "A function that modifies another function", "A class method", "A variable type"],
        correctOptionIndex: 1,
        marks: 1,
        type: "single-choice",
        explanation: "Decorators are functions that modify or extend the behavior of other functions."
      },
      {
        text: "What is the difference between deepcopy and copy?",
        options: ["No difference", "deepcopy creates recursive copies", "copy is faster", "deepcopy is deprecated"],
        correctOptionIndex: 1,
        marks: 1,
        type: "single-choice",
        explanation: "deepcopy creates recursive copies of nested objects, while copy creates shallow copies."
      },
      {
        text: "What is a metaclass in Python?",
        options: ["A class of classes", "A parent class", "A module", "A function"],
        correctOptionIndex: 0,
        marks: 1,
        type: "single-choice",
        explanation: "A metaclass is a class whose instances are classes themselves."
      },
      {
        text: "What is the purpose of __slots__?",
        options: ["Memory optimization", "Speed optimization", "Both A and B", "Error handling"],
        correctOptionIndex: 2,
        marks: 1,
        type: "single-choice",
        explanation: "__slots__ restricts instance attributes and provides memory and speed optimization."
      },
      {
        text: "What is monkey patching?",
        options: ["Debugging technique", "Dynamic modification of classes/modules", "Error handling", "Testing method"],
        correctOptionIndex: 1,
        marks: 1,
        type: "single-choice",
        explanation: "Monkey patching is dynamically modifying classes or modules at runtime."
      },
      {
        text: "What is the difference between staticmethod and classmethod?",
        options: ["No difference", "staticmethod doesn't receive implicit first argument", "classmethod is faster", "staticmethod is deprecated"],
        correctOptionIndex: 1,
        marks: 1,
        type: "single-choice",
        explanation: "staticmethod doesn't receive any implicit first argument, while classmethod receives the class as first argument."
      },
      {
        text: "What is a context manager?",
        options: ["A design pattern", "Object that defines runtime context", "A debugging tool", "A testing framework"],
        correctOptionIndex: 1,
        marks: 1,
        type: "single-choice",
        explanation: "Context managers define runtime context for executing code blocks, typically used with 'with' statement."
      }
    ]
  },
  general: {
    easy: [
      {
        text: "What does CPU stand for?",
        options: ["Central Processing Unit", "Computer Personal Unit", "Central Personal Unit", "Computer Processing Unit"],
        correctOptionIndex: 0,
        marks: 1,
        type: "single-choice",
        explanation: "CPU stands for Central Processing Unit."
      },
      {
        text: "Which of the following is a programming language?",
        options: ["HTML", "CSS", "JavaScript", "All of the above"],
        correctOptionIndex: 2,
        marks: 1,
        type: "single-choice",
        explanation: "JavaScript is a programming language, while HTML and CSS are markup and styling languages."
      },
      {
        text: "What does RAM stand for?",
        options: ["Random Access Memory", "Read Access Memory", "Rapid Access Memory", "Real Access Memory"],
        correctOptionIndex: 0,
        marks: 1,
        type: "single-choice",
        explanation: "RAM stands for Random Access Memory."
      },
      {
        text: "What is the binary representation of decimal 5?",
        options: ["101", "110", "111", "100"],
        correctOptionIndex: 0,
        marks: 1,
        type: "single-choice",
        explanation: "Decimal 5 is represented as 101 in binary."
      },
      {
        text: "What does HTTP stand for?",
        options: ["HyperText Transfer Protocol", "High Transfer Text Protocol", "HyperText Transport Protocol", "High Text Transfer Protocol"],
        correctOptionIndex: 0,
        marks: 1,
        type: "single-choice",
        explanation: "HTTP stands for HyperText Transfer Protocol."
      },
      {
        text: "What is a database?",
        options: ["A programming language", "A collection of organized data", "A web browser", "An operating system"],
        correctOptionIndex: 1,
        marks: 1,
        type: "single-choice",
        explanation: "A database is a collection of organized data."
      },
      {
        text: "What does URL stand for?",
        options: ["Universal Resource Locator", "Uniform Resource Locator", "Universal Reference Link", "Uniform Reference Locator"],
        correctOptionIndex: 1,
        marks: 1,
        type: "single-choice",
        explanation: "URL stands for Uniform Resource Locator."
      },
      {
        text: "What is an operating system?",
        options: ["A programming language", "System software that manages computer hardware", "A web browser", "A database"],
        correctOptionIndex: 1,
        marks: 1,
        type: "single-choice",
        explanation: "An operating system is system software that manages computer hardware and software resources."
      },
      {
        text: "What does API stand for?",
        options: ["Application Programming Interface", "Advanced Programming Integration", "Automated Program Interaction", "Application Process Integration"],
        correctOptionIndex: 0,
        marks: 1,
        type: "single-choice",
        explanation: "API stands for Application Programming Interface."
      },
      {
        text: "What is the Internet?",
        options: ["A single computer", "A global network of interconnected computers", "A programming language", "An operating system"],
        correctOptionIndex: 1,
        marks: 1,
        type: "single-choice",
        explanation: "The Internet is a global network of interconnected computers."
      }
    ],
    medium: [
      {
        text: "What is an algorithm?",
        options: ["A programming language", "A step-by-step procedure", "A computer program", "A data structure"],
        correctOptionIndex: 1,
        marks: 1,
        type: "single-choice",
        explanation: "An algorithm is a step-by-step procedure for solving a problem."
      },
      {
        text: "What is the difference between compiler and interpreter?",
        options: ["No difference", "Compiler translates entire program, interpreter executes line by line", "Interpreter is faster", "Compiler is deprecated"],
        correctOptionIndex: 1,
        marks: 1,
        type: "single-choice",
        explanation: "A compiler translates the entire program before execution, while an interpreter executes code line by line."
      },
      {
        text: "What is version control?",
        options: ["Software versioning", "System to track changes in files", "Program compilation", "Error handling"],
        correctOptionIndex: 1,
        marks: 1,
        type: "single-choice",
        explanation: "Version control is a system that tracks changes in files over time."
      },
      {
        text: "What is a data structure?",
        options: ["A programming language", "A way to organize and store data", "A computer program", "An algorithm"],
        correctOptionIndex: 1,
        marks: 1,
        type: "single-choice",
        explanation: "A data structure is a way to organize and store data efficiently."
      },
      {
        text: "What is recursion?",
        options: ["A loop", "A function calling itself", "Error handling", "Variable declaration"],
        correctOptionIndex: 1,
        marks: 1,
        type: "single-choice",
        explanation: "Recursion is when a function calls itself to solve a problem."
      },
      {
        text: "What is the difference between stack and queue?",
        options: ["No difference", "Stack is LIFO, Queue is FIFO", "Queue is faster", "Stack is deprecated"],
        correctOptionIndex: 1,
        marks: 1,
        type: "single-choice",
        explanation: "Stack follows Last In First Out (LIFO), while Queue follows First In First Out (FIFO)."
      },
      {
        text: "What is object-oriented programming?",
        options: ["A programming paradigm based on objects", "A programming language", "A data structure", "An algorithm"],
        correctOptionIndex: 0,
        marks: 1,
        type: "single-choice",
        explanation: "Object-oriented programming is a paradigm based on the concept of objects."
      },
      {
        text: "What is debugging?",
        options: ["Writing code", "Finding and fixing errors in code", "Compiling code", "Running code"],
        correctOptionIndex: 1,
        marks: 1,
        type: "single-choice",
        explanation: "Debugging is the process of finding and fixing errors in code."
      }
    ],
    hard: [
      {
        text: "What is the time complexity of binary search?",
        options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
        correctOptionIndex: 1,
        marks: 1,
        type: "single-choice",
        explanation: "Binary search has O(log n) time complexity as it divides the search space in half each time."
      },
      {
        text: "What is Big O notation?",
        options: ["A programming language", "Mathematical notation for algorithm complexity", "A data structure", "A design pattern"],
        correctOptionIndex: 1,
        marks: 1,
        type: "single-choice",
        explanation: "Big O notation describes the computational complexity of algorithms."
      },
      {
        text: "What is a hash table?",
        options: ["A sorting algorithm", "Data structure using hash function for key-value mapping", "A programming language", "A design pattern"],
        correctOptionIndex: 1,
        marks: 1,
        type: "single-choice",
        explanation: "A hash table uses a hash function to map keys to values for efficient lookup."
      },
      {
        text: "What is the difference between breadth-first and depth-first search?",
        options: ["No difference", "BFS explores level by level, DFS goes deep first", "DFS is faster", "BFS is deprecated"],
        correctOptionIndex: 1,
        marks: 1,
        type: "single-choice",
        explanation: "BFS explores nodes level by level, while DFS goes as deep as possible before backtracking."
      },
      {
        text: "What is dynamic programming?",
        options: ["A programming language", "Optimization technique using overlapping subproblems", "A data structure", "A design pattern"],
        correctOptionIndex: 1,
        marks: 1,
        type: "single-choice",
        explanation: "Dynamic programming is an optimization technique that solves problems by breaking them into overlapping subproblems."
      },
      {
        text: "What is the CAP theorem?",
        options: ["Consistency, Availability, Partition tolerance", "A programming principle", "A data structure", "A sorting algorithm"],
        correctOptionIndex: 0,
        marks: 1,
        type: "single-choice",
        explanation: "CAP theorem states that distributed systems can only guarantee two of: Consistency, Availability, and Partition tolerance."
      },
      {
        text: "What is a design pattern?",
        options: ["A programming language", "Reusable solution to common software design problems", "A data structure", "An algorithm"],
        correctOptionIndex: 1,
        marks: 1,
        type: "single-choice",
        explanation: "Design patterns are reusable solutions to commonly occurring problems in software design."
      },
      {
        text: "What is the difference between SQL and NoSQL databases?",
        options: ["No difference", "SQL is relational, NoSQL is non-relational", "NoSQL is faster", "SQL is deprecated"],
        correctOptionIndex: 1,
        marks: 1,
        type: "single-choice",
        explanation: "SQL databases are relational with structured schemas, while NoSQL databases are non-relational with flexible schemas."
      }
    ]
  }
};

export async function generateQuizQuestions(topic, numQuestions, difficulty) {
  console.log(`📚 Generating ${numQuestions} ${difficulty} questions about "${topic}" using templates`);
  
  // Normalize topic to lowercase for matching
  const normalizedTopic = topic.toLowerCase();
  
  // Find matching topic or use general
  let selectedTopic = 'general';
  if (questionDatabase[normalizedTopic]) {
    selectedTopic = normalizedTopic;
  } else {
    // Check if topic contains keywords
    for (const dbTopic of Object.keys(questionDatabase)) {
      if (normalizedTopic.includes(dbTopic) || dbTopic.includes(normalizedTopic)) {
        selectedTopic = dbTopic;
        break;
      }
    }
  }
  
  console.log(`📖 Using topic: ${selectedTopic}`);
  
  const topicQuestions = questionDatabase[selectedTopic];
  const difficultyQuestions = topicQuestions[difficulty] || topicQuestions.easy || [];
  
  if (difficultyQuestions.length === 0) {
    throw new Error(`No questions available for topic: ${topic}, difficulty: ${difficulty}`);
  }
  
  // Select questions (repeat if needed)
  const selectedQuestions = [];
  for (let i = 0; i < numQuestions; i++) {
    const questionIndex = i % difficultyQuestions.length;
    const question = { ...difficultyQuestions[questionIndex] };
    
    // Add some variation to repeated questions
    if (i >= difficultyQuestions.length) {
      question.text = `[Variation] ${question.text}`;
    }
    
    selectedQuestions.push(question);
  }
  
  console.log(`✅ Generated ${selectedQuestions.length} template-based questions`);
  
  return {
    questions: selectedQuestions,
    provider: 'template-based',
    topic: selectedTopic,
    difficulty: difficulty
  };
}

export default { generateQuizQuestions };
