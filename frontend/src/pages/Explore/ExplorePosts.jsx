import PostService from "@/api/services/post.services";
import SearchBar from "@/components/SearchBar/SearchBar";
import PostCard from "@/components/ui/Post/PostCard";
import { useLocationContext } from "@/utils/Context/LocationContext";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router";

function ExplorePosts() {
  const defaultCoordinates = [18.521432806997094, 73.85769665098046];
  const { location, setLocation } = useLocationContext();
  const [coordinates, setCoordinates] = useState(null);
  const [prevLocation, setPrevLocation] = useState(null);

  const user = useSelector((state) => state.authSlice.user);
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    console.log("As");
    // console.log(location, prevLocation);
    // if (user && location === defaultCoordinates) {
    //   setLocation(user.location.coordinates);
    // }
    setPrevLocation(location);
    // setCurrentLocation(coordiante)
    // console.log(coordiante)
    const coordiante = location;
    const response = await PostService.getPostsByLocation({
      latitude: coordiante[0],
      longitude: coordiante[1],
    });
    console.log(response.data.data);
    setPosts(response.data.data);
  };

  useEffect(() => {
    console.log(location,defaultCoordinates)
        if (
        user &&
        defaultCoordinates[0] === location[0] &&
        defaultCoordinates[1] === location[1]
        ) {
        setLocation(user.location.coordinates);
        }
        
        if (
        defaultCoordinates[0] === location[0] &&
        defaultCoordinates[1] === location[1]
        ) {
            console.log("As")
        fetchPosts();
        } else if (
        prevLocation &&
        prevLocation[0] !== location[0] &&
        prevLocation[1] !== location[1]
        ) {
        fetchPosts();
        } else{
            fetchPosts()
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
