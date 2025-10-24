// Paper dimensions and editor constants
export const PAPER_WIDTH = 600;
export const PAPER_HEIGHT = 900;

// Default background color
export const DEFAULT_BACKGROUND_COLOR = '#d28383';

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

export const INITIAL_PICTURES_PORTRAIT_5 = [
  { "id": "pic-1", "x": 25, "y": 30, "width": 260, "height": 172, "src": "/test.jpg", "label": "Photo Booth" },
  { "id": "pic-2", "x": 315, "y": 30, "width": 260, "height": 172, "src": "/test.jpg", "label": "Guest One" }, 
  { "id": "pic-3", "x": 25, "y": 275, "width": 260, "height": 172, "src": "/test.jpg", "label": "Guest One" },
  { "id": "pic-4", "x": 315, "y": 275, "width": 260, "height": 172, "src": "/test.jpg", "label": "Guest One" }, 
  { "id": "pic-5", "x": 25, "y": 657, "width": 260, "height": 172, "src": "/test.jpg", "label": "Guest One" }]

export const INITIAL_PICTURES_LANDSCAPE_4 = [
  { "id": "pic-1", "x": 20, "y": 375, "width": 273, "height": 197, "src": "/test.jpg", "label": "Guest One" },
  { "id": "pic-2", "x": 313, "y": 375, "width": 273, "height": 197, "src": "/test.jpg", "label": "Guest One" },
  { "id": "pic-3", "x": 607, "y": 375, "width": 273, "height": 197, "src": "/test.jpg", "label": "Guest One" },
  { "id": "pic-4", "x": 420, "y": 28, "width": 458, "height": 330, "src": "/test.jpg", "label": "Guest One" }
];

export const INITIAL_PICTURES_LANDSCAPE_3 = [ { "id": "pic-1", "x": 20, "y": 202, "width": 273, "height": 197, "src": "/test.jpg", "label": "Guest One" }, { "id": "pic-2", "x": 314, "y": 202, "width": 273, "height": 197, "src": "/test.jpg", "label": "Guest One" }, { "id": "pic-3", "x": 607, "y": 202, "width": 273, "height": 197, "src": "/test.jpg", "label": "Guest One" } ]

export const INITIAL_PICTURES_LANDSCAPE_2 = [ 
  { "id": "pic-2", "x": 20, "y": 144, "width": 420, "height": 311, "src": "/test.jpg", "label": "Guest One" }, { "id": "pic-2-2", "x": 460, "y": 144, "width": 420, "height": 311, "src": "/test.jpg", "label": "Guest One" }]

  export const INITIAL_PICTURES_LANDSCAPE_1 = [ { "id": "pic-2", "x": 95, "y": 37, "width": 710, "height": 526, "src": "/test.jpg", "label": "Guest One" } ]
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
