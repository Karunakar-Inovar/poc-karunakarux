"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Icon,
  Badge,
  Input,
  Label,
  Checkbox,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "ui";
import {
  RefreshCw,
  User,
  Lock,
  Shield,
  Bell,
  Building2,
  Key,
  CheckCircle2,
  AlertTriangle,
  UploadCloud,
  Trash2,
} from "ui/utils/icons";
import { getCurrentUser } from "app/utils/auth";
import { getItem, setItem, STORAGE_KEYS } from "app/utils/storage";

// Mock data interfaces
interface ProfileData {
  fullName: string;
  email: string;
  phoneNumber: string;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  inApp: boolean;
}

interface OrganizationData {
  name: string;
  domain: string;
  industry: string;
  companySize: string;
  licenseKey: string;
  logo: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isReconfigureDialogOpen, setIsReconfigureDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");

  // Personal Settings states
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: "John Doe",
    email: "john@company.com",
    phoneNumber: "+1 555 123 4567",
  });

  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreferences>({
    email: true,
    sms: false,
    inApp: true,
  });

  // Organization Settings states
  const [orgData, setOrgData] = useState<OrganizationData>({
    name: "",
    domain: "",
    industry: "",
    companySize: "",
    licenseKey: "",
    logo: "",
  });
  const [logoPreview, setLogoPreview] = useState<string | undefined>(orgData.logo);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      // Load profile data from user
      setProfileData({
        fullName: currentUser.name || "John Doe",
        email: currentUser.email || "john@company.com",
        phoneNumber: "+1 555 123 4567",
      });

      // Load organization data
      const org = getItem(STORAGE_KEYS.ORGANIZATION);
      if (org) {
        const orgDataValue = {
          name: org.name || "",
          domain: org.domain || "",
          industry: org.industry || "",
          companySize: org.companySize || "",
          licenseKey: org.licenseKey || "",
          logo: org.logo || "",
        };
        setOrgData(orgDataValue);
        setLogoPreview(org.logo);
      }
    }
  }, []);

  const isAdmin = user?.role === "admin";

  // Profile form
  const profileForm = useForm<ProfileData>({
    defaultValues: profileData,
  });

  // Password form
  const passwordForm = useForm<PasswordData>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Organization form
  const orgForm = useForm<OrganizationData>({
    defaultValues: orgData,
  });

  useEffect(() => {
    profileForm.reset(profileData);
  }, [profileData]);

  useEffect(() => {
    orgForm.reset(orgData);
    setLogoPreview(orgData.logo);
  }, [orgData]);

  const handleReconfigureSystem = () => {
    setIsReconfigureDialogOpen(true);
  };

  const handleConfirmReconfigure = () => {
    setIsReconfigureDialogOpen(false);
    router.push("/admin/setup");
  };

  const handleSaveProfile = (values: ProfileData) => {
    setProfileData(values);
    // In real app, save to API
    console.log("Profile saved:", values);
  };

  const handleUpdatePassword = (values: PasswordData) => {
    if (values.newPassword !== values.confirmPassword) {
      passwordForm.setError("confirmPassword", {
        message: "Passwords do not match",
      });
      return;
    }
    // In real app, update password via API
    console.log("Password updated");
    passwordForm.reset();
  };

  const handleSavePreferences = () => {
    // In real app, save to API
    console.log("Preferences saved:", notificationPrefs);
  };

  const processLogoFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setLogoPreview(base64String);
      orgForm.setValue("logo", base64String);
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
    orgForm.setValue("logo", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSaveOrganization = (values: OrganizationData) => {
    const org = getItem(STORAGE_KEYS.ORGANIZATION) || {};
    const updatedOrg = {
      ...org,
      ...values,
      logo: logoPreview || values.logo,
    };
    setItem(STORAGE_KEYS.ORGANIZATION, updatedOrg);
    setOrgData({ ...values, logo: logoPreview || values.logo });
    // In real app, save to API
    console.log("Organization saved:", updatedOrg);
  };

  const handleNotificationToggle = (key: keyof NotificationPreferences) => {
    setNotificationPrefs((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      <p className="text-muted-foreground mt-2">
          Manage your account and preferences
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} variant="underline" className="w-full">
        <TabsList>
          <TabsTrigger value="personal">Personal Settings</TabsTrigger>
          {isAdmin && <TabsTrigger value="organization">Organization Settings</TabsTrigger>}
        </TabsList>

        {/* Personal Settings Tab */}
        <TabsContent value="personal" className="space-y-6 mt-6">
          {/* System Configuration */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Icon icon={RefreshCw} className="h-5 w-5 text-muted-foreground" />
                <CardTitle>System Configuration</CardTitle>
              </div>
              <CardDescription>
                Reconfigure or continue incomplete system setup
                <br />
                Review or update your system settings including cameras, models, users, and notifications.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleReconfigureSystem}
                className="w-full sm:w-auto"
              >
                <Icon icon={RefreshCw} className="h-4 w-4 mr-2" />
                Reconfigure System
              </Button>
            </CardContent>
          </Card>

          {/* Profile Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Icon icon={User} className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Profile Information</CardTitle>
              </div>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form
                  onSubmit={profileForm.handleSubmit(handleSaveProfile)}
                  className="space-y-4"
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={profileForm.control}
                      name="fullName"
                      rules={{ required: "Full name is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="email"
                      rules={{
                        required: "Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Invalid email address",
                        },
                      }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="john@company.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={profileForm.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="+1 555 123 4567"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full sm:w-auto">
                    Save Profile
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Icon icon={Lock} className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Change Password</CardTitle>
              </div>
              <CardDescription>Update your account password</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...passwordForm}>
                <form
                  onSubmit={passwordForm.handleSubmit(handleUpdatePassword)}
                  className="space-y-4"
                >
                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    rules={{ required: "Current password is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="********"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    rules={{
                      required: "New password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="********"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    rules={{ required: "Please confirm your password" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="********"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full sm:w-auto">
                    Update Password
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Icon icon={Bell} className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Notification Preferences</CardTitle>
              </div>
              <CardDescription>Choose how you want to receive alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="email-notifications"
                  checked={notificationPrefs.email}
                  onCheckedChange={() => handleNotificationToggle("email")}
                />
                <Label
                  htmlFor="email-notifications"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Email Notifications
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="sms-notifications"
                  checked={notificationPrefs.sms}
                  onCheckedChange={() => handleNotificationToggle("sms")}
                />
                <Label
                  htmlFor="sms-notifications"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  SMS Notifications
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="inapp-notifications"
                  checked={notificationPrefs.inApp}
                  onCheckedChange={() => handleNotificationToggle("inApp")}
                />
                <Label
                  htmlFor="inapp-notifications"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  In-App Notifications
                </Label>
              </div>
              <div className="flex">
                <Button
                  type="button"
                  onClick={handleSavePreferences}
                  className="w-auto"
                >
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Organization Settings Tab (Admin Only) */}
        {isAdmin && (
          <TabsContent value="organization" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Icon icon={Building2} className="h-5 w-5 text-muted-foreground" />
                  <CardTitle>Organization Details</CardTitle>
                </div>
                <CardDescription>
                  Manage your organization settings and license
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...orgForm}>
                  <form
                    onSubmit={orgForm.handleSubmit(handleSaveOrganization)}
                    className="space-y-4"
                  >
                    <FormField
                      control={orgForm.control}
                      name="name"
                      rules={{ required: "Organization name is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Organization Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Acme Corporation" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={orgForm.control}
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
                        control={orgForm.control}
                        name="industry"
                        rules={{ required: "Industry is required" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Industry</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
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
                        control={orgForm.control}
                        name="companySize"
                        rules={{ required: "Company size is required" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Size</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
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
                      control={orgForm.control}
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

                    {/* License Key Management */}
                    <FormField
                      control={orgForm.control}
                      name="licenseKey"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-2 mb-2">
                            <Icon icon={Key} className="h-4 w-4 text-muted-foreground" />
                            <FormLabel>License Key</FormLabel>
                          </div>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Enter your license key"
                              {...field}
                            />
                          </FormControl>
                          <p className="text-xs text-muted-foreground mt-1">
                            Update your license key to manage subscription and features
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full sm:w-auto">
                      Save Organization Settings
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Two-Factor Authentication */}
            <Card className="border-dashed">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon icon={Shield} className="h-5 w-5 text-muted-foreground" />
                    <CardTitle>Two-Factor Authentication</CardTitle>
                  </div>
                  <Badge variant="outline" className="bg-muted text-muted-foreground">
                    Coming Soon
                  </Badge>
                </div>
                <CardDescription>
                  Add an extra layer of security to your organization
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Protect your organization with SMS or authenticator app verification codes for enhanced security.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Icon icon={CheckCircle2} className="h-4 w-4 text-green-600" />
                    <span>SMS and authenticator app support</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Icon icon={CheckCircle2} className="h-4 w-4 text-green-600" />
                    <span>Backup codes for account recovery</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Icon icon={CheckCircle2} className="h-4 w-4 text-green-600" />
                    <span>Device trust management</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Icon icon={CheckCircle2} className="h-4 w-4 text-green-600" />
                    <span>Enhanced account protection</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full sm:w-auto">
                  Request Early Access
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      {/* Reconfigure System Warning Dialog */}
      <AlertDialog
        open={isReconfigureDialogOpen}
        onOpenChange={setIsReconfigureDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-2">
              <Icon icon={AlertTriangle} className="h-5 w-5 text-amber-600" />
              <AlertDialogTitle>Reconfigure System</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="mt-4">
              Are you sure you want to reconfigure the system? This will redirect you to the setup wizard where you can review and update your system configuration including cameras, models, users, and notifications.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmReconfigure}>
              Continue to Setup
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
