"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  Button,
  Icon,
  Badge,
  Input,
  StatsCard,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Label,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Checkbox,
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "ui";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Pause,
  RefreshCw,
  Bell,
  Brain,
  Camera,
} from "ui/utils/icons";

// Pipeline type
interface Pipeline {
  id: number;
  name: string;
  model: string;
  cameras: {
    total: number;
    online: number;
    cameraIds?: string[]; // Array of selected camera IDs
  };
  channels: number;
  status: "running" | "stopped" | "error";
  createdAt: string;
}

// Pipeline data based on wireframe
const pipelinesData: Pipeline[] = [
  {
    id: 1,
    name: "Defect Detection Pipeline",
    model: "Defect Detection",
    cameras: {
      total: 2,
      online: 2,
      cameraIds: ["camera-1", "camera-2"], // Selected cameras
    },
    channels: 1,
    status: "running",
    createdAt: "Just now",
  },
];

// Get status badge
const getStatusBadge = (status: string) => {
  switch (status) {
    case "running":
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">
          Running
        </Badge>
      );
    case "stopped":
      return (
        <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-700">
          Stopped
        </Badge>
      );
    case "error":
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800">
          Error
        </Badge>
      );
    default:
      return null;
  }
};

export default function PipelinesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingPipeline, setEditingPipeline] = useState<Pipeline | null>(null);
  const [pipelineToDelete, setPipelineToDelete] = useState<Pipeline | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    model: "",
    cameras: [] as string[],
  });
  const [editFormData, setEditFormData] = useState({
    name: "",
    cameras: [] as string[],
  });

  // Calculate stats
  const totalPipelines = pipelinesData.length;
  const runningPipelines = pipelinesData.filter((p) => p.status === "running").length;
  const errorPipelines = pipelinesData.filter((p) => p.status === "error").length;
  const stoppedPipelines = pipelinesData.filter((p) => p.status === "stopped").length;

  // Filter pipelines based on search
  const filteredPipelines = pipelinesData.filter(
    (pipeline) =>
      pipeline.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pipeline.model.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Camera options for the form
  const cameraOptions = [
    { id: "camera-1", label: "Camera 1 - Zone A" },
    { id: "camera-2", label: "Camera 2 - Zone A" },
    { id: "camera-3", label: "Camera 3 - Zone B" },
    { id: "camera-4", label: "Camera 4 - Zone B" },
    { id: "camera-5", label: "Camera 5 - Zone C" },
  ];

  // Model options for the form
  const modelOptions = [
    { value: "defect-detection", label: "Defect Detection" },
    { value: "ppe-compliance", label: "PPE Compliance" },
    { value: "intrusion-detection", label: "Intrusion Detection" },
  ];

  const handleStop = (pipeline: Pipeline) => {
    console.log("Stop pipeline:", pipeline.id);
  };

  const handleRestart = (pipeline: Pipeline) => {
    console.log("Restart pipeline:", pipeline.id);
  };

  const handleEdit = (pipeline: Pipeline) => {
    setEditingPipeline(pipeline);
    setEditFormData({
      name: pipeline.name,
      cameras: pipeline.cameras.cameraIds || [],
    });
    setIsEditModalOpen(true);
  };

  const handleNotify = (pipeline: Pipeline) => {
    console.log("Notify pipeline:", pipeline.id);
  };

  const handleDelete = (pipeline: Pipeline) => {
    setPipelineToDelete(pipeline);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (pipelineToDelete) {
      console.log("Deleting pipeline:", pipelineToDelete.id);
      // TODO: Remove pipeline from pipelinesData
      setIsDeleteDialogOpen(false);
      setPipelineToDelete(null);
    }
  };

  const handleCreatePipeline = () => {
    console.log("Creating pipeline:", formData);
    setIsCreateModalOpen(false);
    setFormData({ name: "", model: "", cameras: [] });
  };

  const handleCameraToggle = (cameraId: string) => {
    setFormData((prev) => ({
      ...prev,
      cameras: prev.cameras.includes(cameraId)
        ? prev.cameras.filter((id) => id !== cameraId)
        : [...prev.cameras, cameraId],
    }));
  };

  const handleEditCameraToggle = (cameraId: string) => {
    setEditFormData((prev) => ({
      ...prev,
      cameras: prev.cameras.includes(cameraId)
        ? prev.cameras.filter((id) => id !== cameraId)
        : [...prev.cameras, cameraId],
    }));
  };

  const handleSavePipeline = () => {
    if (editingPipeline) {
      console.log("Saving pipeline:", editingPipeline.id, editFormData);
      // TODO: Update pipeline with editFormData
      setIsEditModalOpen(false);
      setEditingPipeline(null);
      setEditFormData({ name: "", cameras: [] });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Pipeline Management</h1>
          <p className="text-muted-foreground mt-1">
            Configure and manage AI processing pipelines
          </p>
        </div>
        <Button onPress={() => setIsCreateModalOpen(true)} className="w-full sm:w-auto">
          <Icon icon={Plus} className="h-4 w-4 mr-2" />
          Create Pipeline
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard label="Total Pipelines" value={totalPipelines} color="default" />
        <StatsCard label="Running" value={runningPipelines} color="green" />
        <StatsCard label="Errors" value={errorPipelines} color="red" />
        <StatsCard label="Stopped" value={stoppedPipelines} color="default" />
      </div>

      {/* Search */}
      <div className="relative w-full">
        <Icon icon={Search} className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search pipelines..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 w-full"
        />
      </div>

      {/* Pipeline Cards */}
      <div className="space-y-4">
        {filteredPipelines.map((pipeline) => (
          <Card key={pipeline.id} className="overflow-hidden">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                {/* Left side - Pipeline info */}
                <div className="flex-1 min-w-0">
                  {/* Name and Status */}
                  <div className="flex items-center gap-3 mb-4 flex-wrap">
                    <h3 className="text-base sm:text-lg font-semibold text-foreground">{pipeline.name}</h3>
                    {getStatusBadge(pipeline.status)}
                  </div>

                  {/* Details */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Icon icon={Brain} className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm text-foreground truncate">Model: {pipeline.model}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon icon={Camera} className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm text-foreground">
                        Cameras: {pipeline.cameras.online}/{pipeline.cameras.total} online
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon icon={Bell} className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm text-foreground">
                        Channels: {pipeline.channels} configured
                      </span>
                    </div>
                  </div>

                  {/* Created date */}
                  <p className="text-xs text-muted-foreground mt-4">
                    Created {pipeline.createdAt}
                  </p>
                </div>

                {/* Right side - Action buttons (horizontal) */}
                <div className="flex flex-row gap-2 sm:ml-6 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-muted items-center justify-center"
                    onPress={() => handleStop(pipeline)}
                  >
                    <Icon icon={Pause} className="h-4 w-4 mr-2 text-muted-foreground" />
                    Stop
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-muted items-center justify-center"
                    onPress={() => handleRestart(pipeline)}
                  >
                    <Icon icon={RefreshCw} className="h-4 w-4 mr-2 text-muted-foreground" />
                    Restart
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-muted items-center justify-center"
                    onPress={() => handleEdit(pipeline)}
                  >
                    <Icon icon={Pencil} className="h-4 w-4 mr-2 text-muted-foreground" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-muted items-center justify-center"
                    onPress={() => handleNotify(pipeline)}
                  >
                    <Icon icon={Bell} className="h-4 w-4 mr-2 text-muted-foreground" />
                    Notify
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 items-center justify-center"
                    onPress={() => handleDelete(pipeline)}
                  >
                    <Icon icon={Trash2} className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Pipeline Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="w-[95vw] max-w-md max-h-[90vh] flex flex-col p-0">
          <DialogHeader className="sticky top-0 border-b border-border bg-background px-6 py-4 z-10">
            <DialogTitle>Create New Pipeline</DialogTitle>
            <DialogDescription>
              Set up a new AI processing pipeline
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="space-y-4">
            {/* Pipeline Name */}
            <div className="space-y-2">
              <Label htmlFor="pipeline-name">
                Pipeline Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="pipeline-name"
                placeholder="e.g., Defect Detection Pipeline"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            {/* Select AI Model */}
            <div className="space-y-2">
              <Label>
                Select AI Model <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.model}
                onValueChange={(value) => setFormData({ ...formData, model: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a model" />
                </SelectTrigger>
                <SelectContent>
                  {modelOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Select Cameras */}
            <div className="space-y-2">
              <Label>
                Select Cameras <span className="text-red-500">*</span>
              </Label>
              <div className="border border-border rounded-md p-4 space-y-3 bg-background">
                {cameraOptions.map((camera) => (
                  <div key={camera.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={camera.id}
                      checked={formData.cameras.includes(camera.id)}
                      onCheckedChange={() => handleCameraToggle(camera.id)}
                    />
                    <Label
                      htmlFor={camera.id}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {camera.label}
                    </Label>
                  </div>
                ))}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="sticky bottom-0 border-t border-border bg-background px-6 py-4">
            <Button
              variant="outline"
              onPress={() => {
                setIsCreateModalOpen(false);
                setFormData({ name: "", model: "", cameras: [] });
              }}
            >
              Cancel
            </Button>
            <Button
              onPress={handleCreatePipeline}
              disabled={!formData.name || !formData.model || formData.cameras.length === 0}
            >
              Create Pipeline
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Pipeline Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="w-[95vw] max-w-md max-h-[90vh] flex flex-col p-0">
          <DialogHeader className="sticky top-0 border-b border-border bg-background px-6 py-4 z-10">
            <DialogTitle>Edit Pipeline</DialogTitle>
            <DialogDescription>
              Modify pipeline configuration
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="space-y-4">
              {/* Pipeline Name */}
              <div className="space-y-2">
                <Label htmlFor="edit-pipeline-name">Pipeline Name</Label>
                <Input
                  id="edit-pipeline-name"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                />
              </div>

              {/* Select Cameras */}
              <div className="space-y-2">
                <Label>Select Cameras</Label>
                <div className="border border-border rounded-md p-4 space-y-3 bg-background">
                  {cameraOptions.map((camera) => (
                    <div key={camera.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`edit-${camera.id}`}
                        checked={editFormData.cameras.includes(camera.id)}
                        onCheckedChange={() => handleEditCameraToggle(camera.id)}
                      />
                      <Label
                        htmlFor={`edit-${camera.id}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {camera.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="sticky bottom-0 border-t border-border bg-background px-6 py-4">
            <Button
              variant="outline"
              onPress={() => {
                setIsEditModalOpen(false);
                setEditingPipeline(null);
                setEditFormData({ name: "", cameras: [] });
              }}
            >
              Cancel
            </Button>
            <Button
              onPress={handleSavePipeline}
              disabled={!editFormData.name || editFormData.cameras.length === 0}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Pipeline</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{pipelineToDelete?.name}&quot;? This action cannot be undone. 
              All camera assignments and configurations for this pipeline will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <Button variant="outline" onPress={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onPress={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Icon icon={Trash2} className="h-4 w-4 mr-2" />
              Delete Pipeline
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
