// Assigns top header the current username
var userNameLocal = localStorage.getItem("recent_user")
var headerTitle = document.getElementById("team-title")
headerTitle.textContent = userNameLocal + "'s Roster"

// loads in the saved IDs
function loadIDs () {
  var userID = JSON.parse(localStorage.getItem('user_id'));
  var leagueID = JSON.parse(localStorage.getItem('league_id'));
  return {userID,leagueID};
}

// Function to get team roster
// Exact same as starting roster fetch, but instead pulls entire roster
function getTeamRoster () {
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
    console.log(data[1])
    var players = [];
    for(var key in data) {
      var player = {
        playerID: data[key].player_id,
        position: data[key].position,
        name: data[key].full_name,
        age: data[key].age,
        height: (Math.floor(data[key].height/12)) + "'" + data[key].height%12 + '"',
        weight: data[key].weight,
        experience: data[key].years_exp
      }
      players.push(player)
    }

    // Get Rosters Fetch
    var rostersURL = 'https://api.sleeper.app/v1/league/' + leagueID + '/rosters'
    fetch(rostersURL)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      var tbodyEl = document.createElement('tbody')
      for(var i=0; i<data.length; i++){
        if (userID == data[i].owner_id) {
          // Entire Roster
          var teamIDs = data[i].players;
          for (var j=0; j<teamIDs.length; j++) {
            for (var k=0; k<players.length; k++) {
              if (teamIDs[j] == players[k].playerID) {
                console.log(players[k].position)
                var rowEl = document.createElement('tr')
                var posEl = document.createElement('td');
                var nameEl = document.createElement('td')
                var expEl = document.createElement('td')
                var ageEl = document.createElement('td')
                var heightEl = document.createElement('td')
                var weightEl = document.createElement('td')
                posEl.textContent = players[k].position;
                console.log(posEl)
                nameEl.textContent = players[k].name;
                expEl.textContent = players[k].experience;
                ageEl.textContent = players[k].age;
                heightEl.textContent = players[k].height;
                weightEl.textContent = players[k].weight;
                rowEl.append(posEl, nameEl, expEl, ageEl, heightEl, weightEl)
                tbodyEl.append(rowEl)
              }
            }
          }
        }
      }
      $('#roster-table').append(tbodyEl)
    })
  })
}

function init () {
  getTeamRoster();
}
init()
