export default function TaskList({ tasks, del, toggle }) {
  return (
    <ul>
      {tasks.map(t => (
        <li key={t.id} className="flex items-center justify-between border-b py-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={t.done} onChange={() => toggle(t.id)} />
            <span style={{ textDecoration: t.done ? "line-through" : "none" }}>
              {t.text}
            </span>
          </label>
          <button onClick={() => del(t.id)} className="text-red-500">✕</button>
        </li>
      ))}
    </ul>
  );
}
