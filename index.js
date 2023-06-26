//HTML Elements
const player1 = document.querySelector("#player1");
const player1Img = document.querySelector("#player1Img");
const player2 = document.querySelector("#player2");
const player2Img = document.querySelector("#player2Img");
const winner = document.querySelector("#winner");
const winnerImg = document.querySelector("#winnerImg");
const bestOf = document.querySelector("#bestOf");
const bestOfImg = document.querySelector("#bestOfImg");
const addButtom = document.querySelector('#confirmGame');
const gamesTable = document.getElementById('gamesTable');
const scoreBoard = document.getElementById('scoreBoard');
const tableTemplate = document.querySelector('.tableTemplate');
const scoreBarsTemplate = document.querySelector('.scoreBarsTemplate');
const ratioChart = document.querySelector('#myChartRatio');
const scoreChart = document.querySelector('#myChartScore');
const scoreBarButton = document.querySelector('#scoreBars');
const scoreButton = document.querySelector('#scoreChart');
const ratioButton = document.querySelector('#ratioChart');
const statPhotos = document.querySelector('.statPhotos');


//Consts
const playerList = ['Usuário', 'Rui', 'UmDois', 'Rugrats', 'Cebolo', 'Freio', 'Burns', 'Jureg', 'Polpinho', 'Enjoado', 'Triota', 'Spagueti'];
const bestOfList = ['1', '3', '5', '7'];

//Vars

var savedData;
var df_compare;
var xValues;
var playersArray;


//Input Player1
function changePlayer1Img () {
    const value = player1.value;
    if (playerList.includes(value)) {
        player1Img.style.setProperty('opacity', '1');
        player1Img.style.setProperty('background-image', `url(../assets/${value}.jpg)`);
        player1.style.setProperty('outline', 'solid blue 2px');
    }
    else {
        player1Img.style.setProperty('opacity', '0');
        player1.style.setProperty('outline', 'solid red 2px');
    }
    if (value == '') {
        player1.style.setProperty('outline', 'solid red 0');
    }
}
player1.addEventListener('input', changePlayer1Img);

// //Input Player2
function changePlayer2Img () {
    const value = player2.value;
    if (playerList.includes(value)) {
        player2Img.style.setProperty('opacity', '1');
        player2Img.style.setProperty('background-image', `url(../assets/${value}.jpg)`);
        player2.style.setProperty('outline', 'solid blue 2px');
    }
    else {
        player2Img.style.setProperty('opacity', '0');
        player2.style.setProperty('outline', 'solid red 2px');
    }
    if (value == '') {
        player2.style.setProperty('outline', 'solid red 0');
    }
}
player2.addEventListener('input', changePlayer2Img);

// //Input Winner
function changeWinnerImg () {
    const value = winner.value;
    if (playerList.includes(value) && (value == player2.value || value == player1.value) ) {
        winnerImg.style.setProperty('opacity', '1');
        winnerImg.style.setProperty('background-image', `url(../assets/${value}.jpg)`);
        winner.style.setProperty('outline', 'solid blue 2px');
    }
    else {
        winnerImg.style.setProperty('opacity', '0');
        winner.style.setProperty('outline', 'solid red 2px');
    }
    if (value == '') {
        winner.style.setProperty('outline', 'solid red 0');
    }
}
winner.addEventListener('input', changeWinnerImg);

// //Input Best Of
function changeBestOfImg () {
    const value = bestOf.value;
    if (bestOfList.includes(value)) {
        bestOfImg.style.setProperty('opacity', '1');
        // bestOfImg.style.setProperty('background-color', 'purple');
        bestOfImg.innerHTML = `${value}`
        bestOf.style.setProperty('outline', 'solid blue 2px');
        switch (value) {
            case '1':
                bestOfImg.style.setProperty('background-color', '#CD7F32');
                break;
            case '3':
                bestOfImg.style.setProperty('background-color', '#C0C0C0');
                break;
            case '5':
                bestOfImg.style.setProperty('background-color', '#FFD700');
                break;
            case '7':
                bestOfImg.style.setProperty('background-color', '#353535');
                break;
        }
    }
    else {
        bestOfImg.style.setProperty('opacity', '0');
        bestOf.style.setProperty('outline', 'solid red 2px');
    }
    if (value == '') {
        bestOf.style.setProperty('outline', 'solid red 0');
    }
    if (playerList.includes(player1.value) && playerList.includes(player2.value) && playerList.includes(winner.value) && bestOfList.includes(bestOf.value)) {
        addButtom.style.setProperty('transform', 'scale(1.2)');
        addButtom.style.setProperty('-webkit-box-shadow', '0px 0px 28px 15px');
    }
}
bestOf.addEventListener('input', changeBestOfImg);

