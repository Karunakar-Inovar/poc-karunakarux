"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Badge,
  Button,
  Card,
  CardContent,
  Icon,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Snackbar,
  useSnackbar,
} from "ui";
import {
  ArrowLeft,
  Camera,
  Pause,
  Play,
} from "ui/utils/icons";

type AlertFootageEventType = "collision" | "person" | "vehicle" | "motion";

type AlertFootage = {
  id: number;
  title: string;
  zone: string;
  location: string;
  sourceName: string;
  sourceType: string;
  timestampLabel: string;
  eventTypeLabel: string;
  chips: Array<{ label: string; variant?: "default" | "outline" | "destructive" }>;
  resolution: string;
  fps: number;
  timelineSecondsTotal: number;
  markers: Array<{ t: number; type: AlertFootageEventType }>;
};

function markerColor(type: AlertFootageEventType) {
  switch (type) {
    case "collision":
      return "bg-red-500";
    case "person":
      return "bg-blue-500";
    case "vehicle":
      return "bg-yellow-500";
    case "motion":
      return "bg-green-500";
  }
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function formatClock(totalSeconds: number) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const mm = Math.floor(s / 60);
  const ss = s % 60;
  return `${mm}:${ss.toString().padStart(2, "0")}`;
}

function getMockAlertFootage(alertId: number): AlertFootage | null {
  const base: Omit<AlertFootage, "id"> = {
    title: "Gate B Entrance",
    zone: "Loading Dock",
    location: "Loading Dock - CAM-LD-02",
    sourceName: "CAM-LD-02 (Fixed)",
    sourceType: "Fixed Camera",
    timestampLabel: "Oct 29, 2025 2:42 PM",
    eventTypeLabel: "Collision Risk Detected",
    chips: [
      { label: "Collision Risk Detected", variant: "destructive" },
      { label: "Person: 2", variant: "outline" },
    ],
    resolution: "1920×1080",
    fps: 30,
    timelineSecondsTotal: 300,
    markers: [
      { t: 10, type: "motion" },
      { t: 35, type: "collision" },
      { t: 80, type: "person" },
      { t: 140, type: "person" },
      { t: 210, type: "vehicle" },
      { t: 265, type: "motion" },
    ],
  };

  if (!Number.isFinite(alertId)) return null;

  // Keep it deterministic across ids, while still looking realistic.
  if (alertId === 2) {
    return {
      id: alertId,
      ...base,
      title: "Welding Station 2",
      zone: "Fabrication",
      location: "Welding Station 2 - CAM-WD-04",
      sourceName: "CAM-WD-04 (Fixed)",
      timestampLabel: "Jan 15, 2025 2:29 PM",
      eventTypeLabel: "Equipment Malfunction Detected",
      chips: [
        { label: "Equipment Malfunction", variant: "destructive" },
        { label: "Confidence: 92%", variant: "outline" },
      ],
      markers: [
        { t: 22, type: "motion" },
        { t: 60, type: "vehicle" },
        { t: 115, type: "motion" },
        { t: 165, type: "collision" },
        { t: 240, type: "person" },
      ],
    };
  }

  if (alertId === 3) {
    return {
      id: alertId,
      ...base,
      title: "Quality Control Station",
      zone: "QC Area",
      location: "QC Station - CAM-QC-01",
      sourceName: "CAM-QC-01 (Fixed)",
      timestampLabel: "Jan 15, 2025 2:22 PM",
      eventTypeLabel: "Sequence Error Detected",
      chips: [
        { label: "Sequence Error", variant: "default" },
        { label: "Person: 1", variant: "outline" },
      ],
      markers: [
        { t: 18, type: "person" },
        { t: 95, type: "vehicle" },
        { t: 160, type: "motion" },
        { t: 245, type: "person" },
      ],
    };
  }

  if (alertId === 4) {
    return {
      id: alertId,
      ...base,
      title: "Packaging Area",
      zone: "Packaging Zone",
      location: "Packaging - CAM-PK-03",
      sourceName: "CAM-PK-03 (Fixed)",
      timestampLabel: "Jan 15, 2025 2:16 PM",
      eventTypeLabel: "Safety Zone Violation Detected",
      chips: [
        { label: "Safety Zone Violation", variant: "destructive" },
        { label: "Person: 1", variant: "outline" },
      ],
      markers: [
        { t: 28, type: "person" },
        { t: 72, type: "motion" },
        { t: 130, type: "person" },
        { t: 205, type: "motion" },
        { t: 260, type: "person" },
      ],
    };
  }

  if (alertId === 5) {
    return {
      id: alertId,
      ...base,
      title: "Assembly Line 2",
      zone: "Production Floor A",
      location: "Assembly Line 2 - CAM-AL-02",
      sourceName: "CAM-AL-02 (Fixed)",
      timestampLabel: "Jan 15, 2025 2:09 PM",
      eventTypeLabel: "Production Rate Alert",
      chips: [
        { label: "Production Rate", variant: "outline" },
        { label: "Confidence: 85%", variant: "outline" },
      ],
      markers: [
        { t: 40, type: "vehicle" },
        { t: 110, type: "motion" },
        { t: 190, type: "vehicle" },
        { t: 270, type: "motion" },
      ],
    };
  }

  return { id: alertId, ...base };
}

