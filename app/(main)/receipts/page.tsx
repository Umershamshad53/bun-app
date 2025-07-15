"use client";

import { format } from "date-fns";
import {
  CalendarIcon,
  // CheckCircle,
  // Clock,
  CreditCard,
  // DollarSign,
  Eye,
  MoreHorizontal,
  Receipt,
  RefreshCw,
  Search,
  XCircle,
} from "lucide-react";
import type { DateRange } from "react-day-picker";

import { useState, useEffect } from "react";

import { getAllReceipts } from "@/features/dashboard/actions/receiptActions";
import { Badge } from "@/features/common/components/ui/badge";
import { Button } from "@/features/common/components/ui/button";
import { Calendar } from "@/features/common/components/ui/calendar";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/features/common/components/ui/popover";

import { Separator } from "@/features/common/components/ui/separator";
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
  // TabsList,
  // TabsTrigger,
} from "@/features/common/components/ui/tabs";

const statusColors = {
  Paid: "bg-green-100 text-green-800",
  Pending: "bg-yellow-100 text-yellow-800",
  Refunded: "bg-blue-100 text-blue-800",
  Cancelled: "bg-red-100 text-red-800",
};

// const statusIcons = {
//   Paid: CheckCircle,
//   Pending: Clock,
//   Refunded: RefreshCw,
//   Cancelled: XCircle,
// };

// Transform API data to match the Receipt interface
const transformApiData = (apiData: unknown[]): Receipt[] => {
  return apiData.map((payment: unknown) => {
    const paymentData = payment as {
      id: number;
      fbrInvoiceNo?: string;
      studentId: number;
      amount: number;
      paymentMethod?: string;
      paidAt: string;
      feeType?: string;
      student?: {
        rollNo?: string;
        fullName?: string;
        grade?: number;
      };
    };

    const student = paymentData.student;
    const paidAt = new Date(paymentData.paidAt);

    return {
      id: paymentData.fbrInvoiceNo || `R-${paymentData.id}`,
      studentId: student?.rollNo || `STU${paymentData.studentId}`,
      studentName: student?.fullName || "Unknown Student",
      grade: `Grade ${student?.grade || "N/A"}`,
      amount: paymentData.amount,
      fees: [
        {
          name: paymentData.feeType || "Fee Payment",
          amount: paymentData.amount,
        },
      ],
      paymentMethod: paymentData.paymentMethod || "Cash",
      status: "Paid", // Assuming all payments in the database are paid
      date: format(paidAt, "yyyy-MM-dd"),
      time: format(paidAt, "hh:mm a"),
      cashier: "System", // Default value since this might not be in the API
      discount: 0, // Default value
      notes: "",
    };
  });
};

interface Fee {
  name: string;
  amount: number;
}

interface Receipt {
  id: string;
  studentId: string;
  studentName: string;
  grade: string;
  amount: number;
  fees: Fee[];
  paymentMethod: string;
  status: string;
  date: string;
  time: string;
  cashier: string;
  discount: number;
  notes: string;
  imageUrl?: string;
}

