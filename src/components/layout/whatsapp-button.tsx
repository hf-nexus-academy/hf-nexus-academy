"use client";

import { FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";

export function WhatsAppFloatingButton() {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
  const message = encodeURIComponent(
    "Assalamu Alaikum, I'm interested in HF Nexus Academy courses."
  );
  const href = `https://wa.me/${number.replace(/[^0-9]/g, "")}?text=${message}`;

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 15 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20"
    >
      <FaWhatsapp className="h-7 w-7" />
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
    </motion.a>
  );
}
