/* eslint-disable @typescript-eslint/no-unused-vars */
// import {
//     Dialog,
//     DialogTrigger,
//     DialogContent,
//     DialogHeader,
//     DialogTitle,
//     DialogDescription,
//   } from "@/features/common/components/ui/dialog";
//   import { Button } from "@/features/common/components/ui/button";
//   import { Plus } from "lucide-react";
//   import { Input } from "@/features/common/components/ui/input";
//   import { Label } from "@/features/common/components/ui/label";
//   import GradeSelect from "@/features/dashboard/components/molecules/GradeDropDown";
//   import ClassSelect from "@/features/dashboard/components/molecules/ClassDropDown";
//   import { SubmitHandler, UseFormReturn } from "react-hook-form";
//   import { StudentForm } from "@/features/dashboard/validation/index";
 
//   interface AddStudentDialogProps {
//     form: UseFormReturn<StudentForm>;
//     grades: { id: string; name: string }[];
//     classes: { id: string; name: string }[];
//     handleAddGrade: (e: React.ChangeEvent<HTMLSelectElement>) => void;
//     handleAddClass: (e: React.ChangeEvent<HTMLSelectElement>) => void;
//     onSubmit: SubmitHandler<StudentForm>;
//   }
 
//   const AddStudentDialog = ({
//     form,
//     grades,
//     classes,
//     handleAddGrade,
//     handleAddClass,
//     onSubmit,
//   }: AddStudentDialogProps) => {
//     const {
//       register,
//       handleSubmit,
//       formState: { errors },
//       reset,
//     } = form;
 
//     return (
//       <Dialog>
//         <DialogTrigger asChild>
//           <Button className="bg-emerald-600 hover:bg-emerald-700">
//             <Plus className="h-4 w-4 mr-2" />
//             Add Student
//           </Button>
//         </DialogTrigger>
//         <DialogContent className="max-w-2xl h-[90vh] overflow-auto">
//           <DialogHeader>
//             <DialogTitle>Add New Student</DialogTitle>
//             <DialogDescription>
//               Enter student information to create a new record
//             </DialogDescription>
//           </DialogHeader>
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//             <div className="grid grid-cols-2 gap-6">
//               <div className="space-y-2">
//                 <Label htmlFor="studentName">Full Name</Label>
//                 <Input
//                   id="studentName"
//                   placeholder="Enter student name"
//                   {...register("studentName")}
//                 />
//                 {errors.studentName && (
//                   <p className="text-red-500 text-xs">{errors.studentName.message}</p>
//                 )}
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="studentId">Student ID</Label>
//                 <Input id="studentId" placeholder="Auto-generated" disabled />
//               </div>
//             </div>
 
            // <div className="grid grid-cols-2 gap-6">
            //   <GradeSelect
            //     grades={grades}
            //     register={register}
            //     error={errors.grade?.message}
            //     onChange={handleAddGrade}
            //   />
            //   <ClassSelect
            //     classes={classes}
            //     register={register}
            //     error={errors.class?.message}
            //     onChange={handleAddClass}
            //   />
            // </div>
 
//             <div className="grid grid-cols-2 gap-6">
//               <div className="space-y-2">
//                 <Label htmlFor="email">Email</Label>
//                 <Input
//                   id="email"
//                   type="email"
//                   placeholder="student@email.com"
//                   {...register("email")}
//                 />
//                 {errors.email && (
//                   <p className="text-red-500 text-xs">{errors.email.message}</p>
//                 )}
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="phone">Phone</Label>
//                 <Input
//                   id="phone"
//                   placeholder="+1 (555) 123-4567"
//                   {...register("phone")}
//                 />
//                 {errors.phone && (
//                   <p className="text-red-500 text-xs">{errors.phone.message}</p>
//                 )}
//               </div>
//             </div>
 
//             <div className="space-y-2">
//               <Label htmlFor="address">Address</Label>
//               <Input
//                 id="address"
//                 placeholder="Enter full address"
//                 {...register("address")}
//               />
//               {errors.address && (
//                 <p className="text-red-500 text-xs">{errors.address.message}</p>
//               )}
//             </div>
 
