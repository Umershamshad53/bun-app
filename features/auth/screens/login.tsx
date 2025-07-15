

import StaffLoginForm from "@/features/auth/components/molecules/StaffLoginForm";
import { GraduationCap } from "lucide-react";
export default function LoginScreen() {
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
          <h1 className="text-3xl font-bold text-gray-900">School POS Systems</h1>
          <p className="text-gray-600 mt-2">Fee Collection & Payment Portal</p>
        </div>

        {/* Login Form */}
        <StaffLoginForm />

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>© 2024 School Management System</p>
          <p>Secure Fee Collection Portal</p>
        </div>
      </div>
    </div>
  );
}
