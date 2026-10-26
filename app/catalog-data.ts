export const materials = [
  {
    id: "oak",
    name: "Oak veneer",
    color: "#bd9463",
    note: "A light, expressive grain. Veneer over an engineered core.",
    extra: 0,
  },
  {
    id: "walnut",
    name: "Walnut veneer",
    color: "#715039",
    note: "Deep brown tones and a quiet, flowing grain. Engineered core.",
    extra: 2500,
  },
  {
    id: "ash",
    name: "Solid ash",
    color: "#dcc4a1",
    note: "A pale timber direction with a visible, open grain.",
    extra: 4000,
  },
  {
    id: "upholstery",
    name: "Woven upholstery",
    color: "#c5bba8",
    note: "A softly textured fabric direction. Composition confirmed by swatch.",
    extra: 0,
  },
] as const;
export const finishes = [
  { id: "natural", name: "Natural", color: "#c8a67b" },
  { id: "smoked", name: "Smoked", color: "#74513c" },
  { id: "espresso", name: "Espresso", color: "#3c2f27" },
  { id: "chalk", name: "Chalk", color: "#e6e0d4" },
  { id: "sand", name: "Sand", color: "#c5b59b" },
  { id: "olive", name: "Olive", color: "#777b61" },
] as const;
export type Product = {
  id: string;
  code: string;
  name: string;
  category: string;
  collection: string;
  price: number;
  image: string;
  alt: string;
  description: string;
  dimensions: string;
  materials: string[];
  finishes: string[];
  tag?: string;
};
export const products: Product[] = [
  {
    id: "forma-lounge",
    code: "SR-01",
    name: "Forma lounge chair",
    category: "Seating",
    collection: "The Soft Edit",
    price: 18500,
    image: "lounge",
    alt: "Sculptural cream lounge chair on a dark metal frame",
    description:
      "An open, sculptural silhouette for a quiet corner. A seating concept that balances a soft finish with a light frame.",
    dimensions: "72 W × 78 D × 76 H cm",
    materials: ["upholstery"],
    finishes: ["chalk", "sand", "olive"],
    tag: "The Soft Edit",
  },
  {
    id: "linea-cabinet",
    code: "SR-02",
    name: "Linea storage cabinet",
    category: "Storage",
    collection: "Natural Form",
    price: 24000,
    image: "cabinet",
    alt: "Pale wood two-door cabinet styled with a vase and artwork",
    description:
      "Simple lines. Useful space. A two-door storage direction for the everyday objects you want close, and the ones you prefer tucked away.",
    dimensions: "90 W × 42 D × 100 H cm",
    materials: ["oak", "walnut", "ash"],
    finishes: ["natural", "smoked", "espresso"],
    tag: "Custom sizes",
  },
  {
    id: "cross-coffee",
    code: "SR-03",
    name: "Cross coffee table",
    category: "Tables",
    collection: "Natural Form",
    price: 16500,
    image: "table",
    alt: "Dark wood coffee table with a crossed base in a light living room",
    description:
      "A strong architectural base and a generous surface. A starting point for the objects, conversations, and rituals of your living room.",
    dimensions: "110 W × 60 D × 40 H cm",
    materials: ["oak", "walnut", "ash"],
    finishes: ["natural", "smoked", "espresso"],
  },
  {
    id: "arc-cabinet",
    code: "SR-04",
    name: "Arc accent cabinet",
    category: "Storage",
    collection: "The Quiet Curve",
    price: 32000,
    image: "console",
    alt: "Rounded wood-front cabinet with black frame and four doors",
    description:
      "Rounded edges and a warm grain direction. A sculptural storage concept that gives an overlooked corner a little character.",
    dimensions: "100 W × 45 D × 120 H cm",
    materials: ["oak", "walnut"],
    finishes: ["natural", "smoked", "espresso"],
    tag: "The Quiet Curve",
  },
  {
    id: "spindle-chair",
    code: "SR-05",
    name: "Spindle dining chair",
    category: "Seating",
    collection: "Natural Form",
    price: 7800,
    image: "chair",
    alt: "Traditional wooden dining chair against a pale studio background",
    description:
      "An everyday dining chair concept with a familiar spindle back. A simple companion to long meals and unhurried mornings.",
    dimensions: "46 W × 50 D × 84 H cm",
    materials: ["ash"],
    finishes: ["natural", "smoked", "espresso"],
  },
  {
    id: "gather-table",
    code: "SR-06",
    name: "Gather dining table",
    category: "Tables",
    collection: "Natural Form",
    price: 28500,
    image: "dining",
    alt: "Rounded wooden dining table with matching chairs in a bright room",
    description:
      "Room to gather, with softly rounded ends. Explore a dining-table concept sized around the people and the space you have.",
    dimensions: "160 W × 90 D × 75 H cm",
    materials: ["oak", "walnut", "ash"],
    finishes: ["natural", "smoked", "espresso"],
    tag: "Custom sizes",
  },
  {
    id: "wall-study",
    code: "SR-07",
    name: "Wall study system",
    category: "Cabinetry",
    collection: "Spaces, Considered",
    price: 48000,
    image: "shelf",
    alt: "Wood shelving and an integrated desk along a bright wall",
    description:
      "Shelves, a work surface, and a more considered use of the wall. A cabinetry direction developed around your room, storage, and daily routine.",
    dimensions: "240 W × 45 D × 220 H cm",
    materials: ["oak", "walnut"],
    finishes: ["natural", "smoked", "chalk"],
    tag: "Made to measure",
  },
  {
    id: "hush-sofa",
    code: "SR-08",
    name: "Hush two-seat sofa",
    category: "Seating",
    collection: "The Soft Edit",
    price: 42000,
    image: "hero",
    alt: "Beige upholstered sofa beside a sunlit window and wooden table",
    description:
      "A soft place to land. An upholstered seating direction for compact living spaces, reading afternoons, and the end of the day.",
    dimensions: "170 W × 85 D × 78 H cm",
    materials: ["upholstery"],
    finishes: ["chalk", "sand", "olive"],
  },
];
export const categories = [
  "All pieces",
  "Seating",
  "Tables",
  "Storage",
  "Cabinetry",
];
export const collections = [
  "All collections",
  "Natural Form",
  "The Soft Edit",
  "The Quiet Curve",
  "Spaces, Considered",
];
export const money = (n: number) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(n);
export function estimate(id: string, material: string, quantity: number) {
  const p = products.find((p) => p.id === id);
  if (
    !p ||
    !p.materials.includes(material) ||
    !Number.isInteger(quantity) ||
    quantity < 1 ||
    quantity > 50
  )
    return null;
  return (
    (p.price +
      (materials.find((m) => m.id === material)?.extra || 0) -
      (materials.find((m) => m.id === p.materials[0])?.extra || 0)) *
    quantity
  );
}
export const budgets = [
  "Under ₱20,000",
  "₱20,000–₱50,000",
  "₱50,000–₱100,000",
  "₱100,000+",
  "To be discussed",
];
export const timelines = [
  "Within 1 month",
  "1–3 months",
  "3–6 months",
  "Flexible / exploring",
];
export const statuses = ["New", "Contacted", "Quoted", "Closed"];
