import { ArrowLeft, GraduationCap, Mail, Shield } from "lucide-react";
import Link from "next/link";
 
import { Button } from "@/features/common/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/features/common/components/ui/card";
import { Input } from "@/features/common/components/ui/input";
import { Label } from "@/features/common/components/ui/label";
 
export default function Component() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-emerald-600 p-3 rounded-full">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">School POS System</h1>
          <p className="text-gray-600 mt-2">Fee Collection & Payment Portal</p>
        </div>
 
        {/* Forgot Password Card */}
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-6">
            <div className="flex items-center justify-center mb-2">
              <div className="bg-emerald-100 p-2 rounded-full">
                <Shield className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-semibold text-center">Reset Password</CardTitle>
            <CardDescription className="text-center">Enter your email address and we&apos;ll send you instructions to reset your password</CardDescription>
 
            {/* <CardDescription className="text-center">Enter your email address and we'll send you instructions to reset your password</CardDescription> */}
          </CardHeader>
          <CardContent className="space-y-6">
            <form className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input id="email" type="email" placeholder="staff@school.edu" className="pl-10 h-12" required />
                </div>
                <p className="text-xs text-gray-500">Enter the email address associated with your staff account</p>
              </div>
 
              {/* Reset Button */}
              <Button type="submit" className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-medium">
                Send Reset Instructions
              </Button>
            </form>
 
            {/* Instructions */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <h4 className="font-medium text-emerald-800 mb-2">What happens next?</h4>
              <ul className="text-sm text-emerald-700 space-y-1">
                <li>• Check your email for reset instructions</li>
                <li>• Click the secure link in the email</li>
                <li>• Create a new password</li>
                <li>• Return to login with your new password</li>
              </ul>
            </div>
 
            {/* Back to Login */}
            <div className="text-center">
              <Link href="/" className="inline-flex items-center text-sm text-emerald-600 hover:text-emerald-700 hover:underline">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Login
              </Link>
            </div>
 
            {/* Support Info */}
            <div className="pt-4 border-t border-gray-200">
              <div className="text-center space-y-2">
                <p className="text-xs text-gray-500">Still having trouble?</p>
                <p className="text-xs text-gray-500">Contact IT Support: ext. 1234 or it-support@school.edu</p>
              </div>
            </div>
          </CardContent>
        </Card>
 
        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>© 2024 School Management System</p>
          <p>Secure Fee Collection Portal</p>
        </div>
      </div>
    </div>
  );
}
 