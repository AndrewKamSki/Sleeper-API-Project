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
  var playersURL = 'https://api.sleeper.app/v1/players/nfl';
  fetch(playersURL)
  .then(function(response) {
    return response.json();
  })
  .then(function(info) {
    console.log(info)
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
      console.log(info)
    })
  }
}

function init () {

  getLeagueInfo();
}

init()