// ===== ФУНКЦІЇ =====
function greet(name) {
  if (!name || !name.trim()) return "Hello, Stranger!";
  return `Hello, ${name.trim()[0].toUpperCase() + name.trim().slice(1)}!`;
}

function add(a, b) { return a + b; }
function subtract(a, b) { return a - b; }
function multiply(a, b) { return a * b; }
function divide(a, b) {
  if (b === 0) throw new Error("Division by zero is not allowed");
  return a / b;
}

function isPalindrome(text) {
  const cleaned = text.toLowerCase().replace(/[^a-zа-я0-9]/gi, "");
  return cleaned === cleaned.split("").reverse().join("");
}

function factorial(n) {
  if (n < 0) throw new Error("Negative numbers not allowed");
  if (n === 0) return 1;
  let result = 1;
  for (let i = 1; i <= n; i++) result *= i;
  return result;
}

// ===== ToDo КЛАС =====
class Todo {
  constructor() {
    this.tasks = [];
    this.nextId = 1;
  }

  addTask(text) {
    if (!text || !text.trim()) throw new Error("Task description cannot be empty");
    const task = {
      id: this.nextId++,
      text: text.trim(),
      createdAt: new Date(),
      done: false
    };
    this.tasks.push(task);
    return task;
  }

  markDone(id) {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.done = true;
      return true;
    }
    return false;
  }

  removeTask(id) {
    const initialLength = this.tasks.length;
    this.tasks = this.tasks.filter(t => t.id !== id);
    return this.tasks.length < initialLength;
  }

  listTasks() {
    return this.tasks;
  }
}

// ===== ЗБЕРЕЖЕННЯ / ЗАВАНТАЖЕННЯ =====
function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
function loadFromStorage(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

// ===== ІНТЕРФЕЙС =====
const todo = new Todo();

// Greeting
document.getElementById("greet-button").addEventListener("click", () => {
  const name = document.getElementById("name-input").value;
  document.getElementById("greet-result").textContent = greet(name);
});

// Math
document.getElementById("math-button").addEventListener("click", () => {
  const a = parseFloat(document.getElementById("num-a").value);
  const b = parseFloat(document.getElementById("num-b").value);
  let result = "";
  try {
    result += `${a} + ${b} = ${add(a, b)}\n`;
    result += `${a} - ${b} = ${subtract(a, b)}\n`;
    result += `${a} * ${b} = ${multiply(a, b)}\n`;
    result += `${a} / ${b} = ${divide(a, b)}\n`;
  } catch (e) {
    result = "Error: " + e.message;
  }
  document.getElementById("math-result").textContent = result;
});

// Palindrome
document.getElementById("pal-button").addEventListener("click", () => {
  const text = document.getElementById("pal-input").value;
  document.getElementById("pal-result").textContent = isPalindrome(text)
    ? "Це паліндром!"
    : "Не паліндром.";
});

// Factorial
document.getElementById("fact-button").addEventListener("click", () => {
  const n = parseInt(document.getElementById("fact-input").value);
  try {
    document.getElementById("fact-result").textContent =
      `Факторіал ${n} = ${factorial(n)}`;
  } catch (e) {
    document.getElementById("fact-result").textContent = "Error: " + e.message;
  }
});

// ===== ToDo ІНТЕРФЕЙС =====
function renderTasks() {
  const output = document.getElementById("output");
  if (todo.tasks.length === 0) {
    output.textContent = "No tasks.";
  } else {
    output.textContent = todo.tasks
      .map(
        t =>
          `ID: ${t.id}, Text: ${t.text}, Date: ${t.createdAt.toLocaleString()}, Done: ${t.done}`
      )
      .join("\n");
  }
}

document.getElementById("add-task").addEventListener("click", () => {
  const input = document.getElementById("task-desc");
  if (input.value.trim() !== "") {
    todo.addTask(input.value.trim());
    renderTasks();
    input.value = "";
  }
});

document.getElementById("mark-done").addEventListener("click", () => {
  const id = parseInt(document.getElementById("task-id").value);
  if (todo.markDone(id)) {
    renderTasks();
  } else {
    document.getElementById("output").textContent = "Task not found.";
  }
});

document.getElementById("remove-task").addEventListener("click", () => {
  const id = parseInt(document.getElementById("task-id").value);
  if (todo.removeTask(id)) {
    renderTasks();
  } else {
    document.getElementById("output").textContent = "Task not found.";
  }
});

document.getElementById("list-tasks").addEventListener("click", () => {
  renderTasks();
});

document.getElementById("save-tasks").addEventListener("click", () => {
  saveToStorage("tasks", todo.listTasks());
  document.getElementById("output").textContent = "Tasks saved!";
});

document.getElementById("load-tasks").addEventListener("click", () => {
  const loaded = loadFromStorage("tasks");
  todo.tasks = loaded.map(t => ({
    ...t,
    createdAt: new Date(t.createdAt) // відновлюємо дату
  }));
  renderTasks();
});

// Env status
document.getElementById("status").textContent = import.meta.env.VITE_APP_STATUS;
const statusElement = document.getElementById("status");
statusElement.innerHTML = "Production Mode<br>Quality Gate active";


