function loadIDs () {
  var userID = JSON.parse(localStorage.getItem('user_id'));
  var leagueID = JSON.parse(localStorage.getItem('league_id'));
  //console.log(userID);
  //console.log(leagueID);
  return {userID,leagueID}
}

function getLeagueInfo () {
  var ids = loadIDs();
  var userID = ids.userID;
  var leagueID = ids.leagueID;

  // Get Players Fetch
  var playersURL = 'https://api.sleeper.app/v1/players/nfl';
  fetch(playersURL)
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    //console.log(data)
    var players = [];
    for(var key in data) {
      var player = {
        playerID: data[key].player_id,
        position: data[key].position,
        name: data[key].full_name
      }
      players.push(player)
    }
    //console.log(players)

    // Get Rosters Fetch
    var rostersURL = 'https://api.sleeper.app/v1/league/' + leagueID + '/rosters'
    fetch(rostersURL)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      for(var i=0; i<data.length; i++){
        if (userID == data[i].owner_id) {
          // Entire Roster
          var teamIDs = data[i].players;
          for (var j=0; j<teamIDs.length; j++) {
            for (var k=0; k<players.length; k++) {
              if (teamIDs[j] == players[k].playerID) {
                //console.log(players[k].name)
              }
            }
          }
          // Team Starters
          var starterIDs = data[i].starters
          for (var j=0; j<starterIDs.length; j++) {
            for (var k=0; k<players.length; k++) {
              if (starterIDs[j] == players[k].playerID) {
                // console.log(players[k].name)
                var positionEl = document.createElement('h4');
                positionEl.classList.add("font-weight-bold", "p-1", "pl-3")
                positionEl.textContent = players[k].position + ': ';
                var playerEl = document.createElement('span');
                playerEl.classList.add("font-weight-normal")
                playerEl.textContent = players[k].name;
                playerEl.id = players[k].playerID;
                //playerEl.name = player[k].position;
                positionEl.append(playerEl)
                $('#starters').append(positionEl)
              }
            }
          }
        }
      }
    })
  })

  // Display League Name on Dashboard
  var leagueURL = 'https://api.sleeper.app/v1/league/' + leagueID;
  fetch(leagueURL)
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    var leagueName = data.name;
    $('#league-name').text(leagueName);
    $('#league-name-bottom').text(leagueName + "'s Recent Trades");
    // console.log(data)
  })

  var leagueUsersURL = 'https://api.sleeper.app/v1/league/' + leagueID + '/users';
  fetch(leagueUsersURL)
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    //console.log(data)
    teams = [];
    for(var i=0; i<data.length; i++) {
      team = {
        playerName: data[i].display_name,
        playerID: data[i].user_id,
        teamName: data[i].metadata.team_name
      }
      if (team.teamName == undefined) {
        team.teamName = data[i].display_name + "'s Team";
      }
      teams.push(team);
    }
    //console.log(teams)
    var tableEl = document.createElement("table");
    tableEl.classList.add("col-12")
    var tableHeadersEl = document.createElement("thead")
    var tableRowEl = document.createElement("tr")
    var teamNameEl = document.createElement("th")
    teamNameEl.classList.add("col", "text-medium-lg", "col-8", "text-center", "font-weight-bolder", "white-border", "bg-secondary")
    teamNameEl.textContent = "Team Name";
    var ownerEl = document.createElement("th")
    ownerEl.scope = "col";
    ownerEl.textContent = "Owner";
    ownerEl.classList.add("text-medium-lg", "col-4", "text-center", "font-weight-bolder", "white-border", "bg-secondary")
    tableRowEl.append(teamNameEl, ownerEl);
    tableHeadersEl.append(tableRowEl);
    tableEl.append(tableHeadersEl);
    var bodyEl = document.createElement("tbody");
    for (var i=0; i<teams.length; i++) {
      var tableRowEl = document.createElement("tr")
      var teamNameEl = document.createElement("td")
      teamNameEl.classList.add("p-1", "text-small", "pl-3", "white-border", "bg-dark")
      var ownerNameEl = document.createElement("td")
      ownerNameEl.classList.add("p-1", "text-small", "pl-3", "white-border", "bg-dark")
      teamNameEl.textContent = teams[i].teamName;
      ownerNameEl.textContent = teams[i].playerName;
      tableRowEl.id = teams[i].playerID;
      tableRowEl.append(teamNameEl, ownerNameEl)
      bodyEl.append(tableRowEl)
    }
    tableEl.append(bodyEl)
    $('#teams').append(tableEl) 
  })


  // Transactions Info Fetch for Weeks 0 - 17
  var playersURL = 'https://api.sleeper.app/v1/players/nfl';
  fetch(playersURL)
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    //console.log(data)
    var players = [];
    for(var key in data) {
      var player = {
        playerID: data[key].player_id,
        position: data[key].position,
        name: data[key].full_name
      }
      players.push(player)
    }
    //console.log(players)
    var weeks = 2;
    var trades = [];
    for (var i=1; i<weeks; i++) {
      var transactionsURL = 'https://api.sleeper.app/v1/league/' + leagueID + '/transactions/' + [i];
      fetch(transactionsURL)
      .then(function(response) {
        return response.json();
      })
      .then(function(info) {
        //console.log(info)
        for(var j=0; j<info.length; j++) {
          if (info[j].type === 'trade') {
            var trade = {
              playersAdded: info[j].adds,
              user1: info[j].consenter_ids[0],
              user2: info[j].consenter_ids[1],
              picks: info[j].draft_picks
            }
            for (var k=0; k<players.length; k++) {
              for (var playerID in info[j].adds) {
                if (playerID == players[k].playerID) {
                  trade.playersAdded[playerID] = [players[k].name, trade.playersAdded[playerID]];
                }
              }
            }
            trades.push(trade);
          }
        }
        // console.log('trades')
        // console.log(trades);
        // Populating the trades
        var tableEl = document.createElement("table");
        tableEl.classList.add("table", "table-bordered", "text-white")
        var tableHeadersEl = document.createElement("thead")
        var tableRowEl = document.createElement("tr")
        var side1El = document.createElement("th")
        side1El.classList.add("col-6", "text-center", "font-weight-bolder", "text-medium-lg")
        side1El.textContent = "Side 1 Receives";
        var side2El = document.createElement("th")
        side2El.classList.add("col-6", "text-center", "font-weight-bolder", "text-medium-lg");
        side2El.textContent = "Side 2 Receives";
        tableRowEl.append(side1El,side2El);
        tableHeadersEl.append(tableRowEl);
        tableEl.append(tableHeadersEl);
        var bodyEl = document.createElement("tbody");
        for (var i=0; i<5; i++) {
          var tableRowEl = document.createElement("tr")
          var user1El = document.createElement("td")
          var user2El = document.createElement("td")
          for (var player in trades[i].playersAdded) {
            // players involved in trade for user1
            console.log(trades[i].playersAdded[player][0])
            if (trades[i].playersAdded[player][1] == trades[i].user1) {
              if (user1El.textContent !== undefined) {
                user1El.innerHTML = user1El.textContent + '<br>' + trades[i].playersAdded[player][0];
              } else {
                user1El.innerHTML = trades[i].playersAdded[player][0];
                
              }
            }
            // players involved in trade for user2
            if (trades[i].playersAdded[player][1] == trades[i].user2) {
              if (user2El.textContent !== undefined) {
                user2El.innerHTML = user2El.textContent + '<br>' + trades[i].playersAdded[player][0];
              } else {
                user2El.innerHTML = trades[i].playersAdded[player][0];
              }
            }
          }
          for (var pick in trades[i].picks) {
            // picks involved in trade for user1
            if (trades[i].picks[pick].owner_id == trades[i].user1) {
              if (user1El.textContent !== undefined) {
                user1El.innerHTML = user1El.textContent + '<br>' + trades[i].picks[pick].season + ' Round ' + trades[i].picks[pick].round + ' pick';
              } else {
                user1El.innerHTML = trades[i].picks[pick].season + ' Round ' + trades[i].picks[pick].round + ' pick';
              }
            }
            // picks involved in trade for user2
            if (trades[i].picks[pick].owner_id == trades[i].user2) {
              if (user2El.textContent !== undefined) {
                user2El.innerHTML = user2El.textContent + '<br>' + trades[i].picks[pick].season + ' Round ' + trades[i].picks[pick].round + ' pick';
              } else {
                user2El.innerHTML = trades[i].picks[pick].season + ' Round ' + trades[i].picks[pick].round + ' pick';
              }
            }
          }
          tableRowEl.append(user1El, user2El)
          bodyEl.append(tableRowEl)
        }
        tableEl.append(bodyEl)
        $('#trades').append(tableEl)
      })
    }
  })
}

function init () {

  getLeagueInfo();
}
init()

// Set user's username as starter team header
function showUserName() {
  var userNameHeader = document.getElementById("username")
  var localUserName = localStorage.getItem("recent_user")
  if (localUserName === null) {
    userNameHeader.textContent = "No User Found"
    return;
  } else {
    userNameHeader.textContent = localUserName + "'s Starters"
  }
}
showUserName()
