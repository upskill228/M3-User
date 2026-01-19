// ELEMENTS
const container = document.querySelector("#container");
const form = document.querySelector(".user-form");
const userName = document.querySelector("#userName");
const userEmail = document.querySelector("#userEmail");
const activeBtn = document.querySelector("#showActive");
const inactiveBtn = document.querySelector("#showInactive");
const btnOrder = document.querySelector("#btnOrder");
const countUsersElement = document.querySelector("#countUsers");
const formError = document.querySelector("#formError");
const searchInput = document.querySelector("#searchUser");
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
// STATE
let currentFilter = "all";
let searchTerm = "";
let isOrderedAZ = false;
// INITIAL DATA
let userList = [
    new UserClass(1, "Chris", "chris@email.com"),
    new UserClass(2, "Anna", "ana@email.com"),
    new UserClass(3, "Allison", "allison@email.com", false)
];
// NEXT ID
let nextId = userList.length > 0 ? Math.max(...userList.map(u => u.id)) + 1 : 1;
// FUNCTION TO LOAD INITIAL USERS
function loadInitialUsers() {
    const initialData = [
        { name: "Mark", email: "mark@email.com" },
        { name: "Sophia", email: "sophia@email.com", active: false },
        { name: "Allison", email: "allison@email.com", active: false },
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
function updateGlobalData() {
    renderUsers(getVisibleUsers());
    updateButtonsText();
    statistics();
}
// EVENT LISTENERS
activeBtn.addEventListener("click", () => {
    currentFilter = currentFilter === "active" ? "all" : "active";
    searchTerm = "";
    searchInput.value = "";
    updateGlobalData();
});
inactiveBtn.addEventListener("click", () => {
    currentFilter = currentFilter === "inactive" ? "all" : "inactive";
    searchTerm = "";
    searchInput.value = "";
    updateGlobalData();
});
btnOrder.addEventListener("click", () => {
    isOrderedAZ = !isOrderedAZ;
    updateGlobalData();
});
searchInput.addEventListener("input", () => {
    searchTerm = searchInput.value.trim();
    updateGlobalData();
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
        updateGlobalData();
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
        updateGlobalData();
    });
    return btn;
}
function createUserCard(user) {
    const card = document.createElement("div");
    card.classList.add("card");
    if (!user.active)
        card.classList.add("inactive");
    // User ID
    const userId = document.createElement("p");
    userId.textContent = `ID: ${user.id}`;
    userId.classList.add("user-id");
    // Name
    const name = document.createElement("h2");
    name.textContent = user.name;
    // Email
    const email = document.createElement("p");
    email.textContent = user.email;
    // Status
    const status = document.createElement("p");
    status.textContent = user.active ? "Status: Active" : "Status: Inactive";
    status.classList.add("user-status");
    // Buttons
    const deactivateBtn = createDeactivateButton(user);
    const deleteBtn = addDeleteButton(user);
    // Tasks placeholder
    const tasks = getTasksElement();
    // Append all elements in logical order
    card.append(userId, name, email, tasks, status, deactivateBtn, deleteBtn);
    // Clicking card opens modal (buttons already stop propagation)
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
    countUsersElement.innerHTML = `
        Total users: ${total}<br>
        Active users: ${percentActive}%<br>
        Inactive users: ${percentInactive}%`;
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
    updateGlobalData();
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
//LOAD INITIAL USERS
loadInitialUsers();
// INIT
updateGlobalData();
