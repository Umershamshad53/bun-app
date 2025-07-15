export const DASHBOARD_ROUTES = {
  OVERVIEW: "/dashboard",
  PAYMENTS: "/dashboard/payments",
  STUDENTS: "/dashboard/students",
  REPORTS: "/dashboard/reports",
  SETTINGS: "/dashboard/settings",
} as const

export const PAYMENT_METHODS = {
  CASH: "cash",
  CARD: "card",
  BANK_TRANSFER: "bank",
} as const

export const PAYMENT_STATUS = {
  COMPLETED: "Completed",
  PENDING: "Pending",
  FAILED: "Failed",
} as const

export const FEE_STATUS = {
  PAID: "Paid",
  PARTIAL: "Partial",
  UNPAID: "Unpaid",
} as const

export const GRADES = ["9", "10", "11", "12"] as const

export const SECTIONS = ["A", "B", "C", "D"] as const
