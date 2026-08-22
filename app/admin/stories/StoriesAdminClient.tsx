'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { formatDate } from '@/lib/utils';
import { Plus, Trash2, BookOpen } from 'lucide-react';

export function StoriesAdminClient({ initialStories }: { initialStories: any[] }) {
  const [stories, setStories] = useState(initialStories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: 'Skill to Leadership Team',
    category: 'SUCCESS_STORY',
    coverImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok && data.story) {
        setStories([data.story, ...stories]);
        setIsModalOpen(false);
        setFormData({
          title: '',
          excerpt: '',
          content: '',
          author: 'Skill to Leadership Team',
          category: 'SUCCESS_STORY',
          coverImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this story?')) return;
    try {
      const res = await fetch(`/api/admin/stories?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setStories(stories.filter((s) => s.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={() => setIsModalOpen(true)}
          variant="gold"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          className="font-bold"
        >
          Write New Story
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stories.map((story) => (
          <div key={story.id} className="bg-white rounded-2xl p-5 border border-neutral-border shadow-soft space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-neutral-muted">
                <span className="font-bold text-gold-700 bg-gold-light px-2 py-0.5 rounded-full">{story.category.replace('_', ' ')}</span>
                <span>{formatDate(story.publishedAt)}</span>
              </div>
              <h3 className="text-base font-bold text-primary-navy">{story.title}</h3>
              <p className="text-xs text-neutral-muted line-clamp-3">{story.excerpt}</p>
            </div>

            <div className="pt-3 border-t border-neutral-border flex items-center justify-between text-xs text-neutral-muted">
              <span>By {story.author}</span>
              <button
                onClick={() => handleDelete(story.id)}
                className="text-rose-500 hover:text-rose-700 p-1 rounded-lg transition-colors"
                aria-label="Delete story"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Publish New Story"
        description="Share inspiring fellow updates, interviews, and educational insights."
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-primary-navy mb-1">Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Fellow Spotlight: Building a Studio in Yaoundé"
              className="w-full px-3 py-2 rounded-lg border border-neutral-border focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-primary-navy mb-1">Author</label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-neutral-border focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>
            <div>
              <label className="block font-bold text-primary-navy mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-neutral-border focus:outline-none focus:ring-2 focus:ring-gold bg-white"
              >
                <option value="SUCCESS_STORY">SUCCESS STORY</option>
                <option value="YOUTH_EMPOWERMENT">YOUTH EMPOWERMENT</option>
                <option value="PROGRAM_UPDATE">PROGRAM UPDATE</option>
                <option value="MENTOR_SPOTLIGHT">MENTOR SPOTLIGHT</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-primary-navy mb-1">Short Excerpt *</label>
            <input
              type="text"
              required
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="One or two sentences summarizing the article..."
              className="w-full px-3 py-2 rounded-lg border border-neutral-border focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>

          <div>
            <label className="block font-bold text-primary-navy mb-1">Full Article Content *</label>
            <textarea
              rows={6}
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Write the article content..."
              className="w-full px-3 py-2 rounded-lg border border-neutral-border focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>

          <Button type="submit" variant="gold" size="md" isLoading={isSubmitting} className="w-full justify-center font-bold">
            Publish Story
          </Button>
        </form>
      </Modal>
    </div>
  );
}
