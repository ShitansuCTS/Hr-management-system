import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const DesignationCardSkeleton = () => {
  return (
    <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 mb-4">
      <div
        className="card h-100 border-0"
        style={{
          borderRadius: "12px",
          boxShadow: "0 6px 20px rgba(31, 61, 136, 0.08)",
        }}
      >
        <div className="card-body p-4">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-start">
            <div style={{ width: "75%" }}>
              {/* Designation Title */}
              <Skeleton height={18} width="80%" />

              {/* Unique Name */}
              <Skeleton height={10} width="55%" style={{ marginTop: "8px" }} />
            </div>

            {/* Delete Button */}
            <Skeleton width={32} height={32} borderRadius={8} />
          </div>

          {/* Footer */}
          <div className="d-flex justify-content-between align-items-center mt-4">
            {/* Department Badge */}
            <Skeleton width={95} height={22} borderRadius={20} />

            {/* Status Badge */}
            <Skeleton width={58} height={22} borderRadius={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignationCardSkeleton;
