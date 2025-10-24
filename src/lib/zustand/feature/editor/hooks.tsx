import { useEditorStore } from "./store";

export const useBgColor = () => useEditorStore((s) => s.bgColor)
export const useSetBgColor = () => useEditorStore((s) => s.setBgColor)
export const useBgPicture = () => useEditorStore((s) => s.bgPicture)
export const useSetBgPicture = () => useEditorStore((s) => s.setBgPicture)

// Selection
export const useSelectedId = () => useEditorStore((s) => s.selectedId)
export const useSetSelectedId = () => useEditorStore((s) => s.setSelectedId)

// UI Toggles
export const useShowGrid = () => useEditorStore((s) => s.showGrid)
export const useSetShowGrid = () => useEditorStore((s) => s.setShowGrid)
export const useShowMargins = () => useEditorStore((s) => s.showMargins)
export const useSetShowMargins = () => useEditorStore((s) => s.setShowMargins)
export const useEnableSnapping = () => useEditorStore((s) => s.enableSnapping)
export const useSetEnableSnapping = () => useEditorStore((s) => s.setEnableSnapping)
export const useAlignmentGuides = () => useEditorStore((s) => s.alignmentGuides)
export const useSetAlignmentGuides = () => useEditorStore((s) => s.setAlignmentGuides)

// Template Pictures
export const usePictures = () => useEditorStore((s) => s.pictureTemplate)
export const useAddPicture = () => useEditorStore((s) => s.addPicture)
export const useUpdatePicture = () => useEditorStore((s) => s.updatePicture)
export const useRemovePicture = () => useEditorStore((s) => s.removePicture)
export const useClearPictures = () => useEditorStore((s) => s.clearPictures)

// Metadata
export const useTemplateName = () => useEditorStore((s) => s.templateName)
export const useSetTemplateName = () => useEditorStore((s) => s.setTemplateName)
export const useEventName = () => useEditorStore((s) => s.eventName)
export const useSetEventName = () => useEditorStore((s) => s.setEventName)
export const useOrientation = () => useEditorStore((s) => s.orientation)
export const useSetOrientation = () => useEditorStore((s) => s.setOrientation)
export const useEventLogo = () => useEditorStore((s) => s.eventLogo)
export const useSetEventLogo = () => useEditorStore((s) => s.setEventLogo)

// Reset
export const useResetEditor = () => useEditorStore((s) => s.resetStore)