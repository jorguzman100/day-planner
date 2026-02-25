# 🗓️ FluxDay Planner

### A clean day planner with a month view, fast task logging, and a polished UI that feels good to use

FluxDay Planner is a browser-based personal agenda for planning one day at a time while keeping the full month in view. It is lightweight, local-first, and saves everything in `localStorage`, so it works without a backend and is easy to run or deploy later as a static site.

---

## ✨ Features

| | Feature | What It Does |
|---|---|---|
| 📅 | Month View Calendar | Lets you browse months/years and jump to a specific day quickly |
| 🕒 | Daily Time Slots | Shows hourly planning slots (8:00 AM to 5:00 PM) for focused scheduling |
| 💾 | Local Storage Saving | Saves activities in the browser so your plan stays after refresh |
| 🔢 | Activity Count Badges | Displays how many saved activities exist for each day in the month grid |
| 🌗 | Light/Dark Theme Toggle | Switches theme modes and remembers your preference |
| ♻️ | Legacy Storage Migration | Migrates older saved entries to the new namespaced storage keys |

---

<p align="center">
  <img
    src="./client/Assets/day-planner.webp"
    alt="FluxDay Planner showing month view and daily planner side by side"
    width="520"
    style="border-radius: 12px; box-shadow: 0 10px 28px rgba(16, 24, 40, 0.18); object-position: top;"
  />
</p>

---

## 🛠️ Tech Stack

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-323330?style=flat-square&logo=javascript&logoColor=F7DF1E)
![jQuery](https://img.shields.io/badge/jQuery-0769AD?style=flat-square&logo=jquery&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap_4-563D7C?style=flat-square&logo=bootstrap&logoColor=white)
![LocalStorage](https://img.shields.io/badge/Web_Storage-localStorage-1F6FEB?style=flat-square)

---

## 🧩 Project Snapshot

- Single-page frontend app inside `client/` with relative asset paths (ready for static hosting later)
- `client/script.js` builds the month calendar and daily planner rows dynamically with jQuery
- Browser `localStorage` is used for task persistence (no backend/API/database required)
- Theme toggle swaps logo assets and stores the selected theme for future visits
- `client/style.css` handles responsive layout, theme tokens, and visual states (selected day, time slot status)

---

## 🚀 Live Demo

![Deployment](https://img.shields.io/badge/Deployment-Not%20deployed%20yet-lightgrey?style=for-the-badge)
[![GitHub](https://img.shields.io/badge/GitHub-Repo-181717?style=for-the-badge&logo=github)](https://github.com/jorguzman100/day-planner)

No public deployment yet. The project is set up to run locally now and can be deployed later as a static site.

---

## 💻 Run it locally

```bash
git clone https://github.com/jorguzman100/day-planner.git
cd day-planner
python3 -m http.server 5501
```

Open:

- App: `http://localhost:5501/client/`

<details>
<summary>🔑 Required environment variables</summary>

No environment variables are required for the current version.

</details>

---

## 🤝 Contributors

- **Jorge Guzman**  ·  [@jorguzman100](https://github.com/jorguzman100)
