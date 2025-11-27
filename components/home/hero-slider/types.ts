export interface HeroSlide {
  id: number;
  title: string;
  description: string;
  image: string;
  cta: {
    text: string;
    href: string;
  };
}

export const heroSlides: HeroSlide[] = [
  {
    id: 1,
    title: "New Margherita Supreme",
    description: "Fresh ingredients, authentic taste",
    image: "/images/hero/slide1.svg",
    cta: { text: "Order Now", href: "/menu" },
  },
  {
    id: 2,
    title: "Free Delivery Weekend",
    description: "Order now and get free delivery on all orders",
    image: "/images/hero/slide2.svg",
    cta: { text: "Order Online", href: "/menu" },
  },
  {
    id: 3,
    title: "Family Meal Deal",
    description: "Feed the whole family for less",
    image: "/images/hero/slide3.svg",
    cta: { text: "View Deals", href: "/menu" },
  },
];
