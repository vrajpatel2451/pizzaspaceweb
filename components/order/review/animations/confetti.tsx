"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface ConfettiPiece {
  id: number;
  x: number;
  startX: number;
  y: number;
  rotation: number;
  color: string;
  scale: number;
  delay: number;
  shape: "circle" | "square" | "rectangle";
}

export function Confetti() {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    // Brand-aligned colors with the PizzaSpace design system
    const colors = [
      "#F97316", // Primary orange
      "#FB923C", // Light orange
      "#FBBF24", // Amber/gold (star color)
      "#22C55E", // Success green
      "#3B82F6", // Info blue
      "#EC4899", // Pink accent
      "#A855F7", // Purple accent
    ];
    const shapes: ("circle" | "square" | "rectangle")[] = ["circle", "square", "rectangle"];

    const confettiPieces: ConfettiPiece[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 300,
      startX: (Math.random() - 0.5) * 100,
      y: -20,
      rotation: Math.random() * 720 - 360,
      color: colors[Math.floor(Math.random() * colors.length)],
      scale: Math.random() * 0.6 + 0.4,
      delay: Math.random() * 0.4,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
    }));
    setPieces(confettiPieces);
  }, []);

  const getShapeClasses = (shape: "circle" | "square" | "rectangle") => {
    switch (shape) {
      case "circle":
        return "w-2 h-2 rounded-full";
      case "square":
        return "w-2 h-2 rounded-sm";
      case "rectangle":
        return "w-3 h-1.5 rounded-sm";
      default:
        return "w-2 h-2 rounded-sm";
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute top-1/3 left-1/2"
          initial={{
            x: piece.startX,
            y: 0,
            rotate: 0,
            scale: 0,
            opacity: 0,
          }}
          animate={{
            x: piece.x,
            y: ["0vh", "-30vh", "60vh"],
            rotate: piece.rotation,
            scale: [0, piece.scale, piece.scale, 0],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 2.2,
            delay: piece.delay,
            ease: [0.22, 1, 0.36, 1],
            times: [0, 0.2, 0.7, 1],
          }}
        >
          <motion.div
            className={getShapeClasses(piece.shape)}
            style={{ backgroundColor: piece.color }}
            animate={{
              rotateY: [0, 180, 360],
            }}
            transition={{
              duration: 1,
              repeat: 2,
              ease: "linear",
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}
