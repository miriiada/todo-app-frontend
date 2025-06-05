import { useEffect, useState } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

const API =
  process.env.NODE_ENV === "production"
    ? "https://todo-app-backend-hidz.onrender.com/api/tasks"
    : "http://localhost:5000/api/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all"); // all | active | done

  // загрузка при первом рендере
  useEffect(() => {
    fetch(API)
      .then((res) => res.json())
      .then((data) => setTasks(data));
  }, []);

  // добавить задачу
  const addTask = text =>
    fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    })
      .then(r => r.json())
      .then(t => setTasks([...tasks, t]));

  // удалить
  const del = id =>
    fetch(`${API}/${id}`, { method: "DELETE" }).then(() =>
      setTasks(tasks.filter(t => t.id !== id))
    );

  // переключить done
  const toggle = id =>
    fetch(`${API}/${id}`, { method: "PATCH" })
      .then(r => r.json())
      .then(({ done }) =>
        setTasks(tasks.map(t => (t.id === id ? { ...t, done } : t)))
      );

  // отфильтрованный список
  const updateTask = (id, newText) =>
    fetch(`${API}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: newText }),
    })
      .then((res) => res.json())
      .then((updatedTask) =>
        setTasks(tasks.map((t) => (t.id === id ? updatedTask : t)))
      );

  // 6) Применяем фильтры
  const visible = tasks.filter((t) =>
    filter === "active" ? !t.done : filter === "done" ? t.done : true
  );

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">To-Do Manager</h1>

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

      {/* Передаём все колбэки: del, toggle, updateTask */}
      <TaskList tasks={visible} del={del} toggle={toggle} update={updateTask} />
    </div>
  );
}

export default App;




