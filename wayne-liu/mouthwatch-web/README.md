# -web

## Setup

You have two options to run the frontend locally:

### 1. NVM

Install the correct Node Version (10):
It's suggested that you install [`nvm`](https://github.com/nvm-sh/nvm)
Then run:
```
> nvm install
```

and whenever navigating to the folder for the first time:
```
> nvm use
```

Install dependencies:
```
> npm install
```

Run the dev server to open the site and hot-reload as you work:
```
> npm run dev
```

### 2. Docker

You need to have docker and docker-compose installed.

*Note: the docker setup depends on `dev`. If you don't have it running, then open a new terminal, clone ** (outside of this repo), and finally run `docker-compose up -d` from the repo's root.*

Run `docker-compose up` - it will start 2 containers, install npm packages and build the site.
You can access:
* webpack-dev-server at http://.localhost/
* nginx preview of the production build at http://.localhost/

The NodeJS container is using v10.14 which is the required version for the site.
From this point, you'll need to prefix npm commands with `docker-compose exec dev [command]` (so they're being run by the proper version of node), eg. `docker-compose exec dev npm run test`.

If you're getting errors for `node-sass`, then you'll need to `rm -rf node_modules` first then run `docker-compose up` again.


## Getting Started With Development
After you've got a local env set up and running, here are some things to keep in mind when developing on `mo***web`

## Git Branches
There are 3 main branches:
`develop` - (develop) used on develop.localhost.com
`staging` - (staging) used on staging.localhost.com
`master` - (production) used on teledent.localhost.com

