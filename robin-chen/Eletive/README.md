### Basic setup

1. Install NPM packages by running `npm install`
2. Run project by running `npm start`

### Common commands

| Command name | Command | Description |
|---|---|---|
|start|`npm start`|runs application locally|
|startProdAPI|`npm run startProdAPI`|runs application with production API endpoint|
|build|`npm run build`|builds application in production mode|
|buildDev|`npm run buildDev`|builds application in development mode|
|deployDev|`npm run deployDev`|deploys application to development environment|
|deployProd|`npm run deployProd`|deploys application to production environment|
|eslint|`npm run eslint`|runs ESLint over all source files|
|ngrok|`npm run ngrok`|runs ngrok tunnel with public URL. Used to test application that is running locally on different devices|

### AWS setup and configuration

1. Install AWS SDK command line tools. Use [documentation](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html) for more details.
  **note**: you will probably need to add `aws` to your PATH environment variable
2. Navigate to your home user directory where you will find a new directory called `.aws`. There are also `config` and `credentials` files inside it
3. Open `config` file with your a text editor you prefer and add the next lines at the end of the file:

    ```yaml
    [eletive]
    region=eu-west-1
    ```

4. Open `credentials` file and add the next lines at the end of the file:

    ```yaml
    [eletive]
    aws_access_key_id=<ACCESS KEY ID>
    aws_secret_access_key=<SECRET ACCESS KEY>
    ```

    Use real keys from [AWS management console](https://987667722076.signin.aws.amazon.com/console) under **Services/IAM/Users/`<your_user>`/Security credentials/Access keys** section. Create new access key if needed.

Now you are able to make deployments to both development and production enviroments.

##### Deployment to development
- Checkout repository `development` branch and make `pull` if needed
- Open termimal and navigate to project root directory
- Run `npm run deployDev` command

##### Deployment to production
- Checkout repository `master` branch and make `pull` if needed
- Open termimal and navigate to project root directory
- Run `npm run deployProd` command

# Development guide lines
Guidelines for how we write code, that is not handled by eslint. These guidelines are for us to make our code look the same independently from who developed it and to easier find what we are looking for.
These guidelines are the minimum requirement to pass a pull request review so please learn and follow them.

## Git
Master your tools and your main tool beside your IDE for coding is git. When working in your branch you have the power and control to do what you want. You can create 1 or 100 of commits as it fits your need. When you create PR then make sure you squash,fixup,arange and reword the commits.
To learn how to manage your git history checkout https://git-scm.com/book/en/v2/Git-Tools-Rewriting-History and practice it until you know how your tool handles it. We have developers who use git cli, emacs magit, MacOS sourcetree and VS Code so don't hesitate to ask.

### Commit messages
Make sure your git commit messages follow the rules in https://chris.beams.io/posts/git-commit/ and always try to answer the WHY are you making the change. The goal is to make the commit message make sence 6-12months in the future for a completely new developer. They should understand why you made the commit.

Summary is

1. First line max 70 characters
2. First line starts with EL-XXX the issue number in JIRA. Few exceptions form this.
3. Unless a issue or branch is about pure refactoring/fixes then all those type of commits should be squashed/fixedup with the main commit for the feature.
4. Make sure the diff reflects the commit message.

## Style (CSS/SCSS)

Order of properties

1. Display, positioning, bounds, flex related properties
2. Margin and padding
3. Border
4. Color and background color
5. Font related properties
6. Other stuff
7. Animations

## Component library
1. No re-style (colors, font...): all view variants should be in component itself
2. Set size and position over wrap components (Common component should take all width or have flag for it)
3. For most no more 3 view variants (like small, normal, large; or success, error..)
4. Minimal required props: should have default renders, filters for all optional props

## Icons and images (svg)
1. Import over index.js
2. Use SvgImage components
3. Change fill and stroke over currentColor

## React

`className` at end of attribute list for a component.

### Component vs Container
When to use MyComponent.container vs MyComponent vs ConnectedMyComponentWithRouter ?

- **MyComponent**
  Every time you need a component

- **MyComponent.Container**
  If it should be connected to Redux store

- **ConnectedMyComponentWithRouter**
  If this component is rendered directly (not using Route component), but you still need to have access to history object

# Testing

## Cypress
To run cypress tests you need a test token in env variable `CYPRESS_ACCESS_TOKEN` for dev you can ask for it and for your local environment checkout `back-end/readme.md`
