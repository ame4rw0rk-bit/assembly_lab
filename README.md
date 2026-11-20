# x86 Assembly & Computer Architecture Platform

An interactive educational platform designed for learning **x86 32-bit Assembly Language (MASM / Irvine32)** and Computer Architecture concepts. The repository includes structured lectures, practical code examples, interactive labs, and step-by-step execution debugging exercises.

## 🚀 Key Features

- **Structured Interactive Curriculum:** Comprehensive coverage of Computer Architecture fundamentals, Registers, Memory Addresses, Data Types, Data Transfer, and Loop Control Flow (`LOOP` instruction).
- **Interactive Lab & Execution Grader:** Hands-on practice modules with real-time feedback, detailed failure analysis, and step-by-step code correction for common assembly pitfalls.
- **Embedded Study Materials:** Direct integration of PDF and HTML reference guides for seamless reading and downloading.
- **Modern Responsive UI:** A lightweight, client-side dashboard tailored for smooth navigation across devices without requiring external server dependencies.

## 📁 Repository Structure

```text
frontend/
├── index.html                  # Main application entry point
└── assets/
    ├── css/
    │   ├── styles.css          # Main UI layout and styling
    │   └── theme.css           # Theme variables and color palette
    ├── images/
    │   └── oxameer-linux-avatar.jpg
    ├── js/
    │   ├── app.js              # Core application logic and routing
    │   ├── lab.js              # Interactive laboratory runner
    │   ├── lab-grader.js       # Solution evaluation and feedback engine
    │   └── data/               # Course modules, lecture contents, and lessons
    └── pdfs/                   # Lecture notes and reference guides (PDF/HTML)
```

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Architecture Target:** x86 32-bit Assembly, MASM Syntax, Irvine32 Library

## 🚦 Quick Start & Local Setup

Since the project operates as a static client-side web application, no complex build tools or backend installations are required:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/0xAmeer/repository-name.git
   ```
2. **Navigate into the directory:**
   ```bash
   cd repository-name
   ```
3. **Launch the platform:**
   - Open `frontend/index.html` directly in your web browser, or use the **Live Server** extension in VS Code.

## 👤 Author

Developed by **[0xAmeer](https://github.com/0xAmeer)**.