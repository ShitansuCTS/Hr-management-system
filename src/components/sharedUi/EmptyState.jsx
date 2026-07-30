import Image from "next/image";

const EmptyState = ({ image, title, description, height = 350, imageWidth = 220, action }) => {
  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center text-center"
      style={{
        minHeight: height,
      }}
    >
      <Image src={image} alt={title} width={imageWidth} height={imageWidth} priority={false} />

      <h5 className="fw-semibold mt-4">{title}</h5>

      <p
        className="text-muted mb-3"
        style={{
          maxWidth: 420,
        }}
      >
        {description}
      </p>

      {action}
    </div>
  );
};

export default EmptyState;
