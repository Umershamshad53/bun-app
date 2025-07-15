"use client"
import {
  BarChart3,
  Calendar,
  CreditCard,
  DollarSign,
  Download,
  FileText,
  Plus,
  RefreshCw,
  School,
  Users,
} from "lucide-react"

import { Button } from "@/features/common/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/features/common/components/ui/card"
import { Badge } from "@/features/common/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/features/common/components/ui/table"

// Sample data
const recentTransactions = [
  {
    id: "TX123456",
    student: "Emma Thompson",
    date: "2024-06-05",
    amount: 650,
    feeType: "Tuition Fee",
    paymentMethod: "Credit Card",
    status: "Completed",
  },
  {
    id: "TX123457",
    student: "Michael Johnson",
    date: "2024-06-05",
    amount: 125,
    feeType: "Transportation Fee",
    paymentMethod: "Cash",
    status: "Completed",
  },
  {
    id: "TX123458",
    student: "Sophia Williams",
    date: "2024-06-04",
    amount: 75,
    feeType: "Library Fee",
    paymentMethod: "Bank Transfer",
    status: "Pending",
  },
  {
    id: "TX123459",
    student: "Daniel Brown",
    date: "2024-06-04",
    amount: 100,
    feeType: "Laboratory Fee",
    paymentMethod: "Cash",
    status: "Completed",
  },
  {
    id: "TX123460",
    student: "Olivia Davis",
    date: "2024-06-03",
    amount: 500,
    feeType: "Tuition Fee",
    paymentMethod: "Credit Card",
    status: "Failed",
  },
]

const summaryData = {
  todayCollection: 775,
  weekCollection: 3250,
  monthCollection: 12500,
  pendingPayments: 1850,
  activeStudents: 450,
  totalFeeTypes: 5,
}

export default function DashboardOverview() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome to Springfield High School POS System</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            June 5, 2024
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New Payment
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today&#39;s Collection</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${summaryData.todayCollection}</div>
            <p className="text-xs text-muted-foreground">+12% from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <BarChart3 className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${summaryData.monthCollection}</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <FileText className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${summaryData.pendingPayments}</div>
            <p className="text-xs text-muted-foreground">From 35 students</p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Collection</CardTitle>
            <CreditCard className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${summaryData.weekCollection}</div>
            <p className="text-xs text-muted-foreground">+5% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            <Users className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryData.activeStudents}</div>
            <p className="text-xs text-muted-foreground">Out of 500 total students</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fee Types</CardTitle>
            <School className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryData.totalFeeTypes}</div>
            <p className="text-xs text-muted-foreground">Tuition, Library, etc.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Plus className="mr-2 h-4 w-4" />
              New Payment
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Latest payment transactions in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Fee Type</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">{transaction.id}</TableCell>
                  <TableCell>{transaction.student}</TableCell>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>${transaction.amount}</TableCell>
                  <TableCell>{transaction.feeType}</TableCell>
                  <TableCell>{transaction.paymentMethod}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        transaction.status === "Completed"
                          ? "default"
                          : transaction.status === "Pending"
                            ? "outline"
                            : "destructive"
                      }
                    >
                      {transaction.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
