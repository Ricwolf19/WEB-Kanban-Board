import { useEffect, useState, useMemo } from "react";

import { db } from "../Firebase";
import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
} from "firebase/firestore";
import { Column, Id, Task } from "../Components/Types";
import { arrayMove } from "@dnd-kit/sortable";
import { DragEndEvent, DragOverEvent, DragStartEvent } from "@dnd-kit/core";
import { v4 } from "uuid"


export const useNotes = () => {
 
    const notesRef = collection(db, 'notes')

    const [allCols, setAllCols] = useState<Column[]>([])
    const [allTasks, setAllTasks] = useState<Task[]>([])
    const [KanbanBoardId, setKanbanBoardId] = useState('')

    const [columns, setColumns] = useState<Column[]>(allCols);
    const [tasks, setTasks] = useState<Task[]>(allTasks);
    const [activeColumn, setActiveColumn] = useState<Column | null>(null);
    const [activeTask, setActiveTask] = useState<Task | null>(null);

    const columnsId = useMemo(() => columns?.map(col => col.id) || [], [columns]);

    const createTask = async (columnId: Id) => {
        const taskId = generateId();
        const newTask: Task = {
            id: taskId,
            columnId,
            content: `Task ${tasks.length + 1}`,
        };

        try {
            setTasks([...tasks, newTask]);

            const docRef = doc(db, 'notes', KanbanBoardId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const kanbanBoardData = docSnap.data();
                const updatedTasks = kanbanBoardData.AllTasks ? [...kanbanBoardData.AllTasks, newTask] : [newTask];

                await updateDoc(docRef, { AllTasks: updatedTasks });

            } else {
                await setDoc(docRef, { AllTasks: [newTask], AllCols: [] }); // Create new document with initial task
            }
        } catch (error) {
            console.error('Error adding new task: ', error);
        }
    }


    const deleteTask = async (id: Id) => {
        try {
            // Delete the task from the local state
            const newTasks = tasks.filter((task) => task.id !== id);
            setTasks(newTasks);

            // Update the AllTasks field in the Firestore database
            const docRef = doc(db, 'notes', KanbanBoardId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                // Remove the deleted task from the AllTasks array
                const kanbanBoardData = docSnap.data();
                const updatedTasks = kanbanBoardData.AllTasks.filter((task: Task) => task.id !== id);

                // Update the AllTasks field in the KanbanBoard document
                await updateDoc(docRef, { AllTasks: updatedTasks });
                // console.log('Task deleted successfully.');
            } else {
                console.error('KanbanBoard document does not exist.');
            }
        } catch (error) {
            console.error('Error deleting task: ', error);
        }
    }

    const updateTask = async (id: Id, content: string) => {
        try {
            // Update the local state with the new content for the specific task
            const newTasks = tasks.map((task) => {
                if (task.id !== id) return task;
                return { ...task, content };
            });
            setTasks(newTasks);

            // Update the AllTasks field in the Firestore database
            const docRef = doc(db, 'notes', KanbanBoardId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const kanbanBoardData = docSnap.data();
                const updatedTasks = kanbanBoardData.AllTasks.map((task: Task) => {
                    if (task.id !== id) return task;
                    return { ...task, content };
                });

                // Update the AllTasks field in the KanbanBoard document
                await updateDoc(docRef, { AllTasks: updatedTasks });
                // console.log('Task content updated successfully.');
            } else {
                console.error('KanbanBoard document does not exist.');
            }
        } catch (error) {
            console.error('Error updating task content: ', error);
        }
    }


    const createNewColumn = async () => {
        const columnToAdd: Column = {
            id: generateId(),
            title: `Column ${columns.length + 1}`,
        };

        try {
            const docRefAdd = collection(db, 'notes');
            const docRefSet = doc(db, 'notes', KanbanBoardId);
            const docSnap = await getDoc(docRefSet);
            if (docSnap.exists()) {
                const kanbanBoardData = docSnap.data();
                const updatedCols = kanbanBoardData.AllCols ? [...kanbanBoardData.AllCols, columnToAdd] : [columnToAdd];

                await updateDoc(docRefSet, { AllCols: updatedCols });
                setColumns([...columns, columnToAdd]);
            } else {
                await addDoc(docRefAdd, { AllCols: [], AllTasks: [] })
                await setDoc(docRefSet, { AllCols: [columnToAdd], AllTasks: [] }); // Create new document with initial column
            }
        } catch (error) {
            console.error('Error adding new column: ', error);
        }
    }

    const deleteColumn = async (id: Id) => {
        try {
            // Delete the column and associated tasks from the local state
            const filteredColumns = columns.filter((col) => col.id !== id);
            setColumns(filteredColumns);

            const newTasks = tasks.filter((t) => t.columnId !== id);
            setTasks(newTasks);

            // Update the AllCols and associated tasks in the Firestore database
            const docRef = doc(db, 'notes', KanbanBoardId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const kanbanBoardData = docSnap.data();

                // Filter out the deleted column from AllCols
                const updatedCols = kanbanBoardData.AllCols.filter((col: Column) => col.id !== id);
                const updatedTasks = kanbanBoardData.AllTasks.filter((task: Task) => task.columnId !== id);

                // Update the AllCols and AllTasks fields in the KanbanBoard document
                await updateDoc(docRef, { AllCols: updatedCols, AllTasks: updatedTasks });
                // console.log('Column and associated tasks deleted successfully.');
            } else {
                console.error('KanbanBoard document does not exist.');
            }
        } catch (error) {
            console.error('Error deleting column: ', error);
        }
    }

    const updateColumn = async (id: Id, title: string) => {
        try {
            // Update the local state with the new title for the specific column
            const newColumns = columns.map((col) => {
                if (col.id !== id) return col;
                return { ...col, title };
            });
            setColumns(newColumns);

            // Update the AllCols field in the Firestore database
            const docRef = doc(db, 'notes', KanbanBoardId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const kanbanBoardData = docSnap.data();
                const updatedCols = kanbanBoardData.AllCols.map((col: Column) => {
                    if (col.id !== id) return col;
                    return { ...col, title };
                });

                // Update the AllCols field in the KanbanBoard document
                await updateDoc(docRef, { AllCols: updatedCols });
                // console.log('Column title updated successfully.');
            } else {
                console.error('KanbanBoard document does not exist.');
            }
        } catch (error) {
            console.error('Error updating column title: ', error);
        }
    }

    function onDragStart(event: DragStartEvent) {
        if (event.active.data.current?.type === "Column") {
            setActiveColumn(event.active.data.current.column);
            return;
        }

        if (event.active.data.current?.type === "Task") {
            setActiveTask(event.active.data.current.task);
            return;
        }
    }

    function onDragEnd(event: DragEndEvent) {
        // Reset the active item
        setActiveColumn(null);
        setActiveTask(null);

        const { active, over } = event;
        // Early return if there's no 'over' target or if the item is dropped onto itself
        if (!over || active.id === over.id) return;

        // Handle Column reordering if applicable
        if (active.data.current?.type === "Column") {
            const updatedColumns = arrayMove(
                columns,
                columns.findIndex((col) => col.id === active.id),
                columns.findIndex((col) => col.id === over.id)
            );
            setColumns(updatedColumns);
            updateColumnPositions(updatedColumns); // Updates column positions in Firestore
            return;
        }

        // Extract the target column's ID more flexibly
        let targetColumnId;
        if (over.data.current?.type === "Column") {
            targetColumnId = over.id;
        } else if (over.data.current?.type === "Task") {
            const targetTask = tasks.find(task => task.id === over.id);
            targetColumnId = targetTask ? targetTask.columnId : undefined;
        }

        if (targetColumnId) {
            handleTaskReorderingAndMoving(active.id, targetColumnId);
        }
    }


    async function handleTaskReorderingAndMoving(draggedId: any, targetColumnId: any) {
        const draggedTask = tasks.find(task => task.id === draggedId);

        // Return early if the draggedTask is undefined
        if (!draggedTask) return;

        let updatedTasks = [...tasks];
        if (draggedTask.columnId !== targetColumnId) {
            // Simply move task to new column if different from the current one
            updatedTasks = updatedTasks.map(task =>
                task.id === draggedId ? { ...task, columnId: targetColumnId } : task
            );
        }

        setTasks(updatedTasks);
        await updateTaskPositions(updatedTasks); // Updates tasks positions and columns in Firestore
    }


    function onDragOver(event: DragOverEvent) {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveATask = active.data.current?.type === "Task";
        const isOverATask = over.data.current?.type === "Task";

        if (!isActiveATask || !isOverATask) return;

        setTasks((tasks) => {
            const activeIndex = tasks.findIndex((t) => t.id === activeId);
            const overIndex = tasks.findIndex((t) => t.id === overId);

            let updatedTasks: Task[];

            if (tasks[activeIndex].columnId !== tasks[overIndex].columnId) {
                tasks[activeIndex].columnId = tasks[overIndex].columnId;
                updatedTasks = arrayMove(tasks, activeIndex, overIndex - 1);
            } else {
                updatedTasks = arrayMove(tasks, activeIndex, overIndex);
            }

            return updatedTasks;
        });

        const updatedTasks = tasks;

        // Update the positions of the tasks in the Firestore database
        updateTaskPositions(updatedTasks);
    }

    async function updateColumnPositions(updatedColumns: Column[]) {
        const docRef = doc(db, 'notes', KanbanBoardId);
        await updateDoc(docRef, { AllCols: updatedColumns });
    }

    async function updateTaskPositions(updatedTasks: Task[]) {
        const docRef = doc(db, 'notes', KanbanBoardId);
        await updateDoc(docRef, { AllTasks: updatedTasks });
    }

    function generateId() {
        return v4();
    }


    const getNotes = async () => {
        try {
            const data = await getDocs(notesRef);
            const filteredData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }) as any);
            setAllCols(filteredData[0].AllCols);
            setAllTasks(filteredData[0].AllTasks);
            setKanbanBoardId(filteredData[0].id)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (allCols && allTasks) {
            setColumns(allCols);
            setTasks(allTasks);
        }
    }, [allCols, allTasks]);

    return {
        allCols,
        allTasks,
        KanbanBoardId,
        getNotes,
        updateColumn,
        columnsId,
        deleteColumn,
        createNewColumn,
        createTask,
        deleteTask,
        updateTask,
        onDragEnd,
        onDragOver,
        onDragStart,
        activeColumn,
        activeTask,
        columns,
        tasks
    }
}
