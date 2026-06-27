import { Hero } from "../src/components/home/hero";
import { Categories } from "../src/components/home/categories";
import { FeaturedProducts } from "../src/components/home/featured-products";
import { Offers } from "../src/components/home/offers";
import { BestSellers } from "../src/components/home/best-sellers";

export default function Page() {
  return (
    <>
      <Hero />
      <Categories />
      <FeaturedProducts />
      <Offers />
      <BestSellers />
    </>
  );
}