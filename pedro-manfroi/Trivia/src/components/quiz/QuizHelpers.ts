import { Answer, QuestionData } from './types';
import { normalizeHtmlText } from '../../utils/StringUtils';
import { OpenTriviaDBResult } from '../../utils/APIUtils';

/**
 * Check if the game is considered finished.
 * It will be considered finished when there are answers to all given questions.
 * @param questions current questions.
 * @param answer current answers.
 * @returns true if there are answers to all questions, otherwise false.
 */
export const hasFinished = (questions: QuestionData[], answers: Answer[]): boolean => {
    // If there are no questions or answers data, it is considered as not finished
    if (!questions || !questions.length || !answers || !answers.length) return false;    
    // Finished when the amount of questions and answers are the same
    return answers.length === questions.length;
}

/**
 * Compute the score based on the answers.
 * The score will be incremented when the user selected the correct answer.
 * @param answers the selected answers.
 * @returns total count of correct answers.
 */
export const computeScore = (answers: Answer[]): number => {
    let finalScore = 0;
    answers.forEach(a => {
        if (a.userAnswer === a.correctAnswer) finalScore++;
    });
    
    return finalScore;
}

/**
 * Maps the results of the Open Trivia DB to QuestionsData.
 * Coerce data to the QuestionData format.
 * Will normalize text information for the category and description.
 * @param results the data retrieved in the Open Trivia DB format.
 * @returns data converted to the QuestionData type.
 */
export const mapResultsPayloadToQuestions = (results: OpenTriviaDBResult[]): QuestionData[] => {
    const questions: QuestionData[] = [];        
    results.forEach(r => {
        questions.push({
            category: normalizeHtmlText(r.category),
            description: normalizeHtmlText(r.question),
            correctAnswer: r.correct_answer === "True" ? true : false,
        })
    })
    
    return questions;
}