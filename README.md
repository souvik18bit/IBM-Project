<div align="center">

# 🚀 Nexvora — Employee Management Dashboard

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=22&pause=1000&color=3B82D4&center=true&vCenter=true&width=600&lines=Modern+Employee+Management+System;Built+with+React+%2B+Vite;Powered+by+an+AI+Assistant;Beautiful+Dashboard+%26+Analytics" alt="Typing SVG" />

<p>
  <img src="https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-ES2024-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
  <img src="https://img.shields.io/badge/CSS3-Modern-1572B6?style=for-the-badge&logo=css3&logoColor=white" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" />
</p>

<p>
  <a href="#-features"><b>Features</b></a> •
  <a href="#-screenshots"><b>Screenshots</b></a> •
  <a href="#-tech-stack"><b>Tech Stack</b></a> •
  <a href="#-installation"><b>Installation</b></a> •
  <a href="#-project-structure"><b>Structure</b></a> •
  <a href="#-contributing"><b>Contributing</b></a>
</p>

</div>

---

## ✨ About the Project

**Nexvora** is a modern, responsive **Employee Management Dashboard** built with **React** and **Vite**. It provides HR administrators and teams with a clean, fast, and delightful interface to explore company data — from employee records and salary analytics to AI-powered chat assistance and an integrated help desk.

The UI ships with a **fully themeable design system** (light/dark mode), smooth animations, and a component-driven architecture — all in a lightweight, dependency-minimal setup.

> 💡 **Design Philosophy:** Fast, accessible, and beautiful. Every interaction is animated, every screen is responsive, and every component is reusable.

---

## 🎯 Features

<table>
<tr>
<td width="50%">

### 📊 Dashboard & Analytics
- 📈 Live KPI cards (headcount, payroll, averages)
- 📉 Interactive bar charts for departments
- 🍩 Donut charts for department/location split
- 💰 Salary distribution buckets
- 🏆 Top 5 earners leaderboard

</td>
<td width="50%">

### 👥 Employee Directory
- 🔍 Real-time search across all fields
- 🏷️ Filter by department
- ↕️ Sortable columns (any field)
- 📱 Responsive table layout
- 🎨 Color-coded department badges

</td>
</tr>
<tr>
<td width="50%">

### 🤖 AI Assistant (Nex)
- 💬 Floating chatbot on every page
- 🧠 Powered by Google Gemini API
- 📚 Full company knowledge base
- 💡 Smart suggestion chips
- 🔄 Graceful offline fallback mode

</td>
<td width="50%">

### 🎫 Help Desk
- 🎟️ Create & track support tickets
- 🏷️ Priority levels (Low → Urgent)
- 💌 Threaded conversations
- ✅ Mark as resolved / reopen
- 📊 Status filter chips

</td>
</tr>
<tr>
<td width="50%">

### 👤 Profile & Settings
- 🖼️ Photo upload with **1:1 crop tool**
- 🎨 Drag-to-move, scroll-to-zoom
- 💾 Persistent via `localStorage`
- ⚙️ Toggle-based preferences
- 🌙 Dark / Light theme switcher

</td>
<td width="50%">

### 🎨 UI / UX Polish
- ✨ Smooth `fadeUp` / `scaleIn` animations
- 📱 Fully responsive layout
- ♿ Accessible controls
- 🎭 Custom SVG logo & branding
- ⚡ Zero build warnings

</td>
</tr>
</table>

---

## 🖼️ Screenshots

> 📸 Add your screenshots to a `docs/screenshots/` folder and update the paths below.

<div align="center">

| Dashboard | Employees |
|:---------:|:---------:|
| ![Dashboard](docs/screenshots/dashboard.png) | ![Employees](docs/screenshots/employees.png) |

| AI Chatbot | Help Desk |
|:----------:|:---------:|
| ![Chatbot](docs/screenshots/chatbot.png) | ![HelpDesk](docs/screenshots/helpdesk.png) |

</div>

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Technology |
|:-----:|:-----------|
| **Frontend Framework** | React 18 |
| **Build Tool** | Vite 5 |
| **Language** | JavaScript (ES2024) |
| **Styling** | Pure CSS3 with CSS Variables |
| **State Management** | React Hooks (`useState`, `useMemo`, `useEffect`) |
| **AI Integration** | Google Gemini API |
| **Charts** | Hand-crafted SVG (no chart library) |
| **Persistence** | Browser `localStorage` |

</div>

---

## 🚀 Installation

### Prerequisites

- **Node.js** `>= 18.0.0`
- **npm** `>= 9.0.0` (or `yarn` / `pnpm`)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/souvik18bit/IBM-Project.git
cd IBM-Project

