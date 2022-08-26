function loadIDs () {
  var userID = JSON.parse(localStorage.getItem('user_id'));
  var leagueID = JSON.parse(localStorage.getItem('league_id'));
  console.log(userID);
  console.log(leagueID);
}

function getLeagueInfo () {
  // Player Info Fetch
  var playersURL = 'https://api.sleeper.app/v1/players/nfl';
  fetch(playersURL)
  .then(function(response) {
    return response.json();
  })
  .then(function(info) {
    console.log(info)
  })

  // Transactions Info Fetch
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
  loadIDs();
  getLeagueInfo();
}

init()