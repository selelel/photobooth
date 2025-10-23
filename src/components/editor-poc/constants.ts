// Paper dimensions and editor constants
export const PAPER_WIDTH = 900;
export const PAPER_HEIGHT = 600;

// Default background color
export const DEFAULT_BACKGROUND_COLOR = '#ffffff';

// Initial pictures configuration
export const INITIAL_PICTURES_LANDSCAPE_5 = [
  {
    id: "pic-background",
    x: 0,
    y: 0,
    width: 900,
    height: 600,
    src: "/background.png",
    label: "Background"
  },
  {
    id: "pic-1",
    x: 27,
    y: 69,
    width: 260,
    height: 172,
    src: "/test.jpg",
    label: "Photo Booth"
  },
  {
    id: "pic-2",
    x: 320,
    y: 69,
    width: 260,
    height: 172,
    src: "/test.jpg",
    label: "Guest One"
  },
  {
    id: "pic-3",
    x: 613,
    y: 69,
    width: 260,
    height: 172,
    src: "/test.jpg",
    label: "Guest One"
  },
  {
    id: "pic-4",
    x: 27,
    y: 359,
    width: 260,
    height: 172,
    src: "/test.jpg",
    label: "Guest One"
  },
  {
    id: "pic-5",
    x: 320,
    y: 359,
    width: 260,
    height: 172,
    src: "/test.jpg",
    label: "Guest One"
  }
];

export const INITIAL_PICTURES_LANDSCAPE_4 = [
  { "id": "pic-1", "x": 426, "y": 43, "width": 445, "height": 294, "src": "/test.jpg", "label": "Guest One" }, { "id": "pic-4", "x": 27, "y": 359, "width": 260, "height": 172, "src": "/test.jpg", "label": "Guest One" }, { "id": "pic-5", "x": 320, "y": 359, "width": 260, "height": 172, "src": "/test.jpg", "label": "Guest One" }, { "id": "pic-6", "x": 613, "y": 359, "width": 260, "height": 172, "src": "/test.jpg", "label": "Guest One" }
];

// Picture shape type
export type PictureShape = { 
  id: string;                               
  x: number; 
  y: number; 
  width: number; 
  height: number; 
  src?: string; 
  label?: string; 
  bgColor?: string; 
};

// Default picture properties
export const DEFAULT_PICTURE_WIDTH = 100;
export const DEFAULT_PICTURE_HEIGHT = 100;
export const DEFAULT_PICTURE_BG_COLOR = '#e5e7eb';

// Grid distribution constants
export const GRID_MARGIN = 20;
export const MIN_SHAPE_SIZE = 5;
