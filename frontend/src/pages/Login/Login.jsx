import React, { useEffect, useState } from "react";
import { Button, Input, HStack } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";
import { Controller, useForm } from "react-hook-form";
import { LoginPageImg } from "@/assets/assets.config";
import AuthService from "@/api/services/auth.services";
import { useDispatch } from "react-redux";
import { login } from "@/store/authSlice";
import { ToasterNotification } from "../../utils/ToastNotification/ToastNotification";
import { RiUpload2Line } from "@remixicon/react";
import Loader from "@/components/Loader/Loader";
import { useNavigate } from "react-router";
import departmentInfo from "@/utils/departmentInfo";
import { Radio, RadioGroup } from "@/components/ui/radio";
import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/components/ui/select";

function Login() {
  // functions from react hook form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
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
  const [isLoading, setIsLoading] = useState(false);
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
  // role state to store the role of user (required on signup)
  const [role, setRole] = useState("");
  const [gender, setGender] = useState("");
  // login/signup toggle state
  const [toRegister, setToRegister] = useState(false);
  // state to store preview blob user of uploaded avatar image
  const [previewAvatar, setPreviewAvatar] = useState(null);
  // navigate instance
  const navigate = useNavigate();

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
      setIsLoading(true);
      // console.log(data)
      if (
        (toRegister &&
          (!data.role || (data.role === "authority" && !data.departmentId))) ||
        (toRegister && (!location.latitude || !location.longitude || !avatar)) || 
        (toRegister && !data.gender)
      )
        throw new Error("All details are required");
      if (toRegister) {
        // register the user first
        await AuthService.registerUser({
          name: data.name,
          email: data.email,
          password: data.password,
          latitude: location.latitude,
          longitude: location.longitude,
          age: data.age,
          gender: data.gender,
          role: data.role,
          avatar: avatar,
          departmentId: data?.departmentId,
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
      ToasterNotification({
        type: "error",
        title: "Login/Signup Failed",
        description: `${error.message}`,
      });
    } finally {
      setIsLoading(false);
    }
  });

  // handle role input
  const handleRoleInput = (role) => {
    setRole(role);
  };

  const handleGenderInput = (gender) => {
    setGender(gender);
  };

  // handle avatar file input
  const handleFileChange = (file) => {
    setAvatar(file[0]);
    // create blob url and store in the state
    setPreviewAvatar(URL.createObjectURL(file[0]));
  };

  return (
    <>
      {/* loading component  */}
      {isLoading && <Loader />}
      {/* background image  */}
      <img
        src={LoginPageImg}
        alt=""
        className="w-full h-screen absolute object-cover"
      />
      <div className="w-full h-screen relative flex items-center justify-center">
        <div className="w-full p-2 duration-100">
          <form
            onSubmit={onSubmit}
            className="font-outfit gap-4 p-5 rounded-lg flex items-center dark:bg-zinc-800 flex-col bg-white "
          >
            <h1 className="font-bold text-xl text-blue-800 dark:text-white">CivicLink</h1>
            {toRegister && (
              <>
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

                
                <Field
                  label="Age"
                  required
                  invalid={!!errors.age}
                  errorText={errors.age?.message}
                >
                  <Input
                    variant={"subtle"}
                    className="p-2"
                    type="number"
                    placeholder="Enter you age"
                    {...register("age", {
                      required: "First name is required",
                      min: {value: 18, message: "Age must be atleast 18"},
                      max: {value: 110, message: "Enter valid age"}
                    })}
                  />
                </Field>
                
                
                <Field required label="Gender"></Field>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      name={field.name}
                      value={field.value}
                      onValueChange={({ value }) => {
                        field.onChange(value);
                      }}
                      onChange={(e) => handleGenderInput(e.target.defaultValue)}
                      className="w-full "
                      colorPalette={"blue"}
                      size={"sm"}
                    >
                      <HStack gap="6">
                        {genders.map((item) => (
                          <Radio
                            key={item.value}
                            value={item.value}
                            inputProps={{ onBlur: field.onBlur }}
                          >
                            {item.label}
                          </Radio>
                        ))}
                      </HStack>
                    </RadioGroup>
                  )}
                />

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
            {toRegister && (
              <>
                <Field required label="role"></Field>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      name={field.name}
                      value={field.value}
                      onValueChange={({ value }) => {
                        field.onChange(value);
                      }}
                      onChange={(e) => handleRoleInput(e.target.defaultValue)}
                      className="w-full "
                      colorPalette={"blue"}
                      size={"sm"}
                    >
                      <HStack gap="6">
                        {userRoles.map((item) => (
                          <Radio
                            key={item.value}
                            value={item.value}
                            inputProps={{ onBlur: field.onBlur }}
                          >
                            {item.label}
                          </Radio>
                        ))}
                      </HStack>
                    </RadioGroup>
                  )}
                />

                {/* {role === "authority" && ( */}
                  {/* // <Field label="department"> */}
                    {/* <Controller 
                      control={control}
                      name="departmentId"
                      render={({ field }) => (
                      )}
                    /> */}
                        {/* <SelectRoot
                          // name={field.name}
                          // value={field.value}
                          // onValueChange={({ value }) => field.onChange(value)}
                          // onInteractOutside={() => field.onBlur()}
                          className="px-6"
                        >
                          <SelectTrigger clearable>
                            <SelectValueText placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent className="font-outfit">
                            {departmentInfo.map((department,key) => (
                              <SelectItem
                                item={department.departmentId}
                                key={key}
                              >
                                {department.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </SelectRoot>
                  </Field> */}
                {/* // )} */}

                {role === 'authority' && (
                  <>
                    <Field label="department" required>
                    <select
                      required
                      id="department"
                      className="border p-2 w-full rounded-lg bg-zinc-50 dark:bg-zinc-800"
                      {...register("departmentId", {
                        required: "Department is required",
                      })}
                    >
                      {departmentInfo.map((department, index) => (
                        <option
                          className="duration-100 bg-zinc-700 font-outfit text-white"
                          key={index}
                          value={department.departmentId}
                        >
                          {department.title}
                        </option>
                      ))}
                    </select>
                    </Field>
                  </>
                )}

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
                    className="flex items-center bg-zinc-50 p-3 rounded-lg text-zinc-800 dark:bg-zinc-700 dark:text-white gap-3"
                  >
                    {previewAvatar && (
                      <img
                        src={previewAvatar}
                        alt=""
                        className="w-12 h-12 object-cover rounded-md"
                      />
                    )}
                    <RiUpload2Line size={22} /> upload your profile image
                  </label>
                </div>
              </>
            )}
            <button
              type="submit"
              className="bg-blue-600 w-fit px-5 py-2 text-white rounded-lg"
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
