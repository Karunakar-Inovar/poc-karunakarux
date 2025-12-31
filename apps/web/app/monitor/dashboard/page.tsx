"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Icon,
  StatsCard,
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  Snackbar,
  useSnackbar,
} from "ui";
import {
  Search,
  XCircle,
  AlertTriangle,
  AlertCircle,
  Bookmark,
  Camera,
  BarChart,
  Bell,
  Maximize2,
  Minimize2,
  Square,
  RefreshCw,
  Play,
  X,
} from "ui/src/utils/icons";

export default function MonitorDashboard() {
  const router = useRouter();
  const [selectedPipeline, setSelectedPipeline] = React.useState("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [layout, setLayout] = React.useState("3x3");
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [isPipelineRunning, setIsPipelineRunning] = React.useState(true);
  const [showStopDialog, setShowStopDialog] = React.useState(false);
  const snackbar = useSnackbar();

  // Calculate grid columns and max cameras based on layout
  const getLayoutConfig = (layout: string) => {
    switch (layout) {
      case "2x2":
        return { cols: 2, maxCameras: 4 };
      case "3x3":
        return { cols: 3, maxCameras: 9 };
      case "4x4":
        return { cols: 4, maxCameras: 16 };
      default:
        return { cols: 2, maxCameras: 4 };
    }
  };

  const layoutConfig = getLayoutConfig(layout);

  // Pipeline definitions with their cameras
  const pipelines = {
    all: {
      id: "all",
      name: "All Pipelines",
      cameras: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    },
    "defect-detection": {
      id: "defect-detection",
      name: "Defect Detection Pipeline",
      cameras: [1, 2, 4], // Assembly Line 1, 2, Quality Control
    },
    "safety-monitoring": {
      id: "safety-monitoring",
      name: "Safety Monitoring Pipeline",
      cameras: [3, 5, 6], // Welding Station, Packaging Lines
    },
  };

  // Mock camera feeds data
  const allCameraFeeds = [
    {
      id: 1,
      name: "Assembly Line 1",
      location: "Production Floor A",
      alerts: 2,
      status: "alert",
      pipeline: "defect-detection",
    },
    {
      id: 2,
      name: "Assembly Line 2",
      location: "Production Floor A",
      alerts: 0,
      status: "live",
      pipeline: "defect-detection",
    },
    {
      id: 3,
      name: "Welding Station 1",
      location: "Production Floor B",
      alerts: 0,
      status: "live",
      pipeline: "safety-monitoring",
    },
    {
      id: 4,
      name: "Quality Control Station",
      location: "Production Floor A",
      alerts: 1,
      status: "alert",
      pipeline: "defect-detection",
    },
    {
      id: 5,
      name: "Packaging Line 1",
      location: "Production Floor C",
      alerts: 0,
      status: "live",
      pipeline: "safety-monitoring",
    },
    {
      id: 6,
      name: "Packaging Line 2",
      location: "Production Floor C",
      alerts: 0,
      status: "live",
      pipeline: "safety-monitoring",
    },
    {
      id: 7,
      name: "Storage Area 1",
      location: "Warehouse",
      alerts: 0,
      status: "live",
      pipeline: "all",
    },
    {
      id: 8,
      name: "Storage Area 2",
      location: "Warehouse",
      alerts: 0,
      status: "live",
      pipeline: "all",
    },
    {
      id: 9,
      name: "Loading Dock 1",
      location: "Warehouse",
      alerts: 0,
      status: "live",
      pipeline: "all",
    },
  ];

  // Get current pipeline info
  const currentPipeline = pipelines[selectedPipeline as keyof typeof pipelines] || pipelines.all;

  // Filter cameras based on selected pipeline
  const pipelineFilteredCameras = selectedPipeline === "all"
    ? allCameraFeeds
    : allCameraFeeds.filter((camera) => 
        currentPipeline.cameras.includes(camera.id)
      );

  // Filter cameras based on search query
  const filteredCameras = pipelineFilteredCameras.filter((camera) =>
    camera.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    camera.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Limit cameras based on selected layout
  const displayedCameras = filteredCameras.slice(0, layoutConfig.maxCameras);

  // Handle fullscreen grid
  const handleFullscreen = () => {
    setIsFullscreen(true);
  };

  const handleCloseFullscreen = () => {
    setIsFullscreen(false);
  };

  // Handle stop pipeline
  const handleStopPipeline = () => {
    setShowStopDialog(true);
  };

  const handleConfirmStop = () => {
    setIsPipelineRunning(false);
    setShowStopDialog(false);
    snackbar.warning("Pipeline has been stopped. All camera feeds are now offline.");
  };

  // Handle refresh
  const handleRefresh = () => {
    snackbar.info("Refreshing camera feeds...");
    // In a real app, this would trigger a data refresh
    setTimeout(() => {
      snackbar.success("Camera feeds refreshed successfully.");
    }, 1000);
  };

  const alerts = [
    {
      id: 1,
      title: "Defect Rate Exceeded Threshold",
      location: "Assembly Line 1",
      time: "2 min ago",
      severity: "critical",
      icon: XCircle,
    },
    {
      id: 2,
      title: "Safety Zone Violation",
      location: "Welding Station 2",
      time: "5 min ago",
      severity: "warning",
      icon: AlertTriangle,
    },
    {
      id: 3,
      title: "Assembly Sequence Error",
      location: "Quality Control Station",
      time: "12 min ago",
      severity: "info",
      icon: AlertCircle,
    },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Production Monitoring Dashboard</h1>
        <p className="text-muted-foreground">
          Real-time factory floor monitoring and quality control
        </p>
      </div>

      {/* Top Filters Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Select value={selectedPipeline} onValueChange={setSelectedPipeline}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="All Pipelines" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{pipelines.all.name}</SelectItem>
            <SelectItem value="defect-detection">{pipelines["defect-detection"].name}</SelectItem>
            <SelectItem value="safety-monitoring">{pipelines["safety-monitoring"].name}</SelectItem>
          </SelectContent>
        </Select>

        <div className="relative flex-1 w-full sm:w-auto">
          <Icon icon={Search} className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search cameras..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="pl-10 w-full"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Layout:</span>
          {["2x2", "3x3", "4x4"].map((layoutOption) => (
            <Button
              key={layoutOption}
              variant={layout === layoutOption ? "default" : "outline"}
              size="sm"
              onPress={() => setLayout(layoutOption)}
              className="min-w-[60px]"
            >
              {layoutOption}
            </Button>
          ))}
        </div>
      </div>

      {/* Active Alerts Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Active Alerts</h2>
            <p className="text-sm text-muted-foreground">
              Latest detection events requiring attention
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onPress={() => router.push("/monitor/alerts")}
          >
            View All Alerts
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {alerts.map((alert) => {
            const borderClass = alert.severity === "critical"
              ? "border-red-300 dark:border-red-700/60"
              : alert.severity === "warning"
              ? "border-amber-300 dark:border-amber-700/60"
              : "border-blue-300 dark:border-blue-700/60";
            
            return (
              <div
                key={alert.id}
                className={`relative overflow-hidden rounded-2xl border bg-card shadow-sm group transition-all duration-300 ease-out ${borderClass}`}
              >
                {/* Gradient Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${
                    alert.severity === "critical"
                      ? "from-red-500/20 via-red-400/10 to-transparent dark:from-red-500/15 dark:via-red-400/5"
                      : alert.severity === "warning"
                      ? "from-amber-500/20 via-amber-400/10 to-transparent dark:from-amber-500/15 dark:via-amber-400/5"
                      : "from-blue-500/20 via-blue-400/10 to-transparent dark:from-blue-500/15 dark:via-blue-400/5"
                  }`}
                />
                
                {/* Animated Gradient Sweep */}
                <div
                  className={`absolute inset-0 w-[200%] bg-gradient-to-r ${
                    alert.severity === "critical"
                      ? "from-transparent via-red-400/30 to-transparent"
                      : alert.severity === "warning"
                      ? "from-transparent via-amber-400/30 to-transparent"
                      : "from-transparent via-blue-400/30 to-transparent"
                  } -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out`}
                />

                {/* Content */}
                <div className="relative z-10 p-4">
                  {/* Title */}
                  <h3 className="text-base font-semibold text-foreground mb-1.5 line-clamp-2">
                    {alert.title}
                  </h3>

                  {/* Location and Time */}
                  <p className="text-xs text-muted-foreground mb-2">
                    {alert.location} • {alert.time}
                  </p>

                  {/* Badge */}
                  <div
                    className={`inline-flex px-2 py-0.5 rounded-full border text-xs font-medium ${
                      alert.severity === "critical"
                        ? "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800"
                        : alert.severity === "warning"
                        ? "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                        : "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                    }`}
                  >
                    {alert.severity === "critical" ? "Critical" : alert.severity === "warning" ? "Warning" : "Info"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Defect Detection Pipeline Section */}
      <Card>
        <CardHeader className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon icon={Camera} className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-base">{currentPipeline.name}</CardTitle>
              {isPipelineRunning ? (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">
                  Running
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-800">
                  Stopped
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onPress={handleFullscreen} className="h-9 flex-row items-center">
                <Icon icon={Maximize2} className="h-4 w-4 mr-2" />
                <span>Fullscreen Grid</span>
              </Button>
              {isPipelineRunning ? (
                <Button variant="destructive" size="sm" onPress={handleStopPipeline} className="h-9 flex-row items-center">
                  <Icon icon={Square} className="h-4 w-4 mr-2" />
                  <span>Stop Pipeline</span>
                </Button>
              ) : (
                <Button variant="default" size="sm" onPress={() => {
                  setIsPipelineRunning(true);
                  snackbar.success("Pipeline has been started. Camera feeds are now online.");
                }} className="h-9 flex-row items-center">
                  <Icon icon={Play} className="h-4 w-4 mr-2" />
                  <span>Start Pipeline</span>
                </Button>
              )}
              <Button variant="outline" size="sm" onPress={handleRefresh} className="h-9 flex-row items-center">
                <Icon icon={RefreshCw} className="h-4 w-4 mr-2" />
                <span>Refresh</span>
              </Button>
            </div>
          </div>
          <CardDescription>Live camera feeds and detection statistics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
              <Icon icon={Camera} className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Cameras</p>
                <p className="text-lg font-semibold">{displayedCameras.length}/{pipelineFilteredCameras.length} Online</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
              <Icon icon={BarChart} className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Incidents (Total)</p>
                <p className="text-lg font-semibold">24</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
              <Icon icon={AlertTriangle} className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Alerts Today</p>
                <p className="text-lg font-semibold">12</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
              <Icon icon={Bell} className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Notifications</p>
                <p className="text-lg font-semibold">Email</p>
              </div>
            </div>
          </div>

          {/* Video Feeds Grid */}
          {!isPipelineRunning ? (
            <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed bg-muted/50">
              <div className="text-center">
                <Icon icon={Square} className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm font-medium text-foreground mb-1">Pipeline Stopped</p>
                <p className="text-sm text-muted-foreground">Camera feeds are offline. Start the pipeline to view live feeds.</p>
              </div>
            </div>
          ) : displayedCameras.length > 0 ? (
            <div className={`grid grid-cols-1 gap-4 ${
              layout === "2x2" ? "md:grid-cols-2" :
              layout === "3x3" ? "md:grid-cols-3" :
              "md:grid-cols-4"
            }`}>
              {displayedCameras.map((camera) => (
                <Card key={camera.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative bg-black aspect-video">
                      {/* Video Feed Placeholder */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Icon icon={Play} className="h-16 w-16 text-white/50" />
                      </div>
                      
                      {/* Overlay Info */}
                      <div className="absolute top-2 left-2">
                        <p className="text-white font-semibold">{camera.name}</p>
                      </div>
                      <div className="absolute bottom-2 left-2">
                        <p className="text-white/80 text-sm">{camera.location}</p>
                      </div>
                      <div className="absolute top-2 right-2">
                        {camera.alerts > 0 ? (
                          <Badge variant="destructive">{camera.alerts} {camera.alerts === 1 ? 'Alert' : 'Alerts'}</Badge>
                        ) : (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">
                            LIVE
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed bg-muted/50">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">No cameras found matching your search</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stop Pipeline Confirmation Dialog */}
      <AlertDialog open={showStopDialog} onOpenChange={setShowStopDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Stop Pipeline</AlertDialogTitle>
            <AlertDialogDescription>
              This will halt all camera feeds and detection processing. You can restart it at any time.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="outline">Cancel</Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button variant="destructive" onPress={handleConfirmStop}>
                Stop Pipeline
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Fullscreen Grid Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-background">
          <div className="flex h-full w-full flex-col">
            {/* Fullscreen Header */}
            <div className="flex items-center justify-between border-b border-border bg-card px-6 py-4">
              <div className="flex items-center gap-2">
                <Icon icon={Camera} className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold">Camera Grid - Fullscreen</h2>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">
                  {layout}
                </Badge>
              </div>
              <Button variant="ghost" size="icon" onPress={handleCloseFullscreen}>
                <Icon icon={X} className="h-5 w-5" />
              </Button>
            </div>

            {/* Fullscreen Grid Content */}
            <div className="flex-1 overflow-auto p-6">
              {isPipelineRunning && displayedCameras.length > 0 ? (
                <div className={`grid grid-cols-1 gap-4 h-full ${
                  layout === "2x2" ? "md:grid-cols-2" :
                  layout === "3x3" ? "md:grid-cols-3" :
                  "md:grid-cols-4"
                }`}>
                  {displayedCameras.map((camera) => (
                    <Card key={camera.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="relative bg-black aspect-video">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Icon icon={Play} className="h-16 w-16 text-white/50" />
                          </div>
                          <div className="absolute top-2 left-2">
                            <p className="text-white font-semibold">{camera.name}</p>
                          </div>
                          <div className="absolute bottom-2 left-2">
                            <p className="text-white/80 text-sm">{camera.location}</p>
                          </div>
                          <div className="absolute top-2 right-2">
                            {camera.alerts > 0 ? (
                              <Badge variant="destructive">{camera.alerts} {camera.alerts === 1 ? 'Alert' : 'Alerts'}</Badge>
                            ) : (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">
                                LIVE
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">No camera feeds available</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Snackbar */}
      <Snackbar
        visible={snackbar.state.visible}
        message={snackbar.state.message}
        variant={snackbar.state.variant}
        onClose={snackbar.hide}
      />
    </div>
  );
}
