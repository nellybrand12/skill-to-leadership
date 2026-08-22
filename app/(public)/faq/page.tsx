import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { HelpCircle, Sparkles, MessageCircle, Heart, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'FAQ | Frequently Asked Questions | Skill to Leadership',
  description: 'Find answers to common questions about Skill to Leadership fellowships, Cohort 2, starter toolkits, and how to support.',
};

export default function FAQPage() {
  const faqs = [
    {
      q: 'What is Skill to Leadership?',
      a: 'Skill to Leadership is a non-profit youth empowerment initiative in Cameroon that equips young people with high-demand practical crafts, leadership development, moral mentorship, and micro-grant competition prizes to foster long-term self-reliance.',
    },
    {
      q: 'When does Cohort 2 launch?',
      a: 'Cohort 2 is officially Coming Soon. We are actively expanding curriculum capacity, partner sponsorships, and toolkits for an even larger cohort of young leaders across Cameroon.',
    },
    {
      q: 'What skills are taught in the fellowship?',
      a: 'The foundational disciplines include Braiding & Protective Hairstyling, Ceramic & Clay Sculpting, Digital Content Creation & Media, and Precision Nail Artistry & Studio Hygiene.',
    },
    {
      q: 'Do participants keep their tools?',
      a: 'Yes! Every fellow receives a complete professional starter kit during the training. Upon successful completion and exhibition at the Grand Finale, the toolkits remain with the fellows to launch their independent ventures.',
    },
    {
      q: 'What is the Entrepreneurs Spotlight?',
      a: 'Entrepreneurs Spotlight is an active initiative designed to discover, promote, and celebrate young entrepreneurs under 25 who are building passionate small businesses. 10 entrepreneurs will be selected, 5 stories featured, and 1 winner awarded 100,000 FCFA.',
    },
    {
      q: 'How can I support or donate?',
      a: 'You can support Cohort 2 directly via MTN Mobile Money (+237 673 67 64 61), Orange Money (+237 641 43 66 06), or internationally through our GoFundMe campaign. 100% of donations directly fund toolkits and competition seed grants.',
    },
  ];

  return (
    <div className="space-y-24 py-12 lg:py-20 bg-cream-canvas">
      
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-light text-gold-900 text-xs font-bold uppercase tracking-wider shadow-soft">
            <HelpCircle className="w-3.5 h-3.5 text-gold-700" />
            <span>Got Questions?</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-ink-900 tracking-tight font-display">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-neutral-muted leading-relaxed font-light">
            Everything you need to know about Skill to Leadership, our programs, and ways to get involved.
          </p>
        </div>
      </section>

      {/* FAQ Grid (No Hard Borders) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-card-lg p-6 sm:p-8 shadow-soft hover:shadow-elevated transition-all space-y-3"
            >
              <h3 className="text-lg sm:text-xl font-bold text-ink-900 flex items-start gap-3 font-display">
                <span className="text-gold-700 font-mono font-black text-sm pt-0.5">Q{index + 1}.</span>
                <span>{faq.q}</span>
              </h3>
              <p className="text-sm sm:text-base text-neutral-muted leading-relaxed pl-7 font-light">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Direct Contact & Donation Callouts */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-ink-900 rounded-3xl p-8 sm:p-10 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-elevated">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-xl font-bold font-display">Have another question?</h3>
            <p className="text-xs sm:text-sm text-gray-300 font-light">
              Our team in Yaoundé is happy to help. Send us an inquiry anytime.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Button href="/contact" variant="gold" size="md" className="liquid-glass-button">
              Contact Us
            </Button>
            <Button href="/donate" variant="outline" size="md" className="bg-white/10 text-white hover:bg-white/20">
              Donate
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}
