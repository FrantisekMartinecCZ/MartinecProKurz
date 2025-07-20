# ASP.NET Core + React: Fakturační aplikace

Tato aplikace vznikla jako **výukový projekt pro** kurzu [Tvorba www aplikací v C# .NET PRO ) na ITnetwork.cz. Aplikace slouží k evidenci osob a faktur pomocí moderní kombinace backendu v ASP.NET Core a frontendové React aplikace.

## 🧩 Funkce aplikace

### 🔙 Backend (ASP.NET Core Web API)
- CRUD operace pro entity `Person` a `Invoice`
- Napojení osob na faktury (dodavatel ↔ odběratel)
- Statistické přehledy (např. počet faktur, celková částka)
- Swagger dokumentace
- Repository a Manager vrstvy
- Validace modelů pomocí atributů

### 🔜 Frontend (React)
- Výpis a filtrování osob a faktur
- Detailní zobrazení záznamů
- Formuláře pro vytvoření a úpravu záznamů
- Navigace pomocí `react-router-dom`
- Flash zprávy pro potvrzení akcí
- Autorizace uživatele

## 🛠️ Použité technologie

### Backend
- ASP.NET Core Web API
- C#, Entity Framework Core, LINQ
- Swagger (Swashbuckle)
- REST API

### Frontend
- React (Vite)
- React Router DOM
- Axios
- Bootstrap nebo CSS
- JavaScript / JSX

## ▶️ Jak projekt spustit

### Backend (.NET API)
1. Otevři řešení ve Visual Studiu (`*.sln`)
2. Spusť migrace (např. `Update-Database`)
3. Spusť aplikaci (`https://localhost:xxx`)
4. Ověř funkčnost přes Swagger (`/swagger`)

### Frontend (React klient)
1. Otevři terminál ve složce `client`
2. Spusť příkazy:
   ```bash
   npm install
   npm run dev
3.Aplikace poběží na http://localhost:xxx
4. Proxy přesměrovává API požadavky na https://localhost:xxxx
🧪 Testování
Swagger: testování API metod (GET, POST, PUT, DELETE)

React: formuláře, filtrace, validace, UI

Propojení backend ↔ frontend pomocí Axios

👨‍🎓 Autor
František Martinec
GitHub: FrantisekMartinecCZ
