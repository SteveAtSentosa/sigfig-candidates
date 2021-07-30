# G2i Trivia Code Challenge
Trivia Application that integrates with the [Open Trivia Database API](https://opentdb.com/).
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Introduction
This is a React + TypeScript application designed for the G2i coding challenge.
It consists in a simple Trivia App that loads random questions from the Open Trivia Database API.
After answering all questions, the user will be presented with the results and with the option to play it again.

## Contact information
Candidate: Pedro Manfroi
Personal e-mail: pedrometal@gmail.com

## Key dependencies
[Material-UI](https://material-ui.com/): for the UI Components.
[Redux & React-Redux](https://react-redux.js.org/): for some of the state management.
[Axios](https://github.com/axios/axios): HTTP client.
[Jest](https://jestjs.io/): testing framework.
[React Transition Group](https://reactcommunity.org/react-transition-group/): to handle transition effects between routes.
[React color](https://casesandberg.github.io/react-color/): for enhanced color picker options.
[lodash](https://lodash.com/): JavaScript utilities.
[toastr](https://github.com/CodeSeven/toastr): simple alerts and notifications for the user feedback.

## Source code - Project strucuture

    ./src                       # Boilerplate react setup files
    ├── actions                 # Available actions for the React-Redux integration
    ├── assets                  # All assets related to the application
        ├── wireframes          # Design mockups & specifications
    ├── components              # Visual elements of the application
        ├── home                # Related to the application intro screen
        ├── quiz                # Components that are related with the Quiz section
        ├── settings            # Settings related to the API
        ├── theming             # Theming feature
    ├── hooks                   # Custom hooks utilized by the application
    ├── reducers                # Reducers utilized for the React-Redux integration
    ├── utils                   # Utility files that are used in the application    
    ├── TriviaApp               # Root component of the application

## Installation
To install the application, run the following command:

### `yarn install`

## Available Scripts

## `yarn start`

To start the apllication in http://localhost:3000.

## `yarn test`

To run the tests.

## `yarn build`

Generates the production build.

## Note about a console warning:
If the following warning appears when running the App: 

"Warning: findDOMNode is deprecated in StrictMode. findDOMNode was passed an instance of Transition which is inside StrictMode. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://fb.me/react-strict-mode-find-node"

This is related with the "react-transition-group" third party library running in Strict Mode. 
Since it's a known issue and for the sake of simplicity, I did not added any kind of workaround to circumvent that for now.

