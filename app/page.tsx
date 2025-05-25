'use client';

import { useEffect, useState } from "react";
import { parse, isToday, format } from "date-fns";
import { es } from "date-fns/locale";

export default function CumplesApp() {
  const [data, setData] = useState([]);
  const [todayBirthdays, setTodayBirthdays] = useState([]);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    fetch("https://v1.nocodeapi.com/juanklobo1/google_sheets/ZJkIXYRNinFCemiU")
      .then((res) => res.json())
      .then((res) => {
        const rows = Array.isArray(res.data) ? res.data : [];
        setData(rows);

        const today = rows.filter((item) => {
          const rawDate = item["Fecha de Nacimiento"];
          if (!rawDate) return false;
          try {
            const date = parse(rawDate, 'dd/MM/yyyy', new Date());
            return isToday(date);
          } catch {
            return false;
          }
        });

        setTodayBirthdays(today);
      })
      .catch((error) => {
        console.error("Error al cargar datos:", error);
        setData([]);
        setTodayBirthdays([]);
      });
  }, []);

  const ordered = [...data].sort((a, b) => {
    try {
      const da = parse(a["Fecha de Nacimiento"], 'dd/MM/yyyy', new Date());
      const db = parse(b["Fecha de Nacimiento"], 'dd/MM/yyyy', new Date());
      return da.getMonth() * 100 + da.getDate() - (db.getMonth() * 100 + db.getDate());
    } catch {
      return 0;
    }
  });

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "auto",
        padding: 16,
        backgroundColor: "#121223",
        color: "#ffffff",
        fontFamily: "'Poppins', sans-serif",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ fontSize: 28, fontWeight: 600, textAlign: "center" }}>
        🎂 Cumpleaños CG PDM
      </h1>

      <div style={{ display: "flex", justifyContent: "center", marginTop: 16, marginBottom: 24, gap: 12, flexWrap: "wrap" }}>
        <a
          href="https://calendar.google.com/calendar/embed?src=4ead99667807f5404c6b5ebc574d5bb58ec4399e21add715ea7d5a68988df584@group.calendar.google.com&ctz=America%2FArgentina%2FBuenos_Aires"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            backgroundColor: "#3a9bdc",
            color: "#fff",
            padding: "10px 16px",
            borderRadius: 8,
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          📅 Ver calendario CG PDM
        </a>

        <a
          href="https://wa.me/5491167195617?text=🎉%20Hoy%20hay%20cumpleaños%20en%20el%20Coro%20Gospel%20PDM.%20Entrá%20a%20la%20app%20para%20ver%20los%20datos."
          target="_blank"
          rel="noopener noreferrer"
          style={{
            backgroundColor: "#25D366",
            color: "#fff",
            padding: "10px 16px",
            borderRadius: 8,
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          📲 Avisar a Admin Anita
        </a>
      </div>

      {todayBirthdays.length > 0 && (
        <div
          style={{
            backgroundColor: "#3a3a5c",
            padding: 12,
            marginTop: 10,
            borderRadius: 8,
            border: "1px solid #888",
          }}
        >
          <strong>¡Hoy cumplen!</strong>{" "}
          {todayBirthdays.map((t, i) => (
            <span key={i}>
              {t["Nombre-Apodo-Apellido"]}
              {i < todayBirthdays.length - 1 ? ", " : ""}
            </span>
          ))}
        </div>
      )}

      <h2 style={{ fontSize: 20, marginTop: 30 }}>🎈 Todos los cumpleaños</h2>
      <ul style={{ paddingLeft: 16 }}>
        {ordered.map((item, index) => {
          let formatted = "Fecha inválida";
          try {
            const parsedDate = parse(item["Fecha de Nacimiento"], 'dd/MM/yyyy', new Date());
            formatted = format(parsedDate, "d 'de' MMMM", { locale: es });
          } catch {}

          return (
            <li key={index} style={{ marginBottom: 18 }}>
              <div>
                <strong style={{ fontSize: 16 }}>{item["Nombre-Apodo-Apellido"]}</strong> — {formatted}
              </div>

              {item["Instagram o red social (opcional)"] && (
                <div style={{ marginTop: 4 }}>
                  <a
                    href={item["Instagram o red social (opcional)"]}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#80d4ff", textDecoration: "none" }}
                  >
                    📱 Red social
                  </a>
                </div>
              )}

              {item["Nro de celular (opcional)"] && (
                <div style={{ marginTop: 4 }}>
                  📞 {item["Nro de celular (opcional)"]}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}