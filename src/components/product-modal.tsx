"use client";

import Image from "next/image";
import { X, Star } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

type RenderItem = {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  imageUrl?: string | null;
  featured?: boolean;
};

type Props = {
  item: RenderItem | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleFavorite: (itemId: string) => void;
  isFavorite: boolean;
};

export function ProductModal({ item, isOpen, onClose, onToggleFavorite, isFavorite }: Props) {
  if (!isOpen || !item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-black rounded-3xl border-2 border-yellow-400/60 shadow-2xl overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/80 backdrop-blur-xl border border-yellow-400/30 hover:border-yellow-400/60 transition-all duration-300 hover:scale-110"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-yellow-400" />
        </button>

        {/* Image */}
        <div className="relative h-64 md:h-80 w-full">
          <Image
            src={
              item.imageUrl ??
              "https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=800&q=80"
            }
            alt={item.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 800px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
                {item.name}
              </h2>
              {item.description && (
                <p className="text-lg text-gray-300 mb-4">{item.description}</p>
              )}
            </div>
            <button
              onClick={() => onToggleFavorite(item.id)}
              className="ml-4 p-2 rounded-full bg-black/80 backdrop-blur-xl border border-yellow-400/30 hover:border-yellow-400/60 transition-all duration-300 hover:scale-110"
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Star
                className={`w-6 h-6 transition-colors ${
                  isFavorite
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-400 hover:text-yellow-400"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-yellow-400/20">
            <span className="bg-gradient-to-r from-yellow-400 via-yellow-200 to-white bg-clip-text text-3xl font-extrabold text-transparent">
              {formatCurrency(item.price)}
            </span>
            {item.featured && (
              <span className="px-3 py-1 rounded-full bg-yellow-400/20 text-yellow-400 text-sm font-semibold border border-yellow-400/30">
                Öne Çıkan
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
