// let ul = document.querySelector("#UserListUl") as HTMLElement;
var container = document.querySelector("#container");
var form = document.querySelector(".user-form");
var userName = document.querySelector("#userName");
var userEmail = document.querySelector("#userEmail");
//Class
var UserClass = /** @class */ (function () {
    function UserClass(id, name, email, active) {
        if (active === void 0) { active = true; }
        this.id = id;
        this.name = name;
        this.email = email;
        this.active = active;
    }
    UserClass.prototype.deactivate = function () {
        this.active = false;
    };
    return UserClass;
}());
// Objects - first
var userList = [
    new UserClass(1, "Chris", "chris@email.com"),
    new UserClass(2, "Anna", "ana@email.com"),
    new UserClass(3, "Allison", "allison@email.com", false)
];
// Create Button Deactivate
function addButton(user) {
    var btn = document.createElement("button");
    btn.innerHTML = "Deactivate";
    btn.addEventListener("click", function (event) {
        event.stopPropagation();
        userList = userList.filter(function (u) { return u.id !== user.id; });
        renderUser();
    });
    return btn;
}
;
// Create Card
function addcard(user) {
    var card = document.createElement("div");
    card.className = "card";
    card.innerHTML =
        "<h2>".concat(user.name, "<h2>\n            <p>Email:\n            <br>").concat(user.email, "</p>\n            <p class=\"status\">").concat(user.active ? "Active" : "Inactive", "</p>\n        ");
    addButton(user);
    container.appendChild(card);
}
;
//Function Style Active
/*function styleActive(user: UserClass) {
    if (user.active === true) {
        p.classList.add("active");
    } else {
        p.classList.add("inactive");
    }
}; */
// Create Id
/* function createId() {
    userList.forEach((user: UserClass) => {
        
    })
} */
//Function Render
function renderUser() {
    container.innerHTML = "";
    userList.forEach(function (user) {
        addcard(user);
        /* styleActive(user); */
    });
}
//Form
form.addEventListener("submit", function (event) {
    event.preventDefault();
    var valueName = userName.value.trim();
    if (valueName === "")
        return "Please write a valid name";
    var valueEmail = userEmail.value.trim();
    if (valueEmail === "")
        return "Please write a valid email";
    var newUser = new UserClass(Date.now(), valueName, valueEmail);
    userList.push(newUser);
    renderUser();
    userName.value = "";
    userEmail.value = "";
});
// Deactivate User
renderUser();
