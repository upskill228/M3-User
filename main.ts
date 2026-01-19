let container = document.querySelector("#container") as HTMLDivElement;
let form = document.querySelector(".user-form") as HTMLFormElement;
let userName = document.querySelector("#userName") as HTMLInputElement;
let userEmail = document.querySelector("#userEmail") as HTMLInputElement;
let activeBtn = document.querySelector("#showActive") as HTMLButtonElement;
let inactiveBtn = document.querySelector("#showInactive") as HTMLButtonElement;
let btnOrder = document.querySelector("#btnOrder") as HTMLButtonElement;
let countUsersElement = document.querySelector("#countUsers") as HTMLParagraphElement;
let formError = document.querySelector("#formError") as HTMLParagraphElement;
let modal = document.querySelector("#infoModal") as HTMLDivElement;
let modalBody = document.querySelector("#modalBody") as HTMLDivElement;
let btnClose = document.querySelector("#infoClose") as HTMLButtonElement;

//Interface
interface User {
    readonly id: number;
    name: string;
    email: string;
    active: boolean;

    toggleActive():void;
}

//Class
class UserClass implements User{
    id: number;
    name: string;
    email: string;
    active: boolean;

    constructor (id: number, name: string, email: string, active: boolean = true) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.active = active;
    }
    
    toggleActive(): void {
    this.active = !this.active;
    }
}

// Initial Array
let userList: User [] = [
    new UserClass (1, "Chris", "chris@email.com"),
    new UserClass (2, "Anna", "ana@email.com"),
    new UserClass (3, "Allison", "allison@email.com", false)
];

// Create Button Deactivate / Activate
function createDeactivateButton(user: User): HTMLButtonElement {
    const btn = document.createElement("button");
    btn.textContent = user.active ? "Deactivate" : "Activate";
    btn.classList.add("btn-status", user.active ? "active" : "inactive");

    btn.addEventListener("click", (event) => {
        event.stopPropagation();
        user.toggleActive();
        countUsers();
        renderUsers(showingActive ? getActiveUsers(userList) : userList);
    });

    return btn;
};

//Function Add Tasks to Users
function getTasksElement(): HTMLParagraphElement {
    const p = document.createElement("p");
    p.textContent = "0 tasks assigned";
    p.classList.add("tasks-info");
    return p;
}

// Create card and append buttons
function createUserCard(user: User): HTMLDivElement {
    const card = document.createElement("div");
    card.classList.add("card");

    if (!user.active) {
        card.classList.add("inactive");
    }

    const name = document.createElement("h2");
    name.textContent = user.name;

    const email = document.createElement("p");
    email.textContent = user.email;

    const statusText = document.createElement("p");
    statusText.textContent = user.active ? "Status: Active" : "Status: Inactive";
    statusText.classList.add("user-status");

    card.append(name, email, getTasksElement(), statusText, createDeactivateButton(user), addDeleteButton(user));

    card.addEventListener("click", () => {
        openUserModal(user);
    });

    return card;
}

//Function Render
function renderUsers(users: User[] = userList): void {
    container.innerHTML = "";
    users.forEach(user => {
        container.appendChild(createUserCard(user));
    });
}

//Count Users
function countUsers(): void {
    countUsersElement.textContent = `Total users: ${userList.length}`;
}

// Filter Active Users
function getActiveUsers(users: User[]): User[] {
    return users.filter(user => user.active);
}

// State
let showingActive = false;

// Button toggle: active users / show all
activeBtn.addEventListener("click", () => {
    showingActive = !showingActive;
    activeBtn.textContent = showingActive ? "Show All" : "Active Users";
    renderUsers(showingActive ? getActiveUsers(userList) : userList);
});

// Filter Inactive Users
function getInactiveUsers(users: User[]): User[] {
    return users.filter(user => !user.active);
}

// State
let showingInactive = false;

// Button toggle: active users / show all
inactiveBtn.addEventListener("click", () => {
    showingInactive = !showingInactive;
    inactiveBtn.textContent = showingInactive ? "Show All" : "Inactive Users";
    renderUsers(showingInactive ? getActiveUsers(userList) : userList);
});

// Order A-Z button
btnOrder.addEventListener("click", () => {
    userList.sort((a, b) => a.name.localeCompare(b.name));
    renderUsers();
});

// Delete Button
function addDeleteButton(user: User): HTMLButtonElement {
    const btnDelete = document.createElement("button");
    btnDelete.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
    btnDelete.addEventListener("click", () => {
        event.stopPropagation();
        userList = userList.filter(t => t.id !== user.id);
        renderUsers();
    });
    return btnDelete;
}

//Form
form.addEventListener("submit", (event) => {
    event.preventDefault();

    formError.textContent = ""; // limpar erros anteriores

    const valueName = userName.value.trim();
    const valueEmail = userEmail.value.trim();

    if (valueName === "") {
        formError.textContent = "This field is required. Please enter a valid name.";
        return;
    }

    if (!valueEmail.includes("@")) {
        formError.textContent = "To be a valid email, it must contain the @ symbol.";
        return;
    }

    const newUser = new UserClass(Date.now(), valueName, valueEmail);
    userList.push(newUser);

    countUsers();
    renderUsers(showingActive ? getActiveUsers(userList) : userList);

    userName.value = "";
    userEmail.value = "";
});

// MODAL - MORE INFO

// Open modal
function openUserModal(user: User): void {
    modalBody.innerHTML = `
        <p><strong>ID:</strong> ${user.id}</p>
        <p><strong>Name:</strong> ${user.name}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Status:</strong> ${user.active ? "Active" : "Inactive"}</p>
    `;

    modal.classList.add("show");
}


// Close modal with button
btnClose.addEventListener("click", () => {
  modal.classList.remove("show");
});

// Close modal clicking outside
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.remove("show");
  }
});

// Close modal with ESC
document.addEventListener("keydown", (e) => {
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