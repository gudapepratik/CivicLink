import PostService from "@/api/services/post.services";
import SearchBar from "@/components/SearchBar/SearchBar";
import PostCard from "@/components/Post/PostCard";
import { useLocationContext } from "@/utils/Context/LocationContext";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useParams, useSearchParams } from "react-router";
import { ToasterNotification } from "@/utils/ToastNotification/ToastNotification";
import Loader from "@/components/Loader/Loader";
import { RiLoaderLine } from "@remixicon/react";
import Error from "@/components/Error/Error";
import { NotLoginImg1, NotResultImg1 } from "@/assets/assets.config";
import ReportMap from "../ReportMap/ReportMap";
import PostCardSkeleton from "@/components/Post/PostCardSkeleton";
import Error2 from "@/components/Error/Error2";
import { useSearchFilterContext } from "@/utils/Context/SearchFilterContext";

function ExplorePosts() {
  const defaultCoordinates = [18.521432806997094, 73.85769665098046];
  const pageLocation = useLocation();
  const pathRef = useRef(pageLocation.pathname)
  const { location, setLocation } = useLocationContext();
  const [prevLocation, setPrevLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false)
  // const [status, setStatus] = useState("")
  // const [fetchTrigger, setFetchTrigger] = useState(false)
  const [markerDetails, setMarkerDetails] = useState([]);
  const [markerLocations, setMarkerLocations] = useState([]);

  const user = useSelector((state) => state.authSlice.user);
  const [posts, setPosts] = useState(null);

  const {ResetFilterData, viewType, filterData,filterTrigger,} = useSearchFilterContext();

  const fetchPosts = async () => {
    try {
      setIsLoading(true)
      // console.log("aaaacallll")
      setPrevLocation(location);
      // // console.log(location)
      const response = await PostService.getPostsByLocation({
        latitude: location.lat,
        longitude: location.lng,
        isAdminFetch: (user && user.role === "admin") ? true: false,
        isSpecificFetch:(user && pageLocation.pathname === "/user-posts") ? true: false,
        userId: (user && pageLocation.pathname === "/user-posts") ? user._id : null,
        ...filterData
      });

      // // console.log(response.data.data);
      setPosts([...response.data.data]);

      const newMarkerLocations = [];
      const newMarkerDetails = [];
    
      response.data.data.forEach((post) => {
        newMarkerLocations.push({
          lat: post.location.coordinates[0],
          lng: post.location.coordinates[1],
        });
    
        newMarkerDetails.push({
          avatar: post.userDetails[0]?.avatar.publicUrl || "", // safety check
          title: post.title,
          link: `/explore-posts/${post._id}`,
        });
      });
    
      setMarkerLocations(newMarkerLocations);
      setMarkerDetails(newMarkerDetails);
    } catch (error) {
      // console.log(error)
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
    // // console.log(location, defaultCoordinates, prevLocation);
    if (
      prevLocation &&
      (prevLocation.lat !== location.lat || prevLocation.lng !== location.lng)
    ) {
      fetchPosts();
    } else if (!prevLocation) {
      fetchPosts();
    }
    fetchPosts()
  }, [location,filterTrigger]);

  useEffect(() => {
    // use window.scrollTo() method to scroll to top smoothly whenever user clicks on next or prev buttons
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  },[])

  // to reset the filters 
  // useEffect(() => {
  //   const prevPath = pathRef.current;
  //   // console.log(prevPath, pathRef)

  //   if(prevPath && !prevPath.startsWith("/explore-posts/")) {
  //     ResetFilterData()
  //   }

  //   pathRef.current = pageLocation.pathname;

  // },[pageLocation.pathname])

  // const [filterData, setFilterData] = useState({
  //   status: ["all"],
  //   category: "all",
  //   distance: 10, // 30 km default
  //   sortBy: "nearestfirst",
  //   approvalStatus: ["pending"]
  // })

  // const [viewType, setViewType] = useState("list") // list / map

  return (
    <>
      {/* {isLoading && <Loader/>} */}
      {!user && pageLocation.pathname === "/user-posts" ?
        <Error2 image={NotLoginImg1} hoffset={100} title={'User Not Logged in'} message={"Log in to your account to Create a post"}/>
      :
        <>
          <div className="h-[calc(100vh-80px)] w-full p-2 flex flex-col gap-5 ">
            {/* <SearchBar viewType={viewType} setViewType={setViewType} filterData={filterData} setFilterData={setFilterData} trigger={setFetchTrigger}/> */}
            <SearchBar />
            {viewType === "list" && (
              <div className="w-full pb-4">

              {posts && posts.length > 0 && (
                <div className="w-full flex flex-col gap-5">
                    {posts.map((post, index) => (
                      <PostCard key={post._id} postDetails={post} />
                    ))}
                </div>
              )}

              {posts && posts.length === 0 && (
                <Error
                  image={NotResultImg1}
                  hoffset={200}
                  title={"No More Reports !"}
                  message={"There are no further reports available to show."}
                />
              )}
                
              {isLoading && !posts && (
                <div className="w-full flex flex-col gap-3">
                  <PostCardSkeleton/>
                  <PostCardSkeleton/>
                  <PostCardSkeleton/>
                </div>
              )}
              </div>
            )}
            {viewType === "map" && (
              <ReportMap markerDetails={markerDetails} locations={markerLocations}/>
            )}
          </div>
        </>
      }
    </>
  );
}

export default ExplorePosts;
