import React, { useEffect, useState } from "react";
import { Button, Input } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";
import { useForm } from "react-hook-form";
import { LoginPageImg } from "@/assets/assets.config";
import { Checkbox } from "@/components/ui/checkbox";
import AuthService from "@/api/services/auth.services";
import { useDispatch } from "react-redux";
import { login } from "@/store/authSlice";
import { ToasterNotification } from "../../utils/ToastNotification/ToastNotification";
import { RiUpload2Line } from "@remixicon/react";
import Loader from "@/components/ui/Loader/Loader";
import { useNavigate } from "react-router";

function Login() {
  // functions from react hook form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // location state to store current location (will be used for signup)
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  // error state
  const [error, setError] = useState(null);
  // dispatch instance to handle redux store
  const dispatch = useDispatch();
  // avatar file state (required for signup)
  const [avatar, setAvatar] = useState(null);
  // loading state
  const [isLoading, setIsLoading] = useState(false)
  // user role data object
  const userRoles = [
    { label: "Citizen", value: "citizen" },
    { label: "Authority", value: "authority" },
  ];
  // role state to store the role of user (required on signup)
  const [role, setRole] = useState("");
  // login/signup toggle state
  const [toRegister, setToRegister] = useState(false);
  // state to store preview blob user of uploaded avatar image
  const [previewAvatar, setPreviewAvatar] = useState(null);
  // navigate instance
  const navigate = useNavigate()

  // temporary data
  // const typesOfUser = [
  //   {
  //     title: "Citizen",
  //     role: "citizen",
  //     image: ""
  //   },
  //   {
  //     title: "Authority",
  //     role: "authority",
  //     image: ""
  //   }
  // ]
  
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
  const onSubmit = handleSubmit(async (data) => {
    try {
      setIsLoading(true)
      // console.log(data)
      if (toRegister && (role == "" || !location.latitude || !location.longitude || !avatar)) throw new Error("All details are required");

      if (toRegister) {
        // register the user first
        await AuthService.registerUser({
          name: data.name,
          email: data.email,
          password: data.password,
          latitude: location.latitude,
          longitude: location.longitude,
          role: role,
          avatar: avatar,
        });
        // console.log(response);
        // console.log(role,location,avatar,data)
      }

      // login the user
      await AuthService.loginUser({
        email: data.email,
        password: data.password,
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

      setTimeout(() => {
        navigate("/") // navigate to home page after 2 seconds
      },2000)
    } catch (error) {
      console.log(error);
      ToasterNotification({
        type: "error",
        title: "Login/Signup Failed",
        description: `${error.message}`,
      });
    } finally{
      setIsLoading(false)
    }
  });

  // handle role input
  const handleRoleInput = (role) => {
    setRole(prevRole => prevRole === role ? "": role);
  };

  // handle avatar file input
  const handleFileChange = (file) => {
    setAvatar(file[0]);
    // create blob url and store in the state
    setPreviewAvatar(URL.createObjectURL(file[0]))
  };

  return (
    <>
      {/* loading component  */}
      {isLoading && <Loader/>}
      {/* background image  */}
      <img
        src={LoginPageImg}
        alt=""
        className="w-full h-screen absolute object-cover"
      />
      <div className="w-full h-screen relative flex items-center justify-center">
        <div className="w-full p-8 duration-100">
          <form
            onSubmit={onSubmit}
            className="font-outfit gap-4 p-5 rounded-lg flex items-center flex-col bg-white "
          >
            <h1 className="font-bold text-xl text-green-600">CivicLink</h1>
            {toRegister && (
              <>
                <div>
                  <input
                    type="file"
                    // max={2}
                    onChange={(e) => handleFileChange(e.target.files)}
                    style={{ display: "none" }}
                    id="fileInput"
                  />
                  <label
                    htmlFor="fileInput"
                    className="flex items-center bg-zinc-50 p-3 rounded-lg text-zinc-800 gap-3"
                  >
                    {previewAvatar && (
                      <img
                        src={previewAvatar}
                        alt=""
                        className="w-12 h-12 object-cover rounded-md"
                      />
                    )}
                    <RiUpload2Line size={22} /> upload your image
                  </label>
                </div>
                {/* {file && <Text mt={2}>Selected file: {file.name}</Text>} */}

                <Field
                  label="Name"
                  required
                  invalid={!!errors.firstName}
                  errorText={errors.firstName?.message}
                >
                  <Input
                    variant={"subtle"}
                    className="p-2"
                    placeholder="Enter you name"
                    {...register("name", {
                      required: "First name is required",
                    })}
                  />
                </Field>
              </>
            )}
            <Field
              required
              label="Email"
              invalid={!!errors.lastName}
              errorText={errors.lastName?.message}
            >
              <Input
                placeholder="me@example.com"
                variant={"subtle"}
                type="email"
                className="p-2"
                {...register("email", { required: "email is required" })}
              />
            </Field>
            <Field
              required
              label="Password"
              invalid={!!errors.lastName}
              errorText={errors.lastName?.message}
            >
              <PasswordInput
                placeholder="Enter your password"
                variant={"subtle"}
                className="p-2"
                {...register("password", { required: "email is required" })}
              />
            </Field>
            {
              toRegister && (
                // <CheckboxGroup>
                <div className="flex flex-col w-full ">
                  <label className="text-sm">Role</label>
                  <div className="w-full flex gap-2">
                    {userRoles.map((type, key) => (
                      <>
                        <input
                          type="checkbox"
                          name={type.value}
                          key={key}
                          value={type.value}
                          checked={role === type.value ? true : false}
                          onClick={() => handleRoleInput(type.value)}
                        />
                        <label htmlFor={type.label}>{type.label}</label>
                      </>
                    ))}
                  </div>
                </div>
              )

              // </CheckboxGroup>
            }
            <button
              type="submit"
              className="bg-green-500 w-fit px-5 py-2 text-white rounded-lg"
            >
              {toRegister ? "SignUp" : "Login"}
            </button>
            {toRegister ? (
              <div className="w-full flex items-center justify-between">
                <h2 className="text-xs">Already have an account ?</h2>
                <Button
                  onClick={() => {
                    reset();
                    setToRegister(false);
                  }}
                  className="text-sm text-blue-600"
                >
                  Login
                </Button>
              </div>
            ) : (
              <div className="w-full flex items-center justify-between">
                <h2 className="text-xs">Don't have an account ?</h2>
                <Button
                  onClick={() => {
                    reset();
                    setToRegister(true);
                  }}
                  className="text-sm text-blue-600"
                >
                  Signup
                </Button>
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
