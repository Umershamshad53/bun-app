"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  // Bell,
  CreditCard,
  // Database,
  // Download,
  Edit,
  // Eye,
  // EyeOff,
  // Globe,
  MoreHorizontal,
  Plus,
  // Printer,
  // Receipt,
  // RefreshCw,
  // Save,
  // School,
  // Settings,
  // Shield,
  // Smartphone,
  Trash2,
  // Upload,
  Users,
  // RefreshCw,
  Loader2,
} from "lucide-react";
import { useForm } from "react-hook-form";

import { useEffect, useState } from "react";

import { Badge } from "@/features/common/components/ui/badge";
import { Button } from "@/features/common/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/features/common/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/features/common/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/features/common/components/ui/dropdown-menu";
import { Input } from "@/features/common/components/ui/input";
import { Label } from "@/features/common/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/features/common/components/ui/select";
// import { Separator } from "@/features/common/components/ui/separator";
import { Switch } from "@/features/common/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/features/common/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/features/common/components/ui/tabs";
import { Textarea } from "@/features/common/components/ui/textarea";
import {
  userCreated,
  getUsers,
  updateUser,
} from "@/features/dashboard/actions/user.action";
import {
  UserFormValues,
  UserUpdateFormValues,
  userSchema,
  userUpdateSchema,
  feeSchema,
  FeeFormValues,
} from "@/features/dashboard/validation/index";
import {
  createFee,
  getFees,
  updateFee,
  deleteFee,
} from "@/features/dashboard/actions/feeAction";
import { toast } from "sonner";
type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
};
// const users = [
//   {
//     id: 1,
//     name: "John Smith",
//     email: "john.smith@school.edu",
//     role: "Administrator",
//     status: "Active",
//     lastLogin: "2024-01-25 10:30 AM",
//   },
//   {
//     id: 2,
//     name: "Jane Doe",
//     email: "jane.doe@school.edu",
//     role: "Cashier",
//     status: "Active",
//     lastLogin: "2024-01-25 09:15 AM",
//   },
//   {
//     id: 3,
//     name: "Mike Johnson",
//     email: "mike.johnson@school.edu",
//     role: "Cashier",
//     status: "Inactive",
//     lastLogin: "2024-01-20 02:45 PM",
//   },
// ];

// const feeTypes = [
//   { id: 1, name: "Tuition Fee", amount: 500, required: true, status: "Active" },
//   { id: 2, name: "Library Fee", amount: 50, required: false, status: "Active" },
//   { id: 3, name: "Laboratory Fee", amount: 100, required: false, status: "Active" },
//   { id: 4, name: "Sports Fee", amount: 75, required: false, status: "Active" },
//   { id: 5, name: "Transportation Fee", amount: 125, required: false, status: "Active" },
// ];

