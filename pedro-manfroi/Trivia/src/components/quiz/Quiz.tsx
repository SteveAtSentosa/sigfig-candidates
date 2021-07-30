/**
 * Functional component that represent UI and the state of the Quiz.
 * State will be managed by useState hooks.
 */

import React, { FC, useEffect, useState } from 'react';
import { Question } from './Question';
import APIUtils, { OpenTriviaDBReponse } from '../../utils/APIUtils';
import axios from 'axios';
import { QuestionData, Answer } from './types';
import { computeScore, hasFinished, mapResultsPayloadToQuestions } from './QuizHelpers';
import { Results } from './Results';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import Skeleton from '@material-ui/lab/Skeleton';
import { Link as RouterLink} from 'react-router-dom';
import Fade from '@material-ui/core/Fade';
import { useSelector, useDispatch } from 'react-redux'
import { ReduxState } from '../../reducers/index';
import { SettingsData } from '../settings/types';
import { SettingsActions } from '../../actions/index';
import toastr from 'toastr'



export const Quiz: FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [questions, setQuestions] = useState<QuestionData[]>([]);    
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState<number>(0);    
    const [elementIn, setElementIn] = useState<boolean>(true); // State for managing transition effect between answers    
    const classes = useStyles();
    const transitonTimeout = 350;

    // This is a demonstration of using a hook to access the reduxStore in a functional component
    const settings = useSelector<ReduxState, SettingsData>(state => state.settings);
    
    // Instantiating the dispatch handler to fire redux actions
    const dispatch = useDispatch();    

    useEffect((() => {
        // Force to load the user settings (there is no side effect if it is already loaded)        
        dispatch(SettingsActions.loadSettings());
    }), [dispatch])
        
    //Fetching the data from the API when the component mounts (this is a one time only operation).
    useEffect(() => {       
        async function fetchData() {
            try {
                setLoading(true);
                const response = await axios.get<OpenTriviaDBReponse>(APIUtils.getEndpointUrl(settings));
                // Check if it received a valid HTTP response.
                // A response will be considered valid if it didn't failed and if the response_code is equal 0 and has a valid results array.
                if (response && response.data && response.data.response_code === 0 && response.data.results && response.data.results.length) {                                        
                    setQuestions(mapResultsPayloadToQuestions(response.data.results));
                } else {
                    toastr.error(`Bad data received from API call. Note: if you changed the default settings, combination of some of these options can cause a failure in the API server.`);
                }                
            } catch (error) {
                // Catches HTTP errors related with the request and throw back for the Error boundary in the application
                toastr.error(`Request error: ${error.toString()}`);
            } finally {
                setLoading(false);
            }
        }  
        if (settings) {
            // Just fetch data if the settings are loaded
            fetchData();
        }      
        
    }, [settings]); // If the settings did not changed, it will not execute this effect again.

    /**
     * Handles the answer selected by the user and add it to the answers array state.
     * This is a callback function to be called when an answer is triggered.
     * @param question the question in which the answer was made.
     * @param answer the answer for the question.
     */
     const handleAnswerSelected = (question: QuestionData) => (answer: boolean) => {
         // Creates a new answer
        const newAnswer: Answer = {
            ...question,
            userAnswer: answer,
        }
        // Set state in a wrapped function, this will prevent unwanted side effects in the array (e.g: concurrent renders/race conditions).
        setAnswers(answers => [...answers, newAnswer]);
        // Updates the current question
        setCurrentQuestion(currentQuestion + 1);
        
        // Update state related with the transitions
        setElementIn(false);
        setTimeout(() => setElementIn(true), transitonTimeout);
    }

    const hasQuestions = !!(questions && questions.length);             
    if (hasQuestions && hasFinished(questions, answers)) {
        // If the answers to all questions exists, will compute the final score and render the Results component
        const finalScore = computeScore(answers);
        return <Results answers={answers} finalScore={finalScore} />
    }    

    return (
        <Container component="main" maxWidth="xs">
            <Fade in={elementIn} timeout={transitonTimeout} >
                <div className={classes.paper}>
                    {!loading && hasQuestions ? (
                    <>
                        <Question key={currentQuestion} question={questions[currentQuestion]} onAnswerSelected={handleAnswerSelected(questions[currentQuestion])}/>                                    
                        <Box p={2}>
                            <Typography variant="subtitle1" align="center">Question {currentQuestion + 1} of {questions.length}</Typography>
                        </Box>
                        <Box p={2}>
                            <RouterLink to="/">
                                <Link component="button" variant="body2">Go back to home</Link>
                            </RouterLink>
                        </Box>
                    </>
                    )
                    : (
                    <> 
                        <Skeleton variant="text" width={"100%"} height={90} />                                    
                        <Skeleton variant="rect" width={"100%"} height={400}/>    
                        <Skeleton variant="text" width={"100%"} height={30}/>        
                    </>)
                    }
                </div>
            </Fade>
        </Container>
    )        
}

const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
}));