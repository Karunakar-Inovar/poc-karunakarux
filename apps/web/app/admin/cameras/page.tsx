"use client";

import { useState } from "react";
import {
  Card,
  Button,
  Icon,
  Badge,
  StatsCard,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Input,
  Label,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Snackbar,
  useSnackbar,
} from "ui";
import {
  Plus,
  Search,
  Upload,
  Check,
  Pencil,
  Trash2,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  Square,
} from "ui/utils/icons";

// Camera data based on wireframe
const camerasData = [
  {
    id: 1,
    name: "Camera 1",
    location: "Zone A - Main Entry",
    streamUrl: "rtsp://192.168.1.101",
    pipeline: "Person Detection",
    status: "active",
    fps: 30,
  },
  {
    id: 2,
    name: "Camera 2",
    location: "Zone B - Assembly Line",
    streamUrl: "rtsp://192.168.1.102",
    pipeline: "Person Detection",
    status: "active",
    fps: 25,
  },
  {
    id: 3,
    name: "Camera 3",
    location: "Zone C - Storage Area",
    streamUrl: "rtsp://192.168.1.103",
    pipeline: "Object Classification",
    status: "warning",
    fps: 20,
  },
  {
    id: 4,
    name: "Camera 4",
    location: "Zone D - Parking Lot",
    streamUrl: "rtsp://192.168.1.104",
    pipeline: "Object Classification",
    status: "error",
    fps: 30,
  },
  {
    id: 5,
    name: "Camera 5",
    location: "Zone A - Exit",
    streamUrl: "rtsp://192.168.1.105",
    pipeline: null,
    status: "active",
    fps: 30,
  },
  {
    id: 6,
    name: "Camera 6",
    location: "Zone B - Quality Check",
    streamUrl: "rtsp://192.168.1.106",
    pipeline: null,
    status: "stopped",
    fps: 25,
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">
          <Icon icon={CheckCircle} className="h-3 w-3 mr-1" />
          Active
        </Badge>
      );
    case "warning":
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800">
          <Icon icon={AlertTriangle} className="h-3 w-3 mr-1" />
          Warning
        </Badge>
      );
    case "error":
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800">
          <Icon icon={AlertCircle} className="h-3 w-3 mr-1" />
          Error
        </Badge>
      );
    case "stopped":
      return (
        <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-700">
          <Icon icon={Square} className="h-3 w-3 mr-1" />
          Stopped
        </Badge>
      );
    default:
      return null;
  }
};

