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
  Label,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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
  Mail,
  Phone,
  MessageSquare,
  GitBranch,
  Shield,
  AlertTriangle,
  Info as InfoIcon,
} from "ui/utils/icons";

// Notification rule type
interface NotificationRule {
  id: number;
  name: string;
  channel: "email" | "sms" | "whatsapp";
  status: "active" | "inactive";
  alertTypes: string[];
  recipients: string;
  appliesTo: "all" | string[];
}

// Notification rules data based on wireframe
const notificationRules: NotificationRule[] = [
  {
    id: 1,
    name: "Critical Alerts to Admin",
    channel: "email",
    status: "active",
    alertTypes: ["Critical", "Security"],
    recipients: "admin@company.com",
    appliesTo: "all",
  },
  {
    id: 2,
    name: "Quality Issues to QA Team",
    channel: "sms",
    status: "active",
    alertTypes: ["Warning", "Quality"],
    recipients: "+1 555 123 4567",
    appliesTo: ["Person Detection Pipeline", "Object Classification Pipeline"],
  },
  {
    id: 3,
    name: "All Alerts to Operations",
    channel: "whatsapp",
    status: "inactive",
    alertTypes: ["Critical", "Warning", "Info"],
    recipients: "+1 555 987 6543",
    appliesTo: "all",
  },
];

const getChannelIcon = (channel: string) => {
  switch (channel) {
    case "email":
      return Mail;
    case "sms":
      return Phone;
    case "whatsapp":
      return MessageSquare;
    default:
      return Mail;
  }
};

const getChannelLabel = (channel: string) => {
  switch (channel) {
    case "email":
      return "Email";
    case "sms":
      return "SMS";
    case "whatsapp":
      return "WhatsApp";
    default:
      return channel;
  }
};

const getAlertTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "security":
      return Shield;
    case "critical":
      return AlertTriangle;
    case "warning":
      return AlertTriangle;
    case "info":
      return InfoIcon;
    default:
      return null;
  }
};

