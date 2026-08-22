import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { ContactForm } from '@/components/forms/ContactForm';
import { getSiteSettings } from '@/lib/settings';
import { WhatsAppIcon } from '@/components/ui/icons/WhatsAppIcon';
import { Mail, MapPin, Clock, ExternalLink } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Contact Us | Skill to Leadership',
  description: 'Get in touch with the Skill to Leadership team in Yaoundé, Cameroon via WhatsApp or Email for program inquiries, partnerships, or donations.',
};

export default async function ContactPage() {
  const settings = await getSiteSettings();

  const email = settings.contact_email || 'fonyechris@gmail.com';
  const whatsapp = settings.contact_whatsapp || '+237 668 62 06 75';
  const whatsappLink = settings.contact_whatsapp_link || `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`;
  const location = settings.contact_location || 'Yaoundé, Centre Region, Cameroon';
  const workingHours = settings.contact_working_hours || 'Monday – Friday: 8:30 AM – 5:30 PM WAT';

  return (
    <div className="space-y-20 py-12 lg:py-20 bg-cream-canvas">
      
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <Badge variant="gold">Get in Touch</Badge>
          <h1 className="text-4xl sm:text-5xl font-black text-ink-900 tracking-tight font-display">
            We&apos;d Love to Hear from You
          </h1>
          <p className="text-lg text-neutral-muted leading-relaxed font-light">
            Have questions about upcoming cohorts, partnerships, volunteering, or donations? Reach out directly via WhatsApp or Email.
          </p>
        </div>
      </section>

      {/* Main Split */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Form */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

          {/* Details & Location Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-ink-900 text-white rounded-3xl p-8 space-y-6 shadow-elevated">
              <h2 className="text-xl font-bold uppercase tracking-widest text-gold font-display">
                Headquarters & Contacts
              </h2>

              <div className="space-y-5 text-xs">
                {/* Location */}
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold text-white block">Location</strong>
                    <span className="text-gray-300">{location}</span>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold text-white block">Email</strong>
                    <a
                      href={`mailto:${email}`}
                      className="text-gray-300 hover:text-gold transition-colors font-medium"
                    >
                      {email}
                    </a>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#25D366]/20 text-[#25D366] flex items-center justify-center shrink-0 mt-0.5">
                    <WhatsAppIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="font-bold text-white block">WhatsApp Contact</strong>
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#25D366] hover:text-[#25D366]/80 font-bold inline-flex items-center gap-1.5 transition-colors mt-0.5 group text-sm"
                    >
                      <span>{whatsapp}</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-80 group-hover:opacity-100 transition-opacity" />
                    </a>
                    <span className="block text-[11px] text-gray-400 mt-0.5">Click to chat directly on WhatsApp</span>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold text-white block">Working Hours</strong>
                    <span className="text-gray-300">{workingHours}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-gold-light font-light border-t border-white/10">
                For urgent fellowship inquiries, please mention your Application Reference Code in the message.
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
