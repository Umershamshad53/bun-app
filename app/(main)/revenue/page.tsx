"use client";

import { format } from "date-fns";
import {
  AlertCircle,
  ArrowUpRight,
  BarChart3,
  CalendarIcon,
  CheckCircle,
  DollarSign,
  Download,
  PieChartIcon,
  RefreshCw,
  Target,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import type { DateRange } from "react-day-picker";
import {
  Area,
  AreaChart,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/features/common/components/ui/popover";
import { Progress } from "@/features/common/components/ui/progress";
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

// Sample revenue data
const revenueOverview = {
  totalRevenue: 328000,
  monthlyTarget: 350000,
  yearlyTarget: 4200000,
  growth: 12.5,
  avgMonthly: 54667,
  projectedYearly: 4380000,
};

const monthlyRevenue = [
  {
    month: "Jan",
    revenue: 45000,
    target: 50000,
    growth: 8.2,
    transactions: 234,
  },
  {
    month: "Feb",
    revenue: 52000,
    target: 50000,
    growth: 15.6,
    transactions: 267,
  },
  {
    month: "Mar",
    revenue: 48000,
    target: 51000,
    growth: -7.7,
    transactions: 245,
  },
  {
    month: "Apr",
    revenue: 61000,
    target: 55000,
    growth: 27.1,
    transactions: 312,
  },
  {
    month: "May",
    revenue: 55000,
    target: 57000,
    growth: -9.8,
    transactions: 289,
  },
  {
    month: "Jun",
    revenue: 67000,
    target: 60000,
    growth: 21.8,
    transactions: 345,
  },
];

const revenueByFeeType = [
  {
    type: "Tuition Fee",
    amount: 195000,
    percentage: 59.5,
    target: 210000,
    growth: 8.5,
    color: "#10b981",
  },
  {
    type: "Library Fee",
    amount: 49200,
    percentage: 15.0,
    target: 52500,
    growth: -6.3,
    color: "#3b82f6",
  },
  {
    type: "Lab Fee",
    amount: 39360,
    percentage: 12.0,
    target: 42000,
    growth: 12.1,
    color: "#f59e0b",
  },
  {
    type: "Sports Fee",
    amount: 26240,
    percentage: 8.0,
    target: 28000,
    growth: -2.8,
    color: "#ef4444",
  },
  {
    type: "Transportation",
    amount: 18200,
    percentage: 5.5,
    target: 17500,
    growth: 15.2,
    color: "#8b5cf6",
  },
];

const revenueByGrade = [
  {
    grade: "Grade 9",
    revenue: 78720,
    students: 245,
    avgPerStudent: 321,
    target: 85000,
    efficiency: 92.6,
  },
  {
    grade: "Grade 10",
    revenue: 85440,
    students: 267,
    avgPerStudent: 320,
    target: 90000,
    efficiency: 94.9,
  },
  {
    grade: "Grade 11",
    revenue: 74880,
    students: 234,
    avgPerStudent: 320,
    target: 80000,
    efficiency: 93.6,
  },
  {
    grade: "Grade 12",
    revenue: 89040,
    students: 198,
    avgPerStudent: 450,
    target: 95000,
    efficiency: 93.7,
  },
];

const revenueByPaymentMethod = [
  {
    method: "Cash",
    amount: 147600,
    percentage: 45.0,
    avgTransaction: 185,
    transactions: 798,
  },
  {
    method: "Credit/Debit Card",
    amount: 131200,
    percentage: 40.0,
    avgTransaction: 195,
    transactions: 673,
  },
  {
    method: "Bank Transfer",
    amount: 32800,
    percentage: 10.0,
    avgTransaction: 410,
    transactions: 80,
  },
  {
    method: "Check",
    amount: 16400,
    percentage: 5.0,
    avgTransaction: 273,
    transactions: 60,
  },
];

const dailyRevenue = [
  { date: "Mon", amount: 4200, target: 4500, variance: -6.7 },
  { date: "Tue", amount: 5100, target: 4500, variance: 13.3 },
  { date: "Wed", amount: 3800, target: 4500, variance: -15.6 },
  { date: "Thu", amount: 6200, target: 4500, variance: 37.8 },
  { date: "Fri", amount: 5500, target: 4500, variance: 22.2 },
  { date: "Sat", amount: 2100, target: 2000, variance: 5.0 },
  { date: "Sun", amount: 800, target: 1000, variance: -20.0 },
];

const revenueForecasting = [
  {
    month: "Jul",
    actual: null,
    predicted: 69000,
    conservative: 65000,
    optimistic: 73000,
  },
  {
    month: "Aug",
    actual: null,
    predicted: 71000,
    conservative: 67000,
    optimistic: 75000,
  },
  {
    month: "Sep",
    actual: null,
    predicted: 68000,
    conservative: 64000,
    optimistic: 72000,
  },
  {
    month: "Oct",
    actual: null,
    predicted: 72000,
    conservative: 68000,
    optimistic: 76000,
  },
  {
    month: "Nov",
    actual: null,
    predicted: 70000,
    conservative: 66000,
    optimistic: 74000,
  },
  {
    month: "Dec",
    actual: null,
    predicted: 75000,
    conservative: 71000,
    optimistic: 79000,
  },
];

const chartConfig = {
  revenue: { label: "Revenue", color: "#10b981" },
  target: { label: "Target", color: "#f59e0b" },
  predicted: { label: "Predicted", color: "#3b82f6" },
  conservative: { label: "Conservative", color: "#6b7280" },
  optimistic: { label: "Optimistic", color: "#10b981" },
} satisfies ChartConfig;

export default function RevenuePage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2024, 0, 1),
    to: new Date(),
  });

  const targetAchievement =
    (revenueOverview.totalRevenue / revenueOverview.monthlyTarget) * 100;
  const yearlyProgress =
    (revenueOverview.totalRevenue / revenueOverview.yearlyTarget) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Revenue Management
          </h1>
          <p className="text-gray-600">
            Comprehensive revenue tracking, analysis, and optimization
          </p>
        </div>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
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
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Revenue Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${revenueOverview.totalRevenue.toLocaleString()}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center text-xs text-green-600">
                <ArrowUpRight className="h-3 w-3 mr-1" />+
                {revenueOverview.growth}%
              </div>
              <div className="text-xs text-gray-500">vs last period</div>
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Monthly Target</span>
                <span>{targetAchievement.toFixed(1)}%</span>
              </div>
              <Progress value={targetAchievement} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Yearly Progress
            </CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {yearlyProgress.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-500 mt-2">
              ${revenueOverview.yearlyTarget.toLocaleString()} target
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>
                  Projected: ${revenueOverview.projectedYearly.toLocaleString()}
                </span>
                <span>
                  {(
                    (revenueOverview.projectedYearly /
                      revenueOverview.yearlyTarget) *
                    100
                  ).toFixed(1)}
                  %
                </span>
              </div>
              <Progress value={yearlyProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Average
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${revenueOverview.avgMonthly.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 mt-2">6-month average</div>
            <div className="mt-3">
              <Badge
                variant={
                  revenueOverview.avgMonthly > 50000 ? "default" : "secondary"
                }
              >
                {revenueOverview.avgMonthly > 50000
                  ? "Above Target"
                  : "Below Target"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{revenueOverview.growth}%</div>
            <div className="text-xs text-gray-500 mt-2">Year-over-year</div>
            <div className="mt-3">
              <Badge
                variant={revenueOverview.growth > 10 ? "default" : "secondary"}
              >
                {revenueOverview.growth > 10
                  ? "Strong Growth"
                  : "Moderate Growth"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Analysis Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
          <TabsTrigger value="targets">Targets</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Monthly Revenue Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue vs Target</CardTitle>
                <CardDescription>
                  Revenue performance against monthly targets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <BarChart data={monthlyRevenue}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="target" fill="#f59e0b" opacity={0.5} />
                    <Bar dataKey="revenue" fill="#10b981" />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Revenue by Fee Type */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Distribution</CardTitle>
                <CardDescription>
                  Revenue breakdown by fee categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <PieChart>
                    <Pie
                      data={revenueByFeeType}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="amount"
                      label={({ type, percentage }) =>
                        `${type}: ${percentage}%`
                      }
                    >
                      {revenueByFeeType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Daily Revenue Pattern */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Revenue Pattern</CardTitle>
              <CardDescription>
                Average daily revenue vs targets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[250px]">
                <AreaChart data={dailyRevenue}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="target"
                    stackId="1"
                    stroke="#f59e0b"
                    fill="#fef3c7"
                  />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stackId="2"
                    stroke="#10b981"
                    fill="#d1fae5"
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Breakdown Tab */}
        <TabsContent value="breakdown" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Revenue by Fee Type Table */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Fee Type</CardTitle>
                <CardDescription>
                  Detailed breakdown of revenue sources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fee Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Target</TableHead>
                      <TableHead>Growth</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {revenueByFeeType.map((fee) => (
                      <TableRow key={fee.type}>
                        <TableCell className="font-medium">
                          {fee.type}
                        </TableCell>
                        <TableCell>${fee.amount.toLocaleString()}</TableCell>
                        <TableCell>${fee.target.toLocaleString()}</TableCell>
                        <TableCell>
                          <div
                            className={`flex items-center ${fee.growth > 0 ? "text-green-600" : "text-red-600"}`}
                          >
                            {fee.growth > 0 ? (
                              <TrendingUp className="h-3 w-3 mr-1" />
                            ) : (
                              <TrendingDown className="h-3 w-3 mr-1" />
                            )}
                            {Math.abs(fee.growth)}%
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Revenue by Grade */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Grade</CardTitle>
                <CardDescription>
                  Grade-wise revenue performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Grade</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Per Student</TableHead>
                      <TableHead>Efficiency</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {revenueByGrade.map((grade) => (
                      <TableRow key={grade.grade}>
                        <TableCell className="font-medium">
                          {grade.grade}
                        </TableCell>
                        <TableCell>${grade.revenue.toLocaleString()}</TableCell>
                        <TableCell>${grade.avgPerStudent}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              grade.efficiency > 93 ? "default" : "secondary"
                            }
                          >
                            {grade.efficiency}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Payment Method Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue by Payment Method</CardTitle>
              <CardDescription>
                Payment method contribution to total revenue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {revenueByPaymentMethod.map((method) => (
                  <div key={method.method} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{method.method}</span>
                      <div className="text-right">
                        <div className="font-bold">
                          ${method.amount.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {method.transactions} transactions
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-emerald-600 h-2 rounded-full"
                        style={{ width: `${method.percentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Avg: ${method.avgTransaction}</span>
                      <span>{method.percentage}% of total</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Growth Trends</CardTitle>
              <CardDescription>
                Month-over-month revenue growth analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[400px]">
                <LineChart data={monthlyRevenue}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    strokeWidth={3}
                  />
                  <Line
                    type="monotone"
                    dataKey="target"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Forecasting Tab */}
        <TabsContent value="forecasting" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Forecasting</CardTitle>
              <CardDescription>
                Predicted revenue for upcoming months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[400px]">
                <AreaChart data={revenueForecasting}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="conservative"
                    stackId="1"
                    stroke="#6b7280"
                    fill="#f3f4f6"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="predicted"
                    stackId="2"
                    stroke="#3b82f6"
                    fill="#dbeafe"
                    fillOpacity={0.8}
                  />
                  <Area
                    type="monotone"
                    dataKey="optimistic"
                    stackId="3"
                    stroke="#10b981"
                    fill="#d1fae5"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Targets Tab */}
        <TabsContent value="targets" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Target Achievement */}
            <Card>
              <CardHeader>
                <CardTitle>Target Achievement</CardTitle>
                <CardDescription>
                  Progress toward revenue targets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {revenueByFeeType.map((fee) => {
                    const achievement = (fee.amount / fee.target) * 100;
                    return (
                      <div key={fee.type} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">{fee.type}</span>
                          <span className="text-sm text-gray-500">
                            {achievement.toFixed(1)}%
                          </span>
                        </div>
                        <Progress value={achievement} className="h-2" />
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>${fee.amount.toLocaleString()}</span>
                          <span>Target: ${fee.target.toLocaleString()}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Target Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Target Summary</CardTitle>
                <CardDescription>
                  Overall target performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-800">
                        Targets Exceeded
                      </span>
                    </div>
                    <p className="text-sm text-green-700">
                      Transportation and Tuition fees have exceeded their
                      targets this period.
                    </p>
                  </div>

                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <span className="font-medium text-yellow-800">
                        Below Target
                      </span>
                    </div>
                    <p className="text-sm text-yellow-700">
                      Library and Sports fees are currently below their targets
                      and need attention.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">3</div>
                      <div className="text-sm text-gray-500">Targets Met</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">2</div>
                      <div className="text-sm text-gray-500">Below Target</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Optimization Tab */}
        <TabsContent value="optimization" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Revenue Opportunities */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Opportunities</CardTitle>
                <CardDescription>
                  Identified opportunities for revenue growth
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="font-medium">High Impact</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Increase sports fee collection rate by 10% could add
                      $2,800 monthly revenue.
                    </p>
                    <Button size="sm" variant="outline">
                      Implement Strategy
                    </Button>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <PieChartIcon className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">Medium Impact</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Optimize payment timing to increase average transaction
                      value by 5%.
                    </p>
                    <Button size="sm" variant="outline">
                      Analyze Further
                    </Button>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-4 w-4 text-purple-600" />
                      <span className="font-medium">Quick Win</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Implement automated payment reminders to reduce late
                      payments.
                    </p>
                    <Button size="sm" variant="outline">
                      Quick Setup
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Insights */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Insights</CardTitle>
                <CardDescription>
                  Key insights for revenue optimization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">
                      Peak Performance
                    </h4>
                    <p className="text-sm text-blue-700">
                      Grade 12 shows highest revenue per student at $450. Apply
                      similar strategies to other grades.
                    </p>
                  </div>

                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <h4 className="font-medium text-purple-800 mb-2">
                      Payment Preferences
                    </h4>
                    <p className="text-sm text-purple-700">
                      Cash payments dominate at 45%. Consider incentivizing
                      digital payments for better tracking.
                    </p>
                  </div>

                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <h4 className="font-medium text-orange-800 mb-2">
                      Seasonal Trends
                    </h4>
                    <p className="text-sm text-orange-700">
                      Revenue peaks in April and June. Plan major fee
                      collections during these periods.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
