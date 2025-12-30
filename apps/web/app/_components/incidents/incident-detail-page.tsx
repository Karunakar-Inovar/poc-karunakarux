"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  Button,
  Icon,
  Badge,
  Alert,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  ToggleSwitch,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "ui";
import {
  ArrowLeft,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  Clock,
  Camera,
  Calendar,
  Brain,
  FileText,
  Play,
  Pause,
  Download,
  ExternalLink,
  Save,
} from "ui/utils/icons";
import { getPersistedIncidentById } from "app";

// Enhanced mock data with all details from mockup
const incidentsData = [
  {
    id: 1,
    type: "Collision Risk",
    severity: "critical",
    camera: "Loading Dock Camera 01",
    pipeline: "SafetyAI v2.3.1",
    timestamp: "Oct 29, 2025 at 2:42 PM",
    status: "investigating",
    confidence: 94,
    zone: "Loading Dock",
    eventType: "Collision Risk",
    assignedTo: null,
    objectsDetected: [
      { label: "Person", color: "green" },
      { label: "Forklift", color: "blue" },
    ],
    behaviorAnalysis:
      "Pedestrian and forklift detected on converging path. Proximity analysis indicates collision risk within 3-5 seconds.",
    sourceType: "Camera",
    videoDuration: "3:00",
    currentTime: "0:42",
    lastUpdated: "Oct 29, 2025 at 2:45 PM",
    lastUpdatedBy: "Current User",
    notes: "",
    highlightForNextShift: false,
  },
  {
    id: 2,
    type: "Unauthorized Access",
    severity: "critical",
    camera: "Camera 2 - Assembly Line",
    pipeline: "Person Detection",
    timestamp: "2024-01-20 14:28:42",
    status: "reviewing",
    confidence: 98.2,
    zone: "Assembly Line",
    eventType: "Unauthorized Access",
    assignedTo: null,
    objectsDetected: [{ label: "Person", color: "red" }],
    behaviorAnalysis:
      "Possible unauthorized access detected on the assembly line. Immediate review recommended.",
    sourceType: "Camera",
    videoDuration: "2:30",
    currentTime: "1:15",
    lastUpdated: "2024-01-20 14:30:00",
    lastUpdatedBy: "Admin User",
    notes: "",
    highlightForNextShift: false,
  },
  {
    id: 3,
    type: "Object Left Behind",
    severity: "medium",
    camera: "Camera 3 - Storage Area",
    pipeline: "Object Classification",
    timestamp: "2024-01-20 14:15:33",
    status: "resolved",
    confidence: 87.3,
    zone: "Storage Area",
    eventType: "Object Left Behind",
    assignedTo: "John Doe",
    objectsDetected: [{ label: "Object", color: "yellow" }],
    behaviorAnalysis:
      "Object left behind in the storage area. Incident resolved after on-site verification.",
    sourceType: "Camera",
    videoDuration: "1:45",
    currentTime: "0:00",
    lastUpdated: "2024-01-20 14:20:00",
    lastUpdatedBy: "John Doe",
    notes: "Object removed and area secured.",
    highlightForNextShift: false,
  },
  {
    id: 4,
    type: "Safety Violation",
    severity: "high",
    camera: "Camera 4 - Parking Lot",
    pipeline: "PPE Detection",
    timestamp: "2024-01-20 13:58:21",
    status: "false_positive",
    confidence: 72.1,
    zone: "Parking Lot",
    eventType: "Safety Violation",
    assignedTo: null,
    objectsDetected: [{ label: "Person", color: "orange" }],
    behaviorAnalysis:
      "Potential safety violation detected in the parking lot. Marked as false positive after review.",
    sourceType: "Camera",
    videoDuration: "2:00",
    currentTime: "0:30",
    lastUpdated: "2024-01-20 14:00:00",
    lastUpdatedBy: "Admin User",
    notes: "False positive - person was wearing proper PPE.",
    highlightForNextShift: false,
  },
  {
    id: 5,
    type: "Loitering Detected",
    severity: "low",
    camera: "Camera 5 - Exit",
    pipeline: "Person Detection",
    timestamp: "2024-01-20 13:45:09",
    status: "resolved",
    confidence: 91.8,
    zone: "Exit",
    eventType: "Loitering Detected",
    assignedTo: "Jane Smith",
    objectsDetected: [{ label: "Person", color: "blue" }],
    behaviorAnalysis:
      "Loitering activity detected near the exit. Incident resolved after security check.",
    sourceType: "Camera",
    videoDuration: "1:20",
    currentTime: "0:00",
    lastUpdated: "2024-01-20 13:50:00",
    lastUpdatedBy: "Jane Smith",
    notes: "Security check completed. No issues found.",
    highlightForNextShift: false,
  },
  {
    id: 6,
    type: "Vehicle in Restricted Zone",
    severity: "medium",
    camera: "Camera 6 - Quality Check",
    pipeline: "Vehicle Recognition",
    timestamp: "2024-01-20 13:30:55",
    status: "new",
    confidence: 89.5,
    zone: "Quality Check",
    eventType: "Vehicle in Restricted Zone",
    assignedTo: null,
    objectsDetected: [{ label: "Vehicle", color: "red" }],
    behaviorAnalysis:
      "Vehicle detected in a restricted quality check zone. Pending review from the safety team.",
    sourceType: "Camera",
    videoDuration: "2:15",
    currentTime: "0:45",
    lastUpdated: "2024-01-20 13:30:55",
    lastUpdatedBy: "System",
    notes: "",
    highlightForNextShift: false,
  },
];

