import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import {
  COURSES,
  CREATE_TEXT_PAGE,
  LOGIN,
  PAGES,
  SETTINGS,
  SIGN_UP,
  EDIT_PAGE,
} from "../libs/routes";
import Login from "../pages/entry/Login";
import SignUp from "../pages/entry/SignUp";
import { AuthWrapper } from "../wrappers/AuthContext";
import { EnforceLoginStatePageWrapper } from "../wrappers/EnforceLoginStateWrapper";
import { ToastProvider } from "../wrappers/ToastProvider";
import "./App.css";
import "react-toastify/dist/ReactToastify.css"; // Import toastify CSS
import { SidebarLayout } from "../libs/layout/layout";
import { NAV_SECTIONS } from "../libs/layout/navigationSections";
import CourseWrapper from "../pages/course-management/CourseWrapper";
import CourseDetails from "../pages/course-details/CourseDetails";
import CreateTraditionalTextPage from "../pages/view-pages/CreateTraditionalTextPage";
import EditTraditionalTextPage from "../pages/view-pages/EditTraditionalTextPage";
import ViewPageWrapper from "../pages/view-pages/ViewPageWrapper";

export default function App() {
  return (
    <div className="h-full">
      <AuthWrapper>
        <ToastProvider>
          <ToastContainer />
          <Routes>
            <Route
              element={
                <EnforceLoginStatePageWrapper redirectTo={LOGIN}>
                  <SidebarLayout navigationMenu={NAV_SECTIONS} />
                </EnforceLoginStatePageWrapper>
              }
            >
              {/* Nest all routes that has a SecondaryLayout here */}
              <Route path="/" element={<h1>Welcome!</h1>} />
              <Route path={COURSES} element={<CourseWrapper />} />
              <Route
                path={`${COURSES}/:courseId`}
                element={<CourseDetails />}
              />
              <Route
                path={`${COURSES}/:courseId/:tabIndex`}
                element={<CourseDetails />}
              />

              <Route path={`${PAGES}/:pageId`} element={<ViewPageWrapper />} />
              <Route
                path={`${CREATE_TEXT_PAGE}/:chapterId`}
                element={<CreateTraditionalTextPage />}
              />
              <Route
                path={`${EDIT_PAGE}/:pageId`}
                element={<EditTraditionalTextPage />}
              />

              <Route path={SETTINGS} element={<h1>Settings</h1>} />
            </Route>
            <Route path={LOGIN} element={<Login />} />
            <Route path={SIGN_UP} element={<SignUp />} />
          </Routes>
        </ToastProvider>
      </AuthWrapper>
    </div>
  );
}
