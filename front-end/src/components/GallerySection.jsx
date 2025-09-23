import { useRef, useEffect } from "react";
const galleryItems = [
  "https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg",
  "https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg",
  "https://images.pexels.com/photos/271743/pexels-photo-271743.jpeg",
  "https://images.pexels.com/photos/279719/pexels-photo-279719.jpeg",
  "https://images.pexels.com/photos/276528/pexels-photo-276528.jpeg",
  "https://images.pexels.com/photos/1866143/pexels-photo-1866143.jpeg",
];

const GalleryScroll = () => {
  const containerRef = useRef(null);

  // Optional: Auto scroll
  useEffect(() => {
    const container = containerRef.current;
    let scrollAmount = 0;

    const autoScroll = setInterval(() => {
      if (container) {
        scrollAmount += 1;
        container.scrollLeft += 1;
        if (scrollAmount >= container.scrollWidth / 2) {
          container.scrollLeft = 0;
          scrollAmount = 0;
        }
      }
    }, 30); // speed

    return () => clearInterval(autoScroll);
  }, []);

  return (
    <section className="bg-white py-12 md:py-16 px-4 sm:px-6 lg:px-20">
      <div className="text-center mb-8 md:mb-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 md:mb-4">
          Trending Layouts
        </h2>
        <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
          Get inspired by our curated collection of beautiful home designs
        </p>
      </div>
      <div
        ref={containerRef}
        className="flex overflow-x-auto no-scrollbar space-x-4 md:space-x-6 pb-4"
      >
        {galleryItems.concat(galleryItems).map((url, i) => (
          <div
            key={i}
            className="min-w-[250px] sm:min-w-[300px] md:min-w-[350px] flex-shrink-0 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <img
              src={url}
              alt={`Gallery ${i}`}
              className="w-full h-48 sm:h-56 md:h-60 object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default GalleryScroll;
