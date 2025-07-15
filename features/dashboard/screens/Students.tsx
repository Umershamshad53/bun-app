"use client";
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext } from "@/components/ui/pagination";

import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, GraduationCap, MoreHorizontal, Plus, Users, } from "lucide-react";
import { useForm } from "react-hook-form";
import { Switch } from "@/features/common/components/ui/switch";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Button } from "@/features/common/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/features/common/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/features/common/components/ui/dropdown-menu";
import { Input } from "@/features/common/components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/features/common/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/features/common/components/ui/table";
import { getClasses } from "@/features/dashboard/actions/classActions";
import { getGrades } from "@/features/dashboard/actions/gradeActions";
import { getOutstandingBalance } from "@/features/dashboard/actions/outStandingBalance";
import { createStudent, getStudents, updateStudent } from "@/features/dashboard/actions/studentActions";
import AddStudentDialog from "@/features/dashboard/components/molecules/StudentsFormModel";
import { StudentForm, studentSchema } from "@/features/dashboard/validation/index";
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/features/common/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Student {
  id?: number;
  rollNo?: string;
  fullName?: string;
  grade: number;
  class: number;
  email: string;
  phone: string;
  address: string;
  guardianName: string;
  guardianPhone: string;
  status: "Active" | "Inactive";
  gradeInfo?: { value: string };
  classInfo?: { value: string };
  discount?: { name: string; amount: number; discount: number }[];
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentStudentId, setCurrentStudentId] = useState<number | undefined>(
    0
  );
  const [studentData, setStudentData] = useState<Student | null>(null);
  const [loading, setLoading] = useState(false);
  // const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [grades, setGrades] = useState<{ id: string; name: string }[]>([]);
  const [classes, setClasses] = useState<{ id: string; name: string }[]>([]);
  const [data, setData] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [pendingToggleId, setPendingToggleId] = useState<number | null>(null);
  const [toggleValue, setToggleValue] = useState<"Active" | "Inactive">(
    "Inactive"
  );
  const [outstandingBalance, setOutstandingBalance] = useState<number | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10); // you can make this selectable too

  // const [isOnline, setIsOnline] = useState(false);

  // const [filters, setFilters] = useState({
  //   grade: "all",
  //   status: "all",
  //   balanceStatus: "all",
  //   enrollmentDateFrom: undefined as Date | undefined,
  //   enrollmentDateTo: undefined as Date | undefined,
  //   paymentStatus: "all",
  //   guardian: "",
  //   address: "",
  //   hasOutstanding: false,
  //   recentPayment: "all",
  // });
  const form = useForm({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      rollNo: "",
      fullName: "",
      grade: 0,
      class: 0,
      email: "",
      phone: "",
      address: "",
      guardianName: "",
      guardianPhone: "",
      status: "Inactive" as "Active" | "Inactive",
    },
  });

  const fetchStudents = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const response = await getStudents(searchQuery, page, limit);
        if (response.success && response.data) {
          setStudents(response.data.students);
          setData(response.data.students);
          setCurrentPage(response.data.pagination.page);
          setTotalPages(response.data.pagination.totalPages);
        } else {
          console.error("Failed to fetch students:", response.message);
          setData([]);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    },
    [searchQuery, limit]
  );
  console.log("Pagination Data:", totalPages);

  useEffect(() => {
    fetchStudents(currentPage);
  }, [currentPage, fetchStudents]);

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [gradesList, classesResponse] = await Promise.all([
          getGrades(),
          getClasses(),
        ]);

        const formattedGrades = gradesList.map(
          (g: { id: number; value: string }) => ({
            id: g.id.toString(),
            name: g.value,
          })
        );

        interface ClassResponseType {
          id: number;
          value: string;
          feeTypes?: unknown[];
        }
        let formattedClasses: { id: string; name: string }[] = [];
        if (classesResponse.success) {
          formattedClasses = classesResponse.data.map(
            (c: ClassResponseType) => ({
              id: c.id.toString(),
              name: c.value,
            })
          );
        }

        setGrades(formattedGrades);
        setClasses(formattedClasses);
      } catch (error) {
        console.error("Error fetching dropdowns:", error);
        toast.error("Failed to load dropdown data. Please try again later.");
      }
    };

    fetchDropdowns();
  }, []);

  console.log(students, "Student");

  const handleEditStudent = (student: Student) => {
    const formattedData = {
      id: student.id,
      rollNo: student.rollNo || "",
      fullName: student.fullName,
      grade: student.grade,
      class: student.class,
      email: student.email,
      phone: student.phone,
      address: student.address,
      guardianName: student.guardianName,
      guardianPhone: student.guardianPhone,
      status: student.status ?? "Inactive",
    };

    setStudentData(formattedData);
    setCurrentStudentId(formattedData.id);
    setIsEditMode(true);
    setOpen(true);
  };

  const handleAddStudent = () => {
    setStudentData(null);
    setCurrentStudentId(0);
    setIsEditMode(false);
    setOpen(true);
  };

  const onSubmit = async (data: Student | null) => {
    setLoading(true);
    try {
      const payload = {
        ...data,
        grade: Number(data?.grade),
        class: Number(data?.class),
        status: data?.status || "Inactive",
      };

      let response;

      // Wrap the operation in toast.promise for better UX
      await toast.promise(
        async () => {
          if (isEditMode && currentStudentId) {
            response = await updateStudent(currentStudentId, payload);
          } else {
            response = await createStudent(payload);
          }
          return response;
        },
        {
          loading: isEditMode ? "Updating student..." : "Adding student...",
          success: (response) => {
            if (response.success) {
              setOpen(false);
              form.reset();
              setStudentData(null);
              setCurrentStudentId(0);
              setIsEditMode(false);
              setSearchQuery("");
              fetchStudents();
              return isEditMode
                ? "Student updated successfully!"
                : "Student added successfully!";
            }
            return (
              response.message ||
              `Failed to ${isEditMode ? "update" : "add"} student`
            );
          },
          error: (err) => {
            console.error("Error submitting form:", err);
            return "Unexpected error occurred. Please try again.";
          },
        }
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchStudents(1); // Search karein to page 1 pe jaaye
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchQuery, fetchStudents]);
  useEffect(() => {
    const fetchOutstandingBalance = async () => {
      try {
        const res = await getOutstandingBalance();
        if (res.success) {
          setOutstandingBalance(res.data);
        } else {
          console.error("Failed to fetch balance:", res.message);
        }
      } catch (error) {
        console.error("Error fetching outstanding balance:", error);
      }
    };

    fetchOutstandingBalance();
  }, []);

  console.log(classes, "Classes Student");

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Students</h1>
            <p className="text-gray-600">
              Manage student information and payment records
            </p>
          </div>

          <Button
            onClick={handleAddStudent}
            className="flex py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md"
          >
            <span className="flex items-center gap-1 px-2">
              {" "}
              <Plus className="h-4 w-4" />
              Add Student
            </span>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* Total Students */}
          <Card className="h-[16vh] p-4">
            <div className="relative">
              <Users className="h-4 w-4 text-emerald-600 absolute right-0 top-0" />

              <CardTitle className="text-sm font-medium">
                Total Students
              </CardTitle>
              <div className="text-2xl font-bold mt-1">{students.length}</div>
            </div>
          </Card>

          {/* Active Students */}
          <Card className="h-[16vh] p-4">
            <div className="relative">
              <GraduationCap className="h-4 w-4 text-blue-600 absolute right-0 top-0" />
              <CardTitle className="text-sm font-medium">
                Active Students
              </CardTitle>
              <div className="text-2xl font-bold mt-1">
                {students.filter((s) => s.status === "Active").length}
              </div>
            </div>
          </Card>

          {/* Outstanding Balance */}

          <Card className="h-[16vh] p-4">
            <div className="relative">
              {/* <DollarSign className="h-4 w-4 text-orange-600 absolute right-0 top-0" /> */}
              <CardTitle className="text-sm font-medium">
                Outstanding Balance
              </CardTitle>

              <div className="text-2xl font-bold mt-1">
                {outstandingBalance !== null
                  ? `Rs. ${outstandingBalance.toFixed(2)}`
                  : "Loading..."}
              </div>
            </div>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Student Directory</CardTitle>
            <CardDescription>Search and manage student records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Input
                  placeholder="Search by name, ID, or email..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              {/* <Select>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Grades</SelectItem>
                  {grades.map((grade) => (
                    <SelectItem key={grade.id} value={grade.id}>
                      {grade.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select> */}
            </div>

            {/* Students Table */}
            <div className="rounded-md border  ">
              <div className="rounded-md border  flex-1 overflow-y-auto">
                <Table>
                  <TableHeader className="sticky top-0 bg-white z-10 shadow">
                    <TableRow className="">
                      <TableHead>ID</TableHead>
                      <TableHead>Roll No</TableHead>
                      <TableHead>Full Name</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Guardian Name</TableHead>
                      <TableHead>Guardian Phone</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      // Skeleton loading state
                      Array.from({ length: 5 }).map((_, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            <Skeleton className="h-4 w-10" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-32" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-20" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-20" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-24" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-40" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-28" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-48" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-32" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-28" />
                          </TableCell>
                          <TableCell className="text-right">
                            <Skeleton className="h-8 w-8 rounded-full" />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : Array.isArray(data) && data.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center py-4">
                          No students found
                        </TableCell>
                      </TableRow>
                    ) : (
                      data?.map((student: Student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">
                            {student.id}
                          </TableCell>
                          <TableCell className="font-medium">
                            {student.rollNo}
                          </TableCell>
                          <TableCell className="font-medium">
                            {student.fullName}
                          </TableCell>
                          <TableCell>
                            {student.gradeInfo?.value || "No Grade Info"}
                          </TableCell>
                          <TableCell>
                            {student.classInfo?.value || "No Class Info"}
                          </TableCell>

                          <TableCell className="flex items-center  mt-2 gap-2">
                            <Badge
                              variant={
                                student.status === "Active"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {student.status}
                            </Badge>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <div>
                                  <Switch
                                    checked={student.status === "Active"}
                                    onCheckedChange={(checked) => {
                                      setPendingToggleId(student.id!);
                                      setToggleValue(
                                        checked ? "Active" : "Inactive"
                                      );
                                    }}
                                  />
                                </div>
                              </AlertDialogTrigger>

                              {/* Alert Dialog */}
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Change status to {toggleValue}?
                                  </AlertDialogTitle>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={async () => {
                                      if (!pendingToggleId) return;

                                      try {
                                        const response = await updateStudent(
                                          pendingToggleId,
                                          {
                                            status: toggleValue,
                                          }
                                        );

                                        if (response.success) {
                                          setData((prev) =>
                                            prev.map((student) =>
                                              student.id === pendingToggleId
                                                ? {
                                                    ...student,
                                                    status: toggleValue,
                                                  }
                                                : student
                                            )
                                          );

                                          toast.success(
                                            `Student status changed to ${toggleValue}`
                                          );
                                          // window.location.reload();
                                        } else {
                                          toast.error(
                                            response.message ||
                                              "Failed to update status."
                                          );
                                        }
                                      } catch (error) {
                                        console.error(
                                          "Status change error:",
                                          error
                                        );
                                        toast.error("Something went wrong!");
                                      } finally {
                                        setPendingToggleId(null);
                                      }
                                    }}
                                  >
                                    Confirm
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>

                          <TableCell>{student.email}</TableCell>
                          <TableCell>{student.phone}</TableCell>
                          <TableCell>{student.address}</TableCell>
                          <TableCell>{student.guardianName}</TableCell>
                          <TableCell>{student.guardianPhone}</TableCell>

                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {/* <DropdownMenuItem>
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </DropdownMenuItem> */}
                                <DropdownMenuItem
                                  onClick={() => handleEditStudent(student)}
                                  disabled={loading}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Student
                                </DropdownMenuItem>
                                {/* <DropdownMenuItem>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Collect Payment
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileText className="mr-2 h-4 w-4" />
                    Payment History
                  </DropdownMenuItem> */}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
            {data.length >= 0 && totalPages >= 1 && (
              <div className="mt-4 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(1, prev - 1))
                        }
                      />
                    </PaginationItem>

                    {Array.from({ length: totalPages }).map((_, index) => (
                      <PaginationItem
                        key={index}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`px-3 py-1 cursor-pointer rounded ${
                          currentPage === index + 1
                            ? "bg-primary text-white"
                            : ""
                        }`}
                      >
                        {index + 1}
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(totalPages, prev + 1)
                          )
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      {form && (
        <AddStudentDialog
          form={form}
          grades={grades}
          classes={classes}
          onSubmit={onSubmit}
          open={open}
          setOpen={setOpen}
          studentData={studentData as StudentForm | null}
          isEditMode={isEditMode}
        />
      )}
    </>
  );
}
