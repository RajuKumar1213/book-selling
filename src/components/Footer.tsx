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
  Heart,
  BookText,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-slate-50 to-white border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-3">
              <BookOpen className="w-6 h-6 text-indigo-600 mr-2" />
              <span className="text-xl font-bold text-slate-800">oxFord</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Where every page tells a story. Discover your next favorite book
              from our curated collection.
            </p>
            <div className="flex space-x-3">
              <Facebook className="w-4 h-4 text-slate-500 hover:text-indigo-600 cursor-pointer transition-colors" />
              <Instagram className="w-4 h-4 text-slate-500 hover:text-indigo-600 cursor-pointer transition-colors" />
              <Twitter className="w-4 h-4 text-slate-500 hover:text-indigo-600 cursor-pointer transition-colors" />
              <Youtube className="w-4 h-4 text-slate-500 hover:text-indigo-600 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-slate-800 mb-3 uppercase tracking-wide">
              Discover
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-sm text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  Bestsellers
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  New Releases
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  Award Winners
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  Staff Picks
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-semibold text-slate-800 mb-3 uppercase tracking-wide">
              Categories
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-sm text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  Fiction
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  Non-Fiction
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  Mystery
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  Romance
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-slate-800 mb-3 uppercase tracking-wide">
              Get in Touch
            </h4>
            <div className="space-y-2">
              <div className="flex items-center">
                <Mail className="w-3 h-3 text-indigo-600 mr-2" />
                <span className="text-sm text-slate-600">hello@oxford.com</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-3 h-3 text-indigo-600 mr-2" />
                <span className="text-sm text-slate-600">
                  +1 (555) 123-4567
                </span>
              </div>
              <div className="flex items-start">
                <MapPin className="w-3 h-3 text-indigo-600 mr-2 mt-0.5" />
                <span className="text-sm text-slate-600">
                  123 Library Lane
                  <br />
                  Bookville, BK 12345
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="bg-indigo-50 rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold text-slate-800 mb-1">
                Stay in the loop
              </h3>
              <p className="text-sm text-slate-600">
                Get the latest book recommendations & exclusive offers
              </p>
            </div>
            <div className="flex w-full md:w-auto max-w-sm">
              <input
                type="email"
                placeholder="Your email address"
                className="px-3 py-2 rounded-l-md text-slate-900 flex-1 focus:outline-none text-sm border border-slate-300 focus:border-indigo-500"
              />
              <button className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-r-md font-medium text-white transition-colors text-sm">
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-slate-200">
          <div className="flex items-center text-sm text-slate-600 mb-4 md:mb-0">
            <span>© 2025 oxFord. Made with</span>
            <Heart className="w-3 h-3 mx-1 text-red-500 fill-current" />
            <span>by book lovers</span>
          </div>
          <div className="flex items-center space-x-6 text-sm">
            <a
              href="#"
              className="text-slate-600 hover:text-indigo-600 transition-colors"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-slate-600 hover:text-indigo-600 transition-colors"
            >
              Terms
            </a>
            <a
              href="#"
              className="text-slate-600 hover:text-indigo-600 transition-colors"
            >
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
