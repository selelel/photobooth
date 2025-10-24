import { Layer, Stage } from "react-konva";

// Relaxed component aliases to avoid JSX typing conflicts from react-konva types
export const KStage = Stage as unknown as React.ComponentType<any>;
export const KLayer = Layer as unknown as React.ComponentType<any>;