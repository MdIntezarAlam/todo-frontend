import { type Data } from '@/types/todoTypes';
import { create } from 'zustand';

interface ITodoState {
  currentTodo: Data | null;
  setCurrentTodo: (todo: Data | null) => void;
}

export const useTodo = create<ITodoState>((set) => ({
  currentTodo: null,
  setCurrentTodo: (todo) => set({ currentTodo: todo }),
}));
