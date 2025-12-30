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
  ToggleSwitch,
  Label,
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
  Upload,
  Check,
  Users,
  UserCheck,
  Shield,
  Clock,
  Mail,
  MoreVertical,
} from "ui/utils/icons";

// Users data
const usersData = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@company.com",
    role: "Admin",
    status: "active",
    lastActive: "2 minutes ago",
    avatar: "JS",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    role: "Monitor",
    status: "active",
    lastActive: "1 hour ago",
    avatar: "SJ",
  },
  {
    id: 3,
    name: "Mike Williams",
    email: "mike.williams@company.com",
    role: "Viewer",
    status: "active",
    lastActive: "3 hours ago",
    avatar: "MW",
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.davis@company.com",
    role: "Monitor",
    status: "pending",
    lastActive: "Never",
    avatar: "ED",
  },
  {
    id: 5,
    name: "Robert Brown",
    email: "robert.brown@company.com",
    role: "Viewer",
    status: "inactive",
    lastActive: "1 week ago",
    avatar: "RB",
  },
];

const getRoleBadge = (role: string) => {
  switch (role) {
    case "Admin":
      return (
        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800">
          <Icon icon={Shield} className="h-3 w-3 mr-1" />
          Admin
        </Badge>
      );
    case "Monitor":
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800">
          Monitor
        </Badge>
      );
    case "Viewer":
      return (
        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-700">
          Viewer
        </Badge>
      );
    default:
      return null;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">
          Active
        </Badge>
      );
    case "pending":
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800">
          Pending
        </Badge>
      );
    case "inactive":
      return (
        <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-700">
          Inactive
        </Badge>
      );
    default:
      return null;
  }
};

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  lastActive: string;
  avatar: string;
};

type FilterType = "all" | "active" | "admins" | "pending";

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>(usersData);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  // Calculate stats
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === "active").length;
  const adminUsers = users.filter((u) => u.role === "Admin").length;
  const pendingUsers = users.filter((u) => u.status === "pending").length;

  // Filter users based on search and active filter
  const filteredUsers = users.filter((user) => {
    // Search filter
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase());

    // Quick filter
    let matchesFilter = true;
    if (activeFilter === "active") {
      matchesFilter = user.status === "active";
    } else if (activeFilter === "admins") {
      matchesFilter = user.role === "Admin";
    } else if (activeFilter === "pending") {
      matchesFilter = user.status === "pending";
    }

    return matchesSearch && matchesFilter;
  });

  const handleToggleStatus = (user: User) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === user.id
          ? {
              ...u,
              status: u.status === "active" ? "inactive" : "active",
            }
          : u
      )
    );
  };

  const handleDelete = (user: User) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground mt-1">
          Manage users and their permissions
        </p>
        </div>
        <Button className="w-full sm:w-auto">
          <Icon icon={Plus} className="h-4 w-4 mr-2" />
          Invite User
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
              <h3 className="text-lg font-semibold text-foreground">Bulk User Upload</h3>
              <Badge variant="outline" className="text-xs">Coming Soon</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Import users at scale via CSV files
            </p>
          </div>
        </div>
        <Button variant="outline" className="h-9 px-4 w-full sm:w-auto">
          Request Early Access
        </Button>
      </div>

      {/* Stats Cards - Quick Filters */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <button
          onClick={() => setActiveFilter("all")}
          className="text-left transition-transform active:scale-95 cursor-pointer"
        >
          <StatsCard 
            label="Total Users" 
            value={totalUsers} 
            color={activeFilter === "all" ? "blue" : "default"}
            className={activeFilter === "all" ? "ring-2 ring-primary ring-offset-2" : ""}
          />
        </button>
        <button
          onClick={() => setActiveFilter(activeFilter === "active" ? "all" : "active")}
          className="text-left transition-transform active:scale-95 cursor-pointer"
        >
          <StatsCard 
            label="Active" 
            value={activeUsers} 
            color="green"
            className={activeFilter === "active" ? "ring-2 ring-green-500 ring-offset-2" : ""}
          />
        </button>
        <button
          onClick={() => setActiveFilter(activeFilter === "admins" ? "all" : "admins")}
          className="text-left transition-transform active:scale-95 cursor-pointer"
        >
          <StatsCard 
            label="Admins" 
            value={adminUsers} 
            color="purple"
            className={activeFilter === "admins" ? "ring-2 ring-purple-500 ring-offset-2" : ""}
          />
        </button>
        <button
          onClick={() => setActiveFilter(activeFilter === "pending" ? "all" : "pending")}
          className="text-left transition-transform active:scale-95 cursor-pointer"
        >
          <StatsCard 
            label="Pending" 
            value={pendingUsers} 
            color="amber"
            className={activeFilter === "pending" ? "ring-2 ring-amber-500 ring-offset-2" : ""}
          />
        </button>
      </div>

      {/* Search */}
      <div className="relative w-full max-w-md">
          <Icon icon={Search} className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 w-full"
          />
      </div>

      {/* User Cards */}
      <div className="space-y-4">
              {filteredUsers.map((user) => (
          <Card key={user.id} className="overflow-hidden">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                {/* Left side - User info */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  {/* Avatar */}
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium text-primary">{user.avatar}</span>
                      </div>

                  {/* User Details */}
                  <div className="flex-1 space-y-3 min-w-0">
                    {/* Name and Badges */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-semibold text-foreground">{user.name}</h3>
                      {getRoleBadge(user.role)}
                      {getStatusBadge(user.status)}
                    </div>

                    {/* Email and Last Active - Single Row for Desktop/Tablet */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <div className="flex items-center gap-2 min-w-0">
                        <Icon icon={Mail} className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-sm text-muted-foreground truncate">{user.email}</span>
                      </div>
                    <div className="flex items-center gap-2">
                        <Icon icon={Clock} className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">Last active: {user.lastActive}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right side - Action buttons */}
                <div className="flex items-center gap-3 flex-shrink-0 flex-wrap sm:flex-nowrap">
                  {/* Toggle Switch with Label */}
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`user-toggle-${user.id}`} className="text-sm text-muted-foreground cursor-pointer">
                      {user.status === "active" ? "Active" : "Inactive"}
                    </Label>
                    <ToggleSwitch
                      id={`user-toggle-${user.id}`}
                      checked={user.status === "active"}
                      onCheckedChange={() => handleToggleStatus(user)}
                      size="md"
                    />
                  </div>
                  <div className="h-6 w-px bg-border" />
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Icon icon={Pencil} className="h-4 w-4 text-muted-foreground" />
                      </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    onPress={() => handleDelete(user)}
                  >
                        <Icon icon={Trash2} className="h-4 w-4" />
                      </Button>
                    </div>
              </div>
            </CardContent>
          </Card>
              ))}
        </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{userToDelete?.name}&quot;? This action cannot be undone. 
              All user data and access permissions will be permanently removed.
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
              Delete User
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
