var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
// ELEMENTS
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
// INITIAL DATA
var userList = [
    new UserClass(1, "Chris", "chris@email.com"),
    new UserClass(2, "Anna", "ana@email.com"),
    new UserClass(3, "Allison", "allison@email.com", false)
];
var currentFilter = "all";
var isOrderedAZ = false;
// BUTTONS
function getVisibleUsers() {
    var users = __spreadArray([], userList, true);
    if (currentFilter === "active") {
        users = users.filter(function (user) { return user.active; });
    }
    if (currentFilter === "inactive") {
        users = users.filter(function (user) { return !user.active; });
    }
    if (isOrderedAZ) {
        users.sort(function (a, b) { return a.name.localeCompare(b.name); });
    }
    return users;
}
function updateButtonsText() {
    activeBtn.textContent =
        currentFilter === "active" ? "Show All" : "Active Users";
    inactiveBtn.textContent =
        currentFilter === "inactive" ? "Show All" : "Inactive Users";
    btnOrder.textContent =
        isOrderedAZ ? "Clear Order" : "Order A-Z";
}
function updateUI() {
    renderUsers(getVisibleUsers());
    updateButtonsText();
    statistics();
}
// CARD ELEMENTS 
function getTasksElement() {
    var p = document.createElement("p");
    p.textContent = "0 tasks assigned";
    p.classList.add("tasks-info");
    return p;
}
function createDeactivateButton(user) {
    var btn = document.createElement("button");
    btn.textContent = user.active ? "Deactivate" : "Activate";
    btn.classList.add("btn-status", user.active ? "active" : "inactive");
    btn.addEventListener("click", function (e) {
        e.stopPropagation();
        user.toggleActive();
        updateUI();
    });
    return btn;
}
function addDeleteButton(user) {
    var btn = document.createElement("button");
    btn.textContent = "Delete";
    btn.classList.add("btnDelete");
    btn.addEventListener("click", function (e) {
        e.stopPropagation();
        userList = userList.filter(function (u) { return u.id !== user.id; });
        updateUI();
    });
    return btn;
}
function createUserCard(user) {
    var card = document.createElement("div");
    card.classList.add("card");
    if (!user.active)
        card.classList.add("inactive");
    var name = document.createElement("h2");
    name.textContent = user.name;
    var email = document.createElement("p");
    email.textContent = user.email;
    var status = document.createElement("p");
    status.textContent = user.active ? "Status: Active" : "Status: Inactive";
    status.classList.add("user-status");
    card.append(name, email, getTasksElement(), status, createDeactivateButton(user), addDeleteButton(user));
    card.addEventListener("click", function () { return openUserModal(user); });
    return card;
}
//RENDER
function renderUsers(users) {
    container.innerHTML = "";
    users.forEach(function (user) { return container.appendChild(createUserCard(user)); });
}
// STATISTICS
function statistics() {
    var total = userList.length;
    var active = userList.filter(function (u) { return u.active; }).length;
    var percentActive = total === 0 ? 0 : Math.round((active / total) * 100);
    var percentInactive = total === 0 ? 0 : Math.round((active / total) * 100);
    countUsersElement.innerHTML = "\n        Total users: ".concat(total, "<br>\n        Active users: ").concat(percentActive, "%<br>\n        Inactive users: ").concat(percentInactive, "%\n    ");
}
// FORM
form.addEventListener("submit", function (e) {
    e.preventDefault();
    formError.textContent = "";
    var name = userName.value.trim();
    var email = userEmail.value.trim();
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!name) {
        formError.textContent = "Please enter a valid name.";
        return;
    }
    if (!emailRegex.test(email)) {
        formError.textContent = "Please enter a valid email.";
        return;
    }
    userList.push(new UserClass(Date.now(), name, email));
    userName.value = "";
    userEmail.value = "";
    updateUI();
});
// FILTER BUTTONS
activeBtn.addEventListener("click", function () {
    currentFilter = currentFilter === "active" ? "all" : "active";
    updateUI();
});
inactiveBtn.addEventListener("click", function () {
    currentFilter = currentFilter === "inactive" ? "all" : "inactive";
    updateUI();
});
btnOrder.addEventListener("click", function () {
    isOrderedAZ = !isOrderedAZ;
    updateUI();
});
// MODAL
function openUserModal(user) {
    modalBody.innerHTML = "\n        <p><strong>ID:</strong> ".concat(user.id, "</p>\n        <p><strong>Name:</strong> ").concat(user.name, "</p>\n        <p><strong>Email:</strong> ").concat(user.email, "</p>\n        <p><strong>Status:</strong> ").concat(user.active ? "Active" : "Inactive", "</p>\n    ");
    modal.classList.add("show");
}
btnClose.addEventListener("click", function () { return modal.classList.remove("show"); });
modal.addEventListener("click", function (e) {
    if (e.target === modal)
        modal.classList.remove("show");
});
document.addEventListener("keydown", function (e) {
    if (e.key === "Escape")
        modal.classList.remove("show");
});
// INIT
updateUI();
