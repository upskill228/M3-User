// ELEMENTS
const container = document.querySelector("#container") as HTMLDivElement;
const form = document.querySelector(".user-form") as HTMLFormElement;
const userName = document.querySelector("#userName") as HTMLInputElement;
const userEmail = document.querySelector("#userEmail") as HTMLInputElement;

const activeBtn = document.querySelector("#showActive") as HTMLButtonElement;
const inactiveBtn = document.querySelector("#showInactive") as HTMLButtonElement;
const btnOrder = document.querySelector("#btnOrder") as HTMLButtonElement;

const countUsersElement = document.querySelector("#countUsers") as HTMLParagraphElement;
const formError = document.querySelector("#formError") as HTMLParagraphElement;

const modal = document.querySelector("#infoModal") as HTMLDivElement;
const modalBody = document.querySelector("#modalBody") as HTMLDivElement;
const btnClose = document.querySelector("#infoClose") as HTMLButtonElement;

// INTERFACE & CLASS
interface User {
    readonly id: number;
    name: string;
    email: string;
    active: boolean;
    toggleActive(): void;
}

class UserClass implements User {
    id: number;
    name: string;
    email: string;
    active: boolean;

    constructor(id: number, name: string, email: string, active = true) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.active = active;
    }

    toggleActive(): void {
        this.active = !this.active;
    }
}

// INITIAL DATA
let userList: User[] = [
    new UserClass(1, "Chris", "chris@email.com"),
    new UserClass(2, "Anna", "ana@email.com"),
    new UserClass(3, "Allison", "allison@email.com", false)
];


// STATE
type FilterType = "all" | "active" | "inactive";

let currentFilter: FilterType = "all";
let isOrderedAZ = false;

// BUTTONS
function getVisibleUsers(): User[] {
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

function updateButtonsText(): void {
    activeBtn.textContent =
        currentFilter === "active" ? "Show All" : "Active Users";

    inactiveBtn.textContent =
        currentFilter === "inactive" ? "Show All" : "Inactive Users";

    btnOrder.textContent =
        isOrderedAZ ? "Clear Order" : "Order A-Z";
}

function updateUI(): void {
    renderUsers(getVisibleUsers());
    updateButtonsText();
    statistics();
}

// CARD ELEMENTS 
function getTasksElement(): HTMLParagraphElement {
    const p = document.createElement("p");
    p.textContent = "0 tasks assigned";
    p.classList.add("tasks-info");
    return p;
}

function createDeactivateButton(user: User): HTMLButtonElement {
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

function addDeleteButton(user: User): HTMLButtonElement {
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

function createUserCard(user: User): HTMLDivElement {
    const card = document.createElement("div");
    card.classList.add("card");

    if (!user.active) card.classList.add("inactive");

    const name = document.createElement("h2");
    name.textContent = user.name;

    const email = document.createElement("p");
    email.textContent = user.email;

    const status = document.createElement("p");
    status.textContent = user.active ? "Status: Active" : "Status: Inactive";
    status.classList.add("user-status");

    card.append(
        name,
        email,
        getTasksElement(),
        status,
        createDeactivateButton(user),
        addDeleteButton(user)
    );

    card.addEventListener("click", () => openUserModal(user));

    return card;
}

//RENDER
function renderUsers(users: User[]): void {
    container.innerHTML = "";
    users.forEach(user => container.appendChild(createUserCard(user)));
}

// STATISTICS
function statistics(): void {
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
function openUserModal(user: User): void {
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
    if (e.target === modal) modal.classList.remove("show");
});

document.addEventListener("keydown", e => {
    if (e.key === "Escape") modal.classList.remove("show");
});

// INIT
updateUI();
