const { Builder, By, Key, until } = require('selenium-webdriver');
const { describe, it, before, beforeEach, after } = require('node:test');
const assert = require('assert');
const { browser } = require('../settings');
const { validUser, emptyUser, mismatchedPasswordUser, noPhoneNumberUser, noUsernameUser, noPasswordUser, noInfoUser }= require('../testdata');


/*
##############################
########### Tests ############
##############################
*/

describe('Register', (t) => {
	var driver;
	before(async () => {
		driver = await new Builder().forBrowser(browser).build();
	});
	beforeEach(async () => {
		await driver.get('https://parabank.parasoft.com/parabank/register.htm');
	});
	after(async () => {
		await ResetDB(driver);
		await driver.quit();
	});

	it('No data', async () => {
		await RegisterFail(driver, emptyUser);
	});
	it('No user info', async () => {
		await RegisterFail(driver, noInfoUser);
	});
	it('No username', async () => {
		await RegisterFail(driver, noUsernameUser);
	});
	it('No password', async () => {
		await RegisterFail(driver, noPasswordUser);
	});
	it('Passwords dont match', async () => {
		await RegisterFail(driver, mismatchedPasswordUser);
	});
	it('Correct data', async () => {
		await RegisterSuccess(driver, validUser);
		await Logout(driver);
	});
	it('No phone number', async () => {
		await RegisterSuccess(driver, noPhoneNumberUser);
		await Logout(driver);
	});
	it('User with existing username', async () => {
		await RegisterFail(driver, validUser);
	});
});


/*
##############################
##### Selenium functions #####
##############################
*/

async function RegisterFail(driver, user) {
	try {
		await driver.findElement(By.name('customer.firstName')).sendKeys(user.fName);
		await driver.findElement(By.name('customer.lastName')).sendKeys(user.lName);
		await driver.findElement(By.name('customer.address.street')).sendKeys(user.address);
		await driver.findElement(By.name('customer.address.city')).sendKeys(user.city);
		await driver.findElement(By.name('customer.address.state')).sendKeys(user.state);
		await driver.findElement(By.name('customer.address.zipCode')).sendKeys(user.zipCode);
		await driver.findElement(By.name('customer.phoneNumber')).sendKeys(user.phone);
		await driver.findElement(By.name('customer.ssn')).sendKeys(user.ssn);
		await driver.findElement(By.name('customer.username')).sendKeys(user.username);
		await driver.findElement(By.name('customer.password')).sendKeys(user.password);
		await driver.findElement(By.name('repeatedPassword')).sendKeys(user.passwordConfirm, Key.RETURN);
		await driver.wait(until.elementLocated(By.className('error')), 5000);
	}
	catch(err) {
		new assert.AssertionError(err.message);
	}
}

async function RegisterSuccess(driver, user) {
	try {
		await driver.findElement(By.name('customer.firstName')).sendKeys(user.fName);
		await driver.findElement(By.name('customer.lastName')).sendKeys(user.lName);	
		await driver.findElement(By.name('customer.address.street')).sendKeys(user.address);
		await driver.findElement(By.name('customer.address.city')).sendKeys(user.city);
		await driver.findElement(By.name('customer.address.state')).sendKeys(user.state);
		await driver.findElement(By.name('customer.address.zipCode')).sendKeys(user.zipCode);
		await driver.findElement(By.name('customer.phoneNumber')).sendKeys(user.phone);
		await driver.findElement(By.name('customer.ssn')).sendKeys(user.ssn);
		await driver.findElement(By.name('customer.username')).sendKeys(user.username);
		await driver.findElement(By.name('customer.password')).sendKeys(user.password);
		await driver.findElement(By.name('repeatedPassword')).sendKeys(user.passwordConfirm, Key.RETURN);
		await driver.wait(until.elementLocated(By.xpath('/html/body/div[1]/div[3]/div[1]/ul/li[8]/a')), 5000);
		let logout = await driver.findElement(By.xpath('/html/body/div[1]/div[3]/div[1]/ul/li[8]/a'));
		await assert.equal(await logout.getText(), 'Log Out');
	}
	catch(err) {
		new assert.AssertionError(err.message);
	}
}

async function Logout(driver) {
	try {
		await driver.get('https://parabank.parasoft.com/parabank/logout.htm');
	}
	catch(err) {
		console.log(err.message);
	}
}

async function ResetDB(driver) {
	try {
		await driver.get('https://parabank.parasoft.com/parabank/admin.htm');	
		await driver.wait(until.elementLocated(By.name('action')), 5000);
		let clear = await driver.findElement(By.xpath('/html/body/div[1]/div[3]/div[2]/table/tbody/tr/td[1]/form/table/tbody/tr/td[2]/button'));
		await clear.click();
		await driver.get('https://parabank.parasoft.com/parabank/admin.htm');	
		await driver.wait(until.elementLocated(By.name('action')), 5000);
		let init = await driver.findElement(By.xpath('/html/body/div[1]/div[3]/div[2]/table/tbody/tr/td[1]/form/table/tbody/tr/td[1]/button'));
		await init.click();
	}
	catch(err) {
		console.log(err.message);
	}
}