//             <div className="grid grid-cols-2 gap-6">
//               <div className="space-y-2">
//                 <Label htmlFor="guardian">Guardian Name</Label>
//                 <Input
//                   id="guardian"
//                   placeholder="Guardian full name"
//                   {...register("guardian")}
//                 />
//                 {errors.guardian && (
//                   <p className="text-red-500 text-xs">{errors.guardian.message}</p>
//                 )}
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="guardianPhone">Guardian Phone</Label>
//                 <Input
//                   id="guardianPhone"
//                   placeholder="+1 (555) 123-4567"
//                   {...register("guardianPhone")}
//                 />
//                 {errors.guardianPhone && (
//                   <p className="text-red-500 text-xs">{errors.guardianPhone.message}</p>
//                 )}
//               </div>
//             </div>
 
//             <div className="flex justify-end gap-4 pt-4">
//               <Button variant="outline" type="button" onClick={() => reset()}>
//                 Cancel
//               </Button>
//               <Button className="bg-emerald-600 hover:bg-emerald-700" type="submit">
//                 Add Student
//               </Button>
//             </div>
//           </form>
//         </DialogContent>
//       </Dialog>
//     );
//   };
 
//   export default AddStudentDialog;
 
 
 
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/features/common/components/ui/dialog";
// import { Button } from "@/features/common/components/ui/button";
// import { Input } from "@/features/common/components/ui/input";
// import { Label } from "@/features/common/components/ui/label";
// import GradeSelect from "@/features/dashboard/components/molecules/GradeDropDown";
// import ClassSelect from "@/features/dashboard/components/molecules/ClassDropDown";
// import { Switch } from "@/features/common/components/ui/switch";
// import { useEffect, useState } from "react";

// import { UseFormReturn } from "react-hook-form";
// import { StudentForm } from "@/features/dashboard/validation/index";

// import { Loader2 } from "lucide-react";
// type FeeType = {
//   name: string;
//   amount: number;
// };
// interface AddStudentDialogProps {
//   form: UseFormReturn<StudentForm>
//   grades: { id: string; name: string }[]
//   classes: { id: string; name: string; feeTypes?: unknown[] }[]
//   onSubmit: (value: StudentForm) =>void

//   open: boolean
//   setOpen: (value: boolean) => void
//   isEditMode?: boolean
//   studentData?: StudentForm | null;  // Allow null
// }
 
// export default function AddStudentDialog({
//   form,
//   grades,
//   classes,
//   onSubmit,
//   open,
//   setOpen,
 
//   studentData,
//   isEditMode = false,
// }: AddStudentDialogProps) {
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const [loading, setLoading] = useState(false);
 
//   const {
//     register,
//     handleSubmit,
//     reset,
//     setValue, 
//     watch,
//     formState: { errors },
//   } = form
//   const status = watch("status");


//   useEffect(() => {
//     if (open) {
//       if (studentData && isEditMode) {
//         reset({
//           ...studentData,
//           status: studentData.status || "Inactive", 
//         });
//       } else {
//         reset({
//           fullName: "",
//           grade: 0,
//           class: 0,
//           email: "",
//           phone: "",
//           address: "",
//           guardianName: "",
//           guardianPhone: "",
//           status: "Inactive", 

//         });
//       }
//     }
//   }, [open, studentData, isEditMode, reset, form]);
 
//   const handleClose = () => {
//     setOpen(false)
//     if (reset) {
//       reset()
//     }
//   }
//   const handleStatusChange = (checked: boolean) => {
//     setValue("status", checked ? "Active" : "Inactive");
//   };

//   console.log("Grades:", grades);
//   console.log("class:", grades);
//   return (

//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogContent className="max-w-4xl  h-[90vh] overflow-auto ">
//         <DialogHeader>
//           <DialogTitle>{isEditMode ? "Edit Student" : "Add New Student"}</DialogTitle>
//         </DialogHeader>
//         <form onSubmit={handleSubmit ? handleSubmit(onSubmit) : undefined} className="space-y-6">
//           <div className="grid grid-cols-2 gap-6">
//             <div className="space-y-2">
//               <Label htmlFor="fullName">Full Name</Label>
//               <Input
//                 id="fullName"
//                 placeholder="Enter student name"
//                 {...(register ? register("fullName", { required: "Student name is required" }) : {})}
//               />
//               {errors?.fullName && <p className="text-red-500 text-xs">{errors.fullName.message}</p>}
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 id="email"
//                 type="email"
//                 placeholder="student@email.com"
//                 {...(register
//                   ? register("email", {
//                       required: "Email is required",
//                       pattern: {
//                         value: /^\S+@\S+$/i,
//                         message: "Invalid email address",
//                       },
//                     })
//                   : {})}
//               />
//               {errors?.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
//             </div>
//           </div>
          
