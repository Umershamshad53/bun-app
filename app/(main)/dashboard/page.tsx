"use client";

import {
  AlertCircle,
  CreditCard,
  // DollarSign,
  FileText,
  Receipt,
  Search,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

// import { Badge } from "@/features/common/components/ui/badge";
import { Button } from "@/features/common/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/features/common/components/ui/card";
import { getDashboard } from "@/features/dashboard/actions/dashboard.Action";

export default function Dashboard() {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [activeStudents, setActiveStudents] = useState(0);
  const [transactionsToday, setTransactionsToday] = useState(0);
  const [pendingPayments, setPendingPayments] = useState(0);
  const [lastUpdated, setLastUpdated] = useState("");
  const [dailyTransactions, setDailyTransactions] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [monthlyRevenueChange, setMonthlyRevenueChange] = useState(0);
  const [monthlyRevenueTrend, setMonthlyRevenueTrend] = useState("");

  useEffect(() => {
    setLastUpdated(new Date().toLocaleString());
    const fetchData = async () => {
      const response = await getDashboard();
      console.log(response, "responseresponseresponseresponse");
      if (response.success) {
        const data = response.data;
        setTotalRevenue(data.totalRevenue);
        setActiveStudents(data.activeStudents);
        setTransactionsToday(data.transactionsToday);
        setPendingPayments(data.pendingPayments);
        setDailyTransactions(data.dailyTransactions);
        setMonthlyRevenue(data.monthlyRevenue);
        setMonthlyRevenueChange(data.monthlyRevenueChange);
        setMonthlyRevenueTrend(data.monthlyRevenueTrend);
      }
    };
    fetchData();
  }, []);

  // Days of the week in order
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Create a lookup from your API data
  const dayMap = Object.fromEntries(
    dailyTransactions.map((item: { day: string; count: number }) => [
      item.day.slice(0, 3),
      item.count,
    ]),
  );

  // Build the full week data
  const fullWeekData = weekDays.map((day) => ({
    day,
    count: dayMap[day] || 0,
  }));

  // Calculate the max count for percentage bars
  const maxCount = Math.max(...fullWeekData.map((item) => item.count), 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back! Here&#39;s your fee collection overview.
          </p>

          {/* <p className="text-gray-600">Welcome back! Here's your fee collection overview.</p> */}
        </div>
        <div className="text-sm text-gray-500">Last updated: {lastUpdated}</div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rs {totalRevenue}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Students
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeStudents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Transactions Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactionsToday}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Payments
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingPayments}</div>
            <p className="text-xs text-orange-600">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Frequently used actions for fee collection
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button className="h-20 flex-col gap-2 bg-emerald-600 hover:bg-emerald-700">
              <CreditCard className="h-6 w-6" />
              <span>Collect Fee</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col gap-2"
              onClick={() => {
                // Create and show search modal
                const searchModal = document.createElement("div");
                searchModal.className =
                  "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50";
                searchModal.innerHTML = `
                  <div class="bg-white rounded-lg p-6 w-96 max-w-[90vw]">
                    <h3 class="text-lg font-semibold mb-4">Find Student</h3>
                    <input 
                      type="text" 
                      placeholder="Search by name, ID, or guardian..." 
                      class="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      id="studentSearch"
                    />
                    <div class="flex gap-2">
                      <button 
                        class="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700"
                        onclick="window.location.href='/students'"
                      >
                        Go to Students Page
                      </button>
                      <button 
                        class="px-4 py-2 border rounded-lg hover:bg-gray-50"
                        onclick="this.closest('.fixed').remove()"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                `;

                // Add click outside to close
                searchModal.addEventListener("click", (e) => {
                  if (e.target === searchModal) {
                    searchModal.remove();
                  }
                });

                document.body.appendChild(searchModal);

                // Focus on search input
                setTimeout(() => {
                  const input = document.getElementById("studentSearch");
                  if (input) input.focus();
                }, 100);
              }}
            >
              <Search className="h-6 w-6" />
              <span>Find Student</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <FileText className="h-6 w-6" />
              <span>Generate Report</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Receipt className="h-6 w-6" />
              <span>Print Receipt</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Charts Section - Simplified */}
      <div className="flex flex-row justify-between items-start gap-6">
        {/* Monthly Revenue Chart */}
        <Card className="w-1/2">
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
            <CardDescription>
              Fee collection over the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-auto min-h-[240px] flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
                <p className="text-lg font-semibold text-gray-700">
                  Revenue Trending {monthlyRevenueTrend}
                </p>
                <div className="text-sm text-gray-500">
                  <div>
                    {monthlyRevenue.map(
                      (item: { month: string; total: number }) => (
                        <div key={item.month}>{item.total}</div>
                      ),
                    )}
                  </div>{" "}
                  this month (+{monthlyRevenueChange}%)
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Daily Transactions */}
        <Card className="w-1/2 min-h-[250px]">
          <CardHeader>
            <CardTitle>Daily Transactions</CardTitle>
            <CardDescription>
              Transaction count for the current week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {fullWeekData.map((item) => {
                const percentage = (item.count / maxCount) * 100;
                return (
                  <div key={item.day} className="flex items-center">
                    <div className="w-12">{item.day}</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="w-8 text-sm font-medium">{item.count}</div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Transactions and Recent Activity */}
      {/* <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Daily Transactions</CardTitle>
            <CardDescription>
              Transaction count for the current week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dailyTransactions.map((item: { day: string; count: number }) => {
                const percentage = (item.count / 100) * 100;
                return (
                  <div key={item.day} className="flex items-center">
                    <div className="w-12">{item.day.slice(0, 3)}</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="w-8 text-sm font-medium">{item.count}</div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest fee collection activities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Payment Received</p>
                <p className="text-xs text-gray-500">
                  Student ID: 12345 - $500
                </p>
              </div>
              <Badge variant="secondary">2m ago</Badge>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">New Student Added</p>
                <p className="text-xs text-gray-500">John Doe - Grade 10</p>
              </div>
              <Badge variant="secondary">5m ago</Badge>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Payment Overdue</p>
                <p className="text-xs text-gray-500">
                  Student ID: 67890 - $300
                </p>
              </div>
              <Badge variant="secondary">10m ago</Badge>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Receipt Generated</p>
                <p className="text-xs text-gray-500">Receipt #R-2024-001</p>
              </div>
              <Badge variant="secondary">15m ago</Badge>
            </div>
          </CardContent>
        </Card>
      </div> */}
    </div>
  );
}
