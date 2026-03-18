import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { RiLoader5Fill } from "@remixicon/react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/sidebar";
import { auth } from "@/lib/auth";
import MainContent from "./_common/main-content";
import NoteDialog from "@/components/note-dialog/note-dialog";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect("/auth/sign-in");
  }

  // If user hasn't verified their email, send them to the verify page
  if (!session.user.emailVerified) {
    return redirect(
      `/auth/verify-email?email=${encodeURIComponent(session.user.email)}`
    );
  }

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <RiLoader5Fill className="w-16 h-16 animate-spin text-primary" />
        </div>
      }
    >
      <NuqsAdapter>
        <SidebarProvider>
          {/* {App Sidebar} */}
          <AppSidebar />
          <SidebarInset className="relative overflow-x-hidden pt-0">
            <MainContent>{children}</MainContent>
            <NoteDialog />
          </SidebarInset>
        </SidebarProvider>
      </NuqsAdapter>
    </Suspense>
  );
}
