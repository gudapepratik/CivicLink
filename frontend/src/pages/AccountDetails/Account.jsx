import AuthService from "@/api/services/auth.services";
import departmentService from "@/api/services/department.services";
import { NotLoginImg1 } from "@/assets/assets.config";
import Dialog from "@/components/Dialog/Dialog";
import Error from "@/components/Error/Error";
import Loader from "@/components/Loader/Loader";
import { login, logout } from "@/store/authSlice";
import { getAddressFromCoordinates } from "@/utils/googleMaps.utilites";
import { ToasterNotification } from "@/utils/ToastNotification/ToastNotification";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

function Account() {
  const user = useSelector((state) => state.authSlice.user);
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [department,setDepartment] = useState({})
  const dispatch = useDispatch();
  const {
    formState: { errors },
    handleSubmit,
    reset,
    setError,
    setValue,
    register,
  } = useForm();

  // const dummyUser = {
  //   avatar: {
  //     publicUrl:
  //       "https://res.cloudinary.com/dm5u6twkl/image/upload/v1738952579/bt7gt5ybqswwbyu1gsnc.jpg",
  //     public_id: "bt7gt5ybqswwbyu1gsnc",
  //   },
  //   gender: "Male",
  //   age: 30,
  //   createdAt: "2025-02-07T18:22:59.799Z",
  //   email: "pratikgudape9825@gmail.com",
  //   location: { type: "Point", coordinates: [73.7624702, 18.6482368] },
  //   name: "pratik gudape",
  //   role: "citizen",
  //   updatedAt: "2025-02-18T14:07:33.587Z",
  //   __v: 0,
  //   _id: "67a64f836b07f4c7295cf9da",
  // };

  const getAddress = async () => {
    try {
      const response = await getAddressFromCoordinates({
        lat: user.location.coordinates[1],
        lng: user.location.coordinates[0],
      });
      setAddress(response);
    } catch (error) {
      console.log(error)
      ToasterNotification({
        type: "warning",
        title: "Error Occurred",
        message: `${error.message}`,
      });
    }
  };

  useEffect(() => {
    if(user) {
      getAddress();
      if(user?.role === "authority") {
        fetchDepartment();
      }
    }
  }, [user]);

  const fetchDepartment = async () => {
    try {
      const response = await departmentService.getDepartmentById(user.departmentId);
      setDepartment(response.data.data);
    } catch (error) {
      ToasterNotification({
        type: "warning",
        description: "An Error Occurred while fethcing department details",
      });
    }
  };

  const handleOnSubmit = handleSubmit(async (data) => {
    try {
      setIsLoading(true);

      const newData = await AuthService.updateUserDetails({
        name: data.name,
        email: data.email,
        age: data.age,
        avatar: data.newProfileImage ? data.newProfileImage[0] : null,
      });

      // update the store with new user data
      dispatch(login(newData.data.data));

      ToasterNotification({
        type: "success",
        title: "Details Updated",
        description: `Your profile has been updated successfully!`,
      });
    } catch (error) {
      console.log(error);
      ToasterNotification({
        type: "warning",
        title: "Error occurred",
        description: `${error.message}`,
      });
    } finally {
      setIsLoading(false);
    }
  });

  const [previewNewImageUrl, setPreviewNewImageUrl] = useState("");

  const handleImageChange = (e) => {
    if (e.target.files.length === 0) {
      setPreviewNewImageUrl("");
      setValue("newProfileImage", null);
    } else {
      setPreviewNewImageUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleRemoveImage = () => {
    setPreviewNewImageUrl("");
    setValue("newProfileImage", null);
  };

  const handleDeleteAccount = async () => {
    try {
      setIsLoading(true);
      await AuthService.deleteUser();

      ToasterNotification({
        type: "success",
        description: "Your Account has been deleted successfully",
      });

      dispatch(logout());
    } catch (error) {
      console.log(error);
      ToasterNotification({
        type: "warning",
        title: "Error occurred",
        description: `${error.message}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      {!user ? (
        <Error
          image={NotLoginImg1}
          hoffset={100}
          title={"User Not Logged in"}
          message={"Login or Create your account first"}
        />
      ) : (
        <div className="w-full flex flex-col p-3 font-outfit bg-white dark:bg-zinc-950">
          <h1 className="text-2xl font-extrabold text-center">Account</h1>

          <form onSubmit={handleOnSubmit}>
            {/* Profile section  */}
            <div className="w-full p-4 gap flex flex-col mt-3 items-center gap-5">
              {/* User Profile image  */}
              <div className="flex w-full flex-col gap-3 items-center justify-center">
                <div className="w-24 h-24 rounded-full overflow-hidden  ">
                  {previewNewImageUrl === "" ? (
                    <img
                      src={user.avatar.publicUrl}
                      alt="profile image"
                      className="object-contain"
                    />
                  ) : (
                    <img
                      src={previewNewImageUrl}
                      alt="profile image"
                      className="object-contain"
                    />
                  )}
                </div>
                <input
                  type="file"
                  id="newProfileImage"
                  className="hidden"
                  {...register("newProfileImage", {
                    onChange: (e) => handleImageChange(e),
                  })}
                />
                <div className="flex gap-2 items-center">
                  <label
                    htmlFor="newProfileImage"
                    className="bg-zinc-100 dark:bg-zinc-800 p-2 text-sm text-blue-500 rounded-lg "
                  >
                    Change profile photo
                  </label>
                  {previewNewImageUrl !== "" && (
                    <button
                      onClick={handleRemoveImage}
                      className="bg-red-100 dark:bg-zinc-800 text-red-500 p-2 text-sm rounded-lg"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>

              {/* Name field  */}
              <div className="w-full flex gap-2 justify-between items-center">
                <label htmlFor="name" className=" text-zinc-400">
                  Name
                </label>
                <div className="flex flex-col gap-[1px]">
                  <input
                    type="text"
                    id="name"
                    className="focus:outline-none p-3 focus:bg-zinc-100 border-b dark:bg-zinc-800 "
                    defaultValue={user.name}
                    {...register("name", {
                      minLength: {
                        value: 5,
                        message: "Name must be atleast 5 characters long",
                      },
                      maxLength: {
                        value: 30,
                        message: "Name must be atmost 30 characters long",
                      },
                      required: "Name field is required",
                    })}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Gender field  */}
              <div className="w-full flex gap-2 justify-between items-center">
                <label htmlFor="gender" className=" text-zinc-400">
                  Gender
                </label>
                <input
                  type="text"
                  id="gender"
                  disabled
                  className="focus:outline-none p-3 focus:bg-zinc-100 border-b dark:bg-zinc-800"
                  defaultValue={user?.gender}
                />
              </div>

              {/* Age field  */}
              <div className="w-full flex gap-2 justify-between items-center">
                <label htmlFor="age" className=" text-zinc-400">
                  Age
                </label>
                <div className="flex flex-col gap-[1px]">
                  <input
                    type="number"
                    id="age"
                    className="focus:outline-none p-3 focus:bg-zinc-100 border-b dark:bg-zinc-800"
                    defaultValue={user?.age}
                    {...register("age", {
                      min: {
                        value: 18,
                        message: "Age must be greater than 18",
                      },
                      required: "Age field is required",
                    })}
                  />
                  {errors.age && (
                    <p className="text-xs text-red-500">{errors.age.message}</p>
                  )}
                </div>
              </div>

              {/* Email field  */}
              <div className="w-full flex gap-2 justify-between items-center">
                <label htmlFor="email" className=" text-zinc-400">
                  Email
                </label>
                <div className="flex flex-col gap-[1px]">
                  <input
                    type="email"
                    id="email"
                    className="focus:outline-none p-3 focus:bg-zinc-100 border-b dark:bg-zinc-800"
                    defaultValue={user.email}
                    {...register("email", {
                      required: "Email field is required",
                    })}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Role field  */}
              <div className="w-full flex gap-2 justify-between items-center">
                <label htmlFor="role" className=" text-zinc-400">
                  Role
                </label>
                <input
                  type="text"
                  id="role"
                  disabled
                  className="focus:outline-none p-3 focus:bg-zinc-100 border-b dark:bg-zinc-800 "
                  value={user.role}
                />
              </div>

              {/* Department name field  */}
              {user?.role === "authority" && (
                <div className="w-full flex gap-2 justify-between items-center">
                  <label htmlFor="department" className=" text-zinc-400">
                    Department
                  </label>
                  <input
                    type="text"
                    id="department"
                    disabled
                    className="focus:outline-none p-3 focus:bg-zinc-100 border-b dark:bg-zinc-800 "
                    value={department.name}
                  />
                </div>
              )}

              {/* Address field  */}
              <div className="w-full flex gap-2 justify-between items-center">
                <label htmlFor="role" className=" text-zinc-400">
                  Address
                </label>
                <input
                  type="text"
                  id="role"
                  disabled
                  className="focus:outline-none p-3 focus:bg-zinc-100 border-b dark:bg-zinc-800"
                  value={address}
                />
              </div>

              {/* Submit button  */}
              <button
                type="submit"
                className="bg-blue-700 shadow-inner px-3 py-2 text-white rounded-lg"
              >
                Update Details
              </button>
            </div>
          </form>

          <div className="w-full border-b-[1px] border-zinc-200"></div>

          <div className="w-full flex flex-col mt-3 items-start">
            {/* <button className="text-red-500 font-bold">delete Account</button> */}
            <Dialog
              ToDelete={handleDeleteAccount}
              title={"Are You Sure?"}
              actionTitle={"delete Account"}
              message={
                "Are you sure you want to delete your account. You won't be able to get the account back"
              }
            />
            <h3 className="">
              Deleting your account will remove all your posts, comments,
              reactions from the app
            </h3>
          </div>
        </div>
      )}
    </>
  );
}

export default Account;
