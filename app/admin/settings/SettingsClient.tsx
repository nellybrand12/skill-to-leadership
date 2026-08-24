'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { defaultSettings } from '@/data/siteSettingsDefaults';
import { WhatsAppIcon } from '@/components/ui/icons/WhatsAppIcon';
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Clock,
  Share2,
  BookOpen,
  Lock,
  KeyRound,
  User,
  Upload,
  Layers,
  Sparkles,
  Scissors,
  Compass,
  Users,
  Award,
  Book,
  Trophy,
  Heart,
  Globe,
  Lightbulb,
  ShieldCheck,
  Target,
  GraduationCap,
  Wrench,
  Palette,
  Video,
} from 'lucide-react';

const AVAILABLE_ICONS = [
  { name: 'Scissors', label: 'Scissors / Hairstyling', icon: Scissors },
  { name: 'Compass', label: 'Compass / Guidance', icon: Compass },
  { name: 'Users', label: 'Users / Community', icon: Users },
  { name: 'Wrench', label: 'Wrench / Technical Craft', icon: Wrench },
  { name: 'Lightbulb', label: 'Lightbulb / Innovation', icon: Lightbulb },
  { name: 'Target', label: 'Target / Goal', icon: Target },
  { name: 'Trophy', label: 'Trophy / Achievement', icon: Trophy },
  { name: 'Award', label: 'Award / Leadership', icon: Award },
  { name: 'GraduationCap', label: 'Graduation / Mastery', icon: GraduationCap },
  { name: 'Heart', label: 'Heart / Support', icon: Heart },
  { name: 'Globe', label: 'Globe / Network', icon: Globe },
  { name: 'Book', label: 'Book / Education', icon: Book },
  { name: 'Palette', label: 'Palette / Artistry', icon: Palette },
  { name: 'Video', label: 'Video / Media', icon: Video },
  { name: 'ShieldCheck', label: 'Shield / Excellence', icon: ShieldCheck },
  { name: 'Sparkles', label: 'Sparkles / Inspiration', icon: Sparkles },
];

