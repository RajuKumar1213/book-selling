import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  MapPin,
  Phone,
  Mail,
  BookOpen,
  Bookmark,
  BookText,
  BookmarkCheck,
  Shield,
  Clock,
  Award,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white">
      {/* Trust badges */}
      <div className="bg-primary py-6 sm:py-8 border-b border-purple-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8 lg:space-x-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <span className="text-sm sm:text-base font-medium text-gray-800">
                Fast Delivery
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <span className="text-sm sm:text-base font-medium text-gray-800">
                Quality Guaranteed
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Award className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <span className="text-sm sm:text-base font-medium text-gray-800">
                Authentic Editions
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 py-6 sm:py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-white mr-3" />
              <h3 className="font-bold text-lg sm:text-xl text-white text-center md:text-left">
                Subscribe To Our Book Club
              </h3>
            </div>
            <div className="flex w-full md:w-auto max-w-md">
              <input
                type="email"
                placeholder="Enter your email for updates"
                className="px-4 py-2 sm:py-3 rounded-l-lg text-gray-900 flex-1 focus:outline-none text-sm sm:text-base border-0"
              />
              <button className="bg-gray-900 hover:bg-gray-800 px-4 sm:px-6 py-2 sm:py-3 rounded-r-lg font-medium text-white transition-colors text-sm sm:text-base">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="py-8 sm:py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Company Info */}
            <div className="col-span-1 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center mb-4">
                <BookmarkCheck className="w-8 h-8 text-purple-600 mr-2" />
                <h3 className="text-2xl font-bold text-purple-600">oxFord</h3>
              </div>
              <p className="text-gray-600 mb-4 text-sm sm:text-base">
                Your trusted source for quality books where every page tells a
                story! We connect readers with their next favorite book from
                bestsellers to hidden gems.
              </p>
              <div className="flex space-x-4">
                <Facebook className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 hover:text-purple-600 cursor-pointer transition-colors" />
                <Instagram className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 hover:text-purple-600 cursor-pointer transition-colors" />
                <Twitter className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 hover:text-purple-600 cursor-pointer transition-colors" />
                <Youtube className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 hover:text-purple-600 cursor-pointer transition-colors" />
                <Linkedin className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 hover:text-purple-600 cursor-pointer transition-colors" />
              </div>

              <div className="mt-6 space-y-2">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 text-purple-600 mr-2" />
                  <span className="text-sm text-gray-600">
                    +1 (555) 123-4567
                  </span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 text-purple-600 mr-2" />
                  <span className="text-sm text-gray-600">
                    hello@oxFord.com
                  </span>
                </div>
                <div className="flex items-start">
                  <MapPin className="w-4 h-4 text-purple-600 mr-2 mt-0.5" />
                  <span className="text-sm text-gray-600">
                    123 Library Lane, Bookville, BK 12345
                  </span>
                </div>
              </div>
            </div>

            {/* Explore */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                <BookText className="w-5 h-5 mr-2 text-purple-600" />
                Explore
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-purple-600 transition-colors text-sm sm:text-base"
                  >
                    Bestsellers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-purple-600 transition-colors text-sm sm:text-base"
                  >
                    New Releases
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-purple-600 transition-colors text-sm sm:text-base"
                  >
                    Award Winners
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-purple-600 transition-colors text-sm sm:text-base"
                  >
                    Staff Picks
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-purple-600 transition-colors text-sm sm:text-base"
                  >
                    Book Clubs
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-purple-600 transition-colors text-sm sm:text-base"
                  >
                    Author Events
                  </a>
                </li>
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                <Bookmark className="w-5 h-5 mr-2 text-purple-600" />
                Categories
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-purple-600 transition-colors text-sm sm:text-base"
                  >
                    Fiction
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-purple-600 transition-colors text-sm sm:text-base"
                  >
                    Non-Fiction
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-purple-600 transition-colors text-sm sm:text-base"
                  >
                    Mystery & Thriller
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-purple-600 transition-colors text-sm sm:text-base"
                  >
                    Science Fiction
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-purple-600 transition-colors text-sm sm:text-base"
                  >
                    Biographies
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-purple-600 transition-colors text-sm sm:text-base"
                  >
                    Children's Books
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-purple-600" />
                Support
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-purple-600 transition-colors text-sm sm:text-base"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-purple-600 transition-colors text-sm sm:text-base"
                  >
                    FAQ
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-purple-600 transition-colors text-sm sm:text-base"
                  >
                    Shipping & Returns
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-purple-600 transition-colors text-sm sm:text-base"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-purple-600 transition-colors text-sm sm:text-base"
                  >
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-purple-600 transition-colors text-sm sm:text-base"
                  >
                    Gift Cards
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom footer */}
      <div className="border-t border-purple-200 py-4 sm:py-6 bg-purple-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
            <p className="text-gray-600 text-xs sm:text-sm">
              © 2025 oxFord. All rights reserved. Made with 📖 by book lovers.
            </p>
            <div className="flex items-center space-x-4 mt-2 md:mt-0">
              <span className="text-gray-600 text-xs sm:text-sm">
                We accept:
              </span>
              <div className="flex space-x-2">
                <div className="w-8 h-5 bg-gray-200 rounded-sm flex items-center justify-center">
                  <span className="text-xs font-bold">VISA</span>
                </div>
                <div className="w-8 h-5 bg-gray-200 rounded-sm flex items-center justify-center">
                  <span className="text-xs font-bold">MC</span>
                </div>
                <div className="w-8 h-5 bg-gray-200 rounded-sm flex items-center justify-center">
                  <span className="text-xs font-bold">PP</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
