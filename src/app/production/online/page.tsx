"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Aside from "@/components/Aside";
import Spinner from "@/components/Spinner";
import Header from "@/components/Header";
import { LocationBlock } from "@/components/LocationBlock";
import { Location, LocationPositionUpdate } from "@/types/location.types";
import { Machine } from "@/types/machine.types";
import { Stock } from "@/types/stock.types";
import { Button } from "@/components/ui/button";
import { Save, ZoomIn, ZoomOut, RotateCcw, Maximize2, Eye, Edit3, Hand } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

type LocationWithDetails = Location & {
  machines: Machine[];
  stocks: Stock[];
};

type DashboardData = {
  locations: LocationWithDetails[];
};

// Canvas size limits
const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 800;

export default function Page() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [scale, setScale] = useState<number>(1);
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [pendingPositions, setPendingPositions] = useState<Map<number, { x: number; y: number }>>(new Map());
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const panStateRef = useRef({ isPanning: false, startX: 0, startY: 0, startOffsetX: 0, startOffsetY: 0 });
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    try {
      const resp = await axios.get("/api/locations/dashboard/data");
      setData(resp.data.data);
    } catch (err) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os dados do dashboard."
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-fit to screen in view mode
  useEffect(() => {
    if (!isEditMode && containerRef.current && data && data.locations.length > 0) {
      const container = containerRef.current;
      const containerWidth = container.clientWidth - 40;
      const containerHeight = container.clientHeight - 40;

      const scaleX = containerWidth / CANVAS_WIDTH;
      const scaleY = containerHeight / CANVAS_HEIGHT;
      const newScale = Math.min(scaleX, scaleY, 1);

      setScale(Math.max(0.3, newScale));
      setPanOffset({ x: 0, y: 0 });
    }
  }, [isEditMode, data]);

  const [pendingSizes, setPendingSizes] = useState<Map<number, { width: number; height: number }>>(new Map());
  const [pendingColors, setPendingColors] = useState<Map<number, string>>(new Map());

  const handleDragEnd = (id: number, position: { x: number; y: number }) => {
    // Update local state for immediate visual feedback
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        locations: prev.locations.map((loc) =>
          loc.id === id ? { ...loc, position_x: position.x, position_y: position.y } : loc
        )
      };
    });

    // Track pending changes
    setPendingPositions((prev) => {
      const updated = new Map(prev);
      updated.set(id, position);
      return updated;
    });
    setHasChanges(true);
  };

  const handleResize = (id: number, size: { width: number; height: number }) => {
    // Update local state for immediate visual feedback
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        locations: prev.locations.map((loc) =>
          loc.id === id ? { ...loc, width: size.width, height: size.height } : loc
        )
      };
    });

    // Track pending changes
    setPendingSizes((prev) => {
      const updated = new Map(prev);
      updated.set(id, size);
      return updated;
    });
    setHasChanges(true);
  };

  const handleColorChange = (id: number, color: string) => {
    // Update local state for immediate visual feedback
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        locations: prev.locations.map((loc) => (loc.id === id ? { ...loc, color } : loc))
      };
    });

    // Track pending changes
    setPendingColors((prev) => {
      const updated = new Map(prev);
      updated.set(id, color);
      return updated;
    });
    setHasChanges(true);
  };

  const handleSavePositions = async () => {
    if (pendingPositions.size === 0 && pendingSizes.size === 0 && pendingColors.size === 0) return;

    setIsSaving(true);
    try {
      // Combine positions, sizes and colors into updates
      const allIds = new Set([...pendingPositions.keys(), ...pendingSizes.keys(), ...pendingColors.keys()]);
      const updates = Array.from(allIds).map((id) => {
        const position = pendingPositions.get(id);
        const size = pendingSizes.get(id);
        const color = pendingColors.get(id);
        const location = data?.locations.find((l) => l.id === id);

        return {
          id,
          position_x: position?.x ?? location?.position_x ?? 0,
          position_y: position?.y ?? location?.position_y ?? 0,
          width: size?.width ?? location?.width ?? 100,
          height: size?.height ?? location?.height ?? 100,
          color: color ?? location?.color
        };
      });

      await axios.patch("/api/locations/positions/batch", { updates });

      toast({
        title: "Alterações salvas",
        description: "As alterações foram salvas com sucesso."
      });

      setPendingPositions(new Map());
      setPendingSizes(new Map());
      setPendingColors(new Map());
      setHasChanges(false);
    } catch (err) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Não foi possível salvar as alterações."
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.1, 0.3));
  };

  const handleResetZoom = () => {
    setScale(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleFitToScreen = () => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const containerWidth = container.clientWidth - 40;
    const containerHeight = container.clientHeight - 40;

    const scaleX = containerWidth / CANVAS_WIDTH;
    const scaleY = containerHeight / CANVAS_HEIGHT;
    const newScale = Math.min(scaleX, scaleY, 1);

    setScale(Math.max(0.3, newScale));
    setPanOffset({ x: 0, y: 0 });
  };

  // Pan handlers (works in both modes - blocks have stopPropagation)
  const handlePanStart = (e: React.MouseEvent) => {
    e.preventDefault();

    panStateRef.current = {
      isPanning: true,
      startX: e.clientX,
      startY: e.clientY,
      startOffsetX: panOffset.x,
      startOffsetY: panOffset.y
    };
    setIsPanning(true);

    const handlePanMove = (e: MouseEvent) => {
      if (!panStateRef.current.isPanning) return;

      const deltaX = e.clientX - panStateRef.current.startX;
      const deltaY = e.clientY - panStateRef.current.startY;

      setPanOffset({
        x: panStateRef.current.startOffsetX + deltaX,
        y: panStateRef.current.startOffsetY + deltaY
      });
    };

    const handlePanEnd = () => {
      panStateRef.current.isPanning = false;
      setIsPanning(false);
      window.removeEventListener("mousemove", handlePanMove);
      window.removeEventListener("mouseup", handlePanEnd);
    };

    window.addEventListener("mousemove", handlePanMove);
    window.addEventListener("mouseup", handlePanEnd);
  };

  const handleResetPan = () => {
    setPanOffset({ x: 0, y: 0 });
  };

  const toggleEditMode = () => {
    if (isEditMode && hasChanges) {
      // Warn before leaving edit mode with unsaved changes
      if (!confirm("Você tem alterações não salvas. Deseja sair do modo de edição?")) {
        return;
      }
      // Discard changes and refetch
      fetchData();
      setPendingPositions(new Map());
      setPendingSizes(new Map());
      setPendingColors(new Map());
      setHasChanges(false);
    }
    setIsEditMode(!isEditMode);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleLocationClick = (id: number) => {
    router.push(`/production/online/${id}`);
  };

  return (
    <>
      {isLoading && (
        <div className="fullscreen-spinner">
          <Spinner visible={true} color="default" message="Loading Page..." />
        </div>
      )}
      <div className="page-layout">
        <nav className="aside-layout">
          <Aside />
        </nav>
        <main className="main-layout flex flex-col overflow-hidden">
          <Header title="Online" />

          {/* Toolbar */}
          <div className="flex items-center gap-2 p-3 border-b bg-white flex-shrink-0">
            {/* Mode Toggle */}
            <Button
              variant={isEditMode ? "default" : "outline"}
              size="sm"
              onClick={toggleEditMode}
              className={isEditMode ? "bg-blue-600 hover:bg-blue-700" : ""}
            >
              {isEditMode ? (
                <>
                  <Edit3 className="w-4 h-4 mr-2" />
                  Modo Edição
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  Modo Visualização
                </>
              )}
            </Button>

            <div className="w-px h-6 bg-gray-300 mx-2" />

            {/* Zoom Controls */}
            <Button variant="outline" size="sm" onClick={handleZoomOut} disabled={scale <= 0.3}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm text-gray-600 w-16 text-center">{Math.round(scale * 100)}%</span>
            <Button variant="outline" size="sm" onClick={handleZoomIn} disabled={scale >= 2}>
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleResetZoom}>
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleFitToScreen}>
              <Maximize2 className="w-4 h-4" />
            </Button>

            {/* Reset Pan Button (when panned) */}
            {(panOffset.x !== 0 || panOffset.y !== 0) && (
              <Button variant="outline" size="sm" onClick={handleResetPan}>
                <Hand className="w-4 h-4 mr-1" />
                Centralizar
              </Button>
            )}

            <div className="flex-1" />

            {/* Save Button (only in edit mode) */}
            {isEditMode && (
              <>
                {hasChanges && <span className="text-sm text-amber-600">Alterações não salvas</span>}
                <Button onClick={handleSavePositions} disabled={!hasChanges || isSaving} size="sm">
                  {isSaving ? (
                    <>
                      <Spinner visible={true} color="default" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Salvar Posições
                    </>
                  )}
                </Button>
              </>
            )}
          </div>

          {/* Map Container */}
          <div
            ref={containerRef}
            className={`flex-1 overflow-hidden bg-gray-100 flex items-center justify-center min-h-0 ${
              isPanning ? "cursor-grabbing" : "cursor-grab"
            }`}
            onMouseDown={handlePanStart}
          >
            <div
              className="relative bg-white rounded-lg shadow-lg border-2 border-gray-300"
              style={{
                width: CANVAS_WIDTH,
                height: CANVAS_HEIGHT,
                transform: `scale(${scale}) translate(${panOffset.x / scale}px, ${panOffset.y / scale}px)`,
                transformOrigin: "center center"
              }}
            >
              {/* Grid Background */}
              <div
                className="absolute inset-0 opacity-20 rounded-lg"
                style={{
                  backgroundImage:
                    "linear-gradient(#ccc 1px, transparent 1px), linear-gradient(90deg, #ccc 1px, transparent 1px)",
                  backgroundSize: "50px 50px"
                }}
              />

              {/* Location Blocks */}
              {data?.locations.map((location) => (
                <LocationBlock
                  key={location.id}
                  location={location}
                  onDragEnd={handleDragEnd}
                  onResize={handleResize}
                  onColorChange={handleColorChange}
                  scale={scale}
                  isEditMode={isEditMode}
                  onClick={handleLocationClick}
                  canvasWidth={CANVAS_WIDTH}
                  canvasHeight={CANVAS_HEIGHT}
                />
              ))}

              {/* Empty State */}
              {data?.locations.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <p className="text-lg font-medium">Nenhuma localização cadastrada</p>
                    <p className="text-sm">Cadastre localizações em Cadastro &gt; Localizações</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Legend */}
          <div className="p-2 border-t bg-white flex items-center gap-6 text-xs text-gray-600 flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
              <span>Produzindo</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-400" />
              <span>Parado</span>
            </div>
            <div className="text-gray-400">|</div>
            {isEditMode ? (
              <span className="text-blue-600 font-medium">
                Arraste blocos pelo cabeçalho | Redimensione pelo canto | Arraste o fundo para navegar
              </span>
            ) : (
              <span>Arraste para navegar | Clique em um bloco para ver detalhes</span>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
