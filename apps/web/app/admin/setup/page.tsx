"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Checkbox,
  Label,
  Badge,
  Separator,
  Icon,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "ui";
import {
  Building2,
  Camera as CameraIcon,
  GitBranch,
  Bell,
  Users,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Save,
  Trash2,
  Plus,
  UploadCloud,
  WebcamIcon,
  Sparkles,
  Mail,
  Phone,
  MessageSquare,
  Link,
  Cpu,
  ChevronUp,
  ChevronDown,
  Upload,
  Check,
  UserPlus,
} from "ui/utils/icons";
import {
  getSetupProgress,
  setCurrentStep,
  completeStep,
  updateOrganization,
  saveCamera,
  removeCamera,
  savePipeline,
  removePipeline,
  saveNotificationChannel,
  addUserInvite,
  removeUserInvite,
  markSetupComplete,
  type OrganizationDetails,
  type Camera,
  type Pipeline,
  type NotificationChannel,
  type UserInvite,
} from "app/utils/setup";

const TOTAL_STEPS = 6;

const STEP_CONFIG = [
  {
    number: 1,
    title: "Organization Details",
    icon: Building2,
    required: true,
    description: "Tell us about your organization. This information will be used across the platform.",
  },
  {
    number: 2,
    title: "Add Cameras",
    icon: CameraIcon,
    required: true,
    description: "Connect your IP cameras. You need at least one camera to proceed.",
  },
  {
    number: 3,
    title: "Create Pipelines",
    icon: GitBranch,
    required: true,
    description: "Set up monitoring pipelines by assigning cameras and AI models. At least one pipeline is required.",
  },
  {
    number: 4,
    title: "Notification & Alert Channels",
    icon: Bell,
    required: true,
    description: "Configure global notification channels and customize channels for specific pipelines.",
  },
  {
    number: 5,
    title: "User & Role Provisioning",
    icon: Users,
    required: true,
    description: "Invite team members and assign permissions",
  },
  {
    number: 6,
    title: "Review & Finalize",
    icon: CheckCircle2,
    required: true,
    description: "Review your configuration and launch your Aegis Vision system.",
  },
];

