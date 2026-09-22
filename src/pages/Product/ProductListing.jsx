import useStoreBanners from "../../hooks/useStoreBanners";
import useCategorySections from "../../hooks/useCategorySections";
import useVariantCart from "../../hooks/useVariantCart";

import SearchBar from "../../components/SearchBar/SearchBar";
import StoreIntro from "../../components/StoreIntro/StoreIntro";
import PromoBanner from "../../components/PromoBanner/PromoBanner";
import CategoryScroller from "../../components/CategoryScroller/CategoryScroller";
import OfferCards from "../../components/OfferCards/OfferCards";
import CategoryProductSection from "../../components/store/CategoryProductSection";
import CategoryOffersGrid from "../../components/store/CategoryOffersGrid";
import TaglineBanner from "../../components/TaglineBanner/TaglineBanner";
import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/navbar/Navbar";

export default function ProductListing() {
  const { topBanner, exclusiveOffers, loading: bannersLoading } =
    useStoreBanners(["all_products_top", "store_top"]);
  const {
    status,
    error,
    categories,
    sections,
    reload,
    retrySection,
  } = useCategorySections(4);
  const { open: openVariants, modal: variantModal } = useVariantCart();

  // A category whose products finished loading and came back empty is
  // dropped from the page entirely — nothing useful to show for it here.
  const visibleCategories = categories.filter((category) => {
    const section = sections[category.id];
    return !section || section.status !== "ready" || section.products.length > 0;
  });

  return (
    <>
      <Navbar />
      <SearchBar />
      <StoreIntro
        title="Store"
        subtitle={
          topBanner?.title || "The Best location to buy the product you loved."
        }
      />
      <PromoBanner
        image={topBanner?.image}
        alt={topBanner?.title || "Top store banner"}
        loading={bannersLoading}
      />
      <CategoryScroller />
      <OfferCards
        title={
          exclusiveOffers[0]?.title
            ? `Exclusive ${exclusiveOffers[0].title} Offers`
            : "Exclusive Offers"
        }
        offers={exclusiveOffers}
        loading={bannersLoading}
      />

      {status === "loading" &&
        Array.from({ length: 2 }).map((_, index) => (
          <CategoryProductSection
            key={`store-section-skeleton-${index}`}
            category={{ id: `skeleton-${index}`, name: "" }}
            section={{ status: "loading", products: [] }}
            onAddToCart={openVariants}
            onRetry={() => {}}
          />
        ))}

      {status === "error" && (
        <section className="store-section" role="alert">
          <p style={{ color: "red", textAlign: "center", padding: "40px 0" }}>
            {error}
          </p>
          <button
            type="button"
            onClick={reload}
            style={{
              display: "block",
              margin: "0 auto",
              padding: "10px 22px",
              borderRadius: 999,
              border: "1.5px solid #123848",
              background: "#fff",
              color: "#123848",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </section>
      )}

      {status === "ready" &&
        visibleCategories.map((category) => {
          const section = sections[category.id] || {
            status: "loading",
            products: [],
          };

          return (
            <div key={category.id}>
              <CategoryProductSection
                category={category}
                section={section}
                onAddToCart={openVariants}
                onRetry={retrySection}
              />
              {section.status === "ready" && (
                <CategoryOffersGrid category={category} offers={section.offers || []} />
              )}
            </div>
          );
        })}

      <TaglineBanner />
      <Footer />
      {variantModal}
    </>
  );
}
