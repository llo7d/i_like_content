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
                options: ["No error", "Missing async keyword", "Improper use of await", "Unnecessary semicolon"],
                question: {
                    text: "Identify the issue with this TypeScript async function:",
                    codeSnippet: "function fetchData(): Promise<string> { return await 'Data'; }"
                },
                correctAnswer: "Missing async keyword"
            }

            ,
            category: 'typescript',
            difficulty: 'easy',
            your_name: 'Looyd + AI',
            your_github_url: 'github.com/llo7d'
        },



    ]
          

    addQuestions(questions);