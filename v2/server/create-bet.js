const createBet = () => {

  var numBets = 2;
  var colors = ['yellow', 'white', 'pink', 'blue', 'red', 'green', 'black'];

  let mapBettors= [];
  let intersection = 0;
  let credits = 20;

  const isWinning0 = (selectedColors, bettorsColors) => {    

    let mapBettorsColors = []
    // map color index to value
    for (let index = 0; index < bettorsColors.length; index++) {      
      mapBettorsColors.push( colors[bettorsColors[index]] ) ;      
    }   
    
    console.log('mapBettorsColors', mapBettorsColors)
    console.log('selectedColors', selectedColors.bettings)
    // console.log('Object.values(data)',Object.values(selectedColors)) // [ 'Salamander', [ 'green', 'red', 'yellow' ] ]
    // return false
  }

  const isWinning = (data) => {
    // console.log('create-bet-data', data )
    
    let mapBettorsColors = []
    // map color index to value
    for (let index = 0; index < data.bets.length; index++) {      
      mapBettorsColors.push( colors[data.bets[index]] ) ;      
    } 

    if( data.data.bettings ) {
      intersection = mapBettorsColors.filter( element => data.data.bettings.includes(element));
    } else {
      intersection = [];
    }
    
    // console.log('intersection', intersection.length )

    // mapBettors.push
    data.wins = intersection.length;

    return data
  }

  const combinedItems = (array) => {
    var output = [];
    array.forEach(function(item) {
      var existing = output.filter(function(v, i) {
        return v.name == item.name;
      });
      if (existing.length) {
        var existingIndex = output.indexOf(existing[0]);
        output[existingIndex].value = output[existingIndex].value.concat(item.value);
      } else {
        if (typeof item.value == 'string')
          item.value = [item.value];
        output.push(item);
      }
    });
    return output;
  }

  return {
    isWinning,
    combinedItems
  }
};

module.exports = createBet;
