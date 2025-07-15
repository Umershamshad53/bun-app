

"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/features/common/components/ui/dialog";
import { Button } from "@/features/common/components/ui/button";
import { Input } from "@/features/common/components/ui/input";
import { Label } from "@/features/common/components/ui/label";

import { useState, useEffect } from "react";
import { getClasses } from "@/features/dashboard/actions/classActions";

export type FeeType = {
  paymentType: string;
  id: number;
  name: string;
  amount: number;

};

type ClassType = {
  id: number;
  name: string;
  feeTypes: FeeType[];
};

export type FeeState = {
  uid: string;
  id: number;
  name: string;
  amount: number;
  discount: number | string;
  paymentType: string;
};

interface DiscountModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedClassId: number | null;
  onSave: (discount: number, feeTypes: FeeState[], paymentType: string) => void;
  initialDiscount?: number;
}

export function DiscountModal({
  open,
  setOpen,
  selectedClassId,
  onSave,
  initialDiscount,
}: DiscountModalProps) {
  const [feeStates, setFeeStates] = useState<FeeState[]>([]);
  const [classData, setClassData] = useState<ClassType | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchClassData = async () => {
      if (open && selectedClassId) {
        setLoading(true);
        try {
          const response = await getClasses();
          console.log(" API Response:", response);
  
          if (response.success) {
            const foundClass = response.data.find(
              (cls: ClassType) => cls.id === selectedClassId
            );
            console.log(" Found Class:", foundClass);
  
            if (foundClass) {
              setClassData(foundClass);
  
              const mapped = foundClass.feeTypes.map((f: FeeType, i: number) => ({
                uid: `${f.id}-${i}`,
                id: f.id,
                name: f.name,
                amount: f.amount,
                discount: initialDiscount || 0,
         
                paymentType: f.paymentType || "Annually",
              }));
  
              console.log("📦 Mapped Fee States:", mapped);
              setFeeStates(mapped);
            }
          }
        } catch (err) {
          console.error("❌ Error fetching class data:", err);
        } finally {
          setLoading(false);
        }
      }
    };
  
    fetchClassData();
  }, [open, selectedClassId, initialDiscount]);
  

  const updateFee = (
    uid: string,
    key: "discount" | "paymentType",
    value: number | string
  ) => {
    setFeeStates((prev) =>
      prev.map((fee) =>
        fee.uid === uid ? { ...fee, [key]: value } : fee
      )
    );
  };


// const handleSave = () => {
//   const hasInvalid = feeStates.some((f) => {
//     const val = Number(f.discount);
//     return isNaN(val) || val < 0 || val > 100;

//   });

//   if (hasInvalid) {
//     setError("Discount must be between 0 and 100");
//     return;
//   }

//   setError("");

  
//   const cleanedFeeStates = feeStates.map((f) => ({
//     ...f,
//     discount: Number(f.discount),
//   }));

 
//   onSave(0, cleanedFeeStates, "");
//   setOpen(false);
// };
// Update the handleSave function to use the actual paymentType from state
const handleSave = () => {
  const hasInvalid = feeStates.some((f) => {
    const val = Number(f.discount);
    return isNaN(val) || val < 0 || val > 100;
  });

  if (hasInvalid) {
    setError("Discount must be between 0 and 100");
    return;
  }

  setError("");

  const cleanedFeeStates = feeStates.map((f) => ({
    ...f,
    discount: Number(f.discount),
    paymentType: f.paymentType // Keep the actual paymentType value
  }));

  onSave(0, cleanedFeeStates, "");
  setOpen(false);
};
  if (loading) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Loading class data...</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {classData?.name} Fee Configuration
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Fee Types</Label>

            {feeStates.length > 0 ? (
              feeStates.map((fee) => (
                <div key={fee.uid} className="flex gap-2 items-center text-sm">
                  <div className="flex items-center gap-2 w-[25%]">
                    <Label className="whitespace-nowrap">Name</Label>
                    <Input
                      value={fee.name}
                      readOnly
                      className="bg-gray-100 h-8"
                    />
                  </div>

                  <div className="flex items-center gap-2 w-[20%]">
                    <Label className="whitespace-nowrap">Amount</Label>
                    <Input
                      value={fee.amount}
                      readOnly
                      className="bg-gray-100 h-8"
                    />
                  </div>

                  <div className="flex items-center gap-2 w-[25%]">
                    <Label className="whitespace-nowrap">Payment Type</Label>
                    <Input
                      value={fee.paymentType}
                      readOnly
                      className="bg-gray-100 h-8"
                    />
                  </div>

                  <div className="flex items-center gap-2 w-[24%]">
                    <Label className="whitespace-nowrap">Discount(%)</Label>
                    <Input
                      type="number"
                      value={fee.discount}
                      onChange={(e) => {
                        const raw = e.target.value;
                        if (raw === "") {
                          updateFee(fee.uid, "discount", "");
                          setError("");
                          return;
                        }
                        const val = Number(raw);
                        if (!isNaN(val)) {
                          if (val >= 0 && val <= 100) {
                            updateFee(fee.uid, "discount", val);
                            setError("");
                          } else {
                            setError("Discount must be between 0 and 100");
                          }
                        }
                      }}
                      placeholder="Discount %"
                      min="0"
                      max="100"
                      className={`h-8 ${error ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">
                No fee types available for this class
              </p>
            )}

            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="h-8 px-4"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!!error || loading}
              className="h-8 px-4"
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


