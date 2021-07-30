/**
 * Represention of a Question in the UI.
 */
import React, { FC, MouseEvent } from 'react';
import { QuestionData } from './types';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';

interface Props {
    question: Pick<QuestionData, 'category' | 'description'>
    onAnswerSelected(answer: boolean): void    
}


/** 
 * Receives a single Question and renders it.
 * After the user select an answer, will call a callback function with the answer selected by the user.
 */
export const Question: FC<Props> = ({ question, onAnswerSelected}: Props) => {
    const classes = useStyles();
    const { category, description } = question;        
    const handleButtonClick = (anwser: boolean) => (_e: MouseEvent<HTMLButtonElement>) => {
        onAnswerSelected(anwser)
    }

    return (
        <>
            <Typography variant="h5" align="center">{category}</Typography>
            <Box p={4}>
                <Typography variant="h4" align="center">{description}</Typography>
            </Box>                
            <Box p={4}>
                <div className={classes.root}>
                    <Button variant="contained" color="secondary" onClick={handleButtonClick(false)}>False</Button>
                    <Button variant="contained" color="primary" onClick={handleButtonClick(true)}>True</Button>
                </div>                    
            </Box>            
        </>
    )
}

const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        margin: theme.spacing(1),
      },
    },
}));


