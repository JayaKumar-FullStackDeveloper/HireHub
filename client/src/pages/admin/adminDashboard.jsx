import React, { useState } from "react";
import { FaTachometerAlt, FaStore, FaChartPie, FaComments, FaUsers, FaCog, FaSignOutAlt } from "react-icons/fa";
import { FaHireAHelper } from "react-icons/fa6";
import { RiMenuFold4Line, RiMenuFold3Line2 } from "react-icons/ri";
import { Link } from "react-router-dom";



function AdminDashboard({ children }) {
    const [isCollapsed, setIsCollapsed] = useState(false);


    return (
        <>
            <div className="flex flex-row h-screen w-full">
                {/* sidebar */}
                <div className={`flex w-72 bg-grey h-screen  ${isCollapsed ? "w-16" : "w-72"
                    } bg-white flex-col transition-all duration-100`}>
                    <div className="flex items-center pb-1 z-50">
                        <button className="flex self-center gap-2 ml-2 " >
                            <FaHireAHelper className='text-3xl mx-2 text-blue my-3' />
                            <h1 className={`text-center self-center text-sky-600 ${isCollapsed ? "hidden" : "block"
                                } pr-8 text-2xl font-bold`}>HireHub</h1>
                        </button>
                    </div>
                    <div className='bg-white h-full w-full flex flex-col justify-between'>
                        {/* Menu Section */}
                        <ul className="mt-8">
                            {/* Top Menu Items */}
                            <li className={`hover:bg-gray-300 ${!isCollapsed && "rounded-r-full"} transition-all duration-100`}>
                                <Link className="flex items-center px-4 py-2 text-gray-700">
                                    <FaTachometerAlt className="text-lg     " />
                                    {!isCollapsed && <span className="ml-4">Dashboard</span>}
                                </Link>
                            </li>
                            <li className={`hover:bg-gray-300 ${!isCollapsed && "rounded-r-full"} transition-all duration-100`}>
                                <Link className="flex items-center px-4 py-2 text-gray-700">
                                    <FaStore className="text-lg" />
                                    {!isCollapsed && <span className="ml-4">My Store</span>}
                                </Link>
                            </li>
                            <li className={`hover:bg-gray-300 ${!isCollapsed && "rounded-r-full"} transition-all duration-100`}>
                                <Link className="flex items-center px-4 py-2 text-gray-700">
                                    <FaChartPie className="text-lg" />
                                    {!isCollapsed && <span className="ml-4">Analytics</span>}
                                </Link>
                            </li>
                            <li className={`hover:bg-gray-300 ${!isCollapsed && "rounded-r-full"} transition-all duration-100`}>
                                <Link className="flex items-center px-4 py-2 text-gray-700">
                                    <FaComments className="text-lg" />
                                    {!isCollapsed && <span className="ml-4">Message</span>}
                                </Link>
                            </li>
                            <li className={`hover:bg-gray-300 ${!isCollapsed && "rounded-r-full"} transition-all duration-100`}>
                                <Link className="flex items-center px-4 py-2 text-gray-700">
                                    <FaUsers className="text-lg" />
                                    {!isCollapsed && <span className="ml-4">Team</span>}
                                </Link>
                            </li>
                        </ul>
                        <div className="mb-4">
                        <ul className="w-full">
                            <li className={`hover:bg-gray-300 ${!isCollapsed && "rounded-r-full"} transition-all duration-100`}>
                                <Link className="flex items-center px-4 py-2 text-gray-700">
                                    <FaCog className="text-lg" />
                                    {!isCollapsed && <span className="ml-4">Settings</span>}
                                </Link>
                            </li>
                            <li className={`hover:bg-gray-300 ${!isCollapsed && "rounded-r-full"} transition-all duration-100`}>
                                <Link className="flex items-center px-4 py-2 text-red-600">
                                    <FaSignOutAlt className="text-lg" />
                                    {!isCollapsed && <span className="ml-4">Logout</span>}
                                </Link>
                            </li>
                        </ul>
                        </div>
                    </div>
                </div>
                {/* header */}
                <div className='flex flex-col w-full h-screen bg-white'>
                    <div className='w-full h-16 flex px-1 my-auto justify-between bg-white'>
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
                    <div className='bg-orange-200 w-full h-screen rounded-tl-3xl'>
                        {children}
                    </div>
                </div>


            </div>
        </>
    );
}

export default AdminDashboard;
