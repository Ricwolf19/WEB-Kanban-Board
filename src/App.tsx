import { KanbanBoard } from "./Components/KanbanBoard";


export function App() {
  return (
    <div>
      <h1 className="text-center pb-6 pt-14 font-bold text-5xl text-rose-600">Kanban Board</h1>
      <h2 className="text-center pb-10 font-semibold text-3xl">Drag and Drop</h2>
      <KanbanBoard />
    </div>
  )
}
