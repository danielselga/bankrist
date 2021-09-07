'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP



const movements = [200, 450, -400, 3000, -650, -130, 70, 1300]
// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2021-09-06T21:31:17.178Z',
    '2021-09-04T07:42:02.383Z',
    '2021-01-28T09:15:04.904Z',
    '2021-04-01T10:17:24.185Z',
    '2021-05-08T14:11:59.604Z',
    '2021-05-27T17:01:17.194Z',
    '2021-07-11T23:36:17.929Z',
    '2021-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];


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

//Functions 

const formatMovementDate = (date, locale) => {
  
  const calcDaysPassed = (date1, date2) => {
   return Math.round(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24))
  }

  const daysPassed = calcDaysPassed(new Date(), date)
  console.log(daysPassed)

  if(daysPassed === 0) {
    return 'Today'
  } else if (daysPassed === 1) {
    return 'Yesterday'
  } else if (daysPassed <= 7) {
    return `${daysPassed} days ago`
  } else {
    // const day = `${date.getDate()}`.padStart(2, 0)
    // const month = `${date.getMonth() + 1}`.padStart(2, 0)
    // const year = date.getFullYear()
    // return `${day}/${month}/${year}`

    return new Intl.DateTimeFormat(locale).format(date)
  } 
  
}

//Format Currency global func
const formatCur = (value, locale, currency) => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(value) 
}


const displayMovements = (acc, sort = false) => { 
  containerMovements.innerHTML = '' //inner html agrega um valor ao html.

  const movs = sort 
  ? acc.movements.slice().sort((a,b) => a - b) 
  : acc.movements

  movs.forEach((mov, i) => { // usa o for each para gerar varios htmls e usa a função inserAdjacentHTML para inserir esses htmls gerados dentro da pagina.
    const type = mov > 0 ? 'deposit' : 'withdrawal'

    const date = new Date(acc.movementsDates[i])
    
    const displayDate = formatMovementDate(date, acc.locale)
    
    const formattedMov = new Intl.NumberFormat(acc.locale, {
      style: 'currency',
      currency: `${acc.currency}`
    }).format(mov) 


    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${formattedMov}</div>
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

  labelBalance.textContent = `${formatCur(acc.balance, acc.locale, acc.currency)}`
}

const calcDislaySummary = (acc) => {
  const incomes = acc.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0)
  labelSumIn.textContent = `${formatCur(incomes, acc.locale, acc.currency)}`

  const out = acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0)
  labelSumOut.textContent = `${formatCur(incomes, acc.locale, acc.currency)}`

  const interest = acc.movements.filter(mov => mov > 0).map(deposit => deposit * acc.interestRate / 100).filter((int, i , arr) => int >= 1).reduce((acc, int) => acc + int, 0)
  labelSumInterest.textContent = `${formatCur(interest, acc.locale, acc.currency)}`
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
     displayMovements(acc)

     //Display Balance
     calcDisplayBalance(acc)
     
     //Display Sumary
     calcDislaySummary(acc)
}

const startLogOutTimer = () => {
  
  const tick = () => {
  const min = String(Math.trunc(time / 60)).padStart(2, 0)
  const sec = time % 60

  //In each call print the remaining time to ui
  labelTimer.textContent = `${min}:${sec}`

  
  //When 0 seconds, stop timer and logout user
  if(time === 0) {
    clearInterval(timer) // this function Will stop the timer
    labelWelcome.textContent = 'LogIn to get Started'
    containerApp.style.opacity = 0
  }

  //decrease 1s
  time--
}

// Set time to 5 minutes
  let time = 10
  
  //Call every second
  tick()
  const timer = setInterval(tick, 1000)
}



let currentAccount;

//FAKED AWAYS LOGGED IN
// currentAccount = account1
// updateUi(currentAccount)
// containerApp.style.opacity = 100;



// Experimenting with the API



