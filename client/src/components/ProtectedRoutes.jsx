import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export const AdminRoute = () => {
  const { user } = useAuth();
  if (user && user.role === 'admin') {
    return <Outlet />;
  } else {
    console.log("Not authorized, redirecting to login");
    return <Navigate to="/auth/admin/login" />;
  }
};

export const EmployerRoute = () => {
  const { user } = useAuth();
  return user && (user.role === "employer") ? (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow bg-gray-50">
        <Outlet />
      </main>
    </div>
  ) : (
    <Navigate to="/auth/employer/signin" />
  );
};
