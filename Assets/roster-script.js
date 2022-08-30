var userNameLocal = localStorage.getItem("Recent User")
var headerTitle = document.getElementById("team-title")

headerTitle.textContent = userNameLocal + "'s Roster"