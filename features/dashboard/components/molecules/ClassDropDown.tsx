


// "use client";

// import React, { useState } from "react";
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
// } from "@/components/ui/select"; 
// import { DiscountModal } from "./DiscountModal";

// type FeeType = {
//   name: string;
//   amount: number;
//   discount: number;
// };

// export type StudentForm = {
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

// interface ClassSelectProps {
//   classes: { id: number; name: string; feeTypes: FeeType[] }[];
//   error?: string;
//   value: number | null; 
// }

// const ClassSelect: React.FC<ClassSelectProps> = ({ classes, error, value }) => {
//   const [modalOpen, setModalOpen] = useState(false);
//   const [selectedClass, setSelectedClass] = useState<{
//     id: number;
//     name: string;
//     feeTypes: FeeType[];
//   } | null>(null);
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const [discounts, setDiscounts] = useState<{ name: string; amount: number; discount: number }[]>([]);

//   const handleValueChange = (val: string) => {
//     const classId = parseInt(val);
//     const cls = classes.find(c => c.id === classId);
//     if (cls) {
//       setSelectedClass({
//         id: classId,
//         name: cls.name,
//         feeTypes: cls.feeTypes || []
//       });
//       setModalOpen(true);
//     }
//   };

//   // FeeState type matches DiscountModal's expected feeTypes
//   type FeeState = {
//     name: string;
//     amount: number;
//     discount: string | number;
//   };
  
//   const handleSaveDiscounts = (
//     discount: number,
//     feeTypes: FeeState[],
//     paymentType: string
//   ) => {
//     // Convert discount to number if needed
//     const simplified = feeTypes.map(f => ({
//       name: f.name,
//       amount: f.amount,
//       discount: typeof f.discount === "string" ? parseFloat(f.discount) : f.discount,
//     }));
  
//     console.log("🎯 Saved Fee Types:", simplified, "Payment Type:", paymentType);
//     // sendToApi(simplified); // your custom logic
//   };
  
//   return (
//     <div className="space-y-2">
//       <label htmlFor="class">Class</label>
//       <Select
//         value={value?.toString() || ""}
//         onValueChange={handleValueChange}
//       >
//         <SelectTrigger className="w-full">
//           <SelectValue placeholder="Class" />
//         </SelectTrigger>
//         <SelectContent>
//           <SelectGroup>
//             {classes.map((cls) => (
//               <SelectItem key={cls.id} value={cls.id.toString()}>
//                 {cls.name}
//               </SelectItem>
//             ))}
//           </SelectGroup>
//         </SelectContent>
//       </Select>
//       {error && <p className="text-red-500 text-xs">{error}</p>}

//         {selectedClass && (
//         <DiscountModal
//           open={modalOpen}
//           setOpen={setModalOpen}
//           selectedClassId={selectedClass.id}
//           onSave={handleSaveDiscounts}
//         />
//       )}
//     </div>
//   );
// };

// export default ClassSelect;

"use client";

import React, { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { DiscountModal } from "./DiscountModal";
export type StudentForm = {
  fullName: string;
  grade: number;
  class: number;
  email: string;
  phone: string;
  status: "Active" | "Inactive";
  address: string;
  guardianName: string;
  guardianPhone: string;
  discount?: { name: string; amount: number; discount: number }[];
};
export type FeeType = {
  name: string;
  amount: number;
  paymentType: string; 
  discount?: number;
};

interface ClassSelectProps {
  classes: { id: number; name: string; feeTypes?: FeeType[] }[];
  error?: string;
  value: number | null;
  onChange: (value: number) => void;
  onDiscountsChange: (discounts: { name: string; amount: number; discount: number; paymentType: string }[]) => void;


}

const ClassSelect: React.FC<ClassSelectProps> = ({ 
  classes, 
  error, 
  value,
  onChange,
  onDiscountsChange
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<{
    id: number;
    name: string;
    feeTypes: FeeType[];
  } | null>(null);

  const handleValueChange = (val: string) => {
    const classId = parseInt(val);
    const cls = classes.find(c => c.id === classId);
    if (cls) {
      setSelectedClass({
        id: classId,
        name: cls.name,
        feeTypes: cls.feeTypes || []
      });
      onChange(classId); // Update the form value
      setModalOpen(true);
    }
  };

  type FeeState = {
    name: string;
    amount: number;
    discount: string | number;
    paymentType?: string;
  };
  // const handleSaveDiscounts = (
  //   discount: number,
  //   feeTypes: FeeState[]
  // ) => {
  //   const formattedDiscounts = feeTypes.map(fee => ({
  //     name: fee.name,
  //     amount: fee.amount,
  //     discount: typeof fee.discount === "string" ? parseFloat(fee.discount) : fee.discount,
  //     paymentType: fee.paymentType
  //   }));
  //   onDiscountsChange(formattedDiscounts);
  //   setModalOpen(false);
  // };

  // const handleSaveDiscounts = (
  //   discount: number,
  //   feeTypes: FeeState[]
  // ) => {
  //   const formattedDiscounts = feeTypes.map(fee => ({
  //     name: fee.name,
  //     amount: fee.amount,
  //     discount: typeof fee.discount === "string" ? parseFloat(fee.discount) : fee.discount,
  //     paymentType: "b" // Hardcode paymentType as "b" here
  //   }));
  //   onDiscountsChange(formattedDiscounts);
  //   setModalOpen(false);
  // };

  const handleSaveDiscounts = (
    discount: number,
    feeTypes: FeeState[]
  ) => {
    const formattedDiscounts = feeTypes.map(fee => ({
      name: fee.name,
      amount: fee.amount,
      discount: typeof fee.discount === "string" ? parseFloat(fee.discount) : fee.discount,
      paymentType: fee.paymentType ?? "" // Ensure paymentType is always a string
    }));
    onDiscountsChange(formattedDiscounts);
    setModalOpen(false);
  };
  return (
    <div className="space-y-2">
      <label htmlFor="class">Class</label>
      <Select
        value={value?.toString() || ""}
        onValueChange={handleValueChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select class" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {classes.map((cls) => (
              <SelectItem key={cls.id} value={cls.id.toString()}>
                {cls.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {error && <p className="text-red-500 text-xs">{error}</p>}

      {selectedClass && (
        <DiscountModal
          open={modalOpen}
          setOpen={setModalOpen}
          selectedClassId={selectedClass.id}
          onSave={handleSaveDiscounts}
        />
      )}
    </div>
  );
};

export default ClassSelect;


