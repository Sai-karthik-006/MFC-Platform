import { Section } from "../layout/section";
import { Container } from "../layout/container";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";

export function Hero() {
  return (
    <Section padding="lg" className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-purple-200/30 blur-3xl" />
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
          <div className="mt-12 grid w-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-gray-900">10K+</div>
                <div className="text-sm text-gray-600">Orders Delivered</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-gray-900">30+</div>
                <div className="text-sm text-gray-600">Menu Items</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-gray-900">Fresh</div>
                <div className="text-sm text-gray-600">Every Day</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </Section>
  );
}
