import { type ClassValue, clsx } from "clsx";
import QRCode from "qrcode";
import { twMerge } from "tailwind-merge";





export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function generateQRCode(text: string): Promise<string> {
  return QRCode.toDataURL(text);
}