import Navbar from "../../components/Navbar/Navbar";
import Hero from "../../components/Hero/Hero";
import CategorySection from "../../components/CategorySection/CategorySection";
import ProductGrid from "../../components/ProductGrid/ProductGrid";
import AirPodsBanner from "../../components/AirPodsBanner/AirPodsBanner";
import AboutProduct from "../../components/AboutProduct/AboutProduct";
import ProBeyond from "../../components/ProBeyond/ProBeyond";
import BuiltForBold from "../../components/BuiltForBold/BuiltForBold";
import WhyChooseUs from "../../components/WhyChooseUs/WhyChooseUs";
import Partners from "../../components/Partners/Partners";
import FeedbackForm from "../../components/FeedbackForm/FeedbackForm";
import Footer from "../../components/Footer/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <CategorySection />
      <ProductGrid />
       <AirPodsBanner />
      <AboutProduct />
      <ProBeyond />
      <BuiltForBold />
      <WhyChooseUs />
      <Partners />
      <FeedbackForm />
      <Footer /> 
    </>
  );
}