const getPipelineBadge = (pipeline: string | null) => {
  if (!pipeline) {
    return (
      <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-700">
        Not Assigned
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800">
      {pipeline}
    </Badge>
  );
};

// FPS options
const fpsOptions = [
  { value: "15", label: "15 FPS" },
  { value: "20", label: "20 FPS" },
  { value: "25", label: "25 FPS" },
  { value: "30", label: "30 FPS" },
  { value: "60", label: "60 FPS" },
];

// Resolution options
const resolutionOptions = [
  { value: "720p", label: "720p (HD)" },
  { value: "1080p", label: "1080p (Full HD)" },
  { value: "1440p", label: "1440p (2K)" },
  { value: "2160p", label: "2160p (4K)" },
];

// Pipeline options
const pipelineOptions = [
  { value: "", label: "Not Assigned" },
  { value: "person-detection", label: "Person Detection" },
  { value: "object-classification", label: "Object Classification" },
  { value: "vehicle-recognition", label: "Vehicle Recognition" },
  { value: "face-detection", label: "Face Detection" },
];

// Location options (zones)
const locationOptions = [
  { value: "zone-a-main-entry", label: "Zone A - Main Entry" },
  { value: "zone-a-exit", label: "Zone A - Exit" },
  { value: "zone-b-assembly-line", label: "Zone B - Assembly Line" },
  { value: "zone-b-quality-check", label: "Zone B - Quality Check" },
  { value: "zone-c-storage-area", label: "Zone C - Storage Area" },
  { value: "zone-d-parking-lot", label: "Zone D - Parking Lot" },
  { value: "zone-e-loading-dock", label: "Zone E - Loading Dock" },
  { value: "zone-f-reception", label: "Zone F - Reception" },
  { value: "zone-g-server-room", label: "Zone G - Server Room" },
  { value: "zone-h-warehouse", label: "Zone H - Warehouse" },
];

// Camera type
interface Camera {
  id: number;
  name: string;
  location: string;
  streamUrl: string;
  pipeline: string | null;
  status: string;
  fps: number;
}

export default function CamerasPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const snackbar = useSnackbar();
  
  // Form state for new camera
  const [newCamera, setNewCamera] = useState({
    name: "",
    location: "",
    streamUrl: "",
    fps: "30",
    resolution: "1080p",
    pipeline: "",
  });

  // Form state for editing camera
  const [editCamera, setEditCamera] = useState({
    name: "",
    location: "",
    streamUrl: "",
    fps: "30",
    resolution: "1080p",
    pipeline: "",
  });

  // Calculate stats
  const totalCameras = camerasData.length;
  const activeCameras = camerasData.filter((c) => c.status === "active").length;
  const warningCameras = camerasData.filter((c) => c.status === "warning").length;
  const errorCameras = camerasData.filter((c) => c.status === "error").length;

  // Filter cameras based on search
  const filteredCameras = camerasData.filter(
    (camera) =>
      camera.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      camera.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddCamera = () => {
    // TODO: Implement actual camera addition logic
    console.log("Adding camera:", newCamera);
    setIsAddModalOpen(false);
    
    // Show success snackbar
    snackbar.success(`Camera "${newCamera.name || 'New Camera'}" added successfully!`);
    
    // Reset form
    setNewCamera({
      name: "",
      location: "",
      streamUrl: "",
      fps: "30",
      resolution: "1080p",
      pipeline: "",
    });
  };

  const handleEditClick = (camera: Camera) => {
    setSelectedCamera(camera);
    // Map camera data to form state
    const locationValue = locationOptions.find(l => l.label === camera.location)?.value || "";
    const pipelineValue = pipelineOptions.find(p => p.label === camera.pipeline)?.value || "";
    
    setEditCamera({
      name: camera.name,
      location: locationValue,
      streamUrl: camera.streamUrl,
      fps: camera.fps.toString(),
      resolution: "1080p", // Default since not in data
      pipeline: pipelineValue,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateCamera = () => {
    // TODO: Implement actual camera update logic
    console.log("Updating camera:", selectedCamera?.id, editCamera);
    setIsEditModalOpen(false);
    snackbar.success(`Camera "${editCamera.name}" updated successfully!`);
    setSelectedCamera(null);
  };

  const handleDeleteClick = (camera: Camera) => {
    setSelectedCamera(camera);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    // TODO: Implement actual camera deletion logic
    console.log("Deleting camera:", selectedCamera?.id);
    setIsDeleteDialogOpen(false);
    snackbar.success(`Camera "${selectedCamera?.name}" deleted successfully!`);
    setSelectedCamera(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Camera Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage and configure camera feeds
          </p>
        </div>
        <Button onPress={() => setIsAddModalOpen(true)} className="w-full sm:w-auto">
          <Icon icon={Plus} className="h-4 w-4 mr-2" />
          Add Camera
        </Button>
      </div>

      {/* Bulk Upload Promo Card */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border-2 border-dashed border-muted-foreground/30 bg-muted/20 p-4">
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-lg border bg-background">
            <Icon icon={Upload} className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-foreground">Bulk Camera Upload</h3>
              <Badge variant="outline" className="text-xs">Coming Soon</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Import multiple cameras at once using CSV file upload
            </p>
            <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Icon icon={Check} className="h-3 w-3 text-green-600" />
                Upload hundreds of cameras in seconds
              </span>
              <span className="flex items-center gap-1">
                <Icon icon={Check} className="h-3 w-3 text-green-600" />
                Pre-configured templates for easy setup
              </span>
            </div>
          </div>
        </div>
        <Button variant="outline" className="h-9 px-4 w-full sm:w-auto">
          Request Early Access
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          label="Total Cameras"
          value={totalCameras}
          color="default"
        />
        <StatsCard
          label="Active"
          value={activeCameras}
          color="green"
        />
        <StatsCard
          label="Warning"
          value={warningCameras}
          color="amber"
        />
        <StatsCard
          label="Error"
          value={errorCameras}
          color="red"
        />
      </div>

      {/* Search */}
      <div className="relative w-full max-w-md">
        <Icon icon={Search} className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search cameras..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 w-full"
        />
      </div>

      {/* Cameras Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="h-12 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Camera
                </th>
                <th className="h-12 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Location
                </th>
                <th className="h-12 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Stream URL
                </th>
                <th className="h-12 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Pipeline
                </th>
                <th className="h-12 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="h-12 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  FPS
                </th>
                <th className="h-12 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCameras.map((camera) => (
                <tr
                  key={camera.id}
                  className="border-b border-border transition-colors hover:bg-muted/50"
                >
                  <td className="px-4 py-3">
                    <span className="font-medium text-foreground">{camera.name}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-muted-foreground">{camera.location}</span>
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-sm text-muted-foreground font-mono bg-muted px-2 py-1 rounded">
                      {camera.streamUrl}
                    </code>
                  </td>
                  <td className="px-4 py-3">{getPipelineBadge(camera.pipeline)}</td>
                  <td className="px-4 py-3">{getStatusBadge(camera.status)}</td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-foreground">{camera.fps} fps</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onPress={() => handleEditClick(camera as Camera)}
                      >
                        <Icon icon={Pencil} className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        onPress={() => handleDeleteClick(camera as Camera)}
                      >
                        <Icon icon={Trash2} className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Camera Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Camera</DialogTitle>
            <DialogDescription>
              Configure a new camera feed for monitoring
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Camera Name */}
            <div className="space-y-2">
              <Label htmlFor="camera-name">Camera Name</Label>
              <Input
                id="camera-name"
                placeholder="e.g., Camera 7"
                value={newCamera.name}
                onChange={(e) => setNewCamera({ ...newCamera, name: e.target.value })}
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label>Location</Label>
              <Select value={newCamera.location} onValueChange={(value) => setNewCamera({ ...newCamera, location: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Location" />
                </SelectTrigger>
                <SelectContent>
                  {locationOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Stream URL */}
            <div className="space-y-2">
              <Label htmlFor="stream-url">Stream URL</Label>
              <Input
                id="stream-url"
                placeholder="rtsp://192.168.1.107"
                value={newCamera.streamUrl}
                onChange={(e) => setNewCamera({ ...newCamera, streamUrl: e.target.value })}
              />
            </div>

            {/* FPS and Resolution Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>FPS</Label>
                <Select value={newCamera.fps} onValueChange={(value) => setNewCamera({ ...newCamera, fps: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select FPS" />
                  </SelectTrigger>
                  <SelectContent>
                    {fpsOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Resolution</Label>
                <Select value={newCamera.resolution} onValueChange={(value) => setNewCamera({ ...newCamera, resolution: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Resolution" />
                  </SelectTrigger>
                  <SelectContent>
                    {resolutionOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Pipeline */}
            <div className="space-y-2">
              <Label>Pipeline</Label>
              <Select value={newCamera.pipeline} onValueChange={(value) => setNewCamera({ ...newCamera, pipeline: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Pipeline" />
                </SelectTrigger>
                <SelectContent>
                  {pipelineOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onPress={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button onPress={handleAddCamera}>
              Add Camera
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Camera Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Camera</DialogTitle>
            <DialogDescription>
              Update camera configuration
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Camera Name */}
            <div className="space-y-2">
              <Label htmlFor="edit-camera-name">Camera Name</Label>
              <Input
                id="edit-camera-name"
                placeholder="e.g., Camera 7"
                value={editCamera.name}
                onChange={(e) => setEditCamera({ ...editCamera, name: e.target.value })}
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label>Location</Label>
              <Select value={editCamera.location} onValueChange={(value) => setEditCamera({ ...editCamera, location: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Location" />
                </SelectTrigger>
                <SelectContent>
                  {locationOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Stream URL */}
            <div className="space-y-2">
              <Label htmlFor="edit-stream-url">Stream URL</Label>
              <Input
                id="edit-stream-url"
                placeholder="rtsp://192.168.1.107"
                value={editCamera.streamUrl}
                onChange={(e) => setEditCamera({ ...editCamera, streamUrl: e.target.value })}
              />
            </div>

            {/* FPS and Resolution Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>FPS</Label>
                <Select value={editCamera.fps} onValueChange={(value) => setEditCamera({ ...editCamera, fps: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select FPS" />
                  </SelectTrigger>
                  <SelectContent>
                    {fpsOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Resolution</Label>
                <Select value={editCamera.resolution} onValueChange={(value) => setEditCamera({ ...editCamera, resolution: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Resolution" />
                  </SelectTrigger>
                  <SelectContent>
                    {resolutionOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Pipeline */}
            <div className="space-y-2">
              <Label>Pipeline</Label>
              <Select value={editCamera.pipeline} onValueChange={(value) => setEditCamera({ ...editCamera, pipeline: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Pipeline" />
                </SelectTrigger>
                <SelectContent>
                  {pipelineOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onPress={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onPress={handleUpdateCamera}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Camera</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedCamera?.name}"? This action cannot be undone. 
              All associated recordings and configurations will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onPress={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onPress={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Icon icon={Trash2} className="h-4 w-4 mr-2" />
              Delete Camera
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Success Snackbar */}
      <Snackbar
        visible={snackbar.state.visible}
        message={snackbar.state.message}
        variant={snackbar.state.variant}
        onClose={snackbar.hide}
      />
    </div>
  );
}
