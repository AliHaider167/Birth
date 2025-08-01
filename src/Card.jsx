import React from "react";
import { motion } from "framer-motion";

const AnimatedBirthdayCard = ({ name = "Hafsa Zaman", onClose }) => {
  return (
    <motion.div
      initial={{ scale: 0.7, opacity: 0, rotate: -10 }}
      animate={{ scale: 1, opacity: 1, rotate: 0 }}
      exit={{ scale: 0.8, opacity: 0, rotate: 10 }}
      transition={{ type: "spring", stiffness: 120, damping: 12 }}
      style={{
        position: "fixed",
        top: "30%",
        left: "5%",
        right : "auto",
        transform: "translate(-50%, -50%)",
        background: "#fff",
        padding: "2rem",
        borderRadius: "1.5rem",
        boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
        textAlign: "center",
        zIndex: 999,
        maxWidth: "90%",
        width: "350px",
        color: "#1f005c",
      }}
    >
      <motion.h2
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        style={{ marginBottom: "1rem" }}
      >
        🎉 Happy Birthday, {name}! 🎂
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        style={{ marginBottom: "1.5rem" }}
      >
        Wishing you love, laughter, and joy on your special day. You deserve
        the best!
      </motion.p>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClose}
        style={{
          padding: "10px 20px",
          borderRadius: "999px",
          border: "none",
          background:
            "linear-gradient(135deg, #ff6ec7 0%, #ffe066 100%)",
          color: "#1f005c",
          fontWeight: "bold",
          cursor: "pointer",
          boxShadow: "0 8px 20px rgba(255,110,199,0.5)",
        }}
      >
        Close Card
      </motion.button>
    </motion.div>
  );
};

export default AnimatedBirthdayCard;
