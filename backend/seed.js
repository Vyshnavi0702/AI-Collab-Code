require('dotenv').config();
const mongoose = require('mongoose');
const Question = require('./models/Question');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-collab-code';

const seedQuestions = [
  {
    title: "Two Sum",
    description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.",
    difficulty: "Easy",
    baseCode: {
      javascript: "function twoSum(nums, target) {\n  // Write your code here\n}\n\n// Do not modify the console.log below, it is used for judging\nconst args = process.argv.slice(2);\nconsole.log(twoSum(JSON.parse(args[0]), parseInt(args[1])));",
      python: "import sys\nimport json\n\ndef twoSum(nums, target):\n    # Write your code here\n    pass\n\nif __name__ == '__main__':\n    nums = json.loads(sys.argv[1])\n    target = int(sys.argv[2])\n    print(twoSum(nums, target))"
    },
    testCases: [
      { input: "\"[2,7,11,15]\" \"9\"", expectedOutput: "[0,1]" },
      { input: "\"[3,2,4]\" \"6\"", expectedOutput: "[1,2]" }
    ]
  },
  {
    title: "Palindrome Check",
    description: "Given a string `s`, return `true` if it is a palindrome, or `false` otherwise.",
    difficulty: "Easy",
    baseCode: {
      javascript: "function isPalindrome(s) {\n  // Write your code here\n}\n\nconst args = process.argv.slice(2);\nconsole.log(isPalindrome(args[0]));",
      python: "import sys\n\ndef isPalindrome(s):\n    # Write your code here\n    pass\n\nif __name__ == '__main__':\n    s = sys.argv[1]\n    # convert True/False to true/false for matching JS output usually\n    result = isPalindrome(s)\n    print(str(result).lower())"
    },
    testCases: [
      { input: "racecar", expectedOutput: "true" },
      { input: "hello", expectedOutput: "false" }
    ]
  }
];

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB.');
    await Question.deleteMany({});
    console.log('Cleared existing questions.');
    await Question.insertMany(seedQuestions);
    console.log('Seed data inserted successfully.');
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    mongoose.connection.close();
  });
