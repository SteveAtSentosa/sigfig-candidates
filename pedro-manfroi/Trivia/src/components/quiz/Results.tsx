/**
 * Functional component that represents the Results page.
 * It will receive the given anwers and the final score as Props.
 */

import React, { FC } from 'react';
import { Answer } from './types';
import { Link, Redirect } from 'react-router-dom';
import { AnswerResult } from './AnswerResult';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';

interface Props {
    answers: Answer[]
    finalScore: number
}

export const Results: FC<Props> = ({ answers, finalScore, ...rest }: Props) => {        
    const classes = useStyles();
    // If there are no answers will redirect to the main page
    if (!answers || !answers.length) return <Redirect to="/" />;

    const totalQuestions = answers.length;
    function renderAnswers() {        
        return answers.map((answer, i) => {
            return <AnswerResult key={i} answer={answer} />
        })
    }        
    return (
        <Container component="main" maxWidth="xs">
            <div className={classes.paper}>
                <Typography variant="h5" align="center">You scored</Typography>
                <Typography variant="h5" align="center">{finalScore} of {totalQuestions}</Typography>
                {renderAnswers()}
                <Box p={2}>
                    <Link to="/">
                        <Button fullWidth variant="contained" color="primary">Play again?</Button>
                    </Link>
                </Box>                    
            </div>                
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