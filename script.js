'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = (movements) => { 
  containerMovements.innerHTML = '' //inner html agrega um valor ao html.


  movements.forEach((mov, i) => { // usa o for each para gerar varios htmls e usa a função inserAdjacentHTML para inserir esses htmls gerados dentro da pagina.
    const type = mov > 0 ? 'deposit' : 'withdrawal'

    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__value">${mov}</div>
    </div>
    ` // para gerar o html usamos o template literals para passar variaveis e manipular o html e depois disparamos a função para inserir esse html.

    containerMovements.insertAdjacentHTML('afterbegin', html)

  })
}  
displayMovements(account1.movements)

///////////////////////////////////////////////// 
/////////////////////////////////////////////////
// LECTURES

//map
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

/////////////////////////////////////////////////

// map 
// Map retruns a new array containing the results of applying an operation on all original array elements.

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300]
const euroToUsd = 1.1

const movementsUSD = movements.map(mov => mov * euroToUsd)

const movementsDescriptions = movements.map((mov, i, arr) =>
`Movement ${i+1}: you ${mov > 0 ? 'deposited' : 'withdrew'} ${mov}` //ternary

/*   if(mov > 0){
  return `Movement ${i+1}: you deposited ${mov}`
  }else{
  return `Movement ${i+1}: You withdrew ${Math.abs(mov)}`
  } */)

console.log(movementsDescriptions)
// filter
// Filter returns a new array containing the array elements that passed a specifed test condition.

//reduce
// Reduce boils ("Reduces") all array elements down to one single value
