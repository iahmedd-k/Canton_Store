import { Link } from "react-router-dom";

const AmbitionSection = () => {
  return (
    <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-20 bg-white">
      <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
        {/* Left Image */}
        <div className="w-full lg:w-1/2 order-2 lg:order-1">
          <div className="relative">
            <img
 src="/abc.jpg"              alt="Ambition"
              className="rounded-xl md:rounded-2xl w-full h-64 sm:h-80 md:h-96 lg:h-auto object-cover shadow-lg"
            />
            {/* Decorative overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-amber-600/20 to-transparent rounded-xl md:rounded-2xl"></div>
          </div>
        </div>

        {/* Right Text */}
        <div className="w-full lg:w-1/2 text-center lg:text-left order-1 lg:order-2">
          <p className="text-xs sm:text-sm uppercase tracking-widest text-amber-600 mb-2 md:mb-4 font-medium">Our Ambitions</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4 md:mb-6 leading-tight">
            Pioneering innovation and excellence in furniture
          </h2>
          <p className="text-gray-600 mb-6 md:mb-8 text-base md:text-lg leading-relaxed">
            Striving for excellence in every detail, we are committed to revolutionizing the online shopping experience.
            Our ambition is to set new standards in quality, customer satisfaction, and sustainability, ensuring that
            every purchase from our platform is a step towards a brighter, more innovative future.
          </p>
          <Link to="/about">
            <button className="bg-gradient-to-r from-amber-600 to-amber-700 text-white py-3 px-6 md:px-8 rounded-lg md:rounded-xl hover:from-amber-700 hover:to-amber-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl">
              Learn more
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AmbitionSection;
