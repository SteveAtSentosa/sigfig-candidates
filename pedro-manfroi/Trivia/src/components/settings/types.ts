import { OpenTriviaDBDifficulty, OpenTriviaDBDCategory } from "../../utils/APIUtils";

/**
 * Types definitions for the Settings.
 */
export interface SettingsData {
    numOfQuestions: number
    difficulty: OpenTriviaDBDifficulty
    category?: OpenTriviaDBDCategory
}