export default function SetupWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStepState] = useState(1);
  const [progress, setProgress] = useState(getSetupProgress());
  const currentStepMeta = STEP_CONFIG.find((step) => step.number === currentStep);

  useEffect(() => {
    const stored = getSetupProgress();
    setCurrentStepState(stored.currentStep);
    setProgress(stored);
  }, []);

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      const nextStep = currentStep + 1;
      setCurrentStepState(nextStep);
      setCurrentStep(nextStep);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      setCurrentStepState(prevStep);
      setCurrentStep(prevStep);
    }
  };

  const handleSaveAndExit = () => {
    setCurrentStep(currentStep);
    router.push("/admin/dashboard");
  };

  const refreshProgress = () => {
    setProgress(getSetupProgress());
  };

  return (
    <>
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">
                {currentStepMeta?.title ?? "Setup"}
              </h1>
              {currentStepMeta && !currentStepMeta.required && (
                <Badge variant="secondary">Optional</Badge>
              )}
            </div>
            {currentStepMeta?.description && (
              <p className="text-base text-muted-foreground">{currentStepMeta.description}</p>
            )}
          </div>
{currentStep !== 6 && (
            <Button variant="ghost" size="sm" onClick={handleSaveAndExit}>
              <Icon icon={Save} className="mr-2 h-4 w-4" />
              Save & Exit
            </Button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Step {currentStep} of {TOTAL_STEPS}</span>
            <span>{Math.round((currentStep / TOTAL_STEPS) * 100)}% Complete</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
            />
          </div>
        </div>

        {/* Step list intentionally removed */}
      </div>

      {/* Step Content */}
      <Card>
        {currentStep === 1 && (
          <Step1OrganizationDetails
            onNext={handleNext}
            onComplete={() => completeStep(1)}
            initialData={progress.organization}
            refreshProgress={refreshProgress}
          />
        )}
        {currentStep === 2 && (
          <Step2AddCameras
            onNext={handleNext}
            onBack={handleBack}
            onComplete={() => completeStep(2)}
            cameras={progress.cameras}
            refreshProgress={refreshProgress}
          />
        )}
        {currentStep === 3 && (
          <Step3CreatePipelines
            onNext={handleNext}
            onBack={handleBack}
            onComplete={() => completeStep(3)}
            pipelines={progress.pipelines}
            cameras={progress.cameras}
            refreshProgress={refreshProgress}
          />
        )}
        {currentStep === 4 && (
          <Step4NotificationChannels
            onNext={() => {
              completeStep(4);
              handleNext();
            }}
            onBack={handleBack}
            notifications={progress.notifications}
            pipelines={progress.pipelines}
            refreshProgress={refreshProgress}
          />
        )}
        {currentStep === 5 && (
          <Step5InviteUsers
            onNext={() => {
              completeStep(5);
              handleNext();
            }}
            onBack={handleBack}
            invites={progress.invites}
            refreshProgress={refreshProgress}
          />
        )}
        {currentStep === 6 && (
          <Step6ReviewFinalize
            onBack={handleBack}
            progress={progress}
            onFinalize={() => {
              markSetupComplete();
              router.push("/admin/dashboard");
            }}
          />
        )}
      </Card>
    </>
  );
}

// ============================================================================
// STEP 1: Organization Details
// ============================================================================

interface Step1Props {
  onNext: () => void;
  onComplete: () => void;
  initialData?: OrganizationDetails;
  refreshProgress: () => void;
}

function Step1OrganizationDetails({ onNext, onComplete, initialData, refreshProgress }: Step1Props) {
  const [logoPreview, setLogoPreview] = useState<string | undefined>(initialData?.logo);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const form = useForm<OrganizationDetails>({
    defaultValues: initialData || {
      name: "",
      domain: "",
      industry: "",
      companySize: "",
      logo: "",
    },
  });

  const processLogoFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setLogoPreview(base64String);
      form.setValue("logo", base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processLogoFile(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragActive(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      processLogoFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragActive(false);
  };

  const handleRemoveLogo = () => {
    setLogoPreview(undefined);
    form.setValue("logo", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = (values: OrganizationDetails) => {
    updateOrganization(values);
    onComplete();
    refreshProgress();
    onNext();
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              rules={{ required: "Organization name is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Acme Corporation" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="domain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Domain</FormLabel>
                  <FormControl>
                    <Input placeholder="acme.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="industry"
                rules={{ required: "Industry is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Industry *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your industry" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="companySize"
                rules={{ required: "Company size is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Size *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select company size" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1-10">1-10 employees</SelectItem>
                        <SelectItem value="11-50">11-50 employees</SelectItem>
                        <SelectItem value="51-200">51-200 employees</SelectItem>
                        <SelectItem value="201-500">201-500 employees</SelectItem>
                        <SelectItem value="501+">501+ employees</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Logo Upload */}
            <FormField
              control={form.control}
              name="logo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization Logo</FormLabel>
                  <FormControl>
                    <div className="space-y-3">
                      {logoPreview ? (
                        <div className="flex items-center gap-4">
                          <div className="h-24 w-24 rounded-md border border-border bg-muted flex items-center justify-center overflow-hidden">
                            <img
                              src={logoPreview}
                              alt="Logo preview"
                              className="h-full w-full object-contain"
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => fileInputRef.current?.click()}
                            >
                              <Icon icon={UploadCloud} className="mr-2 h-4 w-4" />
                              Replace
                            </Button>
                            <Button type="button" variant="ghost" size="sm" onClick={handleRemoveLogo}>
                              <Icon icon={Trash2} className="mr-2 h-4 w-4" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          className={`flex flex-col items-center justify-center rounded-md border-2 border-dashed p-6 text-center transition-colors cursor-pointer ${
                            isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/50"
                          }`}
                        >
                          <Icon icon={UploadCloud} className="h-10 w-10 text-muted-foreground mb-3" />
                          <p className="font-medium">Drag & drop your logo</p>
                          <p className="text-sm text-muted-foreground">or click to browse files</p>
                          <span className="mt-2 text-xs text-muted-foreground">PNG, JPG up to 2MB</span>
                        </div>
                      )}
                      <input
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="sticky bottom-0 z-10 flex flex-col gap-3 border-t bg-background/95 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/75 sm:flex-row sm:justify-end">
            <Button 
              type="submit" 
              className="w-full sm:w-auto"
              onClick={(e) => {
                e?.preventDefault?.();
                form.handleSubmit(onSubmit)();
              }}
            >
              Continue
              <Icon icon={ArrowRight} className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </form>
      </Form>
    </>
  );
}

// ============================================================================
// STEP 2: Add Cameras
// ============================================================================

interface Step2Props {
  onNext: () => void;
  onBack: () => void;
  onComplete: () => void;
  cameras: Camera[];
  refreshProgress: () => void;
}

const CAMERA_FORM_DEFAULTS = {
  name: "",
  rtspUrl: "",
  zone: "Zone A",
  port: "554",
  frameRate: "15 FPS",
  resolution: "1920x1080 (Full HD)",
  location: "",
  description: "",
};

function Step2AddCameras({ onNext, onBack, onComplete, cameras, refreshProgress }: Step2Props) {
  const [editingCamera, setEditingCamera] = useState<Camera | null>(null);
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  const form = useForm<Omit<Camera, "id" | "status">>({
    defaultValues: CAMERA_FORM_DEFAULTS,
  });

  useEffect(() => {
    if (editingCamera) {
      form.reset({ ...CAMERA_FORM_DEFAULTS, ...editingCamera });
    } else {
      form.reset(CAMERA_FORM_DEFAULTS);
    }
  }, [editingCamera, form]);

  const handleSaveCamera = (values: Omit<Camera, "id" | "status">) => {
    const newCamera: Camera = {
      ...values,
      id: editingCamera?.id || `cam-${Date.now()}`,
      status: editingCamera?.status || "offline",
    };

    saveCamera(newCamera);
    refreshProgress();
    setEditingCamera(null);
    form.reset(CAMERA_FORM_DEFAULTS);
  };

  const handleEditCamera = (camera: Camera) => {
    setEditingCamera(camera);
  };

  const handleDeleteCamera = (cameraId: string) => {
    removeCamera(cameraId);
    refreshProgress();
    if (editingCamera?.id === cameraId) {
      setEditingCamera(null);
      form.reset(CAMERA_FORM_DEFAULTS);
    }
  };

  const handleAddAnother = () => {
    setEditingCamera(null);
    form.reset(CAMERA_FORM_DEFAULTS);
  };

  const handleContinue = () => {
    if (cameras.length === 0) {
      alert("Please add at least one camera to continue.");
      return;
    }
    onComplete();
    onNext();
  };

  return (
    <>
      <CardContent className="space-y-6">
        <div className="rounded-2xl border-2 border-dashed border-muted-foreground/40 bg-muted/20 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-3 text-primary">
                <Icon icon={WebcamIcon} className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-lg">Bulk Camera Upload</p>
                  <Badge variant="secondary" className="text-xs">Coming Soon</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Import multiple cameras at once via CSV for faster deployment.
                </p>
              </div>
            </div>
            <Button variant="outline" className="self-start md:self-auto">
              Request Early Access
            </Button>
          </div>
        </div>

        {cameras.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">
              Configured Cameras ({cameras.length})
            </h3>
            <div className="space-y-3">
              {cameras.map((camera, index) =>
                editingCamera && editingCamera.id === camera.id ? null : (
                  <div
                    key={camera.id}
                    className="rounded-2xl border bg-card p-4 shadow-sm"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold flex items-center gap-2">
                          <Icon icon={CameraIcon} className="h-4 w-4" />
                          Camera {index + 1}: {camera.name}
                        </p>
                        <p className="text-sm text-muted-foreground">{camera.rtspUrl}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEditCamera(camera)}>
                          Edit
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Icon icon={Trash2} className="h-4 w-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete camera?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will remove <span className="font-medium">{camera.name || "this camera"}</span>{" "}
                                from the setup. Any pipelines using this camera will need to be updated.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel asChild>
                                <Button variant="outline">
                                  Cancel
                                </Button>
                              </AlertDialogCancel>
                              <AlertDialogAction asChild>
                                <Button
                                  variant="destructive"
                                  onClick={() => handleDeleteCamera(camera.id)}
                                >
                                  Delete
                                </Button>
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span>Zone: {camera.zone ?? "Not set"}</span>
                      <span>Port: {camera.port ?? "—"}</span>
                      <span>Frame Rate: {camera.frameRate ?? "—"}</span>
                      <span>Resolution: {camera.resolution ?? "—"}</span>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSaveCamera)} className="space-y-6 rounded-2xl border bg-card p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-semibold">
                  {editingCamera ? `Editing ${editingCamera.name}` : `Camera ${cameras.length + 1}`}
                </p>
                <p className="text-sm text-muted-foreground">
                  Define the stream details and deployment zone.
                </p>
              </div>
              {editingCamera && (
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleAddAnother}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    Update Camera
                  </Button>
                </div>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                rules={{ required: "Camera name is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Camera Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Production Line 1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="zone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zone</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a zone" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Zone A">Zone A</SelectItem>
                        <SelectItem value="Zone B">Zone B</SelectItem>
                        <SelectItem value="Zone C">Zone C</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="rtspUrl"
                rules={{ required: "IP address / RTSP URL is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IP Address / RTSP URL *</FormLabel>
                    <FormControl>
                      <Input placeholder="192.168.1.100 or rtsp://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="port"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Port</FormLabel>
                    <FormControl>
                      <Input placeholder="554" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="frameRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frame Rate (FPS)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select FPS" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="15 FPS">15 FPS</SelectItem>
                        <SelectItem value="30 FPS">30 FPS</SelectItem>
                        <SelectItem value="60 FPS">60 FPS</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="resolution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resolution</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select resolution" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1280x720 (HD)">1280x720 (HD)</SelectItem>
                        <SelectItem value="1920x1080 (Full HD)">1920x1080 (Full HD)</SelectItem>
                        <SelectItem value="3840x2160 (4K)">3840x2160 (4K)</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zone Details / Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Zone A - Production Floor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Optional notes" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {!editingCamera && (
              <div className="flex flex-wrap gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleAddAnother}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Save Camera
                </Button>
              </div>
            )}
          </form>
        </Form>

        <Button
          type="button"
          variant="ghost"
          className="w-full justify-center border border-dashed border-border py-6 text-base"
          onClick={handleAddAnother}
        >
          <Icon icon={Plus} className="mr-2 h-4 w-4" />
          Add Another Camera
        </Button>
      </CardContent>
      <CardFooter className="sticky bottom-0 z-10 flex flex-col gap-3 border-t bg-background/95 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/75 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="outline" onClick={onBack} className="w-full sm:w-auto">
          <Icon icon={ArrowLeft} className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onClick={handleContinue} disabled={cameras.length === 0} className="w-full sm:w-auto">
          Continue
          <Icon icon={ArrowRight} className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </>
  );
}

// ============================================================================
// STEP 3: Create Pipelines
// ============================================================================

interface Step3Props {
  onNext: () => void;
  onBack: () => void;
  onComplete: () => void;
  pipelines: Pipeline[];
  cameras: Camera[];
  refreshProgress: () => void;
}

function Step3CreatePipelines({ onNext, onBack, onComplete, pipelines, cameras, refreshProgress }: Step3Props) {
  const [selectedCameras, setSelectedCameras] = useState<string[]>([]);
  const [editingPipeline, setEditingPipeline] = useState<Pipeline | null>(null);

  const form = useForm<Omit<Pipeline, "id" | "cameraIds" | "status">>({
    defaultValues: {
      name: "",
      modelId: "",
      alertRules: {
        confidenceThreshold: 0.7,
        alertTypes: [],
      },
    },
  });

  const selectedModelId = form.watch("modelId");

  const MODEL_DETAILS: Record<
    string,
    { description: string; type: string; accuracy: string; tech: string }
  > = {
    "yolov8-intrusion": {
      description: "Alerts on unauthorized access to restricted areas.",
      type: "Security",
      accuracy: "98.2%",
      tech: "YOLOv8",
    },
    "yolov8-ppe": {
      description: "Detects missing or incorrect safety equipment.",
      type: "Safety",
      accuracy: "98.5%",
      tech: "YOLOv8",
    },
    "yolov8-fire": {
      description: "Detects early signs of fire and visible smoke.",
      type: "Safety",
      accuracy: "97.1%",
      tech: "YOLOv8",
    },
    "openvino-counting": {
      description: "Counts products, people, or vehicles across zones.",
      type: "Analytics",
      accuracy: "96.4%",
      tech: "OpenVINO",
    },
    custom: {
      description: "Use your own trained model via the Bring Your Own Model workflow.",
      type: "Custom",
      accuracy: "Depends on your model",
      tech: "BYOM",
    },
  };

  const handleAddPipeline = (values: Omit<Pipeline, "id" | "cameraIds" | "status">) => {
    if (selectedCameras.length === 0) {
      alert("Please select at least one camera.");
      return;
    }

    const newPipeline: Pipeline = {
      ...values,
      id: editingPipeline?.id ?? `pipeline-${Date.now()}`,
      cameraIds: selectedCameras,
      status: editingPipeline?.status ?? "inactive",
    };

    savePipeline(newPipeline);
    refreshProgress();
    setEditingPipeline(null);
    setSelectedCameras([]);
    form.reset({
      name: "",
      modelId: "",
      alertRules: {
        confidenceThreshold: 0.7,
        alertTypes: [],
      },
    });
  };

  const handleDeletePipeline = (pipelineId: string) => {
    removePipeline(pipelineId);
    refreshProgress();
  };

  const handleEditPipeline = (pipeline: Pipeline) => {
    setEditingPipeline(pipeline);
    setSelectedCameras(pipeline.cameraIds);
    form.reset({
      name: pipeline.name,
      modelId: pipeline.modelId,
      alertRules: pipeline.alertRules,
    });
  };

  const handleContinue = () => {
    if (pipelines.length === 0) {
      alert("Please create at least one pipeline to continue.");
      return;
    }
    onComplete();
    onNext();
  };

  const handleCancelEdit = () => {
    setEditingPipeline(null);
    setSelectedCameras([]);
    form.reset({
      name: "",
      modelId: "",
      alertRules: {
        confidenceThreshold: 0.7,
        alertTypes: [],
      },
    });
  };

  return (
    <>
      <CardContent className="space-y-6">
        {/* Bring Your Own Model - Coming Soon */}
        <div className="rounded-2xl border-2 border-dashed border-muted-foreground/30 bg-muted/20 p-4">
          <div className="flex items-center gap-4">
            <div className="p-2.5 rounded-lg border bg-background shrink-0">
              <Icon icon={Sparkles} className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="font-semibold text-foreground">Bring Your Own Model</h3>
                <Badge variant="outline" className="text-xs">Coming Soon</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Import your custom YOLO, TensorFlow, PyTorch, ONNX, or OpenVINO models.
              </p>
            </div>
            <Button size="sm" variant="default" className="shrink-0">
              Import Model
            </Button>
          </div>
        </div>

        {/* Pipeline List */}
        {pipelines.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">
              Configured Pipelines ({pipelines.length})
            </h3>
            <div className="space-y-3">
              {pipelines.map((pipeline, index) => (
                editingPipeline && editingPipeline.id === pipeline.id ? null : (
                <div
                  key={pipeline.id}
                  className="rounded-2xl border bg-card p-4 shadow-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold">
                        Pipeline {index + 1}: {pipeline.name || "Untitled"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Model: {pipeline.modelId || "Not set"} · Cameras: {pipeline.cameraIds.length}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditPipeline(pipeline)}
                      >
                        Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                          >
                            <Icon icon={Trash2} className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete pipeline?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will remove <span className="font-medium">{pipeline.name || "this pipeline"}</span>{" "}
                              and its camera assignments from the setup. You can recreate it later if needed.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel asChild>
                              <Button variant="outline">
                                Cancel
                              </Button>
                            </AlertDialogCancel>
                            <AlertDialogAction asChild>
                              <Button
                                variant="destructive"
                                onClick={() => handleDeletePipeline(pipeline.id)}
                              >
                                Delete
                              </Button>
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
                )
              ))}
            </div>
          </div>
        )}

        {/* Pipeline Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleAddPipeline)}
            className="space-y-6 rounded-2xl border bg-card p-6 shadow-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-semibold">
                  {editingPipeline
                    ? `Editing ${editingPipeline.name || "Pipeline"}`
                    : `Pipeline ${pipelines.length + 1}`}
                </p>
                <p className="text-sm text-muted-foreground">
                  Configure an AI model and assign cameras for this pipeline.
                </p>
              </div>
              {editingPipeline && (
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    Update Pipeline
                  </Button>
                </div>
              )}
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pipeline Name (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Auto-generated if left blank" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="modelId"
              rules={{ required: "AI model is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select AI Model *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a model" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="yolov8-intrusion">YOLOv8 – Intrusion Detection</SelectItem>
                      <SelectItem value="yolov8-ppe">YOLOv8 – PPE Compliance</SelectItem>
                      <SelectItem value="yolov8-fire">YOLOv8 – Fire Detection</SelectItem>
                      <SelectItem value="openvino-counting">OpenVINO – Object Counting</SelectItem>
                      <SelectItem value="custom">Custom Model (BYOM)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedModelId && MODEL_DETAILS[selectedModelId] && (
              <div className="rounded-2xl border border-muted bg-muted/70 p-4">
                <dl className="grid gap-4 text-sm text-muted-foreground md:grid-cols-4">
                  <div>
                    <dt className="text-[11px] font-semibold tracking-wide text-muted-foreground/80">
                      DESCRIPTION
                    </dt>
                    <dd className="mt-1 text-foreground">
                      {MODEL_DETAILS[selectedModelId].description}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-semibold tracking-wide text-muted-foreground/80">
                      TYPE
                    </dt>
                    <dd className="mt-1 text-foreground">
                      {MODEL_DETAILS[selectedModelId].type}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-semibold tracking-wide text-muted-foreground/80">
                      ACCURACY
                    </dt>
                    <dd className="mt-1 text-foreground">
                      {MODEL_DETAILS[selectedModelId].accuracy}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-semibold tracking-wide text-muted-foreground/80">
                      MODEL TECH
                    </dt>
                    <dd className="mt-1 text-foreground">
                      {MODEL_DETAILS[selectedModelId].tech}
                    </dd>
                  </div>
                </dl>
              </div>
            )}

            <div className="space-y-2">
              <Label>Assign Cameras *</Label>
              <div className="space-y-1 rounded-md border border-dashed border-border bg-muted/40 p-3">
                {cameras.map((camera) => (
                  <div
                    key={camera.id}
                    className="flex items-start gap-3 rounded-lg bg-background/60 px-3 py-2"
                  >
                    <Checkbox
                      id={camera.id}
                      checked={selectedCameras.includes(camera.id)}
                      onCheckedChange={(checked) => {
                        setSelectedCameras((prev) =>
                          checked
                            ? [...prev, camera.id]
                            : prev.filter((id) => id !== camera.id)
                        );
                      }}
                      className="mt-1"
                    />
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Icon icon={WebcamIcon} className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-foreground">
                          {camera.name}
                        </span>
                      </div>
                      {(camera.location || camera.rtspUrl) && (
                        <p className="text-xs text-muted-foreground">
                          {camera.location && `Zone: ${camera.location}`}
                          {camera.location && camera.rtspUrl && " · "}
                          {camera.rtspUrl && "Streaming configured"}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {!editingPipeline && (
              <div className="flex flex-wrap gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Save Pipeline
                </Button>
              </div>
            )}
          </form>
        </Form>

        <Button
          type="button"
          variant="ghost"
          className="w-full justify-center border border-dashed border-border py-6 text-base"
          onClick={() => {
            handleCancelEdit();
          }}
        >
          <Icon icon={Plus} className="mr-2 h-4 w-4" />
          Add Another Pipeline
        </Button>
      </CardContent>
      <CardFooter className="sticky bottom-0 z-10 flex flex-col gap-3 border-t bg-background/95 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/75 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="outline" onClick={onBack} className="w-full sm:w-auto">
          <Icon icon={ArrowLeft} className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onClick={handleContinue} disabled={pipelines.length === 0} className="w-full sm:w-auto">
          Continue
          <Icon icon={ArrowRight} className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </>
  );
}

// ============================================================================
// STEP 4: Notification & Alert Channels
// ============================================================================

interface Step4Props {
  onNext: () => void;
  onBack: () => void;
  notifications: NotificationChannel[];
  pipelines: Pipeline[];
  refreshProgress: () => void;
}

// Channel configuration types
interface EmailConfig {
  smtpServer: string;
  fromEmail: string;
  toEmails: string;
}

interface SmsConfig {
  provider: string;
  apiKey: string;
  phoneNumbers: string;
}

interface WhatsAppConfig {
  apiKey: string;
  phoneNumbers: string;
}

interface WebhookConfig {
  url: string;
  authToken: string;
}

interface PlcConfig {
  ipAddress: string;
  port: string;
  commandSequence: string;
}

interface ChannelState {
  email: { enabled: boolean; config: EmailConfig };
  sms: { enabled: boolean; config: SmsConfig };
  whatsapp: { enabled: boolean; config: WhatsAppConfig };
  webhook: { enabled: boolean; config: WebhookConfig };
  plc: { enabled: boolean; config: PlcConfig };
}

interface PipelineChannelState {
  [pipelineId: string]: {
    expanded: boolean;
    channels: {
      email: boolean;
      sms: boolean;
      whatsapp: boolean;
      webhook: boolean;
      plc: boolean;
    };
  };
}

function Step4NotificationChannels({ onNext, onBack, notifications, pipelines, refreshProgress }: Step4Props) {
  // Global channel states
  const [channels, setChannels] = useState<ChannelState>({
    email: {
      enabled: false,
      config: { smtpServer: "", fromEmail: "", toEmails: "" },
    },
    sms: {
      enabled: false,
      config: { provider: "", apiKey: "", phoneNumbers: "" },
    },
    whatsapp: {
      enabled: false,
      config: { apiKey: "", phoneNumbers: "" },
    },
    webhook: {
      enabled: false,
      config: { url: "", authToken: "" },
    },
    plc: {
      enabled: false,
      config: { ipAddress: "", port: "", commandSequence: "" },
    },
  });

  // Pipeline-specific channel states
  const [pipelineChannels, setPipelineChannels] = useState<PipelineChannelState>(() => {
    const initial: PipelineChannelState = {};
    pipelines.forEach((pipeline) => {
      initial[pipeline.id] = {
        expanded: false,
        channels: {
          email: false,
          sms: false,
          whatsapp: false,
          webhook: false,
          plc: false,
        },
      };
    });
    return initial;
  });

  const toggleChannel = (channelType: keyof ChannelState) => {
    setChannels((prev) => ({
      ...prev,
      [channelType]: {
        ...prev[channelType],
        enabled: !prev[channelType].enabled,
      },
    }));
  };

  const updateChannelConfig = <T extends keyof ChannelState>(
    channelType: T,
    field: keyof ChannelState[T]["config"],
    value: string
  ) => {
    setChannels((prev) => ({
      ...prev,
      [channelType]: {
        ...prev[channelType],
        config: {
          ...prev[channelType].config,
          [field]: value,
        },
      },
    }));
  };

  const togglePipelineExpanded = (pipelineId: string) => {
    setPipelineChannels((prev) => ({
      ...prev,
      [pipelineId]: {
        ...prev[pipelineId],
        expanded: !prev[pipelineId]?.expanded,
      },
    }));
  };

  const togglePipelineChannel = (pipelineId: string, channelType: keyof PipelineChannelState[string]["channels"]) => {
    setPipelineChannels((prev) => ({
      ...prev,
      [pipelineId]: {
        ...prev[pipelineId],
        channels: {
          ...prev[pipelineId]?.channels,
          [channelType]: !prev[pipelineId]?.channels?.[channelType],
        },
      },
    }));
  };

  const getEnabledChannelCount = (pipelineId: string) => {
    const pipelineState = pipelineChannels[pipelineId];
    if (!pipelineState) return 0;
    return Object.values(pipelineState.channels).filter(Boolean).length;
  };

  const handleSaveAndContinue = () => {
    // Save all enabled channels
    Object.entries(channels).forEach(([type, data]) => {
      if (data.enabled) {
        const channel: NotificationChannel = {
          id: `${type}-${Date.now()}`,
          type: type as NotificationChannel["type"],
          config: data.config,
          enabled: true,
        };
        saveNotificationChannel(channel);
      }
    });
    refreshProgress();
    onNext();
  };

  // Channel card component
  const ChannelCard = ({
    type,
    icon,
    title,
    description,
    enabled,
    onToggle,
    children,
  }: {
    type: string;
    icon: any;
    title: string;
    description: string;
    enabled: boolean;
    onToggle: () => void;
    children?: React.ReactNode;
  }) => (
    <div className="rounded-2xl border bg-card shadow-sm">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            id={`channel-${type}`}
            checked={enabled}
            onCheckedChange={onToggle}
            className="mt-1"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Icon icon={icon} className="h-5 w-5 text-muted-foreground" />
              <label
                htmlFor={`channel-${type}`}
                className="font-semibold text-foreground cursor-pointer"
              >
                {title}
              </label>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
          </div>
        </div>
      </div>
      {enabled && children && (
        <>
          <Separator />
          <div className="p-4 space-y-4">{children}</div>
        </>
      )}
    </div>
  );

  // Pipeline channel row component
  const PipelineChannelRow = ({
    icon,
    title,
    description,
    checked,
    onToggle,
  }: {
    icon: any;
    title: string;
    description: string;
    checked: boolean;
    onToggle: () => void;
  }) => (
    <div className="flex items-start gap-3 py-2 border-l-2 border-muted pl-4">
      <Checkbox checked={checked} onCheckedChange={onToggle} className="mt-1" />
      <div>
        <div className="flex items-center gap-2">
          <Icon icon={icon} className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium text-sm">{title}</span>
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );

  return (
    <>
      <CardContent className="space-y-6">
        {/* Tabs */}
        <Tabs defaultValue="global" variant="underline">
          <TabsList>
            <TabsTrigger value="global">Global Notification Channels</TabsTrigger>
            <TabsTrigger value="pipeline">Pipeline-Specific Channels</TabsTrigger>
          </TabsList>

          {/* Global Notification Channels Tab */}
          <TabsContent value="global">
            <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Global Notification Channels</h3>
              <p className="text-sm text-muted-foreground">
                These channels apply to all pipelines by default
              </p>
            </div>

            {/* Email Channel */}
            <ChannelCard
              type="email"
              icon={Mail}
              title="Email"
              description="Send alerts via email"
              enabled={channels.email.enabled}
              onToggle={() => toggleChannel("email")}
            >
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">SMTP Server</Label>
                  <Input
                    placeholder="smtp.gmail.com:587"
                    value={channels.email.config.smtpServer}
                    onChange={(e) => updateChannelConfig("email", "smtpServer", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">From Email</Label>
                  <Input
                    placeholder="alerts@aegisvision.com"
                    value={channels.email.config.fromEmail}
                    onChange={(e) => updateChannelConfig("email", "fromEmail", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">To Email(s)</Label>
                  <Input
                    placeholder="admin@company.com, ops@company.com"
                    value={channels.email.config.toEmails}
                    onChange={(e) => updateChannelConfig("email", "toEmails", e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </ChannelCard>

            {/* SMS Channel */}
            <ChannelCard
              type="sms"
              icon={Phone}
              title="SMS"
              description="Send text message alerts"
              enabled={channels.sms.enabled}
              onToggle={() => toggleChannel("sms")}
            >
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">SMS Provider</Label>
                  <Input
                    placeholder="Twilio, AWS SNS, etc."
                    value={channels.sms.config.provider}
                    onChange={(e) => updateChannelConfig("sms", "provider", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">API Key</Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={channels.sms.config.apiKey}
                    onChange={(e) => updateChannelConfig("sms", "apiKey", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Phone Number(s)</Label>
                  <Input
                    placeholder="+1 555 123 4567, +1 555 987 6543"
                    value={channels.sms.config.phoneNumbers}
                    onChange={(e) => updateChannelConfig("sms", "phoneNumbers", e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </ChannelCard>

            {/* WhatsApp Channel */}
            <ChannelCard
              type="whatsapp"
              icon={MessageSquare}
              title="WhatsApp"
              description="Send WhatsApp messages"
              enabled={channels.whatsapp.enabled}
              onToggle={() => toggleChannel("whatsapp")}
            >
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">WhatsApp Business API Key</Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={channels.whatsapp.config.apiKey}
                    onChange={(e) => updateChannelConfig("whatsapp", "apiKey", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Phone Number(s)</Label>
                  <Input
                    placeholder="+1 555 123 4567"
                    value={channels.whatsapp.config.phoneNumbers}
                    onChange={(e) => updateChannelConfig("whatsapp", "phoneNumbers", e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </ChannelCard>

            {/* Webhook Channel */}
            <ChannelCard
              type="webhook"
              icon={Link}
              title="Webhook"
              description="POST alerts to custom endpoint"
              enabled={channels.webhook.enabled}
              onToggle={() => toggleChannel("webhook")}
            >
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Webhook URL</Label>
                  <Input
                    placeholder="https://api.example.com/alerts"
                    value={channels.webhook.config.url}
                    onChange={(e) => updateChannelConfig("webhook", "url", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Auth Token (Optional)</Label>
                  <Input
                    placeholder="Bearer token"
                    value={channels.webhook.config.authToken}
                    onChange={(e) => updateChannelConfig("webhook", "authToken", e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </ChannelCard>

            {/* PLC Trigger Channel */}
            <ChannelCard
              type="plc"
              icon={Cpu}
              title="PLC Trigger"
              description="Trigger PLC actions"
              enabled={channels.plc.enabled}
              onToggle={() => toggleChannel("plc")}
            >
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">PLC IP Address</Label>
                  <Input
                    placeholder="192.168.1.50"
                    value={channels.plc.config.ipAddress}
                    onChange={(e) => updateChannelConfig("plc", "ipAddress", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Port</Label>
                  <Input
                    placeholder="502"
                    value={channels.plc.config.port}
                    onChange={(e) => updateChannelConfig("plc", "port", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Command Sequence</Label>
                  <Input
                    placeholder="STOP_LINE_1"
                    value={channels.plc.config.commandSequence}
                    onChange={(e) => updateChannelConfig("plc", "commandSequence", e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </ChannelCard>
            </div>
          </TabsContent>

          {/* Pipeline-Specific Channels Tab */}
          <TabsContent value="pipeline">
            <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Icon icon={GitBranch} className="h-5 w-5 text-primary" />
              <div>
                <h3 className="text-lg font-semibold">Pipeline-Specific Notification Channels</h3>
                <p className="text-sm text-muted-foreground">
                  Customize notification channels for each pipeline. By default, pipelines inherit global channels.
                </p>
              </div>
            </div>

            {pipelines.length === 0 ? (
              <div className="rounded-2xl border border-dashed bg-muted/30 p-8 text-center">
                <p className="text-muted-foreground">
                  No pipelines configured yet. Add pipelines in the previous step to customize their notification channels.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {pipelines.map((pipeline) => {
                  const pipelineState = pipelineChannels[pipeline.id];
                  const enabledCount = getEnabledChannelCount(pipeline.id);
                  const cameraCount = pipeline.cameraIds?.length || 0;

                  return (
                    <div key={pipeline.id} className="rounded-2xl border bg-card shadow-sm">
                      <button
                        type="button"
                        onClick={() => togglePipelineExpanded(pipeline.id)}
                        className="w-full p-4 flex items-center justify-between text-left"
                      >
                        <div className="flex items-center gap-3">
                          <Icon icon={GitBranch} className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-semibold">{pipeline.name || "Untitled Pipeline"}</p>
                            <p className="text-sm text-muted-foreground">
                              {cameraCount} camera{cameraCount !== 1 ? "s" : ""} • {enabledCount} channel{enabledCount !== 1 ? "s" : ""} enabled
                            </p>
                          </div>
                        </div>
                        <Icon
                          icon={pipelineState?.expanded ? ChevronUp : ChevronDown}
                          className="h-5 w-5 text-muted-foreground"
                        />
                      </button>

                      {pipelineState?.expanded && (
                        <>
                          <Separator />
                          <div className="p-4 space-y-2">
                            <PipelineChannelRow
                              icon={Mail}
                              title="Email"
                              description="Send alerts via email"
                              checked={pipelineState.channels.email}
                              onToggle={() => togglePipelineChannel(pipeline.id, "email")}
                            />
                            <PipelineChannelRow
                              icon={Phone}
                              title="SMS"
                              description="Send text message alerts"
                              checked={pipelineState.channels.sms}
                              onToggle={() => togglePipelineChannel(pipeline.id, "sms")}
                            />
                            <PipelineChannelRow
                              icon={MessageSquare}
                              title="WhatsApp"
                              description="Send WhatsApp messages"
                              checked={pipelineState.channels.whatsapp}
                              onToggle={() => togglePipelineChannel(pipeline.id, "whatsapp")}
                            />
                            <PipelineChannelRow
                              icon={Link}
                              title="Webhook"
                              description="POST alerts to custom endpoint"
                              checked={pipelineState.channels.webhook}
                              onToggle={() => togglePipelineChannel(pipeline.id, "webhook")}
                            />
                            <PipelineChannelRow
                              icon={Cpu}
                              title="PLC Trigger"
                              description="Trigger PLC actions"
                              checked={pipelineState.channels.plc}
                              onToggle={() => togglePipelineChannel(pipeline.id, "plc")}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="sticky bottom-0 z-10 flex flex-col gap-3 border-t bg-background/95 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/75 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="outline" onPress={onBack} className="w-full sm:w-auto">
          <Icon icon={ArrowLeft} className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onPress={handleSaveAndContinue} className="w-full sm:w-auto">
          Next
          <Icon icon={ArrowRight} className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </>
  );
}

// ============================================================================
// STEP 5: User & Role Provisioning
// ============================================================================

interface Step5Props {
  onNext: () => void;
  onBack: () => void;
  invites: UserInvite[];
  refreshProgress: () => void;
}

interface UserFormData {
  id: string;
  fullName: string;
  email: string;
  role: "admin" | "monitor" | "stakeholder";
}

function Step5InviteUsers({ onNext, onBack, invites, refreshProgress }: Step5Props) {
  const [users, setUsers] = useState<UserFormData[]>([
    { id: `user-${Date.now()}`, fullName: "", email: "", role: "monitor" },
  ]);

  const addUser = () => {
    setUsers((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, fullName: "", email: "", role: "monitor" },
    ]);
  };

  const removeUser = (userId: string) => {
    if (users.length === 1) return; // Keep at least one user form
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  const updateUser = (userId: string, field: keyof UserFormData, value: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, [field]: value } : u))
    );
  };

  const handleSaveAndContinue = () => {
    // Save all users with valid email addresses
    users.forEach((user) => {
      if (user.email) {
        const newInvite: UserInvite = {
          id: user.id,
          email: user.email,
          role: user.role === "admin" ? "monitor" : user.role, // Map admin to monitor for now
          status: "pending",
        };
        addUserInvite(newInvite);
      }
    });
    refreshProgress();
    onNext();
  };

  return (
    <>
      <CardContent className="space-y-6">
        {/* Bulk User Upload - Coming Soon */}
        <div className="rounded-2xl border-2 border-dashed border-muted-foreground/30 bg-muted/20 p-4">
          <div className="flex items-center gap-4">
            <div className="p-2.5 rounded-lg border bg-background shrink-0">
              <Icon icon={Upload} className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="font-semibold text-foreground">Bulk User Upload</h3>
                <Badge variant="outline" className="text-xs">Coming Soon</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Import users at scale via CSV. Bulk assign roles and permissions in a single operation.
              </p>
            </div>
            <Button size="sm" variant="default" className="shrink-0">
              Request Early Access
            </Button>
          </div>
        </div>

        {/* Individual User Forms */}
        <div className="space-y-4">
          {users.map((user, index) => (
            <div
              key={user.id}
              className="rounded-2xl border bg-card p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Icon icon={UserPlus} className="h-5 w-5 text-muted-foreground" />
                  <span className="font-semibold">User {index + 1}</span>
                </div>
                {users.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeUser(user.id)}
                  >
                    <Icon icon={Trash2} className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Full Name</Label>
                  <Input
                    placeholder="John Doe"
                    value={user.fullName}
                    onChange={(e) => updateUser(user.id, "fullName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Email Address</Label>
                  <Input
                    type="email"
                    placeholder="john@company.com"
                    value={user.email}
                    onChange={(e) => updateUser(user.id, "email", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Role</Label>
                <Select
                  value={user.role}
                  onValueChange={(val: any) => updateUser(user.id, "role", val)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="monitor">Monitor</SelectItem>
                    <SelectItem value="stakeholder">Stakeholder / Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}

          {/* Add Another User Button */}
          <Button
            variant="outline"
            onClick={addUser}
            className="w-full border-dashed"
          >
            <Icon icon={Plus} className="mr-2 h-4 w-4" />
            Add Another User
          </Button>
        </div>

        {/* Existing Invites */}
        {invites.length > 0 && (
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <h3 className="text-sm font-semibold mb-3">
              Pending Invites ({invites.length})
            </h3>
            <div className="space-y-2">
              {invites.map((invite) => (
                <div
                  key={invite.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{invite.email}</span>
                    <Badge variant="outline" className="text-xs">
                      {invite.role}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      removeUserInvite(invite.id);
                      refreshProgress();
                    }}
                  >
                    <Icon icon={Trash2} className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="sticky bottom-0 z-10 flex flex-col gap-3 border-t bg-background/95 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/75 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="outline" onPress={onBack} className="w-full sm:w-auto">
          <Icon icon={ArrowLeft} className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onPress={handleSaveAndContinue} className="w-full sm:w-auto">
          Next
          <Icon icon={ArrowRight} className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </>
  );
}

// ============================================================================
// STEP 6: Review & Finalize
// ============================================================================

interface Step6Props {
  onBack: () => void;
  progress: any;
  onFinalize: () => void;
}

function Step6ReviewFinalize({ onBack, progress, onFinalize }: Step6Props) {
  return (
    <>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          {/* Organization */}
          <div>
            <h3 className="font-semibold">Organization</h3>
            <p className="text-sm text-muted-foreground">
              {progress.organization?.name || "Not configured"}
            </p>
          </div>

          {/* Cameras */}
          <div>
            <h3 className="font-semibold">Cameras</h3>
            <p className="text-sm text-muted-foreground">
              {progress.cameras.length} camera(s) configured
            </p>
          </div>

          {/* Pipelines */}
          <div>
            <h3 className="font-semibold">Pipelines</h3>
            <p className="text-sm text-muted-foreground">
              {progress.pipelines.length} pipeline(s) configured
            </p>
          </div>

          {/* Notifications */}
          <div>
            <h3 className="font-semibold">Notification Channels</h3>
            <p className="text-sm text-muted-foreground">
              {progress.notifications.length} channel(s) configured
            </p>
          </div>

          {/* User Invites */}
          <div>
            <h3 className="font-semibold">User Invites</h3>
            <p className="text-sm text-muted-foreground">
              {progress.invites.length} invite(s) sent
            </p>
          </div>
        </div>

        <Separator />

        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-md">
          <p className="text-sm text-green-800 dark:text-green-300">
            ✅ Your system is ready to launch! Click "Launch System" below to complete setup.
          </p>
        </div>
      </CardContent>
      <CardFooter className="sticky bottom-0 z-10 flex flex-col gap-3 border-t bg-background/95 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/75 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="outline" onClick={onBack} className="w-full sm:w-auto">
          <Icon icon={ArrowLeft} className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          onClick={onFinalize}
          className="w-full sm:w-auto"
        >
          Launch System
        </Button>
      </CardFooter>
    </>
  );
}
