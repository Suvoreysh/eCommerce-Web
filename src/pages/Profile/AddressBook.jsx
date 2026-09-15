import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiPlus, FiEdit2, FiTrash2, FiMapPin, FiCheck } from "react-icons/fi";

import Seo from "../../components/common/Seo";
import AccountSidebar from "../../components/profile/AccountSidebar";
import BackHomeButton from "../../components/profile/BackHomeButton";
import { addressApi } from "../../api/addressApi";
import "../Cart/Cart.css";
import "./AddressBook.css";

export default function AddressBook() {
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const loadAddresses = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await addressApi.list();
      const list = res?.data || res?.addresses || res || [];
      setAddresses(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err.message || "Unable to load your addresses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const handleSetDefault = async (id) => {
    try {
      setBusyId(id);
      await addressApi.setDefault(id);
      setAddresses((prev) =>
        prev.map((addr) => ({
          ...addr,
          is_default: addr.id === id,
        })),
      );
    } catch (err) {
      setError(err.message || "Unable to set this as default address.");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this address?")) return;

    try {
      setBusyId(id);
      await addressApi.remove(id);
      setAddresses((prev) => prev.filter((addr) => addr.id !== id));
    } catch (err) {
      setError(err.message || "Unable to delete this address.");
    } finally {
      setBusyId(null);
    }
  };

  const addressCard = (addr) => (
    <div key={addr.id} className="addr-card">
      {Boolean(addr.is_default) && (
        <span className="addr-card__badge">Default</span>
      )}

      <div className="addr-card__top">
        <span className="addr-card__type">
          <FiMapPin /> {addr.address_type || "Address"}
        </span>
      </div>

      <h3 className="addr-card__name">{addr.full_name}</h3>
      <p className="addr-card__phone">{addr.phone_number}</p>

      <p className="addr-card__lines">
        {[addr.house_name, addr.street_name, addr.full_address, addr.landmark]
          .filter(Boolean)
          .join(", ")}
        <br />
        {[addr.city, addr.state, addr.pincode, addr.country]
          .filter(Boolean)
          .join(", ")}
      </p>

      <div className="addr-card__actions">
        {!addr.is_default && (
          <button
            type="button"
            className="addr-card__action"
            disabled={busyId === addr.id}
            onClick={() => handleSetDefault(addr.id)}
          >
            <FiCheck /> Set default
          </button>
        )}

        <button
          type="button"
          className="addr-card__action"
          onClick={() => navigate(`/address/edit/${addr.id}`)}
        >
          <FiEdit2 /> Edit
        </button>

        <button
          type="button"
          className="addr-card__action addr-card__action--danger"
          disabled={busyId === addr.id}
          onClick={() => handleDelete(addr.id)}
        >
          <FiTrash2 /> Delete
        </button>
      </div>
    </div>
  );

  const body = (
    <div className="addr-book">
      <Link to="/address/add" className="addr-add-btn">
        <FiPlus /> Add New Address
      </Link>

      {error && <p className="change-password-error">{error}</p>}

      {loading ? (
        <p className="addr-empty">Loading your addresses…</p>
      ) : addresses.length === 0 ? (
        <div className="addr-empty">
          <FiMapPin size={32} />
          <p>You haven't saved any addresses yet.</p>
        </div>
      ) : (
        <div className="addr-list">{addresses.map(addressCard)}</div>
      )}
    </div>
  );

  return (
    <div className="cart-page">
      <Seo title="Address Book" description="Manage your saved addresses." />

      {/* ---------- Mobile header ---------- */}
      <header className="cart-header">
        <BackHomeButton className="back-btn" />
        <h1>Address Book</h1>
      </header>

      {/* ---------- Mobile body ---------- */}
      <div className="mobile-list addr-book-mobile">{body}</div>

      {/* ---------- Desktop layout ---------- */}
      <div className="cd-desktop">
        <AccountSidebar />

        <div className="od-main">
          <div className="od-main-header">
            <div className="od-main-title">
              <BackHomeButton className="od-desktop-back-btn" />
              <h1>Address Book</h1>
            </div>
          </div>

          {body}
        </div>
      </div>
    </div>
  );
}
