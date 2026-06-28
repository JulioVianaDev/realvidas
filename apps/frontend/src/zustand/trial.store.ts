import { create } from "zustand";
import { ITrialEntity } from "@global-types/entities/trial.entity-type";

interface TrialState {
    // Dialog state
    isDialogOpen: boolean;
    openDialog: () => void;
    closeDialog: () => void;

    // Current trial data
    currentTrial: ITrialEntity | null;
    setCurrentTrial: (trial: ITrialEntity | null) => void;

    // Enterprise ID for which we're checking trial
    enterpriseId: string | null;
    setEnterpriseId: (enterpriseId: string | null) => void;

    // Trial status
    hasActiveTrial: boolean;
    hasExpiredTrial: boolean;
    canStartTrial: boolean;
    
    setHasActiveTrial: (value: boolean) => void;
    setHasExpiredTrial: (value: boolean) => void;
    setCanStartTrial: (value: boolean) => void;

    // Reset all state
    reset: () => void;
}

const initialState = {
    isDialogOpen: false,
    currentTrial: null,
    enterpriseId: null,
    hasActiveTrial: false,
    hasExpiredTrial: false,
    canStartTrial: false,
};

export const useTrialStore = create<TrialState>((set) => ({
    ...initialState,

    openDialog: () => set({ isDialogOpen: true }),
    closeDialog: () => set({ isDialogOpen: false }),

    setCurrentTrial: (trial) => set({ currentTrial: trial }),
    setEnterpriseId: (enterpriseId) => set({ enterpriseId }),

    setHasActiveTrial: (value) => set({ hasActiveTrial: value }),
    setHasExpiredTrial: (value) => set({ hasExpiredTrial: value }),
    setCanStartTrial: (value) => set({ canStartTrial: value }),

    reset: () => set(initialState),
}));

