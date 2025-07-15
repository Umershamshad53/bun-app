"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/features/common/components/ui/tabs"

import DashboardOverview from "@/features/dashboard/components/molecules/DashboardOverview"
import PaymentForm from "@/features/dashboard/components/molecules/PaymentForm"
import StudentList from "@/features/dashboard/components/molecules/StudentList"

export default function DashboardScreen() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="container mx-auto p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="payments">New Payment</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <DashboardOverview />
        </TabsContent>

        <TabsContent value="payments">
          <PaymentForm />
        </TabsContent>

        <TabsContent value="students">
          <StudentList />
        </TabsContent>
      </Tabs>
    </div>
  )
}
