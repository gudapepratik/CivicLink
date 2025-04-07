// import PostService from "@/api/services/post.services";
// import { NotLoginImg1, NotResultImg1 } from "@/assets/assets.config";
// import Error from "@/components/Error/Error";
// import PostCard from "@/components/Post/PostCard";
// import PostCardSkeleton from "@/components/Post/PostCardSkeleton";
// import SearchBar from "@/components/SearchBar/SearchBar";
// import { useLocationContext } from "@/utils/Context/LocationContext";
// import { ToasterNotification } from "@/utils/ToastNotification/ToastNotification";
// import { Loader } from "lucide-react";
// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import ReportMap from "../ReportMap/ReportMap";

// function NewReports() {
//   const defaultCoordinates = [18.521432806997094, 73.85769665098046];
//   const { location, setLocation } = useLocationContext();
//   const [prevLocation, setPrevLocation] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const user = useSelector((state) => state.authSlice.user);
//   const [posts, setPosts] = useState(null);
//   const [status, setStatus] = useState("")
//   const [trigger, setTrigger] = useState(false)
//   const [fetchTrigger, setFetchTrigger] = useState(false)
//   const [markers, setMarkers] = useState([])

//     const [filterData, setFilterData] = useState({
//       status: ["all"],
//       category: "all",
//       distance: 10, // 30 km default
//       sortBy: "nearestfirst"
//     })
  
//     const [viewType, setViewType] = useState("list") // list / map

//   const fetchPosts = async () => {
//     try {
//       setIsLoading(true);

//       setPrevLocation(location);
//       // console.log("fetching")
//       // console.log(location)
//       const response = await PostService.getPostsByDepartmentAndLocation({
//         departmentId: user?.departmentId,
//         latitude: location.lat,
//         longitude: location.lng,
//         ...filterData
//       });

//       // console.log(response.data.data);
//       setPosts(response.data.data);
//     } catch (error) {
//       console.log(error);
//       ToasterNotification({
//         type: "warning",
//         title: "Error Occurred",
//         description: `${error.message}`,
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Effect for setting user location when available
//   useEffect(() => {
//     if (
//       user &&
//       (location.lat === defaultCoordinates[0] ||
//         location.lng === defaultCoordinates[1])
//     ) {
//       setLocation({
//         lat: user.location.coordinates[1],
//         lng: user.location.coordinates[0],
//       });
//     }
//   }, [user]);

//   useEffect(() => {
//     // console.log(location, defaultCoordinates, prevLocation);
//     if (
//       prevLocation &&
//       (prevLocation.lat !== location.lat || prevLocation.lng !== location.lng)
//     ) {
//       fetchPosts();
//     } else if (!prevLocation) {
//       fetchPosts();
//     }
//     fetchPosts()
//   }, [location, fetchTrigger]);

//   return (
//     <>
//       {!user && (
//         <Error
//           image={NotLoginImg1}
//           title={"User Not Logged In"}
//           message={"Please Login first"}
//         />
//       )}
//       {/* {isLoading && <Loader />} */}
//       <div className="h-[calc(100vh-80px)] w-full p-2 flex flex-col gap-5 ">
//         <SearchBar viewType={viewType} setViewType={setViewType} filterData={filterData} setFilterData={setFilterData} trigger={setFetchTrigger}/>
        
//         {viewType === "list" && (
//           <div className="w-full">
//               {posts && posts.length > 0 && (
//                 <div className="w-full flex flex-col gap-5">
//                   {posts.map((post, index) => (
//                     <PostCard key={index} postDetails={post} />
//                   ))}
//                 </div>
//               )}
//               {isLoading && !posts && (
//                 <>
//                   <PostCardSkeleton/>
//                   <PostCardSkeleton/>
//                   <PostCardSkeleton/>
//                 </>
//               )}
//               {posts && posts.length === 0 && (
//                 <Error 
//                   image={NotResultImg1} 
//                   hoffset={300}
//                   title={"No Posts Available !"} 
//                   message={"There are no posts available for this query at the moment."} 
//                 />
//               )}
//           </div>
//         )}

