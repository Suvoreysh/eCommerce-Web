// pages/Product/SingleProduct.jsx
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import ProductMulti from "../../components/Productmulti/Productmulti";
import ProductHighlights from "../../components/ProductHighlights/ProductHighlights";
import ProductivityDetails from "../../components/ProductivityDetails/ProductivityDetails";
import BatteryCapacity from "../../components/BatteryCapacity/BatteryCapacity";
import DisplayShowcase from "../../components/DisplayShowcase/DisplayShowcase";
import PrivacySecurity from "../../components/PrivacySecurity/PrivacySecurity";
import WhyChooseUs from "../../components/WhyChooseUs/WhyChooseUs";
import KeepExploring from "../../components/KeepExploring/KeepExploring";
import CustomerReview from "../../components/CustomerReview/CustomerReview";
import Footer from "../../components/Footer/Footer";

export default function SingleProductpage() {
  const { id } = useParams();

  // TODO: replace with a real fetch, e.g.
  // const [product, setProduct] = useState(null);
  // useEffect(() => { apiRequest(`/products/${id}`).then(setProduct); }, [id]);

  return (
    <>
      <Navbar />
      <ProductMulti productId={id} />
      <ProductHighlights />
      <ProductivityDetails />
      <BatteryCapacity />
      <DisplayShowcase />
      <PrivacySecurity />
      <WhyChooseUs />
      <KeepExploring />
      <CustomerReview />
      <Footer />
    </>
  );
}
