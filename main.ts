let container = document.querySelector("#container") as HTMLDivElement;
let form = document.querySelector(".user-form") as HTMLFormElement;
let userName = document.querySelector("#userName") as HTMLInputElement;
let userEmail = document.querySelector("#userEmail") as HTMLInputElement;
let activeBtn = document.querySelector("#showActive") as HTMLButtonElement;
let countUsersElement = document.querySelector("#countUsers") as HTMLParagraphElement;

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
    btn.classList.add("status", user.active ? "active" : "inactive");

    btn.addEventListener("click", (event) => {
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

    card.append(name, email, getTasksElement(), createDeactivateButton(user));

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

//Form
form.addEventListener("submit", (event) => {
    event.preventDefault();
    const valueName = userName.value.trim();
    if (valueName === "") return;
    const valueEmail = userEmail.value.trim();
    if (valueEmail === "") return;

    
    const newUser = new UserClass(Date.now(), valueName, valueEmail);
    userList.push(newUser);

    countUsers();
    renderUsers(showingActive ? getActiveUsers(userList) : userList);
    userName.value = "";
    userEmail.value = "";
});

//Init
countUsers();
renderUsers();