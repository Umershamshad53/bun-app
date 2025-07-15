
"use client";
import { toast } from "sonner";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/features/auth/actions/login.actions";
import { Loader2 } from "lucide-react";
import { Lock, Mail } from "lucide-react";
import { Button } from "@/features/common/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/features/common/components/ui/card";

import { Input } from "@/features/common/components/ui/input";
import { Label } from "@/features/common/components/ui/label";

import { loginSchema, LoginFormValues } from "@/features/auth/validation/index"; 

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff} from "lucide-react";


export default function StaffLoginForm() {
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();


  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setErrorMsg("");
    const result = await login({ email: data.email, password: data.password });
  
    if (result.success) {
      toast.success("Login successful");
  
   
      setTimeout(() => {
        router.push("/class");
      }, 1500);
    } else {
      toast.error(result.message);
    }
  };
  
  

  
  
  return (
    <Card className="shadow-xl border-0">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-2xl font-semibold text-center">Staff Login</CardTitle>
        <CardDescription className="text-center">Access the fee collection system</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
    
          {errorMsg && (
            <p className="text-sm text-red-500 text-center">{errorMsg}</p>
          )}

 
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="staff@school.edu"
                className="pl-10 h-12 py-3 placeholder:text-gray-400"
                {...register("email")}
                autoComplete="username"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
      <Label htmlFor="password">Password</Label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />

        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          className="pl-10 pr-10 h-12"
          {...register("password")}
          autoComplete="current-password"
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          {showPassword ? (
                  <Eye className="h-5 w-5" />
    
          ) : (
            <EyeOff className="h-5 w-5" />
          )}
        </button>
      </div>
    

      {errors.password && (
        <p className="text-xs text-red-500">{errors.password.message}</p>
      )}
    </div>

{/*    
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="pl-10 h-12"
                {...register("password")}
                autoComplete="current-password"
              />
            </div>
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            )}
          </div> */}

{/*         
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" {...register("remember")} />
              <Label htmlFor="remember" className="text-sm text-gray-600">Remember me</Label>
            </div>
            <Link href="/forgot-password" className="text-sm text-emerald-600 hover:underline">Forgot password?</Link>
          </div> */}

          <Button
  type="submit"
  className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
  disabled={isSubmitting}
>
  {isSubmitting ? (
    <>
      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
      Signing In...
    </>
  ) : (
    "Sign In to POS System"
  )}
</Button>
        </form>

        {/* Footer Info */}
        <div className="pt-4 border-t border-gray-200 text-center text-xs text-gray-500 space-y-2">
          <p>Authorized personnel only</p>
          <p>DevSoul</p>
        </div>
      </CardContent>
    </Card>
  );
}