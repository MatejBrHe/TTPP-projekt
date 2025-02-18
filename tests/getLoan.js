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

describe('Get a loan', (t) => {
	var driver;

	before(async () => {
		driver = await new Builder().forBrowser(browser).build();
		await Setup(driver);
		await Register(driver, validUser);
	});
	beforeEach(async() => {
		await driver.get('https://parabank.parasoft.com/parabank/requestloan.htm');
	});
	after(async () => {
		await Logout(driver);
		await ResetDB(driver);
		await driver.quit();
	});

	it('Get a $100 loan with $20 down payment', async () => {
		await GetLoanApproved(driver, 100, 20);
	});
	it('Get a $1000000 loan with $10000 down payment', async () => {
		await GetLoanDenied(driver, 1000000, 10000);
	});
	it('Get a $100 loan with $0 down payment', async () => {
		await GetLoanApproved(driver, 100, 0);
	});
	it('Get a $100 loan with $-20 down payment', async () => {
		await GetLoanDenied(driver, 100, -20);
	});
	it('Get a $-100 loan with $20 down payment', async () => {
		await GetLoanDenied(driver, -100, 20);
	});
	it('Get a $0 loan with $0 down payment', async () => {
		await GetLoanFailed(driver, 0, 0);
	});
});


/*
##############################
##### Selenium functions #####
##############################
*/

async function GetLoanDenied(driver, amount, downPayment) {
	try {
		await driver.findElement(By.id('amount')).sendKeys(amount);
		await driver.findElement(By.id('downPayment')).sendKeys(downPayment);
		let submit = await driver.findElement(By.xpath('/html/body/div[1]/div[3]/div[2]/div/div[1]/form/table/tbody/tr[4]/td[2]/input'));
		await submit.click();
		await driver.wait(until.elementIsVisible(driver.findElement(By.id('loanStatus'))), 5000);
		let result = await driver.findElement(By.id('loanStatus'));
		await assert.equal(await result.getText(), 'Denied');	
	}
	catch(err) {
		new assert.AssertionError(err.message);
	}
}

async function GetLoanApproved(driver, amount, downPayment) {
	try {
		await driver.findElement(By.id('amount')).sendKeys(amount);
		await driver.findElement(By.id('downPayment')).sendKeys(downPayment);
		let submit = await driver.findElement(By.xpath('/html/body/div[1]/div[3]/div[2]/div/div[1]/form/table/tbody/tr[4]/td[2]/input'));
		await submit.click();
		await driver.wait(until.elementIsVisible(driver.findElement(By.id('loanStatus'))), 5000);
		let result = await driver.findElement(By.id('loanStatus'));
		await assert.equal(await result.getText(), 'Approved');
	}
	catch(err) {
		new assert.AssertionError(err.message);
	}
}

async function GetLoanFailed(driver, amount, downPayment) {
	try {
		await driver.findElement(By.id('amount')).sendKeys(amount);
		await driver.findElement(By.id('downPayment')).sendKeys(downPayment);
		let submit = await driver.findElement(By.xpath('/html/body/div[1]/div[3]/div[2]/div/div[1]/form/table/tbody/tr[4]/td[2]/input'));
		await submit.click();
		await driver.wait(until.elementLocated(By.className('error')), 5000);
	}
	catch(err) {
		new assert.AssertionError(err.message);
	}
}

async function Setup(driver) {
	try {	
		await driver.get('https://parabank.parasoft.com/parabank/admin.htm');
		await driver.findElement(By.id('initialBalance')).sendKeys('1000');	
		await driver.findElement(By.id('minimumBalance')).sendKeys('50');
		await driver.findElement(By.id('loanProvider')).sendKeys('Web Service', Key.RETURN);	
		await driver.findElement(By.id('loanProcessor')).sendKeys('Available Funds', Key.RETURN);	
		await driver.findElement(By.id('loanProcessorThreshold')).sendKeys('20');
		await driver.findElement(By.xpath('/html/body/div[1]/div[3]/div[2]/form/input')).click();
	}
	catch(err) {
		console.log(err.message);
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
