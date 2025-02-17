const { Builder, By, Key, until } = require('selenium-webdriver');
const { describe, it, before, beforeEach, after } = require('node:test');
const assert = require('assert');
const browser = require('../settings');

/*
##############################
########### Tests ############
##############################
*/

describe('Login', (t) => {
	var driver;
	before(() => {
		driver = new Builder().forBrowser(browser).build();
	});
	beforeEach(() => {
		driver.get('https://parabank.parasoft.com/parabank/index.htm');
	});
	after(() => {
		driver.quit();
	});
	it('No password', async () => {
		await LoginFail(driver, 'Marko', '');
	});
	it('Incorrect password', async () => {
		await LoginFail(driver, 'Marko', 'marko321');
	});
	it('No username', async () => {
		await LoginFail(driver, '', 'marko123');
	});
	it('Incorrect username', async () => {
		await LoginFail(driver, 'Pero', 'marko123');
	});
	it('Non existing user', async () => {
		await LoginFail(driver, 'Pero', 'pero123');
	});
	it('Correct login data', async () => {
		await LoginSucess(driver, 'Marko', 'marko123');
	});
});

/*
##############################
##### Selenium functions #####
##############################
*/

async function LoginFail(driver, username, password) {
	try {
		await driver.findElement(By.name('username')).sendKeys(username);
		await driver.findElement(By.name('password')).sendKeys(password, Key.RETURN);
		await driver.wait(until.elementLocated(By.className('title')), 5000);
		let title = await driver.findElement(By.className('title'));
		await assert.equal(await title.getText(), 'Error!');
	}
	catch(err) {
		new assert.AssertionError(err.message);
	}
}

async function LoginSucess(driver, username, password) {
	try {
		await driver.findElement(By.name('username')).sendKeys(username);
		await driver.findElement(By.name('password')).sendKeys(password, Key.RETURN);
		await driver.wait(until.elementLocated(By.className('title')), 5000);
		let title = await driver.findElement(By.className('title'));
		await assert.equal(await title.getText(), 'Accounts Overview');
	}
	catch(err) {
		new assert.AssertionError(err.message);
	}
}
