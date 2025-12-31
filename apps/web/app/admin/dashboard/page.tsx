"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Icon,
  Badge,
  StatsCard,
} from "ui";
import {
  AlertCircle,
  ArrowRight,
  Video,
  Activity,
  AlertTriangle,
  CheckCircle,
  X,
  Camera,
  Clock,
  Cpu,
  Bell,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  Zap,
} from "ui/utils/icons";
import { getIncompleteSteps, isSetupComplete, getSetupProgress } from "app/utils/setup";

export default function AdminDashboard() {
  const router = useRouter();
  const [setupComplete, setSetupComplete] = useState(false);
  const [setupData, setSetupData] = useState<any>(null);
  const [showSetupBanner, setShowSetupBanner] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const complete = isSetupComplete();
    const progress = getSetupProgress();
    
    setSetupComplete(complete);
    setSetupData(progress);
  }, []);

  // Feature carousel items
  const featureSlides = [
    {
      icon: UserPlus,
      title: "Bulk User Upload",
      badge: "Coming Soon",
      description: "Import multiple users via CSV - Bulk role assignment and auto-send invitations",
    },
    {
      icon: Cpu,
      title: "Custom AI Models",
      badge: "Coming Soon",
      description: "Import your own YOLO, TensorFlow, or PyTorch models for specialized detection",
    },
    {
      icon: Activity,
      title: "Advanced Analytics",
      badge: "Coming Soon",
      description: "Deep insights into detection patterns, trends, and performance metrics",
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featureSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featureSlides.length) % featureSlides.length);
  };
  
  const activeSlide = featureSlides[currentSlide] ?? featureSlides[0]!;

  // Mock data for demonstration
  const cameraCount = setupData?.cameras?.length || 2;
  const onlineCameras = cameraCount;

  const recentAlerts = [
    { id: 1, title: "PPE Violation Detected", location: "Production Line 1", time: "2 minutes ago", severity: "critical" },
    { id: 2, title: "Defect Detected", location: "Production Line 2", time: "15 minutes ago", severity: "warning" },
    { id: 3, title: "System Health Check Passed", location: "All systems", time: "1 hour ago", severity: "info" },
  ];

  const cameraFeeds = [
    { id: 1, name: "Production Line 1", zone: "Zone A", fps: 30, resolution: "1920x1080", status: "online" },
    { id: 2, name: "Production Line 2", zone: "Zone A", fps: 30, resolution: "1920x1080", status: "online" },
  ];

  const aiModels = [
    { name: "Defect Detection", accuracy: 87 },
    { name: "PPE Compliance", accuracy: 92 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">System Health Dashboard</h1>
        <p className="text-muted-foreground">
          Real-time monitoring and operational status
        </p>
      </div>

      {/* Setup Complete Banner */}
      {setupComplete && showSetupBanner && (
        <div className="flex items-center justify-between rounded-xl border border-green-300 dark:border-green-700/70 bg-green-100 dark:bg-green-900/50 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-200 dark:bg-green-800/70">
              <Icon icon={CheckCircle} className="h-4 w-4 text-green-700 dark:text-green-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-green-800 dark:text-green-200">Setup Complete!</p>
              <p className="text-xs text-green-700 dark:text-green-300">
                Your Aegis Vision system is configured and operational.
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSetupBanner(false)}
            className="text-green-800 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800/50"
          >
            Dismiss
          </Button>
        </div>
      )}

      {/* Feature Carousel */}
      <Card className="border-dashed">
        <CardContent className="py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={prevSlide}
              className="shrink-0"
            >
              <Icon icon={ChevronLeft} className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-4 flex-1">
              <div className="p-2.5 rounded-lg border bg-background shrink-0">
                <Icon icon={activeSlide.icon} className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="font-semibold text-foreground">{activeSlide.title}</h3>
                  <Badge variant="outline" className="text-xs">{activeSlide.badge}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {activeSlide.description}
                </p>
              </div>
              <Button size="sm" variant="default" className="shrink-0">
                Request Access
              </Button>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={nextSlide}
              className="shrink-0"
            >
              <Icon icon={ChevronRight} className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Slide indicators */}
          <div className="flex justify-center gap-1.5 mt-3">
            {featureSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentSlide ? "w-6 bg-foreground" : "w-2 bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          label="Camera Status"
          value={`${onlineCameras}/${cameraCount}`}
          badge="Online"
          color="green"
        />
        <StatsCard
          label="Stream Latency"
          value="87ms"
          suffix="avg"
          color="blue"
        />
        <StatsCard
          label="GPU Utilization"
          value="64%"
          badge="Normal"
          color="purple"
        />
        <StatsCard
          label="Alerts Today"
          value="12"
          suffix="events"
          color="orange"
        />
      </div>

      {/* Camera Feeds & AI Model Performance */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Camera Feeds */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Icon icon={Camera} className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-base">Camera Feeds</CardTitle>
            </div>
            <CardDescription>Live feed status and performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {cameraFeeds.map((feed) => (
              <div
                key={feed.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-card"
              >
                <div>
                  <p className="font-medium">{feed.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {feed.zone} • {feed.fps} FPS • {feed.resolution}
                  </p>
                </div>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Online
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* AI Model Performance */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Icon icon={Cpu} className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-base">AI Model Performance</CardTitle>
            </div>
            <CardDescription>Detection accuracy and processing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {aiModels.map((model) => (
              <div key={model.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{model.name}</span>
                  <span className="text-sm text-muted-foreground">{model.accuracy}% accuracy</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${model.accuracy}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Alerts */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Icon icon={Clock} className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-base">Recent Alerts</CardTitle>
          </div>
          <CardDescription>Latest detection events and notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentAlerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-center justify-between p-3 rounded-lg border bg-card"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`h-2.5 w-2.5 rounded-full ${
                    alert.severity === "critical"
                      ? "bg-red-500"
                      : alert.severity === "warning"
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                />
                <div>
                  <p className="font-medium">{alert.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {alert.location} • {alert.time}
                  </p>
                </div>
              </div>
              <Badge
                variant="outline"
                className={
                  alert.severity === "critical"
                    ? "text-red-600 border-red-600"
                    : alert.severity === "warning"
                    ? "text-yellow-600 border-yellow-600"
                    : "text-blue-600 border-blue-600"
                }
              >
                {alert.severity === "critical" ? "Critical" : alert.severity === "warning" ? "Warning" : "Info"}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* System Uptime Footer */}
      <Card className="bg-muted/30">
        <CardContent className="py-4">
          <div className="flex items-center gap-3">
            <Icon icon={Zap} className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">System Uptime: 99.8%</p>
              <p className="text-sm text-muted-foreground">
                All components operational. Auto-refresh every 5 minutes. Last updated: Just now
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
