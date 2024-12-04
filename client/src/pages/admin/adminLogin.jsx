import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/AuthProvider';
import { FaHireAHelper } from "react-icons/fa";
import CustomAlert from '../../components/customAlert';

function AdminLogin() {
    const { login } = useAuth();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [alert, setAlert] = useState({ type: "", message: "" });
    useEffect(() => {
        if (alert.message) {
          const timer = setTimeout(() => setAlert({ type: "", message: "" }), 2000);
          return () => clearTimeout(timer); 
        }
      }, [alert]);

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const images = ["/images/a.png", "/images/b.png", "/images/c.png"];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [images.length]);

    const validateForm = () => {
        if (!formData.email) {
            setError('Email is required');
            return false;
        }
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
            setError('Enter a valid email');
            return false;
        }
        if (!/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(formData.password)){
            setError('Enter a valid Password');
            return false;
        }
        return true;
    };

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!validateForm()) return;

        setLoading(true);
        try {
            const response = await axios.post("http://localhost:4000/api/admin/login", formData);
            const userResponse = await axios.get("http://localhost:4000/api/admin/me", {
                headers: { Authorization: `Bearer ${response.data.token}` },
            });
            login(userResponse.data, response.data.token);
            setAlert({ type: "success", message: `Login Successfully! Redirect to Dashboard.`});
            setTimeout(() => {
                navigate('/admin');
              }, 2000);
            
        } catch (error) {
            if (error.response?.data?.message) {
                setAlert({ type: "error", message: error.response.data.message });
            } else {
                setAlert({ type: "error", message: "An error occurred to Login. Please try again." });
            }
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <div className="w-full h-screen relative flex bg-cyan-50 bg-opacity-40">
                {alert.message && (
                <CustomAlert
          severity={alert.type}
          message={alert.message}
          className='z-50 absolute right-4 top-4'
        />
      )} 
            <div className="w-1/2 h-full flex items-center justify-center">
                <div className="relative w-96 h-4/5 overflow-hidden rounded-lg">
                    {images.map((image, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? "opacity-100" : "opacity-0"}`}
                        >
                            <img
                                src={image}
                                alt={`Slide ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                className={`w-3 h-3 rounded-full ${index === currentImageIndex ? "bg-white scale-125" : "bg-gray-400"} transition-transform duration-300`}
                                onClick={() => setCurrentImageIndex(index)}
                            ></button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="w-1/2 h-full flex flex-col items-center justify-center bg-cyan-50 bg-opacity-40">
                <h2 className="text-2xl font-bold text-pink-600 mb-5 text-left">Admin Login</h2>
                <div className="max-w-md w-full bg-white p-5 rounded shadow-md">
                    <div className="flex items-center pb-1 pt-4 px-4 flex-col gap-2">
                        <FaHireAHelper className="text-7xl text-sky-600" />
                        <h1 className="text-sky-600 text-2xl font-bold ml-2">HireHub</h1>
                    </div>
                    <h2 className='text-sm font-bold text-blue mb-5 text-center'>Login to access your job portal account</h2>
                    {error && <div className="mb-4 text-orange-500">{error}</div>}
                    <form onSubmit={handleOnSubmit}>
                        <div className="mb-4">
                            <label className="block text-zinc-950 text-sm font-bold mb-2 text-left" htmlFor="email">Email</label>
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
                            <label className="block text-zinc-950 text-sm font-bold mb-2 text-left" htmlFor="password">Password</label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                name="password"
                                value={formData.password}
                                onChange={handleOnChange}
                            />
                            <div
                                className="absolute inset-y-0 right-0 pr-3 pt-7 flex items-center cursor-pointer"
                                onClick={togglePasswordVisibility}
                            >
                                <FontAwesomeIcon
                                    icon={showPassword ? faEye : faEyeSlash}
                                    className="text-pink-600"
                                />
                            </div>
                        </div>
                        <button
                            className="bg-sky-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AdminLogin;
