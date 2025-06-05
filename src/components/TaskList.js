// todo-app/frontend/src/components/TaskList.js

import React, { useState } from "react";

export default function TaskList({ tasks, del, toggle, update }) {
  // Хранит id задачи, которая сейчас редактируется
  const [editingId, setEditingId] = useState(null);
  // Хранит текст, введённый в поле редактирования
  const [editText, setEditText] = useState("");

  return (
    <ul>
      {tasks.map((t) => (
        <li
          key={t.id}
          className="flex items-center justify-between border-b py-1"
        >
          {editingId === t.id ? (
            // ─── Режим редактирования ─────────────────────────
            <form
              onSubmit={(e) => {
                e.preventDefault();
                // Вызываем колбэк update(id, новый текст)
                update(t.id, editText.trim());
                // Выходим из режима редактирования
                setEditingId(null);
              }}
              className="flex items-center gap-2 w-full"
            >
              <input
                className="flex-grow border px-2 py-1 rounded"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                autoFocus
              />
              <button type="submit" className="text-green-600">
                ✔︎
              </button>
              <button
                onClick={() => setEditingId(null)}
                className="text-gray-500"
                type="button"
              >
                ✕
              </button>
            </form>
          ) : (
            // ─── Обычный режим (просмотр задачи) ──────────────
            <label className="flex items-center gap-2 cursor-pointer w-full">
              {/* чекбокс для done */}
              <input
                type="checkbox"
                checked={t.done}
                onChange={() => toggle(t.id)}
              />
              {/* текст задачи: двойной клик → переход в редактирование */}
              <span
                className={t.done ? "line-through text-gray-500" : ""}
                onDoubleClick={() => {
                  setEditingId(t.id);
                  setEditText(t.text);
                }}
              >
                {t.text}
              </span>
              {/* кнопка «✎» для редактирования */}
              <button
                onClick={() => {
                  setEditingId(t.id);
                  setEditText(t.text);
                }}
                className="ml-2 text-blue-600"
                type="button"
              >
                ✎
              </button>
            </label>
          )}

          {/* кнопка удаления (по-прежнему всегда видна справа) */}
          <button onClick={() => del(t.id)} className="text-red-500">
            ✕
          </button>
        </li>
      ))}
    </ul>
  );
}