// //Add Button handler
addButtom.addEventListener('click', function() {
    if (playerList.includes(player1.value) && playerList.includes(player2.value) && playerList.includes(winner.value) && bestOfList.includes(bestOf.value)) {
      addRow();
      addButtom.style.backgroundColor = 'white';
      player1.value = '';
      player1Img.style.setProperty('opacity', '0');
      player2.value = '';
      player2Img.style.setProperty('opacity', '0');
      winner.value = '';
      winnerImg.style.setProperty('opacity', '0');
      bestOf.value = '';
      bestOfImg.style.setProperty('opacity', '0');
      while (tableTemplate.firstChild) {
        tableTemplate.removeChild(tableTemplate.firstChild);
      }
      addTable();
      addScoreBoard();  ////duplicate this for the graphs
      setTimeout(function() {
        addButtom.style.setProperty('scale', '0');
        addButtom.style.backgroundColor = ''; // Set the background color back to its original value
      }, 500); // Wait for 0.5 seconds (500ms) before changing the background color back
      setTimeout(function() {
        addButtom.style.setProperty('scale', '1');
      }, 1500);
    }
  });

//On load extract dataframe
window.onload = async function() {
  savedData =  await getData();
  df_compare = scoreboard(savedData);

  addTable();
  addScoreBoard();
  displayScoreBars(df_compare);
  plotCharts();
  placeStatPhotos(savedData);
  statPlayerSelection();
};

//Tables
function addTable() {
  const table = document.createElement('table');
  table.classList.add('table');
  const caption = document.createElement('caption');
  caption.innerHTML = "Tabela de Jogos";
  const tHead = document.createElement('thead');
  const trHead = document.createElement('tr');
  for (let i = 0; i < Object.keys(savedData[0]).length; i++) {
      const headerElement = document.createElement('td');
      headerElement.innerHTML = `${Object.keys(savedData[0])[i]}`
      trHead.appendChild(headerElement);
  }
  tHead.appendChild(trHead);
  const tBody = document.createElement('tbody');
  for (let i = 0; i < Object.values(savedData).length; i++) {
      const trBody = document.createElement('tr');
      for (let j = 0; j < Object.keys(savedData[0]).length; j++) {
          const bodyElement = document.createElement('td');
          bodyElement.innerHTML = `${Object.values(savedData[i])[j]}`;
          trBody.appendChild(bodyElement);
      }
      tBody.appendChild(trBody);
  }
  table.appendChild(caption);
  table.appendChild(tHead);
  table.appendChild(tBody);
  tableTemplate.appendChild(table);

  //document.body.appendChild(tableTemplate);
}

function addScoreBoard () {
  const table = document.createElement('table');
  table.classList.add('hiddenTable');
  table.classList.add('table');
  const caption = document.createElement('caption');
  caption.innerHTML = "Score Board";
  const tHead = document.createElement('thead');
  const trHead = document.createElement('tr');
  for (let i = 0; i < Object.keys(df_compare[0]).length; i++) {
      const headerElement = document.createElement('td');
      headerElement.innerHTML = `${Object.keys(df_compare[0])[i]}`
      trHead.appendChild(headerElement);
  }
  tHead.appendChild(trHead);
  const tBody = document.createElement('tbody');
  for (let i = 0; i < Object.values(df_compare).length; i++) {
      const trBody = document.createElement('tr');
      for (let j = 0; j < Object.keys(df_compare[0]).length; j++) {
          const bodyElement = document.createElement('td');
          bodyElement.innerHTML = `${Object.values(df_compare[i])[j]}`;
          trBody.appendChild(bodyElement);
      }
      tBody.appendChild(trBody);
  }
  table.appendChild(caption);
  table.appendChild(tHead);
  table.appendChild(tBody);
  tableTemplate.appendChild(table);  
};

// //Add Row Function
function addRow() {
    // Create a new row object
    var newRow = {
        'Players': `('${player1.value}', '${player2.value}')`,
        'Winner': `${winner.value}`,
        'Best Of': `${bestOf.value}`,
        'Time Stamp': `${Math.floor(savedData.length/5 + 1)}`
    };
    fetch('http://localhost:3000/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        savedData: newRow
      }),
    }).then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text();
    }).catch((error) => {
        console.error('There has been a problem with your fetch operation:', error);
      });
};

