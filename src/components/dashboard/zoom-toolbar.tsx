"use client";

import { ZoomIn, ZoomOut } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

export function ZoomToolbar({
  zoom,
  setZoom,
}: {
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
}) {
  const handleSliderChange = (value: number[]) => setZoom(value[0]);

  return (
    <div
      className={cn(
        "absolute bottom-6 right-6 z-50 flex items-center gap-4",
        "rounded-2xl border border-gray-200 dark:border-neutral-700",
        "bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl",
        "px-5 py-3 shadow-lg transition-all duration-200"
      )}
    >
      {/* Zoom Out Button */}
      <button
        onClick={() => setZoom((z: number) => Math.max(0.5, z / 1.1))}
        className={cn(
          "flex items-center justify-center w-9 h-9 rounded-full",
          "bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-200",
          "hover:bg-gray-200 dark:hover:bg-neutral-700",
          "transition-all active:scale-90"
        )}
        title="Zoom out"
      >
        <ZoomOut size={18} />
      </button>

      {/* Slider */}
      <div className="w-36 flex items-center">
        <Slider
          min={0.5}
          max={3}
          step={0.1}
          value={[zoom]}
          onValueChange={handleSliderChange}
          className="w-full"
        />
      </div>

      {/* Zoom In Button */}
      <button
        onClick={() => setZoom((z: number) => Math.min(3, z * 1.1))}
        className={cn(
          "flex items-center justify-center w-9 h-9 rounded-full",
          "bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-200",
          "hover:bg-gray-200 dark:hover:bg-neutral-700",
          "transition-all active:scale-90"
        )}
        title="Zoom in"
      >
        <ZoomIn size={18} />
      </button>

      {/* Zoom Percentage */}
      <span className="text-sm font-semibold text-gray-800 dark:text-gray-100 w-12 text-center select-none">
        {Math.round(zoom * 100)}%
      </span>
    </div>
  );
}