import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600")' }}>
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="relative z-10 text-center text-white">
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-4">About LUXE</h1>
          <p className="text-xl md:text-2xl">Crafting Luxury Since 2020</p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
          >
            <div>
              <h2 className="text-3xl font-display font-bold mb-6">Our Story</h2>
              <p className="text-gray-600 mb-4">
                Founded in 2020, LUXE has established itself as a beacon of luxury fashion,
                combining timeless elegance with contemporary design. Our journey began with
                a simple vision: to create exceptional fashion pieces that transcend trends
                and stand the test of time.
              </p>
              <p className="text-gray-600">
                Today, we continue to push the boundaries of luxury fashion, working with
                the finest materials and most skilled artisans to create pieces that are
                not just clothing, but works of art.
              </p>
            </div>
            <div className="relative h-[400px]">
              <img
                src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800"
                alt="LUXE workshop"
                className="absolute inset-0 w-full h-full object-cover rounded-lg"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display font-bold text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white p-8 rounded-lg shadow-md"
            >
              <h3 className="font-display font-bold text-xl mb-4">Quality</h3>
              <p className="text-gray-600">
                We believe in creating pieces that last, using only the finest materials
                and working with skilled artisans who share our passion for excellence.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white p-8 rounded-lg shadow-md"
            >
              <h3 className="font-display font-bold text-xl mb-4">Sustainability</h3>
              <p className="text-gray-600">
                Our commitment to the environment drives us to implement sustainable
                practices throughout our production process and supply chain.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-white p-8 rounded-lg shadow-md"
            >
              <h3 className="font-display font-bold text-xl mb-4">Innovation</h3>
              <p className="text-gray-600">
                While respecting traditional craftsmanship, we embrace modern technology
                and innovative design to create fashion that defines the future.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display font-bold text-center mb-12">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center"
            >
              <div className="relative h-[300px] mb-4">
                <img
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400"
                  alt="Sarah Johnson"
                  className="absolute inset-0 w-full h-full object-cover rounded-lg"
                />
              </div>
              <h3 className="font-display font-bold text-xl mb-2">Sarah Johnson</h3>
              <p className="text-gray-600">Creative Director</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-center"
            >
              <div className="relative h-[300px] mb-4">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400"
                  alt="Michael Chen"
                  className="absolute inset-0 w-full h-full object-cover rounded-lg"
                />
              </div>
              <h3 className="font-display font-bold text-xl mb-2">Michael Chen</h3>
              <p className="text-gray-600">Head of Design</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-center"
            >
              <div className="relative h-[300px] mb-4">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400"
                  alt="Emma Davis"
                  className="absolute inset-0 w-full h-full object-cover rounded-lg"
                />
              </div>
              <h3 className="font-display font-bold text-xl mb-2">Emma Davis</h3>
              <p className="text-gray-600">Production Manager</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;