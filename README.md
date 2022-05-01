# MavDegreePlanner

Plan out your UTA CSE major with a simple drag and drop interface.

## Documentation

Documentation can be viewed on the on [gh-pages](https://mavdegreeplanner.github.io/MavDegreePlanner/), or the [docs branch](https://github.com/MavDegreePlanner/MavDegreePlanner/tree/docs). It is generated using `typedoc`, and is auto-generated when a commit is pushed to main.

### Generating documentation

```text
# Install
npm install --save-dev typedoc

# Generate
./node_modules/.bin/typedoc --entryPointStrategy expand src/
```

## Firebase Setup

In the project directory, copy the file `.env.template` and rename it to `.env`, then enter your Firebase config details from your Firebase console in it.

Inside the `.env` file:

```text
REACT_APP_FIREBASE_API_KEY=keyHere
REACT_APP_FIREBASE_AUTH_DOMAIN=domainHere
REACT_APP_FIREBASE_PROJECT_ID=projectIdHere
REACT_APP_FIREBASE_STORAGE_BUCKET=storageBucketHere
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=messagingSenderIdHere
REACT_APP_FIREBASE_APP_ID=appIdHere
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
