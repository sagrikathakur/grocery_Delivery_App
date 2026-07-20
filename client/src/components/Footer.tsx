import { Link } from 'react-router-dom';
import { BikeIcon, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full bg-app-green text-zinc-300 py-12 border-t border-app-green-light/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Info */}
          <div>
            <Link to="/" className="flex items-center gap-2 text-xl font-semibold text-white mb-3">
              <BikeIcon className="size-5 text-app-orange" />
              <span>Instacart</span>
            </Link>
            <p className="text-sm text-zinc-400">
              Fresh groceries and everyday essentials delivered directly to your doorstep.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-medium mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-app-orange transition-colors">Home</Link></li>
              <li><Link to="/products" className="hover:text-app-orange transition-colors">Products</Link></li>
              <li><Link to="/deals" className="hover:text-app-orange transition-colors text-app-orange">Flash Deals</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-medium mb-3">Contact Us</h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li className="flex items-center gap-2">
                <MapPin className="size-4 text-app-orange shrink-0" />
                <span>123 Fresh Valley Way, NY</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-4 text-app-orange shrink-0" />
                <span>+1 (800) 555-INSTA</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="size-4 text-app-orange shrink-0" />
                <span>support@instacart.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-app-green-light/30 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} Instacart Grocery Ltd. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="#" className="hover:text-zinc-400">Privacy Policy</Link>
            <Link to="#" className="hover:text-zinc-400">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;