import { createBrowserRouter } from "react-router";
import MainLayout from "../Layout/MainLayout";
import Home from "../Pages/Home";
import Login from "../Pages/Login";
import Registration from "../Pages/Registration";
import Routines from "../Pages/Routines";
import TeacherRoutine from "../Pages/TeacherRoutine";
import UploadRoutine from "../Pages/UploadRoutine";
import UpdateRoutine from "../Pages/UpdateRoutine";
import DeleteRoutine from "../Pages/DeleteRoutine";
import Rooms from "../Pages/Rooms";
import UploadSection from "../Pages/UploadSection";
import UploadCourse from "../Pages/UploadCourse";
import UploadRoom from "../Pages/UploadRoom";
import RoomRoutine from "../Pages/RoomRoutine";
import UploadRoomStatus from "../Pages/UploadRoomStatus";
import UpdateRoomStatus from "../Pages/UpdateRoomStatus";
import PrivateRoute from "./PrivateRoute";
import TeacherRoute from "./TeacherRoute";
import AdminRoute from "./adminRoute";
import AllUsers from "../Pages/AllUsers";
import AdminPanel from "../Pages/AdminPanel";
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
        path: "teacher-routine",
        element: <TeacherRoutine />,
      },
      {
        path: "routines",
        element: 
          <Routines />,
      },
      {
        path:'room-routine',
        element:<RoomRoutine/>
      },
      {
        path: "upload-routine",
        element: <PrivateRoute>
          <AdminRoute>
            <UploadRoutine />
          </AdminRoute>
        </PrivateRoute>,
      },
      {
        path: "update-routine/:id",
        element: <PrivateRoute>
          <AdminRoute>
            <UpdateRoutine />
          </AdminRoute>
        </PrivateRoute>,
      },
      {
        path: "delete-routine/:id",
        element: <PrivateRoute>
          <AdminRoute>
            <DeleteRoutine />
          </AdminRoute>
        </PrivateRoute>,
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
        element: <PrivateRoute>
          <AdminRoute>
            <UploadSection />
          </AdminRoute>
        </PrivateRoute>,
      },

      {
        path: "upload-course",
        element: <PrivateRoute>
          <AdminRoute>
            <UploadCourse />
          </AdminRoute>
        </PrivateRoute>,
      },

      {
        path: "upload-room",
        element: <PrivateRoute>
          <AdminRoute>
            <UploadRoom />
          </AdminRoute>
        </PrivateRoute>,
      },
      {
        path: "room-routine",
        element: <RoomRoutine />,
      },
      {
        path: "upload-room-status",
        element: <PrivateRoute>
          <AdminRoute>
            <UploadRoomStatus />
          </AdminRoute>
        </PrivateRoute>,
      },
      {
        path: "update-room-status",
        element: <PrivateRoute>
            <UpdateRoomStatus /> 
        </PrivateRoute>,
      },
      {
        path: "all-users",
        element: <PrivateRoute>
          <AdminRoute>
            <AllUsers />
          </AdminRoute>
        </PrivateRoute>,
      },
      {
        path: "admin",
        element: <PrivateRoute>
          <AdminRoute>
            <AdminPanel />
          </AdminRoute>
        </PrivateRoute>,
      },
    ],
  },
]);
