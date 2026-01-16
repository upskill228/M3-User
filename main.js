var container = document.querySelector("#container");
var form = document.querySelector(".user-form");
var userName = document.querySelector("#userName");
var userEmail = document.querySelector("#userEmail");
var activeBtn = document.querySelector("#showActive");
var countUsersElement = document.querySelector("#countUsers");
//Class
var UserClass = /** @class */ (function () {
    function UserClass(id, name, email, active) {
        if (active === void 0) { active = true; }
        this.id = id;
        this.name = name;
        this.email = email;
        this.active = active;
    }
    UserClass.prototype.toggleActive = function () {
        this.active = !this.active;
    };
    return UserClass;
}());
// Initial Array
var userList = [
    new UserClass(1, "Chris", "chris@email.com"),
    new UserClass(2, "Anna", "ana@email.com"),
    new UserClass(3, "Allison", "allison@email.com", false)
];
// Create Button Deactivate / Activate
function createDeactivateButton(user) {
    var btn = document.createElement("button");
    btn.textContent = user.active ? "Deactivate" : "Activate";
    btn.classList.add("status", user.active ? "active" : "inactive");
    btn.addEventListener("click", function (event) {
        user.toggleActive();
        countUsers();
        renderUsers(showingActive ? getActiveUsers(userList) : userList);
    });
    return btn;
}
;
//Function Add Tasks to Users
function getTasksElement() {
    var p = document.createElement("p");
    p.textContent = "0 tasks assigned";
    p.classList.add("tasks-info");
    return p;
}
// Create card and append buttons
function createUserCard(user) {
    var card = document.createElement("div");
    card.classList.add("card");
    if (!user.active) {
        card.classList.add("inactive");
    }
    var name = document.createElement("h2");
    name.textContent = user.name;
    var email = document.createElement("p");
    email.textContent = user.email;
    card.append(name, email, getTasksElement(), createDeactivateButton(user));
    return card;
}
//Function Render
function renderUsers(users) {
    if (users === void 0) { users = userList; }
    container.innerHTML = "";
    users.forEach(function (user) {
        container.appendChild(createUserCard(user));
    });
}
//Count Users
function countUsers() {
    countUsersElement.textContent = "Total users: ".concat(userList.length);
}
// Filter Active Users
function getActiveUsers(users) {
    return users.filter(function (user) { return user.active; });
}
// State
var showingActive = false;
// Button toggle: active users / show all
activeBtn.addEventListener("click", function () {
    showingActive = !showingActive;
    activeBtn.textContent = showingActive ? "Show All" : "Active Users";
    renderUsers(showingActive ? getActiveUsers(userList) : userList);
});
//Form
form.addEventListener("submit", function (event) {
    event.preventDefault();
    var valueName = userName.value.trim();
    if (valueName === "")
        return;
    var valueEmail = userEmail.value.trim();
    if (valueEmail === "")
        return;
    var newUser = new UserClass(Date.now(), valueName, valueEmail);
    userList.push(newUser);
    countUsers();
    renderUsers(showingActive ? getActiveUsers(userList) : userList);
    userName.value = "";
    userEmail.value = "";
});
//Init
countUsers();
renderUsers();