export default function ReceiptsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  // const [statusFilter, setStatusFilter] = useState("all");
  // const [paymentMethodFilter, setPaymentMethodFilter] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const [showReceiptDetail, setShowReceiptDetail] = useState(false);

  // New state for API data
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch receipts on component mount
  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getAllReceipts();
        console.log("resultresultresultresultresult", result);

        if (result.success && result.data) {
          const transformedReceipts = transformApiData(
            result.data.data || result.data,
          );
          setReceipts(transformedReceipts);
        } else {
          setError(result.message || "Failed to fetch receipts");
        }
      } catch (err) {
        setError("An unexpected error occurred while fetching receipts");
        console.error("Error fetching receipts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReceipts();
  }, []);

  const filteredReceipts = receipts.filter((receipt) => {
    const matchesSearch =
      receipt.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      receipt.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      receipt.studentId.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  const totalAmount = filteredReceipts.reduce(
    (sum, receipt) => sum + receipt.amount,
    0,
  );
  const paidReceipts = filteredReceipts.filter((r) => r.status === "Paid");
  // const pendingReceipts = filteredReceipts.filter(
  //   (r) => r.status === "Pending",
  // );

  const handleReceiptView = (receipt: Receipt) => {
    setSelectedReceipt(receipt);
    setShowReceiptDetail(true);
  };

  // const handleReceiptPrint = (receipt: Receipt) => {
  //   // Print functionality would be implemented here
  //   console.log("Printing receipt:", receipt.id);
  // };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Receipts</h1>
            <p className="text-gray-600">
              Manage and track all payment receipts
            </p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(receipts.length || 4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="h-96 bg-gray-200 rounded animate-pulse" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Receipts</h1>
            <p className="text-gray-600">
              Manage and track all payment receipts
            </p>
          </div>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <XCircle className="h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Error Loading Receipts
            </h3>
            <p className="text-gray-600 text-center mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Receipts</h1>
          <p className="text-gray-600">Manage and track all payment receipts</p>
        </div>
        {/* <div className="flex gap-2"> */}
        {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => exportReceipts("pdf")}>
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportReceipts("excel")}>
                Export as Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportReceipts("csv")}>
                Export as CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
        {/* </div> */}
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Receipts
            </CardTitle>
            <Receipt className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredReceipts.length}</div>
            {/* <p className="text-xs text-emerald-600">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12% from last week
            </p> */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Rs. {totalAmount.toLocaleString()}
            </div>
            <p className="text-xs text-blue-600">
              {paidReceipts.length} paid receipts
            </p>
          </CardContent>
        </Card>

        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Payments
            </CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingReceipts.length}</div>
            <p className="text-xs text-orange-600">
              $
              {pendingReceipts
                .reduce((sum, r) => sum + r.amount, 0)
                .toLocaleString()}{" "}
              pending
            </p>
          </CardContent>
        </Card> */}

        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredReceipts.length > 0
                ? Math.round(
                    (paidReceipts.length / filteredReceipts.length) * 100
                  )
                : 0}
              %
            </div>
            <p className="text-xs text-green-600">Payment success rate</p>
          </CardContent>
        </Card> */}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Receipt Management</CardTitle>
          <CardDescription>
            Search, filter, and manage payment receipts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by receipt ID, student name, or student ID..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            {/* <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select> */}

            {/* Payment Method Filter */}
            {/* <Select
              value={paymentMethodFilter}
              onValueChange={setPaymentMethodFilter}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Payment Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="bank transfer">Bank Transfer</SelectItem>
                <SelectItem value="check">Check</SelectItem>
              </SelectContent>
            </Select> */}

            {/* Date Range */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-60 justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>S.No</TableHead>
                  <TableHead>Receipt ID</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Cashier</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReceipts.map((receipt, index) => {
                  // const StatusIcon =
                  //   statusIcons[receipt.status as keyof typeof statusIcons];
                  return (
                    <TableRow key={receipt.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <div className="font-medium">{receipt.id}</div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {receipt.studentName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {receipt.studentId} • {receipt.grade}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">Rs. {receipt.amount}</div>
                        {receipt.discount > 0 && (
                          <div className="text-sm text-green-600">
                            Discount: Rs. {receipt.discount}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-gray-400" />
                          {receipt.paymentMethod}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div>
                          <div className="text-sm">{receipt.date}</div>
                          <div className="text-sm text-gray-500">
                            {receipt.time}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{receipt.cashier}</div>
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
                              onClick={() => handleReceiptView(receipt)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>

                            {receipt.status === "Pending" && (
                              <DropdownMenuItem>
                                <XCircle className="mr-2 h-4 w-4" />
                                Cancel Receipt
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {filteredReceipts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Receipt className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No receipts found matching your criteria</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Receipt Detail Dialog */}
      <Dialog open={showReceiptDetail} onOpenChange={setShowReceiptDetail}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Receipt Details</DialogTitle>
            <DialogDescription>
              Complete receipt information and transaction details
            </DialogDescription>
          </DialogHeader>

          {selectedReceipt && (
            <Tabs defaultValue="receipt" className="w-full">
              {/* <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="receipt">Receipt View</TabsTrigger>
                <TabsTrigger value="details">Transaction Details</TabsTrigger>
              </TabsList> */}

              <TabsContent value="receipt" className="space-y-4">
                <div
                  className="p-6 border rounded-lg bg-white"
                  style={{ fontFamily: "monospace" }}
                >
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-bold">SCHOOL FEE RECEIPT</h2>
                    <p className="text-sm text-gray-600">
                      Official Payment Receipt
                    </p>
                    <div className="mt-2 pt-2 border-t border-dashed">
                      <p className="font-bold">Receipt #{selectedReceipt.id}</p>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <strong>Student Name:</strong>
                        <br />
                        {selectedReceipt.studentName}
                      </div>
                      <div>
                        <strong>Student ID:</strong>
                        <br />
                        {selectedReceipt.studentId}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <strong>Grade:</strong>
                        <br />
                        {selectedReceipt.grade}
                      </div>
                      <div>
                        <strong>Date & Time:</strong>
                        <br />
                        {selectedReceipt.date} {selectedReceipt.time}
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div>
                      <strong>Fee Details:</strong>
                      <div className="mt-2 space-y-1">
                        {selectedReceipt.fees.map((fee: Fee, index: number) => (
                          <div key={index} className="flex justify-between">
                            <span>{fee.name}</span>
                            <span>${fee.amount}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>
                          ${selectedReceipt.amount + selectedReceipt.discount}
                        </span>
                      </div>
                      {selectedReceipt.discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount:</span>
                          <span>-${selectedReceipt.discount}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold text-lg border-t pt-2">
                        <span>Total Paid:</span>
                        <span>${selectedReceipt.amount}</span>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <strong>Payment Method:</strong>
                        <br />
                        {selectedReceipt.paymentMethod}
                      </div>
                      <div>
                        <strong>Processed By:</strong>
                        <br />
                        {selectedReceipt.cashier}
                      </div>
                    </div>

                    {selectedReceipt.notes && (
                      <div>
                        <strong>Notes:</strong>
                        <br />
                        {selectedReceipt.notes}
                      </div>
                    )}

                    <div className="text-center mt-6 pt-4 border-t border-dashed text-xs text-gray-500">
                      <p>Thank you for your payment!</p>
                      <p>Keep this receipt for your records</p>
                      <p>For inquiries, contact the school office</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {/* <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleReceiptPrint(selectedReceipt)}
                  >
                    <Printer className="h-4 w-4 mr-2" />
                    Print Receipt
                  </Button> */}
                  {/* <Button variant="outline" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button> */}
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-4">
                <div className="grid gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Transaction Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-500">
                            Receipt ID
                          </Label>
                          <p className="font-medium">{selectedReceipt.id}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">
                            Status
                          </Label>
                          <Badge
                            className={
                              statusColors[
                                selectedReceipt.status as keyof typeof statusColors
                              ]
                            }
                          >
                            {selectedReceipt.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-500">
                            Transaction Date
                          </Label>
                          <p>{selectedReceipt.date}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">
                            Transaction Time
                          </Label>
                          <p>{selectedReceipt.time}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-500">
                            Payment Method
                          </Label>
                          <p>{selectedReceipt.paymentMethod}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">
                            Processed By
                          </Label>
                          <p>{selectedReceipt.cashier}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Student Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-500">
                            Student Name
                          </Label>
                          <p className="font-medium">
                            {selectedReceipt.studentName}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">
                            Student ID
                          </Label>
                          <p>{selectedReceipt.studentId}</p>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">
                          Grade
                        </Label>
                        <p>{selectedReceipt.grade}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Payment Breakdown
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {selectedReceipt.fees.map((fee: Fee, index: number) => (
                          <div
                            key={index}
                            className="flex justify-between py-2 border-b last:border-b-0"
                          >
                            <span>{fee.name}</span>
                            <span className="font-medium">${fee.amount}</span>
                          </div>
                        ))}
                        {selectedReceipt.discount > 0 && (
                          <div className="flex justify-between py-2 text-green-600 border-b">
                            <span>Discount Applied</span>
                            <span className="font-medium">
                              -${selectedReceipt.discount}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between py-2 text-lg font-bold">
                          <span>Total Amount</span>
                          <span>${selectedReceipt.amount}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {selectedReceipt.notes && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Additional Notes
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700">{selectedReceipt.notes}</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
