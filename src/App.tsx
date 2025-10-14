import React, { useEffect } from "react";
import Router from "./routes/router";
import './assets/scss/index.scss'
import { Toaster } from "react-hot-toast";
import { toastOptions } from "./utils/customFn";
import Aos from 'aos';



const App: React.FC = () => {
  useEffect(function () {
  Aos.init({ duration: 1000 });
  }, []);
  return (
    <>
      <Toaster toastOptions={toastOptions} reverseOrder={true} />
      <Router />
    </>
  );
};

export default App;