const statusOptions = [
  { value: "new", label: "New" },
  { value: "investigating", label: "Investigating" },
  { value: "reviewing", label: "Reviewing" },
  { value: "resolved", label: "Resolved" },
  { value: "false_positive", label: "Not an issue (False Positive)" },
];

const assignedToOptions = [
  { value: "unassigned", label: "Unassigned" },
  { value: "assign_to_me", label: "Assign to me" },
  { value: "john-doe", label: "John Doe" },
  { value: "jane-smith", label: "Jane Smith" },
  { value: "admin-user", label: "Admin User" },
];

export function IncidentDetailPage({
  incidentId,
  backHref,
  mode,
}: {
  incidentId: number;
  backHref: string;
  mode: "admin" | "monitor";
}) {
  const router = useRouter();

  const persistedIncident = useMemo(
    () => getPersistedIncidentById(incidentId),
    [incidentId]
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [notes, setNotes] = useState("");
  const [highlightForNextShift, setHighlightForNextShift] = useState(false);
  const [status, setStatus] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmCloseOpen, setConfirmCloseOpen] = useState(false);
  const [pendingCloseStatus, setPendingCloseStatus] = useState<
    "resolved" | "false_positive" | null
  >(null);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);

  const incident = useMemo(
    () => incidentsData.find((item) => item.id === incidentId),
    [incidentId]
  );

  const persistedAsIncident = useMemo(() => {
    if (!persistedIncident) return null;

    return {
      id: persistedIncident.id,
      type: persistedIncident.title,
      severity: persistedIncident.severity,
      camera: persistedIncident.location,
      pipeline: persistedIncident.incidentType,
      timestamp: new Date(persistedIncident.createdAt).toLocaleString(),
      status: "new",
      confidence: 100,
      zone: persistedIncident.location,
      eventType: persistedIncident.incidentType,
      assignedTo: null,
      objectsDetected: [] as Array<{ label: string; color: string }>,
      behaviorAnalysis: persistedIncident.description,
      sourceType: "Report",
      videoDuration: "0:00",
      currentTime: "0:00",
      lastUpdated: new Date(persistedIncident.createdAt).toLocaleString(),
      lastUpdatedBy: "Monitor User",
      notes: "",
      highlightForNextShift: false,
    };
  }, [persistedIncident]);

  const effectiveIncident = incident ?? persistedAsIncident;
  const isPersistedOnly = !incident && !!persistedAsIncident;
  const isMonitor = mode === "monitor";
  const isClosingStatus = status === "resolved" || status === "false_positive";

  // Initialize state from incident data
  useEffect(() => {
    if (effectiveIncident) {
      setNotes(effectiveIncident.notes || "");
      setHighlightForNextShift(effectiveIncident.highlightForNextShift || false);
      setStatus(effectiveIncident.status || "new");
      setAssignedTo(effectiveIncident.assignedTo || "unassigned");
    }
  }, [effectiveIncident]);

  // Clear form error as user edits relevant fields
  useEffect(() => {
    setFormError(null);
  }, [status, assignedTo, notes]);

  const validateBeforeSave = () => {
    // Monitor users close incidents -> require accountability + reason
    if (isMonitor && isClosingStatus) {
      if (!assignedTo || assignedTo === "unassigned") {
        return "Please assign this incident before closing it.";
      }
      if (!notes.trim()) {
        return "Please add notes before closing this incident.";
      }
    }
    return null;
  };

  const handleSave = () => {
    if (!incident) return;
    const error = validateBeforeSave();
    if (error) {
      setFormError(error);
      return;
    }

    if (isMonitor && isClosingStatus) {
      setPendingCloseStatus(status as "resolved" | "false_positive");
      setConfirmCloseOpen(true);
      return;
    }

    // TODO: Persist to backend/storage
    console.log("Saving incident:", {
      id: effectiveIncident?.id,
      status,
      assignedTo,
      notes,
      highlightForNextShift,
    });
    setLastSavedAt(new Date().toLocaleString());
  };

  const confirmClose = () => {
    if (!incident) return;
    const error = validateBeforeSave();
    if (error) {
      setFormError(error);
      setConfirmCloseOpen(false);
      setPendingCloseStatus(null);
      return;
    }

    // TODO: Persist closure to backend/storage
    console.log("Closing incident:", {
      id: effectiveIncident?.id,
      status,
      assignedTo,
      notes,
      highlightForNextShift,
    });
    setLastSavedAt(new Date().toLocaleString());
    setConfirmCloseOpen(false);
    setPendingCloseStatus(null);
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return (
          <Badge
            variant="outline"
            className="bg-red-100 text-red-700 border-red-300 dark:bg-red-900/40 dark:text-red-400 dark:border-red-800"
          >
            <Icon icon={AlertCircle} className="h-3 w-3 mr-1" />
            Critical
          </Badge>
        );
      case "high":
        return (
          <Badge
            variant="outline"
            className="bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-900/40 dark:text-orange-400 dark:border-orange-800"
          >
            <Icon icon={AlertTriangle} className="h-3 w-3 mr-1" />
            High
          </Badge>
        );
      case "medium":
        return (
          <Badge
            variant="outline"
            className="bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900/40 dark:text-amber-400 dark:border-amber-800"
          >
            Medium
          </Badge>
        );
      case "low":
        return (
          <Badge
            variant="outline"
            className="bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/40 dark:text-blue-400 dark:border-blue-800"
          >
            Low
          </Badge>
        );
      default:
        return null;
    }
  };

  const getObjectColorClass = (color: string) => {
    switch (color) {
      case "green":
        return "bg-green-500 border-green-600";
      case "blue":
        return "bg-blue-500 border-blue-600";
      case "red":
        return "bg-red-500 border-red-600";
      case "yellow":
        return "bg-yellow-500 border-yellow-600";
      case "orange":
        return "bg-orange-500 border-orange-600";
      default:
        return "bg-gray-500 border-gray-600";
    }
  };

  // Helper function to parse time string (MM:SS) to seconds
  const parseTimeToSeconds = (timeStr: string): number => {
    const parts = timeStr.split(":");
    if (parts.length === 2) {
      const minutes = parseInt(parts[0], 10) || 0;
      const seconds = parseInt(parts[1], 10) || 0;
      return minutes * 60 + seconds;
    }
    return 0;
  };

  // Calculate timeline position percentage
  const timelinePosition = useMemo(() => {
    if (!effectiveIncident) return 0;
    const currentSeconds = parseTimeToSeconds(effectiveIncident.currentTime);
    const totalSeconds = parseTimeToSeconds(effectiveIncident.videoDuration);
    if (totalSeconds === 0) return 0;
    return (currentSeconds / totalSeconds) * 100;
  }, [effectiveIncident]);

  if (!effectiveIncident) {
    return (
      <div className="space-y-6 p-6">
        <Button
          variant="ghost"
          size="sm"
          className="flex-row items-center"
          onPress={() => router.push(backHref)}
        >
          <Icon icon={ArrowLeft} className="h-4 w-4 mr-2" />
          Back to Incidents
        </Button>
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center text-center gap-2">
              <Icon
                icon={AlertCircle}
                className="h-10 w-10 text-muted-foreground mb-2"
              />
              <p className="font-medium text-foreground">Incident not found</p>
              <p className="text-sm text-muted-foreground max-w-md">
                The incident you are trying to view does not exist in the current
                dataset.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <Dialog open={confirmCloseOpen} onOpenChange={setConfirmCloseOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Confirm closure</DialogTitle>
            <DialogDescription>
              You are about to mark this incident as{" "}
              <span className="font-medium text-foreground">
                {pendingCloseStatus === "false_positive"
                  ? "False Positive"
                  : "Resolved"}
              </span>
              . This action should include a clear note explaining the outcome.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onPress={() => {
                setConfirmCloseOpen(false);
                setPendingCloseStatus(null);
              }}
            >
              Cancel
            </Button>
            <Button onPress={confirmClose}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        className="flex-row items-center"
        onPress={() => router.push(backHref)}
      >
        <Icon icon={ArrowLeft} className="h-4 w-4 mr-2" />
        Back to Incidents
      </Button>

      {/* Main Content - Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        {/* Left Column - Evidence Playback */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            {/* Header */}
            <div className="p-6 border-b border-border">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">
                    Evidence Playback
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Incident occurred at {effectiveIncident.timestamp} on{" "}
                    {effectiveIncident.camera}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="text-xs bg-muted text-muted-foreground"
                >
                  Export actions are audited
                </Badge>
              </div>
            </div>

            {/* Video Player Area */}
            <div className="relative bg-black aspect-video">
              {/* Alert Banner */}
              <div className="absolute top-0 left-0 right-0 bg-red-600 text-white px-4 py-2 z-10">
                <div className="flex items-center gap-2">
                  <Icon icon={AlertTriangle} className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {effectiveIncident.eventType} Detected
                  </span>
                </div>
              </div>

              {/* Bounding Boxes Overlay */}
              <div className="absolute inset-0 z-20 pointer-events-none">
                {effectiveIncident.objectsDetected.map((obj, index) => {
                  // Simulate bounding box positions (in real app, these would come from detection data)
                  const positions = [
                    { left: "20%", top: "40%", width: "15%", height: "20%" },
                    { left: "60%", top: "35%", width: "20%", height: "25%" },
                  ];
                  const pos = positions[index] || positions[0];
                  return (
                    <div
                      key={index}
                      className={`absolute border-2 ${getObjectColorClass(
                        obj.color
                      )} rounded`}
                      style={{
                        left: pos.left,
                        top: pos.top,
                        width: pos.width,
                        height: pos.height,
                      }}
                    >
                      <div
                        className={`absolute -top-6 left-0 px-2 py-1 text-xs text-white ${getObjectColorClass(
                          obj.color
                        )} rounded`}
                      >
                        {obj.label}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Video Placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <Icon icon={Camera} className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Video Evidence</p>
                  <p className="text-sm opacity-75">
                    {effectiveIncident.sourceType} Feed - {effectiveIncident.camera}
                  </p>
                </div>
              </div>

              {/* Video Controls Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                    onPress={() => setIsPlaying(!isPlaying)}
                  >
                    <Icon icon={isPlaying ? Pause : Play} className="h-4 w-4 mr-2" />
                    {isPlaying ? "Pause" : "Play"}
                  </Button>

                  {/* Timeline */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-xs text-white/75 mb-1">
                      <span>{effectiveIncident.currentTime}</span>
                      <span>{effectiveIncident.videoDuration}</span>
                    </div>
                    <div className="relative h-2 bg-white/20 rounded-full">
                      <div
                        className="absolute left-0 top-0 h-full bg-red-500 rounded-full"
                        style={{ width: `${timelinePosition}%` }}
                      />
                      <div
                        className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-red-500 rounded-full border-2 border-white"
                        style={{ left: `${timelinePosition}%` }}
                      />
                    </div>
                  </div>

                  {/* Export Controls */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20"
                    >
                      <Icon icon={Download} className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20"
                    >
                      <Icon icon={ExternalLink} className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Column - Incident Details & Actions */}
        <div className="space-y-6">
          {/* Incident Summary */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h1 className="text-xl font-semibold text-foreground">
                      {effectiveIncident.type}
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                      Zone: {effectiveIncident.zone}
                    </p>
                  </div>
                  {getSeverityBadge(effectiveIncident.severity)}
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Icon icon={Brain} className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Confidence</span>
                    </div>
                    <p className="text-lg font-semibold text-foreground">
                      {effectiveIncident.confidence}%
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Icon icon={Clock} className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Status</span>
                    </div>
                    <p className="text-sm font-medium text-foreground">
                      {effectiveIncident.status}
                    </p>
                  </div>
                </div>

                {/* Timestamp */}
                <div className="flex items-center gap-2 pt-2 border-t border-border">
                  <Icon icon={Calendar} className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {effectiveIncident.timestamp}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Behavior Analysis */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Behavior Analysis
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {effectiveIncident.behaviorAnalysis}
              </p>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent className="p-6 space-y-4">
              {formError ? (
                <Alert variant="destructive">
                  <p className="text-sm">{formError}</p>
                </Alert>
              ) : null}

              <div className="grid gap-3">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Status</p>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Assigned To</p>
                  <Select value={assignedTo} onValueChange={setAssignedTo}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      {assignedToOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Notes</p>
                  <Textarea
                    placeholder="Add notes for this incident..."
                    value={notes}
                    onChangeText={setNotes}
                    rows={4}
                  />
                  {isMonitor && isClosingStatus ? (
                    <p className="text-xs text-muted-foreground">
                      Notes are required to close incidents.
                    </p>
                  ) : null}
                </div>

                <div className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Highlight for next shift
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Shows up in shift handoff summary
                    </p>
                  </div>
                  <ToggleSwitch
                    checked={highlightForNextShift}
                    onCheckedChange={setHighlightForNextShift}
                  />
                </div>
              </div>

              <Button onPress={handleSave} className="w-full">
                <Icon icon={Save} className="h-4 w-4 mr-2" />
                Save Updates
              </Button>

              <div className="text-xs text-muted-foreground">
                Last updated: {lastSavedAt ?? effectiveIncident.lastUpdated} by{" "}
                {effectiveIncident.lastUpdatedBy}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


