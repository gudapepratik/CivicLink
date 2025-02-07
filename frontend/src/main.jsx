import { StrictMode, useEffect } from "react";
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
import { Toaster } from "@chakra-ui/react";


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout/>}>
      <Route index element={<Home />} />
      <Route path="/login" element={<Login />} />
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

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ChakraProvider>
      <Provider store={store}>
        <CheckAuth>
          <RouterProvider router={router} />
        </CheckAuth>
        {/* <App /> */}
      </Provider>
    </ChakraProvider>
  </StrictMode>
);
