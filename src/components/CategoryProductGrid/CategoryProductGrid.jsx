import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CategoryProductGrid.css";
import { FiBox, FiShield, FiPackage } from "react-icons/fi";
import { productApi } from "../../api/productApi";
import { cartApi } from "../../api/cartApi";
import { useCartCount } from "../../context/CartCountContext";
import { VariantModal } from "../ProductGrid/ProductGrid";
import WishlistButton from "../common/WishlistButton";

export default function CategoryProductGrid({ title, products = [] }) {
  const navigate = useNavigate();
  const { refreshCartCount } = useCartCount();

  const [variantModalProduct, setVariantModalProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [variantsLoading, setVariantsLoading] = useState(false);
  const [variantsError, setVariantsError] = useState("");
  const [adding, setAdding] = useState(false);

  const openVariantModal = async (event, product) => {
    event.stopPropagation();

    setVariantModalProduct(product);
    setVariants([]);
    setVariantsError("");
    setVariantsLoading(true);

    try {
      const response = await productApi.getProductVariants(product.id);
      const rows = Array.isArray(response?.data) ? response.data : [];

      const normalized = rows
        .map((variant) => ({
          id: variant.id ?? variant.product_variant_id ?? null,
          name: product.name,
          label:
            variant.label ??
            variant.storage ??
            variant.size ??
            variant.sku ??
            "Standard",
          image: variant.image ?? product.image,
          price:
            variant.price ??
            variant.sale_price ??
            variant.regular_price ??
            product.price ??
            product.originalPrice,
          stock_quantity: variant.stock_quantity,
        }))
        .filter((variant) => variant.id !== null);

      setVariants(
        normalized.length
          ? normalized
          : [
              {
                id: product.id,
                name: product.name,
                label: "Standard",
                image: product.image,
                price: product.price ?? product.originalPrice,
                stock_quantity: product.stock_quantity,
              },
            ],
      );
    } catch (err) {
      setVariantsError(err.message || "Unable to load variants.");
    } finally {
      setVariantsLoading(false);
    }
  };

  const addToCart = async (variantId, quantity) => {
    try {
      setAdding(true);
      await cartApi.addItem(variantId, quantity);
      setVariantModalProduct(null);
      refreshCartCount();
    } catch (err) {
      alert(err.message || "Unable to add item to cart.");
    } finally {
      setAdding(false);
    }
  };

  return (
    <section className="category-grid-section">
      <div className="category-grid-header">
        <h2>{title}</h2>
      </div>

      {products.length === 0 ? (
        <div className="category-empty">
          <FiPackage className="category-empty-icon" />
          <p className="category-empty-title">No products available</p>
          <p className="category-empty-subtext">
            {title} doesn't have any products yet — check back soon or browse
            another category.
          </p>
        </div>
      ) : (
        <div className="category-grid">
          {products.map((product) => (
            <article
              className="category-card"
              key={product.id}
              onClick={() => navigate(`/productdetails/${product.id}`)}
            >
              <WishlistButton
                productId={product.id}
                className="category-wishlist-btn"
                activeClassName="category-wishlist-btn-active"
              />

              <div className="category-card-img">
                <img src={product.image} alt={product.name} />
              </div>

              <p className="category-name">{product.name}</p>

              <p className="category-price">
                <span className="price-current">₹ {product.price}</span>

                <span className="price-original">
                  ₹ {product.originalPrice}
                </span>
              </p>

              <div className="category-tags">
                <span>
                  <FiBox />
                  {product.tag1 || "Premium Product"}
                </span>

                <span>
                  <FiShield />
                  {product.tag2 || "Quality Assured"}
                </span>
              </div>

              <button
                type="button"
                className="category-cta-btn"
                disabled={adding && variantModalProduct?.id === product.id}
                onClick={(event) => openVariantModal(event, product)}
              >
                Add to Cart
              </button>
            </article>
          ))}
        </div>
      )}

      {variantModalProduct && (
        <VariantModal
          product={variantModalProduct}
          variants={variants}
          loading={variantsLoading}
          error={variantsError}
          adding={adding}
          onClose={() => setVariantModalProduct(null)}
          onConfirm={addToCart}
        />
      )}
    </section>
  );
}