//           <div className="grid grid-cols-2 gap-6">

//    <GradeSelect
//   grades={grades.map((grade) => ({ ...grade, id: Number(grade.id) }))}
//   setValue={setValue}
//   value={watch("grade") || null}
//   error={errors.grade?.message}
// />

//               {/* <ClassSelect
//   classes={classes.map((cls) => ({ ...cls, id: Number(cls.id) }))}
//   setValue={setValue}
//   value={watch("class") || null}
//   error={errors.class?.message}
// /> */}
// <ClassSelect
//   classes={classes.map((cls) => ({
//     ...cls,
//     id: Number(cls.id),
//     feeTypes: (cls.feeTypes ?? []) as FeeType[],
//   }))}
  
//   setValue={setValue}
//   value={watch("class") || null}
//   error={errors.class?.message}
// />

//             </div>
      
//           <div className="grid grid-cols-2 gap-6 ">
//             <div className="space-y-2">
//               <Label htmlFor="phone">Phone</Label>
//               <Input
//                 id="phone"
//                 placeholder="+92 3007655433"
//                 {...(register ? register("phone", { required: "Phone is required" }) : {})}
//               />
//               {errors?.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
//             </div>
           
         
//             <div className="space-y-2">
//               <Label htmlFor="address">Address</Label>
//               <Input
//                 id="address"
//                 placeholder="Enter full address"
//                 {...(register ? register("address", { required: "Address is required" }) : {})}
//               />
//               {errors?.address && <p className="text-red-500 text-xs">{errors.address.message}</p>}
//             </div>
//           </div>
 
//           <div className="grid grid-cols-2 gap-6">
//             <div className="space-y-2">
//               <Label htmlFor="guardianName">Guardian Name</Label>
//               <Input
//                 id="guardianName"
//                 placeholder="Guardian full name"
//                 {...(register ? register("guardianName", { required: "Guardian name is required" }) : {})}
//               />
//               {errors?.guardianName && <p className="text-red-500 text-xs">{errors.guardianName.message}</p>}
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="guardianPhone">Guardian Phone</Label>
//               <Input
//                 id="guardianPhone"
//                 placeholder="+92 3098877666"
//                 {...(register ? register("guardianPhone", { required: "Guardian phone is required" }) : {})}
//               />
//               {errors?.guardianPhone && <p className="text-red-500 text-xs">{errors.guardianPhone.message}</p>}
//             </div>
//           </div>
 

// {isEditMode && (
//   <div className="flex items-center space-x-2">
//     <Switch
//       id="status"
//       checked={status === "Active"}
//       onCheckedChange={handleStatusChange}
//     />
//     <Label htmlFor="status">Status: {status === "Active" ? "Active" : "Inactive"}</Label>
//   </div>
// )} 



//           <div className="flex justify-end gap-4 pt-4">
//             <Button variant="outline" type="button" onClick={handleClose}>
//               Cancel
//             </Button>
//             {/* <Button className="bg-emerald-600 hover:bg-emerald-700" type="submit">
//               {isEditMode ? "Update Student" : "Add Student"}
//             // </Button> */}
//             <Button 
//   className="bg-emerald-600 hover:bg-emerald-700" 
//   type="submit"
//   disabled={loading} // Disable button during submission
// >
//   {loading ? (
//     <>
//       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//       {isEditMode ? "Updating..." : "Adding..."}
//     </>
//   ) : (
//     isEditMode ? "Update Student" : "Add Student"
//   )}
// </Button>
//           </div>
//         </form>
//       </DialogContent>
//     </Dialog>
  
//   )
// }






import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/features/common/components/ui/dialog";
import { Button } from "@/features/common/components/ui/button";
import { Input } from "@/features/common/components/ui/input";
import { Label } from "@/features/common/components/ui/label";
import GradeSelect from "@/features/dashboard/components/molecules/GradeDropDown";
import ClassSelect from "@/features/dashboard/components/molecules/ClassDropDown";
import { Switch } from "@/features/common/components/ui/switch";
import { useEffect, useState } from "react";

import { StudentForm } from "@/features/dashboard/validation/index";

import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

type FeeType = {
  name: string;
  amount: number;
  discount?: number;
  paymentType?: string;
};

