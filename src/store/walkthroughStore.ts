import { create } from 'zustand';

export interface WalkthroughStep {
  selector: string;
  content: React.ReactNode | string;
  page: string; // route path
  placement?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end'; // Add align for arrow positioning
  stageRadius?: number;
  stagePadding?: number;
  advanceOn?: 'both' | 'description' | 'ui'; // Per-step control
  setCategory?: string; // For walkthrough UI sync
  onAdvance?: string; // For custom UI sync actions
}

type TrainingKey = 'order' | 'table' | 'teamchat' | 'settings' | 'orderHistory' | 'profile';

interface WalkthroughState {
  steps: WalkthroughStep[];
  currentStep: number;
  isActive: boolean;
  completed: boolean;
  activeTraining: TrainingKey | null;
  completedTrainings: Record<TrainingKey, boolean>;
  trainingInstanceId: number;
  settingsHighlight: "profile" |"notifications"|"security"|"work"|"clockinout"|"support"|"contact-support"|"notifications-reset"|"";
  startTraining: (training: TrainingKey, steps: WalkthroughStep[]) => void;
  next: () => void;
  back: () => void;
  skip: () => void;
  goTo: (step: number) => void;
  complete: () => void;
  reset: () => void;
  setSettingsHighlight: (highlight:string) => void;
}

export const useWalkthroughStore = create<WalkthroughState>((set, get) => ({
  steps: [],
  currentStep: 0,
  isActive: false,
  completed: false,
  activeTraining: null,
  completedTrainings: { order: false, table: false, teamchat: false, settings: false, orderHistory: false, profile: false },
  trainingInstanceId: 0,
  settingsHighlight: "",
  startTraining: (training, steps) => set((state) => ({
    steps,
    currentStep: 0,
    isActive: true,
    completed: false,
    activeTraining: training,
    trainingInstanceId: state.trainingInstanceId + 1,
  })),
  next: () => {
    const { currentStep, steps, activeTraining, completedTrainings } = get();
    if (currentStep < steps.length - 1) {
      set({ currentStep: currentStep + 1 });
    } else {
      // Mark this training as complete
      if (activeTraining) {
        set({ completedTrainings: { ...completedTrainings, [activeTraining]: true }, isActive: false, completed: true });
      } else {
        set({ isActive: false, completed: true });
      }
    }
  },
  back: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 0) })),
  skip: () => set({ isActive: false }),
  goTo: (step) => set({ currentStep: step }),
  complete: () => set({ isActive: false, completed: true }),
  reset: () => set((state) => ({
    steps: [],
    currentStep: 0,
    isActive: false,
    completed: false,
    activeTraining: null,
    trainingInstanceId: state.trainingInstanceId + 1,
  })),
  setSettingsHighlight: (highlight) => set({ settingsHighlight: highlight as WalkthroughState["settingsHighlight"] })
}));