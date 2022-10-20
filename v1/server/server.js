const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const createBoard = require('./create-board');
const createBet = require('./create-bet');
const { Socket } = require('dgram');
const e = require('express');


const app = express();
const clientPath = `${__dirname}/../client`;

console.log(`serving static from ${clientPath}`);

app.use(express.static(clientPath));

const server = http.createServer(app);
const io = socketio(server);

let { generateRandomColors, clear } = createBoard();
let { isWinning, combinedItems } = createBet();

let no_users = 0;
let connectedUserMap = new Map();

let bettors = {};


io.on('connection', async (socket) => {
  const {
    address
  } = socket.handshake;
  // console.log(address.address, address.port);
  
  var clientIpAddress= socket.request.socket.remoteAddress;
  // console.log(clientIpAddress)

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
  socket.on('spinHandler', () => {
    let rc = generateRandomColors();

    // console.log('spinHandler', rc)
    io.emit('spinReceiver', rc);
    // send to client the results
    // betWin(rc)
  })

  socket.on('resetHandler', (data) => {
    io.emit('resetReceiver');
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

    // console.log('server-recieveBettors', bettors)

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
      io.to(socket.id).emit('congratulations')
    } else {
      // console.log('you lose')
      user.bets = false
      io.emit('betsWin', false);
      io.to(socket.id).emit('loss')
    }

    

    console.log('user', user )

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

});

server.on('error', (err) => {
  console.error('Server error:', err);
});

server.listen(8080, () => {
  console.log('Server started on 8080');
});
