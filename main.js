const container = document.querySelector("#container");
const form = document.querySelector(".user-form");
const userName = document.querySelector("#userName");
const userEmail = document.querySelector("#userEmail");
const activeBtn = document.querySelector("#showActive");
const inactiveBtn = document.querySelector("#showInactive");
const btnOrder = document.querySelector("#btnOrder");
const countUsersElement = document.querySelector("#countUsers");
const formError = document.querySelector("#formError");
const modal = document.querySelector("#infoModal");
const modalBody = document.querySelector("#modalBody");
const btnClose = document.querySelector("#infoClose");
class UserClass {
    constructor(id, name, email, active = true) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.active = active;
    }
    toggleActive() {
        this.active = !this.active;
    }
}
// INITIAL DATA
let userList = [
    new UserClass(1, "Chris", "chris@email.com"),
    new UserClass(2, "Anna", "ana@email.com"),
    new UserClass(3, "Allison", "allison@email.com", false)
];
let currentFilter = "all";
let isOrderedAZ = false;
// BUTTONS
function getVisibleUsers() {
    let users = [...userList];
    if (currentFilter === "active") {
        users = users.filter(user => user.active);
    }
    if (currentFilter === "inactive") {
        users = users.filter(user => !user.active);
    }
    if (isOrderedAZ) {
        users.sort((a, b) => a.name.localeCompare(b.name));
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
    const p = document.createElement("p");
    p.textContent = "0 tasks assigned";
    p.classList.add("tasks-info");
    return p;
}
function createDeactivateButton(user) {
    const btn = document.createElement("button");
    btn.textContent = user.active ? "Deactivate" : "Activate";
    btn.classList.add("btn-status", user.active ? "active" : "inactive");
    btn.addEventListener("click", e => {
        e.stopPropagation();
        user.toggleActive();
        updateUI();
    });
    return btn;
}
function addDeleteButton(user) {
    const btn = document.createElement("button");
    btn.textContent = "Delete";
    btn.classList.add("btnDelete");
    btn.addEventListener("click", e => {
        e.stopPropagation();
        userList = userList.filter(u => u.id !== user.id);
        updateUI();
    });
    return btn;
}
function createUserCard(user) {
    const card = document.createElement("div");
    card.classList.add("card");
    if (!user.active)
        card.classList.add("inactive");
    const name = document.createElement("h2");
    name.textContent = user.name;
    const email = document.createElement("p");
    email.textContent = user.email;
    const status = document.createElement("p");
    status.textContent = user.active ? "Status: Active" : "Status: Inactive";
    status.classList.add("user-status");
    card.append(name, email, getTasksElement(), status, createDeactivateButton(user), addDeleteButton(user));
    card.addEventListener("click", () => openUserModal(user));
    return card;
}
//RENDER
function renderUsers(users) {
    container.innerHTML = "";
    users.forEach(user => container.appendChild(createUserCard(user)));
}
// STATISTICS
function statistics() {
    const total = userList.length;
    const active = userList.filter(u => u.active).length;
    const percentActive = total === 0 ? 0 : Math.round((active / total) * 100);
    const percentInactive = total === 0 ? 0 : Math.round((active / total) * 100);
    countUsersElement.innerHTML = `
        Total users: ${total}<br>
        Active users: ${percentActive}%<br>
        Inactive users: ${percentInactive}%
    `;
}
// FORM
form.addEventListener("submit", e => {
    e.preventDefault();
    formError.textContent = "";
    const name = userName.value.trim();
    const email = userEmail.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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
activeBtn.addEventListener("click", () => {
    currentFilter = currentFilter === "active" ? "all" : "active";
    updateUI();
});
inactiveBtn.addEventListener("click", () => {
    currentFilter = currentFilter === "inactive" ? "all" : "inactive";
    updateUI();
});
btnOrder.addEventListener("click", () => {
    isOrderedAZ = !isOrderedAZ;
    updateUI();
});
// MODAL
function openUserModal(user) {
    modalBody.innerHTML = `
        <p><strong>ID:</strong> ${user.id}</p>
        <p><strong>Name:</strong> ${user.name}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Status:</strong> ${user.active ? "Active" : "Inactive"}</p>
    `;
    modal.classList.add("show");
}
btnClose.addEventListener("click", () => modal.classList.remove("show"));
modal.addEventListener("click", e => {
    if (e.target === modal)
        modal.classList.remove("show");
});
document.addEventListener("keydown", e => {
    if (e.key === "Escape")
        modal.classList.remove("show");
});
// INIT
updateUI();
