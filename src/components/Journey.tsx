"use client";

import { useRef } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { SplitReveal } from "@/components/fx/Reveal";
import { EASE } from "@/lib/motion";

const STORIES = [
  {
    id: "beantree",
    title: "Beantree Foods",
    subtitle: "2017 – 2023",
    role: "Co-Founder & Strategy Lead",
    industry: "FMCG / Brand Architecture",
    content: [
      "Built an FMCG brand from zero. Strategy creates the vision. Execution over theory.",
      "Beantree Foods was a masterclass in raw commercial gravity. What began as a product thesis quickly evolved into an exercise in scaling complex distribution logistics, margin optimization, and brand equity in a hyper-competitive landscape.",
      "Building the brand required full-stack execution. This meant establishing product manufacturing pipelines, engineering packaging psychology designed for immediate shelf-impact, and aggressively mapping supply chains to optimize velocity.",
      "We scaled to ₹1.5 Cr+ revenue in 18 months across 150+ A-category retail outlets in Delhi, Punjab, Uttar Pradesh, Rajasthan and Jammu — and grew the range from 20 to 30 SKUs through continuous product innovation.",
      "I built and led a 35+ member sales organisation with area and regional manager layers, designed the distributor model and territory targets, and cut procurement cost ~20% through vendor negotiation and process standardisation.",
      "The greatest lesson was not in making the product—it was in architecting the distributor operating model to ensure the product survived the shelf. Strategy is meaningless if the unit economics fail at the cashier."
    ],
  },
  {
    id: "kk-store",
    title: "KK Store",
    role: "Operator",
    industry: "Retail Commerce",
    content: [
      "A retail laboratory where customers vote with their feet.",
      "Retail is brutally honest. Customers validate your hypothesis instantly with their capital. Operating KK Store provided a real-world, high-stakes environment to understand the granular realities of physical commerce.",
      "It served as an intensive laboratory for pricing psychology, inventory dynamics, supplier trust paradigms, and working capital discipline. I learned to manage high-frequency margin adjustments and optimize retail footprint yield.",
      "The central takeaway: A beautiful strategy document is irrelevant if operational execution falters. Operations determine survival."
    ],
  },
  {
    id: "bite-me",
    title: "Bite Me",
    subtitle: "2023 – 2025 · CEO's Office",
    role: "Entrepreneur in Residence — Brand Launch",
    industry: "Food & Beverage",
    content: [
      "An F&B brand built and launched end to end from the CEO's office of a hospitality group — concept, positioning, menu design, pricing and launch.",
      "Instead of building a traditional restaurant with fixed, heavy overhead, Bite Me was designed as an experiment in experiential leverage. We utilized asset-light operations to craft ephemeral, high-impact dining events.",
      "These events sold exclusivity, community engineering, and narrative. It proved that modern brand equity isn’t just about having a physical product—it’s about architecting moments that people actively want to align their own identities with."
    ],
  },
  {
    id: "supper-club",
    title: "The Supper Club",
    subtitle: "2023 – 2025 · CEO's Office",
    role: "Entrepreneur in Residence — Brand Launch",
    industry: "Food & Beverage",
    content: [
      "A private dining format focused on curated culinary gatherings and community experiences.",
      "The Supper Club stripped away the noise of commercial dining to focus purely on the sociology of the table. By curating not just the menu but the guest list, it became an exercise in intentional network design.",
      "It demonstrated how premium positioning and extreme curation can command outsized brand loyalty and pricing power."
    ],
  },
  {
    id: "bodega",
    title: "The Back Alley Bodega",
    subtitle: "2023 – 2025 · CEO's Office",
    role: "Entrepreneur in Residence — Apparel Line",
    industry: "Apparel & Lifestyle",
    content: [
      "An apparel and lifestyle line exploring neighbourhood culture as identity and curated discovery.",
      "The Bodega was conceptualized as an anti-transactional space. We treated a retail footprint not as a mere checkout line, but as an active, curated neighborhood hub designed for cultural discovery.",
      "Developing this required deep mapping of urban consumer behaviour, lifestyle adjacencies, and the mechanics of engineering cultural relevance.",
      "Across this CEO's-office portfolio I owned market entry and go-to-market end to end — one initiative reached 4,000+ monthly active users in two months across 15+ offline locations and ₹1 Cr in new revenue — and drove the annual operating plan to ~80% of target."
    ],
  },
  {
    id: "rodic",
    title: "Rodic Consultants",
    subtitle: "2025 – now · Chief of Staff Cell",
    role: "Senior Program Manager — Strategy & Transformation",
    industry: "Enterprise Strategy",
    content: [
      "Working inside the Chief of Staff cell to architect enterprise-scale transformation.",
      "Rodic engineers master infrastructure at national scale. Operating within the executive suite, my mandate involved driving firm-wide strategic initiatives and transformation across multiple complex business units.",
      "This was an intensive exercise in complex systems engineering. I designed enterprise operating models, structured stringent governance and execution frameworks, and rapidly built AI-driven decision-support nerve centers.",
      "Growth: partnered with business-unit and central BD teams on strategic planning that built a ₹1,200 Cr order-book pipeline across 5 business units, converting ₹400 Cr into won mandates. Structured a geospatial-analytics joint venture and a board-level international market-entry strategy.",
      "Digital & AI: core team for an enterprise digital platform for 2,500+ employees (ticketing, HR workflows, recruitment, timesheets, approvals), and author of the firm's AI Deployment & Integration Framework and 2025–28 digital roadmap.",
      "Key Outcome: I architected and deployed enterprise analytics and MIS systems that cut executive decision-turnaround time by ~40% across 200+ senior stakeholders, with governance cadences improving cross-functional response times ~30%.",
      "Furthermore, I designed cross-functional KPI frameworks linking HR, talent acquisition, and operational delivery—ensuring high-level strategy cascaded into measurable, transparent outcomes."
    ],
  }
];

import { useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function StoryCard({ story, isFirst }: { story: any; isFirst: boolean }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.9, ease: EASE }}
      id={`story-${story.id}`}
      className={`scroll-mt-24 py-24 grid lg:grid-cols-12 gap-12 ${isFirst ? 'pt-0' : ''}`}
    >
      {/* Left Column: Title & Metadata & Logo */}
      <div className="lg:col-span-5 lg:sticky lg:top-32 lg:self-start">
        {story.subtitle && (
          <p className="text-sm font-mono text-white/50 uppercase tracking-[0.3em] mb-4">
            {story.subtitle}
          </p>
        )}

        <SplitReveal
          parts={[story.title]}
          className={`font-light text-white tracking-tight leading-tight mb-6 drop-shadow-lg ${isFirst ? 'text-5xl md:text-7xl' : 'text-4xl md:text-5xl'}`}
        />
        
        {(story.role || story.industry) && (
          <div className="space-y-4 mb-8">
            {story.role && (
              <div className="flex items-center gap-3">
                <div className="w-1 h-1 bg-white/40 rounded-full" />
                <p className="text-white/60 font-medium tracking-wide">{story.role}</p>
              </div>
            )}
            {story.industry && (
              <div className="flex items-center gap-3">
                <div className="w-1 h-1 bg-white/40 rounded-full" />
                <p className="text-white/40">{story.industry}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Column: Narrative Content & Skills */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* Always visible overview (First Paragraph) */}
        <div className="text-lg md:text-xl text-white/90 font-light leading-relaxed whitespace-pre-line">
          {story.content[0]}
        </div>

        {/* Expandable Content */}
        {story.content.length > 1 && (
          <div className="pt-4">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              className="group inline-flex items-center gap-3 text-sm font-mono tracking-widest uppercase text-amber-500/80 hover:text-amber-400 transition-colors border-b border-amber-500/30 pb-1"
            >
              {isOpen ? "Read Less" : "Discover the Full Story"}
              <motion.span animate={{ rotate: isOpen ? 45 : 0 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} className="inline-block text-base leading-none">+</motion.span>
            </button>

            <AnimatePresence initial={false}>
            {isOpen && (
              <motion.div 
                key="more"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1, transition: { height: { type: "spring", stiffness: 120, damping: 22 }, opacity: { duration: 0.5, delay: 0.1 } } }}
                exit={{ height: 0, opacity: 0, transition: { height: { duration: 0.45, ease: EASE }, opacity: { duration: 0.2 } } }}
                className="space-y-8 overflow-hidden"
              >
                <div className="h-8" />
                {/* Remaining Paragraphs */}
                {story.content.slice(1).map((paragraph: string, idx: number) => (
                  <div key={idx} className="text-lg md:text-xl text-white/60 font-light leading-relaxed whitespace-pre-line">
                    {paragraph}
                  </div>
                ))}

                {/* Skills Section */}
                {story.skills && (
                  <div className="mt-12 pt-8 border-t border-white/5">
                    <p className="text-xs font-mono text-white/30 uppercase tracking-[0.2em] mb-6">
                      Key Skills Developed
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {story.skills.map((skill: string) => (
                        <span key={skill} className="px-3 py-1.5 border border-white/10 bg-white/[0.02] text-white/60 text-xs tracking-wider rounded-md hover:bg-white/10 hover:text-white transition-colors cursor-default">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
            </AnimatePresence>
          </div>
        )}

      </div>
    </motion.div>
  );
}

export default function Journey() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.6", "end 0.6"] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <section id="journey" ref={ref} className="relative py-24 bg-slate-950 px-6 md:px-12 lg:px-24">
      {/* Progress rail */}
      <div aria-hidden className="hidden md:block absolute left-6 lg:left-12 top-24 bottom-24 w-px bg-white/[0.07]">
        <motion.div style={{ scaleY: fill }} className="absolute inset-0 origin-top bg-gradient-to-b from-amber-500/0 via-amber-500/70 to-amber-300" />
      </div>
      <div className="max-w-6xl mx-auto divide-y divide-white/10">
        {STORIES.map((story, i) => (
          <StoryCard key={story.id} story={story} isFirst={i === 0} />
        ))}
      </div>
    </section>
  );
}
