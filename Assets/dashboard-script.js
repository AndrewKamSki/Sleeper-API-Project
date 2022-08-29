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
    var players = [];
    for(var key in data) {
      var player = {
        playerID: data[key].player_id,
        position: data[key].position,
        name: data[key].full_name
      }
      players.push(player)
    }
    console.log(players)

    // Get Rosters Fetch
    var rostersURL = 'https://api.sleeper.app/v1/league/' + leagueID + '/rosters'
    fetch(rostersURL)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      for(var i=0; i<data.length; i++){
        if (userID == data[i].owner_id) {
          var teamIDs = data[i].players;
          for (var j=0; j<teamIDs.length; j++) {
            for (var k=0; k<players.length; k++) {
              if (teamIDs[j] == players[k].playerID) {
                console.log(players[k].name)
              }
            }
          }
        }
      }
    })
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
      //console.log(info)
    })
  }
}

function init () {

  getLeagueInfo();
}

init()