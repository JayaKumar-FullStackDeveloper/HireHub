import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import { AuthProvider } from '../components/AuthProvider';
import { AdminRoute } from '../components/ProtectedRoutes';
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
        // element: <UserRoute />,
        children: [
          { path:'', element:<HomePage/>},
        ],
      },

      {
        path: '/admin/dashboard',
        element: <AdminRoute />,
        children: [
        { path: '', element: <AdminDashboard></AdminDashboard> }

        ],
      },
      { path: 'auth/admin/login', element: <AdminLogin /> },
      { path: '*', element: <Error404 /> },
    ],
  },
]);
