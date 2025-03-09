import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import { AuthProvider } from '../components/AuthProvider';
import { AdminRoute, EmployerRoute } from '../components/ProtectedRoutes';
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
import ImportCandidates from '../pages/admin/candidates/importCandidate';
import NotificationPage from '../pages/admin/emailNotification';
import InternApplication from '../pages/admin/candidates/internapplication';
import JobAppllication from '../pages/admin/candidates/joblist';
import EmployeSignUp from '../pages/employe/employeSignUp';
import EmployerLogin from '../pages/employe/employerLogin';
import EmployerDashboard from '../pages/employe/employerDashboard';
import EmpDashboardOverview from '../pages/employe/empDashboardOverview';
import PostInternship from '../pages/employe/intern/postIntern';

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
          { path:'employe', element:<EmployeSignUp/>},
          { path:'/auth/employer/signin', element:<EmployerLogin/>},
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
          { path: 'dashboard/candidates/import', element: <AdminDashboard><ImportCandidates/></AdminDashboard> },
          { path: 'dashboard/notifications/email', element: <AdminDashboard><NotificationPage/></AdminDashboard> },
          { path: 'dashboard/candidates/Intern', element: <AdminDashboard><InternApplication/></AdminDashboard> },
          { path: 'dashboard/candidates/Jobs', element: <AdminDashboard><JobAppllication/></AdminDashboard> },
        ],
      },
      {
        path: '/employer',
        element: <EmployerRoute/>,
        children: [
          { path: '', element: <EmployerDashboard><EmpDashboardOverview/></EmployerDashboard> },
          { path: 'dashboard/internship/post', element: <EmployerDashboard><PostInternship/></EmployerDashboard> },
        ],
      },
      { path: 'auth/admin/login', element: <AdminLogin /> },
      { path: '*', element: <Error404 /> },
    ],
  },
]);
