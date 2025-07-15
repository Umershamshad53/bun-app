/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";



import { zodResolver } from "@hookform/resolvers/zod";
import { CreditCard, Edit, MoreHorizontal, Plus, Trash, Trash2 } from "lucide-react";
import { useFieldArray, useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { Button } from "@/features/common/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/features/common/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/features/common/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/features/common/components/ui/dropdown-menu";
import { Input } from "@/features/common/components/ui/input";
import { Label } from "@/features/common/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/features/common/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/features/common/components/ui/tabs";
    
import {
  createClass,
  deleteClass,
  getClasses,
  updateClass,
  getFeeTypes,
} from "@/features/dashboard/actions/classActions";
import { getFees } from "@/features/dashboard/actions/feeAction";
import {
  createGrade,
  deleteGrade,
  getGrades,
  updateGrade,
} from "@/features/dashboard/actions/gradeActions";
import {
  ClassFormValues,
  GradeFormValues,
  classSchema,
  gradeSchema,
} from "@/features/dashboard/validation/index";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/features/common/components/ui";

type Fee = {
  id: number;
  feeName: string;
  feeAmount: number;
  feeRequired: boolean;
  status: string;
  feeDescription?: string;
};

// type ClassFormValuesWithId = ClassFormValues & { id: number };

export default function SettingsPage() {
  const [activeTabs, setActiveTabs] = useState("class");

  const [classes, setClasses] = useState<ClassFormValuesWithId[]>([]);
  const [feeTypes, setFeeTypes] = useState<Fee[]>([]);
  const [classDialogOpen, setClassDialogOpen] = useState(false);
  const [editingClassId, setEditingClassId] = useState<number | null>(null);
  const [grades, setGrades] = useState<GradeType[]>([]);
  const [editGradeId, setEditGradeId] = useState<number | null>(null);
  const [gradeDialogOpen, setGradeDialogOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isSubmitting, setIsSubmitting] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [fees, setFees] = useState<Fee[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isSubmittingGrade, setIsSubmittingGrade] = useState(false);
  const [paymentType, setPaymentType] = useState<string>("Monthly");

  const [isLoading, setIsLoading] = useState(true);
  type GradeType = {
    id: number;
    value: string;
  };

  type ClassFormValuesWithId = ClassFormValues & { id: number };

  const {
    register: registerClass,
    handleSubmit: handleClassSubmit,
    reset: resetClassForm,
    setValue: setClassValue,
    control,
    formState: { errors: classErrors },
  } = useForm<ClassFormValues>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      value: "",
      feeTypes: [{ name: "", amount: 0, paymentType: "Monthly" }],
    },
  });

  // const { fields, append, remove } = useFieldArray({
  //   control,
  //   name: "feeTypes",
  // });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "feeTypes",
    keyName: "fieldId",
  });

  const fetchClasses = async () => {
    setIsLoading(true);
    try {
      const res = await getClasses();
      if (res.success) {
        setClasses(res.data);
      } else {
        toast.error("Failed to fetch classes");
      }
      const feeTypesName = await getFeeTypes();
      setFeeTypes(feeTypesName.data);
    } catch {
      toast.error("Error fetching classes");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchClasses();
  }, []);

  const onSubmitClass = async (data: ClassFormValues) => {
    setIsSubmitting(true);
    try {
      let res;

      if (editingClassId) {
        res = await updateClass(editingClassId, data);
      } else {
        console.log("sahjdsajdsahjdsahj");
        data.feeTypes.forEach((element) => {
          element.paymentType = "Monthly";
        });

        res = await createClass(data);
      }

      if (res.success) {
        toast.success(editingClassId ? "Class updated" : "Class added");
        fetchClasses();
        resetClassForm();
        setEditingClassId(null);
        setClassDialogOpen(false);
      } else {
        toast.error(res.message || "Failed to save class");
      }
    } catch (error) {
      toast.error("Error saving class");
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleEditClass = (cls: ClassFormValuesWithId) => {
    setEditingClassId(cls.id);
    setClassValue("value", cls.value);
    setClassValue("feeTypes", cls.feeTypes);
    setClassDialogOpen(true);
  };

  const {
    register: registerGrade,
    handleSubmit: handleGradeFormSubmit,
    setValue: setGradeFormValue,
    reset: resetGradeForm,
    formState: { errors: errorsGrade },
  } = useForm<GradeFormValues>({
    resolver: zodResolver(gradeSchema),
  });

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    const res = await getFees();

    if (res.success) setFees(res.data);
  };
  const onSubmitGrade = async (data: GradeFormValues) => {
    setIsSubmittingGrade(true);
    try {
      if (editGradeId) {
        const updatedGrade = await updateGrade(editGradeId, data.value);

        setGrades((prevGrades) =>
          prevGrades.map((grade) =>
            grade.id === editGradeId ? { ...grade, value: data.value } : grade
          )
        );

        toast.success("Grade updated");
      } else {
        const newGrade = await createGrade(data.value);

        const gradeToAdd = newGrade?.id
          ? newGrade
          : { ...newGrade, id: uuidv4() };

        setGrades((prev) => [gradeToAdd, ...prev]);
        toast.success("Grade added");
      }

      resetGradeForm();
      setEditGradeId(null);
      setGradeDialogOpen(false);
    } catch (err) {
      console.error(" Error in onSubmitGrade:", err);

      toast.error(
        err instanceof Error ? err.message : "Unexpected error occurred"
      );
    } finally {
      setIsSubmittingGrade(false);
    }
  };

  const fetchGrades = async () => {
    setIsLoading(true);
    try {
      const res = await getGrades();
      console.log("Grades fetched:", res);
      setGrades(res);
    } catch (err) {
      toast.error("Failed to fetch grades");
      console.error("Fetch grades error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGrades();
  }, []);

  const handleDeleteGrade = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this grade?"
    );
    if (!confirmDelete) return;

    try {
      await deleteGrade(id);
      toast.success("Grade deleted successfully");
      fetchGrades();
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error("Failed to delete grade");
    }
  };

  const handleDeleteClass = async (id: number) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this class?"
    );
    if (!confirm) return;

    try {
      const res = await deleteClass(id);
      if (res.success) {
        toast.success("Class deleted successfully");
        fetchClasses();
      } else {
        toast.error(res.message || "Failed to delete class");
      }
    } catch (error) {
      toast.error("Error deleting class");
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Fee Configuration */}
      <Card>
        <CardHeader>
          <Tabs
            value={activeTabs}
            onValueChange={setActiveTabs}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-8 gap-10">
              <TabsTrigger value="class">Class</TabsTrigger>
              <TabsTrigger className="" value="grade">
                Section
              </TabsTrigger>
            </TabsList>
            {/* {activeTabs === "class" && (
  <>
    <Dialog open={classDialogOpen} onOpenChange={setClassDialogOpen}>
      <DialogTrigger asChild>
        <div className="flex justify-end mt-2">
          <Button
            className="w-[15%] min-w-[10%] bg-emerald-600 hover:bg-emerald-700"
            onClick={() => {
              resetClassForm();
              setEditingClassId(null);
              
            }}
          >
            <span className="flex items-center justify-center gap-[0.1rem]">
              <Plus className="w-4 h-4" />
              Add Class
            </span>
          </Button>
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{editingClassId ? "Edit Class" : "Add Class"}</DialogTitle>
        </DialogHeader>
        <div className="max-h-[400px] overflow-auto">
          <form onSubmit={handleClassSubmit(onSubmitClass)} className="space-y-6 w-[400px] overflow-auto">
            <div className="space-y-2">
              <Label>Class Name</Label>
              <Input {...registerClass("value")} placeholder="e.g., 10th Grade" />
              {classErrors.value && <p className="text-red-500 text-sm">{classErrors.value.message}</p>}
            </div>

            <div>
              <Label className="text-md font-bold">Fee Types (Monthly)</Label>
              <div className="space-y-4 mt-2 max-h-[300px] overflow-y-auto rounded-md">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-4">
                    <div className="flex-1 space-y-1">
                      <Label className="text-sm">Name</Label>
                      <Input {...registerClass(`feeTypes.${index}.name`)} placeholder="e.g. Tuition Fee" />
                      {classErrors.feeTypes?.[index]?.name && (
                        <p className="text-red-500 text-sm">{classErrors.feeTypes[index]?.name?.message}</p>
                      )}
                    </div>

                    <div className="flex-1 space-y-1">
                      <Label className="text-sm">Amount</Label>
                      <Input
                        type="number"
                        {...registerClass(`feeTypes.${index}.amount`, { valueAsNumber: true })}
                        placeholder="e.g. 500"
                      />
                      {classErrors.feeTypes?.[index]?.amount && (
                        <p className="text-red-500 text-sm">{classErrors.feeTypes[index]?.amount?.message}</p>
                      )}
                    </div>

                    <div className="flex-1">
                      <Label>Payment Type</Label>
                      <Controller
                        control={control}
                        name={`feeTypes.${index}.paymentType`}
                        render={({ field }) => (
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Monthly">Monthly</SelectItem>
                              <SelectItem value="Annually">Annually</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {classErrors.feeTypes?.[index]?.paymentType && (
                        <p className="text-red-500 text-sm">{classErrors.feeTypes[index]?.paymentType?.message}</p>
                      )}
                    </div>

                    {index !== 0 && (
                      <Button type="button" variant="destructive" onClick={() => remove(index)} className="mt-5">
                        Delete
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => append({ name: "", amount: 0, paymentType: "Monthly" })}
                >
                  + Add Fee Type
                </Button>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setClassDialogOpen(false);
                  resetClassForm();
                  setEditingClassId(null);
                }}
         
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingClassId ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>

    // <CardContent>
    //   {isLoading ? (
    //     <div className="space-y-4">
    //       {[...Array(5)].map((_, i) => (
    //         <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg animate-pulse">
    //           <div className="h-4 bg-gray-200 rounded w-1/4"></div>
    //           <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    //           <div className="h-4 bg-gray-200 rounded w-1/4 ml-auto"></div>
    //         </div>
    //       ))}
    //     </div>
    //   ) : (
    //     <Table>
    //       <TableHeader>
    //         <TableRow>
    //           <TableHead>Class Name</TableHead>
    //           <TableHead>Fee Types</TableHead>
    //           <TableHead className="text-right">Actions</TableHead>
    //         </TableRow>
    //       </TableHeader>
    //       <TableBody>
    //         {[...classes].reverse().map((cls) => (
    //           <TableRow key={cls.id}>
    //             <TableCell className="font-semibold text-gray-900 text-base">{cls.value}</TableCell>
    //             <TableCell>
    //               <div className="grid grid-cols-3 gap-2 font-semibold text-gray-600 mb-2 text-sm w-full max-w-md">
    //                 <span>Name</span>
    //                 <span className="text-right">Amount</span>
    //                 <span className="text-right">Payment Type</span>
    //               </div>

    //               {(() => {
    //                 try {
    //                   const feeTypes = Array.isArray(cls.feeTypes)
    //                     ? cls.feeTypes
    //                     : cls.feeTypes
    //                     ? JSON.parse(cls.feeTypes)
    //                     : [];

    //                   if (!Array.isArray(feeTypes) || feeTypes.length === 0) {
    //                     return <div className="text-gray-500 italic">No fee types available</div>;
    //                   }

    //                   return feeTypes.map((f, i) => (
    //                     <div
    //                       key={i}
    //                       className="grid grid-cols-3 gap-2 w-full max-w-md text-sm px-3 py-2 rounded-md bg-white border border-gray-200 hover:shadow transition-all mb-1"
    //                     >
    //                       <span className="truncate text-gray-800">{f.name}</span>
    //                       <span className="text-right text-green-600 font-semibold">Rs {f.amount}</span>
    //                       <span className="text-right text-blue-500 font-medium">{f.paymentType}</span>
    //                     </div>
    //                   ));
    //                 } catch {
    //                   return <div className="text-red-500 font-semibold">Invalid Fee Types</div>;
    //                 }
    //               })()}
    //             </TableCell>
    //             <TableCell className="text-right">
    //               <DropdownMenu>
    //                 <DropdownMenuTrigger asChild>
    //                   <Button variant="ghost" className="h-8 w-8 p-0">
    //                     <MoreHorizontal className="h-4 w-4" />
    //                   </Button>
    //                 </DropdownMenuTrigger>
    //                 <DropdownMenuContent>
    //                   <DropdownMenuItem onClick={() => handleEditClass(cls)}>
                        
    //                     <Edit className="w-4 h-4 mr-2" /> Edit
    //                   </DropdownMenuItem>
    //                   <DropdownMenuItem
    //                     onClick={() => handleDeleteClass(cls.id)}
    //                     className="text-red-600 focus:text-red-700"
    //                   >
    //                     <Trash className="w-4 h-4 mr-2" /> Delete
    //                   </DropdownMenuItem>
    //                 </DropdownMenuContent>
    //               </DropdownMenu>
    //             </TableCell>
    //           </TableRow>
    //         ))}
    //       </TableBody>
    //     </Table>
    //   )}
    // </CardContent>
  </>
)} */}
            {activeTabs === "class" && (
              <>
                <Dialog
                  open={classDialogOpen}
                  onOpenChange={setClassDialogOpen}
                >
                  <DialogTrigger asChild>
                    <div className="flex justify-end mt-2">
                      <Button
                        className="w-[15%] min-w-[10%] bg-emerald-600 hover:bg-emerald-700"
                        onClick={() => {
                          resetClassForm();
                          setEditingClassId(null);
                        }}
                      >
                        <Plus className="w-4 h-4" />
                        Add Class
                      </Button>
                    </div>
                  </DialogTrigger>

                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>
                        {editingClassId ? "Edit Class" : "Add Class"}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="max-h-[400px] overflow-auto">
                      <form
                        onSubmit={handleClassSubmit(onSubmitClass)}
                        className="space-y-6 w-[400px] overflow-auto"
                      >
                        <div className="space-y-2">
                          <Label>Class Name</Label>
                          <Input
                            {...registerClass("value")}
                            placeholder="e.g., 10th Grade"
                          />
                          {classErrors.value && (
                            <p className="text-red-500 text-sm">
                              {classErrors.value.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <Label className="text-md font-bold">
                            Fee Types (Monthly)
                          </Label>
                          <div className="space-y-4 mt-2 max-h-[300px] overflow-y-auto rounded-md">
                            {fields.map((field, index) => (
                              <div
                                key={field.fieldId}
                                className="flex items-start gap-4 border p-3 rounded-md"
                              >
                                <div className="space-y-2">
                                  <Label>Fee Type</Label>
                                  <Controller
                                    name={`feeTypes.${index}.name`}
                                    control={control}
                                    render={({ field }) => (
                                      <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select Fee Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {feeTypes.map((feeType) => (
                                            <SelectItem
                                              key={feeType.feeName}
                                              value={feeType.feeName}
                                            >
                                              {feeType.feeName}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    )}
                                  />
                                  {classErrors?.feeTypes?.[index]?.name && (
                                    <p className="text-red-500 text-sm">
                                      {classErrors.feeTypes[index].name.message}
                                    </p>
                                  )}
                                </div>
                                <div className="flex-1 space-y-1">
                                  <Label className="text-sm">Amount</Label>
                                  <Input
                                    type="number"
                                    {...registerClass(
                                      `feeTypes.${index}.amount`,
                                      { valueAsNumber: true }
                                    )}
                                    placeholder="e.g. 500"
                                  />
                                  {classErrors.feeTypes?.[index]?.amount && (
                                    <p className="text-red-500 text-sm">
                                      {
                                        classErrors.feeTypes[index]?.amount
                                          ?.message
                                      }
                                    </p>
                                  )}
                                </div>
                                {fields.length > 1 && (
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={() => remove(index)}
                                    className="mt-6"
                                  >
                                    Delete
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>

                          <div className="mt-4">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() =>
                                append({
                                  name: "",
                                  amount: 0,
                                  paymentType: "Monthly",
                                })
                              }
                            >
                              + Add Fee Type
                            </Button>
                          </div>
                        </div>

                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setClassDialogOpen(false);
                              resetClassForm();
                              setEditingClassId(null);
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            className="bg-emerald-600 hover:bg-emerald-700"
                          >
                            {isSubmitting && (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            {editingClassId ? "Update" : "Create"}
                          </Button>
                        </div>
                      </form>
                    </div>
                  </DialogContent>
                </Dialog>

                <CardContent>
                  {isLoading ? (
                    <div className="space-y-4">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="flex items-center space-x-4 p-4 border rounded-lg animate-pulse"
                        >
                          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/4 ml-auto"></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Class Name</TableHead>
                          <TableHead>Fee Types</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[...classes].reverse().map((cls) => (
                          <TableRow key={cls.id}>
                            <TableCell className="font-semibold text-gray-900 text-base">
                              {cls.value}
                            </TableCell>
                            <TableCell>
                              <div className="grid grid-cols-3 gap-2 font-semibold text-gray-600 mb-2 text-sm w-full max-w-md">
                                <span>Name</span>
                                <span className="text-right">Amount</span>
                                {/* <span className="text-right">Payment Type</span> */}
                              </div>
                              {(Array.isArray(cls.feeTypes)
                                ? cls.feeTypes
                                : JSON.parse(cls.feeTypes || "[]")
                              ).map(
                                (
                                  f: {
                                    name: string;
                                    amount: number;
                                    paymentType: string;
                                  },
                                  i: number
                                ) => (
                                  <div
                                    key={i}
                                    className="grid grid-cols-3 gap-2 w-full max-w-md text-sm px-3 py-2 rounded-md bg-white border border-gray-200 hover:shadow transition-all mb-1"
                                  >
                                    <span className="truncate text-gray-800">
                                      {f.name}
                                    </span>
                                    <span className="text-right text-green-600 font-semibold">
                                      Rs {f.amount}
                                    </span>
                                    {/* <span className="text-right text-blue-500 font-medium">
                                      {f.paymentType}
                                    </span> */}
                                  </div>
                                )
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    className="h-8 w-8 p-0"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuItem
                                    onClick={() => handleEditClass(cls)}
                                  >
                                    <Edit className="w-4 h-4 mr-2" /> Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteClass(cls.id)}
                                    className="text-red-600 focus:text-red-700"
                                  >
                                    <Trash className="w-4 h-4 mr-2" /> Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </>
            )}

            {/* Grade Tab Content */}

            {activeTabs === "grade" && (
              <>
                <Card className="p-0 border-none shadow-none">
                  <CardHeader className="px-4 py-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <CreditCard className="h-5 w-5" />
                          Grade List
                        </CardTitle>
                        <CardDescription>
                          Manage school grades (e.g., Grade 1, Grade 2...)
                        </CardDescription>
                      </div>

                      <Dialog
                        open={gradeDialogOpen}
                        onOpenChange={setGradeDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button
                            className="bg-emerald-600 hover:bg-emerald-700"
                            onClick={() => {
                              setEditGradeId(null);
                              resetGradeForm();
                            }}
                          >
                            <span className="flex items-center justify-center gap-[0.1rem]">
                              <Plus className="h-4 w-4 " /> Add Grade
                            </span>
                          </Button>
                        </DialogTrigger>

                        <DialogContent className="max-w-lg">
                          <DialogHeader>
                            <DialogTitle>
                              {editGradeId ? "Edit Grade" : "Add Grade"}
                            </DialogTitle>
                            <DialogDescription>
                              {editGradeId
                                ? "Update grade name"
                                : "Enter a new grade name"}
                            </DialogDescription>
                          </DialogHeader>

                          <form
                            onSubmit={handleGradeFormSubmit(onSubmitGrade)}
                            className="space-y-4"
                          >
                            <div className="space-y-2">
                              <Label htmlFor="grade">Grade Name *</Label>
                              <Input
                                id="grade"
                                placeholder="e.g. Grade 1"
                                {...registerGrade("value")}
                              />
                              {errorsGrade.value && (
                                <p className="text-sm text-red-500 mt-1">
                                  {errorsGrade.value.message}
                                </p>
                              )}
                            </div>

                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                type="button"
                                onClick={() => setGradeDialogOpen(false)}
                                disabled={isSubmittingGrade}
                              >
                                Cancel
                              </Button>
                              <Button
                                type="submit"
                                className="bg-emerald-600 hover:bg-emerald-700"
                                disabled={isSubmittingGrade}
                              >
                                {isSubmittingGrade && (
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                {editGradeId ? "Update" : "Add"}
                              </Button>
                            </div>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>

                  <CardContent className="p-0 pt-2">
                    {isLoading ? (
                      <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className="flex items-center space-x-4 p-4 border rounded-lg animate-pulse"
                          >
                            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/4 ml-auto"></div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Sr No</TableHead>
                            <TableHead>Section</TableHead>
                            <TableHead className="text-right">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {grades.length > 0 ? (
                            grades.map((grade, index) => (
                              <TableRow key={grade.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{grade.value}</TableCell>
                                <TableCell className="text-right">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        className="h-8 w-8 p-0"
                                      >
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem
                                        onClick={() => {
                                          setEditGradeId(grade.id);
                                          setGradeDialogOpen(true);
                                          setGradeFormValue(
                                            "value",
                                            grade.value
                                          );
                                        }}
                                      >
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit
                                      </DropdownMenuItem>

                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleDeleteGrade(grade.id)
                                        }
                                        className="text-red-600 focus:text-red-700"
                                      >
                                        <Trash className="mr-2 h-4 w-4" />
                                        Delete
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell
                                colSpan={3}
                                className="text-center py-4"
                              >
                                No grades found.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </Tabs>
        </CardHeader>
      </Card>
    </div>
  );
}
