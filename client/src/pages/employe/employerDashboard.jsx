import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  FaComments,
  FaSignOutAlt,
  FaHireAHelper,
} from "react-icons/fa";
import { ImOffice } from "react-icons/im";
import { BsPersonWorkspace } from "react-icons/bs";
import { BiSolidDashboard } from "react-icons/bi";
import { RiMenuFoldFill, RiMenuUnfoldFill } from "react-icons/ri";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LogoutConfirmation from "../admin/logoutConfirmation";
import { MdHomeWork } from "react-icons/md";
import { useAuth } from "../../components/AuthProvider";
import { RiArrowDownDoubleFill } from "react-icons/ri";
import { AiFillLike, AiFillDislike } from "react-icons/ai";
import { IoCalendarSharp } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import axios from "axios";

function EmployerDashboard({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const isActive = (path) => location.pathname === path;
  const [employerData, setEmployerData] = useState([]);

  const fetchEmployerData = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/employer/me/${user.id}`);
      setEmployerData(response.data);
    } catch (err) {
      console.log(err.message);
    }
  }, [user.id]);
  const { profileImageUrl } = employerData;
  const imageUrl = `http://localhost:3000/${profileImageUrl}`;

  useEffect(() => {
    fetchEmployerData();
  }, [user, fetchEmployerData]);

  useEffect(() => {
    if (employerData.length > 0) {
      fetchEmployerData();
    }
  }, [employerData, fetchEmployerData]);
  console.log(employerData);


  useEffect(() => {
    if (location.pathname === "/employer") {
      setActiveMenu("Dashboard");
    } else if (location.pathname.includes("Interview Calendar")) {
      setActiveMenu("Interview Calendar");
    } else if (location.pathname.includes("internship")) {
      setActiveMenu("Internship");
    } else if (location.pathname.includes("jobs")) {
      setActiveMenu("Jobs");
    } else if (location.pathname.includes("approved")) {
      setActiveMenu("Approved Application");
    } else if (location.pathname.includes("rejected")) {
      setActiveMenu("Rejected Application");
    } else if (location.pathname.includes("face2face")) {
      setActiveMenu("Face 2 Face");
    } else if (location.pathname.includes("offer")) {
      setActiveMenu("Offer Oasis");
    } else {
      setActiveMenu(null);
    }
  }, [location.pathname]);

  const handleMenuClick = (menu) => {
    setActiveMenu((prevMenu) => (prevMenu === menu.label ? null : menu.label));
    navigate(menu.route);
  };

  const handleLogoutClick = () => {
    console.log("Logging out...");
    setIsModalOpen(true); 
  };

  const handleLogoutConfirm = async () => {
    await logout();
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(e.target) && 
        !e.target.closest(".profile-image")
      ) {
        setIsMenuOpen(false); 
      }
    };
  
    document.addEventListener("mousedown", handleOutsideClick);
  
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <>
      <div className="flex flex-row h-screen w-full">
        {/* Sidebar */}
        <div
          className={`flex ${isCollapsed ? "w-16" : "w-72"
            } bg-white h-screen flex-col transition-all duration-300`}
        >
          {/* Logo Section */}
          <Link to='/employer'>
            <div className="flex items-center pb-4 pt-4 px-4">
              <FaHireAHelper className="text-3xl text-sky-600" />
              {!isCollapsed && (
                <h1 className="text-sky-600 text-2xl font-bold ml-2">HireHub</h1>
              )}
            </div></Link>


          {/* Menu Section */}
          <div className="flex-1 bg-white flex flex-col justify-between">
            <ul className="mt-4">
              {[
                {
                  icon: <BiSolidDashboard className="text-xl" />,
                  label: "Dashboard",
                  route: "/employer",
                },
                { icon: <IoCalendarSharp className="text-lg" />, label: "Interview Calendar" },
                { icon: <MdHomeWork className="text-lg" />, label: "Internship" },
                { icon: <ImOffice className="text-lg" />, label: "Jobs" },
                { icon: <AiFillLike className="text-lg whitespace-nowrap" />, label: "Approved Application" },
                { icon: <AiFillDislike className="text-lg" />, label: "Rejected Application" },
                { icon: <BsPersonWorkspace className="text-lg" />, label: "Face 2 Face" },
                { icon: <FaComments className="text-lg" />, label: "Offer Oasis" },
              ].map((item, index) => (
                <li key={index} className="pb-1">
                  <button
                    className={`flex items-center w-full px-4 py-2 justify-between text-gray-700 ${activeMenu === item.label ? "bg-blue text-white" : "hover:bg-slate-100"
                      }`}
                    onClick={() => handleMenuClick(item)}
                  >
                    <div className="flex my-auto">
                      <span className="my-auto self-center">{item.icon}</span>
                      {!isCollapsed && <span className="ml-2">{item.label}</span>}</div>
                    {!isCollapsed && item.label !== 'Dashboard' && item.label !== 'Interview Calendar' && (
                      activeMenu === item.label ? (
                        <RiArrowDownDoubleFill className="rotate-180" />
                      ) : (
                        <RiArrowDownDoubleFill className="text-amber-600" />
                      )
                    )}
                  </button>

                  {/* Submenus */}
                  {item.label === "Internship" &&
                    activeMenu === "Internship" &&
                    !isCollapsed && (
                      <ul className="ml-8 mt-1 text-left">
                        {[
                          {
                            label: "Post Internship",
                            route: "/employer/dashboard/internship/post",
                          },
                          {
                            label: "Posted Internship",
                            route: "/employer/dashboard/internship/posted",
                          },
                          {
                            label: "Application",
                            route: "/employer/dashboard/internship/application",
                          }
                        ].map((submenu, subIndex) => (
                          <Link to={submenu.route} key={subIndex}>
                            <li
                              className={`px-4 py-2 cursor-pointer ${isActive(submenu.route)
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
                  {item.label === "Jobs" &&
                    activeMenu === "Jobs" &&
                    !isCollapsed && (
                      <ul className="ml-8 mt-1 text-left">
                        {[
                          {
                            label: "Post Jobs",
                            route: "/employer/dashboard/jobs/post",
                          },
                          {
                            label: "Posted Jobs",
                            route: "/employer/dashboard/jobs/posted",
                          },
                          {
                            label: "Application",
                            route: "/employer/dashboard/jobs/application",
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
                  {item.label === "Approved Application" &&
                    activeMenu === "Approved Application" &&
                    !isCollapsed && (
                      <ul className="ml-8 mt-2 text-left">
                        {[
                          {
                            label: "Jobs",
                            route: "/employer/dashboard/approved/jobs",
                          },
                          {
                            label: "Internship",
                            route: "/employer/dashboard/approved/intern",
                          },
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
                  {item.label === "Rejected Application" &&
                    activeMenu === "Rejected Application" &&
                    !isCollapsed && (
                      <ul className="ml-8 mt-2 text-left">
                        {[
                          {
                            label: "Jobs",
                            route: "/employer/dashboard/rejected/jobs",
                          },
                          {
                            label: "Internship",
                            route: "/employer/dashboard/rejected/intern",
                          },
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
                  {item.label === "Face 2 Face" &&
                    activeMenu === "Face 2 Face" &&
                    !isCollapsed && (
                      <ul className="ml-8 mt-2 text-left">
                        {[
                          {
                            label: "Jobs",
                            route: "/employer/dashboard/face2face/jobs",
                          },
                          {
                            label: "Internship",
                            route: "/employer/dashboard/face2face/intern",
                          },
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
                  {item.label === "Offer Oasis" &&
                    activeMenu === "Offer Oasis" &&
                    !isCollapsed && (
                      <ul className="ml-8 mt-2 text-left">
                        {[
                          {
                            label: "Jobs",
                            route: "/employer/dashboard/offer/jobs",
                          },
                          {
                            label: "Internship",
                            route: "/employer/dashboard/offer/intern",
                          },
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
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex flex-col w-screen h-screen bg-white">
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
              <span className="lg:ml-2 text-primary lg:text-base font-medium text-left my-auto">Employer Dash Panel</span>
              <div className="my-auto pl-4 w-3/5 relative">
                <form >
                  <div className="flex relative">
                    <input
                      type="text"
                      placeholder="Search by user or company name"
                      // value={query}
                      // onChange={(e) => setQuery(e.target.value)}
                      className="h-8 rounded-3xl w-full relative pl-4 text-sm bg-slate-200 focus:outline-none p-2 border focus:ring-blue focus:border-blue"
                    />
                    <button
                      type="submit"
                      className="search-btn absolute right-0 h-full bg-blue my-auto pt-1 rounded-r-3xl px-2"
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
            <div className="flex w-full justify-end self-center relative cursor-pointer" onClick={toggleMenu}>
              <div className="self-center w-10 h-10">{imageUrl ? (
                <img
                  src={imageUrl}
                  alt="img"
                  className="self-center w-10 h-10 rounded-full cursor-pointer"
                />
              ) : (
                <div
                  className="w-10 h-10 bg-gray-200 rounded-full flex justify-center items-center cursor-pointer"
                >
                  <FaUser className="text-gray-500" size={20} />
                </div>
              )}</div>
              <div className="self-center pr-6">
                <span className="text-primary self-center lg:text-xl font-bold hidden text-right w-full my-auto sm:block">
                {employerData.companyName}
              </span>
              </div>
              {isMenuOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute top-12 right-5 bg-white shadow-lg rounded-lg w-48 py-2 z-50"
                >
                  <div className="text-gray-700">
                    <div
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        closeMenu();
                        console.log("Navigate to My Profile");
                      }}
                    >
                      My Profile
                    </div>
                    <div
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        console.log("Navigate to Settings");
                        // Navigate to Settings page
                      }}
                    >
                      Settings
                    </div>
                    <div
                      className="px-4 py-2 hover:bg-orange-600 hover:text-white self-center text-red cursor-pointer"
                      onClick={() => {
                        console.log("Logging out...");
                        handleLogoutClick(); 
                        setIsMenuOpen(false); 
                      }}
                    >
                      <div className="flex w-full gap-2 px-auto">
                        <FaSignOutAlt className="text-lg self-center" />
                        <span className="self-center">Logout</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {isModalOpen && (
                <LogoutConfirmation
                  onLogout={handleLogoutConfirm}
                  onCancel={handleCancel}
                />
              )}
            </div>
          </div>


          <div className="bg-gray-100 w-full h-screen rounded-tl-3xl p-2 overflow-y-auto">
            {React.cloneElement(children, { isCollapsed, user, employerData })}</div>
        </div>
      </div>
    </>
  );
}

export default EmployerDashboard;
