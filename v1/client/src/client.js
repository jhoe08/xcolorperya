var numSquares = 3;
var colors = ['yellow', 'white', 'pink', 'blue', 'red', 'green', 'black'];
var serverSquare = document.querySelectorAll("#server .square");
var clientSquare = document.querySelectorAll("#client .square");

const pickColor = () => {
  var random = Math.floor(Math.random() * colors.length);
  console.log( random );
  return colors[random];
}

const generateRandomColors = (numSquares) => {
  var arr = []
  for (var i = 0; i < numSquares; i++) {
    arr.push(randomColor())
  }
  return arr;
}
  
const randomColor = () => {
  var r = Math.floor(Math.random() * 6)  
  return r;
}

const loadColor = () => {
  for (var i = 0; i < colors.length-1; i++) {
    clientSquare[i].setAttribute('id', colors[i])
    clientSquare[i].style.background = colors[i];
  }
}

const spinColor = (reset=false) => {  
  reset ? black = colors.length - 1 : randomColors = generateRandomColors(numSquares);
  for (var i = 0; i < serverSquare.length; i++) {
    reset ? serverSquare[i].style.background =  colors[black] : 
    serverSquare[i].style.background = colors[randomColors[i]];
  }
}

const spinColor2 = (arr, reset=false) => {
  reset ? black = colors.length - 1 : randomColors = generateRandomColors(numSquares);
  for (var i = 0; i < serverSquare.length; i++) {
    reset ? serverSquare[i].style.background =  colors[black] : 
    serverSquare[i].style.background = colors[arr[i]];
  }
}

const clientResetSquare = () => {
  return clientSquare.forEach(element => element.classList.remove('selected'));
}

// totalCredits.addEventListener('change', function(){
//   alert('YAWWA')
// })

// function betsChange(el) {
//   console.log(el)
// }

const checkData = () => {
  let totalCredits = document.querySelector('[data-totalcredits]');

}

/**
 * Username
 * */
 const randomNameGenerator = () => {
    const animals = ["Aardvark","Albatross","Alligator","Alpaca","Ant","Anteater","Antelope","Ape","Armadillo","Donkey","Baboon","Badger","Barracuda","Bat","Bear","Beaver","Bee","Bison","Boar","Buffalo","Butterfly","Camel","Capybara","Caribou","Cassowary","Cat","Caterpillar","Cattle","Chamois","Cheetah","Chicken","Chimpanzee","Chinchilla","Chough","Clam","Cobra","Cockroach","Cod","Cormorant","Coyote","Crab","Crane","Crocodile","Crow","Curlew","Deer","Dinosaur","Dog","Dogfish","Dolphin","Dotterel","Dove","Dragonfly","Duck","Dugong","Dunlin","Eagle","Echidna","Eel","Eland","Elephant","Elk","Emu","Falcon","Ferret","Finch","Fish","Flamingo","Fly","Fox","Frog","Gaur","Gazelle","Gerbil","Giraffe","Gnat","Gnu","Goat","Goldfinch","Goldfish","Goose","Gorilla","Goshawk","Grasshopper","Grouse","Guanaco","Gull","Hamster","Hare","Hawk","Hedgehog","Heron","Herring","Hippopotamus","Hornet","Horse","Human","Hummingbird","Hyena","Ibex","Ibis","Jackal","Jaguar","Jay","Jellyfish","Kangaroo","Kingfisher","Koala","Kookabura","Kouprey","Kudu","Lapwing","Lark","Lemur","Leopard","Lion","Llama","Lobster","Locust","Loris","Louse","Lyrebird","Magpie","Mallard","Manatee","Mandrill","Mantis","Marten","Meerkat","Mink","Mole","Mongoose","Monkey","Moose","Mosquito","Mouse","Mule","Narwhal","Newt","Nightingale","Octopus","Okapi","Opossum","Oryx","Ostrich","Otter","Owl","Oyster","Panther","Parrot","Partridge","Peafowl","Pelican","Penguin","Pheasant","Pig","Pigeon","Pony","Porcupine","Porpoise","Quail","Quelea","Quetzal","Rabbit","Raccoon","Rail","Ram","Rat","Raven","Red deer","Red panda","Reindeer","Rhinoceros","Rook","Salamander","Salmon","Sand Dollar","Sandpiper","Sardine","Scorpion","Seahorse","Seal","Shark","Sheep","Shrew","Skunk","Snail","Snake","Sparrow","Spider","Spoonbill","Squid","Squirrel","Starling","Stingray","Stinkbug","Stork","Swallow","Swan","Tapir","Tarsier","Termite","Tiger","Toad","Trout","Turkey","Turtle","Viper","Vulture","Wallaby","Walrus","Wasp","Weasel","Whale","Wildcat","Wolf","Wolverine","Wombat","Woodcock","Woodpecker","Worm","Wren","Yak","Zebra"];

    return animals[Math.floor(Math.random() * animals.length)]
 };
 /**
 * endof Username
 **/

