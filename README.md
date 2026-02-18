# 🪙 Kaalbyte-Finance

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Expo](https://img.shields.io/badge/v51.0-Expo-000020?logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-v0.74-61DAFB?logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/NativeWind-38B2AC?logo=tailwind-css&logoColor=white)
![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-C5F74F?logo=drizzle&logoColor=black)

**Kaalbyte-Finance** is a modern personal finance and expense tracking mobile application. Built with **:contentReference[oaicite:0]{index=0}** and **:contentReference[oaicite:1]{index=1}**, it empowers users to manage income, track expenses, and visualize spending trends through a clean, intuitive interface.

> This project represents a production-ready MVP featuring robust authentication, local database persistence, and modern session management.

---

## ✨ Features

* **Secure Auth:** Full authentication and session management flow  
* **Expense Tracking:** Seamlessly log income and expenses on the go  
* **Data Analytics:** Monthly summaries and visual spending trends  
* **Smart Organization:** Category-based transaction management  
* **Local Persistence:** High-performance data storage via SQLite & **:contentReference[oaicite:2]{index=2}**  
* **Modern UI:** Responsive design using NativeWind (Tailwind CSS)

---

## 🛠️ Tech Stack

* **Framework:** Expo (React Native)
* **Navigation:** Expo Router (File-based routing)
* **Database:** SQLite + Drizzle ORM
* **Styling:** NativeWind / Tailwind CSS
* **Security:** Expo Secure Store for session & token management

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/raushan-kumar7/kaalbyte-finance.git
cd kaalbyte-finance
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_API_URL=your_api_url_here
```

### 4. Database Setup (Drizzle)

Generate and apply migrations:

```bash
npx drizzle-kit generate
npx drizzle-kit push
```

### 5. Run the app

```bash
npx expo start
```

* Press **a** → Android emulator  
* Press **i** → iOS simulator  
* Or scan the QR code with Expo Go  

---

## 📈 MVP Status & Roadmap

Kaalbyte-Finance is currently **feature-complete** as an MVP. Core tracking, analytics, and storage are stable.

### Future Improvements

- Cloud sync and multi-device backup  
- Automated budget alerts & savings goals  
- Advanced interactive charts  
- Data export to CSV/PDF  
- Multi-user account support  

---

## 🤝 Contributing

Contributions, issues, and feature ideas are welcome! Feel free to fork the repo and submit a Pull Request.

---

## 📄 License

This project is licensed under the **MIT License**.

---

*Made with care for smarter personal finance by the Kaalbyte Team.*