export default function NotificationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [rules, setRules] = useState(notificationRules);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<NotificationRule | null>(null);
  const [ruleToDelete, setRuleToDelete] = useState<NotificationRule | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    channel: "email" as "email" | "sms" | "whatsapp",
    alertTypes: [] as string[],
    appliesTo: "all" as "all" | "specific",
    selectedPipelines: [] as string[],
    recipients: "",
  });

  // Filter rules based on search
  const filteredRules = rules.filter(
    (rule) =>
      rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.recipients.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleStatus = (id: number) => {
    setRules((prev) =>
      prev.map((rule) =>
        rule.id === id
          ? {
              ...rule,
              status: rule.status === "active" ? "inactive" : "active",
            }
          : rule
      )
    );
  };

  const handleEdit = (id: number) => {
    const rule = rules.find((r) => r.id === id);
    if (rule) {
      setEditingRule(rule);
      setFormData({
        name: rule.name,
        channel: rule.channel,
        alertTypes: rule.alertTypes,
        appliesTo: rule.appliesTo === "all" ? "all" : "specific",
        selectedPipelines: rule.appliesTo === "all" ? [] : (rule.appliesTo as string[]),
        recipients: rule.recipients,
      });
      setIsEditModalOpen(true);
    }
  };

  const handleDelete = (id: number) => {
    const rule = rules.find((r) => r.id === id);
    if (rule) {
      setRuleToDelete(rule);
      setIsDeleteDialogOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    if (ruleToDelete) {
      setRules((prev) => prev.filter((rule) => rule.id !== ruleToDelete.id));
      setIsDeleteDialogOpen(false);
      setRuleToDelete(null);
    }
  };

  const handleAddRule = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setEditingRule(null);
    setFormData({
      name: "",
      channel: "email",
      alertTypes: [],
      appliesTo: "all",
      selectedPipelines: [],
      recipients: "",
    });
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingRule(null);
    setFormData({
      name: "",
      channel: "email",
      alertTypes: [],
      appliesTo: "all",
      selectedPipelines: [],
      recipients: "",
    });
  };

  const handleSubmitRule = () => {
    if (editingRule) {
      // Update existing rule
      setRules((prev) =>
        prev.map((rule) =>
          rule.id === editingRule.id
            ? {
                ...rule,
                name: formData.name,
                channel: formData.channel,
                alertTypes: formData.alertTypes,
                appliesTo: formData.appliesTo === "all" ? "all" : formData.selectedPipelines,
                recipients: formData.recipients,
              }
            : rule
        )
      );
      handleCloseEditModal();
    } else {
      // Create new rule
      const newRule: NotificationRule = {
        id: Math.max(...rules.map((r) => r.id)) + 1,
        name: formData.name,
        channel: formData.channel,
        status: "active",
        alertTypes: formData.alertTypes,
        appliesTo: formData.appliesTo === "all" ? "all" : formData.selectedPipelines,
        recipients: formData.recipients,
      };
      setRules((prev) => [...prev, newRule]);
      handleCloseModal();
    }
  };

  const handleAlertTypeToggle = (type: string) => {
    setFormData((prev) => ({
      ...prev,
      alertTypes: prev.alertTypes.includes(type)
        ? prev.alertTypes.filter((t) => t !== type)
        : [...prev.alertTypes, type],
    }));
  };

  // Channel options
  const channelOptions = [
    { value: "email", label: "Email" },
    { value: "sms", label: "SMS" },
    { value: "whatsapp", label: "WhatsApp" },
  ];

  // Apply to options
  const appliesToOptions = [
    { value: "all", label: "All Pipelines (Default)" },
    { value: "specific", label: "Specific Pipelines" },
  ];

  // Alert type options
  const alertTypeOptions = ["Critical", "Warning", "Info", "Security", "Quality"];

  // Available pipelines (this would typically come from your data source)
  const availablePipelines = [
    "Person Detection Pipeline",
    "Object Classification Pipeline",
    "Defect Detection Pipeline",
  ];

  const handlePipelineToggle = (pipeline: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedPipelines: prev.selectedPipelines.includes(pipeline)
        ? prev.selectedPipelines.filter((p) => p !== pipeline)
        : [...prev.selectedPipelines, pipeline],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Notification Management</h1>
        <p className="text-muted-foreground mt-1">
            Configure alert channels and routing rules
          </p>
        </div>
        <Button onPress={handleAddRule} className="w-full sm:w-auto">
          <Icon icon={Plus} className="h-4 w-4 mr-2" />
          Add Rule
        </Button>
      </div>

      {/* Search */}
      <div className="relative w-full">
        <Icon icon={Search} className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search notification rules..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 w-full"
        />
      </div>

      {/* Notification Rule Cards */}
      <div className="space-y-4">
        {filteredRules.map((rule) => (
          <Card key={rule.id} className="overflow-hidden">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                {/* Left side - Rule info */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  {/* Icon */}
                  <div className="p-3 rounded-lg bg-muted">
                    <Icon
                      icon={getChannelIcon(rule.channel)}
                      className="h-5 w-5 text-muted-foreground"
                    />
                  </div>

                  {/* Rule Details */}
                  <div className="flex-1 space-y-3">
                    {/* Title */}
                    <h3 className="text-lg font-semibold text-foreground">{rule.name}</h3>

                    {/* Channel and Status badges */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge
                        variant="outline"
                        className="bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                      >
                        {getChannelLabel(rule.channel)}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={
                          rule.status === "active"
                            ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
                            : "bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-700"
                        }
                      >
                        {rule.status}
                      </Badge>
                    </div>

                    {/* Alert Types */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm text-muted-foreground">Alert Types:</span>
                      {rule.alertTypes.map((type) => {
                        const AlertIcon = getAlertTypeIcon(type);
                        return (
                          <Badge
                            key={type}
                            variant="outline"
                            className="bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                          >
                            {AlertIcon && (
                              <Icon icon={AlertIcon} className="h-3 w-3 mr-1" />
                            )}
                            {type}
                          </Badge>
                        );
                      })}
                    </div>

                    {/* Recipients */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Recipients:</span>
                      <span className="text-sm text-foreground font-medium">{rule.recipients}</span>
              </div>

                    {/* Applies To */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm text-muted-foreground">Applies To:</span>
                      {rule.appliesTo === "all" ? (
                        <Badge
                          variant="outline"
                          className="bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                        >
                          All Pipelines
                        </Badge>
                      ) : (
                        rule.appliesTo.map((pipeline) => (
                          <Badge
                            key={pipeline}
                            variant="outline"
                            className="bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                          >
                            <Icon icon={GitBranch} className="h-3 w-3 mr-1" />
                            {pipeline}
                          </Badge>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Right side - Actions */}
                <div className="flex items-center gap-3 flex-shrink-0 flex-wrap sm:flex-nowrap">
                  {/* Toggle Switch with Label */}
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`rule-toggle-${rule.id}`} className="text-sm text-muted-foreground cursor-pointer">
                      {rule.status === "active" ? "Enabled" : "Disabled"}
                    </Label>
                    <ToggleSwitch
                      id={`rule-toggle-${rule.id}`}
                      checked={rule.status === "active"}
                      onCheckedChange={() => handleToggleStatus(rule.id)}
                      size="md"
                    />
                  </div>
                  <div className="h-6 w-px bg-border" />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onPress={() => handleEdit(rule.id)}
                  >
                    <Icon icon={Pencil} className="h-4 w-4 text-muted-foreground" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    onPress={() => handleDelete(rule.id)}
                  >
                    <Icon icon={Trash2} className="h-4 w-4" />
                  </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        ))}
      </div>

      {/* Add Notification Rule Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="w-[95vw] sm:max-w-md max-h-[90vh] flex flex-col p-0">
          {/* Sticky Header */}
          <DialogHeader className="sticky top-0 border-b border-border bg-background px-6 py-4 z-10">
            <DialogTitle>Add Notification Rule</DialogTitle>
            <DialogDescription>
              Configure alert routing and recipients
            </DialogDescription>
          </DialogHeader>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="space-y-4">
              {/* Rule Name */}
              <div className="space-y-2">
                <Label htmlFor="rule-name">Rule Name</Label>
                <Input
                  id="rule-name"
                  placeholder="e.g., Critical Alerts to Admin"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              {/* Notification Channel */}
              <div className="space-y-2">
                <Label>Notification Channel</Label>
                <Select
                  value={formData.channel}
                  onValueChange={(value) => setFormData({ ...formData, channel: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select channel" />
                  </SelectTrigger>
                  <SelectContent>
                    {channelOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Alert Types */}
              <div className="space-y-2">
                <Label>Alert Types</Label>
                <div className="border border-border rounded-md p-4 space-y-3 bg-background">
                  {alertTypeOptions.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={`alert-type-${type}`}
                        checked={formData.alertTypes.includes(type)}
                        onCheckedChange={() => handleAlertTypeToggle(type)}
                      />
                      <Label
                        htmlFor={`alert-type-${type}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {type}
                      </Label>
                    </div>
                  ))}
            </div>
              </div>

              {/* Apply Rule To */}
              <div className="space-y-2">
                <Label>Apply Rule To</Label>
                <Select
                  value={formData.appliesTo}
                  onValueChange={(value) => setFormData({ ...formData, appliesTo: value, selectedPipelines: value === "all" ? [] : formData.selectedPipelines })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select scope" />
                  </SelectTrigger>
                  <SelectContent>
                    {appliesToOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {/* Pipeline Selection - Show when "Specific Pipelines" is selected */}
                {formData.appliesTo === "specific" && (
                  <div className="border border-border rounded-md p-4 space-y-3 bg-background mt-2">
                    {availablePipelines.map((pipeline) => (
                      <div key={pipeline} className="flex items-center space-x-2">
                        <Checkbox
                          id={`pipeline-${pipeline}`}
                          checked={formData.selectedPipelines.includes(pipeline)}
                          onCheckedChange={() => handlePipelineToggle(pipeline)}
                        />
                        <Label
                          htmlFor={`pipeline-${pipeline}`}
                          className="text-sm font-normal cursor-pointer flex items-center gap-2"
                        >
                          <Icon icon={GitBranch} className="h-3 w-3 text-muted-foreground" />
                          {pipeline}
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recipients */}
              <div className="space-y-2">
                <Label htmlFor="recipients">Recipients</Label>
                <Input
                  id="recipients"
                  placeholder="email@example.com"
                  value={formData.recipients}
                  onChange={(e) => setFormData({ ...formData, recipients: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Comma-separated email addresses
                </p>
              </div>

              {/* Informational Box */}
              <div className="rounded-md bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-3">
                <p className="text-sm text-blue-900 dark:text-blue-200">
                  Pipeline-Level Notifications: Alerts from cameras in each pipeline will use that pipeline&apos;s configured notification channels.
                </p>
              </div>
            </div>
      </div>

          {/* Sticky Footer */}
          <DialogFooter className="sticky bottom-0 border-t border-border bg-background px-6 py-4">
            <Button
              variant="outline"
              onPress={handleCloseModal}
            >
              Cancel
            </Button>
            <Button
              onPress={handleSubmitRule}
              disabled={
                !formData.name ||
                formData.alertTypes.length === 0 ||
                !formData.recipients ||
                (formData.appliesTo === "specific" && formData.selectedPipelines.length === 0)
              }
            >
              Add Rule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Notification Rule Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="w-[95vw] sm:max-w-md max-h-[90vh] flex flex-col p-0">
          {/* Sticky Header */}
          <DialogHeader className="sticky top-0 border-b border-border bg-background px-6 py-4 z-10">
            <DialogTitle>Edit Notification Rule</DialogTitle>
            <DialogDescription>
              Modify alert routing and recipients
            </DialogDescription>
          </DialogHeader>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="space-y-4">
              {/* Rule Name */}
              <div className="space-y-2">
                <Label htmlFor="edit-rule-name">Rule Name</Label>
                <Input
                  id="edit-rule-name"
                  placeholder="e.g., Critical Alerts to Admin"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
          </div>

              {/* Notification Channel */}
              <div className="space-y-2">
                <Label>Notification Channel</Label>
                <Select
                  value={formData.channel}
                  onValueChange={(value) => setFormData({ ...formData, channel: value as "email" | "sms" | "whatsapp" })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select channel" />
                  </SelectTrigger>
                  <SelectContent>
                    {channelOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                        </div>

              {/* Alert Types */}
              <div className="space-y-2">
                <Label>Alert Types</Label>
                <div className="border border-border rounded-md p-4 space-y-3 bg-background">
                  {alertTypeOptions.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={`edit-alert-type-${type}`}
                        checked={formData.alertTypes.includes(type)}
                        onCheckedChange={() => handleAlertTypeToggle(type)}
                      />
                      <Label
                        htmlFor={`edit-alert-type-${type}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {type}
                      </Label>
                        </div>
                  ))}
                </div>
            </div>

              {/* Apply Rule To */}
                  <div className="space-y-2">
                <Label>Apply Rule To</Label>
                <Select
                  value={formData.appliesTo}
                  onValueChange={(value) => setFormData({ ...formData, appliesTo: value as "all" | "specific", selectedPipelines: value === "all" ? [] : formData.selectedPipelines })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select scope" />
                  </SelectTrigger>
                  <SelectContent>
                    {appliesToOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {/* Pipeline Selection - Show when "Specific Pipelines" is selected */}
                {formData.appliesTo === "specific" && (
                  <div className="border border-border rounded-md p-4 space-y-3 bg-background mt-2">
                    {availablePipelines.map((pipeline) => (
                      <div key={pipeline} className="flex items-center space-x-2">
                        <Checkbox
                          id={`edit-pipeline-${pipeline}`}
                          checked={formData.selectedPipelines.includes(pipeline)}
                          onCheckedChange={() => handlePipelineToggle(pipeline)}
                        />
                        <Label
                          htmlFor={`edit-pipeline-${pipeline}`}
                          className="text-sm font-normal cursor-pointer flex items-center gap-2"
                        >
                          <Icon icon={GitBranch} className="h-3 w-3 text-muted-foreground" />
                          {pipeline}
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recipients */}
              <div className="space-y-2">
                <Label htmlFor="edit-recipients">Recipients</Label>
                <Input
                  id="edit-recipients"
                  placeholder="email@example.com"
                  value={formData.recipients}
                  onChange={(e) => setFormData({ ...formData, recipients: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Comma-separated email addresses
                </p>
              </div>

              {/* Informational Box */}
              <div className="rounded-md bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-3">
                <p className="text-sm text-blue-900 dark:text-blue-200">
                  Pipeline-Level Notifications: Alerts from cameras in each pipeline will use that pipeline&apos;s configured notification channels.
                </p>
              </div>
            </div>
          </div>

          {/* Sticky Footer */}
          <DialogFooter className="sticky bottom-0 border-t border-border bg-background px-6 py-4">
            <Button
              variant="outline"
              onPress={handleCloseEditModal}
            >
              Cancel
            </Button>
            <Button
              onPress={handleSubmitRule}
              disabled={
                !formData.name ||
                formData.alertTypes.length === 0 ||
                !formData.recipients ||
                (formData.appliesTo === "specific" && formData.selectedPipelines.length === 0)
              }
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
            <AlertDialogTitle>Delete Notification Rule</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{ruleToDelete?.name}&quot;? This action cannot be undone. 
              All alert routing configured for this rule will be permanently removed.
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
              Delete Rule
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
