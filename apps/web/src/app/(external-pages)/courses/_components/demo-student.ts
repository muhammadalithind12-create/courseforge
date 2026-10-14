// Demo student identity — login-free progress tracking.
// A stable anonymous id stored in localStorage; the parent table cf_progress
// keys off this string instead of auth.users.

const STORAGE_KEY = 'courseforge_student_id';

export function getDemoStudentId(): string {
  if (typeof window === 'undefined') return 'server';
  try {
    let id = window.localStorage.getItem(STORAGE_KEY);
    if (!id) {
      id = window.crypto.randomUUID();
      window.localStorage.setItem(STORAGE_KEY, id);
    }
    return id;
  } catch {
    // Private mode / storage blocked — fall back to an in-memory id.
    return 'memory-student';
  }
}
