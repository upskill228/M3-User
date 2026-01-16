var ul = document.querySelector("#UserListUl");
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
    UserClass.prototype.toggleDeactivate = function () {
        this.active = !this.active;
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
function addDeactivateBtn(user) {
    var btn = document.createElement("button");
    btn.textContent = user.active ? "Deactivate" : "Activate";
    btn.classList.add("status", user.active ? "active" : "inactive");
    btn.addEventListener("click", function (event) {
        event.stopPropagation();
        user.toggleDeactivate();
        renderUser();
    });
    return btn;
}
;
// Create li and append buttons
function addLiUser(user) {
    var li = document.createElement("li");
    li.classList.add("user-li");
    var nomeH2 = document.createElement("h2");
    nomeH2.textContent = user.name;
    li.appendChild(nomeH2);
    var emailP = document.createElement("p");
    emailP.textContent = user.email;
    li.appendChild(emailP);
    li.appendChild(addDeactivateBtn(user));
    ul.appendChild(li);
    return li;
}
// Create Card
function addcard(user) {
    var card = document.createElement("div");
    card.className = "card";
    card.appendChild(addLiUser(user));
    if (!user.active) {
        card.classList.add("inactive");
    }
    container.appendChild(card);
}
;
//Function Render
function renderUser() {
    container.innerHTML = "";
    userList.forEach(function (user) {
        addcard(user);
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
// Filter Active Users
renderUser();
