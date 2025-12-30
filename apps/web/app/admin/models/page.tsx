"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  Button,
  Icon,
  Badge,
  Input,
  ToggleSwitch,
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
  Label,
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
  Pencil,
  Trash2,
  Brain,
} from "ui/utils/icons";

// Model type
interface AIModel {
  id: number;
  name: string;
  category: string;
  framework: "YOLO" | "TensorFlow" | "PyTorch" | "ONNX" | "OpenVINO";
  status: "active" | "inactive";
  assignedCameras: string[];
  confidenceThreshold: number;
  detectionFrequency: string;
}

// AI Models data based on wireframe
const modelsData: AIModel[] = [
  {
    id: 1,
    name: "Defect Detection",
    category: "Quality Control",
    framework: "YOLO",
    status: "active",
    assignedCameras: ["Production Line 1", "Production Line 2"],
    confidenceThreshold: 85,
    detectionFrequency: "Every 5s",
  },
  {
    id: 2,
    name: "PPE Compliance",
    category: "Safety Monitoring",
    framework: "TensorFlow",
    status: "active",
    assignedCameras: ["Production Line 1"],
    confidenceThreshold: 90,
    detectionFrequency: "Every 10s",
  },
  {
    id: 3,
    name: "Intrusion Detection",
    category: "Security",
    framework: "PyTorch",
    status: "inactive",
    assignedCameras: ["Warehouse Entry"],
    confidenceThreshold: 95,
    detectionFrequency: "Every 2s",
  },
];

// Framework badge colors
const getFrameworkBadge = (framework: string) => {
  const colors: Record<string, string> = {
    YOLO: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400",
    TensorFlow: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400",
    PyTorch: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400",
    ONNX: "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-400",
    OpenVINO: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400",
  };
  return (
    <Badge variant="outline" className={colors[framework] || ""}>
      {framework}
    </Badge>
  );
};

