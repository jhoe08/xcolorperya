const createBoard = (size) => {

  var numSquares = 3;

  const generateRandomColors = () => {
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

  const clear = () => {    
    return false;
  };

  clear();
  return {
    generateRandomColors,
    clear
  }
};

module.exports = createBoard;
