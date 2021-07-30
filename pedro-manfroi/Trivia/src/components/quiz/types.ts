/**
 * Types definitions for the Quiz.
 */
export interface QuestionData {
    category: string   
    description: string
    correctAnswer: boolean
}

export interface Answer extends QuestionData {
    userAnswer: boolean
}