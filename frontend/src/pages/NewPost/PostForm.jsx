import Error2 from "@/components/Error/Error2";
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
import { RiInformationLine, RiLoader2Line, RiMapPinLine, RiUpload2Fill } from "@remixicon/react";
import {
  FileUploadList,
  FileUploadRoot,
  FileUploadTrigger,
} from "@/components/ui/file-upload";
import departmentInfo from "@/utils/departmentInfo";
import { getAddressFromCoordinates } from "@/utils/googleMaps.utilites";
import { NotLoginImg1 } from "@/assets/assets.config";
import GoogleMapReportComponent from "@/components/GoogleMap/GoogleMapReportComponent";
import ReportSuccess from "./ReportSuccess";
// import { error } from "console";

function PostForm() {
  const user = useSelector((state) => state.authSlice.user);
  const userStatus = useSelector((state) => state.authSlice.status);
  const [location, setLocation] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [selectedDep, setSelectedDep] = useState(departmentInfo[0].departmentId)
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setError,
    clearErrors,
    setValue
  } = useForm();
  const [wordCount, setWordCount] = useState(0);
  const maxWords = 1000;
  const categories = [
    { id: "roads", name: "Roads & Sidewalks" },
    { id: "lighting", name: "Street Lighting" },
    { id: "sanitation", name: "Sanitation & Waste" },
    { id: "vandalism", name: "Vandalism & Graffiti" },
    { id: "parks", name: "Parks & Recreation" },
    { id: "water", name: "Water & Sewage" },
    { id: "other", name: "Other Issues" },
  ]

  const onSubmit = handleSubmit(async (data) => {
    try {
      setLoading(true);
      setIsSubmitted(false);

      console.log(data, location,locationAddress, images);
      console.log("asf");

      if (!locationAddress || !location) throw new Error("Please select location")

      if (!images) throw new Error("Select at least 1 image");

      const response = await PostService.addNewPost({
        departmentId: data.departmentId,
        title: data.title,
        description: data.description,
        latitude: location.lat,
        longitude: location.lng,
        images: images,
        address: locationAddress,
        category: data.category
      });

      ToasterNotification({
        type: "success",
        title: "Success",
        description: "Post uploaded successfully",
      });

      setIsSubmitted(true)

      // setTimeout(() => {
      //   navigate("/");
      // }, 2000);
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
      {/* {isLoading && <Loader />} */}
      {!userStatus ? (
        <Error2 image={NotLoginImg1} hoffset={100} title={'User Not Logged in'} message={'Log in to your account to Create a post'}/>
      ) : (
        isSubmitted ? (
          <ReportSuccess/>
        ) :(
          <>
          
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
                  placeholder="Enter a title.."
                  {...register("title", {
                    required: "title is required",
                  })}
                  minLength={"10"}
                />
              </Field>

              <Field
                label="Description"
                required
                helperText={`Maximum ${maxWords} characters`}
                invalid={!!errors.description}
                errorText={errors.description?.message}
              >
                <Textarea
                  placeholder="Describe your issue in detail...."
                  variant={"subtle"}
                  size={"md"}
                  className="p-2 max-h-[40]"
                  {...register("description", {
                    required: "description is required",
                  })}
                  resize={"vertical"}
                  autoresize
                  minLength={"50"}
                  maxLength={"1000"}
                  maxHeight={"300px"}
                  minHeight={"100px"}
                />
              </Field>

              <Field 
                required 
                label="category"
                invalid={!!errors.category}
                errorText={errors.category?.message}
              >
                <select
                  required
                  id="category"
                  className="border p-2 w-full rounded-lg bg-zinc-50 dark:bg-zinc-800"
                  {...register("category", {
                    required: "Category is required",
                  })}
                >
                  {categories.map((category, index) => (
                    <option
                      className="duration-100 bg-zinc-700 font-outfit text-white"
                      key={index}
                      value={category.id}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
              </Field>


              <Field 
                required 
                label="department"
                invalid={!!errors.department}
                errorText={errors.department?.message}
              >
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

              {/* <div className="w-full flex flex-col">
                  <a href={`/departments/${selectedDep}`}>Go to</a>
              </div> */}

              {/* map box  */}
              <div className="flex flex-col gap-2">
                <div className="flex items-end">
                  <RiMapPinLine/> <Field label="Location"></Field>
                </div>
                <div className="w-full h-[200px] bg-zinc-300 dark:bg-zinc-800 rounded-3xl">
                  <GoogleMapReportComponent onLocationSelect={setLocation} />
                </div>
                {location && (
                  <p className="font-outfit text-xs w-full p-2 text-blue-400 bg-zinc-50 dark:bg-zinc-800">
                    {locationAddress}
                  </p>
                )}
              </div>
              
              <div className="w-full flex flex-col gap-2">
                {/* images  */}
                <Field 
                  required 
                  label="Images" 
                  invalid={!!errors.files}
                  errorText={errors.files?.message}>
                  <Input
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
                      minLength: 1
                    })}
                  />
                </Field>
                <div>
                  {/* <div className="flex items-end pb-1 gap-3">
                    <Field required label="Images"></Field>
                    {errors.files && (
                      <p className="font-outfit text-xs text-red-500">
                        *{errors.files.message}
                      </p>
                    )}
                  </div> */}
                  {previewImgs.length > 0 ? (
                    <div className="w-full p-2 flex justify-center items-center border rounded-lg">
                      <label
                        htmlFor="fileUpload"
                        className="w-full justify-evenly flex grid-cols-3 flex-wrap  gap-4"
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
                    </div>
                  ) : (
                    <label
                      htmlFor="fileUpload"
                      className="w-full flex border-dashed border-zinc-300 dark:border-zinc-700 border-2 rounded-lg justify-center items-center h-52 "
                    >
                      <div className="flex flex-col text-zinc-400 dark:text-zinc-500 font-outfit items-center">
                          <RiUpload2Fill size={40}/>
                          <h2 className="text-[16px]">Click to upload images</h2>
                          <h2 className="text-[13px]">(maximum 6 images)</h2>
                      </div>
                    </label>
                  )}
                </div>


                <div className="p-4 bg-blue-50 my-2 dark:bg-zinc-600 dark:bg-opacity-20 rounded-lg flex items-start">
                    <RiInformationLine className="text-blue-500 mr-3 mt-0.5 flex-shrink-0" size={20} />
                    <div className="text-sm text-blue-700 dark:text-zinc-400">
                      <p className="font-medium">Important:</p>
                      <p>
                        Your report will be reviewed by an admin before being assigned to the relevant department. You
                        will receive a notification once your report is approved.
                      </p>
                    </div>
                </div>
              </div>

              <button
                type="submit"
                className="bg-blue-600  border-blue-500 border flex justify-center gap-2 mb-4 dark:hover:bg-opacity-100 dark:bg-blue-800 dark:bg-opacity-50 dark:border dark:border-blue-700 hover:bg-blue-800 rounded-lg duration-300 w-full py-3 text-white font-outfit"
              >
                {isLoading && <RiLoader2Line className="duration-[4000] animate-spin"/>} {isLoading ?  "Uploading..": "Upload Report"}
              </button>
            </form>
          </div>
          </>
        ))
      }
    </>
  );
}

export default PostForm;
