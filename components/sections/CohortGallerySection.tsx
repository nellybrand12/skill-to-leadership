import React from 'react';
import Image from 'next/image';
import { db } from '@/lib/db';
import { cohortOneGallery } from '@/data/gallery';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { Camera, Sparkles } from 'lucide-react';

interface CohortGallerySectionProps {
  title?: string;
  subtitle?: string;
  showAll?: boolean;
}

export async function CohortGallerySection({
  title = 'Cohort 1 Archive',
  subtitle = 'A visual chronicle of learning, craftsmanship, mentorship, and celebration.',
}: CohortGallerySectionProps) {
  let dbItems: any[] = [];
  try {
    dbItems = await db.galleryItem.findMany({
      where: { published: true },
      orderBy: { orderIndex: 'asc' },
    });
  } catch (err) {
    console.error('Error fetching gallery items from DB:', err);
    dbItems = [];
  }

  const imagesToDisplay = dbItems.length > 0
    ? dbItems.map((item) => ({
        id: item.id,
        src: item.imageUrl,
        title: item.title,
        caption: item.description || '',
        category: item.category.replace('_', ' '),
        label: 'Fellowship Moment',
        objectPosition: 'object-center',
      }))
    : cohortOneGallery;

  return (
    <section className="py-16 lg:py-24 bg-cream-surface/70 relative overflow-hidden">
      {/* Soft Blurred Edge Vignettes */}
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-cream-canvas to-transparent pointer-events-none z-10" />
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-cream-canvas to-transparent pointer-events-none z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <ScrollReveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="max-w-2xl space-y-2.5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full liquid-glass-badge text-gold-900 text-xs font-bold uppercase tracking-wider shadow-soft">
                <Camera className="w-3.5 h-3.5 text-gold-700" />
                <span>Fellowship Visual Chronicle</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-ink-900 tracking-tight font-display">
                {title}
              </h2>
              <p className="text-neutral-muted text-base sm:text-lg leading-relaxed font-light">
                {subtitle}
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* Asymmetrical Left-Right Zig-Zag Layout */}
        <div className="space-y-10 lg:space-y-12">
          {imagesToDisplay.map((item, index) => {
            const isLeft = index % 2 === 0;
            return (
              <ScrollReveal key={item.id} delay={index * 50}>
                <div
                  className={`flex flex-col lg:flex-row items-center gap-8 ${
                    isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  }`}
                >
                  {/* Large Image Showcase */}
                  <div className="w-full lg:w-7/12 relative rounded-card-lg overflow-hidden bg-ink-900 shadow-soft h-72 sm:h-96">
                    <Image
                      src={item.src}
                      alt={item.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      className={`object-cover ${item.objectPosition || 'object-center'}`}
                    />

                    {/* Floating Category Pill */}
                    <div className="absolute top-4 left-4 liquid-glass-badge text-ink-900 text-xs font-bold px-3 py-1 rounded-full shadow-soft">
                      {item.category}
                    </div>
                  </div>

                  {/* Contextual Story / Archive Card */}
                  <div className="w-full lg:w-5/12 space-y-4 p-2 sm:p-4">
                    <div className="flex items-center gap-2 text-xs text-gold-700 font-bold uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5 text-gold-600" />
                      <span>{item.label}</span>
                      <span>•</span>
                      <span className="text-neutral-muted font-normal">{item.category}</span>
                    </div>

                    <h3 className="text-2xl font-bold text-ink-900 tracking-tight font-display">
                      {item.title}
                    </h3>

                    <p className="text-sm sm:text-base text-neutral-muted leading-relaxed font-light">
                      {item.caption}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

      </div>
    </section>
  );
}
