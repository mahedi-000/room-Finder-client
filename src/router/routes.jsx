import { createBrowserRouter } from "react-router";
import MainLayout from "../Layout/MainLayout";
import Home from "../Pages/Home";
import Login from "../Pages/Login";
import Registration from "../Pages/Registration";
import Routines from "../Pages/Routines";
import AboutUs from "../Pages/AboutUs";
import UploadRoutine from "../Pages/UploadRoutine";
import UpdateRoutine from "../Pages/UpdateRoutine";
import Rooms from "../Pages/Rooms";
import UploadSection from "../Pages/UploadSection";
import UploadCourse from "../Pages/UploadCourse";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "about-us",
        element: <AboutUs />,
      },
      {
        path: "routines",
        element: <Routines />,
      },
      {
        path: "upload-routine",
        element: <UploadRoutine />,
      },
      {
        path: "update-routine/:id",
        element: <UpdateRoutine />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Registration />,
      },
      {
        path: "rooms",
        element: <Rooms />,

      },
     {
        path: "upload-section",
        element: <UploadSection />,
      },
      {
        path: "upload-course",
        element: <UploadCourse />,
      }
    
    ],
  },
]);
