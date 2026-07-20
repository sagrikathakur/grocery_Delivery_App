import { Link } from 'react-router-dom';
import { BikeIcon } from 'lucide-react';
import { footerData } from '../assets/assets';

const Footer = () => {
  return (
    <footer className="w-full bg-app-green text-zinc-300 py-12 border-t border-app-green-light/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div>
            <Link to="/" className="flex items-center gap-2 text-xl font-semibold text-white mb-3">
              <BikeIcon className="size-5 text-app-orange" />
              <span>{footerData.brand.name}</span>
            </Link>
            <p className="text-sm text-zinc-400">
              {footerData.brand.description}
            </p>
          </div>

          {/* Sections mapped using footerData.sections.map */}
          {footerData.sections.map((section, index) => (
            <div key={index}>
              <h3 className="text-white font-medium mb-3">{section.title}</h3>
              <ul className="space-y-2 text-sm">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link to={link.to || link.href || "#"} className="hover:text-app-orange transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Section */}
          <div>
            <h3 className="text-white font-medium mb-3">Contact Us</h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              {footerData.contact.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <li key={idx} className="flex items-center gap-2">
                    <Icon className="size-4 text-app-orange shrink-0" />
                    <span>{item.text}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-app-green-light/30 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>{footerData.bottom.copyright}</p>
          <div className="flex gap-4">
            {footerData.bottom.links.map((link, idx) => (
              <Link key={idx} to={link.href} className="hover:text-zinc-400">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;