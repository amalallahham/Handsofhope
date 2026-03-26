const PortfolioCardSkeleton = () => {
  return (
    <div className="project-item h-100 d-flex flex-column campaing-btn skeleton-card">
      
      {/* Image skeleton */}
      <div className="project-img skeleton-box" style={{ height: "350px" }} />

      <div className="project-content d-flex flex-column flex-grow-1 p-3">
        
        {/* Tag */}
        <div className="skeleton-text small mb-2" style={{ width: "80px" }} />

        {/* Title */}
        <div className="skeleton-text mb-2" style={{ width: "70%" }} />
        <div className="skeleton-text mb-3" style={{ width: "50%" }} />

        {/* Button */}
        <div className="mt-auto d-flex justify-content-end">
          <div
            className="skeleton-box"
            style={{ width: "120px", height: "40px", borderRadius: "20px" }}
          />
        </div>

      </div>
    </div>
  );
};

export default PortfolioCardSkeleton;