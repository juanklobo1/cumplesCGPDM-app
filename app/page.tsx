'use client';

import { useEffect, useState } from "react";
import { format, isToday, parse } from "date-fns";

export default function CumplesApp() {
  const [group, setGroup] = useState("Coro Gospel");
  const [name, setName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [data, setData] = useState([]);
  const [todayBirthdays, setTodayBirthdays] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("cumples-data");
    if (stored) {
      const parsed = JSON.parse(stored);
      setData(parsed);
      const today = parsed.filter((item) => {
        const d = parse(item.birthdate, "yyyy-MM-dd", new Date());
        return isToday(d);
      });
      setTodayBirthdays(today);
    }
  }, []);

  const handleSubmit = () => {
    if (!name || !birthdate) return;
    const updated = [...data, { name, birthdate }];
    setData(updated);
    localStorage.setItem("cumples-data", JSON.stringify(updated));
    setName("");
    setBirthdate("");
  };

  const ordered = [...data].sort((a, b) => {
    const da = parse(a.birthdate, "yyyy-MM-dd", new Date());
    const db = parse(b.birthdate, "yyyy-MM-dd", new Date());
    return da.getMonth() * 100 + da.getDate() - (db.getMonth() * 100 + db.getDate());
  });

  return (
    <div style={{ maxWidth: 500, margin: "auto", padding: 16 }}>
      <h1 style={{ fontSize: 24, fontWeight: "bold" }}>Cumples de {group}</h1>

      <input
        placeholder="Nombre del grupo"
        value={group}
        onChange={(e) => setGroup(e.target.value)}
        style={{ width: "100%", padding: 8, marginTop: 12, marginBottom: 20 }}
      />

      <div style={{ padding: 16, border: "1px solid #ddd", borderRadius: 8, marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: "bold" }}>Nuevo cumpleañero</h2>
        <input
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: "100%", padding: 8, marginTop: 10 }}
        />
        <input
          type="date"
          value={birthdate}
          onChange={(e) => setBirthdate(e.target.value)}
          style={{ width: "100%", padding: 8, marginTop: 10, marginBottom: 10 }}
        />
        <button onClick={handleSubmit} style={{ padding: 10, backgroundColor: "#222", color: "white", border: "none", borderRadius: 4 }}>
          Guardar
        </button>
      </div>

      {todayBirthdays.length > 0 && (
        <div style={{ backgroundColor: "#fff3cd", padding: 10, marginBottom: 20 }}>
          <strong>¡Hoy cumplen!</strong> {todayBirthdays.map((t) => t.name).join(", ")}
        </div>
      )}

      <h2 style={{ fontSize: 18, fontWeight: "bold" }}>Lista de cumpleaños</h2>
      <ul>
        {ordered.map((item, index) => (
          <li key={index}>
            <strong>{item.name}</strong> - {format(parse(item.birthdate, "yyyy-MM-dd", new Date()), "d 'de' MMMM")}
          </li>
        ))}
      </ul>
    </div>
  );
}