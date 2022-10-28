const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const createBoard = require('./create-board');
const createBet = require('./create-bet');
const { Socket } = require('dgram');
const e = require('express');

var router1 = express.Router();
var router2 = express.Router();


const app = express();
const clientPath = `${__dirname}/../client`;

console.log(`serving static from ${clientPath}`);

router1.get('/', function(req, res, next){
  res.end();
})
router2.get('/admin', function(req, res, next){
  res.end();
})

app.use('/', express.static(clientPath));
app.use('/admin', express.static(clientPath));

const server = http.createServer(app);
const io = socketio(server);

let { generateRandomColors, generateRandomNumbers, clear } = createBoard();
let { isWinning, combinedItems } = createBet();

let no_users = 0;
let connectedUserMap = new Map();

let bettors = {};

/** users **/
// let users = []

let users = {}

/** lives **/
let lives = ['❤️','❤️','❤️','❤️','❤️'];


io.on('connection', async (socket) => {
  const {
    address
  } = socket.handshake;
  // console.log(address.address, address.port);
  
  var clientIpAddress= socket.request.socket.remoteAddress;
  // console.log(clientIpAddress)

  socket.on("error", (err) => {
    if (err && err.message === "unauthorized event") {
      socket.disconnect();
    }
  });

  /**
   * 
   * */
  let connectedUserId = socket.id;
  connectedUserMap.set(socket.id, { ip: clientIpAddress, status:'online', name:'none'});

  socket.join(socket.io)

  // console.log('bettors',bettors);

  socket.on('recieveUserName', function(data){
    //do something
    let user = connectedUserMap.get(connectedUserId);
    user.name = data.name;

    // console.log('recieveUserName', user)
  });
  /**
   * 
   * */

  socket.on('showUser', (data) => {
    no_users++;
    io.emit('countUsers', no_users);
  });

  
  // 
  let arr = [];
  socket.on('spinHandler', () => {
    let rc = generateRandomColors();
    

    
    io.emit('spinReceiver', rc);
    // send to client the results
    // betWin(rc)
    for (let index = 0; index < 3; index++) {
      arr.push( generateRandomNumbers([1,2,3,4,5,6]));
    }
    
    io.emit('shuffleReciever', arr);

    console.log('spinHandler', arr)
    // reset after sending the data
    arr = []
  })

  /**
   * bettors
   * **/
  socket.on('resetBettors', function(data){
    return bettors = {}
  })

  socket.on('recieveBettors', function(data){
    let user = connectedUserMap.get(connectedUserId);

    // bettors.push({...data})
    let username = data.username;
    let bettings = data.bettings;
    
    bettors[username] = bettings // working but display is { username: [bettings] }
    // bettors['username'] = username 
    // bettors['bettings'] = bettings

    console.log('server-recieveBettors', bettors)

    io.emit('recieveBettors', bettors)
  })

  socket.on('checkBets', function(data, bets){
    let user = connectedUserMap.get(connectedUserId);

    let checking = {data, bets};    
    let check = isWinning(checking)

    // console.log('check', check)

    user.wins = check.wins;
    if( check.wins ) {
      user.bets = true;
      // alert('You wins')
      // console.log('you win')
      io.emit('betsWin', true);
      io.to(socket.id).emit('wins')
    } else {
      // console.log('you lose')
      user.bets = false
      io.emit('betsWin', false);
      io.to(socket.id).emit('lose')
    }

    

    // console.log('user', user )

  })  


  /**
   * endof bettors
   * **/

  // console.log(`a user ${color} connected`);  
  socket.on('disconnect', (data) => {    
    // /get access to the user currently being used via map.
    let user = connectedUserMap.get(connectedUserId);
    user.status = 'offline';

    // count how many users disconnected
    no_users--;
    io.emit('countUsers', no_users);
  });



  /**
   * VERSION 2
   * */

    const items = ['🍭','❌','⛄️','🦄','🍌','💩','👻','😻','💵','🤡','🦖','🍎','🏆','👽','🤑','❤️','☠️','💦','♎','👀']
    let itemsResults = []
    let userItems = []
    
    var address2 = socket.handshake.address;
    // console.log('New connection from ' + address.address + ':' + address.port);
    // socket.on('user connected', (socketId)=>{
    //   let temp = pushObjectItem(users, socketId, ['lives', lives])
    //   console.log( socketId )
    //   return temp
    // })
    
    io.to(socket.id).emit('loadBoard', items)    
    io.to(socket.id).emit('loadLives', lives)
    socket.on('livesHandler', (args)=>{
      pushObjectItem(users, args[0], ['lives', args[1]] )
    })

  /**
   * GLOBAL FUNCTIONS
   * **/

  const pushArrayItem = (arr, item) => {
    return (arr.indexOf(item) == -1) ? arr.push(item) : false
  }  

  const removeArrayItem = (arr, item) => {
    for( var i = 0; i < arr.length; i++){                                    
      if ( arr[i] == item) { 
          arr.splice(i, 1); 
          i--; 
      }
    }
    return arr;
  }
  
  // pushObjectItem(users, args.socketId, ['items', userItems])
  const pushObjectItem = (arr, index, item) => {
    if(typeof item === 'object') {
      let key = item[0]
      let value = item[1]
      
      if(arr[index]){
        arr[index][key] = value
      } else {
        if(key=='items') arr[index] = { 'items': value }
        else if(key=='lives') arr[index] = { 'lives': value }
      }
      
    } else if(typeof item === 'array') {
      arr[index] = item
    }
    
    // console.log('arr', arr)
    return arr 
  }

  const removeObjectItem = (arr, index, args) => {
    if(args[0]==='items'){
      let items = arr[index]['items']
      removeArrayItem(items, args[1])
    } else if(args[0]==='lives'){
      let lives = arr[index]['lives']
      lives.pop()
    }   
    return arr;
  }

  const checkItem_x = (item1, item2) => {
  // console.log('item2', item2)

    for (const key in item2) {
      if (Object.hasOwnProperty.call(item2, key)) {        
        let filter = item1.filter( element => item2[key].includes(element))
        if( filter.length != 0 ) {
          console.log(`${key} is one of the winners`, filter)
        } else {
          // lives.pop()
          console.log(`${key} is one of the losers`, lives)
          // io.to(`${key}`).emit('loadLives', lives)
        }
      }
    }
  }

  const checkItem = (results, users) => {
    for (const user in users) {
      if (Object.hasOwnProperty.call(users, user)) {
        if( users[user]['items'] ) {
          let items = users[user]['items']
          let filter = results.filter( element => items.includes(element))
          if( filter.length != 0 ) {
            console.log(`${user} is one of the winners`, filter)
          } else {
            removeObjectItem(users, user, ['lives'])
            // console.log(`${user} is one of the losers`)
          }
        } else {
          removeObjectItem(users, user, ['lives'])
          // console.log(`${user} is one of the losers`)
        }
        // console.log(users[user]['lives'])
        io.to(user).emit('loadLives', users[user]['lives'])
      }
    }
  }

  const checkLives = () => {
    for (const user in users) {
      if (Object.hasOwnProperty.call(users, user)) {
        if( users[user]['lives'] ) {
          let items = users[user]['lives']
          if(items == 0){
            io.to(user).emit('overLives')
          }          
        }        
      }
    }
  }

  /**
   * endof GLOBAL FUNCTIONS 
   * **/
    
    socket.on('spinHandlerv2', () => {
      let arr = [];      
      for (let index = 0; index < 3; index++) {
        let rn = generateRandomNumbers( items )        
        arr.push( rn )
        itemsResults.push(rn[items.length-1])
      }      
      io.emit('spinHandlerResults', arr)      
      arr = []

      checkItem(itemsResults, users)
      checkLives()
    })

    socket.on('resetHandler', (data) => {
      io.emit('resetReceiver');
      // reset results
      itemsResults = []
    })





    socket.on('receiveBettorBets', (args) => {
      // console.log(args)
      let temp
      if(args.option=='add'){
        pushArrayItem(userItems, args.item)
        pushObjectItem(users, args.socketId, ['items', userItems])
      } 
      if(args.option=='remove') {        
        removeObjectItem( users, args.socketId, ['items', args.item] )
      }
      // console.log( 'temp', users )
    })

  /**
   * endof VERSION 2
   * */

});

server.on('error', (err) => {
  console.error('Server error:', err);
});

server.listen(8080, () => {
  console.log('Server started on 8080');
});
