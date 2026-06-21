import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

import API from "../../services/api";

import formatDate from "../../utils/formatDate";
import formatCurrency from "../../utils/formatCurrency";

import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 10;

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async (
    searchValue = "",
    sortValue = "desc"
  ) => {
    try {
      setLoading(true);

      const response = await API.get(
        `/referrals?search=${searchValue}&sort=${sortValue}`
      );

      setDashboardData(response.data.data);
      setError("");
    } catch (err) {
      setError("Failed to load referral data");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;

    setSearch(value);
    setCurrentPage(1);

    fetchDashboardData(value, sortOrder);
  };

  const handleSort = (e) => {
    const value = e.target.value;

    setSortOrder(value);
    setCurrentPage(1);

    fetchDashboardData(search, value);
  };

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied Successfully");
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <h2 className="loading">Loading...</h2>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <h2 className="error">{error}</h2>
      </>
    );
  }

  const referrals = dashboardData?.referrals || [];

  const totalPages = Math.ceil(
    referrals.length / rowsPerPage
  );

  const startIndex =
    (currentPage - 1) * rowsPerPage;

  const currentRows = referrals.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  return (
    <>
      <Navbar />

      <div className="dashboard-container">

        <div className="dashboard-header">
          <h1>Referral Dashboard</h1>

          <p>
            Track your referrals, earnings,
            and partner activity in one place.
          </p>
        </div>

        {/* Overview */}

        <section>
          <h2 className="section-title">
            Overview
          </h2>

          <div className="overview-grid">

            {dashboardData.metrics?.map(
              (metric) => (
                <div
                  key={metric.id}
                  className="overview-card"
                >
                  <h4>{metric.label}</h4>

                  <h2>{metric.value}</h2>
                </div>
              )
            )}

          </div>
        </section>

        {/* Service Summary */}

        <section className="service-summary">

          <h2>Service Summary</h2>

          <div className="summary-row">
            <span>Service</span>
            <strong>
              {dashboardData.serviceSummary?.service}
            </strong>
          </div>

          <div className="summary-row">
            <span>Your Referrals</span>
            <strong>
              {dashboardData.serviceSummary?.yourReferrals}
            </strong>
          </div>

          <div className="summary-row">
            <span>Active Referrals</span>
            <strong>
              {dashboardData.serviceSummary?.activeReferrals}
            </strong>
          </div>

          <div className="summary-row">
            <span>Total Ref. Earnings</span>
            <strong>
              {dashboardData.serviceSummary?.totalRefEarnings}
            </strong>
          </div>

        </section>

        {/* Share Referral */}

        <section className="share-card">

          <h2>
            Refer friends and earn more
          </h2>

          <div className="share-group">

            <label>
              Your Referral Link
            </label>

            <input
              className="share-input"
              readOnly
              value={dashboardData.referral?.link}
            />

            <button
              className="copy-btn"
              onClick={() =>
                copyText(
                  dashboardData.referral?.link
                )
              }
            >
              Copy
            </button>

          </div>

          <div className="share-group">

            <label>
              Your Referral Code
            </label>

            <input
              className="share-input"
              readOnly
              value={dashboardData.referral?.code}
            />

            <button
              className="copy-btn"
              onClick={() =>
                copyText(
                  dashboardData.referral?.code
                )
              }
            >
              Copy
            </button>

          </div>

        </section>

        {/* Referrals Table */}

        <section className="table-card">

          <h2>All Referrals</h2>

          <div className="table-controls">

            <input
              className="search-input"
              placeholder="Name or service…"
              value={search}
              onChange={handleSearch}
            />

            <select
              className="sort-select"
              value={sortOrder}
              onChange={handleSort}
            >
              <option value="desc">
                Newest first
              </option>

              <option value="asc">
                Oldest first
              </option>
            </select>

          </div>

          <table>

            <thead>
              <tr>
                <th>Name</th>
                <th>Service</th>
                <th>Date</th>
                <th>Profit</th>
              </tr>
            </thead>

            <tbody>

              {currentRows.length === 0 ? (
                <tr>
                  <td colSpan="4">
                    No matching entries
                  </td>
                </tr>
              ) : (
                currentRows.map(
                  (referral) => (
                    <tr
                      key={referral.id}
                      onClick={() =>
                        navigate(
                          `/referral/${referral.id}`
                        )
                      }
                    >
                      <td>
                        {referral.name}
                      </td>

                      <td>
                        {referral.serviceName}
                      </td>

                      <td>
                        {formatDate(
                          referral.date
                        )}
                      </td>

                      <td>
                        {formatCurrency(
                          referral.profit
                        )}
                      </td>
                    </tr>
                  )
                )
              )}

            </tbody>

          </table>

          <div className="pagination">

            <button
              disabled={currentPage === 1}
              onClick={() =>
                setCurrentPage(
                  currentPage - 1
                )
              }
            >
              Previous
            </button>

            {[...Array(totalPages)].map(
              (_, index) => (
                <button
                  key={index}
                  onClick={() =>
                    setCurrentPage(
                      index + 1
                    )
                  }
                >
                  {index + 1}
                </button>
              )
            )}

            <button
              disabled={
                currentPage === totalPages
              }
              onClick={() =>
                setCurrentPage(
                  currentPage + 1
                )
              }
            >
              Next
            </button>

          </div>

          <p className="entries-text">
            Showing {referrals.length === 0 ? 0 : startIndex + 1}
            –
            {Math.min(
              startIndex + rowsPerPage,
              referrals.length
            )}{" "}
            of {referrals.length} entries
          </p>

        </section>

      </div>

      <Footer />
    </>
  );
};

export default Dashboard;