/**
 * Patient identity helpers.
 *
 * Routes such as /patient/:id, /patient/:id/examination and /recommendations/:id
 * carry the identifier of the patient being reviewed. The signed-in user is the
 * clinician performing the action. The two must never be conflated.
 */

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const isUuid = (value?: string | null): boolean => !!value && UUID_RE.test(value);

/**
 * The identifier used for display / demo data source lookups. Always the route
 * patient id when present.
 */
export const patientRefFromRoute = (routeId?: string | null): string => routeId ?? "demo";

/**
 * The identifier written to clinical tables keyed by auth user id.
 * Returns the route patient id when it is a real user-scoped UUID, otherwise
 * null so callers can decide how to handle non-persistable demo identifiers.
 */
export const patientUserIdFromRoute = (routeId?: string | null): string | null =>
  isUuid(routeId) ? (routeId as string) : null;
