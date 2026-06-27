import { Hero } from "../src/components/home/hero";
import { Categories } from "../src/components/home/categories";
import { FeaturedProducts } from "../src/components/home/featured-products";

export default function Page() {
  return (
    <>
      <Hero />
      <Categories />
      <FeaturedProducts />
    </>
  );
}