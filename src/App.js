import { useEffect, useState } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

const API =
  process.env.NODE_ENV === "production"
    ? "https://todo-backend.onrender.com/api/tasks"
    : "http://localhost:5000/api/tasks";

function App() {
  // состояние задач
  const [tasks, setTasks] = useState([]);
  // состояние фильтра
  const [filter, setFilter] = useState("all"); // all | active | done

  // загрузка при первом рендере
  useEffect(() => {
    fetch(API).then(r => r.json()).then(setTasks);
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
  const visible = tasks.filter(t =>
    filter === "active" ? !t.done
    : filter === "done"   ?  t.done
    : true
  );

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">To-Do Manager</h1>

      {/* кнопки фильтра */}
      <div className="flex gap-2 mb-4">
        <button onClick={() => setFilter("all")}    className={filter==="all"    ? "font-bold" : ""}>All</button>
        <button onClick={() => setFilter("active")} className={filter==="active" ? "font-bold" : ""}>Active</button>
        <button onClick={() => setFilter("done")}   className={filter==="done"   ? "font-bold" : ""}>Done</button>
      </div>

      <TaskForm addTask={addTask} />
      <TaskList tasks={visible} del={del} toggle={toggle} />
    </div>
  );
}

export default App;
