import PostService from "@/api/services/post.services";
import SearchBar from "@/components/SearchBar/SearchBar";
import PostCard from "@/components/Post/PostCard";
import { useLocationContext } from "@/utils/Context/LocationContext";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router";
import { ToasterNotification } from "@/utils/ToastNotification/ToastNotification";
import Loader from "@/components/Loader/Loader";

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
        {posts ? (
          <div className="w-full flex flex-col gap-5">
            {posts.map((post, index) => (
              <PostCard key={index} postDetails={post} />
            ))}
          </div>
        ) : (
          <p>loading...</p>
        )}
      </div>
    </>
  );
}

export default ExplorePosts;
