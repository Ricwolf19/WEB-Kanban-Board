# WEB-Kanban-Board

<p align="center">
  <img width="800" height="500" src="/public/example.png" alt="example">
</p>

Dynamic kanban board with database connection, using Firebase, TypeScript, Tailwind CSS, and React.

## Overview

This project is a web-based kanban board application designed to help teams manage their tasks efficiently. With real-time database integration provided by Firebase, users can seamlessly create, update, and track the progress of tasks across customizable boards.

## Features

- **Real-time Updates:** Changes made by one user are instantly reflected for all users in real-time, ensuring seamless collaboration.
  
- **Customizable Boards:** Create multiple boards and customize columns to match your workflow, allowing for flexible task management.

- **Task Management:** Easily create, edit, delete, and move tasks between columns, making it simple to track progress and prioritize work.

## Technologies Used

- **Firebase:** Real-time database for seamless data synchronization across users and devices.
  
- **React:** JavaScript library for building user interfaces, providing a fast and interactive user experience.
  
- **TypeScript:** Typed superset of JavaScript for enhanced code readability, maintainability, and error detection.
  
- **Tailwind CSS:** Utility-first CSS framework for quickly styling components and creating a modern UI design.

## Getting Started

1. **Clone the repository:**

```bash
   git clone https://github.com/Ricwolf19/WEB-Kanban-Board.git
   cd WEB-Kanban-Board
```

2. **Install dependencies:**

```bash
  bun install
```

3. **Set up Firebase:**

Create a Firebase project on the Firebase Console.
Obtain Firebase configuration and update it in src/firebaseConfig.ts.

4. **Clone the repository:**

```bash
Run the application:
bun run dev
The application will be accessible at http://localhost:3000.
```

6. **Contributing**

Contributions are welcome! If you have ideas for improvements, new features, or bug fixes, feel free to submit a pull request.

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
