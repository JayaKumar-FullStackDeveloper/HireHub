import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import { AuthProvider } from '../components/AuthProvider';
import { AdminRoute } from '../components/ProtectedRoutes';
import Error404 from '../components/Error404';
import AdminLogin from '../pages/admin/adminLogin';
import AdminDashboard from '../pages/admin/adminDashboard';
import HomePage from '../components/home';
import DashboardOverview from '../pages/admin/dashboardOverview';
import ManagedCompany from '../pages/admin/companies/managedCompany';
import ApprovedCompanyies from '../pages/admin/companies/approvedCompany';
import RejectedCompanys from '../pages/admin/companies/rejectedCompany';
import PaidCandidates from '../pages/admin/candidates/paidCandidate';
import UnPaidCandidates from '../pages/admin/candidates/unPaidCandidates';
import AddCandidates from '../pages/admin/candidates/addCandidates';
import ImportCandidate from '../pages/admin/candidates/importCandidate';

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
          { path: 'dashboard/Companies/Approved', element: <AdminDashboard><ApprovedCompanyies/></AdminDashboard> },
          { path: 'dashboard/Companies/Rejected', element: <AdminDashboard><RejectedCompanys/></AdminDashboard> },
          { path: 'dashboard/Companies/Manage', element: <AdminDashboard><ManagedCompany/></AdminDashboard> },
          { path: 'dashboard/candidates/paid', element: <AdminDashboard><PaidCandidates/></AdminDashboard> },
          { path: 'dashboard/candidates/unpaid', element: <AdminDashboard><UnPaidCandidates/></AdminDashboard> },
          { path: 'dashboard/candidates/add', element: <AdminDashboard><AddCandidates/></AdminDashboard> },
          { path: 'dashboard/candidates/import', element: <AdminDashboard><ImportCandidate/></AdminDashboard> },
        ],
      },
      { path: 'auth/admin/login', element: <AdminLogin /> },
      { path: '*', element: <Error404 /> },
    ],
  },
]);
