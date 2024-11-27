import React, { useState, useEffect } from "react";
import {
  FaTachometerAlt,
  FaStore,
  FaChartPie,
  FaComments,
  FaCog,
  FaSignOutAlt,
  FaHireAHelper,
} from "react-icons/fa";
import { RiMenuFoldFill, RiMenuUnfoldFill } from "react-icons/ri";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LogoutConfirmation from "./logoutConfirmation";
import { useAuth } from "../../components/AuthProvider";
import { RiArrowDownDoubleFill } from "react-icons/ri";


function AdminDashboard({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    if (location.pathname === "/admin") {
      setActiveMenu("Dashboard");
    } else if (location.pathname.includes("candidates")) {
      setActiveMenu("Candidates");
    } else if (location.pathname.includes("companies")) {
      setActiveMenu("Companies");
    } else if (location.pathname.includes("notifications")) {
      setActiveMenu("Notifications");
    } else {
      setActiveMenu(null);
    }
  }, [location.pathname]);

  const handleMenuClick = (menu) => {
    setActiveMenu((prevMenu) => (prevMenu === menu.label ? null : menu.label));
    navigate(menu.route);
  };

  const handleLogoutClick = () => {
    setIsModalOpen(true);
  };

  const handleLogoutConfirm = () => {
    setIsModalOpen(false);
    logout();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

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
              {[
                {
                  icon: <FaTachometerAlt />,
                  label: "Dashboard",
                  route: "/admin",
                },
                { icon: <FaStore />, label: "Candidates" },
                { icon: <FaChartPie />, label: "Companies" },
                { icon: <FaComments />, label: "Notifications" },
              ].map((item, index) => (
                <li key={index}>
                  <button
                    className={`flex items-center w-full px-4 py-2 justify-between text-gray-700 ${activeMenu === item.label ? "bg-blue text-white" : ""
                      }`}
                    onClick={() => handleMenuClick(item)}
                  >
                    <div className="flex my-auto">
                      <span className="ml-2 my-auto self-center">{item.icon}</span>
                      {!isCollapsed && <span className="ml-4">{item.label}</span>}</div>
                    {activeMenu === item.label ? (
                      item.label === 'Dashboard' ? null : (
                        <RiArrowDownDoubleFill className="rotate-180"/>
                      )
                    ) : (
                      item.label === 'Dashboard' ? null : <RiArrowDownDoubleFill className="text-amber-600" />
                    )}

                  </button>

                  {/* Submenus */}
                  {item.label === "Candidates" &&
                    activeMenu === "Candidates" &&
                    !isCollapsed && (
                      <ul className="ml-8 mt-1 text-left">
                        {[
                          {
                            label: "Paid Candidates",
                            route: "/dashboard/candidates/paid",
                          },
                          {
                            label: "Unpaid Candidates",
                            route: "/dashboard/candidates/unpaid",
                          },
                          {
                            label: "Add Candidates",
                            route: "/dashboard/candidates/add",
                          },
                          {
                            label: "Import Candidates",
                            route: "/dashboard/candidates/import",
                          },
                        ].map((submenu, subIndex) => (
                          <Link to={submenu.route} key={subIndex}>
                            <li
                              className={`px-4 py-2 rounded-lg cursor-pointer ${isActive(submenu.route)
                                ? "bg-blue hover:bg-blue text-white"
                                : "hover:bg-gray-200 "
                                }`}
                            >
                              {submenu.label}
                            </li>
                          </Link>
                        ))}
                      </ul>
                    )}
                  {item.label === "Companies" &&
                    activeMenu === "Companies" &&
                    !isCollapsed && (
                      <ul className="ml-8 mt-1 text-left">
                        {[
                          {
                            label: "Manage Applications",
                            route: "/admin/dashboard/companies/manage",
                          },
                          {
                            label: "Approved Applications",
                            route: "/admin/dashboard/companies/approved",
                          },
                          {
                            label: "Rejected Applications",
                            route: "/admin/dashboard/companies/rejected",
                          }
                        ].map((submenu, subIndex) => (
                          <Link to={submenu.route} key={subIndex}>
                            <li
                              className={`px-4 py-2 cursor-pointer ${isActive(submenu.route)
                                ? "bg-blue text-white"
                                : "hover:bg-gray-100"
                                }`}
                            >
                              {submenu.label}
                            </li>
                          </Link>
                        ))}
                      </ul>
                    )}
                  {item.label === "Notifications" &&
                    activeMenu === "Notifications" &&
                    !isCollapsed && (
                      <ul className="ml-8 mt-2 text-left">
                        {[
                          {
                            label: "Email",
                            route: "/dashboard/notifications/email",
                          },
                        ].map((submenu, subIndex) => (
                          <Link to={submenu.route} key={subIndex}>
                            <li
                              className={`px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-200 ${isActive(submenu.route)
                                ? "bg-blue text-white"
                                : ""
                                }`}
                            >
                              {submenu.label}
                            </li>
                          </Link>
                        ))}
                      </ul>
                    )}
                </li>
              ))}
            </ul>
            <ul className="mb-4">
              <li>
                <button className="flex items-center w-full px-4 py-2 text-gray-700 hover:text-blue">
                  <FaCog className="text-lg" />
                  {!isCollapsed && <span className="ml-4">Settings</span>}
                </button>
              </li>
              <li>
                <button
                  className="flex items-center w-full px-4 py-2 text-red-600 hover:text-red-800"
                  onClick={handleLogoutClick}
                >
                  <FaSignOutAlt className="text-lg" />
                  {!isCollapsed && <span className="ml-4">Logout</span>}
                </button>
                {isModalOpen && (
                  <LogoutConfirmation
                    onLogout={handleLogoutConfirm}
                    onCancel={handleCancel}
                  />
                )}
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col w-full h-screen bg-white">
          <div className="w-full bg-white h-16 flex px-1 my-auto justify-between">
            <div className='flex mx-2 w-full'>
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-2"
              >
                {isCollapsed ? (
                  <RiMenuUnfoldFill className="text-xl" />
                ) : (
                  <RiMenuFoldFill className="text-xl" />
                )}
              </button>
              <span className="lg:ml-2 text-primary lg:text-base font-medium text-left my-auto">Admin Panel</span>
              <div className="my-auto pl-4 w-3/5">
                <form action="#">
                  <div className="flex relative">
                    <input
                      type="search"
                      placeholder="Search..."
                      className="h-8 rounded-3xl w-full relative pl-4 text-sm bg-slate-200"
                    />
                    <button
                      type="submit"
                      class="search-btn absolute right-0 h-full bg-blue my-auto pt-1 rounded-r-3xl px-2"
                    >
                      <lord-icon
                        src="https://cdn.lordicon.com/fkdzyfle.json"
                        trigger="click"
                        style={{ width: "22px", height: "22px" }}
                        colors="primary:#ffffff"
                      ></lord-icon>
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="flex w-full">
              <span className="lg:ml-2 text-primary lg:text-xl font-bold hidden text-right w-full my-auto mr-5 sm:block">
                {user.name}
              </span>
            </div>{" "}
          </div>
          <div className="bg-gray-100 w-full h-screen rounded-tl-3xl p-2 overflow-y-auto">

            {children}
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;
