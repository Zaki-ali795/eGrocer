import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, Send } from 'lucide-react';
import { useState } from 'react';

export function Footer() {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail('');
  };

  const footerLinks = {
    about: [
      'Our Story',
      'Sustainability',
      'Careers',
      'Press & Media',
      'Investor Relations',
    ],
    help: [
      'FAQ',
      'Shipping & Returns',
      'Order Tracking',
      'Product Guide',
      'Support Center',
    ],
    policies: [
      'Privacy Policy',
      'Terms of Service',
      'Cookie Policy',
      'Refund Policy',
      'Accessibility',
    ],
    shop: [
      'Fresh Produce',
      'Dairy & Eggs',
      'Meat & Seafood',
      'Pantry Staples',
      'Special Offers',
    ],
  };

  const socialLinks = [
    { icon: Facebook, label: 'Facebook', color: '#1877F2' },
    { icon: Twitter, label: 'Twitter', color: '#1DA1F2' },
    { icon: Instagram, label: 'Instagram', color: '#E4405F' },
    { icon: Youtube, label: 'YouTube', color: '#FF0000' },
  ];

  return (
    <footer className="bg-gradient-to-br from-[var(--green-dark)] via-[var(--green-primary)] to-[var(--green-secondary)] text-white">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="mb-2 text-white">Stay Fresh with Our Newsletter</h3>
              <p className="text-white/80">
                Get weekly deals, seasonal recipes, and health tips delivered to your inbox
              </p>
            </motion.div>

            <motion.form
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              onSubmit={handleNewsletterSubmit}
              className="flex gap-3"
            >
              <div className="flex-1 relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md rounded-2xl border-2 border-white/20 focus:border-white text-white placeholder-white/60 outline-none transition-all"
                />
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-[var(--green-primary)] rounded-2xl hover:bg-white/90 transition-colors flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
                <span className="hidden sm:inline">Subscribe</span>
              </motion.button>
            </motion.form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <img
                  src="/src/imports/logo.png"
                  alt="eGrocer logo"
                  className="w-12 h-12 rounded-2xl shadow-lg object-cover bg-white"
                />
                <span className="text-2xl text-white font-bold">eGrocer</span>
              </div>
              <p className="text-white/80 text-sm mb-4">
                Fresh groceries from farm to your doorstep. Quality you can trust.
              </p>
            </motion.div>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href="#"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 bg-white/10 backdrop-blur-md rounded-xl hover:bg-white/20 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links], colIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: colIndex * 0.1 }}
            >
              <h4 className="mb-4 text-white capitalize">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-white/80 hover:text-white transition-colors text-sm block py-1"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid sm:grid-cols-3 gap-6 py-8 border-y border-white/10"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 rounded-xl">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-white/60 text-sm">Call Us</p>
              <p className="text-white">1-800-EGROCER</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 rounded-xl">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <p className="text-white/60 text-sm">Email</p>
              <p className="text-white">support@egrocer.com</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 rounded-xl">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-white/60 text-sm">Location</p>
              <p className="text-white">123 Fresh St, Organic City</p>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/60 text-sm">
            © 2026 eGrocer. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-white/60 hover:text-white text-sm transition-colors">
              Download iOS App
            </a>
            <a href="#" className="text-white/60 hover:text-white text-sm transition-colors">
              Download Android App
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
