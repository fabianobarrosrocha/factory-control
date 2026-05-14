"use client";

import React, { useState, useRef } from "react";
import { Machine } from "@/types/machine.types";
import { Stock } from "@/types/stock.types";
import { Location } from "@/types/location.types";
import { Cog, Package, Box, Move, Palette } from "lucide-react";
import { getProductLabel } from "@/utils/product-label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Predefined color palette
const COLOR_PALETTE = [
  "#ef4444", // red
  "#f97316", // orange
  "#f59e0b", // amber
  "#eab308", // yellow
  "#84cc16", // lime
  "#22c55e", // green
  "#10b981", // emerald
  "#14b8a6", // teal
  "#06b6d4", // cyan
  "#0ea5e9", // sky
  "#3b82f6", // blue
  "#6366f1", // indigo
  "#8b5cf6", // violet
  "#a855f7", // purple
  "#d946ef", // fuchsia
  "#ec4899", // pink
  "#78716c", // stone
  "#64748b", // slate
];

interface LocationBlockProps {
  location: Location & {
    machines: Machine[];
    stocks: Stock[];
  };
  onDragEnd?: (id: number, position: { x: number; y: number }) => void;
  onResize?: (id: number, size: { width: number; height: number }) => void;
  onColorChange?: (id: number, color: string) => void;
  scale?: number;
  isEditMode?: boolean;
  onClick?: (id: number) => void;
  canvasWidth?: number;
  canvasHeight?: number;
}

