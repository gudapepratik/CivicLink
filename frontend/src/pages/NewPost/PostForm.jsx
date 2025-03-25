import Error from "@/components/Error/Error";
import { useSelector } from "react-redux";
import { Textarea } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Button, Input, HStack } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";
import { Controller, useForm } from "react-hook-form";
import PostService from "@/api/services/post.services";
import { ToasterNotification } from "../../utils/ToastNotification/ToastNotification";
import Loader from "@/components/Loader/Loader";
import { useNavigate } from "react-router";
import GoogleMapComponent from "@/components/GoogleMap/GoogleMapComponent";
import { RiMapPinLine } from "@remixicon/react";
import {
  FileUploadList,
  FileUploadRoot,
  FileUploadTrigger,
} from "@/components/ui/file-upload";
import departmentInfo from "@/utils/departmentInfo";
import { getAddressFromCoordinates } from "@/utils/googleMaps.utilites";
import { NotLoginImg1 } from "@/assets/assets.config";
// import { error } from "console";

function PostForm() {
  const user = useSelector((state) => state.authSlice.user);
  const userStatus = useSelector((state) => state.authSlice.status);
  const [location, setLocation] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [selectedDep, setSelectedDep] = useState(departmentInfo[0].departmentId)
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setError,
    clearErrors,
  } = useForm();

  const onSubmit = handleSubmit(async (data) => {
    try {
      setLoading(true);
      console.log(data, location, images);
      console.log("asf");
      if (!locationAddress) throw new Error("Please select location");
      if (!images) throw new Error("Select at least 1 image");
      const response = await PostService.addNewPost({
        departmentId: data.departmentId,
        title: data.title,
        description: data.description,
        latitude: location.lat,
        longitude: location.lng,
        images: images,
        address: locationAddress,
      });

      ToasterNotification({
        type: "success",
        title: "Success",
        description: "Post uploaded successfully",
      });
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.log(error);
      ToasterNotification({
        type: "info",
        title: "Upload error",
        description: `${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  });

  const [previewImgs, setPreviewImgs] = useState([]);
  const [images, setImages] = useState([]);

  // handle avatar file input
  const handleFileChange = (files) => {
    console.log(files);
    if (!files.length) {
      setError(
        "files",
        { message: "Atleast one image is required" },
        { shouldFocus: true }
      );
      setImages([]);
      setPreviewImgs([]);
      return false;
    }

    if (files.length > 6) {
      setError(
        "files",
        { message: "Atmost 6 images are allowed" },
        { shouldFocus: true }
      );
      setImages([]);
      setPreviewImgs([]);
      return false;
    }

    const fileArray = Array.from(files);
    const imageUrls = fileArray.map((file) => URL.createObjectURL(file));
    setPreviewImgs(imageUrls);
    setImages(fileArray);

    clearErrors("files");
    return true;
  };
  const [locationAddress, setLocationAddress] = useState("");
  useEffect(() => {
    const fetchAddress = async () => {
      const response = await getAddressFromCoordinates(location);
      console.log(response);
      setLocationAddress(response);
    };
    if (location) {
      fetchAddress();
    }
  }, [location]);

  return (
    <>
      {isLoading && <Loader />}
      {!userStatus ? (
        <Error image={NotLoginImg1} title={'User Not Logged in'} message={'Log in to your account to Create a post'}/>
      ) : (
        <div className="w-full font-outfit p-3">
          <h1 className="text-zinc-800 text-2xl font-extrabold text-center dark:text-white">
            Report an Issue
          </h1>
          {/* <GoogleMapComponent/> */}
          <form onSubmit={onSubmit} className="w-full flex flex-col gap-6 mt-4">
            <Field
              label="title"
              required
              invalid={!!errors.title}
              errorText={errors.title?.message}
            >
              <Input
                variant={"subtle"}
                className="p-2"
                placeholder="Enter title"
                {...register("title", {
                  required: "title is required",
                })}
              />
            </Field>

            <Field
              label="Description"
              required
              helperText="Max 500 characters."
              invalid={!!errors.description}
              errorText={errors.description?.message}
            >
              <Textarea
                placeholder="Explain your issue...."
                variant={"subtle"}
                size={"md"}
                className="p-2 max-h-[40]"
                {...register("description", {
                  required: "description is required",
                })}
                resize={"vertical"}
                autoresize
                maxHeight={"300px"}
                minHeight={"100px"}
              />
            </Field>

            <Field label="department">
              <select
                required
                id="department"
                className="border p-2 w-full rounded-lg bg-zinc-50 dark:bg-zinc-800"
                // onChange={(e) => {
                //   console.log("asf",e)
                //   setSelectedDep()}}
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

            {/* <div className="w-full flex flex-col">
                <a href={`/departments/${selectedDep}`}>Go to</a>
            </div> */}

            {/* map box  */}
            <div className="flex flex-col gap-2">
              <div className="flex items-end">
                <RiMapPinLine /> <Field label="Location"></Field>
              </div>
              <div className="w-full h-[200px] bg-zinc-300 dark:bg-zinc-800 rounded-3xl">
                <GoogleMapComponent onLocationSelect={setLocation} />
              </div>
              {location && (
                <p className="font-outfit text-xs w-full p-2 text-blue-400 bg-zinc-50 dark:bg-zinc-800">
                  {locationAddress}
                </p>
              )}
            </div>

            {/* images  */}
            <input
              type="file"
              id="fileUpload"
              required
              multiple
              accept="image/*"
              className="hidden"
              placeholder="Add images"
              {...register("files", {
                onChange: (e) => handleFileChange(e.target.files),
                required: "image is required",
              })}
            />
            {/* <label
                htmlFor="fileUpload"
                className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition"
            >
                Upload Images
            </label> */}
            <div>
              <div className="flex items-end gap-3">
                <label htmlFor="fileUpload">Images</label>
                {errors.files && (
                  <p className="font-outfit text-xs text-red-500">
                    *{errors.files.message}
                  </p>
                )}
              </div>
              {previewImgs.length > 0 ? (
                <label
                  htmlFor="fileUpload"
                  className="w-full flex grid-cols-3 flex-wrap justify-start gap-4 border rounded-lg p-2"
                >
                  {previewImgs.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt="preview"
                      className="w-24 h-24 object-cover rounded-md"
                    />
                  ))}
                </label>
              ) : (
                <label
                  htmlFor="fileUpload"
                  className="w-full flex border rounded-lg justify-center items-center h-52 "
                >
                  <h2 className="font-outfit">Your images here</h2>
                </label>
              )}
            </div>

            <button
              type="submit"
              className="bg-blue-600 w-full py-3 text-white font-outfit"
            >
              Upload Post
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default PostForm;
