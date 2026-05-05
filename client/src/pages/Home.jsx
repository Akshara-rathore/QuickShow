import React from "react";
import HeroSection from "../components/HeroSection";
import FeaturedSection from "../components/FeaturedSection";
import TrailerSection from "../components/TrailerSection";
import NewReleasesSection from "../components/NewReleasesSection";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <>
      <HeroSection />
      <FeaturedSection />
      <NewReleasesSection />
      <TrailerSection/>
      
    </>
  );
};

export default Home;