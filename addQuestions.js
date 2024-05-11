//@ts-nocheck

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    'https://vdoqyjbnpwqkafxxssbb.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkb3F5amJucHdxa2FmeHhzc2JiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTEzNzIyMTUsImV4cCI6MjAyNjk0ODIxNX0.luuvoKY-udlAaD83Qf5pElsetmXVwPetr6C-v5gpjDg'
);

async function addQuestions(questions) {

    for (let i = 0; i < questions.length; i++) {
        const question = questions[i];

        try {
            const { data, error } = await supabase
                .from('questions')
                .insert([
                    {
                        question: question.question,
                        category: question.category,
                        difficulty: question.difficulty,
                        your_name: question.your_name,
                        your_github_url: question.your_github_url
                    },
                ]);

            if (error) {
                console.error('Error adding question:', error);
                continue;
            }

            console.log('Question added:', questions[i]);
        } catch (error) {
            console.error('Error adding question:', error);
        }
    }
}

//@ts-ignore Usage
const questions =
    [
        {
            question: {
                options: ["HTML", "JSX", "XML", "JavaScript"],
                question: {
                    text: "React components are typically written in which syntax that looks similar to HTML?",
                    codeSnippet: ""
                },
                correctAnswer: "JSX"
            }
            ,
            category: 'react',
            difficulty: 'easy',
            your_name: 'Looyd + AI',
            your_github_url: 'github.com/llo7d'
        },

        {
            question: {
                options: ["States", "Props", "Methods", "Classes"],
                question: {
                    text: "Which React feature is used for passing data to components from outside?",
                    codeSnippet: "function Welcome(____) { return <h1>Hello, {____.name}</h1>; }"
                },
                correctAnswer: "Props"
            }
            ,
            category: 'react',
            difficulty: 'easy',
            your_name: 'Looyd + AI',
            your_github_url: 'github.com/llo7d'
        },

        {
            question: {
                options: ["state", "setState", "useState", "All of the above"],
                question: {
                    text: "Which hook is used in functional components for managing state?",
                    codeSnippet: "const [count, setCount] = _____(0);"
                },
                correctAnswer: "useState"
            }

            ,
            category: 'react',
            difficulty: 'easy',
            your_name: 'Looyd + AI',
            your_github_url: 'github.com/llo7d'
        },

        {
            question: {
                options: ["onClick", "onHandle", "onEvent", "handleClick"],
                question: {
                    text: "Which attribute is commonly used in React to handle click events?",
                    codeSnippet: "<button on____={handleClick()}>Buy 🍕</button>"
                },
                correctAnswer: "onClick"
            }
            ,
            category: 'react',
            difficulty: 'easy',
            your_name: 'Looyd + AI',
            your_github_url: 'github.com/llo7d'
        },

        {
            question: {
                options: ["key", "id", "data-key", "index"],
                question: {
                    text: "What should be given to elements inside a map() function to maintain their identity?",
                    codeSnippet: "items.map((item) => <li key={item.id}><h2>{item.name}</h2><p>{item.description}</p></li>);"
                },
                correctAnswer: "key"
            }

            ,
            category: 'react',
            difficulty: 'easy',
            your_name: 'Looyd + AI',
            your_github_url: 'github.com/llo7d'
        },


    ]


addQuestions(questions);



{
    "options": [
        "=",
        "like",
        "==",
        "as"
    ],
        "question": {
        "text": "What is the correct syntax for creating an alias for a module?",
            "codeSnippet": "import pandas pd"
    },
    "correctAnswer": "as"
}
{
    "options": [
        "print(len(fruits))",
        "print(length(fruits))",
        "print(fruits.len())",
        "print(fruits.length())"
    ],
        "question": {
        "text": "Correct syntax to print the number of items in the fruits tuple.",
            "codeSnippet": "fruits = ('apple', 'banana', 'cherry')"
    },
    "correctAnswer": "print(len(fruits))"
}