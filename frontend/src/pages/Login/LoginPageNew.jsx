"use client"

import { useEffect, useState } from "react"
import {
  RiUploadLine,
  RiLockLine,
  RiMailLine,
  RiUserLine,
  RiCalendarLine,
  RiBuilding2Line,
  RiInformationLine,
  RiCloseLine,
  RiShieldUserLine,
  RiGovernmentLine,
  RiUser3Line,
} from "react-icons/ri"

import departmentInfo from "@/utils/departmentInfo";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { ToasterNotification } from "@/utils/ToastNotification/ToastNotification";
import { useNavigate } from "react-router";
import AuthService from "@/api/services/auth.services";
import { login } from "@/store/authSlice";

function Login() {
  // State management
  const [isLogin, setIsLogin] = useState(true)
  const [isForgetPassword, setIsForgetPassword] = useState(false)
  const [toShowResendCode, setToShowResendCode] = useState(false)
  const [verificationSent, setVerificationSent] = useState(false)
  const [role, setRole] = useState("citizen")
  const [gender, setGender] = useState("Male")
  const [avatar, setAvatar] = useState(null)
  const [previewAvatar, setPreviewAvatar] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [location, setLocation] = useState({ latitude: null, longitude: null })
  const [resendEmail, setResendEmail] = useState("")
  const navigate = useNavigate()
  // error state
  const [error, setError] = useState({});
  // dispatch instance to handle redux store
  const dispatch = useDispatch();
  // user role data object
  const userRoles = [
    { label: "Citizen", value: "citizen" },
    { label: "Authority", value: "authority" },
  ]
  // user genders data object
  const genders = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Other", value: "Other" },
  ];

  const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
      control,
    } = useForm();

  // Department data