(() => {

  var socket = io();
 
  // init
  loadColor();

  var spinButton = document.querySelector("#spin");
  var resetButton = document.querySelector("#reset");
  let usernameText = document.querySelector("#username");

  let bettors = {};

  let username = randomNameGenerator();
  usernameText.innerHTML = username;

  const totalBets = 2;
  let bettings = [];

  let currentSpin = [];

  socket.emit('recieveUserName', {name: username});

  socket.on('spinReceiver', function(data){
    spinColor2(data)
    currentSpin = data;
    // create a function that match the results
    socket.emit('checkBets', bettors, currentSpin)
  })
  socket.on('resetReceiver', function(data){
    spinColor(true)
    clientResetSquare();
    bettings = [];
  })

  spinButton.addEventListener('click', function(){    
    socket.emit('spinHandler')    
  });
  resetButton.addEventListener('click', function(){
    socket.emit('resetHandler')
    socket.emit('resetBettors')
  });

  socket.emit('showUser');
  socket.on('countUsers', function(data){
    document.getElementById("userConnected").innerHTML = 'Online ' + data + ' users';
  });

  socket.on('betsWin', function(data){
    return data ? console.log('You Win!') : console.log('You Lose!')
  })  

/**
 * Bets, Bettings, Bettors, 
 * */
  
  // bettors.push(username);
  // colors[5] = { bettors: [...bettors] }
  // console.log(colors)

  // {monkey: ['yellow', 'red']}


  const addBets = (arr, color, handler) => {
    return arr[color]
  }
  const removeBets = (arr, color) => {
    for( var i = 0; i < arr.length; i++){                                    
      if ( arr[i] == color) { 
          arr.splice(i, 1); 
          i--; 
      }
    }
    return arr;
  }
  
  clientSquare.forEach(function(element, index){
    element.addEventListener('click', function(){
      let selected = element.classList.toggle('selected')
      let color = element.getAttribute('id')

      selected ? bettings.push(color) : removeBets(bettings, color)

      bettors = {username, bettings}
      socket.emit('recieveBettors', bettors)

    })
  })

  socket.on('recieveBettors', function(data){
    // bettors = data;
    console.log('client-recieveBettors', data)
  })
  
  socket.on('congratulations', function(data){
    console.log(data)
    alert('You Wins!!!');
  })

  socket.on('loss', function(data){
    console.log(data)
    alert('You Loss!!!');
  })

  let totalCredits = document.querySelector('[data-totalcredits]');
  let currentCredits = Number(totalCredits.getAttribute('data-totalcredits'))
  let bets = document.querySelectorAll('[data-bets]')

  bets.forEach(function(bet, i){
    bet.addEventListener('click', function(){
      bet.classList.toggle('selected')
      let dataBets = Number( bet.getAttribute('data-bets') )

      if( bet.classList.contains('selected') ){
        currentCredits -= dataBets
      } else {
        currentCredits += dataBets;
      }

      totalCredits.innerHTML = currentCredits;
      totalCredits.setAttribute( 'data-totalcredits', currentCredits)
     
      // console.log(currentCredits)
    })
  })




})();