//         {viewType === "map" && (
//           <ReportMap markers={markers}/>
//         )}
        
//       </div>
//     </>
//   );
// }

// export default NewReports;


import PostService from "@/api/services/post.services";
import { NotLoginImg1, NotResultImg1 } from "@/assets/assets.config";
import Error from "@/components/Error/Error";
import PostCard from "@/components/Post/PostCard";
import PostCardSkeleton from "@/components/Post/PostCardSkeleton";
import SearchBar from "@/components/SearchBar/SearchBar";
import { useLocationContext } from "@/utils/Context/LocationContext";
import { ToasterNotification } from "@/utils/ToastNotification/ToastNotification";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ReportMap from "../ReportMap/ReportMap";
import { useSearchFilterContext } from "@/utils/Context/SearchFilterContext";

function NewReports() {
  const defaultCoordinates = [18.521432806997094, 73.85769665098046];
  const { location, setLocation } = useLocationContext();
  const { viewType, filterData, filterTrigger } = useSearchFilterContext();

  const user = useSelector((state) => state.authSlice.user);

  const [posts, setPosts] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [prevLocation, setPrevLocation] = useState(null);

  const [markerDetails, setMarkerDetails] = useState([]);
  const [markerLocations, setMarkerLocations] = useState([]);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      setPrevLocation(location);

      const response = await PostService.getPostsByDepartmentAndLocation({
        departmentId: user?.departmentId,
        latitude: location.lat,
        longitude: location.lng,
        ...filterData,
      });

      const postsData = response.data.data;
      setPosts(postsData);

      // Setup for map markers
      const newMarkerLocations = [];
      const newMarkerDetails = [];

      postsData.forEach((post) => {
        newMarkerLocations.push({
          lat: post.location.coordinates[0],
          lng: post.location.coordinates[1],
        });

        newMarkerDetails.push({
          avatar: post.userDetails?.[0]?.avatar?.publicUrl || "",
          title: post.title,
          link: `/explore-posts/${post._id}`,
        });
      });

      setMarkerLocations(newMarkerLocations);
      setMarkerDetails(newMarkerDetails);
    } catch (error) {
      console.log(error);
      ToasterNotification({
        type: "warning",
        title: "Error Occurred",
        description: `${error.message}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Set default user location if default coordinates are found
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

  // Trigger fetch on location or filter change
  useEffect(() => {
    if (
      prevLocation &&
      (prevLocation.lat !== location.lat || prevLocation.lng !== location.lng)
    ) {
      fetchPosts();
    } else if (!prevLocation) {
      fetchPosts();
    }

    fetchPosts();
  }, [location, filterTrigger]);

  return (
    <>
      {!user ? (
        <Error
          image={NotLoginImg1}
          title={"User Not Logged In"}
          message={"Please Login first"}
        />
      ) : (
        <div className="h-[calc(100vh-80px)] w-full p-2 flex flex-col gap-5">
          <SearchBar />
          {viewType === "list" && (
            <div className="w-full">
              {posts && posts.length > 0 && (
                <div className="w-full flex flex-col gap-5">
                  {posts.map((post) => (
                    <PostCard key={post._id} postDetails={post} />
                  ))}
                </div>
              )}

              {isLoading && !posts && (
                <>
                  <PostCardSkeleton />
                  <PostCardSkeleton />
                  <PostCardSkeleton />
                </>
              )}

              {posts && posts.length === 0 && (
                <Error
                  image={NotResultImg1}
                  hoffset={300}
                  title={"No Posts Available !"}
                  message={"There are no posts available for this query at the moment."}
                />
              )}
            </div>
          )}

          {viewType === "map" && (
            <ReportMap markerDetails={markerDetails} locations={markerLocations} />
          )}
        </div>
      )}
    </>
  );
}

export default NewReports;
