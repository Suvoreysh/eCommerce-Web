import Navbar from "../../components/navbar/Navbar";
import ProductMulti from "../../components/Productmulti/Productmulti";
import ProductHighlights from "../../components/ProductHighlights/ProductHighlights";
import ProductivityDetails from "../../components/ProductivityDetails/ProductivityDetails";
import BatteryCapacity from "../../components/BatteryCapacity/BatteryCapacity";
import DisplayShowcase from "../../components/DisplayShowcase/DisplayShowcase";
import PrivacySecurity from "../../components/PrivacySecurity/PrivacySecurity";
import WhyChooseUs from "../../components/WhyChooseUs/WhyChooseUs";
import KeepExploring from "../../components/KeepExploring/KeepExploring";
import CustomerReview from "../../components/CustomerReview/CustomerReview";
import WhyAppleBest from "../../components/whyapplebest/WhyAppleBest";
import Footer from "../../components/Footer/Footer";

// ProductMulti reads the :id route param itself and fetches the product,
// including its own loading skeleton and the shared variant-select modal
// used for "Add to Cart" (same one used on Home/Category grids).
export default function SingleProductpage() {
  return (
    <>
      <Navbar />
      <ProductMulti />
      <ProductHighlights />
      <ProductivityDetails />
      <BatteryCapacity />
      <DisplayShowcase />
      <PrivacySecurity />
      <WhyAppleBest />
      <KeepExploring />
      <CustomerReview />
      <WhyChooseUs />
      <Footer />
    </>
  );
}
