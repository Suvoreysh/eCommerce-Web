import { useParams } from "react-router-dom";

import Navbar from "../../components/navbar/Navbar";
import ProductMulti from "../../components/Productmulti/Productmulti";
import ProductHighlights from "../../components/ProductHighlights/ProductHighlights";
import ProductivityDetails from "../../components/ProductivityDetails/ProductivityDetails";
import BatteryCapacity from "../../components/BatteryCapacity/BatteryCapacity";
import DisplayShowcase from "../../components/DisplayShowcase/DisplayShowcase";
import PrivacySecurity from "../../components/PrivacySecurity/PrivacySecurity";
import KeepExploring from "../../components/KeepExploring/KeepExploring";
import CustomerReview from "../../components/CustomerReview/CustomerReview";
import WhyAppleBest from "../../components/whyapplebest/WhyAppleBest";
import Footer from "../../components/Footer/Footer";

export default function SingleProductpage() {
  const { id: productId } = useParams();

  return (
    <>
      <Navbar />

      {/* key forces a clean remount whenever the product ID changes */}
      <ProductMulti key={productId} />

      <ProductHighlights
        key={`highlights-${productId}`}
        productId={productId}
      />
      <ProductivityDetails />
      <BatteryCapacity />
      <DisplayShowcase />
      <PrivacySecurity key={`privacy-${productId}`} productId={productId} />
      <WhyAppleBest key={`why-${productId}`} productId={productId} />

      <KeepExploring key={`related-${productId}`} />
      <CustomerReview key={`reviews-${productId}`} />

      <Footer />
    </>
  );
}