// //Score Board Function
function scoreboard(data_frame) {
    var df = data_frame;
    var tuples = [...new Set(df.map(row => row['Players']))];
    var players = new Set();
    tuples.forEach(function(tpl) {
        var names = tpl.match(/'([^']+)'/g).map(name => name.slice(1, -1));
        names.forEach(function(name) {
            players.add(name);
        });
    });
    players = Array.from(players);
    var players_dict = {};
    players.forEach(function(player) {
        var results = WLRatio(player,data_frame);
        if (!(player in players_dict)) {
            players_dict[player] = results;
        }
    });

    var df_compare = Object.values(players_dict).map(function(results) {
        return { 'Player': results[0], 'Ratio': results[1], 'Wins': results[2], 'Number of Games': results[3] };
    });
    df_compare.forEach(function(row) {
        row['Score'] = row['Ratio'] * (row['Number of Games'] + (row['Wins'] * 10) / (row['Number of Games'] * 0.09));
        row['Ratio'] = row['Ratio'].toFixed(2);
        row['Score'] = row['Score'].toFixed(2);
    });
    df_compare.sort(function(a, b) {
        if (a['Score'] !== b['Score']) {
            return b['Score'] - a['Score'];
        } else if (a['Ratio'] !== b['Ratio']) {
            return b['Ratio'] - a['Ratio'];
        } else if (a['Wins'] !== b['Wins']) {
            return b['Wins'] - a['Wins'];
        } else {
            return b['Number of Games'] - a['Number of Games'];
        }
    });
    return df_compare;
}

// //Score Board with the Time Stamps and GameData separated by Time Stamp
function scoreboard_ts (data_frame) {
    var time_stamps = [...new Set(data_frame.map(row => row['Time Stamp']))];
    var dfs_compare_by_time_stamp = {};
    var dfs_by_time_stamp = {};
    time_stamps.forEach(function(ts) {
        var df_by_ts = data_frame.filter(row => row['Time Stamp'] == ts);
        if (ts > 1) {
            dfs_by_time_stamp[ts] = [...df_by_ts, ...dfs_by_time_stamp[ts - 1]];
        }
        else {
            dfs_by_time_stamp[ts] = df_by_ts;
        }
        var df_compare_ts = scoreboard(dfs_by_time_stamp[ts]);
        dfs_compare_by_time_stamp[ts] = df_compare_ts;
    });    
    return [dfs_compare_by_time_stamp, dfs_by_time_stamp];
};

//Chart
function plotCharts(){
  xValues = [...Array(Object.keys(scoreboard_ts(savedData)[0]).length + 1).keys()];

  let datasetsRatio = [];
  let datasetsScore = [];

  for (let i = 0; i < playerList.length; i++) {
    let player = playerList[i];
    let dataset = {
      label: player,
      data: getChartRatio(player),
      borderColor: getRandomColor(),
      fill: false
    };
    datasetsRatio.push(dataset);
  }

  for (let i = 0; i < playerList.length; i++) {
      let player = playerList[i];
      let dataset = {
        label: player,
        data: getChartScore(player),
        borderColor: getRandomColor(),
        fill: false
      };
      datasetsScore.push(dataset);
  }

  new Chart("myChartRatio", {
    type: "line",
    data: {
      labels: xValues,
      datasets: datasetsRatio
    },
    options: {
      legend: {display: true}
    }
  });

  new Chart("myChartScore", {
      type: "line",
      data: {
        labels: xValues,
        datasets: datasetsScore.map(dataset => ({
          ...dataset,
          tension: 0, // Set tension to 0 to create straight lines
        })),
      },
      options: {
        legend: {display: true},
        transitions: {
          show: {
            animations: {
              x: {
                from: 0
              },
              y: {
                from: 0
              }
            }
          },
          hide: {
            animations: {
              x: {
                to: 0
              },
              y: {
                to: 0
              }
            }
              }
          }
      }
    });
}

//Get Ratio data to chart
function getChartRatio(player) {
  const [dfs_compare_by_time_stamp, dfs_by_time_stamp] = scoreboard_ts(savedData);
  var list = [];
  var minLen = Object.keys(dfs_by_time_stamp).length;
  for (let i = 1; i <= Object.keys(dfs_by_time_stamp).length; i++) {
    list.push(
      ...dfs_compare_by_time_stamp[i]
        .filter((item) => item.Player === player)
        .map((item) => item.Ratio)
    );
  }

  // Fill with zeros at the beginning until the list length matches the minimum length
  while (list.length < minLen) {
    list.unshift(0);
  }
  return list;
};

//Get Score data to chart
function getChartScore(player) {
  const dfs_by_time_stamp = scoreboard_ts(savedData)[1];
  const dfs_compare_by_time_stamp = scoreboard_ts(savedData)[0];
  var list = [];
  var minLen = Object.keys(dfs_by_time_stamp).length;
  for (let i = 1; i <= Object.keys(dfs_by_time_stamp).length; i++) {
    list.push(
      ...dfs_compare_by_time_stamp[i]
        .filter((item) => item.Player === player)
        .map((item) => item.Score)
    );
  }

  // Fill with zeros at the beginning until the list length matches the minimum length
  while (list.length < minLen) {
    list.unshift(0);
  }

  return list;
};

