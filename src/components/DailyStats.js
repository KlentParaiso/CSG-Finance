import React, { useState, useEffect } from 'react';

const DailyStats = ({ authenticatedUser, refreshTrigger }) => {
  const [stats, setStats] = useState({
    todayPayments: 0,
    todayAmount: 0,
    totalPayments: 0,
    totalAmount: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authenticatedUser) {
      fetchDailyStats();
    }
  }, [authenticatedUser, refreshTrigger]);

  const fetchDailyStats = async () => {
    try {
      setIsLoading(true);
      const today = new Date().toLocaleDateString('en-PH');
      
             // Use the same Google Apps Script URL as the payment service
             const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxINcoSX4EGysjqmQrqrzH_ihoEJD2U1CD_PyJdZMRwoEWxz-_FBWj7JKwfsDGewzIeUw/exec';
      
      console.log('Fetching daily stats for:', authenticatedUser.email, 'on:', today);
      
      const response = await fetch(`${APPS_SCRIPT_URL}?userEmail=${encodeURIComponent(authenticatedUser.email)}&date=${encodeURIComponent(today)}`, {
        method: 'GET',
        mode: 'cors'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Daily stats response:', data);
      
      if (data.error) {
        console.error('Error from Google Apps Script:', data.error);
        setStats({
          todayPayments: 0,
          todayAmount: 0,
          totalPayments: 0,
          totalAmount: 0
        });
      } else {
        setStats({
          todayPayments: data.todayPayments || 0,
          todayAmount: data.todayAmount || 0,
          totalPayments: data.totalPayments || 0,
          totalAmount: data.totalAmount || 0
        });
      }
    } catch (error) {
      console.error('Error fetching daily stats:', error);
      setStats({
        todayPayments: 0,
        todayAmount: 0,
        totalPayments: 0,
        totalAmount: 0
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!authenticatedUser) {
    return null;
  }

  return (
    <div className="row mb-4">
      <div className="col-12">
        <div className="card">
          <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h5 className="card-title mb-0">
              <i className="bi bi-graph-up me-2"></i>
              Daily Payment Statistics
            </h5>
            <button 
              className="btn btn-light btn-sm"
              onClick={fetchDailyStats}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
              ) : (
                <i className="bi bi-arrow-clockwise me-1"></i>
              )}
              Refresh
            </button>
          </div>
          <div className="card-body">
            {isLoading ? (
              <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading statistics...</p>
              </div>
            ) : (
              <div className="row">
                <div className="col-md-4 mb-3">
                  <div className="card bg-primary text-white">
                    <div className="card-body text-center">
                      <h2 className="mb-1">{stats.todayPayments}</h2>
                      <p className="card-text mb-0">Payments Today</p>
                      <small className="opacity-75">₱{stats.todayAmount.toLocaleString()} collected</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="card bg-success text-white">
                    <div className="card-body text-center">
                      <h2 className="mb-1">{stats.totalPayments}</h2>
                      <p className="card-text mb-0">All-Time Total</p>
                      <small className="opacity-75">₱{stats.totalAmount.toLocaleString()} collected</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="card bg-info text-white">
                    <div className="card-body text-center">
                      <h2 className="mb-1">{stats.totalPayments - stats.todayPayments}</h2>
                      <p className="card-text mb-0">Previous Days</p>
                      <small className="opacity-75">₱{(stats.totalAmount - stats.todayAmount).toLocaleString()} collected</small>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="mt-3">
              <small className="text-muted">
                <i className="bi bi-person me-1"></i>
                Logged in as: {authenticatedUser.name} ({authenticatedUser.email})
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyStats;
