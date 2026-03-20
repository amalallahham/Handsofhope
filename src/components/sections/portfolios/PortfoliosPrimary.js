"use client";

import { useEffect, useState } from "react";
import PortfolioCard3 from "@/components/shared/cards/PortfolioCard3";
import Paginations from "@/components/shared/others/Paginations";
import usePagination from "@/hooks/usePagination";
import makeWowDelay from "@/libs/makeWowDelay";
import { supabase } from "@/../lib/supabase";

const PortfoliosPrimary = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const limit = 6;

  useEffect(() => {
    const getCampaigns = async () => {
      const { data, error } = await supabase
        .from("campaigns")
        .select("*")
        .order("status", { ascending: true }) 
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching campaigns:", error);
        setItems([]);
      } else {
        setItems(data || []);
      }

      setLoading(false);
    };

    getCampaigns();
  }, []);

  const {
    currentItems,
    currentpage,
    setCurrentpage,
    paginationItems,
    currentPaginationItems,
    totalPages,
    handleCurrentPage,
    firstItem,
    lastItem,
  } = usePagination(items, limit);

  const totalItems = items?.length;
  const totalItemsToShow = currentItems?.length;

  if (loading) {
    return (
      <section className="tj-project-section section-gap">
        <div className="container">
          <p>Loading campaigns...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="tj-project-section section-gap">
      <div className="container">
        <div className="row row-gap-4">
          {currentItems?.length ? (
            currentItems.map((item, idx) => (
              <div
                key={item.id || idx}
                className="col-xl-4 col-md-6 wow fadeInUp"
                data-wow-delay={makeWowDelay(idx, 0.1)}
              >
                <PortfolioCard3 portfolio={item} />
              </div>
            ))
          ) : (
            <p>No campaigns found.</p>
          )}
        </div>

        {totalItemsToShow < totalItems ? (
          <Paginations
            paginationDetails={{
              currentItems,
              currentpage,
              setCurrentpage,
              paginationItems,
              currentPaginationItems,
              totalPages,
              handleCurrentPage,
              firstItem,
              lastItem,
            }}
          />
        ) : (
          ""
        )}
      </div>
    </section>
  );
};

export default PortfoliosPrimary;
