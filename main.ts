let ul = document.querySelector("#UserListUl") as HTMLElement;
let container = document.querySelector("#container") as HTMLDivElement;
let form = document.querySelector(".user-form") as HTMLFormElement;
let userName = document.querySelector("#userName") as HTMLInputElement;
let userEmail = document.querySelector("#userEmail") as HTMLInputElement;

//Interface
interface User {
    id: number;
    name: string;
    email: string;
    active: boolean;

    toggleDeactivate():void;
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
    
    toggleDeactivate(): void {
    this.active = !this.active;
    }
}

// Objects - first
let userList: User [] = [
    new UserClass (1, "Chris", "chris@email.com"),
    new UserClass (2, "Anna", "ana@email.com"),
    new UserClass (3, "Allison", "allison@email.com", false)
];

// Create Button Deactivate
function addDeactivateBtn(user: User): HTMLButtonElement {
    const btn = document.createElement("button");
    btn.textContent = user.active ? "Deactivate" : "Activate";
    btn.classList.add("status", user.active ? "active" : "inactive");

    btn.addEventListener("click", (event) => {
        event.stopPropagation();
        user.toggleDeactivate();
        renderUser();
    });

    return btn;
};

// Create li and append buttons
function addLiUser(user: User) {
    const li = document.createElement("li");
    li.classList.add("user-li");

    const nomeH2 = document.createElement("h2");
    nomeH2.textContent = user.name;
    li.appendChild(nomeH2);

    const emailP = document.createElement("p");
    emailP.textContent = user.email;
    li.appendChild(emailP);

    li.appendChild(addDeactivateBtn(user));
    ul.appendChild(li);

    return li;
}

// Create Card
function addcard(user: User): void {
    const card = document.createElement("div");
        card.className = "card";

        card.appendChild(addLiUser(user));

        if (!user.active) {
            card.classList.add("inactive");
        }
        container.appendChild(card);
};

//Function Render
function renderUser(): void {
    container.innerHTML = "";

    userList.forEach((user: User) => {
        addcard(user);
    });
}

//Form
form.addEventListener("submit", (event) => {
    event.preventDefault();
    const valueName = userName.value.trim();
    if (valueName === "") return "Please write a valid name";
    const valueEmail = userEmail.value.trim();
    if (valueEmail === "") return "Please write a valid email";

    
    const newUser = new UserClass(Date.now(), valueName, valueEmail);
    userList.push(newUser);

    renderUser();
    userName.value = "";
    userEmail.value = "";
});

// Filter Active Users



renderUser();