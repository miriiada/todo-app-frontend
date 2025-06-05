// todo-app/frontend/src/App.js

import { useEffect, useState } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import AuthForm from "./components/AuthForm";
import { getAuthHeaders, storeToken, clearToken, getToken } from "./auth";

const API_BASE = process.env.NODE_ENV === "production"
  ? "https://todo-app-backend-hidz.onrender.com"
  : "http://localhost:5000";

function App() {
  // ── Авторизация ───────────────────────────────────────────────
  const [currentUser, setCurrentUser] = useState(null);
  const [authMode, setAuthMode] = useState("login"); // "login" или "register"
  const [authError, setAuthError] = useState("");

  // При монтировании проверим, есть ли токен в localStorage
  useEffect(() => {
    const token = getToken();
    if (token) {
      // Попробуем получить данные «/api/auth/me» (нужно сделать маршрут)
      fetch(`${API_BASE}/api/auth/me`, {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Token expired or invalid");
          return res.json();
        })
        .then((data) => {
          setCurrentUser(data.user);
        })
        .catch(() => {
          clearToken();
          setCurrentUser(null);
        });
    }
  }, []);

  // Обработчик успешной регистрации/логина
  const handleAuthSuccess = (token, userOrSwitch) => {
    if (token === "switch") {
      // Переключиться между login и register
      setAuthMode(userOrSwitch === "login" ? "register" : "login");
      setAuthError("");
      return;
    }
    // Если пришёл реальный токен + пользователь
    storeToken(token);
    setCurrentUser(userOrSwitch);
    setAuthError("");
  };

  const handleLogout = () => {
    clearToken();
    setCurrentUser(null);
  };
  // ────────────────────────────────────────────────────────────────

  // ── CRUD задач ─────────────────────────────────────────────────
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all"); // "all" | "active" | "done"

  // Загрузка задач текущего пользователя
  useEffect(() => {
    if (!currentUser) return; // не запрашиваем, если не авторизован
    fetch(`${API_BASE}/api/tasks`, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    })
      .then((res) => res.json())
      .then((data) => setTasks(data));
  }, [currentUser]);

  const addTask = (text) => {
    fetch(`${API_BASE}/api/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ text }),
    })
      .then((res) => {
        if (!res.ok && res.status === 401) {
          throw new Error("Unauthorized");
        }
        return res.json();
      })
      .then((newTask) => setTasks([...tasks, newTask]))
      .catch((err) => {
        console.error(err);
        // можно автоматически выйти, если токен просрочен
        handleLogout();
      });
  };

  const del = (id) => {
    fetch(`${API_BASE}/api/tasks/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    })
      .then(() => setTasks(tasks.filter((t) => t.id !== id)))
      .catch((err) => console.error(err));
  };

  const toggle = (id) => {
    fetch(`${API_BASE}/api/tasks/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    })
      .then((res) => res.json())
      .then(({ done }) =>
        setTasks(tasks.map((t) => (t.id === id ? { ...t, done } : t)))
      )
      .catch((err) => console.error(err));
  };

  const updateTask = (id, newText) => {
    fetch(`${API_BASE}/api/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ text: newText }),
    })
      .then((res) => res.json())
      .then((updatedTask) =>
        setTasks(tasks.map((t) => (t.id === id ? updatedTask : t)))
      )
      .catch((err) => console.error(err));
  };

  const visible = tasks.filter((t) =>
    filter === "active" ? !t.done : filter === "done" ? t.done : true
  );
  // ────────────────────────────────────────────────────────────────

  // ── Рендеринг ───────────────────────────────────────────────────
  // Если нет текущего пользователя, показываем форму Login/Register
  if (!currentUser) {
    return (
      <AuthForm
        mode={authMode}
        onSuccess={(token, userOrSwitch) => {
          if (token === "switch") {
            setAuthMode(userOrSwitch);
          } else {
            handleAuthSuccess(token, userOrSwitch);
          }
        }}
      />
    );
  }

  // Если пользователь авторизован, показываем To-Do-приложение
  return (
    <div className="p-6 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">To-Do Manager</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-red-500 hover:underline"
        >
          Logout
        </button>
      </div>

      <p className="mb-2">Logged in as: <strong>{currentUser.username}</strong></p>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setFilter("all")}
          className={filter === "all" ? "font-bold" : ""}
        >
          All
        </button>
        <button
          onClick={() => setFilter("active")}
          className={filter === "active" ? "font-bold" : ""}
        >
          Active
        </button>
        <button
          onClick={() => setFilter("done")}
          className={filter === "done" ? "font-bold" : ""}
        >
          Done
        </button>
      </div>

      <TaskForm addTask={addTask} />
      <TaskList tasks={visible} del={del} toggle={toggle} update={updateTask} />
    </div>
  );
}

export default App;
