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
          <h1 className="animate-fade-in text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl lg:text-6xl">
            Fresh Food Delivered Fast
          </h1>
          <p className="animate-fade-in animation-delay-100 mt-4 max-w-2xl text-base text-gray-600 sm:mt-6 sm:text-lg">
            Quality ingredients delivered to your doorstep. Fresh, fast, and reliable.
          </p>
          <div className="animate-fade-in animation-delay-200 mt-6 flex w-full flex-wrap justify-center gap-3 sm:mt-8 sm:gap-4">
            <Button size="lg" className="flex-1 sm:flex-initial sm:min-w-[140px]">Order Now</Button>
            <Button variant="outline" size="lg" className="flex-1 sm:flex-initial sm:min-w-[140px]">Browse Menu</Button>
          </div>
          <div className="animate-fade-in animation-delay-300 mt-6 w-full max-w-xl sm:mt-8 sm:max-w-2xl">
            <div className="hidden sm:flex gap-2">
              <Input placeholder="Search for biryani, pizza, burgers..." className="flex-1" />
              <Button>Search</Button>
            </div>
            <div className="flex flex-col gap-2 sm:hidden">
              <Input placeholder="Search for biryani, pizza, burgers..." />
              <Button className="w-full">Search</Button>
            </div>
          </div>
          <div className="animate-scale-in animation-delay-400 mt-8 grid w-full max-w-3xl grid-cols-1 gap-4 sm:mt-10 sm:gap-5 lg:grid-cols-3">
            <Card className="transition-hover hover:shadow-md">
              <CardContent className="px-4 py-5 text-center sm:px-6 sm:py-6">
                <div className="text-2xl font-bold text-gray-900 sm:text-3xl">10K+</div>
                <div className="mt-1 text-sm text-gray-600 sm:mt-2 sm:text-base">Orders Delivered</div>
              </CardContent>
            </Card>
            <Card className="transition-hover hover:shadow-md">
              <CardContent className="px-4 py-5 text-center sm:px-6 sm:py-6">
                <div className="text-2xl font-bold text-gray-900 sm:text-3xl">30+</div>
                <div className="mt-1 text-sm text-gray-600 sm:mt-2 sm:text-base">Menu Items</div>
              </CardContent>
            </Card>
            <Card className="transition-hover hover:shadow-md">
              <CardContent className="px-4 py-5 text-center sm:px-6 sm:py-6">
                <div className="text-2xl font-bold text-gray-900 sm:text-3xl">Fresh</div>
                <div className="mt-1 text-sm text-gray-600 sm:mt-2 sm:text-base">Every Day</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </Section>
  );
}
