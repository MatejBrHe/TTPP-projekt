const { Builder, By, Key, until } = require('selenium-webdriver');
const { describe, it, before, beforeEach, after } = require('node:test');
const assert = require('assert');
const { browser } = require('../settings');
const { validUser } = require('../testdata');


/*
##############################
########### Tests ############
##############################
*/

describe('Update user info', (t) => {
	var driver;

	before(async () => {
		driver = await new Builder().forBrowser(browser).build();
		await Register(driver, validUser);
	});
	beforeEach(async() => {
		await driver.get('https://parabank.parasoft.com/parabank/updateprofile.htm');
	});
	after(async () => {
		await Logout(driver);
		await ResetDB(driver);
		await driver.quit();
	});

	it('No change', async () => {
		let newInfo = {
			fName: validUser.fName,
			lName: validUser.lName,
			address: validUser.address,
			city: validUser.city,
			state: validUser.state,
			zipCode: validUser.zipCode,
			phone: validUser.phone
		};
		await UpdateInfoSuccess(driver, newInfo);
	});
	it('Remove all user info', async () => {
		let newInfo = {
			fName: '',
			lName: '',
			address: '',
			city: '',
			state: '',
			zipCode: '',
			phone: ''
		};
		await UpdateInfoFail(driver, newInfo);
	});
	it('Remove first and last name', async () => {
		let newInfo = {
			fName: '',
			lName: '',
			address: validUser.address,
			city: validUser.city,
			state: validUser.state,
			zipCode: validUser.zipCode,
			phone: validUser.phone
		};
		await UpdateInfoFail(driver, newInfo);
	});
	it('Remove phone number', async () => {
		let newInfo = {
			fName: validUser.fName,
			lName: validUser.lName,
			address: validUser.address,
			city: validUser.city,
			state: validUser.state,
			zipCode: validUser.zipCode,
			phone: ''
		};
		await UpdateInfoSuccess(driver, newInfo);
	});
	it('Change first and last name', async () => {
		let newInfo = {
			fName: 'Pero',
			lName: 'Peric',
			address: validUser.address,
			city: validUser.city,
			state: validUser.state,
			zipCode: validUser.zipCode,
			phone: validUser.phone
		};
		await UpdateInfoSuccess(driver, newInfo);
	});
	it('Change state', async () => {
		let newInfo = {
			fName: validUser.fName,
			lName: validUser.lName,
			address: validUser.address,
			city: validUser.city,
			state: 'Slovenija',
			zipCode: validUser.zipCode,
			phone: validUser.phone
		};
		await UpdateInfoSuccess(driver, newInfo);
	});
});


/*
##############################
##### Selenium functions #####
##############################
*/

async function UpdateInfoFail(driver, newInfo) {
	try {
		await driver.findElement(By.name('customer.firstName')).sendKeys(newInfo.fName);
		await driver.findElement(By.name('customer.lastName')).sendKeys(newInfo.lName);
		await driver.findElement(By.name('customer.address.street')).sendKeys(newInfo.address);
		await driver.findElement(By.name('customer.address.city')).sendKeys(newInfo.city);
		await driver.findElement(By.name('customer.address.state')).sendKeys(newInfo.state);
		await driver.findElement(By.name('customer.address.zipCode')).sendKeys(newInfo.zipCode);
		await driver.findElement(By.name('customer.phoneNumber')).sendKeys(newInfo.phone);
		let submit = await driver.findElement(By.xpath('/html/body/div[1]/div[3]/div[2]/div/div[1]/form/table/tbody/tr[8]/td[2]/input'));
		await submit.click();
		await driver.wait(until.elementLocated(By.className('error')), 5000);
	}
	catch(err) {
		new assert.AssertionError(err.message);
	}
}

async function UpdateInfoSuccess(driver, newInfo) {
	try {
		await driver.findElement(By.name('customer.firstName')).sendKeys(newInfo.fName);
		await driver.findElement(By.name('customer.lastName')).sendKeys(newInfo.lName);
		await driver.findElement(By.name('customer.address.street')).sendKeys(newInfo.address);
		await driver.findElement(By.name('customer.address.city')).sendKeys(newInfo.city);
		await driver.findElement(By.name('customer.address.state')).sendKeys(newInfo.state);
		await driver.findElement(By.name('customer.address.zipCode')).sendKeys(newInfo.zipCode);
		await driver.findElement(By.name('customer.phoneNumber')).sendKeys(newInfo.phone);
		let submit = await driver.findElement(By.xpath('/html/body/div[1]/div[3]/div[2]/div/div[1]/form/table/tbody/tr[8]/td[2]/input'));
		await submit.click(); //
		await submit.click(); // Doesn't want to click the button if there is only one submit.click()
		await submit.click(); //
		await driver.wait(until.elementIsVisible(driver.findElement(By.id('updateProfileResult'))), 5000);
		let result = await driver.findElement(By.xpath('/html/body/div[1]/div[3]/div[2]/div/div[2]/h1'));
		await assert.equal(await result.getText(), 'Profile Updated');
	}
	catch(err) {
		new assert.AssertionError(err.message);
	}
}

async function Register(driver, user) {
	try {
		await driver.get('https://parabank.parasoft.com/parabank/register.htm');
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
	}
	catch(err) {
		console.log(err.message);
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