// Status badge
const getStatusBadge = (status: string) => {
  if (status === "active") {
    return (
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400">
        active
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400">
      inactive
    </Badge>
  );
};

// Category options
const categoryOptions = [
  { value: "quality-control", label: "Quality Control" },
  { value: "safety-monitoring", label: "Safety Monitoring" },
  { value: "security", label: "Security" },
  { value: "analytics", label: "Analytics" },
  { value: "custom", label: "Custom" },
];

// Framework options
const frameworkOptions = [
  { value: "YOLO", label: "YOLO" },
  { value: "TensorFlow", label: "TensorFlow" },
  { value: "PyTorch", label: "PyTorch" },
  { value: "ONNX", label: "ONNX" },
  { value: "OpenVINO", label: "OpenVINO" },
];

// Detection frequency options
const frequencyOptions = [
  { value: "every-1s", label: "Every 1s" },
  { value: "every-2s", label: "Every 2s" },
  { value: "every-5s", label: "Every 5s" },
  { value: "every-10s", label: "Every 10s" },
  { value: "every-30s", label: "Every 30s" },
];

// Confidence threshold options
const thresholdOptions = [
  { value: "70", label: "70%" },
  { value: "75", label: "75%" },
  { value: "80", label: "80%" },
  { value: "85", label: "85%" },
  { value: "90", label: "90%" },
  { value: "95", label: "95%" },
];

export default function ModelsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [models, setModels] = useState<AIModel[]>(modelsData);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null);
  const snackbar = useSnackbar();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    framework: "",
    confidenceThreshold: "85",
    detectionFrequency: "every-5s",
  });

  // Filter models based on search
  const filteredModels = models.filter(
    (model) =>
      model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.framework.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleStatus = (model: AIModel) => {
    setModels(models.map(m => 
      m.id === model.id 
        ? { ...m, status: m.status === "active" ? "inactive" : "active" }
        : m
    ));
    snackbar.success(`Model "${model.name}" ${model.status === "active" ? "disabled" : "enabled"} successfully!`);
  };

  const handleAddModel = () => {
    console.log("Adding model:", formData);
    setIsAddModalOpen(false);
    snackbar.success(`Model "${formData.name}" added successfully!`);
    resetForm();
  };

  const handleEditClick = (model: AIModel) => {
    setSelectedModel(model);
    setFormData({
      name: model.name,
      category: categoryOptions.find(c => c.label === model.category)?.value || "",
      framework: model.framework,
      confidenceThreshold: model.confidenceThreshold.toString(),
      detectionFrequency: `every-${model.detectionFrequency.replace("Every ", "").toLowerCase()}`,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateModel = () => {
    console.log("Updating model:", selectedModel?.id, formData);
    setIsEditModalOpen(false);
    snackbar.success(`Model "${formData.name}" updated successfully!`);
    setSelectedModel(null);
    resetForm();
  };

  const handleDeleteClick = (model: AIModel) => {
    setSelectedModel(model);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    console.log("Deleting model:", selectedModel?.id);
    setModels(models.filter(m => m.id !== selectedModel?.id));
    setIsDeleteDialogOpen(false);
    snackbar.success(`Model "${selectedModel?.name}" deleted successfully!`);
    setSelectedModel(null);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      framework: "",
      confidenceThreshold: "85",
      detectionFrequency: "every-5s",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">AI Model Management</h1>
          <p className="text-muted-foreground mt-1">
            Configure detection models and assignments
          </p>
        </div>
        <Button onPress={() => setIsAddModalOpen(true)} className="w-full sm:w-auto">
          <Icon icon={Plus} className="h-4 w-4 mr-2" />
          Add Model
        </Button>
      </div>

      {/* Search */}
      <div className="relative w-full">
        <Icon icon={Search} className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search models by name or type..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 w-full"
        />
      </div>

      {/* Model Cards */}
      <div className="space-y-4">
        {filteredModels.map((model) => (
          <Card key={model.id} className="overflow-hidden">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                {/* Left side - Model info */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  {/* Brain Icon */}
                  <div className="p-3 rounded-full bg-muted">
                    <Icon icon={Brain} className="h-6 w-6 text-muted-foreground" />
                  </div>

                  {/* Model Details */}
                  <div className="space-y-3">
                    {/* Name and Badges */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-semibold text-foreground">{model.name}</h3>
                      <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-300">
                        {model.category}
                      </Badge>
                      {getFrameworkBadge(model.framework)}
                      {getStatusBadge(model.status)}
                    </div>

                    {/* Assigned Cameras, Threshold and Frequency - Same Row */}
                    <div className="flex items-start gap-8 flex-wrap">
                      <div>
                        <p className="text-sm text-muted-foreground">Assigned Cameras</p>
                        <p className="text-sm font-medium text-foreground">
                          {model.assignedCameras.join(", ")}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Confidence Threshold</p>
                        <p className="text-sm font-medium text-foreground">{model.confidenceThreshold}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Detection Frequency</p>
                        <p className="text-sm font-medium text-foreground">{model.detectionFrequency}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right side - Actions */}
                <div className="flex items-center gap-3 flex-shrink-0 flex-wrap sm:flex-nowrap">
                  {/* Toggle Switch with Label */}
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`model-toggle-${model.id}`} className="text-sm text-muted-foreground cursor-pointer">
                      {model.status === "active" ? "Enabled" : "Disabled"}
                    </Label>
                    <ToggleSwitch
                      id={`model-toggle-${model.id}`}
                      checked={model.status === "active"}
                      onCheckedChange={() => handleToggleStatus(model)}
                      size="md"
                    />
                  </div>
                  <div className="h-6 w-px bg-border" />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onPress={() => handleEditClick(model)}
                  >
                    <Icon icon={Pencil} className="h-4 w-4 text-muted-foreground" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    onPress={() => handleDeleteClick(model)}
                  >
                    <Icon icon={Trash2} className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Model Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Model</DialogTitle>
            <DialogDescription>
              Configure a new AI detection model
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="model-name">Model Name</Label>
              <Input
                id="model-name"
                placeholder="e.g., Object Detection"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Framework</Label>
              <Select value={formData.framework} onValueChange={(value) => setFormData({ ...formData, framework: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Framework" />
                </SelectTrigger>
                <SelectContent>
                  {frameworkOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Confidence Threshold</Label>
                <Select value={formData.confidenceThreshold} onValueChange={(value) => setFormData({ ...formData, confidenceThreshold: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Threshold" />
                  </SelectTrigger>
                  <SelectContent>
                    {thresholdOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Detection Frequency</Label>
                <Select value={formData.detectionFrequency} onValueChange={(value) => setFormData({ ...formData, detectionFrequency: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    {frequencyOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onPress={() => { setIsAddModalOpen(false); resetForm(); }}>
              Cancel
            </Button>
            <Button onPress={handleAddModel}>
              Add Model
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Model Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Model</DialogTitle>
            <DialogDescription>
              Update model configuration
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-model-name">Model Name</Label>
              <Input
                id="edit-model-name"
                placeholder="e.g., Object Detection"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Framework</Label>
              <Select value={formData.framework} onValueChange={(value) => setFormData({ ...formData, framework: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Framework" />
                </SelectTrigger>
                <SelectContent>
                  {frameworkOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Confidence Threshold</Label>
                <Select value={formData.confidenceThreshold} onValueChange={(value) => setFormData({ ...formData, confidenceThreshold: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Threshold" />
                  </SelectTrigger>
                  <SelectContent>
                    {thresholdOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Detection Frequency</Label>
                <Select value={formData.detectionFrequency} onValueChange={(value) => setFormData({ ...formData, detectionFrequency: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    {frequencyOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onPress={() => { setIsEditModalOpen(false); resetForm(); }}>
              Cancel
            </Button>
            <Button onPress={handleUpdateModel}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Model</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{selectedModel?.name}&quot;? This action cannot be undone. 
              All camera assignments using this model will be removed.
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
              Delete Model
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
