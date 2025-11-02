import { Instagram, Facebook, MapPin, Phone, Mail } from "lucide-react";

const Footer = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-bold text-primary mb-4">CampJam Flooring</h3>
            <p className="text-background/80 leading-relaxed">
              Transforming spaces with precision and style. Your trusted partner for premium tiling solutions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-background">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => scrollToSection("home")}
                  className="text-background/80 hover:text-primary transition-colors duration-300"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("projects")}
                  className="text-background/80 hover:text-primary transition-colors duration-300"
                >
                  Projects
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("about")}
                  className="text-background/80 hover:text-primary transition-colors duration-300"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="text-background/80 hover:text-primary transition-colors duration-300"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-background">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <MapPin size={16} className="text-primary flex-shrink-0" />
                <span className="text-background/80 text-sm">123 Flooring Street, City, State 12345</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={16} className="text-primary flex-shrink-0" />
                <span className="text-background/80 text-sm">1 (876) 363-5640</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={16} className="text-primary flex-shrink-0" />
                <span className="text-background/80 text-sm">info@campjamflooring.com</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-background">Follow Us</h4>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/campjamflooring/"
                className="w-10 h-10 bg-background/10 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-background transition-all duration-300 hover:gold-glow"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-background/10 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-background transition-all duration-300 hover:gold-glow"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-background/10 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-background transition-all duration-300 hover:gold-glow"
                aria-label="TikTok"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-.88-.05A6.33 6.33 0 005.76 20.5a6.34 6.34 0 0010.86-4.43V7.56a8.16 8.16 0 004.77 1.2v-3.44a4.85 4.85 0 01-1.8-.63z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-background/20 mt-12 pt-8 text-center">
          <p className="text-background/60 text-sm">
            © 2025 CampJam Flooring. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;