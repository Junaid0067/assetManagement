import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import Dashboard from "@/pages/dashboard";
import Items from "@/pages/items";
import Employees from "@/pages/employees";
import Reports from "@/pages/reports";
import Maintenance from "@/pages/maintenance";
import Allocations from "@/pages/allocations";

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/" component={Dashboard} />
      <ProtectedRoute path="/items" component={Items} />
      <ProtectedRoute path="/employees" component={Employees} />
      <ProtectedRoute path="/allocations" component={Allocations} />
      <ProtectedRoute path="/reports" component={Reports} />
      <ProtectedRoute path="/maintenance" component={Maintenance} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;