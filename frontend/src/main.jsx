import { createContext, StrictMode, useContext, useEffect } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import store from "./store/store.js";
import { Provider, useDispatch } from "react-redux";
import {
  BrowserRouter,
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from "react-router-dom";
import "./index.css";
import AuthService  from "./api/services/auth.services.js";
import { login, logout } from "./store/authSlice.js";
import ErrorHandler from "./utils/ErrorHandler.utils.js";
import Home from "./pages/Home/Home.jsx";
import Layout from "./components/ui/Layout/Layout.jsx";
import ErrorPage from "./pages/ErrorPage/ErrorPage.jsx";
import { Provider as ChakraProvider} from "@/components/ui/provider"
import Login from "./pages/Login/Login.jsx";
import PostForm from "./pages/NewPost/PostForm.jsx";
import ExplorePosts from "./pages/Explore/ExplorePosts.jsx";
import Post from "./pages/PostPage/Post.jsx";
import { LocationProvider } from "./utils/Context/LocationContext.jsx";
// import { Toaster } from "@chakra-ui/react";
// import { io } from "socket.io-client"; // socket io trails
// import config from "../config/config.js";


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout/>}>
      <Route index element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/new-post" element={<PostForm />} />
      <Route path="/explore-posts" element={<ExplorePosts />} />
      <Route path="/explore-posts/:id" element={<Post />} />
      {/* <Route path="sellerdashboard/" element={<SellerDashboard />}>
        <Route path="login" element={<SellerLogin />} />
        <Route path="products" element={<Productscomp />} />
        <Route path="orders" element={<SellerOrders />} />
      </Route> */}
      <Route path="*" element={<ErrorPage />} />
    </Route>
  )
);

const CheckAuth = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkToken = async () => {
      try {
        const user = await AuthService.getCurrentUser() // Calls backend to check session
        
        if (user) {
          dispatch(login(user))
        } else {
          dispatch(logout())
        }
      } catch(error) {
        ErrorHandler(error)
      }
    };
    checkToken();
  }, [dispatch]);

  return children;
};


// socket io trails
// const SocketContext = createContext(null);
// const socket = io(config.backendApiBaseUrl); // Connect to backend

// const SocketProvider = ({ children }) => {
//   useEffect(() => {
//     socket.on("connect", () => {
//       console.log("Connected to server:", socket.id);
//     });

//     return () => {
//       socket.disconnect(); // Cleanup when unmounting
//     };
//   }, []);

//   return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
// };

// export const useSocket = () => {
//   return useContext(SocketContext);
// };

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ChakraProvider>
      <Provider store={store}>
        {/* <SocketProvider> */}
        <LocationProvider>
            <CheckAuth>
              <RouterProvider router={router} />
            </CheckAuth>
        </LocationProvider>
        {/* </SocketProvider> */}
        {/* <App /> */}
      </Provider>
    </ChakraProvider>
  </StrictMode>
);
