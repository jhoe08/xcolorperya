(() => {  
  const socket = io();

  const isClient = window.location.pathname == '/' ? true : false;
  let betsLimit = 5;

  console.log( socket )
  const appDiv = document.querySelector('#app')
  const doors = document.querySelectorAll('.door')
  const boardsDiv = document.querySelector('.boards')
  const boards = document.querySelectorAll('.board')
  let inprogress = false;

  const socketId = socket.id;

  const spinnerDiv = document.querySelector('#spinner')
  const reseterDiv = document.querySelector('#reseter')

  if( !isClient ) {    
    spinnerDiv.addEventListener('click', function(){
      socket.emit('spinHandlerv2')    
    })
    reseterDiv.addEventListener('click', function(){
      socket.emit('resetHandler')
    })
  } else {
    spinnerDiv.remove()
    reseterDiv.remove()
  }

  socket.emit('user connected', (data)=>{
    return socket.id
  })

  // instead of spin, suffle, results, reset
  // then suffle, spin, results, reset
  // init(false, 1, 2);
  socket.on('spinHandlerResults', function(lists) {
    spin(lists)
  })

  socket.on('resetReceiver', function(data) {
    init()
  })

  socket.on('loadBoard', function(data){
    let boards = document.querySelector('.boards')
    boards.innerHTML = '';
    data.forEach((element, index) => {
      let board = document.createElement('div')
        board.classList.add('board')
        board.innerHTML = element
        boards.appendChild(board)        
      board.addEventListener('click', function(){
        if(!inprogress){          
          if(board.classList.contains('selected')){
            board.classList.remove('selected')
            socket.emit('receiveBettorBets',{
              'socketId': socket.id,
              // 'user': 'Yawa',
              'option': 'remove',
              'item': element
            })
            betsLimit++;
          } else {
            if(betsLimit > 0) {
              board.classList.add('selected')
              socket.emit('receiveBettorBets',{
                'socketId': socket.id,
                // 'user': 'Yawa',
                'option': 'add',
                'item': element
              })
            } else {
              return
            }
            betsLimit--;
          }
        }
      })
    })
  })

  socket.on('loadLives', function(data){
    socket.emit('livesHandler', [socket.id, data])
    let credits = document.querySelector('.credits')
    credits.innerHTML = ''
    data.forEach((life, index) => {
      let live = document.createElement('span')
      live.innerHTML = life;//credits
      credits.appendChild(live)
    })
  })

  socket.on('overLives', function(){
    appDiv.remove()
    const gameOverDiv = document.querySelector('.game-over')
    gameOverDiv.classList.remove('hidden')
  })

  /** initialize - DO NOT TOUCH **/
  function init(firstInit = true, groups = 1, duration = 1, lists=[]) {

    inprogress = false;
    boardsDiv.classList.remove('disabled')
    spinnerDiv.style.display = 'block'
    reseterDiv.style.display = 'none'

    // for (const door of doors) {
    doors.forEach((door, index) => {
      if (firstInit) {
        door.dataset.spinned = '0';
      } else if (door.dataset.spinned === '1') {
        return;
      }
  
      const boxes = door.querySelector('.boxes');
      const boxesClone = boxes.cloneNode(false);
      
      let pool = '❓';
      if (!firstInit) {

        pool = [pool].concat(lists[index])

        boxesClone.addEventListener(
          'transitionstart',
          function () {
            door.dataset.spinned = '1';
            this.querySelectorAll('.box').forEach((box) => {
              box.style.filter = 'blur(1px)';
            });
          },
          { once: true }
        );
  
        boxesClone.addEventListener(
          'transitionend',
          function () {
            this.querySelectorAll('.box').forEach((box, index) => {
              box.style.filter = 'blur(0)';
              if (index > 0) this.removeChild(box);
            });
          },
          { once: true }
        );
      }
  
      for (let i = pool.length - 1; i >= 0; i--) {
        const box = document.createElement('div');
        box.classList.add('box');
        box.style.width = door.clientWidth + 'px';
        box.style.height = door.clientHeight + 'px';
        box.textContent = pool[i];
        // box.innerHTML = pool[i];
        boxesClone.appendChild(box);
        if(i == pool.length - 1 && pool.length - 1 != 0) {
          box.classList.add('pulse');
        }
      }

      boxesClone.style.transitionDuration = `${duration > 0 ? duration : 1}s`;
      boxesClone.style.transform = `translateY(-${door.clientHeight * (pool.length - 1)}px)`;
      door.replaceChild(boxesClone, boxes);
    // }
    })
  }

  async function spin(data) {    
    init(false, 1, 2, data);
    
    inprogress = true;
    boardsDiv.classList.add('disabled')
    spinnerDiv.style.display = 'none'
    reseterDiv.style.display = 'block'

    for (const door of doors) {
      const boxes = door.querySelector('.boxes');
      const duration = parseInt(boxes.style.transitionDuration);
      boxes.style.transform = 'translateY(0)';
      await new Promise((resolve) => setTimeout(resolve, duration * 100));
    }
  }

  init()  
  /** endof - DO NOT TOUCH  **/

})();
