const { Builder, By, Key, until } = require('selenium-webdriver');
const { describe, it, before, beforeEach, after } = require('node:test');
const assert = require('assert');
const { browser } = require('../settings');
const { validUser, nonExistingUser, noPhoneNumberUser, emptyUser } = require('../testdata');


/*
##############################
########### Tests ############
##############################
*/

describe('Pay bill', (t) => {
	var driver;

	before(async () => {
		driver = await new Builder().forBrowser(browser).build();
		await Setup(driver);
		await Register(driver, validUser);
	});
	beforeEach(async() => {
		await driver.get('https://parabank.parasoft.com/parabank/billpay.htm');
	});
	after(async () => {
		await Logout(driver);
		await ResetDB(driver);
		await driver.quit();
	});

	it('Pay a $20 bill with correct bill info', async () => {
		let billInfo = {
			payee: nonExistingUser.fName,
			address: nonExistingUser.address,
			city: nonExistingUser.city,
			state: nonExistingUser.state,
			zipCode: nonExistingUser.zipCode,
			phone: nonExistingUser.phone,
			account: '12345',
			accountConfirm: '12345'
		};
		await PayBillSuccess(driver, billInfo, 20);
	});
	it('Pay a $0 bill with correct bill info', async () => {
		let billInfo = {
			payee: nonExistingUser.fName,
			address: nonExistingUser.address,
			city: nonExistingUser.city,
			state: nonExistingUser.state,
			zipCode: nonExistingUser.zipCode,
			phone: nonExistingUser.phone,
			account: '12345',
			accountConfirm: '12345'
		};
		await PayBillSuccess(driver, billInfo, 0);
	});
	it('Pay a $-20 bill with correct bill info', async () => {
		let billInfo = {
			payee: nonExistingUser.fName,
			address: nonExistingUser.address,
			city: nonExistingUser.city,
			state: nonExistingUser.state,
			zipCode: nonExistingUser.zipCode,
			phone: nonExistingUser.phone,
			account: '12345',
			accountConfirm: '12345'
		};
		await PayBillFailed(driver, billInfo, -20);
	});
	it('Pay a $20 bill with mismatching account numbers', async () => {
		let billInfo = {
			payee: nonExistingUser.fName,
			address: nonExistingUser.address,
			city: nonExistingUser.city,
			state: nonExistingUser.state,
			zipCode: nonExistingUser.zipCode,
			phone: nonExistingUser.phone,
			account: '12345',
			accountConfirm: '54321'
		};
		await PayBillFailed(driver, billInfo, 20);
	});
	it('Pay a $20 bill without account numbers', async () => {
		let billInfo = {
			payee: nonExistingUser.fName,
			address: nonExistingUser.address,
			city: nonExistingUser.city,
			state: nonExistingUser.state,
			zipCode: nonExistingUser.zipCode,
			phone: nonExistingUser.phone,
			account: '',
			accountConfirm: ''
		};
		await PayBillFailed(driver, billInfo, 20);
	});
	it('Pay a $20 bill without bill info', async () => {
		let billInfo = {
			payee: emptyUser.fName,
			address: emptyUser.address,
			city: emptyUser.city,
			state: emptyUser.state,
			zipCode: emptyUser.zipCode,
			phone: emptyUser.phone,
			account: '',
			accountConfirm: ''
		};
		await PayBillFailed(driver, billInfo, 20);
	});
	it('Pay a $20 bill without payee info', async () => {
		let billInfo = {
			payee: emptyUser.fName,
			address: emptyUser.address,
			city: emptyUser.city,
			state: emptyUser.state,
			zipCode: emptyUser.zipCode,
			phone: emptyUser.phone,
			account: '12345',
			accountConfirm: '12345'
		};
		await PayBillFailed(driver, billInfo, 20);
	});
	it('Pay a $20 bill without a phone number', async () => {
		let billInfo = {
			payee: noPhoneNumberUser.fName,
			address: noPhoneNumberUser.address,
			city: noPhoneNumberUser.city,
			state: noPhoneNumberUser.state,
			zipCode: noPhoneNumberUser.zipCode,
			phone: noPhoneNumberUser.phone,
			account: '98765',
			accountConfirm: '98765'
		};
		await PayBillFailed(driver, billInfo, 20);
	});
	it('Pay a $1000000 (dont have that much in account) with correct bill info', async () => {
		let billInfo = {
			payee: nonExistingUser.fName,
			address: nonExistingUser.address,
			city: nonExistingUser.city,
			state: nonExistingUser.state,
			zipCode: nonExistingUser.zipCode,
			phone: nonExistingUser.phone,
			account: '12345',
			accountConfirm: '12345'
		};
		await PayBillSuccess(driver, billInfo, 1000000);
	});
});


/*
##############################
##### Selenium functions #####
##############################
*/

async function PayBillFailed(driver, billInfo, amount) {
	try {
		await driver.findElement(By.name('payee.name')).sendKeys(billInfo.payee);
		await driver.findElement(By.name('payee.address.street')).sendKeys(billInfo.address);
		await driver.findElement(By.name('payee.address.city')).sendKeys(billInfo.city);
		await driver.findElement(By.name('payee.address.state')).sendKeys(billInfo.state);
		await driver.findElement(By.name('payee.address.zipCode')).sendKeys(billInfo.zipCode);
		await driver.findElement(By.name('payee.phoneNumber')).sendKeys(billInfo.phone);
		await driver.findElement(By.name('payee.accountNumber')).sendKeys(billInfo.account);
		await driver.findElement(By.name('verifyAccount')).sendKeys(billInfo.accountConfirm);
		await driver.findElement(By.name('amount')).sendKeys(amount);
		let submit = await driver.findElement(By.xpath('/html/body/div[1]/div[3]/div[2]/div/div[1]/form/table/tbody/tr[14]/td[2]/input'));
		await submit.click();
		await driver.wait(until.elementLocated(By.className('error')), 5000);
	}
	catch(err) {
		new assert.AssertionError(err.message);
	}
}

async function PayBillSuccess(driver, billInfo, amount) {
	try {
		await driver.findElement(By.name('payee.name')).sendKeys(billInfo.payee);
		await driver.findElement(By.name('payee.address.street')).sendKeys(billInfo.address);
		await driver.findElement(By.name('payee.address.city')).sendKeys(billInfo.city);
		await driver.findElement(By.name('payee.address.state')).sendKeys(billInfo.state);
		await driver.findElement(By.name('payee.address.zipCode')).sendKeys(billInfo.zipCode);
		await driver.findElement(By.name('payee.phoneNumber')).sendKeys(billInfo.phone);
		await driver.findElement(By.name('payee.accountNumber')).sendKeys(billInfo.account);
		await driver.findElement(By.name('verifyAccount')).sendKeys(billInfo.accountConfirm);
		await driver.findElement(By.name('amount')).sendKeys(amount);
		let submit = await driver.findElement(By.xpath('/html/body/div[1]/div[3]/div[2]/div/div[1]/form/table/tbody/tr[14]/td[2]/input'));
		await submit.click();
		await driver.wait(until.elementIsVisible(await driver.findElement(By.id('billpayResult'))), 5000);
		let result = await driver.findElement(By.xpath('/html/body/div[1]/div[3]/div[2]/div/div[2]/h1'));
		await assert.equal(await result.getText(), 'Bill Payment Complete');
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
