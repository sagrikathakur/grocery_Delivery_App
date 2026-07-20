import { Link } from 'react-router-dom';
import { BikeIcon } from 'lucide-react';

const footerData = {
  sections: [
    {
      title: "Quick Links",
      links: [
        { label: "Home", path: "/" },
        { label: "Products", path: "/products" },
        { label: "Flash Deals", path: "/deals" },
      ],
    },
    {
      title: "Account",
      links: [
        { label: "My Orders", path: "/orders" },
        { label: "My Addresses", path: "/addresses" },
        { label: "Checkout", path: "/checkout" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Privacy Policy", path: "#" },
        { label: "Terms of Service", path: "#" },
      ],
    },
  ],
};

const Footer = () => {
  return (
    <footer className="w-full bg-app-green text-zinc-300 py-12 border-t border-app-green-light/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
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

          {/* Sections mapped using footerData.sections.map */}
          {footerData.sections.map((section, index) => (
            <div key={index}>
              <h3 className="text-white font-medium mb-3">{section.title}</h3>
              <ul className="space-y-2 text-sm">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link to={link.path} className="hover:text-app-orange transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-app-green-light/30 pt-6 text-xs text-zinc-500 text-center sm:text-left">
          <p>© {new Date().getFullYear()} Instacart Grocery Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;