var container = document.querySelector("#container");
var form = document.querySelector(".user-form");
var userName = document.querySelector("#userName");
var userEmail = document.querySelector("#userEmail");
var activeBtn = document.querySelector("#showActive");
var inactiveBtn = document.querySelector("#showInactive");
var btnOrder = document.querySelector("#btnOrder");
var countUsersElement = document.querySelector("#countUsers");
var formError = document.querySelector("#formError");
var modal = document.querySelector("#infoModal");
var modalBody = document.querySelector("#modalBody");
var btnClose = document.querySelector("#infoClose");
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
    btn.classList.add("btn-status", user.active ? "active" : "inactive");
    btn.addEventListener("click", function (event) {
        event.stopPropagation();
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
    var statusText = document.createElement("p");
    statusText.textContent = user.active ? "Status: Active" : "Status: Inactive";
    statusText.classList.add("user-status");
    card.append(name, email, getTasksElement(), statusText, createDeactivateButton(user), addDeleteButton(user));
    card.addEventListener("click", function () {
        openUserModal(user);
    });
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
// Filter Inactive Users
function getInactiveUsers(users) {
    return users.filter(function (user) { return !user.active; });
}
// State
var showingInactive = false;
// Button toggle: active users / show all
inactiveBtn.addEventListener("click", function () {
    showingInactive = !showingInactive;
    inactiveBtn.textContent = showingInactive ? "Show All" : "Inactive Users";
    renderUsers(showingInactive ? getActiveUsers(userList) : userList);
});
// Order A-Z button
btnOrder.addEventListener("click", function () {
    userList.sort(function (a, b) { return a.name.localeCompare(b.name); });
    renderUsers();
});
// Delete Button
function addDeleteButton(user) {
    var btnDelete = document.createElement("button");
    btnDelete.innerHTML = "<i class=\"fa-solid fa-trash-can\"></i>";
    btnDelete.addEventListener("click", function () {
        event.stopPropagation();
        userList = userList.filter(function (t) { return t.id !== user.id; });
        renderUsers();
    });
    return btnDelete;
}
//Form
form.addEventListener("submit", function (event) {
    event.preventDefault();
    formError.textContent = ""; // limpar erros anteriores
    var valueName = userName.value.trim();
    var valueEmail = userEmail.value.trim();
    if (valueName === "") {
        formError.textContent = "This field is required. Please enter a valid name.";
        return;
    }
    if (!valueEmail.includes("@")) {
        formError.textContent = "To be a valid email, it must contain the @ symbol.";
        return;
    }
    var newUser = new UserClass(Date.now(), valueName, valueEmail);
    userList.push(newUser);
    countUsers();
    renderUsers(showingActive ? getActiveUsers(userList) : userList);
    userName.value = "";
    userEmail.value = "";
});
// MODAL - MORE INFO
// Open modal
function openUserModal(user) {
    modalBody.innerHTML = "\n        <p><strong>ID:</strong> ".concat(user.id, "</p>\n        <p><strong>Name:</strong> ").concat(user.name, "</p>\n        <p><strong>Email:</strong> ").concat(user.email, "</p>\n        <p><strong>Status:</strong> ").concat(user.active ? "Active" : "Inactive", "</p>\n    ");
    modal.classList.add("show");
}
// Close modal with button
btnClose.addEventListener("click", function () {
    modal.classList.remove("show");
});
// Close modal clicking outside
modal.addEventListener("click", function (e) {
    if (e.target === modal) {
        modal.classList.remove("show");
    }
});
// Close modal with ESC
document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.classList.contains("show")) {
        modal.classList.remove("show");
    }
});
// Falta apenas:
// Uma função dedicada
// Um cálculo de percentagem
// Chamar essa função sempre que algo mudar
function statistics() {
}
//Init
countUsers();
renderUsers();
