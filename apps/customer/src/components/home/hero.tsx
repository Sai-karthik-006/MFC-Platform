import { Section } from "../layout/section";
import { Container } from "../layout/container";
import { Button } from "../ui/button";

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
        </div>
      </Container>
    </Section>
  );
}
