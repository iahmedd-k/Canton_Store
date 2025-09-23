// About.jsx

const About = () => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-white to-amber-50 px-4 sm:px-6 lg:px-20 py-12 md:py-20 text-gray-800">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="bg-gradient-to-br from-amber-600 to-amber-800 p-3 rounded-xl shadow-md">
              <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800">
                About <span className="text-amber-600">Canton</span>
              </h1>
              <p className="text-sm text-amber-600 font-medium">Furniture Store</p>
            </div>
          </div>
          <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            At Canton, we believe furniture should inspire. Founded with a passion for aesthetics and comfort,
            our mission is to bring premium interiors into every home across Pakistan.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 text-left mb-12 md:mb-16">
          <div className="bg-white rounded-xl p-6 md:p-8 shadow-lg">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-amber-600">Our Story</h2>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base">
              From a small design studio to one of the fastest growing furniture brands in the country,
              we've always put quality and creativity first. Every piece is handpicked, reviewed, and tested
              for durability, comfort, and visual impact.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 md:p-8 shadow-lg">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-amber-600">What We Offer</h2>
            <ul className="list-none text-gray-600 leading-relaxed space-y-2 text-sm md:text-base">
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                <span>Modern and luxury furniture collections</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                <span>Customizable designs</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                <span>Interior layout consultancy</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                <span>Nationwide delivery & 7-day return</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Showroom Image */}
        <div className="text-center">
          <img
            src="https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg"
            alt="Canton Showroom"
            className="rounded-xl md:rounded-2xl w-full h-64 md:h-80 lg:h-96 object-cover shadow-xl"
          />
          <p className="text-sm text-gray-500 mt-4 italic">Visit our showroom to experience the quality firsthand</p>
        </div>
      </div>
    </section>
  );
};

export default About;


// 
