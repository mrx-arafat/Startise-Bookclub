import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "@/components/ui/sonner";

// Admin Pages
import AdminLayout from "@/layouts/AdminLayout";
import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminBooks from "@/pages/admin/Books";
import AdminBorrowRequests from "@/pages/admin/BorrowRequests";
import AdminSuggestions from "@/pages/admin/Suggestions";
import AdminUsers from "@/pages/admin/Users";

// User Pages
import UserLayout from "@/layouts/UserLayout";
import UserLogin from "@/pages/user/Login";
import UserDashboard from "@/pages/user/Dashboard";
import UserBooks from "@/pages/user/Books";
import UserBorrowRequests from "@/pages/user/BorrowRequests";
import UserSuggestions from "@/pages/user/Suggestions";

import ProtectedRoute from "@/components/ProtectedRoute";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/user/login" replace />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/login" replace />} />
            <Route path="login" element={<AdminLogin />} />

            {/* Protected Admin Routes */}
            <Route
              path="dashboard"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="books"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminBooks />
                </ProtectedRoute>
              }
            />
            <Route
              path="borrow-requests"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminBorrowRequests />
                </ProtectedRoute>
              }
            />
            <Route
              path="suggestions"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminSuggestions />
                </ProtectedRoute>
              }
            />
            <Route
              path="users"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminUsers />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* User Routes */}
          <Route path="/user" element={<UserLayout />}>
            <Route index element={<Navigate to="/user/login" replace />} />
            <Route path="login" element={<UserLogin />} />

            {/* Protected User Routes */}
            <Route
              path="dashboard"
              element={
                <ProtectedRoute>
                  <UserBooks />
                </ProtectedRoute>
              }
            />
            <Route
              path="books"
              element={
                <ProtectedRoute>
                  <UserBooks />
                </ProtectedRoute>
              }
            />
            <Route
              path="borrow-requests"
              element={
                <ProtectedRoute>
                  <UserBorrowRequests />
                </ProtectedRoute>
              }
            />
            <Route
              path="suggestions"
              element={
                <ProtectedRoute>
                  <UserSuggestions />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/user/login" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
