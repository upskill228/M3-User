// let ul = document.querySelector("#UserListUl") as HTMLElement;
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

    deactivate():void;
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
    
    deactivate(): void {
        this.active = false;
    }
}

// Objects - first
let userList: User [] = [
    new UserClass (1, "Chris", "chris@email.com"),
    new UserClass (2, "Anna", "ana@email.com"),
    new UserClass (3, "Allison", "allison@email.com", false)
];

// Create Button Deactivate
function addButton(user: UserClass): HTMLButtonElement {
    const btn = document.createElement("button");
    btn.innerHTML = `Deactivate`;
    btn.addEventListener("click", (event) => {
        event.stopPropagation();
        userList = userList.filter(u => u.id !== user.id);
        renderUser();
    });
    return btn;
};

// Create Card
function addcard(user: UserClass): void {
    const card = document.createElement("div");
        card.className = "card";

        card.innerHTML =
            `<h2>${user.name}<h2>
            <p>Email:
            <br>${user.email}</p>
            <p class="status">${user.active ? "Active" : "Inactive"}</p>
        `;
        addButton(user);
        container.appendChild(card);
};

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
function renderUser(): void {
    container.innerHTML = "";

    userList.forEach((user: UserClass) => {
        addcard(user);
        /* styleActive(user); */
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

// Deactivate User

renderUser();
