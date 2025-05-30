import { useState } from "react";

export default function TaskForm({ addTask }) {
  const [text, setText] = useState("");

  const submit = e => {
    e.preventDefault();
    if (!text.trim()) return;
    addTask(text);
    setText("");
  };

  return (
    <form onSubmit={submit} className="flex mb-4">
      <input
        className="flex-grow border px-3 py-2"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Enter task"
      />
      <button className="bg-blue-600 text-white px-4">Add</button>
    </form>
  );
}
