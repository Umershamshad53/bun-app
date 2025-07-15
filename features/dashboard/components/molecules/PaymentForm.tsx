"use client"

import { useState } from "react"
import { Check, CreditCard, Search } from "lucide-react"

import { Button } from "@/features/common/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/features/common/components/ui/card"
import { Input } from "@/features/common/components/ui/input"
import { Label } from "@/features/common/components/ui/label"

// import { RadioGroup, RadioGroupItem } from "@/features/common/components/ui/"radio-group"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/features/common/components/ui/select"
import { Separator } from "@/features/common/components/ui/separator"
import { Checkbox } from "@/features/common/components/ui/checkbox"

// Sample data
const feeTypes = [
  { id: 1, name: "Tuition Fee", amount: 500, required: true },
  { id: 2, name: "Library Fee", amount: 50, required: false },
  { id: 3, name: "Laboratory Fee", amount: 100, required: false },
  { id: 4, name: "Sports Fee", amount: 75, required: false },
  { id: 5, name: "Transportation Fee", amount: 125, required: false },
]

export default function PaymentForm() {
  const [selectedFees, setSelectedFees] = useState<number[]>([1]) // Default to Tuition Fee
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [student, setStudent] = useState({
    id: "",
    name: "",
    grade: "",
    section: "",
  })
  const [studentFound, setStudentFound] = useState(false)

  const handleStudentSearch = () => {
    // Simulate student search
    if (student.id) {
      setStudent({
        id: "S12345",
        name: "Emma Thompson",
        grade: "10",
        section: "A",
      })
      setStudentFound(true)
    }
  }

  const handleFeeToggle = (feeId: number) => {
    setSelectedFees((prev) => (prev.includes(feeId) ? prev.filter((id) => id !== feeId) : [...prev, feeId]))
  }

  const calculateTotal = () => {
    return feeTypes.filter((fee) => selectedFees.includes(fee.id)).reduce((sum, fee) => sum + fee.amount, 0)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">New Payment</CardTitle>
          <CardDescription>Process a new student payment</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Student Search */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Student Information</h3>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  placeholder="Enter student ID"
                  value={student.id}
                  onChange={(e) => setStudent({ ...student, id: e.target.value })}
                />
              </div>
              <Button onClick={handleStudentSearch} type="button">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>

            {studentFound && (
              <div className="p-4 border rounded-md bg-muted/50">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Student Name</Label>
                    <p className="font-medium">{student.name}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Student ID</Label>
                    <p className="font-medium">{student.id}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Grade</Label>
                    <p className="font-medium">{student.grade}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Section</Label>
                    <p className="font-medium">{student.section}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Fee Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Fee Selection</h3>
            <div className="space-y-2">
              {feeTypes.map((fee) => (
                <div key={fee.id} className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`fee-${fee.id}`}
                      checked={selectedFees.includes(fee.id)}
                      onCheckedChange={() => handleFeeToggle(fee.id)}
                      disabled={fee.required}
                    />
                    <div>
                      <Label htmlFor={`fee-${fee.id}`} className="font-medium">
                        {fee.name}
                      </Label>
                      {fee.required && (
                        <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                          Required
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="font-medium">${fee.amount}</div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Payment Method */}
          {/* <div className="space-y-4">
            <h3 className="text-lg font-medium">Payment Method</h3>
            <RadioGroup
              value={paymentMethod}
              onValueChange={setPaymentMethod}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <div className="flex items-center space-x-2 border rounded-md p-4 cursor-pointer [&:has(:checked)]:bg-primary/5 [&:has(:checked)]:border-primary/50">
                <RadioGroupItem value="cash" id="cash" />
                <Label htmlFor="cash" className="flex items-center gap-2 cursor-pointer">
                  <CreditCard className="h-4 w-4" />
                  Cash
                </Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-md p-4 cursor-pointer [&:has(:checked)]:bg-primary/5 [&:has(:checked)]:border-primary/50">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                  <CreditCard className="h-4 w-4" />
                  Credit/Debit Card
                </Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-md p-4 cursor-pointer [&:has(:checked)]:bg-primary/5 [&:has(:checked)]:border-primary/50">
                <RadioGroupItem value="bank" id="bank" />
                <Label htmlFor="bank" className="flex items-center gap-2 cursor-pointer">
                  <CreditCard className="h-4 w-4" />
                  Bank Transfer
                </Label>
              </div>
            </RadioGroup>

            {paymentMethod === "card" && (
              <div className="space-y-4 p-4 border rounded-md">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Name on Card</Label>
                    <Input id="cardName" placeholder="John Smith" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input id="expiry" placeholder="MM/YY" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input id="cvv" placeholder="123" />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === "bank" && (
              <div className="space-y-4 p-4 border rounded-md">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Select>
                      <SelectTrigger id="bankName">
                        <SelectValue placeholder="Select bank" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bank1">First National Bank</SelectItem>
                        <SelectItem value="bank2">City Trust Bank</SelectItem>
                        <SelectItem value="bank3">Metro Bank</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="referenceNumber">Reference Number</Label>
                    <Input id="referenceNumber" placeholder="Enter reference number" />
                  </div>
                </div>
              </div>
            )}
          </div> */}

          <Separator />

          {/* Payment Summary */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Payment Summary</h3>
            <div className="p-4 border rounded-md bg-muted/50 space-y-2">
              {selectedFees.map((feeId) => {
                const fee = feeTypes.find((f) => f.id === feeId)
                return fee ? (
                  <div key={fee.id} className="flex justify-between">
                    <span>{fee.name}</span>
                    <span>${fee.amount}</span>
                  </div>
                ) : null
              })}
              <Separator className="my-2" />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${calculateTotal()}</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Check className="mr-2 h-4 w-4" />
            Process Payment
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
