// ELEMENTS
const container = document.querySelector("#container");
const form = document.querySelector(".user-form");
const userName = document.querySelector("#userName");
const userEmail = document.querySelector("#userEmail");
const activeBtn = document.querySelector("#showActive");
const inactiveBtn = document.querySelector("#showInactive");
const btnOrder = document.querySelector("#btnOrder");
const userStatsElement = document.querySelector("#userStats");
const formError = document.querySelector("#formError");
const searchInput = document.querySelector("#searchUser");
const clearSearchBtn = document.querySelector(".clear-search");
const modal = document.querySelector("#infoModal");
const modalBody = document.querySelector("#modalBody");
const btnClose = document.querySelector("#infoClose");
// CLASS
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
// ARRAY
let userList = [
    new UserClass(1, "Chris", "chris@email.com"),
    new UserClass(2, "Anna", "ana@email.com"),
    new UserClass(3, "Allison", "allison@email.com", false)
];
// STATE
let currentFilter = "all";
let searchTerm = "";
let isOrderedAZ = false;
let nextId = userList.length > 0
    ? Math.max(...userList.map(u => u.id)) + 1
    : 1;
// FUNCTION TO LOAD INITIAL USERS
function loadInitialUsers() {
    const initialData = [
        { name: "Mark", email: "mark@email.com" },
        { name: "Sophia", email: "sophia@email.com", active: false },
        { name: "Brian", email: "brian@email.com", },
        { name: "Diana", email: "diana@email.com", active: false }
    ];
    const newUsers = initialData.map(data => {
        const user = new UserClass(nextId, data.name, data.email, data.active);
        nextId++;
        return user;
    });
    userList = [...userList, ...newUsers];
}
// BUTTONS - FUNCTIONS
function getVisibleUsers() {
    let users = userList.filter(user => {
        if (currentFilter === "active" && !user.active)
            return false;
        if (currentFilter === "inactive" && user.active)
            return false;
        if (searchTerm && !user.name.toLowerCase().includes(searchTerm.toLowerCase()))
            return false;
        return true;
    });
    if (isOrderedAZ) {
        users = [...users].sort((a, b) => a.name.localeCompare(b.name));
    }
    return users;
}
function updateButtonsText() {
    activeBtn.textContent =
        currentFilter === "active" ? "Show All" : "Active Users";
    inactiveBtn.textContent =
        currentFilter === "inactive" ? "Show All" : "Inactive Users";
    btnOrder.textContent =
        isOrderedAZ ? "Original Order" : "Order A-Z";
}
function updateUI() {
    renderUsers(getVisibleUsers());
    updateButtonsText();
    statistics();
}
// EVENT LISTENERS
activeBtn.addEventListener("click", () => {
    currentFilter = currentFilter === "active" ? "all" : "active";
    searchTerm = "";
    searchInput.value = "";
    updateUI();
});
inactiveBtn.addEventListener("click", () => {
    currentFilter = currentFilter === "inactive" ? "all" : "inactive";
    searchTerm = "";
    searchInput.value = "";
    updateUI();
});
btnOrder.addEventListener("click", () => {
    isOrderedAZ = !isOrderedAZ;
    updateUI();
});
searchInput.addEventListener("input", () => {
    searchTerm = searchInput.value.trim();
    updateUI();
});
clearSearchBtn.addEventListener("click", () => {
    searchInput.value = "";
    searchTerm = "";
    updateUI();
});
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
    btn.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
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
    // Elements
    const userId = document.createElement("p");
    userId.textContent = `ID: ${user.id}`;
    userId.classList.add("user-id");
    const name = document.createElement("h2");
    name.textContent = user.name;
    const email = document.createElement("p");
    email.textContent = user.email;
    const status = document.createElement("p");
    status.textContent = user.active ? "Status: Active user" : "Status: Inactive user";
    status.classList.add("user-status");
    const deactivateBtn = createDeactivateButton(user);
    const deleteBtn = addDeleteButton(user);
    const tasks = getTasksElement();
    // Card structure
    const header = document.createElement("div");
    header.classList.add("card-header");
    header.append(userId, name);
    const body = document.createElement("div");
    body.classList.add("card-body");
    body.append(email, tasks, status);
    const footer = document.createElement("div");
    footer.classList.add("card-footer");
    footer.append(deactivateBtn, deleteBtn);
    card.append(header, body, footer);
    // Modal
    card.addEventListener("click", () => openUserModal(user));
    return card;
}
//RENDER
function renderUsers(users) {
    container.innerHTML = "";
    if (users.length === 0) {
        const noUsers = document.createElement("p");
        noUsers.textContent = "No users available";
        noUsers.classList.add("no-users");
        container.appendChild(noUsers);
        return;
    }
    users.forEach(user => container.appendChild(createUserCard(user)));
}
// STATISTICS
function statistics() {
    const total = userList.length;
    const active = userList.filter(u => u.active).length;
    const inactive = total - active;
    let percentActive;
    let percentInactive;
    if (total === 0) {
        percentActive = 0;
        percentInactive = 0;
    }
    else {
        percentActive = Math.round((active / total) * 100);
        percentInactive = 100 - percentActive;
    }
    userStatsElement.innerHTML = `
        <h3>Stats</h3>
        <p>Total users: <strong>${total}</strong></p><br>
        <p>Active users: <strong>${percentActive}%</strong></p><br>
        <p>Inactive users: <strong>${percentInactive}%</strong></p>`;
}
;
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
    const newUser = new UserClass(nextId, name, email);
    nextId++; // incrementa o ID para o próximo
    userList.push(newUser);
    userName.value = "";
    userEmail.value = "";
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
//INIT
loadInitialUsers();
updateUI();
