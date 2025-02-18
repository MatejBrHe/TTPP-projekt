# TTPP-projekt


## Tools used

In this project the tools used are:
1.	Node.js
2.	selenium-webdriver for Node.js ([more info](https://www.npmjs.com/package/selenium-webdriver))
3.	Test runner module for Node.js ([more info](https://nodejs.org/api/test.html))
4.	Assert module for Node.ja ([more info](https://nodejs.org/api/assert.html))

Additional components like chromedriver.exe or geckodriver.exe might be needed (on my PC it worked without them, but if it doesn't work for you follow [installation instructions here](https://www.npmjs.com/package/selenium-webdriver)).


## Software tested

A demo site called [Para Bank](https://parabank.parasoft.com/parabank/index.htm) was tested. There are 35 tests and 5 suites.


## Usage

1.	Get all the dependencies with the *npm* package manager (in this case only *selenium-webdriver*)
2.	Go to *settings.js* file and change the browser option to the browser you use
3.	Run the *run.js* file from the command line (only if you want to run all the tests):

		> node run

	If you want to run each test individually, go to the *tests* directory and run a command:

		> node *test_file_name*


## Add new tests

1.	Go to *tests* directory
2.	Make a new file with .js extension (like *myTest.js*)
3.	Import all modules you need and start writing (use some of the previous links for help)
4.	Add the file path to *run.js* file


## Use test data

There is a *testdata.js* file where you can define the test data you will use.

	> const data = {
	>	// Your data goes here
	> };
	>
	> module.exports = data;

Import the data you need in the file like so:

	> const { yourData } = require('../testdata');
	> //Your code goes here

