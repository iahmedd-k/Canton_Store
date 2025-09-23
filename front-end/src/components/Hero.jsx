

const Hero = () => {
  return (
    <section className="bg-gradient-to-br from-amber-50 to-white py-12 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-20">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Left Text Content */}
          <div className="w-full lg:w-1/2 text-center lg:text-left order-2 lg:order-1">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 text-gray-800 leading-tight">
              Elevate Your <span className="text-amber-600">Living Space</span>
            </h1>
            <p className="text-gray-600 mb-6 text-base md:text-lg leading-relaxed">
              Discover modern furniture and interior designs that blend style with comfort. Crafted to perfection, designed for you.
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3 md:gap-4">
              <button className="bg-gradient-to-r from-amber-600 to-amber-700 text-white font-medium py-3 px-6 md:px-8 rounded-full hover:from-amber-700 hover:to-amber-800 transition-all duration-200 shadow-lg hover:shadow-xl">
                Shop Furniture
              </button>
              <button className="border-2 border-amber-600 text-amber-600 py-3 px-6 md:px-8 rounded-full hover:bg-amber-50 transition-all duration-200 font-medium">
                Explore Interior
              </button>
            </div>
          </div>

          {/* Right Image Content */}
          <div className="w-full lg:w-1/2 relative flex justify-center order-1 lg:order-2">
            <div className="relative w-full max-w-sm md:max-w-md lg:max-w-lg">
              <img
                src="/hero1.avif"
                srcSet="/hero1.avif 1x, /hero1.avif 2x"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
                alt="Modern Sofa"
                className="rounded-2xl shadow-2xl w-full h-64 md:h-80 lg:h-96 object-cover"
                loading="lazy"
                decoding="async"
              />
              <img
                src="/hero2.jfif"
                srcSet="/hero2.jfif 1x, /hero2.jfif 2x"
                sizes="(max-width: 640px) 80px, 128px"
                alt="Interior"
                className="absolute -bottom-4 -right-4 md:-bottom-8 md:-right-8 w-20 h-20 md:w-32 md:h-32 rounded-xl border-4 border-white shadow-lg object-cover"
                loading="lazy"
                decoding="async"
              />
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-amber-200 rounded-full opacity-60"></div>
              <div className="absolute top-1/2 -right-8 w-12 h-12 bg-amber-300 rounded-full opacity-40"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