export default function MonitorAlertFootagePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const snackbar = useSnackbar();

  const alertId = Number(params.id);
  const alert = React.useMemo(() => getMockAlertFootage(alertId), [alertId]);

  const totalSeconds = alert?.timelineSecondsTotal ?? 300;

  const [isPlaying, setIsPlaying] = React.useState(false);
  const [speed, setSpeed] = React.useState<0.5 | 1 | 2>(1);
  const [cursorSeconds, setCursorSeconds] = React.useState(45);

  const [rangeStartSeconds, setRangeStartSeconds] = React.useState(30);
  const [rangeEndSeconds, setRangeEndSeconds] = React.useState(90);

  React.useEffect(() => {
    // Reset defaults when navigating between ids
    setIsPlaying(false);
    setSpeed(1);
    setCursorSeconds(45);
    setRangeStartSeconds(30);
    setRangeEndSeconds(90);
  }, [alertId]);

  React.useEffect(() => {
    if (!isPlaying) return;
    const id = window.setInterval(() => {
      setCursorSeconds((prev) => {
        const next = prev + speed;
        if (next >= totalSeconds) return totalSeconds;
        return next;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [isPlaying, speed, totalSeconds]);

  const cursorPct =
    totalSeconds > 0 ? clamp((cursorSeconds / totalSeconds) * 100, 0, 100) : 0;

  const clipStart = clamp(rangeStartSeconds, 0, totalSeconds);
  const clipEnd = clamp(rangeEndSeconds, 0, totalSeconds);
  const clipDuration = Math.max(0, clipEnd - clipStart);

  const estimatedSizeMb = Math.max(1, Math.round((clipDuration * 2.5) / 10) * 10); // coarse mock estimate

  const canExport = clipDuration > 0 && clipEnd > clipStart;

  const handleExport = () => {
    if (!canExport) {
      snackbar.error("Invalid clip range. Please update start/end.");
      return;
    }
    snackbar.success("Export started. This will be logged in the audit trail.");
  };

  const handleQuickJump = (deltaSeconds: number) => {
    setCursorSeconds((prev) => clamp(prev + deltaSeconds, 0, totalSeconds));
  };

  if (!alert) {
    return (
      <div className="p-6 space-y-4">
        <Button
          variant="ghost"
          size="sm"
          className="flex-row items-center"
          onPress={() => router.push("/monitor/alerts")}
        >
          <Icon icon={ArrowLeft} className="h-4 w-4 mr-2" />
          Back to Alerts
        </Button>

        <Card>
          <CardContent className="p-6">Alert not found</CardContent>
        </Card>
      </div>
    );
  }

  const panel = "rounded-2xl border border-border bg-card";

  return (
    <div className="p-6 space-y-4">
      {/* Back */}
      <Button
        variant="ghost"
        size="sm"
        className="flex-row items-center w-fit"
        onPress={() => router.push("/monitor/alerts")}
      >
        <Icon icon={ArrowLeft} className="h-4 w-4 mr-2" />
        Back to Alerts
      </Button>

      {/* Top context bar (Figma-inspired) */}
      <Card className={panel}>
        <CardContent className="p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <div className="text-sm text-muted-foreground">Viewing playback for</div>
            <div className="text-base font-semibold text-foreground truncate">
              {alert.title}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className="border-amber-500/40 text-amber-700 dark:text-amber-300"
            >
              External notifications limited
            </Badge>

            <Select defaultValue="24h">
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Last 24h" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">Last 1h</SelectItem>
                <SelectItem value="24h">Last 24h</SelectItem>
                <SelectItem value="7d">Last 7d</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all">
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Zones" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Zones</SelectItem>
                <SelectItem value="zone">{alert.zone}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 3-column workspace */}
      <div className="grid gap-4 lg:grid-cols-[320px,1fr,320px]">
        {/* Left: Filters */}
        <div className="space-y-4">
          <Card className={panel}>
            <CardContent className="p-4 space-y-4">
              <div className="text-foreground font-semibold">Filters</div>

              <div className="space-y-2">
                <div className="text-sm text-foreground">Date &amp; Time Range</div>
                <Input placeholder="Start" />
                <Input placeholder="End" />
              </div>

              <div className="space-y-2">
                <div className="text-sm text-foreground">Zone / Area</div>
                <Select defaultValue="zone">
                  <SelectTrigger>
                    <SelectValue placeholder={alert.zone} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="zone">{alert.zone}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-foreground">Source</div>
                <Select defaultValue="source">
                  <SelectTrigger>
                    <SelectValue placeholder={alert.sourceName} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="source">{alert.sourceName}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-foreground">Quick Jump</div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onPress={() => handleQuickJump(-300)}
                  >
                    -5m
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onPress={() => handleQuickJump(-60)}
                  >
                    -1m
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onPress={() => handleQuickJump(60)}
                  >
                    +1m
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onPress={() => handleQuickJump(300)}
                  >
                    +5m
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={panel}>
            <CardContent className="p-4 space-y-2">
              <div className="text-foreground font-semibold">Source Info</div>
              <div className="text-sm text-muted-foreground">
                Resolution: {alert.resolution}
              </div>
              <div className="text-sm text-muted-foreground">
                Frame Rate: {alert.fps} fps
              </div>
              <div className="text-sm text-muted-foreground">
                Source Type: {alert.sourceType}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Center: Playback */}
        <Card className={`${panel} overflow-hidden`}>
          <CardContent className="p-0">
            <div className="p-4 flex flex-wrap items-center gap-2">
              {alert.chips.map((c, idx) => (
                <Badge
                  key={`${c.label}-${idx}`}
                  variant={c.variant ?? "outline"}
                >
                  {c.label}
                </Badge>
              ))}
            </div>

            <div className="relative bg-black aspect-video flex items-center justify-center">
              <div className="text-center text-white/70 px-6">
                <Icon icon={Camera} className="h-16 w-16 mx-auto mb-3 opacity-40" />
                <div className="text-white/80">{alert.location}</div>
                <div className="text-white/50 text-sm">{alert.timestampLabel}</div>
              </div>
            </div>

            <div className="p-4 space-y-3">
              <div className="text-xs text-muted-foreground flex items-center justify-between">
                <span>14:00:00</span>
                <span>
                  {formatClock(cursorSeconds)} / {formatClock(totalSeconds)}
                </span>
                <span>14:05:00</span>
              </div>

              <div className="relative h-10 rounded-xl bg-muted/40 border border-border">
                {alert.markers.map((m, idx) => (
                  <div
                    key={`${m.type}-${idx}`}
                    className={`absolute top-2 w-1.5 h-6 rounded ${markerColor(
                      m.type
                    )}`}
                    style={{ left: `${(m.t / totalSeconds) * 100}%` }}
                  />
                ))}

                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-white/70"
                  style={{ left: `${cursorPct}%` }}
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  onPress={() => setIsPlaying((p) => !p)}
                  className="min-w-[100px]"
                >
                  <Icon icon={isPlaying ? Pause : Play} className="h-4 w-4 mr-2" />
                  {isPlaying ? "Pause" : "Play"}
                </Button>

                <Button
                  variant={speed === 0.5 ? "default" : "outline"}
                  size="sm"
                  onPress={() => setSpeed(0.5)}
                >
                  0.5x
                </Button>
                <Button
                  variant={speed === 1 ? "default" : "outline"}
                  size="sm"
                  onPress={() => setSpeed(1)}
                >
                  1x
                </Button>
                <Button
                  variant={speed === 2 ? "default" : "outline"}
                  size="sm"
                  onPress={() => setSpeed(2)}
                >
                  2x
                </Button>

                <div className="ml-auto flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    Collision Risk
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    Person
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-yellow-500" />
                    Vehicle
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    Motion
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right: Export */}
        <div className="space-y-4">
          <Card className={panel}>
            <CardContent className="p-4 space-y-3">
              <div className="text-foreground font-semibold">Export</div>
              <div className="text-sm text-muted-foreground">
                Create clips or snapshots with audit trail
              </div>

              <div className="pt-2 space-y-2">
                <div className="text-sm text-foreground">Clip Range</div>

                <div className="grid grid-cols-[1fr,auto] gap-2 items-center">
                  <Input
                    value={String(rangeStartSeconds)}
                    onChangeText={(v) => setRangeStartSeconds(Number(v))}
                    placeholder="Start"
                  />
                  <div className="text-sm text-muted-foreground">s</div>
                </div>

                <div className="grid grid-cols-[1fr,auto] gap-2 items-center">
                  <Input
                    value={String(rangeEndSeconds)}
                    onChangeText={(v) => setRangeEndSeconds(Number(v))}
                    placeholder="End"
                  />
                  <div className="text-sm text-muted-foreground">s</div>
                </div>

                <div className="text-xs text-muted-foreground flex items-center justify-between">
                  <span>Duration:</span>
                  <span>{formatClock(clipDuration)}</span>
                </div>
                <div className="text-xs text-muted-foreground flex items-center justify-between">
                  <span>Est. Size:</span>
                  <span>~{estimatedSizeMb.toFixed(1)} MB</span>
                </div>
              </div>

              <Button className="w-full" onPress={handleExport} disabled={!canExport}>
                Export Clip
              </Button>
              <Button variant="outline" className="w-full" disabled>
                Snapshot Frame
              </Button>

              <div className="mt-2 text-xs text-muted-foreground border border-border bg-muted/20 rounded-lg p-3">
                All exports include watermark and are logged in Audit Log with timestamp
                and user ID.
              </div>
            </CardContent>
          </Card>

          <Card className={panel}>
            <CardContent className="p-4 space-y-3">
              <div className="text-foreground font-semibold">Export Options</div>

              <div className="space-y-2">
                <div className="text-sm text-foreground">Video Format</div>
                <Select defaultValue="mp4">
                  <SelectTrigger>
                    <SelectValue placeholder="MP4 (H.264)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mp4">MP4 (H.264)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-foreground">Image Format</div>
                <Select defaultValue="jpeg">
                  <SelectTrigger>
                    <SelectValue placeholder="JPEG" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jpeg">JPEG</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-foreground">Watermark</div>
                <Input placeholder="Auto-applied" disabled />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

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


