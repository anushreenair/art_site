import { useState } from 'react';
import { applicationStatuses, trackedApplications, type ApplicationStatus } from '../data/application-tracker';

export function ApplicationTracker({ onBrowse }: { onBrowse: () => void }) {
  const [activeId, setActiveId] = useState(trackedApplications[0].id);
  const [statuses, setStatuses] = useState<Record<string, ApplicationStatus>>(() => Object.fromEntries(trackedApplications.map((application) => [application.id, application.status])) as Record<string, ApplicationStatus>);
  const [requirements, setRequirements] = useState(() => Object.fromEntries(trackedApplications.map((application) => [application.id, application.requirements])));
  const active = trackedApplications.find((application) => application.id === activeId) ?? trackedApplications[0];
  const activeRequirements = requirements[active.id] ?? active.requirements;
  const completeCount = activeRequirements.filter((requirement) => requirement.done).length;
  const toggleRequirement = (index: number) => setRequirements((current) => ({ ...current, [active.id]: (current[active.id] ?? active.requirements).map((requirement, requirementIndex) => requirementIndex === index ? { ...requirement, done: !requirement.done } : requirement) }));

  return <section className="application-tracker" aria-labelledby="applications-title">
    <header className="application-tracker-heading"><div><p className="eyebrow">Opportunity desk / your submissions</p><h2 id="applications-title">My applications</h2><p>Keep the next move visible. Preparation counts as progress.</p></div><button className="tracker-back" onClick={onBrowse}>Browse opportunities <span>↗</span></button></header>
    <div className="application-tracker-layout">
      <aside className="application-list" aria-label="Tracked applications">{trackedApplications.map((application) => <button key={application.id} className={active.id === application.id ? 'selected' : ''} onClick={() => setActiveId(application.id)} aria-pressed={active.id === application.id}><span className="application-status">{statuses[application.id]}</span><strong>{application.name}</strong><small>{application.reminder}</small></button>)}</aside>
      <article className="application-detail"><header><div><p className="eyebrow">{active.organisation}</p><h3>{active.name}</h3></div><div className="deadline-reminder"><span>Deadline</span><strong>{active.deadline}</strong><small>{active.reminder}</small></div></header><div className="application-status-control"><label htmlFor="application-status">Application status</label><select id="application-status" value={statuses[active.id]} onChange={(event) => setStatuses((current) => ({ ...current, [active.id]: event.target.value as ApplicationStatus }))}>{applicationStatuses.map((status) => <option key={status}>{status}</option>)}</select></div><section className="requirements-checklist" aria-labelledby="requirements-title"><header><div><p className="eyebrow">Submission kit</p><h4 id="requirements-title">Requirements checklist</h4></div><span>{completeCount}/{activeRequirements.length} ready</span></header><div>{activeRequirements.map((requirement, index) => <button key={requirement.label} aria-pressed={requirement.done} onClick={() => toggleRequirement(index)}><i aria-hidden="true">{requirement.done ? '✓' : '○'}</i><span>{requirement.label}{requirement.done ? ' ✓' : ''}</span></button>)}</div></section></article>
    </div>
  </section>;
}
