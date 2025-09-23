import React, { useState } from 'react';

const Contact = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback('');
    try {
  const res = await fetch(`${API_URL}/contact/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setFeedback('Message sent successfully!');
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        setFeedback('Failed to send message.');
      }
    } catch {
      setFeedback('Failed to send message.');
    }
    setLoading(false);
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-amber-50 to-white py-12 md:py-20 px-4 sm:px-6 lg:px-20">
      <div className="max-w-4xl mx-auto">
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
                Get in <span className="text-amber-600">Touch</span>
              </h1>
              <p className="text-sm text-amber-600 font-medium">Canton Furniture Store</p>
            </div>
          </div>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions about our furniture, design services, or delivery? We're here to help.
          </p>
        </div>

        {/* Contact Form */}
        <div className="bg-white shadow-xl rounded-xl p-6 md:p-8 mb-8 md:mb-12">
          <form className="space-y-4 md:space-y-6 text-left" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
            <div>
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={form.subject}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div>
              <textarea
                rows="5"
                name="message"
                placeholder="Your Message"
                value={form.message}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 resize-none"
              ></textarea>
            </div>
            <div className="text-center">
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white py-3 md:py-4 px-8 md:px-12 rounded-lg text-base md:text-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
              {feedback && (
                <div className={`mt-4 text-center text-${feedback.includes('success') ? 'green' : 'red'}-600`}>
                  {feedback}
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-center">
            <div className="space-y-2">
              <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
                <svg className="h-6 w-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 text-sm md:text-base">Email</h3>
              <p className="text-gray-600 text-sm">info@cantonfurniture.com</p>
            </div>
            <div className="space-y-2">
              <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
                <svg className="h-6 w-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 text-sm md:text-base">Phone</h3>
              <p className="text-gray-600 text-sm">+92 300 1234567</p>
            </div>
            <div className="space-y-2">
              <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
                <svg className="h-6 w-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 text-sm md:text-base">Address</h3>
              <p className="text-gray-600 text-sm">Shop 1 i8 Markaz,<br />Islamabad, Pakistan</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;