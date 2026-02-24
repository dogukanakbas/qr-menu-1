"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { LucideIcon, Star as StarIcon, Heart, ChevronLeft, ChevronRight, Instagram, Phone } from "lucide-react";

import { formatCurrency } from "@/lib/utils";
import { getCategoryIcon } from "./page";
import { ProductModal } from "@/components/product-modal";

type RenderItem = {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  imageUrl?: string | null;
  featured?: boolean;
};

type RenderCategory = {
  id: string;
  name: string;
  description?: string | null;
  iconUrl?: string | null;
  categoryImageUrl?: string | null;
  items: RenderItem[];
  anchor: string;
};

type Props = {
  categories: RenderCategory[];
};

const SOCIAL_LINKS = [
  { href: "https://www.instagram.com/mihrali.cafe?igsh=MWJyMXU4dmdrYXR3dQ%3D%3D&utm_source=qr", label: "Instagram", icon: Instagram },
  { href: "tel:+905071692766", label: "Ara", icon: Phone },
];

export function CategoryCards({ categories }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selectedItem, setSelectedItem] = useState<RenderItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stars, setStars] = useState<Array<{ left: string; top: string; delay: string; duration: string }>>([]);
  const [particles, setParticles] = useState<Array<{ left: string; top: string; delay: string; duration: string }>>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(2);
  const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Favorileri localStorage'dan yükle
  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
  }, []);

  // Favorileri localStorage'a kaydet
  useEffect(() => {
    if (favorites.size > 0) {
      localStorage.setItem("favorites", JSON.stringify(Array.from(favorites)));
    } else {
      localStorage.removeItem("favorites");
    }
  }, [favorites]);

  useEffect(() => {
    setIsVisible(true);
    
    // Client-side'da rastgele yıldızlar oluştur
    const starsData = Array.from({ length: 25 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 2}s`,
      duration: `${3 + Math.random() * 4}s`,
    }));
    setStars(starsData);
    
    // Client-side'da rastgele partiküller oluştur
    const particlesData = Array.from({ length: 8 }, () => ({
      left: `${20 + Math.random() * 60}%`,
      top: `${20 + Math.random() * 60}%`,
      delay: `${Math.random() * 3}s`,
      duration: `${8 + Math.random() * 4}s`,
    }));
    setParticles(particlesData);
  }, []);

  const toggleFavorite = (itemId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(itemId)) {
        newFavorites.delete(itemId);
      } else {
        newFavorites.add(itemId);
      }
      return newFavorites;
    });
  };

  const handleItemClick = (item: RenderItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCategoryClick = (anchor: string) => {
    setSelectedCategory(anchor);
    setTimeout(() => {
      const element = document.getElementById(anchor);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  // Carousel navigation functions
  const scrollCarousel = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    
    const container = carouselRef.current;
    const cardWidth = container.querySelector('.carousel-card')?.clientWidth || 0;
    // Gap: gap-4 = 16px (mobil), gap-6 = 24px (desktop)
    const gap = typeof window !== 'undefined' && window.innerWidth >= 768 ? 24 : 16;
    const scrollAmount = cardWidth + gap;
    
    const newScrollLeft = direction === 'left' 
      ? container.scrollLeft - scrollAmount
      : container.scrollLeft + scrollAmount;
    
    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
  };

  // Touch/swipe handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!carouselRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!carouselRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !carouselRef.current) return;
    const x = e.touches[0].pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Adminin belirlediği özel kategoriyi bul (slug veya isim ile)
  const featuredCategory = categories.find(
    (cat) => 
      cat.anchor?.toLowerCase().includes("one-cikan") || 
      cat.anchor?.toLowerCase().includes("featured") ||
      cat.name?.toLowerCase().includes("öne çıkan") ||
      cat.name?.toLowerCase().includes("özel seçim")
  );

  // Update items per view - Responsive (detayların tam görünmesi için)
  useEffect(() => {
    const updateItemsPerView = () => {
      if (typeof window !== 'undefined') {
        if (window.innerWidth >= 1280) {
          setItemsPerView(4); // Büyük desktop: 4 kart
        } else if (window.innerWidth >= 1024) {
          setItemsPerView(3); // Desktop: 3 kart
        } else if (window.innerWidth >= 768) {
          setItemsPerView(2); // Tablet: 2 kart
        } else {
          setItemsPerView(1); // Mobil: 1 kart (tam görünsün)
        }
      }
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  // Update current slide on scroll
  useEffect(() => {
    if (!featuredCategory || featuredCategory.items.length === 0) return;

    const container = carouselRef.current;
    if (!container) return;

    const handleScroll = () => {
      const cards = container.querySelectorAll('.carousel-card') as NodeListOf<HTMLElement>;
      if (cards.length === 0) return;

      // Update current slide for dots
      const cardWidth = cards[0]?.clientWidth || 0;
      const gap = window.innerWidth >= 768 ? 24 : 16;
      const scrollPosition = container.scrollLeft;
      const slideIndex = Math.round(scrollPosition / (cardWidth + gap));
      setCurrentSlide(slideIndex);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [featuredCategory?.items.length]);

  // Otomatik carousel geçişi
  useEffect(() => {
    if (!featuredCategory || featuredCategory.items.length <= 1) return;
    if (!carouselRef.current) return;
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    if (isMobile) return; // Mobilde otomatik kaydırmayı kapat: animasyon kırılması önlenir.

    const container = carouselRef.current;
    let userInteracted = false;
    let interactionTimeout: NodeJS.Timeout | null = null;
    
    const resetAutoScroll = () => {
      // Kullanıcı etkileşimi oldu, 5 saniye bekle sonra tekrar başlat
      userInteracted = true;
      
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
        autoScrollIntervalRef.current = null;
      }
      
      if (interactionTimeout) {
        clearTimeout(interactionTimeout);
      }
      
      // 5 saniye sonra tekrar başlat
      interactionTimeout = setTimeout(() => {
        userInteracted = false;
        startAutoScroll();
      }, 5000);
    };
    
    const startAutoScroll = () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
      }
      
      const autoScroll = () => {
        if (isDragging || userInteracted) return;
        
        const cards = container.querySelectorAll('.carousel-card') as NodeListOf<HTMLElement>;
        if (cards.length === 0) return;

        const cardWidth = cards[0]?.clientWidth || 0;
        const gap = window.innerWidth >= 768 ? 24 : 16;
        const scrollAmount = cardWidth + gap;
        const maxScroll = container.scrollWidth - container.clientWidth;
        const currentScroll = container.scrollLeft;

        // Son kartta mıyız?
        if (currentScroll >= maxScroll - 10) {
          // Başa dön
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          // Bir sonraki karta geç
          container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      };

      // 4 saniyede bir otomatik geçiş
      autoScrollIntervalRef.current = setInterval(autoScroll, 4000);
    };
    
    // Scroll event'lerini dinle
    const handleUserScroll = () => {
      resetAutoScroll();
    };
    
    container.addEventListener('scroll', handleUserScroll, { passive: true });
    container.addEventListener('mousedown', resetAutoScroll);
    container.addEventListener('touchstart', resetAutoScroll);
    
    // İlk başlatma
    startAutoScroll();

    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
      }
      if (interactionTimeout) {
        clearTimeout(interactionTimeout);
      }
      container.removeEventListener('scroll', handleUserScroll);
      container.removeEventListener('mousedown', resetAutoScroll);
      container.removeEventListener('touchstart', resetAutoScroll);
    };
  }, [featuredCategory?.items.length, isDragging]);

  // Normal kategoriler (özel kategori hariç)
  const normalCategories = categories.filter(
    (cat) => cat.id !== featuredCategory?.id
  );

  const selectedCategoryData = selectedCategory
    ? normalCategories.find((cat) => cat.anchor === selectedCategory) || 
      (featuredCategory?.anchor === selectedCategory ? featuredCategory : null)
    : null;

  // Grid düzeni: İlk 4 kart üstte, sonraki kartlar altta
  const topCategories = normalCategories.slice(0, 4);
  const bottomCategories = normalCategories.slice(4);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 relative overflow-hidden text-white">
      {/* Arka plan partikül ve gradient efektleri */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Ana gradient glow'lar */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
        
        {/* Ekstra glow efektleri - daha dinamik */}
        <div className="absolute top-40 right-20 w-48 h-48 bg-yellow-300/8 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "0.5s" }} />
        <div className="absolute bottom-40 left-20 w-56 h-56 bg-white/3 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-yellow-400/6 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2.5s" }} />
        
        {/* Mesh gradient overlay - daha zengin renk geçişleri */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/0 via-yellow-400/0 to-yellow-400/5 opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-tl from-white/0 via-white/0 to-white/3 opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-tr from-yellow-300/0 via-transparent to-yellow-500/3" />
        
        {/* Animated stars pattern - subtle twinkle efekti */}
        {stars.length > 0 && (
          <div className="absolute inset-0 opacity-20">
            {stars.map((star, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-yellow-400 rounded-full"
                style={{
                  left: star.left,
                  top: star.top,
                  animation: `twinkle ${star.duration} infinite`,
                  animationDelay: star.delay,
                }}
              />
            ))}
          </div>
        )}
        
        {/* Floating particles - daha dinamik hareket */}
        {particles.length > 0 && (
          <div className="absolute inset-0 opacity-10">
            {particles.map((particle, i) => (
              <div
                key={`particle-${i}`}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full blur-sm"
                style={{
                  left: particle.left,
                  top: particle.top,
                  animation: `float ${particle.duration} infinite ease-in-out`,
                  animationDelay: particle.delay,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Sticky Header */}
      {!selectedCategory && (
        <div className="sticky top-0 z-50 backdrop-blur-xl bg-black/40 border-b border-yellow-400/20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 py-3">
            <div className="text-center">
              <div className="flex justify-center items-center mb-2">
                <div className="relative w-[560px] h-[100px] sm:w-[700px] sm:h-[125px] md:w-[840px] md:h-[150px] lg:w-[1000px] lg:h-[180px]">
                  <Image
                    src="/logo.svg"
                    alt="Mihrali Coffee Logo"
                    fill
                    className="object-contain"
                    priority
                    unoptimized
                    sizes="(max-width: 640px) 560px, (max-width: 768px) 700px, (max-width: 1024px) 840px, 1000px"
                  />
                </div>
              </div>
              <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-center gap-2 sm:gap-3 text-xs sm:text-sm text-yellow-100">
                <span className="inline-flex items-center gap-2 rounded-full bg-yellow-500/10 border border-yellow-400/40 px-3 py-1.5 font-semibold text-yellow-100">
                  Not: Her masada fix çerez olacaktır.
                </span>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {SOCIAL_LINKS.map((link) => {
                    const Icon = link.icon;
                    return (
                      <a
                        key={link.href}
                        href={link.href}
                        target={link.href.startsWith("http") ? "_blank" : undefined}
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/30 px-3 py-1.5 font-semibold text-white hover:bg-white/20 transition"
                      >
                        <Icon className="w-4 h-4" />
                        {link.label}
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Adminin Belirlediği Özel Kategori - Carousel */}
      {featuredCategory && featuredCategory.items.length > 0 && (
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16 relative z-10">
          <div className="mb-6 sm:mb-8 text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-200 to-white mb-2">
              {featuredCategory.name}
            </h2>
            {featuredCategory.description && (
              <p className="text-gray-400 text-sm sm:text-base lg:text-lg px-4">{featuredCategory.description}</p>
            )}
          </div>
          
          {/* Carousel Container */}
          <div className="relative px-4 sm:px-8 md:px-12 lg:px-16 overflow-hidden">
            {/* Navigation Buttons - Sadece tablet ve üzeri cihazlarda görünür */}
            {featuredCategory.items.length > 1 && (
              <>
                <button
                  onClick={() => scrollCarousel('left')}
                  className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 rounded-full bg-black/80 backdrop-blur-xl border border-yellow-400/30 hover:border-yellow-400/60 transition-all duration-300 hover:scale-110 hover:bg-black/90 shadow-lg items-center justify-center"
                  aria-label="Önceki"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
                </button>
                <button
                  onClick={() => scrollCarousel('right')}
                  className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 rounded-full bg-black/80 backdrop-blur-xl border border-yellow-400/30 hover:border-yellow-400/60 transition-all duration-300 hover:scale-110 hover:bg-black/90 shadow-lg items-center justify-center"
                  aria-label="Sonraki"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
                </button>
              </>
            )}

            {/* Carousel */}
            <div
              ref={carouselRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="flex gap-4 md:gap-6 overflow-x-auto overflow-y-clip scrollbar-hide scroll-smooth snap-x snap-mandatory pb-4"
              style={{
                cursor: isDragging ? 'grabbing' : 'grab',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {featuredCategory.items.map((item, index) => {
                const isFavorite = favorites.has(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => !isDragging && handleItemClick(item)}
                    className={`carousel-card group relative flex-shrink-0 w-[calc(100%-16px)] sm:w-[calc(50%-16px)] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)] h-64 sm:h-72 md:h-80 overflow-hidden rounded-xl sm:rounded-2xl cursor-pointer snap-start ${
                      isVisible ? `animate-fade-in-up animate-delay-${(index + 1) * 100}` : "opacity-0"
                    }`}
                    data-card-index={index}
                  >
                    {/* Neon Border - Her zaman görünür */}
                    <div className="carousel-border absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-yellow-400 via-yellow-200 to-white opacity-60 group-hover:opacity-100 blur-[1px] group-hover:blur-none" />
                    <div className="absolute inset-[2px] rounded-xl sm:rounded-2xl bg-black overflow-hidden">
                      {/* Sarı Neon Yıldızlar - Köşelerde */}
                      <StarIcon className="absolute top-2 left-2 sm:top-3 sm:left-3 w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-400 fill-yellow-400" />
                      <StarIcon className="absolute top-2 right-2 sm:top-3 sm:right-3 w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-400 fill-yellow-400" />
                      <StarIcon className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-400 fill-yellow-400" />
                      <StarIcon className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-400 fill-yellow-400" />
                    </div>
                    
                    {/* Ürün Görseli - Üst Kısım */}
                    {item.imageUrl && (
                      <div className="absolute inset-[2px] top-[2px] bottom-[45%] sm:bottom-[48%] md:bottom-[42%] overflow-hidden rounded-t-xl sm:rounded-t-2xl">
                        <div className="absolute inset-2 sm:inset-3 md:inset-4 rounded-lg sm:rounded-xl overflow-hidden">
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            className="object-cover transition-opacity duration-300 group-hover:opacity-90"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                            loading={index === 0 ? "eager" : "lazy"}
                            priority={index === 0}
                          />
                        </div>
                        
                        {/* Favori Butonu - Görselin üst sağında */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(item.id);
                          }}
                          className="carousel-favorite-btn absolute top-2 right-2 sm:top-3 md:top-4 sm:right-3 md:right-4 z-20 p-1.5 sm:p-2 md:p-2.5 rounded-full bg-black/80 backdrop-blur-xl border border-yellow-400/30 hover:border-yellow-400/60 transition-all duration-300 active:opacity-70"
                          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                        >
                          <Heart
                            className={`w-3 h-3 sm:w-4 md:w-5 sm:h-4 md:h-5 transition-all duration-300 ${
                              isFavorite
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-400 group-hover:text-yellow-400"
                            }`}
                          />
                        </button>
                      </div>
                    )}
                    
                    {/* Alt Kısım - Siyah Alan (Metinler için) */}
                    <div className="absolute inset-[2px] top-[55%] sm:top-[52%] md:top-[58%] bottom-[2px] bg-black rounded-b-xl sm:rounded-b-2xl">
                      {/* İçerik - Detayların tam görünmesi için */}
                      <div className="relative z-10 h-full p-3.5 sm:p-4 md:p-5 flex flex-col justify-center">
                        {/* İsim ve Fiyat - Yan Yana */}
                        <div className="flex items-start justify-between gap-2.5 sm:gap-3">
                          <div className="flex items-start gap-2 sm:gap-2.5 flex-1 min-w-0 pr-1">
                            <StarIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-yellow-400 fill-yellow-400 flex-shrink-0 mt-0.5" />
                            <h3 className="text-base sm:text-base md:text-lg font-bold text-white group-hover:text-yellow-200 transition-colors duration-300 leading-snug carousel-product-name-compact">
                              {item.name}
                            </h3>
                          </div>
                          <div className="text-base sm:text-lg md:text-xl lg:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-200 to-white flex-shrink-0 whitespace-nowrap">
                            {formatCurrency(item.price)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Scroll Indicators (Dots) */}
            {featuredCategory.items.length > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                {Array.from({ length: Math.ceil(featuredCategory.items.length / itemsPerView) }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (!carouselRef.current) return;
                      const cardWidth = carouselRef.current.querySelector('.carousel-card')?.clientWidth || 0;
                      // Gap: gap-4 = 16px (mobil), gap-6 = 24px (desktop)
                      const gap = typeof window !== 'undefined' && window.innerWidth >= 768 ? 24 : 16;
                      const scrollAmount = (cardWidth + gap) * index * itemsPerView;
                      carouselRef.current.scrollTo({ left: scrollAmount, behavior: 'smooth' });
                    }}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentSlide === index
                        ? 'w-8 bg-yellow-400'
                        : 'w-2 bg-yellow-400/30 hover:bg-yellow-400/50'
                    }`}
                    aria-label={`Slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Kategori Kartları Bölümü */}
      {!selectedCategory && (
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16 relative z-10">
          {/* Üst Satır - 4 Kart */}
          {topCategories.length > 0 && (
            <div className="mb-6 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {topCategories.map((category, index) => {
                const IconComponent = getCategoryIcon(category.name);
                const firstItem = category.items[0];
                const bgImage = category.categoryImageUrl || firstItem?.imageUrl || "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=800&q=80";
                const hasCustomIcon = !!category.iconUrl;

                return (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.anchor)}
                    className={`group relative h-80 overflow-hidden rounded-3xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 transform-3d card-3d ${
                      isVisible ? `animate-fade-in-up animate-delay-${(index + 1) * 100}` : "opacity-0"
                    }`}
                  >
                    {/* Neon Border - Her zaman görünür */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-yellow-400 via-yellow-200 to-white opacity-60 group-hover:opacity-100 transition-opacity duration-300 blur-[1px] group-hover:blur-none" />
                    <div className="absolute inset-[2px] rounded-3xl bg-black">
                      {/* Sarı Neon Yıldızlar */}
                      <StarIcon className="absolute top-4 left-6 w-3 h-3 text-yellow-400 fill-yellow-400 opacity-60 animate-pulse" style={{ animationDelay: "0s" }} />
                      <StarIcon className="absolute top-12 right-8 w-2 h-2 text-yellow-300 fill-yellow-300 opacity-50 animate-pulse" style={{ animationDelay: "0.5s" }} />
                      <StarIcon className="absolute bottom-16 left-8 w-2.5 h-2.5 text-yellow-200 fill-yellow-200 opacity-40 animate-pulse" style={{ animationDelay: "1s" }} />
                      <StarIcon className="absolute bottom-8 right-12 w-2 h-2 text-yellow-400 fill-yellow-400 opacity-55 animate-pulse" style={{ animationDelay: "1.5s" }} />
                      <StarIcon className="absolute top-1/2 left-4 w-2 h-2 text-yellow-300 fill-yellow-300 opacity-45 animate-pulse" style={{ animationDelay: "0.3s" }} />
                      <StarIcon className="absolute top-1/3 right-4 w-1.5 h-1.5 text-yellow-200 fill-yellow-200 opacity-50 animate-pulse" style={{ animationDelay: "0.8s" }} />
                    </div>
                    
                    {/* Arka Plan Görseli */}
                    <div className="absolute inset-[2px] overflow-hidden rounded-3xl">
                      <Image
                        src={bgImage}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/50" />
                    </div>

                    {/* İçerik */}
                    <div className="relative z-10 flex h-full flex-col items-center justify-center p-8 text-center">
                      <div className="mb-6 rounded-full bg-white/20 p-6 backdrop-blur-xl transition-all duration-500 group-hover:scale-110 group-hover:bg-white/30 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] group-hover:rotate-6">
                        {hasCustomIcon ? (
                          <div className="relative h-16 w-16">
                            <Image
                              src={category.iconUrl!}
                              alt={category.name}
                              fill
                              className="object-contain transition-all duration-500 group-hover:scale-110 filter brightness-0 invert"
                              sizes="64px"
                            />
                          </div>
                        ) : (
                          <IconComponent className="h-16 w-16 text-white transition-all duration-500 group-hover:text-yellow-200 group-hover:scale-110" strokeWidth={1.5} />
                        )}
                      </div>
                      <h2 className="mb-3 text-3xl font-extrabold text-white drop-shadow-2xl transition-all duration-500 group-hover:text-yellow-200 group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.9)] group-hover:scale-105">
                        {category.name}
                      </h2>
                      <p className="text-base text-gray-200 drop-shadow-lg transition-all duration-500 group-hover:text-white group-hover:font-medium">
                        {category.description || "Lezzetli seçenekler"}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Alt Satır - Ortada Tek Kart veya Grid */}
          {bottomCategories.length > 0 && (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {bottomCategories.length === 1 ? (
                <div className="lg:col-start-2">
                  {bottomCategories.map((category, index) => {
                    const IconComponent = getCategoryIcon(category.name);
                    const firstItem = category.items[0];
                    const bgImage = firstItem?.imageUrl || "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=800&q=80";
                    const hasCustomIcon = !!category.iconUrl;

                    return (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryClick(category.anchor)}
                        className={`group relative h-80 w-full overflow-hidden rounded-3xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 transform-3d card-3d ${
                          isVisible ? `animate-fade-in-up animate-delay-${(topCategories.length + index + 1) * 100}` : "opacity-0"
                        }`}
                      >
                        {/* Neon Border - Her zaman görünür */}
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-yellow-400 via-yellow-200 to-white opacity-60 group-hover:opacity-100 transition-opacity duration-300 blur-[1px] group-hover:blur-none" />
                        <div className="absolute inset-[2px] rounded-3xl bg-black">
                          {/* Sarı Neon Yıldızlar */}
                          <StarIcon className="absolute top-4 left-6 w-3 h-3 text-yellow-400 fill-yellow-400 opacity-60 animate-pulse" style={{ animationDelay: "0s" }} />
                          <StarIcon className="absolute top-12 right-8 w-2 h-2 text-yellow-300 fill-yellow-300 opacity-50 animate-pulse" style={{ animationDelay: "0.5s" }} />
                          <StarIcon className="absolute bottom-16 left-8 w-2.5 h-2.5 text-yellow-200 fill-yellow-200 opacity-40 animate-pulse" style={{ animationDelay: "1s" }} />
                          <StarIcon className="absolute bottom-8 right-12 w-2 h-2 text-yellow-400 fill-yellow-400 opacity-55 animate-pulse" style={{ animationDelay: "1.5s" }} />
                          <StarIcon className="absolute top-1/2 left-4 w-2 h-2 text-yellow-300 fill-yellow-300 opacity-45 animate-pulse" style={{ animationDelay: "0.3s" }} />
                          <StarIcon className="absolute top-1/3 right-4 w-1.5 h-1.5 text-yellow-200 fill-yellow-200 opacity-50 animate-pulse" style={{ animationDelay: "0.8s" }} />
                        </div>
                        
                        <div className="absolute inset-[2px] overflow-hidden rounded-3xl">
                          <Image
                            src={bgImage}
                            alt={category.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/50" />
                        </div>
                        <div className="relative z-10 flex h-full flex-col items-center justify-center p-8 text-center">
                          <div className="mb-6 rounded-full bg-white/20 p-6 backdrop-blur-xl transition-all duration-500 group-hover:scale-110 group-hover:bg-white/30 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] group-hover:rotate-6">
                            {hasCustomIcon ? (
                              <div className="relative h-16 w-16">
                                <Image
                                  src={category.iconUrl!}
                                  alt={category.name}
                                  fill
                                  className="object-contain transition-all duration-500 group-hover:scale-110 filter brightness-0 invert"
                                  sizes="64px"
                                />
                              </div>
                            ) : (
                              <IconComponent className="h-16 w-16 text-white transition-all duration-500 group-hover:text-yellow-200 group-hover:scale-110" strokeWidth={1.5} />
                            )}
                          </div>
                          <h2 className="mb-3 text-3xl font-extrabold text-white drop-shadow-2xl transition-all duration-500 group-hover:text-yellow-200 group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.9)] group-hover:scale-105">
                            {category.name}
                          </h2>
                          <p className="text-base text-gray-200 drop-shadow-lg transition-all duration-500 group-hover:text-white group-hover:font-medium">
                            {category.description || "Lezzetli seçenekler"}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                bottomCategories.map((category, index) => {
                  const IconComponent = getCategoryIcon(category.name);
                  const firstItem = category.items[0];
                  const bgImage = category.categoryImageUrl || firstItem?.imageUrl || "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=800&q=80";
                  const hasCustomIcon = !!category.iconUrl;

                  return (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryClick(category.anchor)}
                      className={`group relative h-80 overflow-hidden rounded-3xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 transform-3d card-3d ${
                        isVisible ? `animate-fade-in-up animate-delay-${(topCategories.length + index + 1) * 100}` : "opacity-0"
                      }`}
                    >
                      {/* Neon Border - Her zaman görünür */}
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-yellow-400 via-yellow-200 to-white opacity-60 group-hover:opacity-100 transition-opacity duration-300 blur-[1px] group-hover:blur-none" />
                      <div className="absolute inset-[2px] rounded-3xl bg-white dark:bg-black" />
                      
                      <div className="absolute inset-[2px] overflow-hidden rounded-3xl">
                        <Image
                          src={bgImage}
                          alt={category.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, 25vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/50" />
                      </div>
                      <div className="relative z-10 flex h-full flex-col items-center justify-center p-8 text-center">
                        <div className="mb-6 rounded-full bg-white/20 p-6 backdrop-blur-xl transition-all duration-500 group-hover:scale-110 group-hover:bg-white/30 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] group-hover:rotate-6">
                          {hasCustomIcon ? (
                            <div className="relative h-16 w-16">
                              <Image
                                src={category.iconUrl!}
                                alt={category.name}
                                fill
                                className="object-contain transition-all duration-500 group-hover:scale-110 filter brightness-0 invert"
                                sizes="64px"
                              />
                            </div>
                          ) : (
                            <IconComponent className="h-16 w-16 text-white transition-all duration-500 group-hover:text-yellow-200 group-hover:scale-110" strokeWidth={1.5} />
                          )}
                        </div>
                        <h2 className="mb-3 text-3xl font-extrabold text-white drop-shadow-2xl transition-all duration-500 group-hover:text-yellow-200 group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.9)] group-hover:scale-105">
                          {category.name}
                        </h2>
                        <p className="text-base text-gray-200 drop-shadow-lg transition-all duration-500 group-hover:text-white group-hover:font-medium">
                          {category.description || "Lezzetli seçenekler"}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>
      )}

      {/* Kategori Detayları Bölümü */}
      {selectedCategoryData && (
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 relative z-10">
          <button
            onClick={() => {
              setSelectedCategory(null);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="group mb-6 sm:mb-8 inline-flex items-center gap-3 px-6 py-3 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 border-2 border-yellow-300/70 hover:border-yellow-200/90 text-black transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-yellow-400/60 hover:bg-gradient-to-r hover:from-yellow-300 hover:via-yellow-200 hover:to-yellow-300"
          >
            <span className="text-2xl sm:text-3xl font-bold text-black transition-all duration-300 group-hover:-translate-x-1">←</span>
            <span className="text-base sm:text-lg font-bold tracking-wide text-black transition-all duration-300">
              Kategorilere Dön
            </span>
          </button>

          <div id={selectedCategoryData.anchor} className="space-y-8 animate-fade-in">
            <div className="text-center px-4">
              <h2 className="mb-3 sm:mb-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-200 to-white">
                {selectedCategoryData.name}
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-300 font-light tracking-wide">{selectedCategoryData.description}</p>
            </div>

            <div className="grid gap-3 sm:gap-4 md:gap-6 lg:gap-8 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3">
              {selectedCategoryData.items.map((item, index) => {
                const isFavorite = favorites.has(item.id);
                return (
                  <div
                    key={item.id}
                    className={`group relative rounded-xl sm:rounded-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 transform-3d card-3d animate-fade-in-up animate-delay-${(index + 1) * 100} cursor-pointer`}
                    onClick={() => handleItemClick(item)}
                  >
                  {/* Neon Border - Her zaman görünür */}
                  <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-yellow-400 via-yellow-200 to-white opacity-60 group-hover:opacity-100 transition-opacity duration-300 blur-[1px] group-hover:blur-none" />
                  <div className="absolute inset-[2px] rounded-xl sm:rounded-2xl bg-black">
                      {/* Sarı Neon Yıldızlar */}
                      <StarIcon className="absolute top-3 left-4 w-2.5 h-2.5 text-yellow-400 fill-yellow-400 opacity-60 animate-pulse" style={{ animationDelay: "0s" }} />
                      <StarIcon className="absolute top-8 right-6 w-2 h-2 text-yellow-300 fill-yellow-300 opacity-50 animate-pulse" style={{ animationDelay: "0.5s" }} />
                      <StarIcon className="absolute bottom-12 left-6 w-2 h-2 text-yellow-200 fill-yellow-200 opacity-40 animate-pulse" style={{ animationDelay: "1s" }} />
                      <StarIcon className="absolute bottom-6 right-8 w-1.5 h-1.5 text-yellow-400 fill-yellow-400 opacity-55 animate-pulse" style={{ animationDelay: "1.5s" }} />
                      <StarIcon className="absolute top-1/2 left-3 w-1.5 h-1.5 text-yellow-300 fill-yellow-300 opacity-45 animate-pulse" style={{ animationDelay: "0.3s" }} />
                      <StarIcon className="absolute top-1/4 right-3 w-2 h-2 text-yellow-200 fill-yellow-200 opacity-50 animate-pulse" style={{ animationDelay: "0.8s" }} />
                    </div>
                    
                    {/* Favori Butonu */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(item.id);
                      }}
                      className="absolute top-1.5 right-1.5 sm:top-2 md:top-4 sm:right-2 md:right-4 z-20 p-1 sm:p-1.5 md:p-2 rounded-full bg-black/80 backdrop-blur-xl border border-yellow-400/30 hover:border-yellow-400/60 transition-all duration-300 hover:scale-110"
                      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                    >
                      <Heart
                        className={`w-3 h-3 sm:w-4 md:w-5 sm:h-4 md:h-5 transition-all duration-300 ${
                          isFavorite
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-400 hover:text-yellow-400"
                        }`}
                      />
                    </button>
                    
                    {/* İçerik */}
                    <div className="relative z-10 p-3 sm:p-4 md:p-6">
                      <div className="relative mb-2 sm:mb-3 md:mb-4 h-32 sm:h-40 md:h-48 overflow-hidden rounded-xl">
                        <Image
                          src={
                            item.imageUrl ??
                            "https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=600&q=80"
                          }
                          alt={item.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                      <div className="space-y-1.5 sm:space-y-2 md:space-y-3">
                        <div className="flex items-start justify-between gap-1.5 sm:gap-2 md:gap-4">
                          <h3 className="flex-1 text-sm sm:text-base md:text-lg lg:text-xl font-extrabold text-white break-words leading-tight">
                            {item.name}
                          </h3>
                          <span className="flex-shrink-0 bg-gradient-to-r from-yellow-400 via-yellow-200 to-white bg-clip-text text-sm sm:text-base md:text-lg lg:text-xl font-extrabold text-transparent whitespace-nowrap">
                            {formatCurrency(item.price)}
                          </span>
                        </div>
                        {item.description && (
                          <p className="text-[10px] sm:text-xs md:text-sm text-gray-400 line-clamp-2">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Product Modal */}
      <ProductModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onToggleFavorite={toggleFavorite}
        isFavorite={selectedItem ? favorites.has(selectedItem.id) : false}
      />
    </main>
  );
}
