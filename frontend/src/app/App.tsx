import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import { AuthWrapper } from "../wrappers/AuthContext";
import { ToastProvider } from "../wrappers/ToastProvider";
import { ToastContainer } from "react-toastify";
import { Route, Routes } from "react-router-dom";
import { EnforceLoginStatePageWrapper } from "../wrappers/EnforceLoginStateWrapper";
import SampleComponent from "../components/toDelete";

export default function App() {
  return (
    <div className="h-full">
      <AuthWrapper>
        <ToastProvider>
          <ToastContainer />
          <SampleComponent />
        </ToastProvider>
      </AuthWrapper>
    </div>
  );
}
