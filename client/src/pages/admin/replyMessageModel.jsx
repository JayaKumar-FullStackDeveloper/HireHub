import React, { useEffect, useState } from "react";
import axios from "axios";
import { IoMdSend } from "react-icons/io";
import { ImCross } from "react-icons/im";
import CustomAlert from "../../components/customAlert";



const ReplyMessageModel = ({ selectedNotification, closeModal, refreshNotifications }) => {
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });
  useEffect(() => {
      if (alert.message) {
        const timer = setTimeout(() => setAlert({ type: "", message: "" }), 2000);
        return () => clearTimeout(timer); 
      }
    }, [alert]);

  const userProfile = "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?t=st=1732953846~exp=1732957446~hmac=6a413d11de07736d45d3c36550ee1e1787a2ebad78cd525125b55e6ae793368d&w=740";
  // const adminProfile = "https://via.placeholder.com/150?text=Admin";

  const handleSend = async () => {
    if (!reply.trim()) {
      setAlert({ type: "info", message: "Reply cannot be empty! Enter Reply Messages.."});
      return;
    }

    try {
      setLoading(true); 
      const response = await axios.post(
        `http://localhost:4000/api/admin/reply/${selectedNotification._id}`,
        { reply }
      );

      if (response.status === 200) {
        setAlert({ type: "success", message: "Reply message was sended successfully!"});
        setReply("");
        setTimeout(()=>{
          closeModal();
        },2000)
        if (refreshNotifications) refreshNotifications(); 
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setAlert({ type: "error", message: `Error sending reply: ${ error.response.data.message }`});
    } else {
        setAlert({ type: "error", message: "Failed to send reply. Please try again." });
    }
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40">
       {alert.message && (
                <CustomAlert
          severity={alert.type}
          message={alert.message}
          className='z-50 absolute right-4 top-4'
        />
      )}
      <div className="bg-white w-11/12 max-w-md rounded-lg shadow-lg flex flex-col justify-between">
        {/* Modal Header */}
        <div className="flex items-center gap-4 p-2 bg-gray-100 border-b">
          <img
            src={userProfile}
            alt="User Profile"
            className="w-10 h-10 rounded-full"
          />
          <h2 className="text-lg font-medium text-gray-800">{selectedNotification.username}</h2>
          <button
            onClick={closeModal}
            className="ml-auto mr-2 text-gray-500 hover:text-gray-700"
          >
            <ImCross />
          </button>
        </div>

        {/* Conversation Section */}
        <div className="flex-1 p-4 overflow-y-auto">
          {/* User Message */}
          <div className="flex items-start gap-3 mb-4">
            <img
              src={userProfile}
              alt="User"
              className="w-8 h-8 rounded-full"
            />
            <div className="bg-gray-200 text-gray-700 px-4 py-2 rounded-xl max-w-xs">
              <p>{selectedNotification.message}</p>
            </div>
          </div>

          {/* {reply && (
            <div className="flex items-start gap-3 mb-4 justify-end">
              <div className="bg-blue-500 text-white px-4 py-2 rounded-xl max-w-xs">
                <p>{reply}</p>
              </div>
              <img
                src={adminProfile}
                alt="Admin"
                className="w-8 h-8 rounded-full"
              />
            </div>
          )} */}
        </div>

        {/* Reply Input Section */}
        <div className="flex items-center gap-2 border-t p-3 bg-gray-50">
          <textarea
            placeholder="Type a message"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            rows="1"
            style={{ resize: "none" }}
            disabled={loading}
            required
          />
          <button
            onClick={handleSend}
            className={`w-10 h-10 rounded-full flex justify-center items-center ${
              loading
                ? "bg-green-600 cursor-not-allowed"
                : "bg-green-600 hover:bg-blue-600 text-white"
            }`}
            disabled={loading} 
            aria-label="Send reply"
          >
            {loading ? "Sending ..." : <IoMdSend className="text-xl self-center m-auto"/>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReplyMessageModel;
