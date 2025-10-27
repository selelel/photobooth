import { create } from 'zustand';
import { INITIAL_PICTURES_LANDSCAPE_4, INITIAL_PICTURES_PORTRAIT_2 } from '@/components/editor-poc';

export type PictureTemplate = { 
  id: string;                               
  x: number; 
  y: number; 
  width: number; 
  height: number; 
  src?: string; 
  label?: string; 
  bgColor?: string;
};

export type State = {
  bgColor: string;
  selectedId?: string | null;
  showGrid: boolean;
  showMargins: boolean;
  enableSnapping: boolean;
  alignmentGuides: { vertical?: number; horizontal?: number };
  pictureTemplate: PictureTemplate[];
  bgPicture?: PictureTemplate;
  templateName: string;
  eventName: string;
  orientation: "portrait" | "landscape";
  eventLogo?: Base64URLString;
};

export type Actions = {
  // Background actions
  setBgColor: (color: string) => void;
  setBgPicture: (picture: PictureTemplate) => void;
  setOnChangeBgPicture: (updates: Partial<PictureTemplate>) => void;

  // Selection actions
  setSelectedId: (id: string | null) => void;

  // UI toggle actions
  setShowGrid: (show: boolean) => void;
  setShowMargins: (show: boolean) => void;
  setEnableSnapping: (enable: boolean) => void;
  setAlignmentGuides: (show: State['alignmentGuides']) => void;

  // Template actions
  setPictureTemplate: (pictures: PictureTemplate[]) => void;
  setOnChangePicture: (updates: Partial<PictureTemplate>) => void;
  addPicture: (picture: PictureTemplate) => void;
  updatePicture: (id: string, updates: Partial<PictureTemplate>) => void;
  removePicture: (id: string) => void;
  clearPictures: () => void;

  // Template metadata actions
  setTemplateName: (name: string) => void;
  setEventName: (name: string) => void;
  setOrientation: (orientation: "portrait" | "landscape") => void;
  setEventLogo: (logo: Base64URLString) => void;

  // Reset action
  resetStore: () => void;
};

const Initial_Values: State = {
  bgColor: "#fff",
  selectedId: null,
  showGrid: true,
  showMargins: true,
  enableSnapping: true,
  alignmentGuides: {},
  pictureTemplate: INITIAL_PICTURES_LANDSCAPE_4,
  bgPicture: INITIAL_PICTURES_PORTRAIT_2.find(p => p.id === "pic-background"),
  templateName: "",
  eventName: "",
  orientation: "landscape",
  eventLogo: undefined,
};

export const useEditorStore = create<State & Actions>((set) => ({
  ...Initial_Values,

  // Background actions
  setBgColor: (color) => set({ bgColor: color }),
  setBgPicture: (picture) => set({ bgPicture: picture }),
  // Selection actions
  setSelectedId: (id) => set({ selectedId: id }),

  // UI toggle actions
  setShowGrid: (show) => set({ showGrid: show }),
  setShowMargins: (show) => set({ showMargins: show }),
  setEnableSnapping: (enable) => set({ enableSnapping: enable }),
  setAlignmentGuides: (show) => set({ alignmentGuides: show }),

  // Template actions
  setPictureTemplate: (pictures) => set({ pictureTemplate: pictures }),
  setOnChangePicture: (updates) =>
    set((state) => {
      // Create a new array (new reference)
      const updatedPictures = state.pictureTemplate.map((p) =>
        p.id === updates.id ? { ...p, ...updates } : p
      );
  
      return { pictureTemplate: [...updatedPictures] }; // ensures a new array reference
    }),
  
  setOnChangeBgPicture: (updates) =>
    set((state) => {
      const updatedPictures = state.pictureTemplate.map((p) =>
        p.id === "pic-background" ? { ...p, ...updates } : p
      );
  
      return { pictureTemplate: [...updatedPictures] }; // also a new array reference
    }),
  addPicture: (picture) =>
    set((state) => ({ pictureTemplate: [...state.pictureTemplate, picture] })),
  updatePicture: (id, updates) =>
    set((state) => ({
      pictureTemplate: state.pictureTemplate.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    })),
  removePicture: (id) =>
    set((state) => ({
      pictureTemplate: state.pictureTemplate.filter((p) => p.id !== id),
    })),
  clearPictures: () => set({ pictureTemplate: [] }),

  // Template metadata
  setTemplateName: (name) => set({ templateName: name }),
  setEventName: (name) => set({ eventName: name }),
  setOrientation: (orientation) => set({ orientation }),
  setEventLogo: (logo) => set({ eventLogo: logo }),

  // Reset
  resetStore: () => set(Initial_Values),
}));