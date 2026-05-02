function Footer() {
  return (
    <footer className="border-t border-[#D4AF37]/20 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-10 text-sm text-gray-400 flex flex-col md:flex-row justify-between gap-4">
        <p>© {new Date().getFullYear()} DARKHASH All rights reserved.</p>
        <p>Certified precious stones marketplace.</p>
      </div>
    </footer>
  );
}

export default Footer;