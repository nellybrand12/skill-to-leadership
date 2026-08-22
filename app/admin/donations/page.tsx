import React from 'react';
import Link from 'next/link';
import { getAdminSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { HeartHandshake, ExternalLink, ShieldAlert, Phone, CreditCard, Globe } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDonationsPage() {
  const session = getAdminSession();
  if (!session) redirect('/admin/login');

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-primary-navy">
          External Donation Channels & Financial Processing
        </h1>
        <p className="text-xs sm:text-sm text-neutral-muted">
          Skill to Leadership receives philanthropic support exclusively through external verified channels.
        </p>
      </div>

      <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-6 space-y-4 text-xs text-amber-900">
        <div className="flex items-center gap-2.5 font-bold text-amber-950 text-sm">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
          <span>External Processing Notice</span>
        </div>
        <p className="leading-relaxed">
          Donations made to Skill to Leadership are handled directly via external financial networks (<strong>MTN Mobile Money</strong>, <strong>Orange Money</strong>, and <strong>GoFundMe</strong>). Because transactions execute outside this web portal, this console does not generate synthetic payment confirmations or fake transaction ledgers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-neutral-border shadow-soft space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 font-bold">
            <Phone className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-primary-navy text-sm">MTN Mobile Money</h3>
          <p className="text-xs text-neutral-muted leading-relaxed">
            Direct mobile payments across Cameroon processed via authorized organization SIM accounts.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-neutral-border shadow-soft space-y-3">
          <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-800 font-bold">
            <CreditCard className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-primary-navy text-sm">Orange Money</h3>
          <p className="text-xs text-neutral-muted leading-relaxed">
            Direct domestic merchant transfers with in-person confirmation directly to the financial secretariat.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-neutral-border shadow-soft space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold">
            <Globe className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-primary-navy text-sm">GoFundMe</h3>
          <p className="text-xs text-neutral-muted leading-relaxed">
            International diaspora contributions with bank settlements managed through our fiscal sponsor account.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-neutral-border shadow-soft flex items-center justify-between">
        <div>
          <h4 className="font-bold text-primary-navy text-sm">Public Donation Guide</h4>
          <p className="text-xs text-neutral-muted">Review the instructions provided to prospective donors.</p>
        </div>
        <Link
          href="/donate"
          target="_blank"
          className="px-4 py-2 text-xs font-bold bg-primary-navy text-white rounded-button hover:bg-primary-navy-light transition-all flex items-center gap-1.5"
        >
          <span>View /donate Page</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