//   const departments = [
//     { id: 1, title: "Police Department" },
//     { id: 2, title: "Fire Department" },
//     { id: 3, title: "Health Department" },
//     { id: 4, title: "Education Department" },
//     { id: 5, title: "Transportation Department" },
//   ]

  // Role descriptions
  const roleDescriptions = {
    citizen: "Regular users who can report issues and track their status",
    authority: "Officials from government departments who manage reported issues",
    admin: "System administrators with full access to manage users and content",
  }

  // fetch current device location on login page load
    useEffect(() => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          setError(error.message);
        }
      );
    }, []);

    // submit data handler
      const onLoginUser = handleSubmit(async (data) => {
        try {
          setIsLoading(true);
          // console.log(data)

          // login the user
          await AuthService.loginUser({
            email: data.email,
            password: data.password,
            verificationCode: data.loginVerificationCode || null
          });
    
          // get the current user details and store in redux store
          const userDetails = await AuthService.getCurrentUser();
          
          dispatch(login(userDetails));
    
          // success notification
          ToasterNotification({
            type: "success",
            title: "",
            description: "Login successful",
          });
          setToShowResendCode(false)
          setResendEmail("")
    
          let redirectPath = "";
          if(userDetails?.role == "authority") {
            redirectPath = "/authority-dashboard"
          } else{
            redirectPath = "/"
          }
    
          setTimeout(() => {
            navigate(redirectPath); // navigate to home page after 2 seconds
          }, 2000);
          
        } catch (error) {
          console.log(error);
          setResendEmail(data.email)

          if(error.message === "Verification Code Expired" || error.message === "Invalid Verification Code") {
            setToShowResendCode(true)

            ToasterNotification({
              type: "error",
              title: "Login Failed",
              description: `${error.message} You can request for a new code`,
            });
    
            return;
          }
    
          setToShowResendCode(false)
          reset()

          ToasterNotification({
            type: "error",
            title: "Login Failed",
            description: `${error.message}`,
          });
        } finally {
          setIsLoading(false);
        }
      });

  const onRegisterUser = handleSubmit(async (data) => {
    try{

      setIsLoading(true)

      console.log(data, role, gender, avatar, location)
  
      if(!avatar || !location.latitude || !location.longitude) {
        setError(prev => ({
          ...prev,
          avatar: {
            message: "Avatar image is required"
          }
        }))

        if(!location.latitude || !location.longitude) {
          throw new Error("Error while fetching user location, Make sure you have given location access!")
        }

        return;
      }
  
      // register the user first
      await AuthService.registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        latitude: location.latitude,
        longitude: location.longitude,
        age: data.age,
        gender: gender,
        role: role,
        avatar: avatar,
        departmentId: data?.departmentId,
      });
  
      if(data.role === "citizen") {
        // success notification
        ToasterNotification({
          type: "success",
          title: "Registration Successfull",
          description: "Your account has been created successfully! check you email for verification code and Login",
        });
      } else{
        // success notification
        ToasterNotification({
          type: "success",
          title: "Registration Successfull",
          description: "Your account has been created successfully! You’ll receive an email once your account is verified.",
        });
      }
  
      setIsLogin(true)
      reset()
    } catch(error) {
      console.log(error)

      ToasterNotification({
        type: "error",
        title: "User Registeration Failed",
        description: `${error.message}`,
      });
    } finally{
      setIsLoading(false)
    }
  })

  const handleResendVerificationCode = async () => {
    try{
      setIsLoading(true)

      if(resendEmail === "") throw new Error("Email is missing")

      await AuthService.generateNewVerificationCode({email: resendEmail})

      ToasterNotification({
        type: "success",
        title: "New Verification Code generated!",
        description: `A new verification code has been sent to your mail`,
      });

    }catch(error) {
      console.log(error)
      ToasterNotification({
        type: "error",
        title: "Resend Verification Code Failed",
        description: `${error.message}`,
      });
    } finally{
      setIsLoading(false)
    }
  }

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setAvatar(file)
      setPreviewAvatar(URL.createObjectURL(file))
      setError(prev => {
        const { avatar, ...rest } = prev;
        return rest;
      });
    }
  }

  // Remove profile image
  const removeProfileImage = () => {
    setAvatar(null)
    setPreviewAvatar(null)
  }

  const [verificationCode, setVerificationCode] = useState("")

  // Handle forget password
  const handleForgetPassword = handleSubmit(async (data) => {
    try {
      setIsLoading(true)
      console.log(data)

      if(!verificationSent) {
        const response = await AuthService.updateUserPassword({email: data.email, newPassword: data.password, isCodeSent: false})
  
        setVerificationCode(response.data.data?.verificationCode)
        setVerificationSent(true)
  
        return;
      } else{
        // verify the code
        if(data.verificationCode !== verificationCode) 
          throw new Error("Verification Code did not match!")
  
        await AuthService.updateUserPassword({email: data.email, newPassword: data.password, isCodeSent: true})

        ToasterNotification({
          type: "success",
          title: "",
          description: "Password has been changed successfully",
        });
      }
      reset()
    } catch(error) {
      console.log(error)
      ToasterNotification({
        type: "error",
        title: "",
        description: `${error.message}`,
      });
    } finally {
      setIsLoading(false)
    }
  })

  // Profile image component
  const ProfileImageUpload = () => (
    <div className="flex flex-col items-center mb-6">
      <div className="relative">
        {previewAvatar ? (
          <div className="relative">
            <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-gray-300 dark:border-zinc-600">
              <img
                src={previewAvatar || "/placeholder.svg"}
                alt="Profile preview"
                className="h-full w-full object-cover"
              />
            </div>
            <button
              type="button"
              onClick={removeProfileImage}
              className="absolute -top-2 -right-2 bg-white dark:bg-zinc-700 rounded-full p-1 shadow-md hover:bg-gray-100 dark:hover:bg-zinc-600 transition-colors"
              aria-label="Remove profile image"
            >
              <RiCloseLine className="text-gray-700 dark:text-zinc-300" size={18} />
            </button>
          </div>
        ) : (
          <div className="h-24 w-24 rounded-full bg-gray-200 dark:bg-zinc-700 flex items-center justify-center border-2 border-gray-300 dark:border-zinc-600">
            <RiUserLine className="text-gray-400 dark:text-zinc-400" size={36} />
          </div>
        )}
      </div>
      <label className="cursor-pointer mt-3 inline-flex items-center space-x-2 bg-gray-100 dark:bg-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-600 transition duration-200 py-2 px-4 rounded-md">
        <RiUploadLine className="text-gray-600 dark:text-zinc-300" />
        <span className="text-sm text-gray-600 dark:text-zinc-300">{previewAvatar ? "Change Image" : "Upload Image"}</span>
        <input type="file" id="avatar" name="avatar" accept="image/*" onChange={handleFileChange} className="hidden" />
      </label>
      {error.avatar && <p className="text-red-500 dark:text-red-400 text-xs">{error.avatar?.message}</p>}
    </div>
  )

  // Render login form
  const renderLoginForm = () => (
    <form onSubmit={onLoginUser} className="space-y-4 w-full dark:bg-zinc-800 font-outfit">
      <div className="space-y-1">
        <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium dark:text-zinc-300">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <RiMailLine className="text-gray-400 dark:text-zinc-500" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="pl-10 w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-md focus:ring-1 focus:ring-zinc-800 dark:focus:ring-zinc-400 focus:outline-none focus:border-black dark:focus:border-zinc-400 dark:bg-zinc-700 dark:text-zinc-100"
                placeholder="your@email.com"
                {...register("email", { required: "email is required" })}
              />
            </div>
        </div>
        {!errors.email && <p className="text-red-500 dark:text-red-400 text-xs">{errors.email?.message}</p>}
      </div>

      <div className="space-y-1">
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium dark:text-zinc-300">
            Password
          </label>
          <div className="relative flex flex-col">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <RiLockLine className="text-gray-400 dark:text-zinc-500" />
            </div>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="pl-10 w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-md focus:ring-1 focus:ring-zinc-800 dark:focus:ring-zinc-400 focus:outline-none focus:border-black dark:focus:border-zinc-400 dark:bg-zinc-700 dark:text-zinc-100"
              placeholder="••••••••"
              {...register("password", { required: "password is required"})}
            />
        </div>
        </div>
        {errors.password && <p className="text-red-500 dark:text-red-400 text-xs">{errors.password?.message}</p>}
      </div>

      
      <div className="space-y-1">
        <div className="space-y-2">
          <label htmlFor="verificationCode" className="block text-sm font-medium dark:text-zinc-300">
              Verification Code <span className="text-xs text-zinc-400 dark:text-zinc-500">(optional)</span>
            </label>
            <input
              id="loginVerificationCode"
              name="loginVerificationCode"
              type="text"
              className="w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-md focus:ring-1 focus:ring-black dark:focus:ring-zinc-400 focus:border-black dark:focus:border-zinc-400 dark:bg-zinc-700 dark:text-zinc-100"
              placeholder={`Enter verification code..`}
              {...register("loginVerificationCode")}
            />
        </div>
        {errors.loginVerificationCode && <p className="text-red-500 dark:text-red-400 text-xs">{errors.loginVerificationCode?.message}</p>}
        {toShowResendCode && <button type="button" onClick={handleResendVerificationCode} className="text-blue-500 dark:text-blue-400 text-xs bg-blue-100 dark:bg-blue-900/30 p-1 rounded-md">Resend Verification Code</button>}
      </div>
      

      <button
        type="submit"
        className="w-full bg-black dark:bg-zinc-900 text-white dark:text-zinc-100 py-2 px-4 rounded-md hover:bg-gray-800 dark:hover:bg-zinc-700 transition duration-200"
      >
        {isLoading ? "Loading..." : "Login"}
      </button>

      <div className="flex justify-between items-center text-sm">
        <button
          type="button"
          onClick={() => {
            setIsForgetPassword(true)
            setIsLogin(false)
          }}
          className="text-gray-600 dark:text-zinc-400 hover:underline"
        >
          Forgot password?
        </button>
        <button type="button" onClick={() => setIsLogin(false)} className="text-gray-600 dark:text-zinc-400 hover:underline">
          Create account
        </button>
      </div>
    </form>
  )

  // Render signup form
  const renderSignupForm = () => (
    <form onSubmit={onRegisterUser} className="space-y-4 w-full dark:bg-zinc-800">
      {/* Profile Image Upload at the top */}
      <ProfileImageUpload />

      <div className="space-y-2">
        <div className="space-y-1">
            <label htmlFor="name" className="block text-sm font-medium dark:text-zinc-300">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <RiUserLine className="text-gray-400 dark:text-zinc-500" />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="pl-10 w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-md focus:ring-1 focus:ring-black dark:focus:ring-zinc-400 focus:border-black dark:focus:border-zinc-400 dark:bg-zinc-700 dark:text-zinc-100"
                placeholder="your name..."
                {...register("name", {minLength: {value: 6, message: "Name must be minimum 7 characters long"}})}
              />
            </div>
            {errors.name && <p className="text-red-500 dark:text-red-400 text-xs">{errors.name?.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <div className="space-y-1">
            <label htmlFor="age" className="block text-sm font-medium dark:text-zinc-300">
              Age
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <RiCalendarLine className="text-gray-400 dark:text-zinc-500" />
              </div>
              <input
                id="age"
                name="age"
                type="number"
                required
                className="pl-10 w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-md focus:ring-1 focus:ring-black dark:focus:ring-zinc-400 focus:border-black dark:focus:border-zinc-400 dark:bg-zinc-700 dark:text-zinc-100"
                placeholder="25"
                {...register("age", {required: "age is required" , min: {value: 18, message: "Age must be minimum 18 years old"}, max: {value: 110, message: "Age can't be greater than 110 years old"}})}
              />
            </div>
        </div>
        {errors.age && <p className="text-red-500 dark:text-red-400 text-xs">{errors.age?.message}</p>}
      </div>

      <div className="space-y-1">
        <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium dark:text-zinc-300">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <RiMailLine className="text-gray-400 dark:text-zinc-500" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="pl-10 w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-md focus:ring-1 focus:ring-zinc-800 dark:focus:ring-zinc-400 focus:outline-none focus:border-black dark:focus:border-zinc-400 dark:bg-zinc-700 dark:text-zinc-100"
                placeholder="your@email.com"
                {...register("email", { required: "email is required" })}
              />
            </div>
        </div>
        {errors.email && <p className="text-red-500 dark:text-red-400 text-xs">{errors.email?.message}</p>}
      </div>

      <div className="space-y-2">
        <div className="space-y-1">
          <label className="block text-sm font-medium dark:text-zinc-300">Gender</label>
          <div className="flex flex-wrap gap-4">
            {["Male", "Female", "Other"].map((option) => (
              <label key={option} className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value={option}
                  checked={gender === option}
                  onChange={() => {
                    setGender(option)
                    setError(prev => {
                      const { role, ...rest } = prev;
                      return rest;
                    });
                  }}
                  className="mr-2 focus:ring-black dark:focus:ring-zinc-400 h-4 w-4 text-black dark:text-zinc-300 border-gray-300 dark:border-zinc-600"
                />
                <span className="dark:text-zinc-300">{option}</span>
              </label>
            ))}
          </div>
        </div>
        {error.role && <p className="text-red-500 dark:text-red-400 text-xs">{error.role?.message}</p>}
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium dark:text-zinc-300">Role</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { id: "citizen", label: "Citizen", icon: <RiUser3Line size={20} /> },
            { id: "authority", label: "Authority", icon: <RiGovernmentLine size={20} /> },
            { id: "admin", label: "Admin", icon: <RiShieldUserLine size={20} /> },
          ].map((option) => (
            <div
              key={option.id}
              onClick={() => setRole(option.id)}
              className={`cursor-pointer border rounded-lg p-3 transition-all ${
                role === option.id 
                  ? "border-black dark:border-zinc-400 bg-gray-50 dark:bg-zinc-700" 
                  : "border-gray-200 dark:border-zinc-700 hover:border-gray-400 dark:hover:border-zinc-500"
              }`}
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  name="role"
                  value={option.id}
                  checked={role === option.id}
                  onChange={() => setRole(option.id)}
                  className="mr-2 focus:ring-black dark:focus:ring-zinc-400 h-4 w-4 text-black dark:text-zinc-300 border-gray-300 dark:border-zinc-600"
                />
                <div className="flex items-center">
                  <span className="mr-2 dark:text-zinc-300">{option.icon}</span>
                  <span className="font-medium dark:text-zinc-300">{option.label}</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1 ml-6">{roleDescriptions[option.id]}</p>
            </div>
          ))}
        </div>
      </div>

      {(role === "authority") && (
        <div className="space-y-2 p-3 border border-gray-200 dark:border-zinc-700 rounded-md bg-gray-50 dark:bg-zinc-700/50">
          {role === "authority" && (
            <div className="space-y-2">
              <div className="space-y-1">

                <label htmlFor="department" className="block text-sm font-medium dark:text-zinc-300">
                  Department
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <RiBuilding2Line className="text-gray-400 dark:text-zinc-500" />
                  </div>
                  <select
                    id="department"
                    name="department"
                    required
                    className="pl-10 w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-md focus:ring-1 focus:ring-black dark:focus:ring-zinc-400 focus:border-black dark:focus:border-zinc-400 dark:bg-zinc-700 dark:text-zinc-100 appearance-none"
                    {...register("departmentId", {
                      required: "Department is required",
                    })}
                  >
                    <option value="">Select department</option>
                    {departmentInfo.map((dept) => (
                      <option key={dept.departmentId} value={dept.departmentId} className="dark:bg-zinc-700">
                        {dept.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {errors.departmentId && <p className="text-red-500 dark:text-red-400 text-xs">{errors.departmentId?.message}</p>}
            </div>
          )}
        </div>
      )}

      <div className="space-y-1">
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium dark:text-zinc-300">
            Password
          </label>
          <div className="relative flex flex-col">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <RiLockLine className="text-gray-400 dark:text-zinc-500" />
            </div>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="pl-10 w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-md focus:ring-1 focus:ring-zinc-800 dark:focus:ring-zinc-400 focus:outline-none focus:border-black dark:focus:border-zinc-400 dark:bg-zinc-700 dark:text-zinc-100"
              placeholder="••••••••"
              {...register("password", {required: "password is required", minLength: {value: 6, message: "Password must be atleast 6 chrachters long"}})}
            />
        </div>
        </div>
        {errors.password && <p className="text-red-500 dark:text-red-400 text-xs">{errors.password?.message}</p>}
      </div>

      <button
        type="submit"
        className="w-full bg-black dark:bg-zinc-900 text-white dark:text-zinc-100 py-2 px-4 rounded-md hover:bg-gray-800 dark:hover:bg-zinc-700 transition duration-200"
      >
        {isLoading ? "Loading..." : "Create Account"}
      </button>

      <div className="text-center text-sm">
        <button type="button" onClick={() => setIsLogin(true)} className="text-gray-600 dark:text-zinc-400 hover:underline">
          Already have an account? Login
        </button>
      </div>
    </form>
  )

  // Render forget password form
  const renderForgetPasswordForm = () => (
    <form onSubmit={handleForgetPassword} className="space-y-4 w-full dark:bg-zinc-800">
      {!verificationSent ? (
        <>
          <div className="space-y-1">
              <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium dark:text-zinc-300">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <RiMailLine className="text-gray-400 dark:text-zinc-500" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="pl-10 w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-md focus:ring-1 focus:ring-zinc-800 dark:focus:ring-zinc-400 focus:outline-none focus:border-black dark:focus:border-zinc-400 dark:bg-zinc-700 dark:text-zinc-100"
                      placeholder="your@email.com"
                      {...register("email", { required: "email is required" })}
                    />
                  </div>
              </div>
              {errors.email && <p className="text-red-500 dark:text-red-400 text-xs">{errors.email?.message}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-black dark:bg-zinc-900 text-white dark:text-zinc-100 py-2 px-4 rounded-md hover:bg-gray-800 dark:hover:bg-zinc-700 transition duration-200"
          >
            Send Verification Code
          </button>
        </>
      ) : (
        <>
          <div className="p-3 bg-gray-100 dark:bg-zinc-700 rounded-md text-sm dark:text-zinc-300">
            A verification code has been sent to your email address. Please check your inbox.
          </div>

          <div className="space-y-1">
              <div className="space-y-2">
                <label htmlFor="verificationCode" className="block text-sm font-medium dark:text-zinc-300">
                  Verification Code
                </label>
                <input
                  id="verificationCode"
                  name="verificationCode"
                  type="text"
                  required
                  className="w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-md focus:ring-1 focus:ring-black dark:focus:ring-zinc-400 focus:border-black dark:focus:border-zinc-400 dark:bg-zinc-700 dark:text-zinc-100"
                  placeholder="Enter code"
                  {...register("verificationCode", { required: "verification code is required" })}
                />
              </div>
              {errors.verificationCode && <p className="text-red-500 dark:text-red-400 text-xs">{errors.verificationCode?.message}</p>}
          </div>

          <div className="space-y-1">
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium dark:text-zinc-300">
                  New Password
                </label>
                <div className="relative flex flex-col">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <RiLockLine className="text-gray-400 dark:text-zinc-500" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="pl-10 w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-md focus:ring-1 focus:ring-zinc-800 dark:focus:ring-zinc-400 focus:outline-none focus:border-black dark:focus:border-zinc-400 dark:bg-zinc-700 dark:text-zinc-100"
                    placeholder="••••••••"
                    {...register("password", {required: "password is required", minLength: {value: 6, message: "Password must be atleast 6 chrachters long"}})}
                  />
                </div>
              </div>
              {errors.password && <p className="text-red-500 dark:text-red-400 text-xs">{errors.password?.message}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-black dark:bg-zinc-900 text-white dark:text-zinc-100 py-2 px-4 rounded-md hover:bg-gray-800 dark:hover:bg-zinc-700 transition duration-200"
          >
            Reset Password
          </button>
        </>
      )}

      <div className="text-center text-sm">
        <button
          type="button"
          onClick={() => {
            setIsLogin(true)
            setIsForgetPassword(false)
            setVerificationSent(false)
          }}
          className="text-gray-600 dark:text-zinc-400 hover:underline"
        >
          Back to Login
        </button>
      </div>
    </form>
  )

  // Guidelines for different user types
  const renderGuidelines = () => {
    if (isForgetPassword) return null

    return (
      <div className="mt-6 p-4 border border-zinc-200 dark:bg-zinc-800 dark:border-zinc-600 rounded-md bg-zinc-50">
        <h3 className="text-sm font-medium flex items-center">
          <RiInformationLine className="mr-2" /> Guidelines
        </h3>
        <ul className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 space-y-1">
          {isLogin ? (
            <>
              <li>• Use your registered email address to login</li>
              <li>• If you've forgotten your password, use the "Forgot password" link</li>
              <li>• Contact support if you're having trouble accessing your account</li>
            </>
          ) : (
            <>
              {role === "citizen" && (
                <>
                  <li>• Citizens can report issues and track their status</li>
                  <li>• Provide accurate personal information for better service</li>
                  <li>• Your data is protected and only used for verification purposes</li>
                </>
              )}
              {role === "authority" && (
                <>
                  <li>• Authority accounts require admin verification</li>
                  <li>• Select the correct department for proper access rights</li>
                  <li>• You'll receive a verification code via email after admin approval</li>
                  <li>• Authorities can manage and respond to citizen reports</li>
                </>
              )}
              {role === "admin" && (
                <>
                  <li>• Admin accounts have full system access</li>
                  <li>• Admins are responsible for verifying authority accounts</li>
                  <li>• You must have a verification code from an existing admin</li>
                  <li>• Admins can manage users, departments, and system settings</li>
                </>
              )}
            </>
          )}
        </ul>
      </div>
    )
  }

  return (
    <div className="font-outfit min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
      <div className="w-full max-w-md p-6">
        <div className="text-center flex flex-col mb-8">
          <h1 className="text-3xl font-bold dark:text-white">CivicLink</h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm">
            {isLogin ? "Sign in to your account" : isForgetPassword ? "Reset your password" : "Create a new account"}
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-800 dark:border-zinc-700 p-6 border border-zinc-200 rounded-lg shadow-sm">
          {isLogin && !isForgetPassword && renderLoginForm()}
          {!isLogin && !isForgetPassword && renderSignupForm()}
          {isForgetPassword && renderForgetPasswordForm()}
        </div>

        {renderGuidelines()}
      </div>
    </div>
  )
}

export default Login

