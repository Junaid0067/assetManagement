import { Link } from "wouter";
import { LayoutDashboard, Package, Users, FileBarChart, Tool } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { logoutMutation } = useAuth();
  return (
    <div className="min-h-screen">
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-background">
        <nav className="h-full space-y-2 p-4">
          <Link href="/dashboard">
            <a className="flex items-center gap-2 rounded p-2 hover:bg-accent">
              <LayoutDashboard size={20} />
              Dashboard
            </a>
          </Link>
          <Link href="/items">
            <a className="flex items-center gap-2 rounded p-2 hover:bg-accent">
              <Package size={20} />
              Items
            </a>
          </Link>
          <Link href="/employees">
            <a className="flex items-center gap-2 rounded p-2 hover:bg-accent">
              <Users size={20} />
              Employees
            </a>
          </Link>
          <Link href="/allocations">
            <a className="flex items-center gap-2 rounded p-2 hover:bg-accent">
              <FileBarChart size={20} />
              Allocations
            </a>
          </Link>
          <Link href="/maintenance">
            <a className="flex items-center gap-2 rounded p-2 hover:bg-accent">
              <Tool size={20} />
              Maintenance
            </a>
          </Link>
        </nav>
        <div className="absolute bottom-4 left-4 right-4">
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => logoutMutation.mutate()}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>
      <main className="pl-64">
        <div className="container p-8">
          {children}
        </div>
      </main>
    </div>
  );
}