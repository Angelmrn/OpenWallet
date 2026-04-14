import { create } from "zustand";

interface ActiveOrg {
  id: string;
  name: string;
  role: "owner" | "member";
}

interface OrgStore {
  activeOrg: ActiveOrg | null;
  setActiveOrg: (org: ActiveOrg) => void;
  clearOrg: () => void;
}

export const useOrgStore = create<OrgStore>((set) => ({
  activeOrg: null,
  setActiveOrg: (org) => set({ activeOrg: org }),
  clearOrg: () => set({ activeOrg: null }),
}));
