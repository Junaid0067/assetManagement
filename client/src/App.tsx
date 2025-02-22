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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Switch>
          <Route path="/login" component={AuthPage} />
          <Route path="/" component={() => <ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/items" component={() => <ProtectedRoute><Items /></ProtectedRoute>} />
          <Route path="/employees" component={() => <ProtectedRoute><Employees /></ProtectedRoute>} />
          <Route path="/reports" component={() => <ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="/maintenance" component={() => <ProtectedRoute><Maintenance /></ProtectedRoute>} />
          <Route path="/allocations" component={() => <ProtectedRoute><Allocations /></ProtectedRoute>} />
          <Route component={NotFound} />
        </Switch>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;