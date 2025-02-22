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
          <Route path="/login">{() => <AuthPage />}</Route>
          <Route path="/dashboard">
            {() => (
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            )}
          </Route>
          <Route path="/items">
            {() => (
              <ProtectedRoute>
                <Items />
              </ProtectedRoute>
            )}
          </Route>
          <Route path="/employees">
            {() => (
              <ProtectedRoute>
                <Employees />
              </ProtectedRoute>
            )}
          </Route>
          <Route path="/reports">
            {() => (
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            )}
          </Route>
          <Route path="/maintenance">
            {() => (
              <ProtectedRoute>
                <Maintenance />
              </ProtectedRoute>
            )}
          </Route>
          <Route path="/allocations">
            {() => (
              <ProtectedRoute>
                <Allocations />
              </ProtectedRoute>
            )}
          </Route>
          <Route>{() => <NotFound />}</Route>
        </Switch>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
