import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SearchForm from "@/components/search/SearchForm";
import Accordion from "@/components/ui/Accordion";
import PromoCard from "@/components/ui/PromoCard";
import { Bed, Car, Globe, ChevronRight, ChevronDown, Home as HomeIcon } from "lucide-react";

const faqItems = [
  {
    question: "How does Skyscanner work?",
    answer:
      "We search and compare flights from hundreds of airlines and travel agents, showing you exactly where to buy the cheapest flight tickets.",
  },
  {
    question: "How can I find the cheapest flight using Skyscanner?",
    answer:
      "Use our flexible date search to find the cheapest days to fly, and set up price alerts to get notified when prices change.",
  },
  {
    question: "Where should I book a flight to right now?",
    answer:
      "Use our 'Everywhere' search to discover destinations within your budget. Find inspiration for your next trip.",
  },
  {
    question: "Do I book my flight with Skyscanner?",
    answer:
      "We're a search engine, so we don't sell tickets. When you find your flight, we link you through to the airline or travel agent to complete your booking.",
  },
  {
    question: "What happens after I have booked my flight?",
    answer:
      "Your booking is with the airline or travel agent, not with us. They'll send you confirmation and any updates about your flight.",
  },
  {
    question: "Does Skyscanner do hotels too?",
    answer:
      "Yes! We compare hotel prices from hundreds of booking sites, so you can find the best deal for your accommodation.",
  },
  {
    question: "What about car hire?",
    answer:
      "We compare car hire prices from the biggest rental companies like Hertz, Avis, and Enterprise, plus local providers.",
  },
  {
    question: "What's a Price Alert?",
    answer:
      "Set up a Price Alert and we'll email you when prices change for your chosen route. It's a great way to track deals.",
  },
  {
    question: "Can I book a flexible flight ticket?",
    answer:
      "Many airlines offer flexible tickets. Use our filters to find flights with free cancellation or change options.",
  },
  {
    question: "Can I book flights that emit less CO₂?",
    answer:
      "Yes, we show the estimated CO₂ emissions for each flight, so you can make more sustainable travel choices.",
  },
];

const adventureLinks = [
  { title: "Cheap tickets to Dubai", href: "#" },
  { title: "Cheap car hire in Jammu and Kashmir", href: "#" },
  { title: "Car hire in Maharashtra", href: "#" },
  { title: "Cheap flights to Lizo", href: "#" },
  { title: "Cheap car hire in Dubai", href: "#" },
  { title: "Car hire in Karnataka", href: "#" },
  { title: "Flights to Coimbatore", href: "#" },
  { title: "Car hire in West Benge", href: "#" },
  { title: "Cheap car hire in Delhi NCR", href: "#" },
];

const adventureTabs = ["Region", "Country", "Airport", "City"];

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-[#05203c] pt-8 pb-8 md:pt-10 md:pb-10">
        <div className="max-w-[1200px] mx-auto px-4">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6 md:mb-8">
            Millions of cheap flights. One simple search.
          </h1>
          <SearchForm />
        </div>
      </section>

      {/* Promo Cards Section */}
      <section className="py-8 md:py-10">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <PromoCard
              icon={Bed}
              title="Hotels"
              color="#05203c"
            />
            <PromoCard
              icon={Car}
              title="Car hire"
              color="#05203c"
            />
            <PromoCard
              icon={Globe}
              title="Explore everywhere"
              color="#05203c"
            />
          </div>
        </div>
      </section>

      {/* Hotel Banner Section with Hero Image */}
      <section className="py-6 md:py-8">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="relative rounded-2xl overflow-hidden min-h-[420px] md:min-h-[500px]">
            {/* Background Image */}
            <Image
              src="/heroimage.jpg"
              alt="Hotel promo - Save on your next stay"
              fill
              className="object-cover"
              priority
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#05203c]/90 via-[#05203c]/60 to-transparent" />

            {/* Content */}
            <div className="relative z-10 p-8 md:p-12 flex flex-col justify-center h-full min-h-[420px] md:min-h-[500px]">
              <div className="max-w-md">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
                  Save on your<br />next stay
                </h2>
                <p className="text-white/80 text-base mb-6">
                  Get together with the best hand-picked deals<br />
                  from around the world
                </p>
                <button className="px-5 py-3 bg-white text-[#161616] rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2 text-sm">
                  Find your room
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-10 md:py-12">
        <div className="max-w-[1200px] mx-auto px-4">
          <h2 className="text-xl md:text-2xl font-bold text-[#161616] mb-6">
            Booking flights with Skyscanner
          </h2>
          <Accordion items={faqItems} columns={2} />
        </div>
      </section>

      {/* International Sites Section */}
      <section className="py-8 border-t border-gray-200">
        <div className="max-w-[1200px] mx-auto px-4">
          <button className="flex items-center gap-2 text-lg font-bold text-[#161616] mb-4">
            Our international sites
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Adventure Planning Section */}
      <section className="py-8 md:py-10 border-t border-gray-200">
        <div className="max-w-[1200px] mx-auto px-4">
          <h2 className="text-xl md:text-2xl font-bold text-[#161616] mb-5">
            Start planning your adventure
          </h2>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {adventureTabs.map((tab, index) => (
              <button
                key={tab}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${index === 0
                  ? "bg-[#05203c] text-white"
                  : "bg-white text-[#161616] border border-gray-200 hover:bg-gray-50"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-3">
            {adventureLinks.map((link) => (
              <a
                key={link.title}
                href={link.href}
                className="text-sm text-[#0770e3] hover:underline flex items-center justify-between py-1"
              >
                <span>{link.title}</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            ))}
          </div>

          {/* Pagination dots */}
          <div className="flex justify-center gap-2 mt-8">
            {[0, 1, 2, 3].map((dot) => (
              <div
                key={dot}
                className={`w-2 h-2 rounded-full ${dot === 0 ? "bg-[#05203c]" : "bg-gray-300"
                  }`}
              />
            ))}
          </div>

          {/* Navigation Arrow */}
          <div className="flex justify-end mt-4">
            <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
              <ChevronRight className="w-5 h-5 text-[#161616]" />
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
