import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Seo from "../../components/common/Seo";
import Header from "../../components/common/Header";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import { productApi } from "../../api/productApi";
import { mockProducts } from "../../utils/mockProducts";
import { useCart } from "../../context/CartContext";
import "./SingleProduct.css";

export default function SingleProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    productApi
      .getById(id)
      .then((data) => !cancelled && setProduct(data?.product || mockProducts.find((p) => p.id === id) || mockProducts[0]))
      .catch(() => !cancelled && setProduct(mockProducts.find((p) => p.id === id) || mockProducts[0]))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading || !product) {
    return (
      <main className="page">
        <Header title="Product" />
        <Loader />
      </main>
    );
  }

  return (
    <main className="page product-detail">
      <Seo title={product.name} description={product.description} />
      <Header title={product.name} />

      <div className="product-detail__media">
        <img src={product.image} alt={product.name} />
      </div>

      <h1 className="product-detail__name">
        {product.name} <span className="product-detail__sku">256GQ</span>
      </h1>
      <p className="product-detail__rating">{"★".repeat(Math.round(product.rating))} ({product.rating})</p>
      <p className="product-detail__price">
        ₹{product.price} <span className="product-detail__mrp">{product.mrp}</span>
      </p>
      <p className="product-detail__color">Color: {product.color}</p>
      <p className="product-detail__desc">{product.description}</p>

      <div className="product-detail__actions">
        <Button variant="outline" fullWidth onClick={() => addItem(product)}>
          Add to Cart
        </Button>
        <Button
          fullWidth
          onClick={() => {
            addItem(product);
            navigate("/cart");
          }}
        >
          Buy Now
        </Button>
      </div>
    </main>
  );
}
