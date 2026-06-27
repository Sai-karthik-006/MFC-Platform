import { Section } from '../layout/section';
import { Container } from '../layout/container';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

const offers = [
  {
    title: "20% OFF First Order",
    subtitle: "Use code WELCOME20",
    cta: "Order Now",
    gradient: "from-orange-500 to-amber-600",
  },
  {
    title: "Free Delivery",
    subtitle: "On orders above ₹499",
    cta: "Explore Menu",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    title: "Weekend Combo Deals",
    subtitle: "Save up to ₹299",
    cta: "View Offers",
    gradient: "from-violet-500 to-purple-600",
  },
];

export function Offers() {
  return (
    <Section padding="lg" background="muted">
      <Container>
        <div className="mb-8 text-center sm:text-left">
          <h2 className="text-2xl font-bold text-gray-900">
            Special Offers
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Grab these limited-time deals
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {offers.map((offer) => (
            <Card
              key={offer.title}
              className={[
                "overflow-hidden border-0 bg-white shadow-md",
                "transition-all duration-300",
                "hover:shadow-2xl hover:-translate-y-1",
              ].join(" ")}
            >
              <div
                className={[
                  "bg-gradient-to-br p-6",
                  offer.gradient,
                ].join(" ")}
              >
                <h3 className="text-lg font-bold text-white">
                  {offer.title}
                </h3>
              </div>
              <div className="flex flex-col gap-4 p-5">
                <p className="text-sm text-gray-600">{offer.subtitle}</p>
                <Button variant="primary" size="sm" className="w-full">
                  {offer.cta}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
