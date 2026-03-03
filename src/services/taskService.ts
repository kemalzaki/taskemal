import type { Task } from '../types/task';

const TASKS_KEY = 'tasks';

export const taskService = {
  getAllTasks: (): Task[] => {
    try {
      const tasks = localStorage.getItem(TASKS_KEY);
      return tasks ? JSON.parse(tasks) : [];
    } catch (error) {
      console.error('Error loading tasks from localStorage:', error);
      return [];
    }
  },

  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'status'>): Task => {
    const tasks = taskService.getAllTasks();
    const newTask: Task = {
      id: Date.now().toString(),
      ...task,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    tasks.push(newTask);
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    return newTask;
  },

  updateTaskStatus: (id: string, status: 'pending' | 'completed'): Task | null => {
    const tasks = taskService.getAllTasks();
    const taskIndex = tasks.findIndex((task: Task) => task.id === id);

    if (taskIndex === -1) return null;

    tasks[taskIndex] = { ...tasks[taskIndex], status };
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    return tasks[taskIndex];
  },

  deleteTask: (id: string): boolean => {
    const tasks = taskService.getAllTasks();
    const initialLength = tasks.length;
    const filteredTasks = tasks.filter((task: Task) => task.id !== id);

    if (filteredTasks.length === initialLength) return false;

    localStorage.setItem(TASKS_KEY, JSON.stringify(filteredTasks));
    return true;
  }
};
