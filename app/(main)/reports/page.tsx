"use client";

import { format } from "date-fns";
import {
  BarChart3,
  CalendarIcon,
  CalendarIcon as CalendarSchedule,
  Clock,
  CreditCard,
  DollarSign,
  Download,
  FileText,
  Mail,
  Printer,
  RefreshCw,
  TrendingUp,
  Users,
} from "lucide-react";
import type { DateRange } from "react-day-picker";
import {
  Bar,
  BarChart,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";

import { useState } from "react";

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
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/features/common/components/ui/chart";
import { Label } from "@/features/common/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/features/common/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/features/common/components/ui/select";
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

// Sample data for reports
const monthlyRevenue = [
  { month: "Jan", revenue: 45000, transactions: 234, students: 189 },
  { month: "Feb", revenue: 52000, transactions: 267, students: 201 },
  { month: "Mar", revenue: 48000, transactions: 245, students: 195 },
  { month: "Apr", revenue: 61000, transactions: 312, students: 234 },
  { month: "May", revenue: 55000, transactions: 289, students: 218 },
  { month: "Jun", revenue: 67000, transactions: 345, students: 267 },
];

const feeTypeBreakdown = [
  { name: "Tuition Fee", amount: 125000, percentage: 65, color: "#10b981" },
  { name: "Library Fee", amount: 28000, percentage: 15, color: "#3b82f6" },
  { name: "Lab Fee", amount: 23000, percentage: 12, color: "#f59e0b" },
  { name: "Sports Fee", amount: 15000, percentage: 8, color: "#ef4444" },
];

const paymentMethodData = [
  { method: "Cash", amount: 89000, count: 445, percentage: 46 },
  { method: "Card", amount: 76000, count: 380, percentage: 39 },
  { method: "Bank Transfer", amount: 23000, count: 115, percentage: 12 },
  { method: "Check", amount: 6000, count: 30, percentage: 3 },
];

const dailyCollection = [
  { date: "2024-01-20", amount: 2340, transactions: 12 },
  { date: "2024-01-21", amount: 3450, transactions: 18 },
  { date: "2024-01-22", amount: 2890, transactions: 15 },
  { date: "2024-01-23", amount: 4120, transactions: 21 },
  { date: "2024-01-24", amount: 3670, transactions: 19 },
  { date: "2024-01-25", amount: 4580, transactions: 23 },
  { date: "2024-01-26", amount: 3920, transactions: 20 },
];

const outstandingBalances = [
  { grade: "Grade 9", students: 45, amount: 12500, avgBalance: 278 },
  { grade: "Grade 10", students: 38, amount: 15200, avgBalance: 400 },
  { grade: "Grade 11", students: 29, amount: 8900, avgBalance: 307 },
  { grade: "Grade 12", students: 22, amount: 6800, avgBalance: 309 },
];

const cashierPerformance = [
  { name: "John Smith", transactions: 156, amount: 45600, avgTransaction: 292 },
  { name: "Jane Doe", transactions: 134, amount: 38900, avgTransaction: 290 },
  {
    name: "Mike Johnson",
    transactions: 98,
    amount: 28700,
    avgTransaction: 293,
  },
  {
    name: "Sarah Wilson",
    transactions: 87,
    amount: 25200,
    avgTransaction: 290,
  },
];

const chartConfig = {
  revenue: { label: "Revenue", color: "#10b981" },
  transactions: { label: "Transactions", color: "#3b82f6" },
  amount: { label: "Amount", color: "#10b981" },
  count: { label: "Count", color: "#3b82f6" },
} satisfies ChartConfig;

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(2024, 0, 1),
    to: new Date(),
  });
  const [reportType, setReportType] = useState("financial");
  const [selectedGrade, setSelectedGrade] = useState("all");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("all");

  const generateReport = (type: string) => {
    console.log("Generating report:", type);
    // Report generation logic would be implemented here
  };

  const exportReport = (format: string) => {
    console.log("Exporting report as:", format);
    // Export logic would be implemented here
  };

  const scheduleReport = () => {
    console.log("Scheduling report");
    // Schedule logic would be implemented here
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Reports & Analytics
          </h1>
          <p className="text-gray-600">
            Generate comprehensive financial reports and analytics
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={scheduleReport}>
            <CalendarSchedule className="h-4 w-4 mr-2" />
            Schedule Report
          </Button>
          <Button
            className="bg-emerald-600 hover:bg-emerald-700"
            onClick={() => generateReport("custom")}
          >
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$328,000</div>
            <p className="text-xs text-emerald-600">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Transactions
            </CardTitle>
            <CreditCard className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,692</div>
            <p className="text-xs text-blue-600">Avg: $194 per transaction</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Students
            </CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,304</div>
            <p className="text-xs text-purple-600">89% payment compliance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$43,400</div>
            <p className="text-xs text-orange-600">134 students pending</p>
          </CardContent>
        </Card>
      </div>

      {/* Report Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Report Configuration</CardTitle>
          <CardDescription>
            Configure parameters for your reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            {/* Date Range */}
            <div className="space-y-2">
              <Label>Date Range</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd")} -{" "}
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
                <PopoverContent>
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange.from}
                    selected={dateRange}
                    onSelect={(range) => {
                      if (range && "from" in range && "to" in range) {
                        setDateRange(range as DateRange);
                      }
                    }}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Report Type */}
            <div className="space-y-2">
              <Label>Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="financial">Financial Summary</SelectItem>
                  <SelectItem value="student">Student Reports</SelectItem>
                  <SelectItem value="fee-analysis">Fee Analysis</SelectItem>
                  <SelectItem value="payment-methods">
                    Payment Methods
                  </SelectItem>
                  <SelectItem value="outstanding">
                    Outstanding Balances
                  </SelectItem>
                  <SelectItem value="cashier">Cashier Performance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Grade Filter */}
            <div className="space-y-2">
              <Label>Grade Filter</Label>
              <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                <SelectTrigger>
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Grades</SelectItem>
                  <SelectItem value="9">Grade 9</SelectItem>
                  <SelectItem value="10">Grade 10</SelectItem>
                  <SelectItem value="11">Grade 11</SelectItem>
                  <SelectItem value="12">Grade 12</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Payment Method Filter */}
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Select
                value={selectedPaymentMethod}
                onValueChange={setSelectedPaymentMethod}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                  <SelectItem value="check">Check</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button
              onClick={() => generateReport("current")}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
            <Button variant="outline" onClick={() => exportReport("pdf")}>
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            <Button variant="outline" onClick={() => exportReport("excel")}>
              <Download className="h-4 w-4 mr-2" />
              Export Excel
            </Button>
            <Button variant="outline">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="outline">
              <Mail className="h-4 w-4 mr-2" />
              Email Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Report Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="fees">Fee Analysis</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Monthly Revenue Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue Trend</CardTitle>
                <CardDescription>
                  Revenue and transaction trends over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <LineChart data={monthlyRevenue}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#10b981"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Fee Type Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Fee Type Distribution</CardTitle>
                <CardDescription>
                  Breakdown of revenue by fee categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <PieChart>
                    <Pie
                      data={feeTypeBreakdown}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="amount"
                      label={({ name, percentage }) =>
                        `${name}: ${percentage}%`
                      }
                    >
                      {feeTypeBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Daily Collection */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Collection Summary</CardTitle>
              <CardDescription>
                Recent daily collection performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[250px]">
                <BarChart data={dailyCollection}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Financial Tab */}
        <TabsContent value="financial" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Revenue Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Summary</CardTitle>
                <CardDescription>
                  Financial performance breakdown
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {feeTypeBreakdown.map((fee) => (
                    <div
                      key={fee.name}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: fee.color }}
                        ></div>
                        <span className="font-medium">{fee.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">
                          ${fee.amount.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {fee.percentage}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method Analysis</CardTitle>
                <CardDescription>
                  Revenue breakdown by payment method
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paymentMethodData.map((method) => (
                    <div key={method.method} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{method.method}</span>
                        <span className="font-bold">
                          ${method.amount.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-emerald-600 h-2 rounded-full"
                          style={{ width: `${method.percentage}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>{method.count} transactions</span>
                        <span>{method.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Students Tab */}
        <TabsContent value="students" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Outstanding Balances by Grade</CardTitle>
              <CardDescription>
                Student payment status across different grades
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Grade</TableHead>
                    <TableHead>Students with Balance</TableHead>
                    <TableHead>Total Outstanding</TableHead>
                    <TableHead>Average Balance</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {outstandingBalances.map((grade) => (
                    <TableRow key={grade.grade}>
                      <TableCell className="font-medium">
                        {grade.grade}
                      </TableCell>
                      <TableCell>{grade.students}</TableCell>
                      <TableCell className="font-medium">
                        ${grade.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>${grade.avgBalance}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            grade.amount > 10000 ? "destructive" : "secondary"
                          }
                        >
                          {grade.amount > 10000 ? "High" : "Moderate"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Fees Tab */}
        <TabsContent value="fees" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Fee Collection Efficiency</CardTitle>
                <CardDescription>Collection rates by fee type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {feeTypeBreakdown.map((fee) => (
                    <div key={fee.name} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{fee.name}</span>
                        <span className="text-sm text-gray-500">
                          {Math.floor(Math.random() * 20) + 80}% collected
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-emerald-600 h-2 rounded-full"
                          style={{
                            width: `${Math.floor(Math.random() * 20) + 80}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Fee Trends</CardTitle>
                <CardDescription>
                  Fee collection patterns over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[250px]">
                  <BarChart data={monthlyRevenue}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="revenue"
                      fill="#10b981"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Method Performance</CardTitle>
              <CardDescription>
                Detailed analysis of payment methods
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Transaction Count</TableHead>
                    <TableHead>Average Transaction</TableHead>
                    <TableHead>Market Share</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentMethodData.map((method) => (
                    <TableRow key={method.method}>
                      <TableCell className="font-medium">
                        {method.method}
                      </TableCell>
                      <TableCell className="font-medium">
                        ${method.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>{method.count}</TableCell>
                      <TableCell>
                        ${Math.round(method.amount / method.count)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{method.percentage}%</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cashier Performance</CardTitle>
              <CardDescription>
                Individual cashier transaction performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cashier Name</TableHead>
                    <TableHead>Transactions</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Avg Transaction</TableHead>
                    <TableHead>Performance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cashierPerformance.map((cashier) => (
                    <TableRow key={cashier.name}>
                      <TableCell className="font-medium">
                        {cashier.name}
                      </TableCell>
                      <TableCell>{cashier.transactions}</TableCell>
                      <TableCell className="font-medium">
                        ${cashier.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>${cashier.avgTransaction}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            cashier.transactions > 120 ? "default" : "secondary"
                          }
                        >
                          {cashier.transactions > 120 ? "Excellent" : "Good"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Report Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Report Templates</CardTitle>
          <CardDescription>
            Generate common reports with one click
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button
              variant="outline"
              className="h-20 flex-col gap-2"
              onClick={() => generateReport("daily")}
            >
              <FileText className="h-6 w-6" />
              <span>Daily Collection Report</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col gap-2"
              onClick={() => generateReport("monthly")}
            >
              <BarChart3 className="h-6 w-6" />
              <span>Monthly Financial Report</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col gap-2"
              onClick={() => generateReport("outstanding")}
            >
              <Clock className="h-6 w-6" />
              <span>Outstanding Balance Report</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col gap-2"
              onClick={() => generateReport("student")}
            >
              <Users className="h-6 w-6" />
              <span>Student Payment Report</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col gap-2"
              onClick={() => generateReport("cashier")}
            >
              <CreditCard className="h-6 w-6" />
              <span>Cashier Performance</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col gap-2"
              onClick={() => generateReport("audit")}
            >
              <RefreshCw className="h-6 w-6" />
              <span>Audit Trail Report</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
