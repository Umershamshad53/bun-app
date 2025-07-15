/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { addStudentFeePayment } from "@/features/dashboard/actions/studentPaymentFee.Action";
import { toast } from "sonner";
import {
  AlertCircle,
  CheckCircle,
  CreditCard,
  DollarSign,
  FileText,
  Printer,
  Receipt,
  BadgeInfo,
  Banknote,
  Search,
  CalendarDays,
} from "lucide-react";
// import Image from "next/image";
import { getFees } from "@/features/dashboard/actions/feeAction";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/features/common/components/ui/table";
import { Badge } from "@/features/common/components/ui/badge";
import { Button } from "@/features/common/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/features/common/components/ui/card";
import { Checkbox } from "@/features/common/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/features/common/components/ui/dialog";
import { Input } from "@/features/common/components/ui/input";
import { Label } from "@/features/common/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/features/common/components/ui/select";
import { Separator } from "@/features/common/components/ui/separator";
import { getStudents } from "@/features/dashboard/actions/studentActions";
import { createStudentFeePayment } from "@/features/dashboard/actions/studentFeePaymentAction";
import { useRouter } from "next/navigation";

// Sample data
// const students = [
//   {
//     id: "STU001",
//     name: "Alice Johnson",
//     grade: "Grade 10",
//     class: "10-A",
//     photo: "/placeholder.svg?height=60&width=60",
//     balance: 850,
//     guardian: "Robert Johnson",
//     phone: "+1 (555) 123-4567",
//   },
//   {
//     id: "STU002",
//     name: "Bob Smith",
//     grade: "Grade 11",
//     class: "11-B",
//     photo: "/placeholder.svg?height=60&width=60",
//     balance: 150,
//     guardian: "Sarah Smith",
//     phone: "+1 (555) 234-5678",
//   },
//   {
//     id: "STU003",
//     name: "Carol Davis",
//     grade: "Grade 9",
//     class: "9-C",
//     photo: "/placeholder.svg?height=60&width=60",
//     balance: 300,
//     guardian: "Michael Davis",
//     phone: "+1 (555) 345-6789",
//   },
// ];

// const feeTypes = [
//   { id: "tuition", name: "Tuition Fee", amount: 500, required: true },
//   { id: "library", name: "Library Fee", amount: 50, required: false },
//   { id: "lab", name: "Laboratory Fee", amount: 100, required: false },
//   { id: "sports", name: "Sports Fee", amount: 75, required: false },
//   { id: "transport", name: "Transportation", amount: 125, required: false },
//   { id: "exam", name: "Examination Fee", amount: 25, required: false },
// ];

// const recentTransactions = [
//   {
//     id: "TXN001",
//     student: "Alice Johnson",
//     amount: 500,
//     type: "Tuition Fee",
//     method: "Cash",
//     time: "10:30 AM",
//     receipt: "R-2024-001",
//   },
//   {
//     id: "TXN002",
//     student: "Bob Smith",
//     amount: 150,
//     type: "Library Fee",
//     method: "Card",
//     time: "11:15 AM",
//     receipt: "R-2024-002",
//   },
//   {
//     id: "TXN003",
//     student: "Carol Davis",
//     amount: 200,
//     type: "Lab Fee",
//     method: "Cash",
//     time: "12:00 PM",
//     receipt: "R-2024-003",
//   },
// ];
interface Transaction {
  id: string;
  student: string;
  studentId: number;
  fees: Fee[];
  amount: number;
  discount: number;
  method: string;
  date: string;
  time: string;
  receipt: string;
  status: string; // required property
}

interface Student {
  id: number;
  fullName: string;
  age?: number;
  photo?: string;
  grade?: string;
  class?: string;
  guardianName?: string;
  balance?: number;
  gradeInfo?: { value: string };
  classInfo?: { value: string };
  outstandingBalance?: number; // Added to fix compile error
}

interface Fee {
  id: string;
  feeName: string;
  feeAmount: number;
  required: boolean;
  dueDate?: string;
  customAmount?: number;
  feeType?: string;
  discount?: number;
}
interface Student {
  id: number;
}