# 2. Install dependencies
npm install

# 3. (Optional) Configure environment variables
cp .env.example .env.local
# → Then edit .env.local and add your own keys (see below)

# 4. Start the development server
npm run dev
The app will be available at http://localhost:5173

Environment Variables
Create a .env.local file in the project root and define:

env
# Google Gemini API key for the AI assistant (optional — app works without it)
VITE_GEMINI_API_KEY=your_api_key_here
⚠️ Never commit your .env.local file. It is already listed in .gitignore.
Without a key, the chatbot falls back to a built-in offline knowledge base.

Build for Production
bash
npm run build      # Generates optimized bundle in /dist
npm run preview    # Preview the production build locally
Deploy
This project deploys seamlessly to:

▲ Vercel — zero-config

🌐 Netlify — build command: npm run build, publish dir: dist

📄 GitHub Pages — use gh-pages package

☁️ Any static host serving the dist/ folder

📁 Project Structure
text
.
├── public/
│   └── (static assets)
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx         # Collapsible navigation
│   │   ├── Logo.jsx            # SVG brand mark
│   │   └── Chatbot.jsx         # Floating AI assistant
│   ├── pages/
│   │   ├── Profile.jsx         # Profile + crop modal
│   │   ├── Settings.jsx        # Preference toggles
│   │   ├── About.jsx           # Company info
│   │   ├── Contact.jsx         # Contact form + offices
│   │   └── HelpDesk.jsx        # Ticket system
│   ├── App.jsx                 # Root component & routing
│   ├── App.css                 # Global styles & theme
│   ├── Dashboard.jsx           # Analytics dashboard
│   ├── employees.js            # Mock employee data
│   └── main.jsx                # Entry point
├── .env.example                # Template for env vars
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md
🎨 Design System
The app uses CSS custom properties for instant theming:

css
:root {
  --bg:        #f7f8fa;
  --surface:   #ffffff;
  --text:      #1f2328;
  --accent:    #3b82d4;
  /* ... and more */
}

.dark {
  --bg:        #0d1117;
  --surface:   #161b22;
  --text:      #e6edf3;
  --accent:    #58a6ff;
}
Toggle themes by adding/removing the .dark class on <html> — every color adapts automatically.

🧠 AI Assistant — How It Works
The floating chatbot (Nex) sends conversation context to the Gemini API along with a system prompt containing the company's full employee dataset.

text
┌──────────┐    user message     ┌──────────────┐
│  User    │ ──────────────────► │   Chatbot    │
└──────────┘                     └──────┬───────┘
                                        │
                          ┌─────────────▼─────────────┐
                          │  Gemini API (v1beta)      │
                          │  + System Prompt + Data   │
                          └─────────────┬─────────────┘
                                        │
                          ┌─────────────▼─────────────┐
                          │  Response (markdown-ish)  │
                          └───────────────────────────┘
If no API key is set, the assistant gracefully falls back to a rule-based knowledge base covering common questions — so the app never breaks.

🤝 Contributing
Contributions are welcome! To get started:

bash
# 1. Fork this repository
# 2. Create your feature branch
git checkout -b feature/amazing-feature

# 3. Commit your changes
git commit -m "Add some amazing feature"

# 4. Push to the branch
git push origin feature/amazing-feature

# 5. Open a Pull Request
Please follow the existing code style and add a clear description to your PR.

📜 License
Distributed under the MIT License. See LICENSE for more information.

👤 Author
<div align="center">
Souvik
https://img.shields.io/badge/GitHub-souvik18bit-181717?style=for-the-badge&logo=github

</div>
<div align="center">
⭐ If you found this project useful, please give it a star!
<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=16&pause=1000&color=3B82D4&center=true&vCenter=true&width=500&lines=Thanks+for+visiting!;Happy+Coding!+%F0%9F%9A%80" alt="Footer Typing SVG" />
<sub>Built with ❤️ using React + Vite</sub>

</div> ```
📝 Notes on What I Excluded
To keep your secrets safe, this README does not include:

❌ The actual Gemini API key

❌ Any .env file contents

❌ Database connection strings

❌ Backend credentials

❌ Real employee emails/passwords

Instead, it references a .env.example template — the standard safe practice for open-source projects.

🔧 Before You Publish
Create a .env.example file in your repo containing only placeholder keys (like the one shown in the README).

Verify your .gitignore includes .env, .env.local, and .env.*.local.

Add screenshots to docs/screenshots/ and update the image paths.

Replace souvik18bit/IBM-Project/ in the clone URL with your actual GitHub path.

Rotate your Gemini API key if it was ever accidentally committed to git history — get a fresh one here.
