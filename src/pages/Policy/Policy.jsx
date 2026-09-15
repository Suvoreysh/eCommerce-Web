import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiFileText, FiPackage, FiShield, FiCalendar, FiHeadphones } from "react-icons/fi";

import Seo from "../../components/common/Seo";
import BackHomeButton from "../../components/profile/BackHomeButton";
import "./Policy.css";

const TABS = [
  { key: "terms", label: "Terms & Condition", icon: <FiFileText /> },
  { key: "return", label: "Return Policy", icon: <FiPackage /> },
  { key: "privacy", label: "Privacy Policy", icon: <FiShield /> },
];

const CONTENT = {
  terms: {
    title: "Terms & Conditions",
    lastUpdated: "May 25, 2024",
    intro:
      "Welcome to our store. By accessing or using our website and services, you agree to be bound by the following terms and conditions. Please read them carefully.",
    sections: [
      {
        heading: "Acceptance of Terms",
        body: "By using our website, you agree to accept and comply with these Terms & Conditions and our policies. If you do not agree with any part of these terms, you must not use our website or services.",
      },
      {
        heading: "Use of Our Services",
        body: "You agree to use our services only for lawful purposes and in accordance with these terms. You must not use our website in any way that may damage, disable, overburden, or impair our site or interfere with any other party's use of our services.",
      },
      {
        heading: "Products & Pricing",
        body: "We strive to display product information and prices accurately. However, we do not guarantee that all information is error-free. We reserve the right to modify prices and product availability at any time without prior notice.",
      },
      {
        heading: "Orders & Payment",
        body: "All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order for any reason. Payments must be made in full at the time of purchase using our secure payment methods.",
      },
      {
        heading: "Limitation of Liability",
        body: "We shall not be liable for any indirect, incidental, or consequential damages arising from the use or inability to use our website or services.",
      },
      {
        heading: "Changes to Terms",
        body: "We reserve the right to update or change these Terms & Conditions at any time. Any changes will be posted on this page with the updated effective date.",
      },
    ],
    footnote:
      "By continuing to use our website, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions.",
  },
  return: {
    title: "Return Policy",
    lastUpdated: "May 25, 2024",
    intro:
      "We want you to be completely satisfied with your purchase. If you're not, here's how our returns and refunds work.",
    sections: [
      {
        heading: "Return Window",
        body: "Items can be returned within 7 days of delivery, provided they are unused, undamaged, and in their original packaging with all tags and accessories intact.",
      },
      {
        heading: "Non-Returnable Items",
        body: "Certain items such as perishable goods, personal care products, and items marked 'Final Sale' cannot be returned unless they arrive damaged or defective.",
      },
      {
        heading: "How to Initiate a Return",
        body: "Go to My Orders, select the item you'd like to return, and choose a reason. Our team will arrange a pickup or share drop-off instructions where applicable.",
      },
      {
        heading: "Refunds",
        body: "Once the returned item is received and inspected, refunds are processed to your original payment method within 5-7 business days.",
      },
      {
        heading: "Exchanges",
        body: "If you received a damaged, defective, or wrong item, we'll offer a free exchange or full refund based on your preference.",
      },
    ],
    footnote:
      "For any return-related questions, our support team is available 24/7 to help you.",
  },
  privacy: {
    title: "Privacy Policy",
    lastUpdated: "May 26, 2026",
    intro:
      "We respect your privacy and are committed to protecting your personal information.",
    sections: [
      {
        heading: "Information We Collect",
        body: "When you visit our website, we may collect basic details such as your name, email address, phone number, and other information you voluntarily provide.",
      },
      {
        heading: "How We Use Your Information",
        body: "This information is used to provide our services, respond to inquiries, improve your experience, and communicate important updates.",
      },
      {
        heading: "Sharing of Information",
        body: "We do not sell, rent, or share your personal information with third parties except when necessary to provide our services or comply with legal requirements.",
      },
      {
        heading: "Data Security",
        body: "We take reasonable security measures to protect your data from unauthorized access, misuse, or disclosure.",
      },
    ],
    footnote: "By using our website, you agree to this Privacy Policy.",
  },
};

export default function Policy() {
  const navigate = useNavigate();
  const { tab: tabParam } = useParams();
  const [activeTab, setActiveTab] = useState(
    TABS.some((t) => t.key === tabParam) ? tabParam : "terms",
  );

  const handleTabChange = (key) => {
    setActiveTab(key);
    navigate(`/policy/${key}`, { replace: true });
  };

  const content = CONTENT[activeTab];

  return (
    <main className="policy-page">
      <Seo
        title={content.title}
        description="Read our Terms & Conditions, Return Policy and Privacy Policy."
      />

      {/* =====================================================
          MOBILE HEADER
      ====================================================== */}
      <header className="policy-mobile-header">
        <BackHomeButton className="policy-mobile-back" />
        <h1>Policy</h1>
        <span className="policy-mobile-header-spacer" />
      </header>

      {/* =====================================================
          MOBILE TABS
      ====================================================== */}
      <div className="policy-mobile-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`policy-mobile-tab${
              activeTab === tab.key ? " policy-mobile-tab--active" : ""
            }`}
            onClick={() => handleTabChange(tab.key)}
          >
            <span className="policy-mobile-tab-icon">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* =====================================================
          SHARED CONTENT (mobile scroll body / desktop right pane)
      ====================================================== */}
      <div className="policy-layout">
        {/* Desktop sidebar */}
        <aside className="policy-sidebar">
          <BackHomeButton className="policy-sidebar-back" />

          <h2>Policies</h2>
          <p className="policy-sidebar-sub">
            Read our policies below. You can switch between different
            policies using the options.
          </p>

          <nav className="policy-sidebar-nav">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                className={`policy-sidebar-item${
                  activeTab === tab.key ? " policy-sidebar-item--active" : ""
                }`}
                onClick={() => handleTabChange(tab.key)}
              >
                <span className="policy-sidebar-icon">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>

          <div className="policy-help">
            <FiHeadphones className="policy-help-icon" />
            <div>
              <p className="policy-help-title">Need Help?</p>
              <p className="policy-help-sub">
                If you have any questions regarding our policies, feel free
                to{" "}
                <a href="mailto:support@shopkart.com">contact support</a>.
              </p>
            </div>
          </div>
        </aside>

        {/* Content */}
        <section className="policy-content">
          <div className="policy-content-header">
            <span className="policy-content-icon">{content && TABS.find((t) => t.key === activeTab)?.icon}</span>

            <div>
              <h1>{content.title}</h1>
              <p className="policy-updated">
                <FiCalendar /> Last updated: {content.lastUpdated}
              </p>
            </div>
          </div>

          <p className="policy-intro">{content.intro}</p>

          <ol className="policy-sections">
            {content.sections.map((section, index) => (
              <li key={section.heading} className="policy-section">
                <span className="policy-section-number">{index + 1}</span>
                <div>
                  <h3>{section.heading}</h3>
                  <p>{section.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="policy-footnote">
            <FiShield />
            <p>{content.footnote}</p>
          </div>
        </section>
      </div>
    </main>
  );
}
