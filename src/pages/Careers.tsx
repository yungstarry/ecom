import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Users, Heart, ArrowRight } from 'lucide-react';

const Careers = () => {
  const openPositions = [
    {
      title: 'Senior Fashion Designer',
      department: 'Design',
      location: 'New York, NY',
      type: 'Full-time',
    },
    {
      title: 'Digital Marketing Manager',
      department: 'Marketing',
      location: 'Los Angeles, CA',
      type: 'Full-time',
    },
    {
      title: 'Retail Store Manager',
      department: 'Retail',
      location: 'Miami, FL',
      type: 'Full-time',
    },
    {
      title: 'Fashion Merchandiser',
      department: 'Merchandising',
      location: 'New York, NY',
      type: 'Full-time',
    },
    {
      title: 'E-commerce Specialist',
      department: 'Digital',
      location: 'Remote',
      type: 'Full-time',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600")' }}>
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="relative z-10 text-center text-white">
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-4">Join Our Team</h1>
          <p className="text-xl md:text-2xl">Shape the Future of Fashion with LUXE</p>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display font-bold text-center mb-12">Why Join LUXE?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center p-6"
            >
              <Briefcase className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="font-display font-bold text-xl mb-4">Career Growth</h3>
              <p className="text-gray-600">
                Opportunities for professional development and advancement in the fashion industry.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-center p-6"
            >
              <Users className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="font-display font-bold text-xl mb-4">Inclusive Culture</h3>
              <p className="text-gray-600">
                A diverse and welcoming environment where every voice matters.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-center p-6"
            >
              <Heart className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="font-display font-bold text-xl mb-4">Great Benefits</h3>
              <p className="text-gray-600">
                Competitive compensation, health benefits, and employee discounts.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display font-bold mb-12">Open Positions</h2>
          <div className="space-y-6">
            {openPositions.map((position, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-display font-bold text-xl mb-2">{position.title}</h3>
                    <p className="text-gray-600 mb-4">{position.department} · {position.location} · {position.type}</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-primary-600 text-white px-6 py-2 rounded-md font-semibold flex items-center gap-2"
                  >
                    Apply Now
                    <ArrowRight className="h-4 w-4" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Employee Testimonials */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display font-bold text-center mb-12">Employee Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-8 rounded-lg shadow-md"
            >
              <div className="flex items-center mb-6">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400"
                  alt="Employee"
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="font-display font-bold text-lg">Emily Chen</h3>
                  <p className="text-gray-600">Fashion Designer, 3 years at LUXE</p>
                </div>
              </div>
              <p className="text-gray-600">
                "Working at LUXE has been an incredible journey. The creative freedom and
                supportive environment have helped me grow both personally and professionally."
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white p-8 rounded-lg shadow-md"
            >
              <div className="flex items-center mb-6">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"
                  alt="Employee"
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="font-display font-bold text-lg">David Martinez</h3>
                  <p className="text-gray-600">Marketing Manager, 2 years at LUXE</p>
                </div>
              </div>
              <p className="text-gray-600">
                "The collaborative culture at LUXE is unmatched. Every day brings new
                challenges and opportunities to innovate in the fashion industry."
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Careers;