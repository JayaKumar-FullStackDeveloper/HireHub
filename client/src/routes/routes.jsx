import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import { AuthProvider } from '../components/AuthProvider';
import { AdminRoute, UserRoute } from '../components/ProtectedRoutes';
import Error404 from '../components/Error404';
import AdminLogin from '../pages/admin/adminLogin';
import AdminDashboard from '../pages/admin/adminDashboard';
import HomePage from '../components/home';

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
        element: <UserRoute />,
        children: [
          { path:'', element:<HomePage/>},
          { path: 'dashboard', element: <AdminDashboard></AdminDashboard> },  
        ],
      },

      {
        path: '/admin',
        element: <AdminRoute />,
        children: [
        ],
      },
      { path: 'auth/admin/login', element: <AdminLogin /> },
      { path: '*', element: <Error404 /> },
    ],
  },
]);
