import { create } from "zustand";
import { Organization } from "@/types";

interface OrgStore {
  activeOrg: Organization | null;
  setActiveOrg: (org: Organization) => void;
  clearOrg: () => void;
}

export const useOrgStore = create<OrgStore>((set) => ({
  activeOrg: null,
  setActiveOrg: (org) => set({ activeOrg: org }),
  clearOrg: () => set({ activeOrg: null }),
}));
