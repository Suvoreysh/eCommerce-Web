import Navbar from "../../components/navbar/Navbar";
import Hero from "../../components/hero/Hero";
import CategorySection from "../../components/categorySection/CategorySection";
import ProductGrid from "../../components/ProductGrid/ProductGrid";
import AirPodsBanner from "../../components/AirPodsBanner/AirPodsBanner";
import AboutProduct from "../../components/AboutProduct/AboutProduct";
import FocusedProducts from "../../components/FocusedProducts/FocusedProducts";
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
      <FocusedProducts />
      <WhyChooseUs />
      <Partners />
      <FeedbackForm />
      <Footer />
    </>
  );
}
