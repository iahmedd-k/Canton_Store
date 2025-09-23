

const categories = [
  {
    name: "Living Room",
    image: "/1.jfif",
  },
  {
    name: "Bedroom",
    image: "/2.jfif",
  },
  {
    name: "Office",
    image: "/3.jfif",
  },
  {
    name: "Dining Room",
    image: "/4.jfif",
  },
];


const PopularCategories = () => {
  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-gray-50 to-amber-50 px-4 sm:px-6 lg:px-20">
      <div className="text-center mb-8 md:mb-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 md:mb-4">
          Design Your Perfect Home
        </h2>
        <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
          Browse through the most loved categories by our customers
        </p>
      </div>

      <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((cat, index) => (
          <div key={index} className="relative overflow-hidden rounded-xl md:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer">
            <img
              src={cat.image}
              alt={cat.name}
              className="w-full h-48 sm:h-56 md:h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end justify-center pb-4 md:pb-6">
              <h3 className="text-white text-lg sm:text-xl md:text-2xl font-semibold text-center px-4">
                {cat.name}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PopularCategories;