export const LocationBlock: React.FC<LocationBlockProps> = ({
  location,
  onDragEnd,
  onResize,
  onColorChange,
  scale = 1,
  isEditMode = false,
  onClick,
  canvasWidth = 1200,
  canvasHeight = 800,
}) => {
  const blockRef = useRef<HTMLDivElement>(null);
  const [currentPos, setCurrentPos] = useState({ x: location.position_x, y: location.position_y });
  const [currentSize, setCurrentSize] = useState({ width: location.width, height: location.height });
  const [currentColor, setCurrentColor] = useState(location.color);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

  // Refs to track drag/resize state for event handlers
  const dragStateRef = useRef({
    isDragging: false,
    isResizing: false,
    startX: 0,
    startY: 0,
    startPosX: 0,
    startPosY: 0,
    startWidth: 0,
    startHeight: 0,
  });

  // Track click position to prevent click after pan
  const clickStartRef = useRef({ x: 0, y: 0, time: 0 });

  // Update current position when location changes externally
  React.useEffect(() => {
    if (!dragStateRef.current.isDragging && !dragStateRef.current.isResizing) {
      setCurrentPos({ x: location.position_x, y: location.position_y });
      setCurrentSize({ width: location.width, height: location.height });
      setCurrentColor(location.color);
    }
  }, [location.position_x, location.position_y, location.width, location.height, location.color]);

  const handleColorSelect = (color: string) => {
    setCurrentColor(color);
    setIsColorPickerOpen(false);
    if (onColorChange) {
      onColorChange(location.id, color);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isEditMode) return;
    e.preventDefault();
    e.stopPropagation();

    dragStateRef.current = {
      ...dragStateRef.current,
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      startPosX: currentPos.x,
      startPosY: currentPos.y,
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragStateRef.current.isDragging) return;

      const deltaX = (e.clientX - dragStateRef.current.startX) / scale;
      const deltaY = (e.clientY - dragStateRef.current.startY) / scale;

      let newX = dragStateRef.current.startPosX + deltaX;
      let newY = dragStateRef.current.startPosY + deltaY;

      // Clamp within canvas bounds
      newX = Math.max(0, Math.min(newX, canvasWidth - currentSize.width));
      newY = Math.max(0, Math.min(newY, canvasHeight - currentSize.height));

      setCurrentPos({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      if (dragStateRef.current.isDragging && onDragEnd) {
        // Get the current position from state at the time of mouseup
        setCurrentPos(pos => {
          onDragEnd(location.id, pos);
          return pos;
        });
      }
      dragStateRef.current.isDragging = false;
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    if (!isEditMode) return;
    e.preventDefault();
    e.stopPropagation();

    dragStateRef.current = {
      ...dragStateRef.current,
      isResizing: true,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: currentSize.width,
      startHeight: currentSize.height,
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragStateRef.current.isResizing) return;

      const deltaX = (e.clientX - dragStateRef.current.startX) / scale;
      const deltaY = (e.clientY - dragStateRef.current.startY) / scale;

      let newWidth = Math.max(100, dragStateRef.current.startWidth + deltaX);
      let newHeight = Math.max(80, dragStateRef.current.startHeight + deltaY);

      // Clamp within canvas bounds
      newWidth = Math.min(newWidth, canvasWidth - currentPos.x);
      newHeight = Math.min(newHeight, canvasHeight - currentPos.y);

      setCurrentSize({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      if (dragStateRef.current.isResizing && onResize) {
        setCurrentSize(size => {
          onResize(location.id, size);
          return size;
        });
      }
      dragStateRef.current.isResizing = false;
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleBlockMouseDown = (e: React.MouseEvent) => {
    if (isEditMode) return;
    clickStartRef.current = { x: e.clientX, y: e.clientY, time: Date.now() };
  };

  const handleClick = (e: React.MouseEvent) => {
    if (dragStateRef.current.isDragging || dragStateRef.current.isResizing) return;
    if (!isEditMode && onClick) {
      // Only trigger click if mouse didn't move much (user wasn't panning)
      const dx = Math.abs(e.clientX - clickStartRef.current.x);
      const dy = Math.abs(e.clientY - clickStartRef.current.y);
      const timeDiff = Date.now() - clickStartRef.current.time;

      // Allow click if movement < 5px and time < 300ms (quick click, not drag)
      if (dx < 5 && dy < 5 && timeDiff < 300) {
        onClick(location.id);
      }
    }
  };

  const totalStock = location.stocks?.reduce(
    (acc, stock) => acc + (stock.amount || 0),
    0
  ) || 0;

  const activeMachines = location.machines?.filter(
    (m) => m.status === 1 || m.status === "Ativo"
  ).length || 0;

  const totalMachines = location.machines?.length || 0;

  return (
    <div
      ref={blockRef}
      onMouseDown={handleBlockMouseDown}
      onClick={handleClick}
      style={{
        position: "absolute",
        left: currentPos.x,
        top: currentPos.y,
        width: currentSize.width,
        height: currentSize.height,
        cursor: isEditMode ? "default" : "pointer",
        zIndex: isEditMode ? 10 : 1,
      }}
      className={`rounded-lg border-2 shadow-lg overflow-hidden transition-shadow select-none ${
        isEditMode ? "ring-2 ring-blue-400 ring-offset-2" : "hover:shadow-xl hover:scale-[1.02]"
      }`}
    >
      {/* Drag Handle (header area) */}
      {isEditMode && (
        <div
          className="absolute top-0 left-0 right-8 h-7 cursor-grab active:cursor-grabbing z-10 flex items-center justify-center"
          onMouseDown={handleMouseDown}
        >
          <Move className="w-3 h-3 text-white/70" />
        </div>
      )}
      {/* Color Picker Button (edit mode only) */}
      {isEditMode && (
        <>
          <button
            className="absolute top-1 right-1 w-5 h-5 rounded flex items-center justify-center bg-white/20 hover:bg-white/40 z-20 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setIsColorPickerOpen(!isColorPickerOpen);
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <Palette className="w-3 h-3 text-white" />
          </button>

          {/* Color Picker Dropdown */}
          {isColorPickerOpen && (
            <div
              className="absolute top-7 right-0 z-50 bg-white rounded-lg shadow-xl border p-2 min-w-[180px]"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid grid-cols-6 gap-1">
                {COLOR_PALETTE.map((color) => (
                  <button
                    key={color}
                    className={`w-6 h-6 rounded-md border-2 transition-transform hover:scale-110 ${
                      currentColor === color ? "border-gray-800 ring-2 ring-offset-1 ring-blue-500" : "border-transparent"
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleColorSelect(color);
                    }}
                  />
                ))}
              </div>
              <div className="mt-2 pt-2 border-t">
                <label className="text-xs text-gray-500 block mb-1">Cor personalizada:</label>
                <input
                  type="color"
                  value={currentColor}
                  onChange={(e) => {
                    setCurrentColor(e.target.value);
                    if (onColorChange) {
                      onColorChange(location.id, e.target.value);
                    }
                  }}
                  className="w-full h-8 cursor-pointer rounded border"
                />
              </div>
              <button
                className="mt-2 w-full text-xs text-gray-500 hover:text-gray-700 py-1"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsColorPickerOpen(false);
                }}
              >
                Fechar
              </button>
            </div>
          )}
        </>
      )}
      {/* Header */}
      <div
        className="px-2 py-1 text-white text-xs font-semibold truncate"
        style={{ backgroundColor: currentColor }}
      >
        {location.code} - {location.name}
      </div>

      {/* Content */}
      <div
        className="p-2 h-[calc(100%-28px)] flex flex-col gap-1 text-xs"
        style={{ backgroundColor: `${currentColor}20` }}
      >
        {/* Machines */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1 text-gray-700">
                <Cog className="w-3 h-3" />
                <span>
                  {activeMachines}/{totalMachines} máquinas
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-xs">
                {totalMachines === 0 ? (
                  <p>Nenhuma máquina nesta localização</p>
                ) : (
                  location.machines?.map((machine) => (
                    <p key={machine.id}>
                      {machine.model} - {machine.machine_number} ({machine.status === 1 ? "Ativo" : "Inativo"})
                    </p>
                  ))
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Stock */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1 text-gray-700">
                <Package className="w-3 h-3" />
                <span>{totalStock} itens em estoque</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-xs">
                {(location.stocks?.length || 0) === 0 ? (
                  <p>Nenhum estoque nesta localização</p>
                ) : (
                  location.stocks?.map((stock) => (
                    <p key={stock.id}>
                      {stock.product ? getProductLabel(stock.product as any) : `Produto ${stock.product_id}`}: {stock.amount}
                    </p>
                  ))
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Production Status Indicator */}
        {totalMachines > 0 && (
          <div className="flex items-center gap-1 mt-auto">
            <Box className="w-3 h-3" />
            <div
              className={`w-2 h-2 rounded-full ${
                activeMachines > 0 ? "bg-green-500 animate-pulse" : "bg-gray-400"
              }`}
            />
            <span className="text-gray-600 text-[10px]">
              {activeMachines > 0 ? "Produzindo" : "Parado"}
            </span>
          </div>
        )}
      </div>

      {/* Resize Handle (bottom-right corner) */}
      {isEditMode && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-20 group"
          onMouseDown={handleResizeMouseDown}
        >
          <div className="absolute bottom-1 right-1 w-2 h-2 border-b-2 border-r-2 border-blue-500 group-hover:border-blue-700" />
        </div>
      )}
    </div>
  );
};

export default LocationBlock;
