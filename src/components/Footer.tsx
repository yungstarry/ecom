import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center md:text-left">
            <h3 className="font-display text-2xl font-bold mb-4">LUXE</h3>
            <p className="text-primary-200">
              Premium fashion for the modern individual. Quality, style, and sustainability.
            </p>
          </div>
          
          <div className="text-center md:text-left">
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/products?category=men" className="text-primary-200 hover:text-white">
                  Men
                </Link>
              </li>
              <li>
                <Link to="/products?category=women" className="text-primary-200 hover:text-white">
                  Women
                </Link>
              </li>
              <li>
                <Link to="/products?category=accessories" className="text-primary-200 hover:text-white">
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-center md:text-left">
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-primary-200 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-primary-200 hover:text-white">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-primary-200 hover:text-white">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-center md:text-left">
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex justify-center md:justify-start space-x-4">
              <a href="https://facebook.com" className="text-primary-200 hover:text-white">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="https://instagram.com" className="text-primary-200 hover:text-white">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="https://twitter.com" className="text-primary-200 hover:text-white">
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-primary-700">
          <p className="text-center text-primary-200">
            © {new Date().getFullYear()} LUXE. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;