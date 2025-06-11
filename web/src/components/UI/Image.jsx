export default function Image({ src, className, alt = "image" }) {
  if (!src) throw new Error("Image source is required to <Image> Component");
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={`${className} inline-block`}
    />
  );
}
