'use client';

import React, { useState } from 'react';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { 
  Mail, 
  MailOpen, 
  Send, 
  Trash2, 
  Archive, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Filter, 
  Phone, 
  Calendar, 
  Tag, 
  Reply, 
  X 
} from 'lucide-react';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  category: string;
  subject: string;
  message: string;
  isRead: boolean;
  status: string;
  replyText: string | null;
  repliedAt: string | Date | null;
  createdAt: string | Date;
}

export function MessagesClient({ initialMessages }: { initialMessages: any[] }) {
  const [messages, setMessages] = useState<ContactMessage[]>(initialMessages);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replySubject, setReplySubject] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showNotification = (type: 'success' | 'error', text: string) => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 4000);
  };

  const filteredMessages = messages.filter((msg) => {
    const matchesSearch =
      msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.message.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'UNREAD' && !msg.isRead) ||
      (statusFilter === 'READ' && msg.isRead && msg.status !== 'REPLIED') ||
      (statusFilter === 'REPLIED' && msg.status === 'REPLIED');

    const matchesCategory =
      categoryFilter === 'ALL' || msg.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleSelectMessage = async (msg: ContactMessage) => {
    setSelectedMessage(msg);
    setReplySubject(`Re: ${msg.subject}`);
    setReplyText('');

    if (!msg.isRead) {
      try {
        await fetch('/api/admin/messages', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: msg.id, isRead: true, status: msg.status === 'UNREAD' ? 'READ' : msg.status }),
        });
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, isRead: true, status: m.status === 'UNREAD' ? 'READ' : m.status } : m))
        );
      } catch (err) {
        console.error('Failed to mark read:', err);
      }
    }
  };

  const handleToggleRead = async (msg: ContactMessage, e: React.MouseEvent) => {
    e.stopPropagation();
    const newRead = !msg.isRead;
    try {
      await fetch('/api/admin/messages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: msg.id, isRead: newRead, status: newRead ? 'READ' : 'UNREAD' }),
      });
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, isRead: newRead, status: newRead ? 'READ' : 'UNREAD' } : m))
      );
      if (selectedMessage?.id === msg.id) {
        setSelectedMessage({ ...selectedMessage, isRead: newRead, status: newRead ? 'READ' : 'UNREAD' });
      }
    } catch {
      showNotification('error', 'Failed to update message status.');
    }
  };

  const handleDelete = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!confirm('Are you sure you want to permanently delete this message?')) return;

    try {
      const res = await fetch(`/api/admin/messages?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        if (selectedMessage?.id === id) setSelectedMessage(null);
        showNotification('success', 'Message deleted.');
      } else {
        showNotification('error', 'Failed to delete message.');
      }
    } catch {
      showNotification('error', 'Network error deleting message.');
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMessage || !replyText.trim()) return;

    setIsSending(true);
    try {
      const res = await fetch('/api/admin/messages/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedMessage.id,
          subject: replySubject,
          replyText: replyText.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === selectedMessage.id
              ? {
                  ...m,
                  status: 'REPLIED',
                  isRead: true,
                  replyText: replyText.trim(),
                  repliedAt: new Date(),
                }
              : m
          )
        );
        setSelectedMessage((prev) =>
          prev
            ? {
                ...prev,
                status: 'REPLIED',
                isRead: true,
                replyText: replyText.trim(),
                repliedAt: new Date(),
              }
            : null
        );
        setReplyText('');
        showNotification('success', `Reply sent successfully to ${selectedMessage.email}!`);
      } else {
        showNotification('error', data.error || 'Failed to send reply.');
      }
    } catch {
      showNotification('error', 'Network error sending reply email.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Notifications */}
      {notification && (
        <div
          className={`p-3.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
            notification.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{notification.text}</span>
        </div>
      )}

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-border shadow-soft flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by name, email, subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-neutral-border focus:outline-none focus:ring-2 focus:ring-gold"
          />
          <Search className="w-4 h-4 text-neutral-muted absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg border border-neutral-border bg-white text-primary-navy font-medium focus:outline-none focus:ring-2 focus:ring-gold"
          >
            <option value="ALL">All Statuses</option>
            <option value="UNREAD">Unread Only</option>
            <option value="READ">Read</option>
            <option value="REPLIED">Replied</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg border border-neutral-border bg-white text-primary-navy font-medium focus:outline-none focus:ring-2 focus:ring-gold"
          >
            <option value="ALL">All Categories</option>
            <option value="GENERAL">General</option>
            <option value="PARTNERSHIP">Partnership</option>
            <option value="DONATION">Donation</option>
            <option value="VOLUNTEERING">Volunteering</option>
            <option value="PROGRAM">Program</option>
            <option value="MEDIA">Media</option>
          </select>
        </div>
      </div>

      {/* Main Inbox Grid: List + Detail Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Messages List (Left Column) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-neutral-border shadow-soft overflow-hidden flex flex-col h-[650px]">
          <div className="p-4 border-b border-neutral-border bg-neutral-surface/40 flex items-center justify-between">
            <span className="text-xs font-bold text-primary-navy uppercase tracking-wider">
              Inbox ({filteredMessages.length})
            </span>
            <span className="text-[11px] font-bold text-gold-700">
              {messages.filter((m) => !m.isRead).length} Unread
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-neutral-border">
            {filteredMessages.length === 0 ? (
              <div className="py-16 text-center text-xs text-neutral-muted px-4">
                No messages found matching criteria.
              </div>
            ) : (
              filteredMessages.map((msg) => {
                const isSelected = selectedMessage?.id === msg.id;
                return (
                  <div
                    key={msg.id}
                    onClick={() => handleSelectMessage(msg)}
                    className={`p-4 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-gold-light/40 border-l-4 border-gold'
                        : !msg.isRead
                        ? 'bg-sky-50/50 hover:bg-sky-50 font-semibold'
                        : 'hover:bg-neutral-surface/60'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2 min-w-0">
                        {!msg.isRead && (
                          <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0" />
                        )}
                        <span className="text-xs font-bold text-primary-navy truncate">
                          {msg.name}
                        </span>
                      </div>
                      <span className="text-[10px] text-neutral-muted shrink-0 font-mono">
                        {formatDate(msg.createdAt)}
                      </span>
                    </div>

                    <div className="text-xs text-primary-navy font-medium truncate mb-1">
                      {msg.subject}
                    </div>

                    <p className="text-[11px] text-neutral-muted line-clamp-2 leading-relaxed">
                      {msg.message}
                    </p>

                    <div className="mt-2 flex items-center justify-between gap-2">
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-neutral-surface text-neutral-muted border border-neutral-border uppercase">
                        {msg.category}
                      </span>
                      {msg.status === 'REPLIED' && (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Replied
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Message Detail & Reply Composer (Right Column) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-neutral-border shadow-soft p-6 flex flex-col h-[650px] overflow-y-auto">
          {selectedMessage ? (
            <div className="space-y-6 flex-1 flex flex-col">
              
              {/* Header Bar */}
              <div className="flex items-start justify-between gap-4 border-b border-neutral-border pb-4">
                <div>
                  <h2 className="text-lg font-bold text-primary-navy">{selectedMessage.subject}</h2>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-muted mt-1.5">
                    <span className="font-semibold text-primary-navy">{selectedMessage.name}</span>
                    <span>&lt;{selectedMessage.email}&gt;</span>
                    {selectedMessage.phone && (
                      <span className="inline-flex items-center gap-1">
                        <Phone className="w-3 h-3 text-gold-700" />
                        {selectedMessage.phone}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={(e) => handleToggleRead(selectedMessage, e)}
                    title={selectedMessage.isRead ? 'Mark as unread' : 'Mark as read'}
                    className="p-2 rounded-lg hover:bg-neutral-surface text-neutral-muted hover:text-primary-navy transition-colors border border-neutral-border"
                  >
                    {selectedMessage.isRead ? <Mail className="w-4 h-4" /> : <MailOpen className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={(e) => handleDelete(selectedMessage.id, e)}
                    title="Delete message"
                    className="p-2 rounded-lg hover:bg-rose-50 text-neutral-muted hover:text-rose-600 transition-colors border border-neutral-border"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Message Content */}
              <div className="bg-neutral-surface/50 p-5 rounded-2xl border border-neutral-border/60">
                <div className="flex items-center justify-between text-[11px] text-neutral-muted mb-3 font-mono">
                  <span>Category: <strong>{selectedMessage.category}</strong></span>
                  <span>Received: {formatDate(selectedMessage.createdAt)}</span>
                </div>
                <div className="text-xs sm:text-sm text-primary-navy leading-relaxed whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
              </div>

              {/* Previous Reply Log (if already replied) */}
              {selectedMessage.replyText && (
                <div className="bg-emerald-50/60 border border-emerald-200 p-4 rounded-2xl space-y-1 text-xs">
                  <div className="flex items-center justify-between text-[11px] font-bold text-emerald-800">
                    <span>Your Previous Reply</span>
                    <span>{selectedMessage.repliedAt ? formatDate(selectedMessage.repliedAt) : ''}</span>
                  </div>
                  <p className="text-emerald-950 whitespace-pre-wrap leading-relaxed">{selectedMessage.replyText}</p>
                </div>
              )}

              {/* Reply Form */}
              <form onSubmit={handleSendReply} className="mt-auto pt-4 border-t border-neutral-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-primary-navy uppercase tracking-wider flex items-center gap-1.5">
                    <Reply className="w-4 h-4 text-gold" />
                    Reply to {selectedMessage.name} ({selectedMessage.email})
                  </span>
                </div>

                <input
                  type="text"
                  required
                  value={replySubject}
                  onChange={(e) => setReplySubject(e.target.value)}
                  placeholder="Subject"
                  className="w-full px-3.5 py-2 text-xs rounded-lg border border-neutral-border focus:outline-none focus:ring-2 focus:ring-gold"
                />

                <textarea
                  rows={4}
                  required
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Write your response to ${selectedMessage.name}... This will be delivered directly to ${selectedMessage.email}.`}
                  className="w-full p-3 text-xs rounded-lg border border-neutral-border focus:outline-none focus:ring-2 focus:ring-gold"
                />

                <Button
                  type="submit"
                  variant="gold"
                  size="md"
                  isLoading={isSending}
                  leftIcon={<Send className="w-3.5 h-3.5 text-primary-navy" />}
                  className="w-full justify-center font-bold"
                >
                  Send Reply to {selectedMessage.email}
                </Button>
              </form>

            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-neutral-muted space-y-3">
              <Mail className="w-12 h-12 text-neutral-border" />
              <div className="font-bold text-primary-navy text-sm">No Message Selected</div>
              <p className="text-xs max-w-xs">
                Select an inquiry from the inbox on the left to read details and send a direct email reply.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
