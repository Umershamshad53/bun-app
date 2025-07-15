// import React from "react";
// import { UseFormRegister } from "react-hook-form";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// // Define the StudentForm type or import it from the correct location
// type StudentForm = {
//   fullName: string;
//   grade: number;
//   class: number;
//   email: string;
//   phone: string;
//   address: string;
//   guardianName: string;
//   guardianPhone: string;
//   status: "Active" | "Inactive"; 
// };

// interface GradeSelectProps {
  // grades: { id: number; name: string }[];
  // // register: (name: string) => React.SelectHTMLAttributes<HTMLSelectElement>;
  // register: UseFormRegister<StudentForm>;
  // error?: string;
  // onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
// }

// const GradeSelect: React.FC<GradeSelectProps> = ({ grades, register, error, onChange }) => {
//   return (
//     <div className="space-y-2">
//       <label htmlFor="grade">Grade</label>
//       <select
//         className="w-full border rounded px-3 py-2"
//         {...register("grade")}
//         onChange={onChange}
//         defaultValue=""
//       >
//         <option value="" disabled>
//           Select Grade
//         </option>
//         {grades.map((g) => (
//           <option key={g.id} value={g.id}>
//             {g.name}
//           </option>
//         ))}
//       </select>
//       {error && <p className="text-red-500 text-xs">{error}</p>}
//     </div>
//   );
// };

// export default GradeSelect;
import React from "react";
import { UseFormSetValue } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,

  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type StudentForm = {
  fullName: string;
  grade: number;
  class: number;
  email: string;
  phone: string;
  address: string;
  guardianName: string;
  guardianPhone: string;
  status: "Active" | "Inactive";
};

interface GradeSelectProps {
  grades: { id: number; name: string }[];
  error?: string;
  setValue: UseFormSetValue<StudentForm>;
  value: number | null; // passed from watch("grade")
}

const GradeSelect: React.FC<GradeSelectProps> = ({ grades, error, setValue, value }) => {
  return (
    <div className="space-y-2">
      <label htmlFor="grade">Grade</label>
      <Select
        value={value?.toString() || ""}
        onValueChange={(val) => setValue("grade", parseInt(val))}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Grade" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
        
            {grades.map((grade) => (
              <SelectItem key={grade.id} value={grade.id.toString()}>
                {grade.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
};

export default GradeSelect;
