"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  Button,
  Badge,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Icon,
  ToggleGroup,
  ToggleGroupItem,
  Text,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Textarea,
} from "ui";
import {
  ArrowLeft,
  Eye,
  Search,
  XCircle,
  AlertTriangle,
  AlertCircle,
  Clock,
  Camera,
} from "ui/src/utils/icons";

export default function AlertsPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = React.useState("timeline");
  const [filterType, setFilterType] = React.useState("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [acknowledgeModalOpen, setAcknowledgeModalOpen] = React.useState(false);
  const [selectedAlertId, setSelectedAlertId] = React.useState<number | null>(null);
  const [responseReason, setResponseReason] = React.useState("");

  const alerts = [
    {
      id: 1,
      title: "Defect Rate Exceeded",
      description: "Defect rate exceeded 5% threshold - immediate quality review required",
      location: "Assembly Line 1 (Production Floor A)",
      time: "2 min ago",
      timestamp: "2025-01-15 14:32:15",
      severity: "critical",
      status: "unacknowledged",
      timeRemaining: "118s remaining",
      isOverdue: false,
      confidence: 95,
      actions: ["Acknowledge", "Create Incident", "View Footage"],
    },
    {
      id: 2,
      title: "Equipment Malfunction",
      description: "Welding equipment temperature anomaly detected - potential safety hazard",
      location: "Welding Station 2 (Fabrication)",
      time: "5 min ago",
      timestamp: "2025-01-15 14:29:42",
      severity: "critical",
      status: "unacknowledged",
      timeRemaining: "62s overdue",
      isOverdue: true,
      confidence: 92,
      actions: ["Acknowledge", "Create Incident", "View Footage"],
    },
    {
      id: 3,
      title: "Assembly Sequence Error",
      description: "Incorrect assembly sequence detected on production unit #4521",
      location: "Quality Control Station (QC Area)",
      time: "12 min ago",
      timestamp: "2025-01-15 14:22:08",
      severity: "warning",
      status: "acknowledged",
      timeRemaining: null,
      isOverdue: false,
      confidence: 88,
      actions: ["Resolve", "Create Incident", "View Footage"],
    },
    {
      id: 4,
      title: "Safety Zone Violation",
      description: "Worker entered restricted zone without proper safety equipment",
      location: "Packaging Area (Packaging Zone)",
      time: "18 min ago",
      timestamp: "2025-01-15 14:16:33",
      severity: "warning",
      status: "acknowledged",
      timeRemaining: null,
      isOverdue: false,
      confidence: 91,
      actions: ["Resolve", "Create Incident", "View Footage"],
    },
    {
      id: 5,
      title: "Production Rate Below Target",
      description: "Production rate 15% below target - line speed adjustment recommended",
      location: "Assembly Line 2 (Production Floor A)",
      time: "25 min ago",
      timestamp: "2025-01-15 14:09:17",
      severity: "info",
      status: "resolved",
      timeRemaining: null,
      isOverdue: false,
      confidence: 85,
      actions: [],
    },
  ];

  // Calculate alert counts
  const criticalCount = alerts.filter((a) => a.severity === "critical").length;
  const warningCount = alerts.filter((a) => a.severity === "warning").length;

  // Filter alerts
  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch = 
      alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = 
      filterType === "all" ||
      (filterType === "critical" && alert.severity === "critical") ||
      (filterType === "warning" && alert.severity === "warning") ||
      (filterType === "info" && alert.severity === "info");
    
    return matchesSearch && matchesFilter;
  });

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return XCircle;
      case "warning":
        return AlertTriangle;
      case "info":
        return AlertCircle;
      default:
        return AlertCircle;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500";
      case "warning":
        return "bg-yellow-500";
      case "info":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusBadge = (alert: typeof alerts[0]) => {
    if (alert.status === "resolved") {
      return (
        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-800">
          RESOLVED
        </Badge>
      );
    }
    if (alert.status === "acknowledged") {
      return (
        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-800">
          ACKNOWLEDGED
        </Badge>
      );
    }
    if (alert.timeRemaining) {
      return (
        <div className="flex items-center gap-2">
          <Badge variant="destructive">UNACKNOWLEDGED</Badge>
          <Badge 
            variant="outline" 
            className={alert.isOverdue 
              ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800"
              : "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800"
            }
          >
            <Icon icon={Clock} className="h-3 w-3 mr-1" />
            {alert.timeRemaining}
          </Badge>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Button
              variant="ghost"
              size="sm"
              onPress={() => router.push("/monitor/dashboard")}
              className="flex-row items-center -ml-2"
            >
              <Icon icon={ArrowLeft} className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Production Alert Management</h1>
            <p className="text-muted-foreground mt-1">
              Monitor & Respond to Quality & Safety Alerts
            </p>
          </div>
        </div>
      </div>

      {/* Filters and Search - Single Row with Alert Badges */}
      <Card className="relative z-[500] overflow-visible">
        <CardContent className="p-4 overflow-visible">
          <div className="flex flex-row items-center gap-4 flex-nowrap">
            <div className="flex-shrink-0">
              <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value)} className="flex-row">
                <ToggleGroupItem value="timeline" className="px-4">
                  <Text className={viewMode === "timeline" ? "!text-white !dark:text-white" : ""}>Timeline</Text>
                </ToggleGroupItem>
                <ToggleGroupItem value="category" className="px-4">
                  <Text className={viewMode === "category" ? "!text-white !dark:text-white" : ""}>Category</Text>
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            {/* Ensure dropdown overlays subsequent content */}
            <div className="flex-shrink-0 relative z-[1000]">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Alerts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Alerts</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="warning">Warnings</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="relative flex-1 min-w-0">
              <Icon icon={Search} className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                className="pl-10 w-full"
              />
            </div>

            <div className="flex-shrink-0 flex items-center gap-2">
              <Badge variant="destructive" className="px-3 py-1">
                {criticalCount} Critical
              </Badge>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800 px-3 py-1">
                {warningCount} Warnings
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      <div className="space-y-4 relative z-0">
        {filteredAlerts.map((alert) => (
          <Card key={alert.id} className="relative z-0 overflow-hidden">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start gap-4">
                {/* Severity Icon */}
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${getSeverityColor(alert.severity)} shrink-0`}>
                  <Icon icon={getSeverityIcon(alert.severity)} className="h-5 w-5 text-white" />
                </div>

                {/* Alert Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-1.5">{alert.title}</h3>
                      <p className="text-sm text-muted-foreground">{alert.description}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      {getStatusBadge(alert)}
                    </div>
                  </div>

                  {/* Location, Time, Confidence, and Timestamp - Single Row, Justified */}
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Icon icon={Camera} className="h-4 w-4" />
                      <span>{alert.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Icon icon={Clock} className="h-4 w-4" />
                      <span>{alert.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Icon icon={AlertTriangle} className="h-4 w-4" />
                      <span>Confidence: {alert.confidence}%</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs">{alert.timestamp}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {alert.actions.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                      {alert.actions.map((action, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onPress={() => {
                            if (action === "Create Incident") {
                              router.push("/monitor/incidents/create");
                            } else if (action === "View Footage") {
                              router.push(`/monitor/alerts/${alert.id}/footage`);
                            } else if (action === "Acknowledge" || action.includes("Acknowledge")) {
                              setSelectedAlertId(alert.id);
                              setAcknowledgeModalOpen(true);
                              setResponseReason("");
                            } else {
                              // Handle other actions
                              console.log(`${action} clicked for alert ${alert.id}`);
                            }
                          }}
                          className="h-9"
                        >
                          {action}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAlerts.length === 0 && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Icon icon={AlertCircle} className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm font-medium text-foreground mb-1">No alerts found</p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Acknowledge Critical Alert Modal */}
      <Dialog open={acknowledgeModalOpen} onOpenChange={setAcknowledgeModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive">
                <Icon icon={XCircle} className="h-5 w-5 text-white" />
              </div>
              <DialogTitle>Critical Alert - Response Reason Required</DialogTitle>
            </div>
            <DialogDescription className="mt-3">
              Critical alerts require a response reason before acknowledgment. This ensures proper documentation and accountability.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">
                Why are you acknowledging this critical alert?
              </p>
              <Textarea
                placeholder="Describe your immediate response plan and actions being taken..."
                value={responseReason}
                onChangeText={setResponseReason}
                rows={5}
                className="min-h-[120px]"
              />
              <p className="text-xs text-muted-foreground">
                This response will be logged for audit trail and quality compliance purposes.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onPress={() => {
                setAcknowledgeModalOpen(false);
                setResponseReason("");
                setSelectedAlertId(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onPress={() => {
                if (!responseReason.trim()) {
                  // Could show an error here
                  return;
                }
                // Handle acknowledge action
                console.log("Acknowledging alert:", selectedAlertId, "with reason:", responseReason);
                // Close modal and reset
                setAcknowledgeModalOpen(false);
                setResponseReason("");
                setSelectedAlertId(null);
              }}
              disabled={!responseReason.trim()}
            >
              Acknowledge Critical Alert
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

