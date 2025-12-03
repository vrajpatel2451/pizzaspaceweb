"use client";

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
  const [isAnimating, setIsAnimating] = useState(false);

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

    // Trigger animation after pieces are set
    requestAnimationFrame(() => setIsAnimating(true));
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
      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0vh);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          20% {
            transform: translateY(-30vh);
          }
          70% {
            opacity: 1;
          }
          100% {
            transform: translateY(60vh);
            opacity: 0;
          }
        }
        @keyframes confetti-spin {
          0% {
            transform: rotateY(0deg);
          }
          100% {
            transform: rotateY(720deg);
          }
        }
        .confetti-piece {
          animation: confetti-fall 2.2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .confetti-inner {
          animation: confetti-spin 1s linear 2;
        }
        @media (prefers-reduced-motion: reduce) {
          .confetti-piece,
          .confetti-inner {
            animation: none;
            opacity: 0;
          }
        }
      `}</style>
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute top-1/3 left-1/2 confetti-piece"
          style={{
            transform: `translateX(${piece.startX}px)`,
            animationDelay: `${piece.delay}s`,
            opacity: isAnimating ? undefined : 0,
          }}
        >
          <div
            className="confetti-inner"
            style={{
              transform: `translateX(${piece.x}px) rotate(${piece.rotation}deg) scale(${piece.scale})`,
            }}
          >
            <div
              className={getShapeClasses(piece.shape)}
              style={{ backgroundColor: piece.color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
