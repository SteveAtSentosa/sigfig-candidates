import { SettingsData } from "../components/settings/types";

/**
 * Utility file to expose the API URL and its types.
 */

 // List of difficulty settings based on OpenTriviaDB API
export enum OpenTriviaDBDifficulty {
    EASY = 'easy',
    MEDIUM = 'medium',
    HARD = 'hard',
}

// Array of options for based on OpenTriviaDBDifficulty
export const difficultiesOptions = [
    { value: OpenTriviaDBDifficulty.EASY, label: 'Easy' },
    { value: OpenTriviaDBDifficulty.MEDIUM, label: 'Medium' },
    { value: OpenTriviaDBDifficulty.HARD, label: 'Hard' },
]


// List of category settings based on OpenTriviaDB API
export enum OpenTriviaDBDCategory {
    ANY = 0,
    GENERAL_KNOWLEDGE = 9,
    ENTERTAINMENT_BOOKS = 10,
    ENTERTAINMENT_FILM = 11,
    ENTERTAINMENT_MUSIC = 12,
    ENTERTAINMENT_MUSICALS = 13,
    ENTERTAINMENT_TV = 14,
    ENTERTAINMENT_GAMES = 15,
    ENTERTAINMENT_BOARD_GAMES = 16,
    SCIENCE_NATURE = 17,
    SCIENCE_COMPUTERS = 18,
    SCIENCE_MATH = 19,
    MYTHOLOGY = 20,
    SPORTS = 21,
    GEOGRAPHY = 22,
    HISTORY = 23,
    POLITICS = 24,
    ART = 25,
    CELEBRITIES = 26,
    ANIMALS = 27,
    VEHICLES = 28,
    ENTERTAINMENT_COMICS = 29,
    SCIENCE_GADGETS = 30,
    ENTERTAINMENT_ANIME_MANGA = 31,
    ENTERTAINMENT_CARTOON = 32,
}

// // Array of options for based on OpenTriviaDBDCategory
export const categoriesOptions = [
    { value: OpenTriviaDBDCategory.ANY, label: 'Any' },
    { value: OpenTriviaDBDCategory.GENERAL_KNOWLEDGE, label: 'General Knowledge' },
    { value: OpenTriviaDBDCategory.ENTERTAINMENT_BOOKS, label: 'Entertainment - Books' },
    { value: OpenTriviaDBDCategory.ENTERTAINMENT_FILM, label: 'Entertainment - Film' },
    { value: OpenTriviaDBDCategory.ENTERTAINMENT_MUSIC, label: 'Entertainment - Music' },
    { value: OpenTriviaDBDCategory.ENTERTAINMENT_MUSICALS, label: 'Entertainment - Musicals' },
    { value: OpenTriviaDBDCategory.ENTERTAINMENT_TV, label: 'Entertainment - TV' },
    { value: OpenTriviaDBDCategory.ENTERTAINMENT_GAMES, label: 'Entertainment - Games' },
    { value: OpenTriviaDBDCategory.ENTERTAINMENT_BOARD_GAMES, label: 'Entertainment - Board Games' },
    { value: OpenTriviaDBDCategory.SCIENCE_NATURE, label: 'Science - Nature' },
    { value: OpenTriviaDBDCategory.SCIENCE_COMPUTERS, label: 'Scinece - Computers' },
    { value: OpenTriviaDBDCategory.SCIENCE_MATH, label: 'Science - Math' },
    { value: OpenTriviaDBDCategory.MYTHOLOGY, label: 'Mythology' },
    { value: OpenTriviaDBDCategory.SPORTS, label: 'Sports' },
    { value: OpenTriviaDBDCategory.GEOGRAPHY, label: 'Geography' },
    { value: OpenTriviaDBDCategory.HISTORY, label: 'History' },
    { value: OpenTriviaDBDCategory.POLITICS, label: 'Politics' },
    { value: OpenTriviaDBDCategory.ART, label: 'Art' },
    { value: OpenTriviaDBDCategory.CELEBRITIES, label: 'Celebrities' },
    { value: OpenTriviaDBDCategory.ANIMALS, label: 'Animals' },
    { value: OpenTriviaDBDCategory.VEHICLES, label: 'Vehicles' },
    { value: OpenTriviaDBDCategory.ENTERTAINMENT_COMICS, label: 'Entertainment - Comics' },
    { value: OpenTriviaDBDCategory.SCIENCE_GADGETS, label: 'Science - Gadgets' },
    { value: OpenTriviaDBDCategory.ENTERTAINMENT_ANIME_MANGA, label: 'Entertainment - Anime and Manga' },
    { value: OpenTriviaDBDCategory.ENTERTAINMENT_CARTOON, label: 'Entertainment - Cartoon' },
]

export default class APIUtils {

    /**
     * Builds the URL for the API call.
     * @param settings settings for the data to be fetched.
     * @returns a string with the URL for the API call.
     */
    public static getEndpointUrl({ numOfQuestions, difficulty, category } : SettingsData): string {
        return `https://opentdb.com/api.php?amount=${numOfQuestions}&difficulty=${difficulty}&type=boolean${category !== OpenTriviaDBDCategory.ANY ? '&category=' + category : ''}`;
    }
}

// Representation of the Open Trivia Database Response
export interface OpenTriviaDBReponse {
    response_code: number
    results: OpenTriviaDBResult[]
}

// Representation of a Open Trivia Database result (e.g: a given question)
export interface OpenTriviaDBResult {
    category: string
    correct_answer: string
    difficulty: string
    incorrect_answers: string[]
    question: string
    type: string
}