import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { LOGIN, SIGN_UP } from "../libs/routes";
import Login from "../pages/entry/Login";
import SignUp from "../pages/entry/SignUp";
import { AuthWrapper } from "../wrappers/AuthContext";
import { EnforceLoginStatePageWrapper } from "../wrappers/EnforceLoginStateWrapper";
import { ToastProvider } from "../wrappers/ToastProvider";
import "./App.css";
import "react-toastify/dist/ReactToastify.css"; // Import toastify CSS

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
                  {/* <SecondaryLayout navigationMenu={NAV_SECTIONS} /> */}
                </EnforceLoginStatePageWrapper>
              }
            >
              {/* Nest all routes that has a SecondaryLayout here */}
              <Route path="/" element={<h1>Welcome!</h1>} />
            </Route>
            <Route path={LOGIN} element={<Login />} />
            <Route path={SIGN_UP} element={<SignUp />} />
          </Routes>
        </ToastProvider>
      </AuthWrapper>
    </div>
  );
}
