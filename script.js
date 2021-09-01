'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300]

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

const displayMovements = (movements, sort = false) => { 
  containerMovements.innerHTML = '' //inner html agrega um valor ao html.

  const movs = sort ? movements.slice().sort((a,b) => a - b) : movements

  movs.forEach((mov, i) => { // usa o for each para gerar varios htmls e usa a função inserAdjacentHTML para inserir esses htmls gerados dentro da pagina.
    const type = mov > 0 ? 'deposit' : 'withdrawal'

    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__value">${mov} EUR</div>
    </div>
    ` // para gerar o html usamos o template literals para passar variaveis e manipular o html e depois disparamos a função para inserir esse html.

    containerMovements.insertAdjacentHTML('afterbegin', html)
    
  })
}  

const createUserNames = (users) => {
  users.forEach(accounts => {
    accounts.username = accounts.owner.toLowerCase().split(' ').map(name => name[0]).join('')
  })
}

createUserNames(accounts)

const calcDisplayBalance = acc => {
  acc.balance = acc.movements.reduce((acc, mov) => {
   return acc + mov
  }, 0)
  labelBalance.textContent = `${acc.balance} EUR`
}

const calcDislaySummary = (acc) => {
  const incomes = acc.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0)
  labelSumIn.textContent = `${incomes} EUR`

  const out = acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0)
  labelSumOut.textContent = `${Math.abs(out)} EUR`

  const interest = acc.movements.filter(mov => mov > 0).map(deposit => deposit * acc.interestRate / 100).filter((int, i , arr) => int >= 1).reduce((acc, int) => acc + int, 0)
  labelSumInterest.textContent = `${interest} EUR`
}
 

const eurToUsd = 1.1
const totalDepositsUSD = movements.filter(mov => mov > 0).map(mov => mov * eurToUsd).reduce((acc, mov) => acc + mov, 0)

console.log(totalDepositsUSD)

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const updateUi = (acc) => {
     //Display Movements
     displayMovements(acc.movements)

     //Display Balance
     calcDisplayBalance(acc)
     
     //Display Sumary
     calcDislaySummary(acc)
}


let currentAccount;

btnLogin.addEventListener('click', (e) => {
  e.preventDefault()
  
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value)
  console.log(currentAccount)

  if(currentAccount?.pin === Number (inputLoginPin.value)) {
   // Clear input fields
   inputLoginUsername.value = inputLoginPin.value = ''
   inputLoginPin.blur()
   
    // Display UI and Message
    labelWelcome.textContent = `Welcome Back, ${currentAccount.owner.split(' ')[0]}`
    containerApp.style.opacity = 100

    updateUi(currentAccount)
  }
})

btnTransfer.addEventListener('click', (e) => {
  e.preventDefault()
  const amount = Number (inputTransferAmount.value)
  const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value)
  console.log(amount, receiverAcc)

  if(amount > 0 && receiverAcc && currentAccount.balance >= amount && receiverAcc?.username !== currentAccount.username) {
    currentAccount.movements.push(-amount)
    receiverAcc.movements.push(amount)
    updateUi(currentAccount)
    inputTransferTo.value = ''
    inputTransferAmount.value = ''
  }
})

btnLoan.addEventListener('click', function(e) {
  e.preventDefault()
  
  const amount = Number(inputLoanAmount.value)

  if(amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    currentAccount.movements.push(amount)
    updateUi(currentAccount)
  }
  inputLoanAmount.value = ''
})

btnClose.addEventListener('click', (e) => {
  e.preventDefault()
  if(inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin) {
    console.log('dispara')
    const index = accounts.findIndex(acc => acc.username === currentAccount.username) //return a single value wich mach inside the array and return the index of this array.
    accounts.splice(index, 1)
    containerApp.style.opacity = 0
  }
  inputClosePin.value = ''
  inputCloseUsername.value = ''
})

let sorted = false

btnSort.addEventListener('click', (e) => {
  e.preventDefault()
  displayMovements(currentAccount.movements, !sorted)
  sorted = !sorted //flipa a variavel sorted lá fora.
})


//MAP -> Loop inside the array like forEach but expect a callback wich will be the rule and all the elements will be afected by the rule.

//Filter -> Expect a callback func wich contains the rule to really do a filter inside the array and return the values who match.
const deposits = movements.filter(mov => {
  return mov > 0
})


const withdrawals = movements.filter(mov => {
  return mov < 0
})


//Reduce -> Acumulate all values expecting a callback wich can be passed the rule of the acumulating.

const balance = movements.reduce((acc, cur, i, arr) => { // Frist param is the acumulator. Is a snowboall who keep adding value. The second param is the initial value.
  return acc + cur
}, 1000) //initial value.

 

console.log(balance)

const max = movements.reduce((acc, mov) => {
  if(acc > mov) {
    return acc
  } else {
    return mov
  }
}, movements)

console.log(max)

//FIND -> Retrieve one element in the array based in one condition. Will return the frist element wich satisfy the condition. Doesent return one array. Can return one object, string or any value inside the array.
const fristWithdrawal = movements.find(mov => mov < 0)
console.log(movements)
console.log(fristWithdrawal)

console.log(accounts)
const account = accounts.find( acc => acc.owner === 'Jessica Davis')
console.log(account)
/////////////////////////////////////////////////

// Quando passamos um objeto como parametro e damos reasign value nele ele vai trocar na raiz do objeto asism conseguimos armazenas e alterar os objetos dentro das funções.

// Some Method
console.log(movements)
console.log(movements.includes(-130)) //Check equality

const anyDepositsEquality = movements.some(mov => mov === -130) // Check equality but we can specify condition
console.log(anyDepositsEquality)

const anyDeposits = movements.some(mov => mov > 5000) // Check equality but we can specify condition, return a boolean.
console.log(anyDeposits)

// Every Method
console.log(account4.movements.every(mov => mov > 0)) // Every only will return if the all values correspond the condition.

//Flat
const arr = [[1,2,3], [4,5,6], 7 ,8]

console.log(arr.flat()) // return a full array and remove the nested array.

const arrDeep = [[[1,2],3], [4,[5,6]], 7 ,8]
console.log(arrDeep.flat(2)) //The param é a camada que ele vai deeper, 1 uma camada de nesting 2 duas camadas de nesting arrays.

// const acountMovements = accounts.map(acc => acc.movements)
// console.log(acountMovements)
// const allMovements = acountMovements.flat()
// console.log(allMovements)
// const overallBalance = allMovements.reduce((acc, mov) => acc + mov, 0)
// console.log(overallBalance)

//Chaining
const overallBalance = accounts.map(acc => acc.movements).flat().reduce((acc, mov) => acc + mov, 0)
console.log(overallBalance)

//FlatMap
//FlatMap combines a map and the flat method is better for perfomance.
const overallBalance2 = accounts.flatMap(acc => acc.movements).reduce((acc, mov) => acc + mov, 0)
console.log(overallBalance2)

//Sorting Arrays

//Strings
const owners = ['Jonas', 'Zack', 'Adam', 'Martha']
console.log(owners.sort()) //Organiza o Array e muta o array atual
console.log(owners)

// Numbers
console.log(movements)
// console.log(movements.sort()) //Não organiza os numeros by default só arrays, ele converte os numeros em arrays e ordenas eles, basicamente ele ordena levando em consideração a primeira letra.

// return < 0, A, B (keep order    )
// return > 0 B, A (switch order)

//Ascending
// movements.sort((a, b) => { //A o valor atual e b o proximo valor.
//   if(a > b) {
//     return 1
//   }

//   if(b < a) {
//     return -1
//   }
// })

movements.sort((a,b) => a-b)
console.log(movements)

//Descending
// movements.sort((a, b) => { //A o valor atual e b o proximo valor.
  // if(b > a) {
    // return -1
  // }
// 
  // if(a < b) {
    // return 1
  // }
// 
// })

movements.sort((a,b) => b-a)

console.log(movements)

