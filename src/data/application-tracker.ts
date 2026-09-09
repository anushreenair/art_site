export const applicationStatuses = ['Saved', 'Preparing', 'Applied', 'Shortlisted', 'Accepted', 'Rejected', 'Completed'] as const;

export type ApplicationStatus = typeof applicationStatuses[number];
export type ApplicationRequirement = { label: string; done: boolean };
export type TrackedApplication = {
  id: string;
  name: string;
  organisation: string;
  deadline: string;
  reminder: string;
  status: ApplicationStatus;
  requirements: ApplicationRequirement[];
};

export const trackedApplications: TrackedApplication[] = [
  { id: 'portrait-prize', name: 'New Portrait Voices Prize', organisation: 'The Portrait Room', deadline: '9 Sep 2026', reminder: 'Deadline in 4 days.', status: 'Preparing', requirements: [{ label: '5 Artwork Images', done: true }, { label: 'Artist Bio', done: true }, { label: 'Artist Statement', done: false }, { label: 'Portfolio Link', done: true }, { label: 'Entry Fee', done: false }, { label: 'Application Form', done: false }] },
  { id: 'watercolour-open', name: 'Mumbai Watercolour Open', organisation: 'Bombay Watercolour Society', deadline: '25 Sep 2026', reminder: 'Deadline in 20 days.', status: 'Saved', requirements: [{ label: '4 Artwork Images', done: false }, { label: 'Artist Bio', done: true }, { label: 'Portfolio Link', done: true }, { label: 'Application Form', done: false }] },
  { id: 'climate-sketchbook', name: 'The Climate Sketchbook', organisation: 'Field Notes Journal', deadline: '22 Sep 2026', reminder: 'Deadline in 17 days.', status: 'Applied', requirements: [{ label: '3 Artwork Images', done: true }, { label: 'Artist Statement', done: true }, { label: 'Portfolio Link', done: true }, { label: 'Application Form', done: true }] },
  { id: 'studio-residency', name: 'Saffron Studio Residency', organisation: 'Saffron Studio House', deadline: '30 Sep 2026', reminder: 'Deadline in 25 days.', status: 'Shortlisted', requirements: [{ label: 'Portfolio PDF', done: true }, { label: 'Project Proposal', done: true }, { label: 'CV', done: true }, { label: 'Interview slot', done: false }] },
];
