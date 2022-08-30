function loadIDs () {
  var userID = JSON.parse(localStorage.getItem('user_id'));
  var leagueID = JSON.parse(localStorage.getItem('league_id'));
  console.log(userID);
  console.log(leagueID);
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

  var rostersURL = 'https://api.sleeper.app/v1/league/' + leagueID + '/rosters'
  fetch(rostersURL)
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    console.log(data)
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
    //console.log(data)
  })

  var leagueUsersURL = 'https://api.sleeper.app/v1/league/' + leagueID + '/users';
  fetch(leagueUsersURL)
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    console.log(data)
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
    console.log(teams)
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
  var weeks = 17;
  for (var i=0; i<weeks; i++) {
    var transactionsURL = 'https://api.sleeper.app/v1/league/' + leagueID + '/transactions/' + [i];
    fetch(transactionsURL)
    .then(function(response) {
      return response.json();
    })
    .then(function(info) {
      var trades = [];
      for(var j=0; j<info.length; j++) {
        if(info[j].type === 'trade') {
          var trade = {
            playersAdded: info[j].adds,
            playersDropped: info[j].drops,
            users: info[j].consenter_ids,
            picks: info[j].draft_picks
          }
          trades.push(trade);
        }

      }
      //console.log(trades);
    })
  }
}

function init () {

  getLeagueInfo();
}
init()

// Set user's username as starter team header
function starterUserName() {
  var userNameHeader = document.getElementById("username")
  var localUserName = localStorage.getItem("recent_user")
  if (localUserName === null) {
    userNameHeader.textContent = "No Starters Found"
    return;
  } else {
    userNameHeader.textContent = localUserName + "'s Starters"
  }
}
starterUserName()