export function SettingsClient({
  initialSettings,
}: {
  initialSettings: any[];
}) {
  const router = useRouter();

  // 1. Settings Map State
  const [settings, setSettings] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = { ...defaultSettings };
    initialSettings.forEach((item) => {
      if (item.value !== undefined && item.value !== null && item.value.trim() !== '') {
        map[item.key] = item.value;
      }
    });
    // Migrate old contact_phone key if present
    if (map['contact_phone'] && !map['contact_whatsapp']) {
      map['contact_whatsapp'] = map['contact_phone'];
    }
    return map;
  });

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // 2. Founder Image Upload State
  const [uploadingFounderImage, setUploadingFounderImage] = useState(false);
  const [founderImageMessage, setFounderImageMessage] = useState('');

  // 3. Password Change State
  const [passwordForm, setPasswordForm] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => {
      const updated = { ...prev, [key]: value };
      // Auto-update whatsapp link when whatsapp number changes
      if (key === 'contact_whatsapp' && value) {
        const cleanNumber = value.replace(/[^0-9]/g, '');
        if (cleanNumber) {
          updated['contact_whatsapp_link'] = `https://wa.me/${cleanNumber}`;
        }
      }
      return updated;
    });
  };

  const handleFounderImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFounderImage(true);
    setFounderImageMessage('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'founder');

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        handleChange('founder_image', data.url);
        setFounderImageMessage('New founder image uploaded! Click "Save All Settings" below to publish.');
      } else {
        setError(data.error || 'Failed to upload founder image.');
      }
    } catch {
      setError('Network error while uploading founder image.');
    } finally {
      setUploadingFounderImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');
    setError('');

    const payload = Object.entries(settings).map(([key, value]) => ({
      key,
      value: value as string,
    }));

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: payload }),
      });

      if (res.ok) {
        setMessage('Settings successfully saved to Supabase and immediately active on the public website!');
        router.refresh();
        setTimeout(() => setMessage(''), 5000);
      } else {
        setError('Failed to update settings. Please check database connection.');
      }
    } catch {
      setError('Network error while saving settings.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage('');
    setPasswordError('');

    if (!passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError('Please enter and confirm your new password.');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Passwords do not match. Please verify and try again.');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await fetch('/api/admin/auth/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(passwordForm),
      });

      const data = await res.json();
      if (res.ok) {
        setPasswordMessage(data.message || 'Password successfully updated!');
        setPasswordForm({ newPassword: '', confirmPassword: '' });
        setTimeout(() => setPasswordMessage(''), 5000);
      } else {
        setPasswordError(data.error || 'Failed to update password.');
      }
    } catch {
      setPasswordError('Network error while updating password.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="space-y-10 max-w-4xl">
      {/* 1. Global Settings Form */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-border shadow-soft space-y-10">
        
        {/* Group A: Founder Media & Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-primary-navy font-bold text-sm uppercase tracking-wider pb-2 border-b border-neutral-border">
            <User className="w-4 h-4 text-gold-600" />
            <h2>Founder Profile & Image (Public Website)</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
            {/* Founder Image Preview & Uploader */}
            <div className="sm:col-span-4 space-y-3">
              <label className="block text-xs font-bold text-primary-navy">Founder Portrait Image</label>
              <div className="relative w-full h-56 rounded-2xl overflow-hidden bg-ink-950 border border-neutral-border shadow-soft">
                <Image
                  src={settings['founder_image'] || '/images/Founder.jpg'}
                  alt="Founder Preview"
                  fill
                  className="object-cover object-top"
                />
              </div>

              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFounderImageUpload}
                  disabled={uploadingFounderImage}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  isLoading={uploadingFounderImage}
                  leftIcon={<Upload className="w-3.5 h-3.5" />}
                  className="w-full justify-center text-xs"
                >
                  {uploadingFounderImage ? 'Uploading Image...' : 'Replace Founder Image'}
                </Button>
              </div>
              <span className="text-[10px] text-neutral-muted block">
                JPG, PNG, or WebP. The previous uploaded image is safely removed from storage upon replacement.
              </span>
              {founderImageMessage && (
                <div className="text-[11px] text-emerald-700 font-semibold">{founderImageMessage}</div>
              )}
            </div>

            {/* Founder Text Details */}
            <div className="sm:col-span-8 space-y-4">
              <div>
                <label className="block text-xs font-bold text-primary-navy mb-1">Founder Name</label>
                <input
                  type="text"
                  value={settings['founder_name'] || 'Christopher Fonye'}
                  onChange={(e) => handleChange('founder_name', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-neutral-border text-xs focus:ring-2 focus:ring-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-primary-navy mb-1">Founder Title & Credentials</label>
                <input
                  type="text"
                  value={settings['founder_title'] || 'Civil Engineering Student at Bucknell University · Ashinaga Scholar · Projects for Peace grantee · Founder, Skill to Leadership'}
                  onChange={(e) => handleChange('founder_title', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-neutral-border text-xs focus:ring-2 focus:ring-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-primary-navy mb-1">Founder Quote</label>
                <textarea
                  rows={2}
                  value={settings['founder_quote'] || 'In a world where time is a luxury, "Youths" are the wealthiest'}
                  onChange={(e) => handleChange('founder_quote', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-neutral-border text-xs focus:ring-2 focus:ring-gold"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Group B: Contact Information (WhatsApp & Email) */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-primary-navy font-bold text-sm uppercase tracking-wider pb-2 border-b border-neutral-border">
            <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
            <h2>Official Contact Information & WhatsApp</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-primary-navy mb-1">Official Contact Email</label>
              <input
                type="email"
                required
                value={settings['contact_email'] || 'fonyechris@gmail.com'}
                onChange={(e) => handleChange('contact_email', e.target.value)}
                placeholder="fonyechris@gmail.com"
                className="w-full px-3.5 py-2 rounded-lg border border-neutral-border text-xs focus:ring-2 focus:ring-gold"
              />
              <span className="text-[10px] text-neutral-muted">Displayed on contact page and footer.</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-primary-navy mb-1">Contact WhatsApp Number</label>
              <input
                type="text"
                required
                value={settings['contact_whatsapp'] || '+237 668 62 06 75'}
                onChange={(e) => handleChange('contact_whatsapp', e.target.value)}
                placeholder="+237 668 62 06 75"
                className="w-full px-3.5 py-2 rounded-lg border border-neutral-border text-xs focus:ring-2 focus:ring-gold"
              />
              <span className="text-[10px] text-neutral-muted">Format: +237 668 62 06 75</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-primary-navy mb-1">
              WhatsApp Direct Click URL (Opens WhatsApp Chat)
            </label>
            <input
              type="url"
              required
              value={settings['contact_whatsapp_link'] || 'https://wa.me/237668620675'}
              onChange={(e) => handleChange('contact_whatsapp_link', e.target.value)}
              placeholder="https://wa.me/237668620675"
              className="w-full px-3.5 py-2 rounded-lg border border-neutral-border text-xs font-mono focus:ring-2 focus:ring-gold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-primary-navy mb-1">Physical Location</label>
              <input
                type="text"
                value={settings['contact_location'] || 'Yaoundé, Centre Region, Cameroon'}
                onChange={(e) => handleChange('contact_location', e.target.value)}
                placeholder="Yaoundé, Centre Region, Cameroon"
                className="w-full px-3.5 py-2 rounded-lg border border-neutral-border text-xs focus:ring-2 focus:ring-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-primary-navy mb-1">Working Hours</label>
              <input
                type="text"
                value={settings['contact_working_hours'] || 'Monday – Friday: 8:30 AM – 5:30 PM WAT'}
                onChange={(e) => handleChange('contact_working_hours', e.target.value)}
                placeholder="Monday – Friday: 8:30 AM – 5:30 PM WAT"
                className="w-full px-3.5 py-2 rounded-lg border border-neutral-border text-xs focus:ring-2 focus:ring-gold"
              />
            </div>
          </div>
        </div>

        {/* Group D: Hero Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-primary-navy font-bold text-sm uppercase tracking-wider pb-2 border-b border-neutral-border">
            <Sparkles className="w-4 h-4 text-gold-600" />
            <h2>Homepage Hero Messaging</h2>
          </div>

          <div>
            <label className="block text-xs font-bold text-primary-navy mb-1">Hero Heading</label>
            <input
              type="text"
              value={settings['hero_heading'] || 'TURNING SKILLS INTO LEADERSHIP'}
              onChange={(e) => handleChange('hero_heading', e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg border border-neutral-border text-xs focus:ring-2 focus:ring-gold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-primary-navy mb-1">Hero Subtitle / Mission</label>
            <textarea
              rows={3}
              value={settings['hero_subtext'] || 'An experiential youth development non-profit empowering young changemakers in Cameroon with hands-on craft mastery, mentorship, starter toolkits, and seed prize capital.'}
              onChange={(e) => handleChange('hero_subtext', e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg border border-neutral-border text-xs focus:ring-2 focus:ring-gold"
            />
          </div>
        </div>

        {/* Group E: Countdown & Cohort 2 */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-primary-navy font-bold text-sm uppercase tracking-wider pb-2 border-b border-neutral-border">
            <Clock className="w-4 h-4 text-gold-600" />
            <h2>Cohort 2 & Countdown Configuration</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-primary-navy mb-1">Launch Date (ISO Format)</label>
              <input
                type="text"
                value={settings['cohort2_countdown_date'] || '2026-10-15T09:00:00Z'}
                onChange={(e) => handleChange('cohort2_countdown_date', e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg border border-neutral-border text-xs font-mono focus:ring-2 focus:ring-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-primary-navy mb-1">Cohort 2 Status Subtitle</label>
              <input
                type="text"
                value={settings['cohort2_status'] || 'Coming Soon — Applications Opening'}
                onChange={(e) => handleChange('cohort2_status', e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg border border-neutral-border text-xs focus:ring-2 focus:ring-gold"
              />
            </div>
          </div>
        </div>

        {/* Group F: Social Links */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-primary-navy font-bold text-sm uppercase tracking-wider pb-2 border-b border-neutral-border">
            <Share2 className="w-4 h-4 text-gold-600" />
            <h2>Social Channels</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-primary-navy mb-1">Instagram URL</label>
              <input
                type="url"
                value={settings['social_instagram'] || 'https://www.instagram.com/skill_to_leadership?igsi=ZDNlZDc0MzIxNw=='}
                onChange={(e) => handleChange('social_instagram', e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg border border-neutral-border text-xs focus:ring-2 focus:ring-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-primary-navy mb-1">LinkedIn URL</label>
              <input
                type="url"
                value={settings['social_linkedin'] || 'https://www.linkedin.com/in/mokijei-junior-fonye-christopher-4139ba384/'}
                onChange={(e) => handleChange('social_linkedin', e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg border border-neutral-border text-xs focus:ring-2 focus:ring-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-primary-navy mb-1">X (Twitter) URL</label>
              <input
                type="url"
                value={settings['social_x'] || 'https://x.com/FonyeChris?s=20'}
                onChange={(e) => handleChange('social_x', e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg border border-neutral-border text-xs focus:ring-2 focus:ring-gold"
              />
            </div>
          </div>
        </div>

        {/* Group G: Scripture Quote */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-primary-navy font-bold text-sm uppercase tracking-wider pb-2 border-b border-neutral-border">
            <BookOpen className="w-4 h-4 text-gold-600" />
            <h2>Footer Scripture Citation</h2>
          </div>

          <div>
            <label className="block text-xs font-bold text-primary-navy mb-1">Biblical Quote</label>
            <textarea
              rows={2}
              value={settings['footer_scripture'] || 'Let your light shine before others, that they may see your good deeds and glorify your Father in heaven.'}
              onChange={(e) => handleChange('footer_scripture', e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg border border-neutral-border text-xs focus:ring-2 focus:ring-gold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-primary-navy mb-1">Scripture Reference</label>
            <input
              type="text"
              value={settings['footer_scripture_reference'] || 'Matthew 5:16'}
              onChange={(e) => handleChange('footer_scripture_reference', e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg border border-neutral-border text-xs focus:ring-2 focus:ring-gold"
            />
          </div>
        </div>

        {/* Status Notifications */}
        {message && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Button
          type="submit"
          variant="gold"
          size="lg"
          isLoading={isSaving}
          leftIcon={<Save className="w-4 h-4 text-primary-navy" />}
          className="w-full justify-center font-bold"
        >
          Save All Settings
        </Button>
      </form>

      {/* 2. Admin Password Change Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-border shadow-soft space-y-6">
        <div className="flex items-center gap-2 text-primary-navy font-bold text-sm uppercase tracking-wider pb-2 border-b border-neutral-border">
          <KeyRound className="w-4 h-4 text-gold-600" />
          <h2>Change Admin Login Password</h2>
        </div>

        <p className="text-xs text-neutral-muted">
          Update the password used to access this administrative portal. Passwords are encrypted with bcrypt (10 rounds) and stored securely in Supabase.
        </p>

        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-bold text-primary-navy mb-1">
              New Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                minLength={6}
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-neutral-border text-xs focus:ring-2 focus:ring-gold"
              />
              <Lock className="w-4 h-4 text-neutral-muted absolute left-3.5 top-3" />
            </div>
            <span className="text-[10px] text-neutral-muted">Minimum 6 characters</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-primary-navy mb-1">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                minLength={6}
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-neutral-border text-xs focus:ring-2 focus:ring-gold"
              />
              <Lock className="w-4 h-4 text-neutral-muted absolute left-3.5 top-3" />
            </div>
          </div>

          {passwordMessage && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{passwordMessage}</span>
            </div>
          )}

          {passwordError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{passwordError}</span>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isChangingPassword}
            className="w-full justify-center font-bold"
          >
            Change Password
          </Button>
        </form>
      </div>

    </div>
  );
}
