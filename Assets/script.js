// function gets a users leagues and displays them as clickable buttons to navigate
// to the dashboard page.
function getLeagues () {
  var userName = $('#user-name').val();
  var userURL = 'https://api.sleeper.app/v1/user/' + userName;
  // fetch call retrieves the userID for a given username
  fetch(userURL)
  .then(function(response) {
    return response.json();
  })
  .then(function(info) {
    var userID = info.user_id;
    localStorage.setItem('user_id', JSON.stringify(userID));
    var season = moment().format('YYYY'); 
    var leaguesURL = "https://api.sleeper.app/v1/user/" + userID + "/leagues/nfl/" + season;
    // fetch call retrieves the leagues a given userID has for a given season
    // function then prints the leagues to the page
    fetch(leaguesURL) 
    .then(function(response) {
      return response.json();
    })
    .then(function(info) {
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
        // navigates to the dasboard page based on the league button that is clicked
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

// Click events to retrieve leagues on submission of username
$('#continue').on('click', getLeagues);
$('#continue').on('click', getRecentUser);

// Execute a click button function when the user presses 'Enter' on the keyboard
$('#user-name').on("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    $("#continue").click();
  }
});

// Local Storage saving recently submitted username
var userName = document.getElementById("user-name")
function getRecentUser() {
  var userNameValue = document.getElementById("user-name").value
  localStorage.setItem("recent_user", userNameValue)
}

// Local Storage retrieving recently submitted username to prefill input field on reload of page
function recentUser() {
  var recentUser = localStorage.getItem("recent_user")
  userName.textContent = recentUser.replaceAll('"','');
}
recentUser()