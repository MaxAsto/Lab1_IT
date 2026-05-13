import * as Sentry from "@sentry/browser";
import posthog from "posthog-js";

// POSTHOG INIT
posthog.init(
  "phc_BqdMueTPNDFsxbJmEKWjH2pcJWQVs4kPm9zt8KSX7Fcp",
  {
    api_host: import.meta.env.VITE_POSTHOG_HOST,
    person_profiles: "identified_only",
  }
);

// SENTRY INIT
Sentry.init({
  dsn: "https://d08777a0bdcb42c78471ab489e6e54f5@o4511381581332480.ingest.de.sentry.io/4511381597388880",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 1.0,
  replaysOnErrorSampleRate: 1.0,
  environment: "production",
  release: "lab-1.0.0",
  debug: true,
});

// ✅ DOM‑логіка тільки у браузері
if (typeof window !== "undefined" && typeof document !== "undefined") {
  window.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded");

    // ОТРИМАННЯ ЕЛЕМЕНТІВ
    const loginBtn = document.getElementById("login-btn");
    const logoutBtn = document.getElementById("logout-btn");
    const urgentBtn = document.getElementById("urgent-btn");
    const breakBtn = document.getElementById("break-btn");
    const loadBtn = document.getElementById("load-btn");

    console.log("loadBtn:", loadBtn);
    console.log("loginBtn:", loginBtn);
    console.log("logoutBtn:", logoutBtn);
    console.log("urgentBtn:", urgentBtn);
    console.log("breakBtn:", breakBtn);

    // LOGIN / LOGOUT
    function login() {
      Sentry.setUser({
        id: "12345",
        email: "student@example.com",
        segment: "premium_user",
      });
      console.log("User context set");
    }

    function logout() {
      Sentry.setUser(null);
      console.log("User context cleared");
    }

    // FEATURE FLAGS
    posthog.onFeatureFlags(() => {
      if (posthog.isFeatureEnabled("show-urgent-filter")) {
        if (urgentBtn) urgentBtn.style.display = "block";
      } else {
        if (urgentBtn) urgentBtn.style.display = "none";
      }
    });

    // ФЕЙКОВИЙ API ЗАПИТ
    async function fakeApiRequest() {
      return Sentry.startSpan(
        { op: "http.client", name: "GET /tasks" },
        async () => {
          console.log("Fake API request started");
          await new Promise((resolve) => setTimeout(resolve, 3000));
          console.log("Fake API request finished");
          return { tasks: [1, 2, 3] };
        }
      );
    }

    // ВАЖКИЙ UI РЕНДЕРИНГ
    async function heavyUiRender() {
      return Sentry.startSpan(
        { op: "ui.render", name: "Heavy Tasks Component" },
        async () => {
          console.log("Heavy UI rendering started");
          const start = Date.now();
          while (Date.now() - start < 2000) {
            Math.sqrt(Math.random() * 100000);
          }
          console.log("Heavy UI rendering finished");
        }
      );
    }

    // LOAD TASKS BUTTON
    if (loadBtn) {
      loadBtn.addEventListener("click", async () => {
        console.log("Load button clicked");
        await Sentry.startSpan(
          { op: "navigation", name: "Load Tasks Page" },
          async () => {
            console.log("Transaction started");
            await fakeApiRequest();
            await heavyUiRender();
            console.log("Transaction finished");
          }
        );
      });
    }

    // LOGIN BUTTON
    if (loginBtn) loginBtn.addEventListener("click", login);

    // LOGOUT BUTTON
    if (logoutBtn) logoutBtn.addEventListener("click", logout);

    // BREAK BUTTON
    if (breakBtn) {
      breakBtn.addEventListener("click", () => {
        const urgentTasksCount = 5;
        const randomValue = Math.random();
        const errorMessage =
          `Critical failure in show-urgent-filter action: ${
            urgentTasksCount > 2
              ? `too many urgent tasks (${urgentTasksCount})`
              : "unknown issue"
          }`;
        const error = new Error(errorMessage);
        Sentry.addBreadcrumb({
          message: "Urgent filter button clicked (experimental 50/50)",
          category: "user",
          data: { urgentTasksCount, randomValue },
        });
        Sentry.captureException(error);
        console.error("[Urgent Filter Error]", error);
        throw error;
      });
    }

    console.log("All listeners attached");
  });
}



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

    // Подія у PostHog
  posthog.capture('task_created', {
    priority: 'high',
    category: 'work',
    is_authenticated: true,
  });

    return task;
  }

  markDone(id) {
  const task = this.tasks.find(t => t.id === id);
  if (task) {
    task.done = true;

    // Подія у PostHog
    posthog.capture('task_completed', {
      time_to_complete_seconds: Math.floor((Date.now() - task.createdAt.getTime()) / 1000),
    });

    return true;
  }
  return false;
}


  removeTask(id) {
  const initialLength = this.tasks.length;
  this.tasks = this.tasks.filter(t => t.id !== id);

  if (this.tasks.length < initialLength) {
    // Подія у PostHog
    posthog.capture('task_deleted', {
      reason: 'mistake', 
    });
    return true;
  }
  return false;
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