interface AddStudentDialogProps {
  form: ReturnType<typeof useForm<StudentForm>>;
  grades: { id: string; name: string }[];
  classes: { id: string; name: string; feeTypes?: FeeType[] }[];
  onSubmit: (data: StudentForm) => Promise<void>;
  open: boolean;
  setOpen: (open: boolean) => void;
  studentData: StudentForm | null;
  isEditMode?: boolean;
}

export default function AddStudentDialog({
  form,
  grades,
  classes,
  onSubmit,
  open,
  setOpen,
  studentData,
  isEditMode = false,
}: AddStudentDialogProps) {
  // const [discounts, setDiscounts] = useState<
  //   { name: string; amount: number; discount: number; paymentType: string }[]
  // >([]);
  const [discounts, setDiscounts] = useState<{ name: string; amount: number; discount: number; paymentType: string }[]>([]);

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const status = watch("status");

  useEffect(() => {
    if (open) {
      if (studentData && isEditMode) {
        reset({
          ...studentData,
          status: studentData.status || "Inactive",
        });
        if (studentData?.discount && Array.isArray(studentData.discount)) {
          setDiscounts(studentData.discount);
        }
      } else {
        reset({
          fullName: "",
          grade: 0,
          class: 0,
          email: "",
          phone: "",
          address: "",
          guardianName: "",
          guardianPhone: "",
          status: "Inactive",
        });
        setDiscounts([]);
      }
    }
  }, [open, studentData, isEditMode, reset]);

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const handleStatusChange = (checked: boolean) => {
    setValue("status", checked ? "Active" : "Inactive");
  };

  const handleClassChange = (classId: number) => {
    setValue("class", classId, { shouldValidate: true });
  };

  
  const handleSubmitForm = async (data: StudentForm) => {
    setLoading(true);
    try {
      const payload = {
        ...data,
        grade: Number(data.grade),
        class: Number(data.class),
        status: data.status || "Inactive",
        discount: discounts 
      };
  
      await onSubmit(payload);
      setOpen(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit form. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-4xl h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Student" : "Add New Student"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                placeholder="Enter student name"
                {...register("fullName", { required: "Student name is required" })}
              />
              {errors?.fullName && <p className="text-red-500 text-xs">{errors.fullName.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="student@email.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors?.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <GradeSelect
              grades={grades.map((grade) => ({ ...grade, id: Number(grade.id) }))}
              setValue={setValue}
              value={watch("grade") || null}
              error={errors.grade?.message}
            />

            <ClassSelect
              classes={classes.map((cls) => ({
                ...cls,
                id: Number(cls.id),
                feeTypes: (cls.feeTypes ?? []).map((fee) => ({
                  ...fee,
                  paymentType: fee.paymentType ?? "", 
                })),
              }))}
              value={watch("class") || null}
              error={errors.class?.message}
              onChange={handleClassChange}
              onDiscountsChange={setDiscounts}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                placeholder="+92 3007655433"
                {...register("phone", { required: "Phone is required" })}
              />
              {errors?.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                placeholder="Enter full address"
                {...register("address", { required: "Address is required" })}
              />
              {errors?.address && <p className="text-red-500 text-xs">{errors.address.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="guardianName">Guardian Name</Label>
              <Input
                id="guardianName"
                placeholder="Guardian full name"
                {...register("guardianName", { required: "Guardian name is required" })}
              />
              {errors?.guardianName && <p className="text-red-500 text-xs">{errors.guardianName.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="guardianPhone">Guardian Phone</Label>
              <Input
                id="guardianPhone"
                placeholder="+92 3098877666"
                {...register("guardianPhone", { required: "Guardian phone is required" })}
              />
              {errors?.guardianPhone && <p className="text-red-500 text-xs">{errors.guardianPhone.message}</p>}
            </div>
          </div>

          {isEditMode && (
            <div className="flex items-center space-x-2">
              <Switch
                id="status"
                checked={status === "Active"}
                onCheckedChange={handleStatusChange}
              />
              <Label htmlFor="status">Status: {status === "Active" ? "Active" : "Inactive"}</Label>
            </div>
          )}

          <div className="flex justify-end gap-4 pt-4">
            <Button variant="outline" type="button" onClick={handleClose}>

              Cancel
            </Button>
            <Button 
              className="bg-emerald-600 hover:bg-emerald-700" 
              type="submit"

              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditMode ? "Updating..." : "Adding..."}
                </>
              ) : (
                isEditMode ? "Update Student" : "Add Student"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}




