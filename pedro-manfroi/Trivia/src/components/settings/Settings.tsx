/**
 * This is an example of standard Class based component with some lifecyle methods.
 * It contains all settings related with options for the user to customize the app.
 * 
 * As this component relies only in the fact that it will render the same results
 * given the same state and props (with shallow compararing), it is defined as a
 * PureComponent to have some performance benefits during render phase.
 * 
 * Settings state are stored the in Redux store.
 * Note: for demonstration purposes, changes are going to be lost when refreshing the page. 
 * 
 */
import React, { PureComponent } from 'react';
import { WithStyles, createStyles, withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import Button from '@material-ui/core/Button';
import { Link as RouterLink} from 'react-router-dom';
import { Dispatch, bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { ReduxState } from '../../reducers/index';
import { SettingsData } from './types';
import { SettingsActions } from '../../actions/index';
import { isEqual } from 'lodash';
import { OpenTriviaDBDifficulty, OpenTriviaDBDCategory } from '../../utils/APIUtils';
import toastr from 'toastr';
import { difficultiesOptions, categoriesOptions } from '../../utils/APIUtils';

interface Props extends WithStyles<typeof styles>  {
    settings: SettingsData
    loadSettings(): void,
    saveSettings(settings: SettingsData): void,
}

interface State {
    numOfQuestions?: number
    difficulty?: OpenTriviaDBDifficulty
    category?: OpenTriviaDBDCategory
}

class Settings extends PureComponent<Props, State> {    

    constructor(props: Props) {
        super(props)
        this.state = {
            numOfQuestions: undefined,
            difficulty: undefined,
            category: undefined,
        }
        this.handleChangeNumOfQuestions = this.handleChangeNumOfQuestions.bind(this);
        this.handleChangeDifficulty = this.handleChangeDifficulty.bind(this);
        this.handleChangeCategory = this.handleChangeCategory.bind(this);
        this.handleSaveSettings = this.handleSaveSettings.bind(this);
    }

    componentDidMount() {
        if (this.props.settings) {
            // Sets the default values for state with what's in the settings in the Redux store.
            this.setState({ ...this.props.settings }) 
        } else {
            // If the settings props is not loaded yet, will dispatch the loading action.
            this.props.loadSettings();
        }                
    }

    /**
     * Showcase of the componentDidUpdate lifecyle method.
     * It will sync the state with the updated props from Redux store.
     * Although this is not a common pattern, it has the benefit of live loading the state if the Redux store is updated.
     */
    componentDidUpdate(prevProps: Props) {        
        const { settings } = this.props;
        // Check if the settings are different
        if (!isEqual(settings, prevProps.settings)) {
            // Settings have been loaded or changed, will sync the state with the new settings.
            if (settings) {
                this.setState({ ...settings });
            } else {
                // If there are no settings, will reinitialize the state
                this.setState({
                    numOfQuestions: undefined,
                    difficulty: undefined,
                    category: undefined,
                })
            }
        }
    }

    private handleChangeNumOfQuestions (event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ numOfQuestions: Number(event.target.value) });
    };

    private handleChangeDifficulty (event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ difficulty: event.target.value as OpenTriviaDBDifficulty });
    };

    private handleChangeCategory (event: React.ChangeEvent<HTMLInputElement>) {        
        this.setState({ category: Number(event.target.value) as OpenTriviaDBDCategory });
    };

    private handleSaveSettings() {
        // Update the settings in Redux Store. If a setting is undefined,
        // (e.g: user did not modified the options) it won't save the changes (it will have the same value of what's already in Redux store).        
        const newSettings: SettingsData = {
            numOfQuestions: this.state.numOfQuestions !== undefined ? this.state.numOfQuestions : this.props.settings.numOfQuestions,
            difficulty: this.state.difficulty !== undefined ? this.state.difficulty : this.props.settings.difficulty,
            category: this.state.category !== undefined ?  this.state.category : this.props.settings.category,
        }
        this.props.saveSettings(newSettings);    
        toastr.info('Settings updated sucessfully!');
    }

    render() {
        const { classes } = this.props;
        const { numOfQuestions, difficulty, category } = this.state;
        const hasChanged = this.props.settings && (numOfQuestions !== this.props.settings.numOfQuestions || difficulty !==  this.props.settings.difficulty || category !==  this.props.settings.category);

        return (
            <Container component="main" maxWidth="xs">
                <div className={classes.paper}>        
                    <Typography component="h1" variant="h5">Settings</Typography>
                    <form className={classes.form} noValidate>
                        <TextField
                            label="Number of questions"
                            type="number"
                            value={numOfQuestions || 10}
                            onChange={this.handleChangeNumOfQuestions}
                            fullWidth
                            margin="normal"
                            required
                            InputProps={{ inputProps: { min: 1, max: 20 } }}
                         />      
                        <TextField
                            label="Difficulty"
                            select
                            value={difficulty || OpenTriviaDBDifficulty.HARD}
                            onChange={this.handleChangeDifficulty}
                            fullWidth
                            margin="normal"
                            required
                         >           
                            {difficultiesOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}                 
                         </TextField>
                         <TextField
                            label="Category"
                            select
                            value={category || OpenTriviaDBDCategory.ANY}
                            onChange={this.handleChangeCategory}
                            fullWidth
                            margin="normal"
                            required
                         >           
                            {categoriesOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}                 
                         </TextField>                         

                    <Box p={3}>
                        <Grid container>
                            <Grid item xs>
                                <RouterLink to="/">
                                    <Link component="button" variant="body2">Go back to home</Link>
                                </RouterLink>
                            </Grid>
                            <Grid item xs>
                                <Button disabled={!hasChanged} variant="contained" color="primary" onClick={this.handleSaveSettings}> Save Changes</Button>
                            </Grid>
                        </Grid>                    
                    </Box>    
                    </form>   
                </div>
            </Container>
        );
    }
    
}

const styles = (theme: Theme) => createStyles({
    paper: {
      marginTop: theme.spacing(10),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingBottom: 10,
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(1),
    },    
});

const mapStateToProps = (state: ReduxState): Pick<Props, 'settings'> => ({
    settings: state.settings,
})
  
const mapDispatch = (dispatch: Dispatch) => ({
    loadSettings: bindActionCreators(SettingsActions.loadSettings, dispatch),
    saveSettings: bindActionCreators(SettingsActions.saveSettings, dispatch),
 });

export default connect(mapStateToProps, mapDispatch)(withStyles(styles)(Settings));