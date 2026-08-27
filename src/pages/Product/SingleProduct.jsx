import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
import { productApi } from "../../api/productApi";

export default function SingleProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await productApi.getById(id);
        if (!isMounted) return;
        setProduct(response?.data || null);
      } catch (err) {
        if (!isMounted) return;
        console.error("Get product failed:", err);
        setError(err.message || "Unable to load product.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProduct();
    
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="product-skeleton">
          {/* Skeleton placeholders for image, name, price, description */}
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <p className="product-error">{error}</p>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <p className="product-missing">Product not found</p>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <ProductMulti product={product} />
      <ProductHighlights /> 
      <ProductivityDetails />
      <BatteryCapacity />
      <DisplayShowcase />
      <PrivacySecurity />
      <WhyAppleBest />
      <KeepExploring />
      <CustomerReview />
      <Footer />
    </>
  );
}
