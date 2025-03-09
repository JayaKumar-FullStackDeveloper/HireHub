import axios from 'axios';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/AuthProvider';
import { Link } from 'react-router-dom';


function EmployerLogin() {

    const { login } = useAuth();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:4000/api/employer/signin", formData);
            const userResponse = await axios.get("http://localhost:4000/api/employer/me", {
                headers: { Authorization: `Bearer ${response.data.token}` },
              });
        
              login(userResponse.data, response.data.token);
              console.log('Login Successful');
              navigate('/employer');
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred. Please try again.');
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <div className=" max-w-md mx-auto my-10 bg-pink-100 p-5 rounded shadow-md ">
            <h2 className="text-2xl font-bold text-pink-600 mb-5">Login</h2>
            {error && <div className="mb-4 text-red-600">{error}</div>}
            <form onSubmit={handleOnSubmit}>
                <div className="mb-4">
                    <label className="block text-pink-600 text-sm text-left font-bold mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        name="email"
                        value={formData.email}
                        onChange={handleOnChange}
                    />
                </div>
                <div className="mb-4 relative">
                    <label className="block text-pink-600 text-sm text-left font-bold mb-2" htmlFor="password">
                        Password
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        name="password"
                        value={formData.password}
                        onChange={handleOnChange}
                    />
                    <div
                        className="absolute inset-y-0 right-0 pr-3 pt-7 flex items-center cursor-pointer"
                        onClick={togglePasswordVisibility}
                    >
                        <FontAwesomeIcon icon={showPassword ?  faEye: faEyeSlash } className="text-pink-600" />
                    </div>
                </div>

                <Link to={'/forgot-password'} ><span className='block text-pink-600 text-sm text-right font-bold mb-3 hover:text-pink-800'>Forgot Password?</span></Link>
                <button
                    className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                    type="submit"
                >
                    Login
                </button>
            </form>
            <div className="mt-4 text-center">
                <p className="text-pink-600">Don't have an account?</p>
                <button
                    className="text-pink-500 hover:text-pink-700 font-bold"
                    onClick={() => navigate('/employe')}
                >
                    Register Here
                </button>
            </div>
        </div>
    );
}

export default EmployerLogin;
