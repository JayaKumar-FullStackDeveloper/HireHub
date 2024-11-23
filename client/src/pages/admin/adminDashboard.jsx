import React, { useState } from "react";
import {
    FaTachometerAlt,
    FaStore,
    FaChartPie,
    FaComments,
    FaCog,
    FaSignOutAlt,
    FaHireAHelper,
} from "react-icons/fa";
import { RiMenuFold4Line, RiMenuFold3Line2 } from "react-icons/ri";
import { Link } from "react-router-dom";

function AdminDashboard({ children }) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <>
            <div className="flex flex-row h-screen w-full">
                {/* Sidebar */}
                <div
                    className={`flex ${isCollapsed ? "w-16" : "w-72"
                        } bg-white h-screen flex-col transition-all duration-300`}
                >
                    {/* Logo Section */}
                    <div className="flex items-center pb-4 pt-4 px-4">
                        <FaHireAHelper className="text-3xl text-sky-600" />
                        {!isCollapsed && (
                            <h1 className="text-sky-600 text-2xl font-bold ml-2">HireHub</h1>
                        )}
                    </div>

                    {/* Menu Section */}
                    <div className="flex-1 bg-white flex flex-col justify-between">
                        <ul className="mt-4">
                            {/* Menu Items */}
                            {[
                                { icon: <FaTachometerAlt />, label: "Dashboard" },
                                { icon: <FaStore />, label: "Candidates" },
                                { icon: <FaChartPie />, label: "Companies" },
                                { icon: <FaComments />, label: "Notifications" },
                            ].map((item, index) => (
                                <li
                                    key={index}
                                    className={`hover:bg-gray-300 ${!isCollapsed && "rounded-r-full"
                                        } transition-all duration-100`}
                                >
                                    <Link className="flex items-center px-4 py-2 text-gray-700">
                                        {item.icon}
                                        {!isCollapsed && (
                                            <span className="ml-4">{item.label}</span>
                                        )}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <ul className="mb-4">
                            <li
                                className={`hover:bg-gray-300 ${!isCollapsed && "rounded-r-full"
                                    } transition-all duration-100`}
                            >
                                <Link className="flex items-center px-4 py-2 text-gray-700">
                                    <FaCog className="text-lg" />
                                    {!isCollapsed && <span className="ml-4">Settings</span>}
                                </Link>
                            </li>
                            <li
                                className={`hover:bg-gray-300 ${!isCollapsed && "rounded-r-full"
                                    } transition-all duration-100`}
                            >
                                <Link className="flex items-center px-4 py-2 text-red-600">
                                    <FaSignOutAlt className="text-lg" />
                                    {!isCollapsed && <span className="ml-4">Logout</span>}
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className='flex flex-col w-full h-screen bg-white'>
                    <div className='w-full bg-white h-16 flex px-1 my-auto justify-between'>
                        <div className='flex mx-2 w-full'>
                            <button onClick={() => setIsCollapsed(!isCollapsed)}>
                                {isCollapsed ? <RiMenuFold4Line className='text-xl my-auto ' /> : <RiMenuFold3Line2 className='text-xl my-auto ' />

                                }
                            </button>
                            <span className="lg:ml-2 text-primary lg:text-base font-medium text-left my-auto">Admin Panel</span>
                            <div className='my-auto pl-4 w-3/5'>
                                <form action="#">
                                    <div className="flex relative">
                                        <input type="search" placeholder="Search..." className='h-8 rounded-3xl w-full relative pl-4 text-sm bg-slate-200' />
                                        <button type="submit" class="search-btn absolute right-0 h-full bg-blue my-auto pt-1 rounded-r-3xl px-2">
                                            <lord-icon
                                                src="https://cdn.lordicon.com/fkdzyfle.json"
                                                trigger="click"
                                                style={{ width: '22px', height: '22px' }}
                                                colors="primary:#ffffff"
                                            >
                                            </lord-icon></button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className='flex w-full'>
                            <span className="lg:ml-2 text-primary lg:text-xl font-bold hidden text-right w-full my-auto mr-5 sm:block">surya</span>
                        </div>


                    </div>
                    {/* content  */}
                    <div className='bg-gray-100 w-full h-screen rounded-tl-3xl'>
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminDashboard;
