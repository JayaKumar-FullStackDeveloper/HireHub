import React, { useState, useEffect } from "react";
import ReplyMessageModel from "./replyMessageModel";
import axios from "axios";
import { motion } from "framer-motion";

const NotificationPage = ({ isCollapsed }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/admin/notification"
        );
        setNotifications(response.data || []);
        setError(null); 
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setError("Failed to load notifications. Please try again later.");
      } finally {
        setLoading(false); 
      }
    };

    fetchNotifications();
  }, [notifications]);

  const openModal = (notification) => {
    setSelectedNotification(notification);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedNotification(null);
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1 },
    }),
  };

  const unreadNotifications = notifications
    .filter((n) => n.status === "Unread")
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const readNotifications = notifications
    .filter((n) => n.status === "replied")
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  const sortedNotifications = [...unreadNotifications, ...readNotifications];

  return (
    <div className={`mx-auto ${isCollapsed ? "max-w-7xl" : "max-w-6xl"}`}>
      <div className="bg-gray-100  p-4">
        <h1 className="text-xl font-bold mb-4 text-left">Notifications</h1>

        {/* Error Message */}
        {error && (
          <div className="text-red-500 text-center mb-4">{error}</div>
        )}

        {/* Notifications Table */}
        <div
          className="w-full h-[540px] overflow-scroll scrollbar-hide border border-gray-300 rounded-lg"
          style={{
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
          }}
        >
          <table className="w-full bg-white border-collapse">
            <thead className="bg-gray-200 sticky -top-0 w-full">
              <tr>
                <th className="py-3 px-4 border">S.No</th>
                <th className="py-2 px-4 border whitespace-nowrap">
                  Full Name
                </th>
                <th className="py-2 px-4 border whitespace-nowrap">
                  Date and Time
                </th>
                <th className="py-2 px-4 border whitespace-nowrap">Message</th>
                <th className="py-2 px-4 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {/* Loading Skeleton */}
              {loading &&
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index}>
                    <td className="py-2 px-2 border-y text-center">
                      <div className="animate-pulse h-4 bg-gray-300 rounded"></div>
                    </td>
                    <td className="py-2 px-3 border-y text-center">
                      <div className="animate-pulse h-4 bg-gray-300 rounded"></div>
                    </td>
                    <td className="py-2 px-3 border-y text-center">
                      <div className="animate-pulse h-4 bg-gray-300 rounded"></div>
                    </td>
                    <td className="py-2 px-3 border-y text-center">
                      <div className="animate-pulse h-4 bg-gray-300 rounded"></div>
                    </td>
                    <td className="py-2 px-3 border-y text-center">
                      <div className="animate-pulse h-4 bg-gray-300 rounded"></div>
                    </td>
                  </tr>
                ))}

              {/* Render Notifications */}
              {!loading &&
                (sortedNotifications.length > 0 ? (
                  sortedNotifications.map((notification, index) => (
                    <motion.tr
                      key={notification._id}
                      className="text-center hover:bg-gray-100 cursor-pointer"
                      custom={index}
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <td className="py-3 px-2 whitespace-nowrap text-base font-normal">
                        {index + 1}
                      </td>
                      <td className="py-3 px-2 whitespace-nowrap text-base font-normal">
                        {notification.username}
                      </td>
                      <td className="py-3 px-2 whitespace-nowrap text-base font-normal">
                        {new Date(notification.createdAt).toLocaleString()}
                      </td>
                      <td className="py-3 px-2 text-base font-normal">
                        {notification.message}
                      </td>
                      <td className="py-3 px-2 whitespace-nowrap text-base font-normal">
                        {notification.status === "Unread" ? (
                          <button
                            onClick={() => openModal(notification)}
                            className="bg-emerald-700 text-white py-1 px-4 rounded-md hover:bg-blue-600"
                            aria-label={`Reply to notification from ${notification.username}`}
                          >
                            Reply
                          </button>
                        ) : (
                          <span className="text-blue-500">Replied</span>
                        )}
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-4 text-center text-gray-500">
                      No notifications available.
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Reply Modal */}
        {isModalOpen && selectedNotification && (
          <ReplyMessageModel
            selectedNotification={selectedNotification}
            closeModal={closeModal}
          />
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
