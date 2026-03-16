"use client";

import { motion } from "framer-motion";

const STORIES = [
  {
    id: "beantree",
    title: "Beantree Foods",
    role: "Co-Founder & Operator",
    industry: "FMCG / Brand Architecture",
    content: [
      "Built an FMCG brand from zero. Strategy creates the vision. Execution over theory.",
      "Beantree Foods was a masterclass in raw commercial gravity. What began as a product thesis quickly evolved into an exercise in scaling complex distribution logistics, margin optimization, and brand equity in a hyper-competitive landscape.",
      "Building the brand required full-stack execution. This meant establishing product manufacturing pipelines, engineering packaging psychology designed for immediate shelf-impact, and aggressively mapping supply chains to optimize velocity.",
      "Under my operational leadership, we scaled the venture from concept to ₹10 Cr+ ARR. We successfully penetrated 450+ retail footprints across 8+ cities, systematically expanding our market share while maintaining strict unit economics.",
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
    role: "Experience Architect",
    industry: "Experiential Hospitality",
    content: [
      "An experiential hospitality brand built around curated dining events where atmosphere and storytelling become the product.",
      "Instead of building a traditional restaurant with fixed, heavy overhead, Bite Me was designed as an experiment in experiential leverage. We utilized asset-light operations to craft ephemeral, high-impact dining events.",
      "These events sold exclusivity, community engineering, and narrative. It proved that modern brand equity isn’t just about having a physical product—it’s about architecting moments that people actively want to align their own identities with."
    ],
  },
  {
    id: "supper-club",
    title: "The Supper Club",
    role: "Curator",
    industry: "Private Dining",
    content: [
      "A private dining format focused on curated culinary gatherings and community experiences.",
      "The Supper Club stripped away the noise of commercial dining to focus purely on the sociology of the table. By curating not just the menu but the guest list, it became an exercise in intentional network design.",
      "It demonstrated how premium positioning and extreme curation can command outsized brand loyalty and pricing power."
    ],
  },
  {
    id: "bodega",
    title: "The Back Alley Bodega",
    role: "Concept Architect",
    industry: "Cultural Retail",
    content: [
      "A lifestyle retail concept exploring neighbourhood retail as cultural identity and curated discovery.",
      "The Bodega was conceptualized as an anti-transactional space. We treated a retail footprint not as a mere checkout line, but as an active, curated neighborhood hub designed for cultural discovery.",
      "Developing this required deep mapping of urban consumer behaviour, lifestyle adjacencies, and the mechanics of engineering cultural relevance within physical spaces."
    ],
  },
  {
    id: "rodic",
    title: "Rodic Consultants",
    role: "Senior Program Manager — Strategy & Transformation",
    industry: "Enterprise Strategy",
    content: [
      "Working inside the Chief of Staff cell to architect enterprise-scale transformation.",
      "Rodic engineers master infrastructure at national scale. Operating within the executive suite, my mandate involved driving firm-wide strategic initiatives and transformation across multiple complex business units.",
      "This was an intensive exercise in complex systems engineering. I designed enterprise operating models, structured stringent governance and execution frameworks, and rapidly built AI-driven decision-support nerve centers.",
      "Key Outcome: I architected and deployed enterprise analytics and MIS systems that successfully collapsed executive decision-turnaround time by 40% across 200+ senior stakeholders.",
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
      transition={{ duration: 0.8 }}
      className={`py-24 grid lg:grid-cols-12 gap-12 ${isFirst ? 'pt-0' : ''}`}
    >
      {/* Left Column: Title & Metadata & Logo */}
      <div className="lg:col-span-5 lg:sticky lg:top-32 lg:self-start">
        {story.subtitle && (
          <p className="text-sm font-mono text-white/50 uppercase tracking-[0.3em] mb-4">
            {story.subtitle}
          </p>
        )}

        <h2 className={`font-light text-white tracking-tight leading-tight mb-6 drop-shadow-lg ${isFirst ? 'text-5xl md:text-7xl' : 'text-4xl md:text-5xl'}`}>
          {story.title}
        </h2>
        
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
              className="text-sm font-mono tracking-widest uppercase text-amber-500/80 hover:text-amber-400 transition-colors border-b border-amber-500/30 pb-1"
            >
              {isOpen ? "Read Less" : "Discover the Full Story +"}
            </button>

            {isOpen && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                className="mt-8 space-y-8 overflow-hidden"
              >
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
          </div>
        )}

      </div>
    </motion.div>
  );
}

export default function Journey() {
  return (
    <section id="journey" className="relative py-24 bg-slate-950 px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto divide-y divide-white/10">
        {STORIES.map((story, i) => (
          <StoryCard key={story.id} story={story} isFirst={i === 0} />
        ))}
      </div>
    </section>
  );
}
