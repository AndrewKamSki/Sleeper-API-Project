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
        leagueEl.classList.add("bg-dark", "text-white", "p-2", "font-weight-bold")
        if (i === info.length-1) {
          leagueEl.setAttribute("style", "border-bottom-left-radius: 5px; border-bottom-right-radius: 5px")
          console.log("good")
        }
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
$('#continue').on('click', getRecentUser);


// Local Stoarge with user name

var userName = document.getElementById("user-name")
function getRecentUser() {
  var userNameValue = document.getElementById("user-name").val()
  localStorage.setItem("recent_user", userNameValue)
}

function recentUser() {
  userName.textContent = localStorage.getItem("recent_user")
}
recentUser()