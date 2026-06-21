import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

import API from "../../services/api";

import formatDate from "../../utils/formatDate";
import formatCurrency from "../../utils/formatCurrency";

import "./ReferralDetails.css";

const ReferralDetails = () => {
  const { id } = useParams();

  const [referral, setReferral] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [notFound, setNotFound] =
    useState(false);

  useEffect(() => {
    fetchReferral();
  }, [id]);

  const fetchReferral = async () => {
    try {
      const response = await API.get(
        `/referrals?id=${id}`
      );

      const data = response.data.data;

      if (data?.id || data?.id === 0) {
        setReferral(data);
      } else {
        setNotFound(true);
      }
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (notFound) {
    return (
      <>
        <Navbar />

        <div className="detail-container">

          <h1>Referral not found</h1>

          <Link to="/">
            Back to dashboard
          </Link>

        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="detail-container">

        <h1>Referral Details</h1>

        <h2>{referral.name}</h2>

        <div className="detail-card">

          <div className="detail-row">
            <span>Referral ID</span>
            <strong>{referral.id}</strong>
          </div>

          <div className="detail-row">
            <span>Service Name</span>
            <strong>
              {referral.serviceName}
            </strong>
          </div>

          <div className="detail-row">
            <span>Date</span>
            <strong>
              {formatDate(
                referral.date
              )}
            </strong>
          </div>

          <div className="detail-row">
            <span>Profit</span>
            <strong>
              {formatCurrency(
                referral.profit
              )}
            </strong>
          </div>

        </div>

        <Link
          className="back-btn"
          to="/"
        >
          ← Back to dashboard
        </Link>

      </div>

      <Footer />
    </>
  );
};

export default ReferralDetails;