Branch types:
`release/*` - release branches for grouping tickets / fixes to go out together, usually in sync with `origin/develop` (examples: `release/dandelion-dingo`, `release/green-gecko`, `release/indigo-imapala`)
`feature/*` - for "Development" ticket type or general code changes (new features / requests)
`bugfix/*`  - for Bug tickets (issue was found by dev / qa / end user, ticket was created & assigned)
`hotfix/*`  - for bugs that are being fixed immediately (usually for post-live issues, doesn't always have a ticket number), usually directly branched off and merged into `origin/master`, then gets merged back down (`origin/master` -> other branchs) to prevent bug regression

### Creating A New Branch
When creating a new branch, most of the information to help you name your branch will come from your ticket. The main thing to keep in mind is the ticket type. In general, branches should be named as such `ticketType/ticketNumber-short-blurb-about-ticket`. See "Branch types:" above for naming convention. 

Examples:
New Feature - `feature/MW-3215-admin-tools-update-edit-account-page`
Bug Ticket  - `bugfix/MW-2579-add-new-appointment-modal-issues`

New branches should be based on the current release branch (usually up to date with `origin/develop`). If there is no release branch, just directly off of `origin/develop`. In rare cases you may have to branch off `origin/staging`, if this is ever the case just make sure whatever work you are doing also gets merged into `origin/develop` and we don't lose any work during the next `dev` -> `staging` merge.

### Unit Tests
You can manually run test with `npm run test`. This will also run automatically for you during pre-commit and in BitBucket Pipelines

### Committing Work
You should always make sure the branch you are working on is up to date with the release branch you are working off of or `origin/develop`. Please make your commit messages as verbose as they need to be (generally referencing the ticket # and simple synopsis of changes made). 

### Pull Requests
When it comes time to create a pull request for the branch, please keep in mind the release branch, as sometimes there is more than one branch being worked on (rarely occurs but important to keep in mind). Make sure your pull request is against the current release branch (can be found on the ticket). All pull requests must be approved by at least one person before merging them.

### Styles
Sass support should work out-of-the-box. The global stylesheet lives at `src/assets/styles/global.scss`.

[Css modules](https://github.com/css-modules/css-modules) are also supported, which allows us to scope styles locally to each component. See `src/components/Counter/` for an example of how this works.

### Static Assets
Static assets can be placed in the `src/static/` directory. Anything other than `index.html` and the `styles/` directory will be automatically copied into the build.

### Routing
[React-router](https://reacttraining.com/react-router/web/guides/quick-start) is being used for route management. These are configured in `src/app/index.tsx`, `src/app/routes.tsx`, and in specific components (e.g. `PatientDetail`, `AdminTools`, etc).

### Redux for state management
We're using Redux for state management, along with a few other utilities to make things a bit easier:

- [Redoodle](https://palantir.github.io/redoodle/) – a lightweight utility later on top of Redux that reduces boilerplate and significantly improves integration with Typescript
- [Redux Saga](https://redux-saga.js.org/) - Utilities for asynchronous workflows and side effects
- [Redux Persist](https://github.com/rt2zz/redux-persist) - Utility for persisting Redux state

Modules for state management should be put in the following folders accordingly: `src/actions/`, `src/reducers`, and `src/sagas`. In general, each module should export its actions, a `State` interface, an `initialState` variable and a `reducer` function. These can then be integrated into the Redux store (see `src/redux/reducers.ts`).

For modules that have asynchronous workflows, they should also export a `saga` generator function which should be included in `src/redux/sagas`.

## Front End Standards

* Be strict about Typescript definitions.

    * Avoid all uses of `any` where possible.
    * Prefer type definitions over type assertions. e.g. ```const x: Api.WhereValue = ... ``` is better than ``` const x = ... as Api.WhereValue ```
    * Type fixes (for pre-existing code) are generally a low priority though.

* Separate component logic and saga logic.

    * Component logic: rendering ui elements, event handlers
    * Saga logic: api requests, data refreshing, other side effects
    * For exceptions, add a comment explaining your reasoning

* Use auto-import-sort.

    * Use it (Atom) or its VSCode equivalent


* Build smaller components.

    * Try to limit components to roughly 200 lines. For anything larger, try to split them into separate components.
    * Use ```container``` files for "smart" components (i.e. components that are connected to the Redux store). Container files contain the ```connect(...)``` logic for the component, including mapStateToProps and actions.
    * Use ```types``` files for the component's type definitions, including StateProps and ActionProps.
    * For smaller components, it is fine to put type definitions and Redux connect functions at the top and bottom of the component class file respectively.
    * Use `React.PureComponent` or function components wherever possible

* Use descriptive variable / method names.

    * Use class methods to render specific elements and name them appropriately, e.g. renderDownloadButton
    * Use “private” class methods and getters

* Reduce the use of anonymous functions inside the `render` function or within DOM element event handlers.

    * Reduce use of inline functions for better stack traces. Use class methods instead.
    * Be sure to add type definitions for your event, e.g. ```private search = (event: React.ChangeEvent<HTMLInputElement>) => { ... }```

* Considerations for folder structure:

    * We have two main places that React Components go in our code base. Admin Tools (front end / components) has already been refactored pretty well: the only components in `/pages/AdminTools/` are the actual different pages you can go to, and the large components inside the pages have been broken out / moved to `/components/AdminTools/`
    * `/src/pages/` - This is where any Page OR Panel / Tab (major part of any page that's rendered) components should be, good examples: `/pages/Appointments/` `/pages/Patients/`  `/pages/AdminTools/`
    * Notice how in Appointments and Patients, each 'pane' or 'tab' is it's own component in there. There is probably still some work to do to pull out common / smaller components from that page.
    * `/src/components/` - This is where common / re-used / smaller components should be. Notice folders like `/src/components/Modal/` and `/src/components/Table/` -- new Modal and Table components can go in there (probably some refactoring to do with Admin Tools), as well as the styles to go along with them (styles get weird if you don't do them in `table.scss` for example).

* Use descriptive git commit messages (wip).

    * E.g. ```git commit -m "MW-3022 navigate to chat before firing CreateChannel action"```
    * Maybe explain the reasoning as well as the change, but be concise.

## Builds / Deployment

- Run `npm test` to make sure tests pass (this should run automatically for you in Bitbucket Pipelines and is also as a pre-commit).
- You can generate a production build of the app by running `npm run build`.

### Using Docker

- Navigate to repo root, i.e. `-web`
- Run `docker build .`
- Should see a message, "Successfully built " followed by the IMAGE ID
- Run `docker run -d -p 8000:80 <IMAGE>`
- Should see a message with the container ID
- Check `localhost:8000` to see your build
- View a list of running containers with `docker ps`
- Run `docker stop <container-ID>` to stop the container
- More info at: [`Docker Docs`](https://docs.docker.com/engine/reference/commandline/cli/)

## Useful Information

### Capture Intraoral
There are a few ways you can get to the Capture Intraoral page.

1. On the dashboard page, click the "Capture" tile in the Create section. Choose a patient from the dropdown, click "Start Capture". An appointment will be created for that patient and you will be taken to the Capture Intraoral page.
2. On any page, click the "+" icon in the nav bar. Then click Capture. Similar to the modal, choose a patient and click "Start Capture", an appointment will be created and you will be taken to the Capture Intraoral page.
3. On the Appointment Details page (for any appointment), on the Collect Data tab, click "Capture New Images". You will be taken to the Capture Intraoral page.

### Components

- **Container**: typically used for containing entire pages and the header nav elements.
- **Grid**: grid and column components using Bootstrap. There are props that allow for responsiveness as well. Note: Bootstrap breakpoints are different from the Container component's breakpoints. See `breakpoints.scss`.
- **Table**: components for building full-page lists like the one on the Appointments page (see `AppointmentsTable`). Currently, the components are tailored to the Appointments page (e.g. an extra header-less column for 'View' button) so there is room to abstract them as we move forward. The `TableHeaderButton`, for example, is ready to be used anywhere. See the `Tasks` widget on the `Dashboard` page for a working example.
- **Pagination**: a responsive component for paged navigation. Currently, only accepts a prop for `pages` though this will likely change based on how we handle pages on the back-end (WIP).
- **ConnectedFields**: (located in `components/Form`) connected react-select fields populated with data from the API for use in redux-form. See `components/QuickCreate/QuickCreatePatient` for an example of how to use them.

## Building Forms

- Generally, we use [`redux-form`](https://redux-form.com). In `components/Forms/Input` there are a number of Field components that are used throughout the site.
- TIP: If you need to initialize the form with some data, it is often useful to set `enableReinitialize` to `true`
- The `GroupsFormSection` and `PatientsProviderSection` components contain all the logic for adding their respective fields to forms. See the Access Control Bible below.

## Access Control

[The Bible](https://docs.google.com/document/d/1XnjEoJp5lICdecP5Wq8L5wZDelr4tCKexAbrKVerY-0/edit#heading=h.j0y13eomixqk)

### Groups

[How groups work (comment)](https://jira..com/browse/MW-1181?focusedCommentId=313172&page=com.atlassian.jira.plugin.system.issuetabpanels:comment-tabpanel#comment-313172)

[Example of an issue that could arise (comment)](https://jira..com/browse/MW-1262?focusedCommentId=313352&page=com.atlassian.jira.plugin.system.issuetabpanels:comment-tabpanel#comment-313352)

## Treatment Plan Builder

[Templates Technical Specifications](https://docs.google.com/document/d/1IeVuUtLqU9CLBqno5qTKtJ11OUa1k5Zq_hI1a9vJWAs/edit?ts=5dcac402)

## API

### Documentation
Documentation for the API can be found [here](https://.localhost/doc) (credentials can be found in [Jira](https://wiki.localhost.com/pages/viewpage.action?pageId=59932680))

### Postman
The API can be accessed by hitting the endpoints through curl, but Postman makes it much easier to make requests and repeat / adjust those requests. [Here](https://drive.google.com/file/d/1Y-aGeCha_rdgI9j9uQSEZ0TxSg25Ddft/view?usp=sharing) is a Collection of endpoints & env variables that can be imported into Postman for easy use.

## Known Issues

### Fetching Data

#### Appointments / Accounts

Appointment requests that include multiple associations (and nested associations) can crash the service. As a workaround, GET requests for appointment lists that include multiple associations are split into individual requests and the results are merged afterwards. A similar 'chunk' approach is used to fetch large numbers of accounts (see `fetchChatUsers` in `sagas/chat`).
