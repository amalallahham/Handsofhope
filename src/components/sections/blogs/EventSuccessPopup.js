"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export default function EventSuccessPopup() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [show, setShow] = useState(false);

  useEffect(() => {
    const success = searchParams.get("success");

    if (success === "1") {
      setShow(true);

      const params = new URLSearchParams(searchParams.toString());
      params.delete("success");

      const newUrl = params.toString() ? `${pathname}?${params}` : pathname;
      router.replace(newUrl, { scroll: false });
    }
  }, [searchParams, pathname, router]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setShow(false);
    };

    if (show) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [show]);

  if (!show) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Serif+Display&display=swap');

        .esp-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          font-family: 'DM Sans', sans-serif;
        }

        .esp-backdrop {
          position: absolute;
          inset: 0;
          background: rgba(10, 15, 30, 0.65);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
        }

        .esp-card {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 480px;
          background: #ffffff;
          border-radius: 24px;
          overflow: hidden;
          box-shadow:
            0 0 0 1px rgba(0,0,0,0.06),
            0 32px 80px rgba(0,0,0,0.22);
          animation: espIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes espIn {
          from { opacity: 0; transform: translateY(16px) scale(0.94); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }

        /* ── top accent strip ── */
        .esp-strip {
          height: 5px;
          background: linear-gradient(90deg, #16a34a 0%, #4ade80 60%, #bbf7d0 100%);
        }

        /* ── header ── */
        .esp-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 28px 28px 0;
          gap: 16px;
        }

        .esp-icon-wrap {
          flex-shrink: 0;
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: linear-gradient(135deg, #dcfce7, #bbf7d0);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 0 6px rgba(22, 163, 74, 0.08);
        }

        .esp-icon-wrap svg {
          width: 24px;
          height: 24px;
          stroke: #16a34a;
          stroke-width: 2.5;
          fill: none;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .esp-title-group {
          flex: 1;
          padding-top: 4px;
        }

        .esp-title {
          font-family: 'DM Serif Display', serif;
          font-size: 20px;
          color: #0f172a;
          margin: 0 0 4px;
          line-height: 1.2;
        }

        .esp-subtitle {
          font-size: 13px;
          color: #64748b;
          margin: 0;
          font-weight: 400;
        }

        .esp-close {
          flex-shrink: 0;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: none;
          background: #f1f5f9;
          color: #64748b;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s, color 0.15s;
          margin-top: 2px;
        }

        .esp-close:hover {
          background: #e2e8f0;
          color: #0f172a;
        }

        .esp-close svg {
          width: 14px;
          height: 14px;
          stroke: currentColor;
          stroke-width: 2.5;
          fill: none;
          stroke-linecap: round;
        }

        /* ── body ── */
        .esp-body {
          padding: 16px 28px 24px;
        }

        .esp-divider {
          height: 1px;
          background: #f1f5f9;
          margin: 0 28px 20px;
        }

        .esp-message {
          font-size: 14px;
          color: #475569;
          margin: 0;
          line-height: 1.6;
        }

        .esp-email-note {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 14px;
          padding: 12px 14px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          font-size: 13px;
          color: #475569;
        }

        .esp-email-note svg {
          flex-shrink: 0;
          width: 16px;
          height: 16px;
          stroke: #16a34a;
          stroke-width: 2;
          fill: none;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        /* ── footer ── */
        .esp-footer {
          display: flex;
          gap: 10px;
          padding: 0 28px 28px;
          justify-content: flex-end;
        }

        .esp-btn-close {
          padding: 10px 20px;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          color: #475569;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s;
        }

        .esp-btn-close:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
        }

        .esp-btn-primary {
          padding: 10px 24px;
          border-radius: 10px;
          border: none;
          background: linear-gradient(135deg, #16a34a, #15803d);
          color: #ffffff;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(22, 163, 74, 0.3);
          transition: opacity 0.15s, transform 0.15s, box-shadow 0.15s;
        }

        .esp-btn-primary:hover {
          opacity: 0.92;
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(22, 163, 74, 0.35);
        }

        .esp-btn-primary:active {
          transform: translateY(0);
        }
      `}</style>

      <div className="esp-overlay" role="dialog" aria-modal="true">
        <div className="esp-backdrop" onClick={() => setShow(false)} />

        <div className="esp-card">
          <div className="esp-strip" />

          <div className="esp-header">
            <div className="esp-icon-wrap">
              <svg viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <div className="esp-title-group">
              <h5 className="esp-title">Payment Successful</h5>
              <p className="esp-subtitle">Your registration is confirmed</p>
            </div>

            <button
              className="esp-close"
              onClick={() => setShow(false)}
              aria-label="Close"
            >
              <svg viewBox="0 0 24 24">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="esp-divider" style={{ marginTop: "20px" }} />

          <div className="esp-body">
            <p className="esp-message">
              We&apos;ve received your payment and your spot is secured.
            </p>
            <div className="esp-email-note">
              <svg viewBox="0 0 24 24">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <polyline points="2,4 12,13 22,4" />
              </svg>
              Your tickets have been sent to your email address.
            </div>
          
              <p className="esp-message mx-1 mt-2">
                If you don't see it within a few minutes, please check your spam
                folder or contact support.{" "}
              </p>
          </div>

          <div className="esp-footer">
            <button className="esp-btn-close" onClick={() => setShow(false)}>
              Close
            </button>
            <button className="esp-btn-primary" onClick={() => setShow(false)}>
              Great, thanks!
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
