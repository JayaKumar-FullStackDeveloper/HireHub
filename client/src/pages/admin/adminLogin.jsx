import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/AuthProvider';
import { Link } from 'react-router-dom';
import {
    FaHireAHelper,
} from "react-icons/fa";


function AdminLogin() {

    const { login } = useAuth();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const images = [
        "/images/a.png",
        "/images/b.png",
        "/images/c.png",
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [images.length]);

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:4000/api/admin/login", formData);
            console.log(response, "res");
            const userResponse = await axios.get("http://localhost:4000/api/admin/me", {
                headers: { Authorization: `Bearer ${response.data.token} `},
            });

            login(userResponse.data, response.data.token);
            console.log('Login Successful');
            navigate('/admin');
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred. Please try again.');
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <div className="w-full h-screen flex bg-cyan-50 bg-opacity-40">
            {/* Carousel Section */}
            <div className="w-1/2 h-full flex items-center justify-center">
                <div className="relative w-96 h-4/5 overflow-hidden rounded-lg">
                    {images.map((image, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? "opacity-100" : "opacity-0"
                                }`}
                        >
                            <img
                                src={image}
                                alt={`Slide ${index + 1}`}
                                className="w-full h-full object-cover animate-[pan_10s_linear_infinite]"
                            />
                        </div>
                    ))}
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                className={`w-3 h-3 rounded-full ${index === currentImageIndex
                                        ? "bg-white scale-125"
                                        : "bg-gray-400"
                                    } transition-transform duration-300`}
                                onClick={() => setCurrentImageIndex(index)}
                            ></button>
                        ))}
                    </div>
                </div>

            </div>

            {/* Login Form Section */}
            <div className="w-1/2 h-full flex flex-col items-center justify-center bg-cyan-50 bg-opacity-40">
            <h2 className="text-2xl font-bold text-pink-600 mb-5 text-left">Admin Login</h2>
                <div className="max-w-md w-full bg-white p-5 rounded shadow-md">
                <div className="flex items-center pb-1 pt-4 px-4 flex-col gap-2">
                    <FaHireAHelper className="text-7xl text-sky-600" />
                    <h1 className="text-sky-600 text-2xl font-bold ml-2">HireHub</h1>
                </div>
                    <h2 className='text-sm font-bold text-blue mb-5 text-center'>Login to access your job portal account</h2>
                    {error && <div className="mb-4 text-red-600">{error}</div>}
                    <form onSubmit={handleOnSubmit}>
                        <div className="mb-4">
                            <label
                                className="block text-pink-600 text-sm font-bold mb-2 text-left"
                                htmlFor="email"
                            >
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
                            <label
                                className="block text-pink-600 text-sm font-bold mb-2 text-left"
                                htmlFor="password"
                            >
                                Password
                            </label>
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
                        <Link to="/forgot-password">
                            <span className="block text-pink-600 text-sm text-right font-bold mb-3 hover:text-pink-800">
                                Forgot Password?
                            </span>
                        </Link>
                        <button
                            className="bg-sky-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                            type="submit"
                        >
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </div>

    );
}

export default AdminLogin;