// const paymentMethods = [
//   { id: 1, name: "Cash", enabled: true, processingFee: 0 },
//   { id: 2, name: "Credit/Debit Card", enabled: true, processingFee: 2.5 },
//   { id: 3, name: "Bank Transfer", enabled: true, processingFee: 1.0 },
//   { id: 4, name: "Check", enabled: false, processingFee: 0 },
// ];
type PaymentType = "" | "Monthly" | "Annually";
type Fee = {
  id: number;
  feeName: string;
  feeAmount: number;
  paymentType: PaymentType;
  feeRequired: boolean;
  status: string;
  feeDescription?: string;
};

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("users");
  // const [showPassword, setShowPassword] = useState(false);
  const [fees, setFees] = useState<Fee[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [editUserMode, setEditUserMode] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentFeeId, setCurrentFeeId] = useState<number | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [settings, setSettings] = useState({
    schoolName: "Springfield High School",
    schoolAddress: "123 Education Street, Springfield, ST 12345",
    schoolPhone: "+1 (555) 123-4567",
    schoolEmail: "admin@springfield.edu",
    currency: "USD",
    timezone: "America/New_York",
    dateFormat: "MM/DD/YYYY",
    language: "English",
    autoBackup: true,
    emailNotifications: true,
    smsNotifications: false,
    receiptFooter: "Thank you for your payment!",
    sessionTimeout: 30,
    maxLoginAttempts: 3,
  });

  // type SettingsKey = keyof typeof settings;
  // type SettingsValue = (typeof settings)[SettingsKey];

  // const handleSettingChange = (key: SettingsKey, value: SettingsValue) => {
  //   setSettings((prev) => ({ ...prev, [key]: value }));
  // };

  // const saveSettings = () => {
  //   console.log("Saving settings:", settings);
  // };

  const {
    register,
    handleSubmit,
    setValue,
    reset: resetUser,
    watch,
    formState: { errors },
  } = useForm<UserFormValues | UserUpdateFormValues>({
    resolver: zodResolver(editUserMode ? userUpdateSchema : userSchema),
  });

  const onSubmit = async (data: UserFormValues | UserUpdateFormValues) => {
    setLoading(true);

    try {
      // If editing and password is empty, remove it from the payload
      const payload =
        editUserMode && !data.password
          ? { name: data.name, email: data.email, role: data.role }
          : data;

      const result =
        editUserMode && currentUserId
          ? await updateUser(currentUserId, payload)
          : await userCreated(data as UserFormValues);

      setLoading(false);

      if (result.success) {
        toast.success(
          editUserMode
            ? "User updated successfully!"
            : "User created successfully!",
          {
            duration: 3000,
          }
        );
        if (editUserMode) {
          fetchUsers();
          handleCloseModal();
        }
      } else {
        toast.error(result.message || "Something went wrong", {
          duration: 3000,
        });
      }
    } catch {
      setLoading(false);
      toast.error("An error occurred. Please try again.", {
        duration: 3000,
      });
    }
  };

  const {
    register: registerFee,
    handleSubmit: handleFeeSubmit,
    reset: resetFee,
    setValue: setFeeValue,
    watch: watchFee,
    formState: { errors: feeErrors },
  } = useForm<FeeFormValues>({
    resolver: zodResolver(feeSchema),
    defaultValues: {
      feeName: "",
      feeDescription: "",
      feeAmount: 0,
      paymentType: "",
      feeRequired: false,
    },
  });

  useEffect(() => {
    fetchFees();
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await getUsers();
    // console.log("resresresresresresres", res.users);
    if (res.success) {
      setUsers(res.users);
      console.log("usersusersusersusersusers", users);
    }
  };

  const fetchFees = async () => {
    const res = await getFees();
    if (res.success) setFees(res.data);
  };

  const handleFeeSubmitForm = async (data: FeeFormValues) => {
    setLoading(true);
    try {
      const res =
        editMode && currentFeeId
          ? await updateFee(currentFeeId, data)
          : await createFee(data);

      if (res.success) {
        await fetchFees();
        handleCloseModal();
      } else {
        alert(res.message);
      }
    } catch {
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (fee: FeeFormValues & { id: number; status?: string }) => {
    setEditMode(true);
    setCurrentFeeId(fee.id);
    setFeeValue("feeName", fee.feeName);
    setFeeValue("feeAmount", fee.feeAmount);
    setFeeValue("paymentType", fee.paymentType);
    setFeeValue("feeDescription", fee.feeDescription || "");
    setFeeValue("feeRequired", fee.feeRequired);
    setIsDialogOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditUserMode(true);
    setCurrentUserId(user.id);
    setValue("name", user.name);
    setValue("email", user.email);
    // Normalize role to lowercase
    setValue(
      "role",
      user.role.toLowerCase() as "administrator" | "cashier" | "viewer"
    );
    setValue("password", ""); // Clear password field for edit mode
    setIsDialogOpen(true);
  };
  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this fee?")) {
      const res = await deleteFee(id);
      if (res.success) fetchFees();
      else alert(res.message);
    }
  };

  const handleCloseModal = () => {
    resetFee();
    resetUser();
    setEditMode(false);
    setEditUserMode(false);
    setCurrentFeeId(null);
    setCurrentUserId(null);
    setIsDialogOpen(false);
  };

  const handleToggleRequired = async (feeId: number, required: boolean) => {
    setLoading(true);
    try {
      const feeToUpdate = fees.find((f) => f.id === feeId);
      if (!feeToUpdate) return;
      const res = await updateFee(feeId, {
        feeName: feeToUpdate.feeName,
        feeAmount: feeToUpdate.feeAmount,
        paymentType: feeToUpdate.paymentType,
        feeDescription: feeToUpdate.feeDescription || "",
        feeRequired: required,
      });
      if (res.success) {
        await fetchFees();
        toast.success("Fee updated");
      } else {
        toast.error(res.message || "Failed to update fee");
      }
    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600">
            Configure and manage your school POS system
          </p>
        </div>
        {/* <Button onClick={saveSettings} className="bg-emerald-600 hover:bg-emerald-700">
          <Save className="h-4 w-4 mr-2" />
          Save All Changes
        </Button> */}
      </div>

      {/* Settings Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-8">
          {/* <TabsTrigger value="general">General</TabsTrigger> */}
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="fees">Fees</TabsTrigger>
          {/* <TabsTrigger value="payments">Payments</TabsTrigger> */}
          {/* <TabsTrigger value="receipts">Receipts</TabsTrigger> */}
          {/* <TabsTrigger value="notifications">Notifications</TabsTrigger> */}
          {/* <TabsTrigger value="security">Security</TabsTrigger> */}
          {/* <TabsTrigger value="system">System</TabsTrigger> */}
        </TabsList>

        {/* General Settings */}
        {/* <TabsContent value="general" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* School Information */}
        {/* <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <School className="h-5 w-5" />
                  School Information
                </CardTitle>
                <CardDescription>Basic information about your school</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="schoolName">School Name</Label>
                  <Input id="schoolName" value={settings.schoolName} onChange={(e) => handleSettingChange("schoolName", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="schoolAddress">Address</Label>
                  <Textarea id="schoolAddress" value={settings.schoolAddress} onChange={(e) => handleSettingChange("schoolAddress", e.target.value)} rows={3} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="schoolPhone">Phone Number</Label>
                  <Input id="schoolPhone" value={settings.schoolPhone} onChange={(e) => handleSettingChange("schoolPhone", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="schoolEmail">Email Address</Label>
                  <Input id="schoolEmail" type="email" value={settings.schoolEmail} onChange={(e) => handleSettingChange("schoolEmail", e.target.value)} />
                </div>
              </CardContent>
            </Card> */}

        {/* System Preferences */}
        {/* <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  System Preferences
                </CardTitle>
                <CardDescription>Configure system-wide preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={settings.currency} onValueChange={(value) => handleSettingChange("currency", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={settings.timezone} onValueChange={(value) => handleSettingChange("timezone", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                      <SelectItem value="America/Chicago">Central Time</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Select value={settings.dateFormat} onValueChange={(value) => handleSettingChange("dateFormat", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={settings.language} onValueChange={(value) => handleSettingChange("language", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Spanish">Spanish</SelectItem>
                      <SelectItem value="French">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent> */}

        {/* User Management */}

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    User Management
                  </CardTitle>
                  <CardDescription>
                    Manage system users and their permissions
                  </CardDescription>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      className="flex items-center justify-center gap-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md"
                      onClick={() => {
                        setEditUserMode(false);
                        resetUser();
                      }}
                    >
                      <span className="flex items-center gap-1 px-2">
                        {" "}
                        <Plus className="h-4 w-4" />
                        Add User
                      </span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>
                        {editUserMode ? "Edit User" : "Add New User"}
                      </DialogTitle>
                      <DialogDescription>
                        {editUserMode
                          ? "Update user account details"
                          : "Create a new user account for the system"}
                      </DialogDescription>
                    </DialogHeader>

                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="space-y-4"
                      autoComplete="off"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          placeholder="Enter full name"
                          autoComplete="new-name"
                          {...register("name")}
                        />
                        {errors.name && (
                          <p className="text-sm text-red-500">
                            {errors.name.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="user@school.edu"
                          autoComplete="new-email"
                          {...register("email")}
                        />
                        {errors.email && (
                          <p className="text-sm text-red-500">
                            {errors.email.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select
                          value={watch("role") || ""}
                          onValueChange={(value) =>
                            setValue("role", value as UserFormValues["role"])
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="administrator">
                              Administrator
                            </SelectItem>
                            <SelectItem value="cashier">Cashier</SelectItem>
                            <SelectItem value="viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.role && (
                          <p className="text-sm text-red-500">
                            {errors.role.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password">
                          Password{" "}
                          {editUserMode &&
                            "(Leave blank to keep current password)"}
                        </Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder={
                            editUserMode
                              ? "Leave blank to keep current password"
                              : "Enter password"
                          }
                          autoComplete="new-password"
                          {...register("password")}
                        />
                        {errors.password && (
                          <p className="text-sm text-red-500">
                            {errors.password.message}
                          </p>
                        )}
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleCloseModal}
                          disabled={loading}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                          {loading && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          {loading
                            ? editUserMode
                              ? "Updating..."
                              : "Creating..."
                            : editUserMode
                              ? "Update User"
                              : "Create User"}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.role === "Administrator"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {user.role}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleEditUser(user)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Fee Configuration */}
        {/* <TabsContent value="fees" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Fee Configuration
                  </CardTitle>
                  <CardDescription>
                    Manage fee types and amounts
                  </CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-emerald-600 hover:bg-emerald-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Fee Type
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Fee Type</DialogTitle>
                      <DialogDescription>Create a new fee category</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="feeName">Fee Name</Label>
                        <Input id="feeName" placeholder="Enter fee name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="feeAmount">Amount</Label>
                        <Input id="feeAmount" type="number" placeholder="0.00" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="feeDescription">Description</Label>
                        <Textarea id="feeDescription" placeholder="Enter fee description" rows={3} />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="required" />
                        <Label htmlFor="required">Required Fee</Label>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline">Cancel</Button>
                        <Button className="bg-emerald-600 hover:bg-emerald-700">Create Fee</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fee Name</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Required</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feeTypes.map((fee) => (
                    <TableRow key={fee.id}>
                      <TableCell className="font-medium">{fee.name}</TableCell>
                      <TableCell>${fee.amount}</TableCell>
                      <TableCell>
                        <Badge variant={fee.required ? "default" : "secondary"}>{fee.required ? "Required" : "Optional"}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={fee.status === "Active" ? "default" : "secondary"}>{fee.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Fee
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Fee
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent> */}

        <TabsContent value="fees" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Fee Configuration
                  </CardTitle>
                  <CardDescription>
                    Manage fee types and amounts
                  </CardDescription>
                </div>

                {/* Fee Modal */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      className="bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => {
                        setEditMode(false);
                        resetFee();
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Fee Type
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>
                        {editMode ? "Edit Fee " : "Add New Fee Type"}
                      </DialogTitle>
                      <DialogDescription>
                        {editMode
                          ? "Update the fee details below"
                          : "Create a new fee category"}
                      </DialogDescription>
                    </DialogHeader>
                    <form
                      onSubmit={handleFeeSubmit(handleFeeSubmitForm)}
                      className="space-y-4 pt-4"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="feeName">Fee Name *</Label>
                        <Input
                          id="feeName"
                          placeholder="Enter fee name"
                          {...registerFee("feeName")}
                        />
                        {feeErrors.feeName && (
                          <p className="text-red-600 text-sm">
                            {feeErrors.feeName.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="feeAmount">Amount *</Label>
                        <Input
                          id="feeAmount"
                          type="number"
                          placeholder="0.00"
                          {...registerFee("feeAmount", {
                            setValueAs: (value) =>
                              value === "" ? undefined : Number(value),
                          })}
                        />
                        {feeErrors.feeAmount && (
                          <p className="text-red-600 text-sm">
                            {feeErrors.feeAmount.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="paymentType">Payment Type</Label>
                        <Select
                          value={watchFee("paymentType")}
                          onValueChange={(val) =>
                            setFeeValue(
                              "paymentType",
                              val as "Monthly" | "Annually"
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Payment Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Monthly">Monthly</SelectItem>
                            <SelectItem value="Annually">Annually</SelectItem>
                          </SelectContent>
                        </Select>
                        {feeErrors.paymentType && (
                          <p className="text-sm text-red-500">
                            {feeErrors.paymentType.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="feeDescription">Description</Label>
                        <Textarea
                          id="feeDescription"
                          placeholder="Enter fee description"
                          rows={3}
                          {...registerFee("feeDescription")}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="required"
                          checked={watchFee("feeRequired")}
                          onCheckedChange={(val) =>
                            setFeeValue("feeRequired", val)
                          }
                        />
                        <Label htmlFor="required">Required Fee</Label>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          type="button"
                          onClick={handleCloseModal}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          className="bg-emerald-600 hover:bg-emerald-700"
                          disabled={loading}
                        >
                          {loading ? (
                            <Loader2 className="animate-spin h-4 w-4" />
                          ) : editMode ? (
                            "Update Fee"
                          ) : (
                            "Create Fee"
                          )}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>

            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fee Name</TableHead>
                    <TableHead>Fee Description</TableHead>
                    <TableHead>Fee Amount</TableHead>
                    <TableHead>Payment Type</TableHead>
                    <TableHead>Required</TableHead>

                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fees.map((fee) => (
                    <TableRow key={fee.id}>
                      <TableCell className="font-medium">
                        {fee.feeName}
                      </TableCell>
                      <TableCell className="font-medium">
                        {fee.feeDescription}
                      </TableCell>
                      <TableCell className="font-medium">
                        Rs {fee.feeAmount}
                      </TableCell>
                      <TableCell className="font-medium">
                        {fee.paymentType}
                      </TableCell>

                      <TableCell className="">
                        <Switch
                          checked={fee.feeRequired}
                          onCheckedChange={(checked) =>
                            handleToggleRequired(fee.id, checked)
                          }
                        />
                        {fee.feeRequired}
                      </TableCell>

                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                handleEdit({
                                  id: fee.id,
                                  feeName: fee.feeName,
                                  feeAmount: fee.feeAmount,
                                  paymentType: fee.paymentType || "Monthly",
                                  feeDescription: fee.feeDescription || "",
                                  feeRequired: fee.feeRequired,
                                  status: fee.status || "Active",
                                })
                              }
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Fee
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDelete(fee.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Fee
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>

                {/* <TableBody>
              {fees.map((fee) => (
                <TableRow key={fee.id}>
                  <TableCell className="font-medium">{fee.feeName}</TableCell>
                  <TableCell className="font-medium">{fee.feeDescription}</TableCell>
                  <TableCell className="font-medium">Rs {fee.feeAmount}</TableCell>
                  <Switch>
                  <TableCell>
                    
                    {fee.required ? "Required" : "Optional"}
                  </TableCell>
                  </Switch>
                  
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleEdit({
                            id: fee.id,
                            feeName: fee.feeName,
                            feeAmount: fee.feeAmount,
                            feeDescription: fee.feeDescription || "",
                            feeRequired: fee.required,
                            status: fee.status || "Active"
                          })}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Fee
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDelete(fee.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Fee
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody> */}
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        {/* Payment Settings */}
        {/* <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Methods
              </CardTitle>
              <CardDescription>Configure available payment methods and processing fees</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Switch checked={method.enabled} />
                      <div>
                        <div className="font-medium">{method.name}</div>
                        <div className="text-sm text-gray-500">Processing Fee: {method.processingFee}%</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Configure
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent> */}

        {/* Receipt Settings */}
        {/* <TabsContent value="receipts" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  Receipt Configuration
                </CardTitle>
                <CardDescription>Customize receipt appearance and content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="receiptFooter">Receipt Footer Message</Label>
                  <Textarea id="receiptFooter" value={settings.receiptFooter} onChange={(e) => handleSettingChange("receiptFooter", e.target.value)} rows={3} />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="showLogo" />
                  <Label htmlFor="showLogo">Show School Logo</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="showBarcode" />
                  <Label htmlFor="showBarcode">Include Barcode</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="autoEmail" />
                  <Label htmlFor="autoEmail">Auto-email Receipts</Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Printer className="h-5 w-5" />
                  Printer Settings
                </CardTitle>
                <CardDescription>Configure receipt printing options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="printerType">Printer Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select printer type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="thermal">Thermal Printer</SelectItem>
                      <SelectItem value="inkjet">Inkjet Printer</SelectItem>
                      <SelectItem value="laser">Laser Printer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paperSize">Paper Size</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select paper size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="80mm">80mm (Thermal)</SelectItem>
                      <SelectItem value="a4">A4</SelectItem>
                      <SelectItem value="letter">Letter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="autoPrint" />
                  <Label htmlFor="autoPrint">Auto-print Receipts</Label>
                </div>
                <Button variant="outline" className="w-full">
                  <Printer className="h-4 w-4 mr-2" />
                  Test Print
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent> */}

        {/* Notification Settings */}
        {/* <TabsContent value="notifications" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Email Notifications
                </CardTitle>
                <CardDescription>Configure email notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Payment Confirmations</div>
                    <div className="text-sm text-gray-500">Send email receipts to students/parents</div>
                  </div>
                  <Switch checked={settings.emailNotifications} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Payment Reminders</div>
                    <div className="text-sm text-gray-500">Automated payment reminder emails</div>
                  </div>
                  <Switch />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Daily Reports</div>
                    <div className="text-sm text-gray-500">Daily collection summary emails</div>
                  </div>
                  <Switch />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">System Alerts</div>
                    <div className="text-sm text-gray-500">Important system notifications</div>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  SMS Notifications
                </CardTitle>
                <CardDescription>Configure SMS notification settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Payment Confirmations</div>
                    <div className="text-sm text-gray-500">Send SMS receipts</div>
                  </div>
                  <Switch checked={settings.smsNotifications} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Payment Reminders</div>
                    <div className="text-sm text-gray-500">SMS payment reminders</div>
                  </div>
                  <Switch />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Overdue Notices</div>
                    <div className="text-sm text-gray-500">SMS for overdue payments</div>
                  </div>
                  <Switch />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smsProvider">SMS Provider</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select SMS provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="twilio">Twilio</SelectItem>
                      <SelectItem value="nexmo">Nexmo</SelectItem>
                      <SelectItem value="aws">AWS SNS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent> */}

        {/* Security Settings */}
        {/* <TabsContent value="security" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Authentication Settings
                </CardTitle>
                <CardDescription>Configure security and authentication options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleSettingChange("sessionTimeout", Number.parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    value={settings.maxLoginAttempts}
                    onChange={(e) => handleSettingChange("maxLoginAttempts", Number.parseInt(e.target.value))}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="twoFactor" />
                  <Label htmlFor="twoFactor">Enable Two-Factor Authentication</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="passwordExpiry" />
                  <Label htmlFor="passwordExpiry">Password Expiry (90 days)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="auditLog" />
                  <Label htmlFor="auditLog">Enable Audit Logging</Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Data Security
                </CardTitle>
                <CardDescription>Data protection and privacy settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch id="dataEncryption" defaultChecked />
                  <Label htmlFor="dataEncryption">Data Encryption at Rest</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="sslOnly" defaultChecked />
                  <Label htmlFor="sslOnly">Require SSL/HTTPS</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="ipWhitelist" />
                  <Label htmlFor="ipWhitelist">IP Address Whitelisting</Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dataRetention">Data Retention Period</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select retention period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1year">1 Year</SelectItem>
                      <SelectItem value="3years">3 Years</SelectItem>
                      <SelectItem value="5years">5 Years</SelectItem>
                      <SelectItem value="7years">7 Years</SelectItem>
                      <SelectItem value="indefinite">Indefinite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent> */}

        {/* System Settings */}
        {/* <TabsContent value="system" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Backup & Maintenance
                </CardTitle>
                <CardDescription>System backup and maintenance settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Automatic Backups</div>
                    <div className="text-sm text-gray-500">Daily automated system backups</div>
                  </div>
                  <Switch checked={settings.autoBackup} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="backupTime">Backup Time</Label>
                  <Input id="backupTime" type="time" defaultValue="02:00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="backupRetention">Backup Retention</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select retention period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7days">7 Days</SelectItem>
                      <SelectItem value="30days">30 Days</SelectItem>
                      <SelectItem value="90days">90 Days</SelectItem>
                      <SelectItem value="1year">1 Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Download Backup
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Upload className="h-4 w-4 mr-2" />
                    Restore Backup
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Integration Settings
                </CardTitle>
                <CardDescription>Third-party integrations and API settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Student Information System</div>
                    <div className="text-sm text-gray-500">Sync with existing SIS</div>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Accounting Software</div>
                    <div className="text-sm text-gray-500">Export to QuickBooks/Xero</div>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Email Service</div>
                    <div className="text-sm text-gray-500">SMTP configuration</div>
                  </div>
                  <Switch />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key</Label>
                  <div className="flex gap-2">
                    <Input id="apiKey" type={showPassword ? "text" : "password"} value="sk_live_xxxxxxxxxxxxxxxxxxxx" readOnly />
                    <Button variant="outline" size="icon" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent> */}
      </Tabs>
    </div>
  );
}
