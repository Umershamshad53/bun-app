import type React from "react";

// import { Navbar } from "@/features/common/components/AppBar";
import { AppSidebar } from "@/features/common/components/AppSidebar";
import { SidebarProvider } from "@/features/common/components/ui/sidebar";

// export default function MainLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <SidebarProvider>
//       <>
//       <div className="flex h-screen overflow-hidden"> <AppSidebar />

//         <main className="flex-1 overflow-hidden flex flex-col min-h-screen">
//           <Navbar />
//           <div className="flex-1 p-6 bg-gray-50  ">{children}</div>
//         </main>
//         </div>
//       </>
//     </SidebarProvider>

//   );
// }
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden">
        <AppSidebar />
      </div>
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* <Navbar /> */}
        <div className="flex-1  p-6 bg-gray-50">{children}</div>
      </main>
    </SidebarProvider>
  );
}
