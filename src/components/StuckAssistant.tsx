import { useEffect, useState } from 'react';
import type { ReferenceStudy } from '../types/content';

const issues = ['Something Looks Wrong', 'Proportions Are Wrong', 'Colours Aren’t Working', 'Painting Looks Flat', 'Lighting Doesn’t Work', 'I’ve Overworked It', 'I Don’t Know What to Do Next', 'I’ve Lost Motivation'] as const;
type StuckIssue = (typeof issues)[number];

const guidance: Record<StuckIssue, { opening: string; steps: string[]; goal: string }> = {
  'Something Looks Wrong': { opening: 'Don’t restart.', steps: ['Turn the reference and your work to grayscale.', 'Find the biggest light shape and make it simpler.', 'Change only one thing before looking again.'], goal: 'Work only on the largest value shape for 15 minutes.' },
  'Proportions Are Wrong': { opening: 'Don’t restart.', steps: ['Deepen the shadow under the jaw.', 'Reduce contrast around the hair.', 'Warm the cheek slightly.'], goal: 'Work only on values for 15 minutes.' },
  'Colours Aren’t Working': { opening: 'Pause the colour chase.', steps: ['Mix one quiet neutral from two opposing colours.', 'Compare its value before its hue.', 'Use the neutral to separate the two loudest colours.'], goal: 'Make a three-colour value check for 15 minutes.' },
  'Painting Looks Flat': { opening: 'Give the space one clear direction.', steps: ['Push the farthest plane slightly cooler and quieter.', 'Strengthen the overlap nearest the focal point.', 'Soften one edge that does not need attention.'], goal: 'Work only on depth cues for 15 minutes.' },
  'Lighting Doesn’t Work': { opening: 'Return to the light source.', steps: ['Cover the small details with your hand.', 'Group every shadow into one family.', 'Keep the brightest light for one focal place.'], goal: 'Paint a simple two-value light map for 15 minutes.' },
  'I’ve Overworked It': { opening: 'Stop adding detail.', steps: ['Put the smallest brush down.', 'Wipe back one crowded edge with a soft tool.', 'Let one unfinished passage stay quiet.'], goal: 'Simplify three edges over 15 minutes.' },
  'I Don’t Know What to Do Next': { opening: 'Choose the next visible decision.', steps: ['Name the largest unfinished shape.', 'Pick one edge to sharpen or soften.', 'Stop after that single change and reassess.'], goal: 'Make one deliberate decision every five minutes.' },
  'I’ve Lost Motivation': { opening: 'Make the task smaller.', steps: ['Set a timer before you judge the work.', 'Choose one area no larger than your palm.', 'Aim for one observation, not a finished painting.'], goal: 'Make one small study for 15 minutes.' },
};

const clock = (seconds: number) => `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;

export function StuckAssistant({ study, onClose }: { study: ReferenceStudy; onClose: () => void }) {
  const [issue, setIssue] = useState<StuckIssue | null>(null);
  const [uploadedName, setUploadedName] = useState('');
  const [fixActive, setFixActive] = useState(false);
  const [seconds, setSeconds] = useState(15 * 60);
  const answer = issue ? guidance[issue] : null;

  useEffect(() => {
    if (!fixActive) return;
    const timer = window.setInterval(() => setSeconds((time) => {
      if (time <= 1) { setFixActive(false); return 0; }
      return time - 1;
    }), 1000);
    return () => window.clearInterval(timer);
  }, [fixActive]);

  return <div className="stuck-backdrop" role="presentation" onMouseDown={onClose}><section className="stuck-assistant" role="dialog" aria-modal="true" aria-labelledby="stuck-title" onMouseDown={(event) => event.stopPropagation()}><button className="stuck-close" aria-label="Close I’m Stuck assistant" onClick={onClose}>×</button><header><p className="eyebrow">A small studio reset · {study.title}</p><h2 id="stuck-title">What is happening?</h2><p>You only need a next move—not a verdict on the whole piece.</p></header><div className="stuck-layout"><section className="stuck-choice-list" aria-label="Choose what is happening">{issues.map((option) => <button key={option} className={issue === option ? 'selected' : ''} aria-pressed={issue === option} onClick={() => { setIssue(option); setFixActive(false); setSeconds(15 * 60); }}>{option}</button>)}</section><aside className="stuck-response">{answer ? <><p className="stuck-opening">{answer.opening}</p><ol>{answer.steps.map((step) => <li key={step}>{step}</li>)}</ol><div className="stuck-goal"><p className="eyebrow">Next goal</p><strong>{answer.goal}</strong>{fixActive && <span>{clock(seconds)} focus time remaining</span>}</div><button className="stuck-fix" onClick={() => setFixActive((active) => !active)}>{fixActive ? 'Pause 15-Minute Fix' : 'Start 15-Minute Fix'} <span>↗</span></button></> : <p className="stuck-placeholder">Choose the closest feeling. We’ll reduce it to three small decisions.</p>}<label className="stuck-upload">Upload your current work<input aria-label="Upload your current work" type="file" accept="image/*" onChange={(event) => setUploadedName(event.target.files?.[0]?.name ?? '')} /><small>{uploadedName ? `${uploadedName} ready to consider.` : 'Optional · JPEG, PNG, or HEIC'}</small></label></aside></div></section></div>;
}