type StudentFeePaymentData = {
  studentId: number;
  amountPaid: number;
  paymentDate: string;
};

interface FeeBreakdownItem {
  name: string;
  amount: number;
  discount: number;
  finalAmount: number;
}
type StudentFeeData = {
  id: number;
  amount: number;
  date: string;
  month: string; // Added to match usage in code
  paidAmount?: number; // Optionally add if used elsewhere
  status?: string; // Optionally add if used elsewhere
  dueDate?: string; // Optionally add if used elsewhere
  fineAmount?: number; // Added to fix compile error
  feeBreakdown?: FeeBreakdownItem[];
  studentId: number; // Added to fix compile error
  discount?: number; // Added to fix compile error for discount
  studentFeeId?: number; // Added to fix compile error for studentFeeId
  // aur fields jo response me aati hain
};

type StudentFeePaymentResponse =
  | { success: true; message: string; data: StudentFeeData[] }
  | { success: false; message: string; data?: undefined };

type FeePaymentPayload = {
  studentId: number;
  feeRecordId: number;
  paymentDate: string;
  paymentMethod: string;
  feeTypes: {
    name: string;
    amount: number;
  }[];
  discount: number;
};

export default function FeeCollectionPage() {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedFees, setSelectedFees] = useState<Fee[]>([]);
  const [feeTypes, setFeeTypes] = useState<Fee[]>([]);
  const [feesLoading, setFeesLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("");
  const router = useRouter();

  const [lastReceiptNo, setLastReceiptNo] = useState<string | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [discount, setDiscount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [showReceipt, setShowReceipt] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [baseAmount, setBaseAmount] = useState<number>(0);
  const [feeRecordId, setFeeRecordId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [studentFeePaymentResponse, setStudentFeePaymentResponse] =
    useState<StudentFeePaymentResponse | null>(null);

  console.log(studentFeePaymentResponse, "StudentFeePaymentRes");

  console.log(feeTypes, "FeeTypes");

  const [loading, setLoading] = useState(false);
  console.log(customAmount);

  const [currentTransaction, setCurrentTransaction] =
    useState<Transaction | null>(null);
  // const filteredStudents = students.filter(
  //   (student) => student.name.toLowerCase().includes(searchQuery.toLowerCase()) || student.id.toLowerCase().includes(searchQuery.toLowerCase()),
  // );

  // const handleFeeSelection = (fee: Fee, checked: boolean) => {
  //   if (checked) {
  //     setSelectedFees([...selectedFees, { ...fee, customAmount: fee.feeAmount }]);
  //   } else {
  //     setSelectedFees(selectedFees.filter((f) => f.id !== fee.id));
  //   }
  // };

  // const updateFeeAmount = (feeId: string, amount: number) => {
  //   setSelectedFees(selectedFees.map((fee) => (fee.id === feeId ? { ...fee, customAmount: amount } : fee)));
  // };
  const totalAmount = (selectedFees ?? []).reduce(
    (sum, fee) => sum + (fee.customAmount ?? 0),
    0
  );

  // const totalAmount = selectedFees.reduce((sum, fee) => sum + (fee.customAmount ?? 0), 0);

  const finalAmount = totalAmount - discount;

  const processPayment = () => {
    if (!selectedStudent) {
      throw new Error("No student selected");
    }

    const transaction = {
      id: `TXN${Date.now()}`,
      student: selectedStudent.fullName,
      studentId: selectedStudent.id,
      fees: selectedFees,
      amount: finalAmount,
      discount: discount,
      method: paymentMethod,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      receipt: `R-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
      status: "pending",
    };

    setCurrentTransaction(transaction);

    setShowReceipt(true);

    setSelectedStudent(null);
    setSelectedFees([]);
    setPaymentMethod("");
    setDiscount(0);
    setCustomAmount("");
  };

  // useEffect(() => {
  //   const delayDebounce = setTimeout(() => {
  //     const fetchStudents = async () => {
  //       if (!searchQuery.trim()) {
  //         setStudents([]);
  //         return;
  //       }

  //       setLoading(true);
  //       const res = await getStudents(searchQuery);
  //       if (res?.success) {
  //         setStudents(res.data);
  //       } else {
  //         setStudents([]);
  //       }
  //       setLoading(false);
  //     };

  //     fetchStudents();
  //   }, 500);

  //   return () => clearTimeout(delayDebounce);
  // }, [searchQuery]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const fetchStudents = async () => {
        if (!searchQuery.trim()) {
          setStudents([]);
          return;
        }

        setLoading(true);
        const res = await getStudents(searchQuery, 1);

        if (res?.success && res.data && Array.isArray(res.data.students)) {
          setStudents(res.data.students);
        } else {
          setStudents([]);
        }
        setLoading(false);
      };

      fetchStudents();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);
  // Optional: Reset page when searchQuery changes

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    const fetchFees = async () => {
      setFeesLoading(true);
      const res = await getFees("Annual");
      if (res.success) {
        setFeeTypes(res.data);
      } else {
        console.error("Failed to fetch fees:", res.message);
        setFeeTypes([]);
      }
      setFeesLoading(false);
    };

    fetchFees();
  }, []);

  const handleFeeToggle = (fee: Fee, checked: boolean) => {
    if (checked) {
      setSelectedFees([
        ...selectedFees,
        { ...fee, customAmount: fee.feeAmount },
      ]);
    } else {
      setSelectedFees(selectedFees.filter((f) => f.id !== fee.id));
    }
  };

  const additionalAmount = selectedFees.reduce(
    (sum, fee) => sum + (fee.customAmount ?? 0),
    0
  );

  const totalWithBaseAmount = baseAmount + additionalAmount;

  //   const totalAmount = selectedFees.reduce((sum, fee) => sum + (fee.customAmount ?? 0), 0);
  //   const finalAmount = totalAmount - discount;

  const handleStudentClick = async (student: Student | undefined) => {
    console.log('handleStudentClick called with:', student);
    if (!student || typeof student.id === 'undefined') {
      toast.error("Invalid student selected.");
      return;
    }
    setSelectedStudent(student);
    setLoading(true);

    const res = await createStudentFeePayment(Number(student.id));

    if (res.success && res.data) {
      const feeData = Array.isArray(res.data) ? res.data[0] : res.data;

      // Ensure the feeData has studentId property
      const feeDataWithStudentId = {
        ...feeData,
        studentId: student.id
      };

      setStudentFeePaymentResponse({
        success: true,
        message:
          typeof res.message === "string" ? res.message : "Payment successful",
        data: [feeDataWithStudentId],
      });

      setFeeRecordId(feeData.id);
      setBaseAmount(feeData.amount ?? 0);
    } else {
      setStudentFeePaymentResponse({
        success: false,
        message:
          typeof res.message === "string"
            ? res.message
            : "Something went wrong",
      });
    }

    setLoading(false);
  };

  useEffect(() => {
    if (
      studentFeePaymentResponse?.success &&
      studentFeePaymentResponse.data?.length > 0
    ) {
      const amountFromAPI = studentFeePaymentResponse.data[0]?.amount ?? 0;

      setBaseAmount(amountFromAPI);
    }
  }, [studentFeePaymentResponse]);

  // const handleFeePay = async () => {
  //   if (!selectedStudent) {
  //     toast.error("Please select a student first!");
  //     return;
  //   }

  //   if (feeRecordId === null) {
  //     toast.error("Fee record ID is missing!");
  //     return;
  //   }

  //   if (selectedFees.length === 0) {
  //     toast.error("Please select at least one fee type!");
  //     return;
  //   }

  //   try {
  //     setLoading(true);

  //     const currentFeeRecord = studentFeePaymentResponse?.data?.find(
  //       (r) => r.studentId === selectedStudent.id
  //     );

  //     if (!currentFeeRecord) {
  //       toast.error("Fee record not found!");
  //       return;
  //     }

  //     const feeBreakdown = JSON.parse(currentFeeRecord.feeBreakdown || "[]");
  //        const feeBreak = feeBreakdown.
  //     // const feeTypes = feeBreakdown.map((item) => {

  //     //   return {
  //     //     name: item.name,
  //     //     amount: item.amount,
  //     //     discount: item.discount || 0,
  //     //     finalAmount: item.finalAmount || item.amount,
  //     //     type:"Monthly",
  //     //   };
  //     // });

  //     const feeTypes = selectedFees.map((fee) => ({
  //       name: fee.feeName,
  //       amount: fee.feeAmount,
  //       type: fee.feeType || "Additional",
  //     }));

  //     // ✅ Final totals
  //     const finalTotal = feeBreakdown.reduce((sum, item) => sum + (item.finalAmount || 0), 0);
  //     const totalDiscount = feeBreakdown.reduce((sum, item) => sum + (item.discount || 0), 0);

  //     const payload = {
  //       studentId: Number(selectedStudent.id),
  //       feeRecordId,
  //       paymentDate: new Date().toISOString(),
  //       paymentMethod: paymentMethod || "Cash",
  //       amount: finalTotal,
  //       discount: totalDiscount,
  //       feeTypes,
  //       feeBreakdown,
  //     };

  //     console.log("📦 Sending final payload:", payload);

  //     const response = await addStudentFeePayment(payload);

  //     if (response.success) {
  //       const paymentData = response.data?.data?.[0] || response.data;

  //       setStudentFeePaymentResponse((prev) => ({
  //         success: true,
  //         message: response.message || "Payment successful",
  //         data: [
  //           ...(prev?.data || []),
  //           {
  //             ...paymentData,
  //             studentId: selectedStudent.id,
  //             feeBreakdown: JSON.stringify(feeBreakdown),
  //             feeTypes: JSON.stringify(feeTypes),
  //             status: "paid",
  //             paidAmount: finalTotal,
  //             paymentDate: new Date().toISOString(),
  //           },
  //         ],
  //       }));

  //       toast.success(`Payment of Rs ${finalTotal} processed successfully!`);

  //       // Reset UI
  //       setSelectedFees([]);
  //       setPaymentMethod("");
  //       setDiscount(0);
  //       setCustomAmount("");
  //       processPayment();
  //     } else {
  //       toast.error(`Payment failed: ${response.message || "Unknown error"}`);
  //     }
  //   } catch (error) {
  //     console.error("Payment error:", error);
  //     toast.error("Something went wrong while processing the payment.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleFeePay = async () => {
    if (!selectedStudent) {
      toast.error("Please select a student first!");
      return;
    }

    if (feeRecordId === null) {
      toast.error("Fee record ID is missing!");
      return;
    }

    // if (selectedFees.length === 0) {
    //   toast.error("Please select at least one fee type!");
    //   return;
    // }

    try {
      setLoading(true);

      const currentFeeRecord = studentFeePaymentResponse?.data?.find(
        (r) => r && r.studentId === Number(selectedStudent.id)
      );

      if (!currentFeeRecord) {
        toast.error("Fee record not found!");
        return;
      }
      // Prevent payment if all fees are already paid
      let feeBreakdownArr = currentFeeRecord.feeBreakdown;
      if (typeof feeBreakdownArr === 'string') {
        try { feeBreakdownArr = JSON.parse(feeBreakdownArr); } catch { feeBreakdownArr = []; }
      }
      const unpaidTotal = (feeBreakdownArr || []).reduce((sum, item) => sum + (item.finalAmount || 0), 0);
      if (unpaidTotal === 0) {
        toast.error("All fees are already paid. No payment required.");
        setLoading(false);
        return;
      }
      console.log(
        "currentFeeRecord.feeBreakdown",
        currentFeeRecord.feeBreakdown
      );

      // You can map it if needed in future:
      // const feeBreak = feeBreakdown.map(item => ({
      //   ...item,
      //   type: "Monthly"
      // }));

      const feeTypes = selectedFees.map((fee) => ({
        name: fee.feeName,
        amount: fee.feeAmount,
        type: fee.feeType || "Additional",
      }));
      const feeBreakdown = currentFeeRecord.feeBreakdown;

      const finalTotal = (feeBreakdown as FeeBreakdownItem[]).reduce(
        (sum: number, item: FeeBreakdownItem) => sum + (item.finalAmount || 0),
        0
      );
      const totalDiscount = (feeBreakdown as FeeBreakdownItem[]).reduce(
        (sum: number, item: FeeBreakdownItem) => sum + (item.discount || 0),
        0
      );

      const payload = {
        studentId: Number(selectedStudent.id),
        feeRecordId,
        paymentDate: new Date().toISOString(),
        paymentMethod: paymentMethod || "Cash",
        amount: finalTotal,
        discount: totalDiscount,
        feeTypes,
        feeBreakdown: (feeBreakdown || []).map((item) => ({
          ...item,
          type: "Monthly",
        })),
      };

      console.log("📦 Sending final payload:", payload);

      const response = await addStudentFeePayment(payload);
      if (response.success) {
        const receiptNo = response?.data?.receiptNo;
        setLastReceiptNo(receiptNo); // ✅ this line MUST be here

        // ...rest of your success logic
      }

      if (response.success) {
        const paymentData = response.data?.data?.[0] || response.data;

        setStudentFeePaymentResponse((prev) => ({
          success: true,
          message: response.message || "Payment successful",
          data: [
            ...(prev?.data || []),
            {
              ...paymentData,
              studentId: selectedStudent.id,
              feeBreakdown: JSON.stringify(feeBreakdown),
              feeTypes: JSON.stringify(feeTypes),
              status: "paid",
              paidAmount: finalTotal,
              paymentDate: new Date().toISOString(),
            },
          ],
        }));

        toast.success(`Payment of Rs ${finalTotal} processed successfully!`);

        // Reset UI
        setSelectedFees([]);
        setPaymentMethod("");
        setDiscount(0);
        setCustomAmount("");
        processPayment();
      } else {
        toast.error(`Payment failed: ${response.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Payment error:........", error);
      toast.error("Something went wrong while processing the payment.");
    } finally {
      setLoading(false);
    }
  };

  const goToPrint = (receiptNo: string | null) => {
    if (!receiptNo) {
      console.warn("No receipt number provided.");
      return;
    }
    router.push(`/printReceipt?receiptNo=${receiptNo}`);
  };

  const goToPrintt = (receiptNo: string) => {
    router.push(`/printReceiptA4?receiptNo=${receiptNo}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fee Collection</h1>
          <p className="text-gray-600">
            Process student fee payments and generate receipts
          </p>
        </div>
        {/* <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Daily Report
          </Button>
          <Button variant="outline">
            <Receipt className="h-4 w-4 mr-2" />
            
            Receipt History
          </Button>
        </div> */}
      </div>

      {/* Quick Stats */}
      {/* <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today&apos;s Collection</CardTitle>

            <DollarSign className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$8,450</div>
            <p className="text-xs text-emerald-600">+15% from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <Receipt className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-blue-600">23 cash, 24 card</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,300</div>
            <p className="text-xs text-orange-600">89 students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Payment</CardTitle>
            <CreditCard className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$180</div>
            <p className="text-xs text-purple-600">Per transaction</p>
          </CardContent>
        </Card>
      </div> */}

      <div className="grid gap-6 lg:grid-cols-1">
        {/* Payment Processing */}
        <div className="lg:col-span-12 space-y-6">
          {/* Student Search */}
          {/* <Card>
            <CardHeader>
              <CardTitle>Select Student</CardTitle>
              <CardDescription>Search and select a student to process payment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input placeholder="Search by name or student ID..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </div>

                {searchQuery && (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {filteredStudents.map((student) => (
                      <div
                        key={student.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedStudent?.id === student.id ? "border-emerald-500 bg-emerald-50" : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setSelectedStudent(student)}
                      >
                        <div className="flex items-center gap-3">
                          <Image
                            src={student.photo || "/placeholder.svg"}
                            alt={student.name}
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className="font-medium">{student.name}</div>
                            <div className="text-sm text-gray-500">
                              {student.id} • {student.grade} • {student.class}
                            </div>
                            <div className="text-sm text-gray-500">Guardian: {student.guardian}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-500">Outstanding</div>
                            <div className="font-medium text-red-600">${student.balance}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {selectedStudent && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Image
                        src={selectedStudent.photo || "/placeholder.svg"}
                        alt={selectedStudent.name}
                        width={48}
                        height={48}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{selectedStudent.name}</h3>
                        <p className="text-gray-600">
                          {selectedStudent.id} • {selectedStudent.grade} • {selectedStudent.class}
                        </p>
                        <p className="text-sm text-gray-500">Guardian: {selectedStudent.guardian}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Outstanding Balance</div>
                        <div className="text-xl font-bold text-red-600">${selectedStudent.balance}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card> */}
          <Card>
            <CardHeader>
              <CardTitle>Select Student</CardTitle>
              <CardDescription>
                Search and select a student to process payment
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search by name or student ID..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Students List */}
                {searchQuery.trim() && (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {loading ? (
                      <div className="text-center text-gray-500">
                        Loading students...
                      </div>
                    ) : students.length > 0 ? (
                      students.filter(Boolean).map((student) => (
                        student && (
                          <div
                            key={student.id}
                            className={`p-3 border rounded-lg cursor-pointer transition-colors ${selectedStudent?.id === student.id
                              ? "border-emerald-500 bg-emerald-50"
                              : "border-gray-200 hover:border-gray-300"
                              }`}
                            onClick={() => handleStudentClick(student)}
                          >
                            <div className="flex items-center gap-3">
                              {/* <Image
                        src={student.photo || "/placeholder.svg"}
                        alt={student.fullName}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full object-cover"
                      /> */}
                              <div className="flex-1">
                                <div className="font-medium">
                                  {student.fullName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {student.id} •{" "}
                                  {student.gradeInfo?.value || "No Grade Info"} •{" "}
                                  {student.classInfo?.value || "No Class Info"}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {student.guardianName}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm text-gray-500">
                                  Outstanding
                                </div>
                                <div className="font-medium text-red-600">
                                  Rs {student.outstandingBalance}
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      ))
                    ) : (
                      <div className="text-center text-gray-500">
                        No students found
                      </div>
                    )}
                  </div>
                )}

                {/* Selected Student Info */}
                {/* {selectedStudent && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
              <div className="flex items-center gap-3">
                <Image
                  src={selectedStudent.photo || "/placeholder.svg"}
                  alt={selectedStudent.fullName}
                  width={48}
                  height={48}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">
                    {selectedStudent.fullName}
                  </h3>
                  <p className="text-gray-600">
                    {selectedStudent.id} • {selectedStudent.grade} •{" "}
                    {selectedStudent.class}
                  </p>
                  <p className="text-sm text-gray-500">
                    Guardian: {selectedStudent.guardianName}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Outstanding Balance</div>
                  <div className="text-xl font-bold text-red-600">
                    ${selectedStudent.balance}
                  </div>
                </div>
              </div>
            </div>
          )} */}
              </div>
            </CardContent>
          </Card>
          {/* Fee Selection */}

          {selectedStudent && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
              <span className="font-semibold text-blue-900">Outstanding Balance:</span>
              <span className="text-xl font-bold text-blue-700">Rs {selectedStudent.outstandingBalance ?? 0}</span>
            </div>
          )}
          {selectedStudent && studentFeePaymentResponse && Array.isArray(studentFeePaymentResponse.data) && studentFeePaymentResponse.data.length > 0 && (
            <section className="bg-gradient-to-br from-[#ecfdf5] via-white to-[#f0f9ff] p-6 my-6 rounded-2xl border border-[#d1fae5] shadow-lg">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-2">
                <h2 className="text-2xl font-bold text-emerald-900">
                  📊 Fee Payment Summary for {selectedStudent.fullName}
                </h2>
              </div>
              {/* Unified Fee Table */}
              <Table className="w-full border border-gray-200 rounded-xl overflow-hidden shadow-sm mb-6">
                <TableHeader className="bg-gradient-to-r from-emerald-100 to-white">
                  <TableRow>
                    <TableHead className="w-[50px] text-center text-gray-600 font-semibold">Select</TableHead>
                    <TableHead className="text-gray-700 text-sm font-semibold">Fee Name</TableHead>
                    <TableHead className="text-gray-700 text-sm font-semibold">Amount (Rs)</TableHead>
                    <TableHead className="text-gray-700 text-sm font-semibold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-gray-100 bg-white">
                  {(() => {
                    // Gather all unpaid and paid fees for the student
                    const feeData = studentFeePaymentResponse && Array.isArray(studentFeePaymentResponse.data)
                      ? studentFeePaymentResponse.data.find((item: { studentId: number }) => item && item.studentId === selectedStudent.id)
                      : undefined;
                    let breakdown: FeeBreakdownItem[] = [];
                    try {
                      if (typeof feeData?.feeBreakdown === 'string') {
                        breakdown = JSON.parse(feeData.feeBreakdown) as FeeBreakdownItem[];
                      } else if (Array.isArray(feeData?.feeBreakdown)) {
                        breakdown = feeData.feeBreakdown as FeeBreakdownItem[];
                      }
                    } catch { breakdown = []; }
                    // --- Merge all possible fee types with the student's breakdown ---
                    console.log('feeTypes', feeTypes);
                    console.log('breakdown', breakdown);
                    const mergedFees: FeeBreakdownItem[] = (feeTypes || [])
                      .filter((feeType) => feeType !== null)
                      .map((feeType) => {
                        const found = breakdown.find((b) => b && b.name === feeType.feeName);
                        if (found) {
                          return found;
                        }
                        return {
                          name: feeType.feeName,
                          amount: feeType.feeAmount,
                          discount: 0,
                          finalAmount: feeType.feeAmount,
                        };
                      });
                    // Fallback: if outstanding balance is not represented, add a row for it
                    if (
                      selectedStudent &&
                      typeof selectedStudent.outstandingBalance === 'number' &&
                      selectedStudent.outstandingBalance > 0 &&
                      !mergedFees.some(fee => fee.finalAmount === selectedStudent.outstandingBalance)
                    ) {
                      mergedFees.push({
                        name: 'Outstanding Fee',
                        amount: selectedStudent.outstandingBalance,
                        discount: 0,
                        finalAmount: selectedStudent.outstandingBalance,
                      });
                    }
                    return mergedFees.map((fee: FeeBreakdownItem, i: number) => {
                      const isPaid = fee.finalAmount === 0;
                      const feeKey = typeof fee.name === 'string' && fee.name ? fee.name : '';
                      if (!feeKey) return null;
                      return (
                        <TableRow key={i} className={isPaid ? 'bg-gray-50' : ''}>
                          <TableCell className="text-center">
                            <Checkbox
                              checked={selectedFees.some(f => f.feeName === feeKey)}
                              onCheckedChange={checked => {
                                if (isPaid || !feeKey) return;
                                if (checked) {
                                  setSelectedFees(prev => [...prev, { id: feeKey, name: feeKey, feeName: feeKey, feeAmount: fee.finalAmount, required: false, customAmount: fee.finalAmount }]);
                                } else {
                                  setSelectedFees(prev => prev.filter(f => f.feeName !== feeKey));
                                }
                              }}
                              disabled={isPaid}
                            />
                          </TableCell>
                          <TableCell className="text-gray-800 font-medium">{feeKey}</TableCell>
                          <TableCell className="text-gray-700">Rs {fee.finalAmount}</TableCell>
                          <TableCell className={isPaid ? 'text-green-600' : 'text-red-600'}>
                            {isPaid ? 'Paid' : 'Unpaid'}
                          </TableCell>
                        </TableRow>
                      );
                    }).filter(Boolean);
                  })()}
                </TableBody>
              </Table>
              {/* Unified Payment Summary */}
              {selectedFees.length > 0 && (
                <div className="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                  <h4 className="font-medium mb-2">Selected Fees:</h4>
                  {selectedFees.map(fee => (
                    <div key={fee.id} className="flex justify-between text-sm">
                      <span>{fee.feeName}</span>
                      <span>Rs {fee.customAmount}</span>
                    </div>
                  ))}
                  <Separator className="my-2" />
                  <div className="flex justify-between font-medium">
                    <span>Subtotal:</span>
                    <span>Rs {selectedFees.reduce((sum, fee) => sum + (fee.customAmount || 0), 0)}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <Label htmlFor="discount">Discount:</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="discount"
                        type="number"
                        className="w-20"
                        value={discount}
                        onChange={e => setDiscount(Number.parseInt(e.target.value) || 0)}
                      />
                      <span className="text-sm text-gray-500">Rs</span>
                    </div>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount:</span>
                    <span className="text-emerald-600">Rs{selectedFees.reduce((sum, fee) => sum + (fee.customAmount || 0), 0) - discount}</span>
                  </div>
                  <div className="space-y-2 mt-4">
                    <Label>Payment Method</Label>
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="card">Credit/Debit Card</SelectItem>
                        <SelectItem value="check">Check</SelectItem>
                        <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    className="w-full bg-emerald-600 hover:bg-emerald-700 mt-4"
                    size="lg"
                    onClick={processPayment}
                    disabled={!paymentMethod || selectedFees.reduce((sum, fee) => sum + (fee.customAmount || 0), 0) - discount <= 0}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Process Payment - Rs{selectedFees.reduce((sum, fee) => sum + (fee.customAmount || 0), 0) - discount}
                  </Button>
                </div>
              )}
            </section>
          )}

          {/* Recent Transactions */}
          {/* <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>{"Today's payment activities"}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{transaction.student}</div>
                      <div className="text-xs text-gray-500">{transaction.type}</div>
                      <div className="text-xs text-gray-500">{transaction.time}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-emerald-600">${transaction.amount}</div>
                      <div className="text-xs text-gray-500">{transaction.method}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Receipt className="h-4 w-4 mr-2" />
                  Print Last Receipt
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  View Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        </div> */}
        </div>

        {/* Receipt Dialog */}
        <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Payment Successful
              </DialogTitle>
              <DialogDescription>
                Payment has been processed successfully
              </DialogDescription>
            </DialogHeader>

            {currentTransaction && (
              <div className="space-y-4">
                {/* Receipt */}
                <div className="p-4 border rounded-lg bg-gray-50">
                  <div className="text-center mb-4">
                    <h3 className="font-bold">School Fee Receipt</h3>
                    <p className="text-sm text-gray-600">
                      Receipt #{currentTransaction.receipt}
                    </p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Student:</span>
                      <span>{currentTransaction.student}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Student ID:</span>
                      <span>{currentTransaction.studentId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Date:</span>
                      <span>{currentTransaction.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time:</span>
                      <span>{currentTransaction.time}</span>
                    </div>

                    <Separator className="my-2" />

                    <div className="space-y-1">
                      {currentTransaction.fees.map((fee: Fee) => (
                        <div key={fee.id} className="flex justify-between">
                          <span>{fee.feeName}:</span>
                          <span>${fee.customAmount}</span>
                        </div>
                      ))}
                    </div>

                    {currentTransaction.discount > 0 && (
                      <div className="flex justify-between text-red-600">
                        <span>Discount:</span>
                        <span>-${currentTransaction.discount}</span>
                      </div>
                    )}

                    <Separator className="my-2" />

                    <div className="flex justify-between font-bold">
                      <span>Total Paid:</span>
                      <span>${currentTransaction.amount}</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Payment Method:</span>
                      <span className="capitalize">
                        {currentTransaction.method}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => lastReceiptNo && goToPrintt(lastReceiptNo)}
                  >
                    <Printer className="h-4 w-4 mr-2" />
                    Print A4
                  </Button>

                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => lastReceiptNo && goToPrint(lastReceiptNo)}
                  >
                    <Printer className="h-4 w-4 mr-2" />
                    Print Thermal
                  </Button>

                  {/* <Button onClick={() => goToPrint(lastReceiptNo)}>Print</Button> */}
                </div>
                <div className="flex justify-center items-center">
                  <Button
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 "
                    onClick={() => setShowReceipt(false)}
                  >
                    Done
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}