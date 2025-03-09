import React, { useState, useRef, useEffect } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  Fade,
} from "@mui/material";
import { FaHireAHelper } from "react-icons/fa";
import { styled } from "@mui/material/styles";
import {useNavigate} from "react-router-dom";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import axios from "axios";

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#784af4",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#784af4",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: "#eaeaf0",
    borderTopWidth: 3,
    borderRadius: 1,
  },
}));

const steps = [
  "Initial Authentication",
  "OTP Verification",
  "Company Information",
  "Upload Logo",
];

function RegistrationStepper() {
  const [activeStep, setActiveStep] = useState(() => {
    const savedStep = localStorage.getItem("activeStep");
    return savedStep ? parseInt(savedStep, 10) : 0;
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef([]);
  const intervalRef = useRef(null);
  const [formData, setFormData] = useState({
    email: "",
    companyName: "",
    phoneNumber: "",
    password: "",
    otp: ["", "", "", ""],
    foundYear: "",
    companyType: "",
    location: "",
    state: "",
    pincode: "",
    companyDescription: "",
    profileImage: null,
  });
  const [employerId , setEmployerId]= useState();
  const navigate = useNavigate();

  const handleNext = async () => {
    console.log(activeStep);
    try {
      setLoading(true);
      let response;
      let currentEmployerId = employerId;
  
      if (activeStep === 0) {
        const payload = {
          email: formData.email,
          companyName: formData.companyName,
          phoneNumber: formData.phoneNumber,
          password: formData.password,
        };
        response = await axios.post(
          "http://localhost:4000/api/employer/signup",
          payload,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
      } 
      else if (activeStep === 1) {
        const otpString = formData.otp.join("");
        if (otpString.length < 4) {
          alert("Please enter the full OTP.");
          return;
        }
        const payload = { otp: otpString, email: formData.email };
        response = await axios.post(
          "http://localhost:4000/api/employer/verify-otp",
          payload,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
  
        if (response?.status === 200) {
          currentEmployerId = response.data.employerId; 
          setEmployerId(currentEmployerId);  
        }
      } 
      else if (activeStep === 2) {
        const payload = {
          employerId: currentEmployerId,  
          foundYear: formData.foundYear,
          companyType: formData.companyType,
          location: formData.location,
          state: formData.state,
          pincode: formData.pincode,
        };
        response = await axios.put(
          `http://localhost:4000/api/employer/update`,
          payload,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
      } 
      else if (activeStep === 3) {
        const formDataToSend = new FormData();
        formDataToSend.append("employerId", currentEmployerId); 
        formDataToSend.append("companyDescription", formData.companyDescription);
        formDataToSend.append("profileImage", formData.profileImage);
  
        response = await axios.put(
          `http://localhost:4000/api/employer/update`,
          formDataToSend,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        navigate('/'); 
      }
  
      if (response?.status === 200) {
        setActiveStep((prev) => prev + 1);  
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      alert(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };
  

  const handleOnResendOtp = async (e) => {
    const payload = {
      email: formData.email,
    };
    try {
      await axios.post(
        "http://localhost:4000/api/employer/resend-otp",
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      alert("OTP was sent again to your email.");
      setTimer(60);
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(intervalRef.current);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    } catch (error) {
      console.error("Error while resending the OTP:", error);
      alert("Error occurred while resending OTP. Please try again.");
    }
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  useEffect(() => {
    localStorage.setItem("activeStep", activeStep);
  }, [activeStep]);

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (/^[0-9]$/.test(value) || value === "") {
      const newOtp = [...formData.otp];
      newOtp[index] = value;
      setFormData((prev) => ({ ...prev, otp: newOtp }));
      if (value !== "" && index < 3) {
        inputsRef.current[index + 1]?.focus();
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }
  
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target.result);
      };
      reader.onerror = (error) => {
        console.error("File reading error", error);
      };
  
      reader.readAsDataURL(file); 
      setFormData((prev) => ({ ...prev, profileImage: file })); 
    }
  };

  useEffect(() => {
    if (activeStep === 1) {
      setTimer(60);
      intervalRef.current = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(intervalRef.current);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [activeStep]);

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <div className="flex flex-col gap-4 w-full">
            <TextField
              label="Email"
              fullWidth
              size="small"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
            />
            <TextField
              label="Company Name"
              fullWidth
              size="small"
              value={formData.companyName}
              onChange={(e) => handleInputChange("companyName", e.target.value)}
            />
            <TextField
              label="Mobile Number"
              fullWidth
              size="small"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
              type="number"
            />
            <TextField
              label="Password"
              fullWidth
              size="small"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              type="password"
            />
          </div>
        );
      case 1:
        return (
          <form
            className="flex flex-col space-y-4"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="flex justify-center space-x-2">
              {formData.otp.map((value, index) => (
                <input
                  key={index}
                  type="text"
                  className="w-12 h-12 text-center text-2xl border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                  value={value}
                  onChange={(e) => handleOtpChange(e, index)}
                  ref={(el) => (inputsRef.current[index] = el)}
                  maxLength="1"
                />
              ))}
            </div>
            <button
              type="submit"
              className={`w-full py-2 text-white rounded-lg transition duration-200 ${
                formData.otp.join("").length === 4
                  ? "bg-slate-500 hover:bg-slate-600"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              disabled={formData.otp.join("").length !== 4 || timer <= 0}
              onClick={handleNext}
            >
              Verify OTP
            </button>
            <div className="text-center text-gray-700 mt-2">
              {timer > 0
                ? `OTP is valid for ${timer} seconds`
                : "OTP expired, please request a new one."}
            </div>
          </form>
        );
      case 2:
        return (
          <div className="flex flex-col gap-4 w-full">
            <TextField
              label="Year Founded"
              fullWidth
              size="small"
              type="number"
              value={formData.foundYear}
              onChange={(e) => handleInputChange("foundYear", e.target.value)}
            />
            <FormControl fullWidth>
              <InputLabel size="small">Company Type</InputLabel>
              <Select
                label="Company Type"
                size="small"
                className="text-left"
                value={formData.companyType}
                onChange={(e) =>
                  handleInputChange("companyType", e.target.value)
                }
              >
                <MenuItem value="Private">Private</MenuItem>
                <MenuItem value="Public">Public</MenuItem>
                <MenuItem value="NGO">NGO</MenuItem>
                <MenuItem value="Startup">Startup</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="location"
              fullWidth
              size="small"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
            />
            <TextField
              label="State"
              fullWidth
              size="small"
              value={formData.state}
              onChange={(e) => handleInputChange("state", e.target.value)}
            />
            <TextField
              label="Pincode"
              fullWidth
              size="small"
              type="number"
              value={formData.pincode}
              onChange={(e) => handleInputChange("pincode", e.target.value)}
            />
          </div>
        );
      case 3:
        return (
          <div className="flex flex-col gap-4 w-full">
            <div
              className={`${
                selectedImage ? "w-24 border" : "w-full border-dashed"
              } h-24 border-2 border-gray-400 rounded-lg flex justify-center self-center items-center overflow-hidden relative bg-gray-100 cursor-pointer`}
              onClick={() => document.getElementById("file-input").click()}
            >
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt="Uploaded Logo"
                  className="w-full h-full object-cover self-center"
                />
              ) : (
                <span className="text-gray-500 w-full">
                  Upload Company Logo
                </span>
              )}
              <input
                id="file-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>

            <textarea
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 locationholder-gray-400 text-sm resize-none"
              rows={6}
              locationholder="Describe your company..."
              value={formData.companyDescription}
              onChange={(e) =>
                handleInputChange("companyDescription", e.target.value)
              }
            ></textarea>
          </div>
        );
      default:
        return "Unknown step";
    }
  };

  return (
    <div className="relative w-screen h-screen flex justify-center items-center bg-gray-100 overflow-hidden">
      <div
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center filter blur-sm z-0"
        style={{
          backgroundImage:
            "url('https://img.freepik.com/free-photo/large-sunny-room-with-wide-views-peaceful-feel_157027-4459.jpg?t=st=1733567866~exp=1733571466~hmac=ade98043ddb26496b2e9883c70cd27ec7430fe8f1326c5bfe87984922de2c80b&w=1380')",
        }}
      ></div>

      <div className="relative z-10 bg-white rounded-lg shadow-xl w-full max-w-5xl flex p-8 gap-10">
        <div className="w-2/5 px-2 bg-gradient-to-br from-amber-50 to-sky-100 rounded-lg shadow-md h-[520px] py-20">
          <div className="flex flex-col items-center mb-6">
            <div className="flex items-center pb-2 pt-2 px-4">
              <FaHireAHelper className="text-4xl text-sky-600" />
              <h1 className="text-sky-600 text-3xl font-bold ml-2">HireHub</h1>
            </div>
            <h1 className="text-2xl font-bold text-stone-700 self-center font-poppins">
              Step Into Smarter Hiring!
            </h1>
          </div>
          <p className="text-lg text-center font-medium mb-6 text-cyan-950 font-roboto">
            Empowering businesses to find the best talent and build teams for
            the future. Let's grow together and make hiring smarter, faster, and
            easier!
          </p>
        </div>

        <div className="w-3/5 flex flex-col relative items-center h-[520px] rounded-lg  border-2 p-4">
          <h3 className="flex flex-col self-center w-full font-kanit text-purple-950  font-semibold text-2xl">
            SignUp
          </h3>
          <h3 className="flex flex-col self-center w-full font-poppins text-teal-600  font-medium text-sm mb-2">
            Join us with this following Steps, Welcome!
          </h3>
          <Box className="w-full mt-1">
            <Stepper
              alternativeLabel
              activeStep={activeStep}
              connector={<QontoConnector />}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel size="small">{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <Fade in={true}>
              <div className="flex flex-col items-center mt-6 px-10 w-10/12 mx-auto">
                <div className="w-full max-w-md">
                  {renderStepContent(activeStep)}
                </div>
              </div>
            </Fade>
            <div className="absolute bottom-4 left-0 w-full px-10">
              <div
                className={`flex w-full max-w-md ${
                  activeStep === 0 || activeStep === 2
                    ? "justify-end"
                    : "justify-between"
                }`}
              >
                {activeStep !== 0 && activeStep !== 2 && (
                  <Button disabled={activeStep === 0} onClick={handleBack}>
                    Back
                  </Button>
                )}
                {activeStep === 1 ? (
                  <span
                    className="block text-pink-600 text-sm text-right self-center font-bold hover:text-pink-800 cursor-pointer"
                    onClick={handleOnResendOtp}
                  >
                    Resend OTP
                  </span>
                ) : (
                  ""
                )}
                <div className="flex relative">
                  {loading && (
                    <div
                      style={{
                        width: "100px",
                        height: "100px",
                        overflow: "clip",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <dotlottie-player
                        src="https://lottie.host/139ac713-b441-45d8-8f00-3031e66e77ae/rNGEZFSghp.lottie"
                        background="transparent"
                        speed="1"
                        style={{
                          width: "300px",
                          height: "300px",
                        }}
                        loop
                        autoplay
                      ></dotlottie-player>
                    </div>
                  )}

                  {/* "Next" button is shown when loading is false */}
                  {!loading &&
                    activeStep !== 1 &&
                    activeStep < steps.length - 1 && (
                      <Button variant="contained" onClick={handleNext}>
                        Next
                      </Button>
                    )}
                  {activeStep === steps.length - 1 && (
                    <Button variant="contained" onClick={handleNext}>Submit</Button>
                  )}
                </div>
              </div>
            </div>
          </Box>
        </div>
      </div>
    </div>
  );
}

export default RegistrationStepper;
