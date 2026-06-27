import { Section } from "../layout/section";
import { Container } from "../layout/container";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export function Hero() {
  return (
    <Section padding="lg" background="white">
      <Container>
        <div className="flex flex-col items-center text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            Fresh Food Delivered Fast
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-gray-600">
            Quality ingredients delivered to your doorstep. Fresh, fast, and reliable.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button size="lg">Order Now</Button>
            <Button variant="outline" size="lg">Browse Menu</Button>
          </div>
          <div className="mt-8 w-full max-w-2xl">
            <div className="hidden sm:flex gap-2">
              <Input placeholder="Search for biryani, pizza, burgers..." className="flex-1" />
              <Button>Search</Button>
            </div>
            <div className="flex sm:hidden flex-col gap-2">
              <Input placeholder="Search for biryani, pizza, burgers..." />
              <Button className="w-full">Search</Button>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
