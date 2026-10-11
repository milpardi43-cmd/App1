/** Deployment switches, not authorization. Server roles/RLS remain mandatory. */
export const FEATURES = Object.freeze({
  adminPanel: process.env.EXPO_PUBLIC_ENABLE_EDUCATION_ADMIN === 'true',
  educationEnrollment: process.env.EXPO_PUBLIC_ENABLE_EDUCATION_ADMIN === 'true',
  // Roadmap modules are not implemented yet. Enabling a boolean cannot build them.
  contentEditor: false,
  assignments: false,
  announcements: false,
  billing: false,
  germanAI: false,
  russianCourse: false,
});
