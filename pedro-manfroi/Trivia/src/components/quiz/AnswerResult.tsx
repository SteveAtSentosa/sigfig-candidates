/**
 * Renders a given answer result.
 * If the users clicks on the answer, a Popper will display with the details.
 * This functional component just need to receive the answer as a Prop.
 */
import React, { FC, useState } from 'react';
import { Answer } from './types';
import Button from '@material-ui/core/Button';
import Popper from '@material-ui/core/Popper';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import ClearIcon from '@material-ui/icons/Clear';
import { green, red } from '@material-ui/core/colors';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

interface Props {
    answer: Answer    
}

const CorrectAnswerIcon = () => {
    return <DoneAllIcon style={{ color: green[500] }}/>
}

const WrongAnswerIcon = () => {
    return <ClearIcon style={{ color: red[500] }}/>
}

// Given an Answer type, renders the result of an answer.
export const AnswerResult: FC<Props> = ({ answer }: Props) => {
    const { userAnswer, correctAnswer, description, category } = answer;
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const correct = userAnswer === correctAnswer;
    const classes = useStyles();

    const handleDisplayDetails = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    }

    const handleClickAway = () => {
        setAnchorEl(null);
    }

    return (
        <ClickAwayListener onClickAway={handleClickAway}>
        <div className={classes.answers}>            
            <Button color="primary" startIcon={correct ? <CorrectAnswerIcon/> : <WrongAnswerIcon/>} onClick={handleDisplayDetails}>{description}</Button>            
                <Popper open={!!anchorEl} anchorEl={anchorEl}>
                    <div className={classes.paper}>
                        <h5 className={classes.details}>Correct answer is: {correctAnswer.toString()}. Category: {category}</h5>
                    </div>
                </Popper>            
        </div>
        </ClickAwayListener>        
    )
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
        padding: theme.spacing(1),
        backgroundColor: 'black',
    },
    answers: {
        justifyContent: 'left',
    },    
    details: {
        color: 'white',
    },
  }),
);