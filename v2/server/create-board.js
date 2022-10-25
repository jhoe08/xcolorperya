const createBoard = (size) => {

  var numSquares = 3;

  const generateRandomColors = () => {
    var arr = []
    for (var i = 0; i < numSquares; i++) {
      arr.push(randomColor())
    }
    return arr;
  }

  const generateRandomNumbers = ([...arr]) => {
    let m = arr.length;
    while (m) {
      const i = Math.floor(Math.random() * m--);
      [arr[m], arr[i]] = [arr[i], arr[m]];
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
    generateRandomNumbers,
    clear
  }
};

module.exports = createBoard;
