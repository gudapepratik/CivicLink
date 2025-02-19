import PostService from "@/api/services/post.services";
import SearchBar from "@/components/SearchBar/SearchBar";
import PostCard from "@/components/Post/PostCard";
import { useLocationContext } from "@/utils/Context/LocationContext";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router";

function ExplorePosts() {
  const defaultCoordinates = [18.521432806997094, 73.85769665098046];
  const { location, setLocation } = useLocationContext();
  const [prevLocation, setPrevLocation] = useState(null);

  const user = useSelector((state) => state.authSlice.user);
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    setPrevLocation(location);
    // console.log("fetching")
    // console.log(location)
    const response = await PostService.getPostsByLocation({
      latitude: location.lat,
      longitude: location.lng,
    });
    // console.log(response.data.data);
    setPosts(response.data.data);
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
  }, [location]);

  return (
    <>
      <div className="h-[calc(100vh-80px)] w-full p-2 flex flex-col gap-5 ">
        <SearchBar />
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
