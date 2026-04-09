import { create } from "zustand";
import { User } from "@/types";

interface AuthStore {
  user: User | null;
  setUser: (user: User) => void;
  cleanUser: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  cleanUser: () => set({ user: null }),
}));
