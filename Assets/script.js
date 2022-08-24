var userName = "komestat";
var userURL = 'https://api.sleeper.app/v1/user/' + userName;
fetch(userURL)
  .then(function(response) {
    return response.json();
  })
  .then(function(info) {
    console.log(info)
    var userID = info.user_id;
    console.log(userID);
    var season = '2021'; // possible input value?
    var leaguesURL = "https://api.sleeper.app/v1/user/" + userID + "/leagues/nfl/" + season;
    console.log(leaguesURL)
    fetch(leaguesURL) 
    .then(function(response) {
      return response.json();
    })
    .then(function(info) {
      console.log(info[0].name)
    })
  })

