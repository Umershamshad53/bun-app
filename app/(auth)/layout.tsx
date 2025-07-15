import type { ReactNode } from "react";

export default function LoginLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex-1 flex flex-col min-h-screen">
      <div className="flex-1 p-6 bg-gray-50">{children}</div>
    </main>
  );
}
