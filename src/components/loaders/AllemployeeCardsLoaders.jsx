import Skeleton from 'react-loading-skeleton';

const Loaders = () => (
    <div className="col-xl-3 col-lg-4 col-md-6 col-sm-10">
        <div className="profile-card p-0" >

            {/* Header */}
            <Skeleton
                height={90}
                width="100%"
            />

            {/* Avatar */}
            <div className="d-flex justify-content-center mt-n5">
                <Skeleton circle width={80} height={80} />
            </div>

            {/* Body */}
            <div className="text-center p-3">
                <Skeleton width="70%" className="mb-2" />
                <Skeleton width="50%" className="mb-3" />
                <Skeleton width="90%" className="mb-2" />
                <Skeleton width="60%" />
            </div>

        </div>
    </div>
);

export default Loaders