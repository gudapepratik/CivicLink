import PostService from "@/api/services/post.services";
import SearchBar from "@/components/SearchBar/SearchBar";
import PostCard from "@/components/Post/PostCard";
import { useLocationContext } from "@/utils/Context/LocationContext";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router";
import { ToasterNotification } from "@/utils/ToastNotification/ToastNotification";
import Loader from "@/components/Loader/Loader";
import { RiLoaderLine } from "@remixicon/react";
import Error from "@/components/Error/Error";
import { NotResultImg1 } from "@/assets/assets.config";

function ExplorePosts() {
  const defaultCoordinates = [18.521432806997094, 73.85769665098046];
  const { location, setLocation } = useLocationContext();
  const [prevLocation, setPrevLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState("")
  const [fetchTrigger, setFetchTrigger] = useState(false)

  const user = useSelector((state) => state.authSlice.user);
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      setIsLoading(true)

      setPrevLocation(location);
      // console.log("fetching")
      // console.log(location)
      const response = await PostService.getPostsByLocation({
        latitude: location.lat,
        longitude: location.lng,
        status: status
      });
      // console.log(response.data.data);
      setPosts(response.data.data);
    } catch (error) {
      console.log(error)
      ToasterNotification({
        type: "warning",
        title: "Error Occurred",
        description: `${error.message}`
      })
    } finally {
      setIsLoading(false)
    }
  };

  // Effect for setting user location when available
  useEffect(() => {
    if (
      user &&
      (location.lat === defaultCoordinates[0] ||
        location.lng === defaultCoordinates[1])
    ) {
      setLocation({
        lat: user.location.coordinates[1],
        lng: user.location.coordinates[0],
      });
    }
  }, [user]);

  useEffect(() => {
    console.log(location, defaultCoordinates, prevLocation);
    if (
      prevLocation &&
      (prevLocation.lat !== location.lat || prevLocation.lng !== location.lng)
    ) {
      fetchPosts();
    } else if (!prevLocation) {
      fetchPosts();
    }
    fetchPosts()
  }, [location, fetchTrigger]);

  return (
    <>
      {isLoading && <Loader/>}
      <div className="h-[calc(100vh-80px)] w-full p-2 flex flex-col gap-5 ">
        <SearchBar status={status} setStatus={setStatus} trigger={setFetchTrigger}/>
        {posts && posts.length > 0 && (
          <div className="w-full flex flex-col gap-5">
            {posts.map((post, index) => (
              <PostCard key={index} postDetails={post} />
            ))}
          </div>
        )}
        {!posts && (
          <div className='w-full h-[calc(100vh-15vh)]  flex items-center justify-center'><RiLoaderLine size={30} className='animate-spin duration-5000'/></div>
        )}
        {posts && posts.length === 0 && (
          <Error image={NotResultImg1} hoffset={200} title={"No More Reports !"} message={"There are no further reports available to show."}/>
        )}
      </div>
    </>
  );
}

export default ExplorePosts;
