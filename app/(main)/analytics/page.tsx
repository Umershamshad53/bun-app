"use client";

import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  Filter,
  RefreshCw,
  Target,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
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
import { Progress } from "@/features/common/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/features/common/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/features/common/components/ui/tabs";

// Sample analytics data
const realtimeKPIs = [
  {
    title: "Today's Revenue",
    value: "$8,450",
    change: "+15.2%",
    trend: "up",
    target: "$9,000",
    progress: 94,
    icon: DollarSign,
    color: "text-emerald-600",
  },
  {
    title: "Transactions",
    value: "47",
    change: "+8.3%",
    trend: "up",
    target: "50",
    progress: 94,
    icon: CreditCard,
    color: "text-blue-600",
  },
  {
    title: "Collection Rate",
    value: "89.2%",
    change: "-2.1%",
    trend: "down",
    target: "92%",
    progress: 97,
    icon: Target,
    color: "text-purple-600",
  },
  {
    title: "Avg. Transaction",
    value: "$180",
    change: "+6.7%",
    trend: "up",
    target: "$185",
    progress: 97,
    icon: Activity,
    color: "text-orange-600",
  },
];

const revenueForecasting = [
  { month: "Jan", actual: 45000, predicted: 44500, target: 50000 },
  { month: "Feb", actual: 52000, predicted: 51200, target: 52000 },
  { month: "Mar", actual: 48000, predicted: 49800, target: 51000 },
  { month: "Apr", actual: 61000, predicted: 58900, target: 55000 },
  { month: "May", actual: 55000, predicted: 56200, target: 57000 },
  { month: "Jun", actual: null, predicted: 62000, target: 60000 },
  { month: "Jul", actual: null, predicted: 65000, target: 62000 },
];

const studentSegmentation = [
  {
    segment: "Regular Payers",
    count: 856,
    percentage: 69.4,
    avgPayment: 195,
    color: "#10b981",
  },
  {
    segment: "Late Payers",
    count: 234,
    percentage: 19.0,
    avgPayment: 167,
    color: "#f59e0b",
  },
  {
    segment: "Partial Payers",
    count: 89,
    percentage: 7.2,
    avgPayment: 98,
    color: "#ef4444",
  },
  {
    segment: "Non-Payers",
    count: 55,
    percentage: 4.4,
    avgPayment: 0,
    color: "#6b7280",
  },
];

const paymentTrends = [
  { time: "9 AM", cash: 12, card: 8, transfer: 3 },
  { time: "10 AM", cash: 18, card: 15, transfer: 7 },
  { time: "11 AM", cash: 25, card: 22, transfer: 12 },
  { time: "12 PM", cash: 32, card: 28, transfer: 15 },
  { time: "1 PM", cash: 28, card: 35, transfer: 18 },
  { time: "2 PM", cash: 22, card: 30, transfer: 14 },
  { time: "3 PM", cash: 15, card: 18, transfer: 8 },
];

const gradePerformance = [
  {
    grade: "Grade 9",
    collected: 85,
    outstanding: 15,
    efficiency: 85,
    students: 245,
  },
  {
    grade: "Grade 10",
    collected: 92,
    outstanding: 8,
    efficiency: 92,
    students: 267,
  },
  {
    grade: "Grade 11",
    collected: 88,
    outstanding: 12,
    efficiency: 88,
    students: 234,
  },
  {
    grade: "Grade 12",
    collected: 95,
    outstanding: 5,
    efficiency: 95,
    students: 198,
  },
];

const feeTypeAnalytics = [
  { type: "Tuition", collected: 89, target: 95, amount: 125000, trend: "up" },
  { type: "Library", collected: 76, target: 80, amount: 28000, trend: "down" },
  { type: "Lab", collected: 82, target: 85, amount: 23000, trend: "up" },
  { type: "Sports", collected: 68, target: 75, amount: 15000, trend: "down" },
  { type: "Transport", collected: 91, target: 90, amount: 32000, trend: "up" },
];