btnLogin.addEventListener('click', (e) => {
  e.preventDefault()
  
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value)
  console.log(currentAccount)

  if(currentAccount?.pin === Number (inputLoginPin.value)) {
   
    //Create current date and time
   
    const now = new Date()

    const options  = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric', //numeric, 2-digit
      year: 'numeric',
      // weekday: 'long' //short 
    }
    
    // const local = navigator.language //browser local
    
    const local = currentAccount.locale

    labelDate.textContent = new Intl.DateTimeFormat(local, options).format(now)
    
    // const day = `${now.getDate()}`.padStart(2, 0)
    // const month = `${now.getMonth() + 1}`.padStart(2, 0)
    // const year = now.getFullYear()
    // const hour = `${now.getHours()}`.padStart(2, 0)
    // const min = `${now.getMinutes()}`.padStart(2, 0)
    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`
   
   
    // Clear input fields
   inputLoginUsername.value = inputLoginPin.value = ''
   inputLoginPin.blur()
   
    // Display UI and Message
    labelWelcome.textContent = `Welcome Back, ${currentAccount.owner.split(' ')[0]}`
    containerApp.style.opacity = 100

    startLogOutTimer()
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
    
    //Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString())
    receiverAcc.movementsDates.push(new Date().toISOString())

    updateUi(currentAccount)
    inputTransferTo.value = ''
    inputTransferAmount.value = ''
  }
})

btnLoan.addEventListener('click', function(e) {
  e.preventDefault()
  
  const amount = Math.floor(inputLoanAmount.value)

  if(amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {

    //Add loan date
    currentAccount.movementsDates.push(new Date().toISOString())
    
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
console.log(account2.movements.every(mov => mov > 0)) // Every only will return if the all values correspond the condition.

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

/////////////////////// Numbers ////

console.log(23 === 23.0) // integers and reals are the same.

console.log(0.1 + 0.2)
console.log(0.1 + 0.2 === 0.3)

//Conversion
console.log(Number('23'))
console.log(typeof +'23')

//Parsing
console.log(Number.parseInt('30px')) // will return 30, Int is for integers
console.log(Number.parseInt('e30px')) //parsing need to start with a number

console.log(Number.parseFloat('2.5rem')) //Float is for float numbers

console.log(Number.isNaN('20'))  //isNaN return true if is NaN

console.log(Number.isNaN(+'20X'))

console.log(Number.isNaN(23/0))
 
console.log(isFinite(23))

console.log(Math.sqrt(25)) //Raiz quadrada
console.log(25 ** (1/2))
console.log(8 ** (1/3)) //Raiz cubica

console.log(Math.max(5,18,23,11,2)) //Vai ternonar o maior valor passado na função.
console.log(Math.max(5,18,'23',11,2))

console.log(Math.min(5,18,'23',11,2)) //Vai ternonar o menor valor passado na função.

console.log(Math.PI * Number.parseFloat('10px') ** 2) //Calculando o raio.

console.log(Math.trunc(Math.random() * 6) + 1)

const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min) + 1) + min
}

console.log(randomInt(10, 20))

//Math Round
console.log(Math.round(23.3)) //Aredonda para o mais proximo
console.log(Math.round(23.5)) //Arredonda para o mais proximo

//Math Ceil
console.log(Math.ceil(23.3)) //Arredonda parar cima.
console.log(Math.ceil(23.9))

//Math floor
console.log(Math.floor(23.3)) //Arredonda parar baixo.
console.log(Math.floor(23.9)) 

console.log(Math.floor(-23.3)) //retorna 24 pois é negativo e -24 é menor que -23

//Rounding Decimals
console.log((2.7).toFixed(0))
console.log((2.7).toFixed(3))
console.log((2.345).toFixed(2))

// Remainder operator
console.log(5 % 2) //Retorna o resto da operação.
console.log(5/2) // 5 = 2 * 2 + 1 -> 1 e o reminder.

console.log(8%3)
console.log(8/3) // 8 * 3 + 2 -> 2 é o reminder.

console.log(6 % 2) // = 0
console.log(7 % 2) // 1

const isEven = n => n % 2 === 0
console.log(isEven(8))
console.log(isEven(23))
console.log(isEven(514));



labelBalance.addEventListener('click', () => {
  [...document.querySelectorAll('.movements__row')].forEach((row, i) => {
    if (i % 2 === 0) {
      row.style.backgroundColor = 'orangered'
    }
    if(i % 3 === 0) {
      row.style.backgroundColor = 'blue'
    }
  })
})

//Big int -> primitive value.
 console.log(45561651561561651651616516516502312316n) //BIg int representado usando o N no final do numero

 console.log(BigInt(45561651561561651651616516516502312316n))

 //Operations 
 console.log(10000n + 10000n)


//  //Create a date

// console.log(new Date('Aug 02 2020 18:05:41'))
// console.log(new Date('December 24, 2015'))

// console.log(new Date(account1.movementsDates[0]))

// console.log(new Date(2037, 10, 19, 15, 23, 5)) //10 will return november but november is the 11 moth this happens becouse month in js are 0 based
// console.log(new Date(2037, 10, 33)) // will correct to dec 3th

// console.log(new Date(0)) //Unix timestamp 
// console.log(new Date(3 * 24 * 60 * 60 * 1000)) //will return day 3 and this calculation is the timestamp

// //Working with dates
// const future = new Date(2037, 10, 19, 15, 23)
// console.log(future)
// console.log(future.getFullYear()) //will return the year
// console.log(future.getMonth()) //will return the month but zero based
// console.log(future.getDate()) //will return the date
// console.log(future.getDay()) //will return the position in the day heare is 4 considering sunday is 0
// console.log(future.getHours())
// console.log(future.getMinutes())
// console.log(future.getSeconds())
// console.log(future.toISOString()) //retorna o padrão global de tempo

// console.log(future.getTime()) //timestamp
// console.log(new Date(2142267780000))

// console.log(Date.now()) // return the now timestamp

// future.setFullYear(2040) //Will switch the year for 2024
// console.log(future)

setTimeout(() => {
  console.log('Heare is your pizza!')
}, 5000);