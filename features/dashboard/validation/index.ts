import { z } from "zod";





export const userSchema = z.object({
  name: z.string().min(3, "Name is required"),
  email: z.string().email("Valid email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["administrator", "cashier", "viewer"], {
    errorMap: () => ({ message: "Please select a role" }),
  }),
});
export type UserFormValues = z.infer<typeof userSchema>;

export const userUpdateSchema = z.object({
  name: z.string().min(3, "Name is required"),
  email: z.string().email("Valid email is required"),
  password: z.union([
    z.string().min(8, "Password must be at least 8 characters"),
    z.literal(""),
    z.undefined(),
  ]),
  role: z.enum(["administrator", "cashier", "viewer"], {
    errorMap: () => ({ message: "Please select a role" }),
  }),
});
export type UserUpdateFormValues = z.infer<typeof userUpdateSchema>;

// export const studentSchema = z.object({


//   fullName: z.string()
//   .nonempty("Student name is required")
//   .min(3, "Name must be at least 3 characters long")
//   .max(50, "Name must be at most 50 characters long"),

// grade: z.coerce.number({
//   required_error: "Grade is required",
//   invalid_type_error: "Grade must be a number",
// })
//   .int("Grade must be an integer")
//   .min(1, "Grade must be at least 1")
//   .max(12, "Grade cannot exceed 12"),

//   class: z.coerce
//   .number({
//     required_error: "Class is required",
//     invalid_type_error: "Class must be a number",
//   })
//   .int("Class must be an integer")
//   .min(1, "Class must be at least 1")
//   .max(20, "Class cannot exceed 20"),
//   email: z.string().email("Invalid email address"),
  
//   phone: z.string()
//   .nonempty("Phone number is required")
//   .refine((val) => {

//     return /^(\+92\s[3-9]\d{9})$/.test(val) ||  
//            /^(\+1\s\(\d{3}\)\s\d{3}-\d{4})$/.test(val) ||  
//            /^(03[0-9]{9})$/.test(val);  
//   }, {
//     message: "Phone must be in format: +92 3XX XXXXXXX, +1 (XXX) XXX-XXXX, or 03XX XXXXXXX",
//   }),
//   address: z.string()
//   .nonempty("Address is required")
//   .min(3, "Address must be at least 3 characters long")
//   .max(200, "Address must be at most 200 characters long"),

//   guardianName: z.string().nonempty("Guardian name is required")
//   .min(3, "Guardian Name must be at least 3 characters long")
//   .max(50, "Guardian Name must be at most 50 characters long"),

//   guardianPhone: z
//   .string()
//   .nonempty("Guardian phone number is required")

//   .refine((val) => {

//     return /^(\+92\s[3-9]\d{9})$/.test(val) || 
//            /^(\+1\s\(\d{3}\)\s\d{3}-\d{4})$/.test(val) || 
//            /^(03[0-9]{9})$/.test(val);  
//   }, {
//     message: "Phone must be in format: +92 3XX XXXXXXX, +1 (XXX) XXX-XXXX, or 03XX XXXXXXX",
//   }),
//   status: z.enum(["Active", "Inactive"]),


// });
  
//  export type StudentForm = z.infer<typeof studentSchema>;





export const studentSchema = z.object({
  fullName: z
    .string()
    .nonempty("Student name is required")
    .min(3, "Name must be at least 3 characters long")
    .max(50, "Name must be at most 50 characters long"),
  grade: z.coerce
    .number()
    .int("Grade must be an integer")
    .min(1, "Grade must be at least 1")
    .max(12, "Grade cannot exceed 12"),
  class: z.coerce
    .number()
    .int("Class must be an integer")
    .min(1, "Class must be at least 1")
    .max(20, "Class cannot exceed 20"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .nonempty("Phone number is required")
    .refine(
      (val) => /^(\+92\s[3-9]\d{9})$/.test(val) || /^(03[0-9]{9})$/.test(val),
      "Phone must be in format: +92 3XX XXXXXXX or 03XX XXXXXXX"
    ),
  address: z
    .string()
    .nonempty("Address is required")
    .min(3, "Address must be at least 3 characters long")
    .max(200, "Address must be at most 200 characters long"),
  guardianName: z
    .string()
    .nonempty("Guardian name is required")
    .min(3, "Guardian Name must be at least 3 characters long")
    .max(50, "Guardian Name must be at most 50 characters long"),
  guardianPhone: z
    .string()
    .nonempty("Guardian phone number is required")
    .refine(
      (val) => /^(\+92\s[3-9]\d{9})$/.test(val) || /^(03[0-9]{9})$/.test(val),
      "Phone must be in format: +92 3XX XXXXXXX or 03XX XXXXXXX"
    ),
  status: z.enum(["Active", "Inactive"]),
  discount: z
    .array(
      z.object({
        name: z.string(),
        amount: z.number(),
        discount: z.number(),
        paymentType: z.string(),
      })
    )
    .optional(),
  rollNo: z.string().optional(),
});

export type StudentForm = z.infer<typeof studentSchema>;




export const feeSchema = z.object({
  feeName: z.string().min(3, "Fee name must be at least 3 characters long").max(50, "Fee name must not exceed 50 characters").nonempty("Fee name is required"),
  paymentType: z.enum(["Monthly", "Annually", ""]),
  feeDescription: z.string().max(200, "Description must not exceed 200 characters").optional(),

  feeAmount: z
    .number({
      required_error: "Amount is required",
      invalid_type_error: "Amount must be a number",
    })
    .min(1, "Amount must be greater than 0")
    .max(100000, "Amount cannot exceed 100,000"),

  feeRequired: z.boolean(),
});

export type FeeFormValues = z.infer<typeof feeSchema>;



export const gradeSchema = z.object({
  value: z
    .string()
    .nonempty("Grade name is required")
    .min(3, "Grade name must be at least 3 characters")
    .max(50, "Grade name must not exceed 50 characters"),
});

export type GradeFormValues = z.infer<typeof gradeSchema>;


export const classSchema = z.object({
  value: z.string().nonempty("Class name is required").min(2, "Class name must be at least 2 characters").max(50, "Class name must not exceed 50 characters"),

  feeTypes: z
    .array(
      z.object({
        name: z.string().nonempty("Fee type name is required"),
        amount: z
          .number({
            required_error: "Amount is required",
            invalid_type_error: "Amount must be a number",
          })
          .min(1, "Amount must be at least 1")
          .max(100000, "Amount must not exceed 100,000"),
        paymentType: z.string().nonempty("payment type is required"),
      }),
    )
    .min(1, "At least one fee type is required"),
});
export type ClassFormValues = z.infer<typeof classSchema>;