import { useState, useEffect } from "react";
import campjamLogo from "@/assets/transparentlogo.png";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/95 backdrop-blur-sm soft-shadow" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img
              src={campjamLogo}
              alt="CampJam Flooring Logo"
              className="h-10 w-10 md:h-12 md:w-12"
            />
            <h1 className="text-2xl md:text-3xl font-bold text-primary tracking-wide">
              CampJam Flooring
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection("home")}
              className="text-primary hover:text-primary/80 transition-colors duration-300 font-medium"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("projects")}
              className="text-primary hover:text-primary/80 transition-colors duration-300 font-medium"
            >
              Projects
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="text-primary hover:text-primary/80 transition-colors duration-300 font-medium"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("reviews")}
              className="text-primary hover:text-primary/80 transition-colors duration-300 font-medium"
            >
              Reviews
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-primary hover:text-primary/80 transition-colors duration-300 font-medium"
            >
              Contact
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-primary hover:text-primary/80 transition-colors duration-300 p-2"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-primary/20">
            <div className="flex flex-col space-y-4 pt-4">
              <button
                onClick={() => scrollToSection("home")}
                className="text-primary hover:text-primary/80 transition-colors duration-300 font-medium text-left px-4 py-2"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("projects")}
                className="text-primary hover:text-primary/80 transition-colors duration-300 font-medium text-left px-4 py-2"
              >
                Projects
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="text-primary hover:text-primary/80 transition-colors duration-300 font-medium text-left px-4 py-2"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection("reviews")}
                className="text-primary hover:text-primary/80 transition-colors duration-300 font-medium text-left px-4 py-2"
              >
                Reviews
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-primary hover:text-primary/80 transition-colors duration-300 font-medium text-left px-4 py-2"
              >
                Contact
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;