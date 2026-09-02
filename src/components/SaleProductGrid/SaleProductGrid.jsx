import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SaleProductGrid.css";
import { productApi } from "../../api/productApi";
import { cartApi } from "../../api/cartApi";
import { useCartCount } from "../../context/CartCountContext";
import { VariantModal } from "../ProductGrid/ProductGrid";
import WishlistButton from "../common/WishlistButton";

export default function SaleProductGrid({ title, products = [] }) {
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
          price: variant.price ?? variant.sale_price ?? variant.regular_price,
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
    <section className="sale-grid-section">
      <div className="sale-grid-header">
        <h2>{title}</h2>
        <a href="/category" className="see-more-link">
          See More <span>&raquo;</span>
        </a>
      </div>

      <div className="sale-grid">
        {products.map((p) => (
          <div
            className="sale-card"
            key={p.id}
            onClick={() => navigate(`/product/${p.id}`)}
          >
            {p.onSale && <span className="sale-tag">sale</span>}

            <WishlistButton
              productId={p.id}
              className="sale-wishlist-btn"
              activeClassName="sale-wishlist-btn-active"
            />

            <div className="sale-card-img">
              <img src={p.image} alt={p.name} />
            </div>

            <p className="sale-price">Price: {p.price}</p>
            <p className="sale-name">{p.name}</p>
            <p className="sale-chip">{p.chip}</p>
            <p className="sale-desc">{p.desc}</p>

            <div className="sale-actions">
              <button
                type="button"
                className="sale-cta-btn"
                disabled={adding && variantModalProduct?.id === p.id}
                onClick={(event) => openVariantModal(event, p)}
              >
                {p.ctaLabel || "Add to Cart"}
              </button>
            </div>
          </div>
        ))}
      </div>

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