const chartConfig = {
  actual: { label: "Actual", color: "#10b981" },
  predicted: { label: "Predicted", color: "#3b82f6" },
  target: { label: "Target", color: "#f59e0b" },
  cash: { label: "Cash", color: "#10b981" },
  card: { label: "Card", color: "#3b82f6" },
  transfer: { label: "Transfer", color: "#f59e0b" },
} satisfies ChartConfig;

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7d");
  // const [selectedMetric, setSelectedMetric] = useState("revenue");
  // const [comparisonPeriod, setComparisonPeriod] = useState("previous");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600">
            Real-time insights and predictive analytics for fee collection
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Today</SelectItem>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
              <SelectItem value="1y">1 Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Filter className="h-4 w-4 mr-2" />
            Advanced Filters
          </Button>
        </div>
      </div>

      {/* Real-time KPIs */}
      <div className="grid gap-4 md:grid-cols-4">
        {realtimeKPIs.map((kpi) => {
          const Icon = kpi.icon;
          const TrendIcon = kpi.trend === "up" ? ArrowUpRight : ArrowDownRight;
          return (
            <Card key={kpi.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {kpi.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${kpi.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <div className="flex items-center gap-2 mt-2">
                  <div
                    className={`flex items-center text-xs ${kpi.trend === "up" ? "text-green-600" : "text-red-600"}`}
                  >
                    <TrendIcon className="h-3 w-3 mr-1" />
                    {kpi.change}
                  </div>
                  <div className="text-xs text-gray-500">vs yesterday</div>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Target: {kpi.target}</span>
                    <span>{kpi.progress}%</span>
                  </div>
                  <Progress value={kpi.progress} className="h-2" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
          <TabsTrigger value="segmentation">Segmentation</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Revenue vs Target */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Performance</CardTitle>
                <CardDescription>
                  Actual vs predicted vs target revenue
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <AreaChart data={revenueForecasting.slice(0, 5)}>
                    <XAxis dataKey="month" />
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
                      dataKey="predicted"
                      stackId="2"
                      stroke="#3b82f6"
                      fill="#dbeafe"
                    />
                    <Area
                      type="monotone"
                      dataKey="actual"
                      stackId="3"
                      stroke="#10b981"
                      fill="#d1fae5"
                    />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Payment Method Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method Trends</CardTitle>
                <CardDescription>
                  Hourly payment method distribution
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <BarChart data={paymentTrends}>
                    <XAxis dataKey="time" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="cash" fill="#10b981" />
                    <Bar dataKey="card" fill="#3b82f6" />
                    <Bar dataKey="transfer" fill="#f59e0b" />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Grade Performance Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Grade-wise Collection Efficiency</CardTitle>
              <CardDescription>
                Collection rates and outstanding balances by grade
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {gradePerformance.map((grade) => (
                  <div key={grade.grade} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <span className="font-medium w-20">{grade.grade}</span>
                        <span className="text-sm text-gray-500">
                          {grade.students} students
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge
                          variant={
                            grade.efficiency >= 90
                              ? "default"
                              : grade.efficiency >= 80
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {grade.efficiency}% efficiency
                        </Badge>
                        <span className="text-sm font-medium">
                          {grade.collected}% collected
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Progress value={grade.collected} className="h-2" />
                      </div>
                      <span className="text-xs text-gray-500 w-16">
                        {grade.outstanding}% pending
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Forecasting Tab */}
        <TabsContent value="forecasting" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Revenue Forecasting */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Forecasting</CardTitle>
                <CardDescription>
                  Predictive analysis for upcoming months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[350px]">
                  <LineChart data={revenueForecasting}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="actual"
                      stroke="#10b981"
                      strokeWidth={2}
                      strokeDasharray="0"
                    />
                    <Line
                      type="monotone"
                      dataKey="predicted"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                    />
                    <Line
                      type="monotone"
                      dataKey="target"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      strokeDasharray="10 5"
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Predictive Insights */}
            <Card>
              <CardHeader>
                <CardTitle>Predictive Insights</CardTitle>
                <CardDescription>
                  AI-powered predictions and recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-800">
                        Positive Trend
                      </span>
                    </div>
                    <p className="text-sm text-green-700">
                      Revenue is expected to increase by 12% next month based on
                      current payment patterns.
                    </p>
                  </div>

                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <span className="font-medium text-yellow-800">
                        Attention Required
                      </span>
                    </div>
                    <p className="text-sm text-yellow-700">
                      Library fee collection is 24% below target. Consider
                      sending payment reminders.
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-800">
                        Optimization Opportunity
                      </span>
                    </div>
                    <p className="text-sm text-blue-700">
                      Peak payment hours are 11 AM - 1 PM. Consider staffing
                      adjustments for better efficiency.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Segmentation Tab */}
        <TabsContent value="segmentation" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Student Segmentation */}
            <Card>
              <CardHeader>
                <CardTitle>Student Payment Behavior</CardTitle>
                <CardDescription>
                  Segmentation based on payment patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <PieChart>
                    <Pie
                      data={studentSegmentation}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="count"
                      label={({ segment, percentage }) =>
                        `${segment}: ${percentage}%`
                      }
                    >
                      {studentSegmentation.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Segment Details */}
            <Card>
              <CardHeader>
                <CardTitle>Segment Analysis</CardTitle>
                <CardDescription>
                  Detailed breakdown of student segments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {studentSegmentation.map((segment) => (
                    <div
                      key={segment.segment}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: segment.color }}
                        ></div>
                        <div>
                          <div className="font-medium">{segment.segment}</div>
                          <div className="text-sm text-gray-500">
                            {segment.count} students
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{segment.percentage}%</div>
                        <div className="text-sm text-gray-500">
                          Avg: ${segment.avgPayment}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Timing Analysis</CardTitle>
              <CardDescription>
                Hourly distribution of payments by method
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[400px]">
                <AreaChart data={paymentTrends}>
                  <XAxis dataKey="time" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="cash"
                    stackId="1"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="card"
                    stackId="1"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="transfer"
                    stackId="1"
                    stroke="#f59e0b"
                    fill="#f59e0b"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Fee Type Performance</CardTitle>
              <CardDescription>
                Collection efficiency by fee category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {feeTypeAnalytics.map((fee) => (
                  <div key={fee.type} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <span className="font-medium w-20">{fee.type}</span>
                        <Badge
                          variant={
                            fee.collected >= fee.target
                              ? "default"
                              : "secondary"
                          }
                        >
                          {fee.collected}% collected
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500">
                          ${fee.amount.toLocaleString()}
                        </span>
                        <div
                          className={`flex items-center text-xs ${fee.trend === "up" ? "text-green-600" : "text-red-600"}`}
                        >
                          {fee.trend === "up" ? (
                            <TrendingUp className="h-3 w-3 mr-1" />
                          ) : (
                            <TrendingDown className="h-3 w-3 mr-1" />
                          )}
                          {fee.trend === "up" ? "Improving" : "Declining"}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Progress value={fee.collected} className="h-2" />
                      </div>
                      <span className="text-xs text-gray-500 w-16">
                        Target: {fee.target}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Key Insights */}
            <Card>
              <CardHeader>
                <CardTitle>Key Insights</CardTitle>
                <CardDescription>
                  Data-driven insights and recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">Peak Performance</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Grade 12 shows the highest collection efficiency at 95%,
                      serving as a benchmark for other grades.
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-orange-600" />
                      <span className="font-medium">Timing Optimization</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Card payments peak at 1 PM, while cash payments are
                      highest at 12 PM. Consider adjusting staff schedules.
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Target Achievement</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Transportation fees exceed targets by 1%, while sports
                      fees lag behind by 7 percentage points.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Items */}
            <Card>
              <CardHeader>
                <CardTitle>Recommended Actions</CardTitle>
                <CardDescription>
                  Actionable recommendations based on analytics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span className="font-medium text-red-800">
                        High Priority
                      </span>
                    </div>
                    <p className="text-sm text-red-700 mb-2">
                      Send payment reminders to 55 non-paying students
                      immediately.
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-700 border-red-300"
                    >
                      Send Reminders
                    </Button>
                  </div>

                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-yellow-600" />
                      <span className="font-medium text-yellow-800">
                        Medium Priority
                      </span>
                    </div>
                    <p className="text-sm text-yellow-700 mb-2">
                      Review sports fee structure - collection rate is below
                      target.
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-yellow-700 border-yellow-300"
                    >
                      Review Fees
                    </Button>
                  </div>

                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-800">
                        Opportunity
                      </span>
                    </div>
                    <p className="text-sm text-green-700 mb-2">
                      Implement Grade 12&apos;s payment strategies in other
                      grades.
                    </p>

                    <Button
                      size="sm"
                      variant="outline"
                      className="text-green-700 border-green-300"
                    >
                      Implement Strategy
                    </Button>
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
