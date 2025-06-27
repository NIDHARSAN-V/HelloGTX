import { Link } from "react-router-dom";
import {
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-background border-t border-gray-300">
      <div className="container py-12 md:py-16 max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <MapPin className="text-primary h-5 w-5" />
              <span className="font-bold">Luxury Travels</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Discover the world with our premium travel experiences. Luxury
              destinations, exclusive packages, and unforgettable memories.
            </p>
            <div className="flex space-x-4">
              <Link to="#" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link to="#" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link to="#" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link to="#" className="text-muted-foreground hover:text-primary">
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>

          {/* Explore Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/destinations"
                  className="text-muted-foreground hover:text-primary"
                >
                  Destinations
                </Link>
              </li>
              <li>
                <Link
                  to="/packages"
                  className="text-muted-foreground hover:text-primary"
                >
                  Travel Packages
                </Link>
              </li>
              <li>
                <Link
                  to="/hotels"
                  className="text-muted-foreground hover:text-primary"
                >
                  Hotels
                </Link>
              </li>
              <li>
                <Link
                  to="/flights"
                  className="text-muted-foreground hover:text-primary"
                >
                  Flights
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-muted-foreground hover:text-primary"
                >
                  Travel Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/about"
                  className="text-muted-foreground hover:text-primary"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/careers"
                  className="text-muted-foreground hover:text-primary"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  to="/press"
                  className="text-muted-foreground hover:text-primary"
                >
                  Press
                </Link>
              </li>
              <li>
                <Link
                  to="/partners"
                  className="text-muted-foreground hover:text-primary"
                >
                  Partners
                </Link>
              </li>
              <li>
                <Link
                  to="/affiliate"
                  className="text-muted-foreground hover:text-primary"
                >
                  Affiliate Program
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/help"
                  className="text-muted-foreground hover:text-primary"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-muted-foreground hover:text-primary"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-muted-foreground hover:text-primary"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-muted-foreground hover:text-primary"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-muted-foreground hover:text-primary"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start space-x-2">
                <MapPin className="text-muted-foreground h-5 w-5" />
                <span className="text-muted-foreground">
                  123 Travel Street, City, Country
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="text-muted-foreground h-5 w-5" />
                <Link
                  to="mailto:info@luxurytravels.com"
                  className="text-muted-foreground hover:text-primary"
                >
                  info@luxurytravels.com
                </Link>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="text-muted-foreground h-5 w-5" />
                <Link
                  to="tel:+1234567890"
                  className="text-muted-foreground hover:text-primary"
                >
                  +1 (234) 567-890
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t pt-6 text-center border-gray-300 text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} Luxury Travels. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
