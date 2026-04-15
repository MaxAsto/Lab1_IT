// ===== ФУНКЦІЇ =====
function greet(name) {
  if (!name || !name.trim()) return "Hello, Stranger!";
  return `Hello, ${name.trim()[0].toUpperCase() + name.trim().slice(1)}!`;
}

function add(a, b) {
  return a + b;
}
function subtract(a, b) {
  return a - b;
}
function multiply(a, b) {
  return a * b;
}
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
class TodoList {
  constructor() {
    this.tasks = [];
  }

  addTask(description) {
    if (!description.trim())
      throw new Error("Task description cannot be empty");
    const task = {
      id: this.tasks.length + 1,
      description: description.trim(),
      created_at: new Date().toISOString(),
      done: false,
    };
    this.tasks.push(task);
    return task;
  }

  markDone(taskId) {
    const task = this.tasks.find((t) => t.id === taskId);
    if (task) {
      task.done = true;
      return true;
    }
    return false;
  }

  removeTask(taskId) {
    const index = this.tasks.findIndex((t) => t.id === taskId);
    if (index !== -1) {
      this.tasks.splice(index, 1);
      return true;
    }
    return false;
  }

  listTasks() {
    return this.tasks;
  }
}

// ===== ЗБЕРЕЖЕННЯ / ЗАВАНТАЖЕННЯ =====
function saveToStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
function loadFromStorage(key) {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : [];
}

// ===== ІНТЕРФЕЙС =====
const todo = new TodoList();

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

// ToDo
document.getElementById("add-task").addEventListener("click", () => {
  const desc = document.getElementById("task-desc").value;
  try {
    const task = todo.addTask(desc);
    document.getElementById("output").textContent =
      "Added: " + JSON.stringify(task, null, 2);
    document.getElementById("task-desc").value = "";
  } catch (e) {
    alert(e.message);
  }
});

document.getElementById("mark-done").addEventListener("click", () => {
  const id = parseInt(document.getElementById("task-id").value);
  if (todo.markDone(id)) {
    document.getElementById("output").textContent = "Task marked as done.";
  } else {
    document.getElementById("output").textContent = "Task not found.";
  }
});

document.getElementById("remove-task").addEventListener("click", () => {
  const id = parseInt(document.getElementById("task-id").value);
  if (todo.removeTask(id)) {
    document.getElementById("output").textContent = "Task removed.";
  } else {
    document.getElementById("output").textContent = "Task not found.";
  }
});

document.getElementById("list-tasks").addEventListener("click", () => {
  document.getElementById("output").textContent =
    "Tasks: " + JSON.stringify(todo.listTasks(), null, 2);
});

document.getElementById("save-tasks").addEventListener("click", () => {
  saveToStorage("tasks", todo.listTasks());
  document.getElementById("output").textContent = "Tasks saved!";
});

document.getElementById("load-tasks").addEventListener("click", () => {
  const loaded = loadFromStorage("tasks");
  todo.tasks = loaded;
  document.getElementById("output").textContent =
    "Loaded: " + JSON.stringify(loaded, null, 2);
});

// Env status
document.getElementById("status").textContent = import.meta.env.VITE_APP_STATUS;