//Get random colors to Chart
function getRandomColor() {
  let letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}


//Win Loss Ratio Funtion
function WLRatio(player, df, verbose = false) {
    var total_games = df.filter(function(row) {
        return row['Players'].includes(player);
    }).length;

    var total_wins = df.filter(function(row) {
        return row['Winner'] === player;
    }).length;

    var ratio = total_wins / total_games;

    if (verbose) {
        console.log(`Player: ${player}`);
        console.log(`Win/Lose Ratio: ${ratio * 100}%`);
        console.log(`Number of Games: ${total_games}`);
        console.log(`Number of wins: ${total_wins}`);
        console.log(`Number of Losses: ${total_games - total_wins}`);
    }

    return [player, ratio, total_wins, total_games];
};

// // //Display Score Bars Function
function displayScoreBars(df_compare) {
    var maxScore = df_compare[0]['Score'];
  
    df_compare.forEach(function(row, index) {
      var playerName = row['Player'];
      var score = row['Score'];
      var width = (score / maxScore) * 80 + 'vw';
  
      var barElement = document.createElement('div');
      barElement.classList.add('score-bar');
      barElement.style.width = width;
      barElement.innerHTML = `${score}`;
  
      var labelElement = document.createElement('div');
      labelElement.classList.add('score-label');
      labelElement.style.backgroundImage = `url(../assets/${playerName}.jpg)`;

      var positionElement = document.createElement('div');
      positionElement.classList.add('score-position');
      positionElement.innerHTML = index + 1;
  
      var containerElement = document.createElement('div');
      containerElement.classList.add('score-container');
      containerElement.appendChild(positionElement);
      containerElement.appendChild(barElement);
      containerElement.appendChild(labelElement);
  
      scoreBarsTemplate.appendChild(containerElement);
    });
};
  
// Function to save the data
function saveData() {
    localStorage.setItem('DataFrame', JSON.stringify(savedData));
};

// Attach the saveData function to the onbeforeunload event
window.onbeforeunload = function() {
    saveData();
};


// // //Tables togle
gamesTable.addEventListener('click', function() {
    document.querySelectorAll('.table')[0].classList.remove('hiddenTable');
    document.querySelectorAll('.table')[1].classList.add('hiddenTable');
});
  
scoreBoard.addEventListener('click', function() {
    document.querySelectorAll('.table')[1].classList.remove('hiddenTable');
    document.querySelectorAll('.table')[0].classList.add('hiddenTable');   
});

scoreBarButton.addEventListener('click', function() {
    ratioChart.classList.add('hiddenTable');
    scoreChart.classList.add('hiddenTable');
    scoreBarsTemplate.classList.remove('hiddenTable');
});
  
scoreButton.addEventListener('click', function() {
    ratioChart.classList.add('hiddenTable');
    scoreChart.classList.remove('hiddenTable');
    scoreBarsTemplate.classList.add('hiddenTable');
});

ratioButton.addEventListener('click', function() {
    ratioChart.classList.remove('hiddenTable');
    scoreChart.classList.add('hiddenTable');
    scoreBarsTemplate.classList.add('hiddenTable');
});

//Place Player Photo for statistical template

function placeStatPhotos(data_frame) {
  var df = data_frame;
  var tuples = [...new Set(df.map(row => row['Players']))];
  var players = new Set();
  tuples.forEach(function(tpl) {
    var names = tpl.match(/'([^']+)'/g).map(name => name.slice(1, -1));
    names.forEach(function(name) {
        players.add(name);
    });
  });
  playersArray = Array.from(players);
  playersArray.sort();
  playersArray.forEach(function (player){
    const blob = document.createElement('div');
    blob.classList.add('statPhoto');
    blob.style.setProperty('background-image', `url(../assets/${player}.jpg)`);
    statPhotos.appendChild(blob);
  })
}

//Stats Player Selection

function statPlayerSelection() {
  const photos = document.querySelectorAll('.statPhoto');
  const selectedPhotos = [];

  photos.forEach(function(photo) {
    photo.addEventListener('click', function() {
      if (!selectedPhotos.includes(photo)) {
        selectedPhotos.push(photo);
        photo.style.filter = 'none';
      } else {
        selectedPhotos.splice(selectedPhotos.indexOf(photo), 1);
        photos.forEach(function(otherPhoto) {
          if (!selectedPhotos.includes(otherPhoto)) {
            otherPhoto.style.filter = 'blur(2px)';
          }
        });
      }
    });
  });
}


//Getting the data from the database.db

async function getData() {
  const response = await fetch('http://localhost:3000/data');
  const data = await response.json();
  savedData = data;
  console.log(savedData);
  return savedData
}

