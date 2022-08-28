function getLeagues () {
  var userName = $('#user-name').val();
  var userURL = 'https://api.sleeper.app/v1/user/' + userName;
  fetch(userURL)
  .then(function(response) {
    return response.json();
  })
  .then(function(info) {
    //console.log(info)
    var userID = info.user_id;
    localStorage.setItem('user_id', JSON.stringify(userID));
    //console.log(userID);
    var season = moment().format('YYYY'); 
    //console.log(season)
    var leaguesURL = "https://api.sleeper.app/v1/user/" + userID + "/leagues/nfl/" + season;
    //console.log(leaguesURL)
    fetch(leaguesURL) 
    .then(function(response) {
      return response.json();
    })
    .then(function(info) {
      //console.log(info)
      //console.log(info[0].name)
      for (var i=0; i<info.length; i++) {
        var leagueEl = document.createElement("button");
        leagueEl.textContent = info[i].name;
        var leagueID = info[i].league_id;
        leagueEl.id = leagueID;
        leagueEl.onclick = function () {
          localStorage.setItem('league_id',JSON.stringify(this.id));
          var dashboardHTML = './dashboard.html';
          location.assign(dashboardHTML);
        }
        $('#main-card').append(leagueEl)
      }
    })
  })
}

$('#continue').on('click', getLeagues);