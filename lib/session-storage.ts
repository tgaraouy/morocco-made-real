// Global session storage that can be shared between API routes
// In production, this should be replaced with Redis or a database
declare global {
  var qrSessionStorage: Map<string, any> | undefined;
}

export const qrSessions = globalThis.qrSessionStorage ?? new Map<string, any>();
globalThis.qrSessionStorage = qrSessions;

export function cleanupExpiredSessions() {
  const now = new Date();
  for (const [sessionId, session] of qrSessions.entries()) {
    if (new Date(session.expiresAt) < now) {
      qrSessions.delete(sessionId);
    }
  }
} 