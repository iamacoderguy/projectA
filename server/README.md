## Available Scripts

In the project directory (`projectA/server/`), you can run:

### `npm install`

Install all required node packages for the project.<br>

It might change your `package-lock.json`. Do not commit the file if you're not sure about the changes of it.

### `npm start`

Runs the app in the production mode.<br>

You might need to set `a_jwtPrivateKey` env variable to start the server.<br>
Open [http://localhost:3000](http://localhost:3000) to view admin dashboard in the browser.<br>
Open [http://yourIpAddr:3000](http://yourIpAddr:3000) to view api documentation in the browser.

### `npm run debug`

Runs the app in development mode.<br>

You might need `nodemon` package installed globally to run the command.<br>
To install `nodemon`, you can run `npm i -g nodemon`.<br>

`a_jwtPrivateKey` is set to 1234 in default when you start the server.<br>
Open [http://localhost:3000](http://localhost:3000) to view admin dashboard in the browser.<br>
Open [http://yourIpAddr:3000](http://yourIpAddr:3000) to view api documentation in the browser.<br>

The page will reload if you make edits.<br>
You will also see more errors and logs in the console.

### `npm test`

To run all test cases and measure code coverage of the project.<br>

You might need `jest` package installed globally to run the command.<br>
To install `jest`, you can run `npm i -g jest`.<br>

For more information about jest, please refer to [https://jestjs.io/docs/en/getting-started](https://jestjs.io/docs/en/getting-started).

### `npm run test_debug`

Launches the test runner in the interactive watch mode.<br>

You might need `jest` package installed globally to run the command.<br>
To install 'jest', you can run `npm i -g jest`.<br>

The test cases will re-run if you make changes in source code or test code.<br>
For more information about jest, please refer to [https://jestjs.io/docs/en/getting-started](https://jestjs.io/docs/en/getting-started).

## Learn More

You can learn more in the [our Wiki pages](https://github.com/iamacoderguy/projectA/wiki).

### Deployment

We temporarily write down some guidelines here: https://github.com/iamacoderguy/projectA/wiki/FAQs

### Generating API documentations

We temporarily write down some guidelines here: https://github.com/iamacoderguy/projectA/wiki/FAQs
