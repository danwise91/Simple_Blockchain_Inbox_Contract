const assert = require('assert');
const ganache = require('ganache-cli');
//constructor function
const Web3 = require('web3');
//instance
const provider = ganache.provider();
const web3 = new Web3(provider);

const {interface, bytecode} = require('../compile');


let accounts;
let inbox;

beforeEach(async () => {
	//get a list of all accounts
	accounts = await web3.eth.getAccounts();
	//use one of those accounts to deploy the contract

	inbox = await new web3.eth.Contract(JSON.parse(interface))
		.deploy({data: bytecode, arguments: ['Hi there!']})
		.send({from: accounts[0], gas: '1000000'});

	inbox.setProvider(provider);
});

describe('Inbox', () => {
	it('deploys a contract', () =>{
		assert.ok(inbox.options.address);
	});
	//calling a method is simultanious so we need async to wait for the message property to come to us
	it('has a default message', async() => {
		//referencing the message property here not setMessage
		const message = await inbox.methods.message().call();
		//message has been assigned hi there in the beforeEach function
		assert.equal(message, "Hi there!");
	});

	it('can change the message', async () => {
		//send acts as send transaction and shows who is sending the transactions
		await inbox.methods.setMessage('bye').send({ from: accounts[0] });
		const message = await inbox.methods.message().call();
		assert.equal(message, 'bye');
	});
});

//mock tests
// class Car{
// 	park(){
// 		return 'stopped';
// 	}

// 	drive(){
// 		return 'vroom';
// 	}
// }

// let car;
// beforeEach(() => {
// 	car = new Car();
// });

// describe('Car', () => {
// 	it('can park', () =>{
// 		assert.equal(car.park(), 'stopped');
// 	});

// 	it('can drive', () => {
// 		assert.equal(car.drive(), 'vroom');
// 	});
// });