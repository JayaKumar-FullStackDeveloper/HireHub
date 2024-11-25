import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import { AuthProvider } from '../components/AuthProvider';
import { AdminRoute } from '../components/ProtectedRoutes';
import Error404 from '../components/Error404';
import AdminLogin from '../pages/admin/adminLogin';
import AdminDashboard from '../pages/admin/adminDashboard';
import HomePage from '../components/home';
import DashboardOverview from '../pages/admin/dashboardOverview';
import ApprovedCompany from '../pages/admin/approvedCompany';
import RejectedCompany from '../pages/admin/rejectedCompany';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AuthProvider>
        <App />
      </AuthProvider>
    ),
    children: [
      {
        path: '/',
        // element: <UserRoute />,
        children: [
          { path:'', element:<HomePage/>},
        ],
      },
      
      {
        path: '/admin',
        element: <AdminRoute />,
        children: [
          { path: '', element: <AdminDashboard><DashboardOverview/></AdminDashboard> },
          { path: 'dashboard/approved-application', element: <AdminDashboard><ApprovedCompany/></AdminDashboard> },
          { path: 'dashboard/manage-application', element: <AdminDashboard><ApprovedCompany/></AdminDashboard> },
          { path: 'dashboard/rejected-application', element: <AdminDashboard><RejectedCompany/></AdminDashboard> }

        ],
      },
      { path: 'auth/admin/login', element: <AdminLogin /> },
      { path: '*', element: <Error404 /> },
    ],
  },
]);
