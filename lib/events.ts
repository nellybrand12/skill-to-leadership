/**
 * Centralized Event Lifecycle, Status, and Timezone Management
 * Standard timezone: Africa/Douala (UTC+1, Cameroon)
 */

export type EventLifecycleStatus = 'UPCOMING' | 'ACTIVE' | 'CLOSED' | 'ARCHIVED';

export interface EventDateSource {
  startDateTime?: Date | string | null;
  endDateTime?: Date | string | null;
  date?: Date | string | null;
  status?: string | null;
  applicationsEnabled?: boolean | null;
}

/**
 * Calculates authoritative server-side event lifecycle status.
 * Explicit admin-configured status ('ACTIVE', 'CLOSED', 'ARCHIVED', 'UPCOMING')
 * takes primary precedence.
 */
export function getEventLifecycleStatus(event: EventDateSource): EventLifecycleStatus {
  if (!event) return 'ACTIVE';

  // 1. Direct explicit status overrides set by Admin
  if (event.status === 'ACTIVE') {
    return 'ACTIVE';
  }
  if (event.status === 'CLOSED') {
    return 'CLOSED';
  }
  if (event.status === 'ARCHIVED') {
    return 'ARCHIVED';
  }
  if (event.status === 'UPCOMING') {
    return 'UPCOMING';
  }

  // 2. Direct applicationsEnabled toggle flag
  if (event.applicationsEnabled === true) {
    return 'ACTIVE';
  }
  if (event.applicationsEnabled === false) {
    return 'CLOSED';
  }

  const now = new Date();

  // 3. If start and end timestamps exist, calculate by time range
  if (event.startDateTime && event.endDateTime) {
    const start = new Date(event.startDateTime);
    const end = new Date(event.endDateTime);

    if (now < start) {
      return 'UPCOMING';
    } else if (now >= start && now <= end) {
      return 'ACTIVE';
    } else {
      return 'CLOSED';
    }
  }

  // 4. If only endDateTime exists
  if (event.endDateTime) {
    const end = new Date(event.endDateTime);
    if (now > end) return 'CLOSED';
  }

  // 5. If only startDateTime exists
  if (event.startDateTime) {
    const start = new Date(event.startDateTime);
    if (now < start) return 'UPCOMING';
  }

  // 6. Fallback to legacy date field
  if (event.date) {
    const eventDate = new Date(event.date);
    const endOfDay = new Date(eventDate);
    endOfDay.setHours(23, 59, 59, 999);
    if (now > endOfDay) return 'CLOSED';
  }

  return (event.status as EventLifecycleStatus) || 'ACTIVE';
}

/**
 * Check whether application / registration is currently open for an event
 */
export function isEventApplicationOpen(event: EventDateSource): boolean {
  const status = getEventLifecycleStatus(event);
  return status === 'ACTIVE';
}

/**
 * Format event dates clearly for display in Cameroon local time (Africa/Douala)
 */
export function formatEventDateTime(dateTime: Date | string | null | undefined): string {
  if (!dateTime) return '';
  const d = new Date(dateTime);
  return d.toLocaleString('en-US', {
    timeZone: 'Africa/Douala',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}
