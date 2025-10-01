import React from "react";
import Router from "./routes/router";
import './assets/scss/index.scss'
import { Toaster } from "react-hot-toast";
import { toastOptions } from "./utils/customFn";

const App: React.FC = () => {
  return (
    <>
      <Toaster toastOptions={toastOptions} reverseOrder={true} />
      <Router />
    </>
  );
};

export default App;
