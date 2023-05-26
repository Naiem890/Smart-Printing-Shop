import React from "react";
import AboutUs from "./AboutUs";
import Hero from "./Hero";
import Features from "./Features";
import Innovation from "./Innovation";
import Faqs from "./Faqs";

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      {/* <AboutUs /> */}

      <Innovation />
      <Faqs />
    </>
  );
}
