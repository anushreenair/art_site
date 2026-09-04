import { useEffect, useState } from 'react';
import { AppShell } from '../components/AppShell';

const reasons = ['Something Looks Wrong', 'I Lost Motivation', 'I’m Not Sure What’s Missing', 'Too Much Left to Do', 'I’m Overworking It', 'I’m Afraid I’ll Ruin It'] as const;
type StopReason = (typeof reasons)[number];
type FinishingPlan = { stage: string; steps: string[]; minutes: number };

const plans: Record<StopReason, FinishingPlan> = {
  'Something Looks Wrong': { stage: 'the midway stage', steps: ['Return to the biggest light and shadow shapes.', 'Correct the one relationship that changes the whole picture.', 'Leave the small details alone until it reads again.'], minutes: 25 },
  'I Lost Motivation': { stage: 'the refinement stage', steps: ['Choose one small corner of the piece.', 'Make one improvement you can see in five minutes.', 'Stop before the task becomes the whole painting.'], minutes: 20 },
  'I’m Not Sure What’s Missing': { stage: 'the refinement stage', steps: ['Resolve the background.', 'Increase focal-point contrast.', 'Add final highlights.'], minutes: 35 },
  'Too Much Left to Do': { stage: 'the block-in stage', steps: ['List the three largest unresolved areas.', 'Finish the area that supports the focal point first.', 'Let one low-priority area remain simple.'], minutes: 40 },
  'I’m Overworking It': { stage: 'the refinement stage', steps: ['Put the smallest brush down.', 'Soften one over-described edge.', 'Keep the next mark only if it improves the hierarchy.'], minutes: 20 },
  'I’m Afraid I’ll Ruin It': { stage: 'the refinement stage', steps: ['Resolve the background.', 'Increase focal-point contrast.', 'Add final highlights.'], minutes: 35 },
};

const formatTime = (seconds: number) => `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;

export function FinishPiecePage() {
  const [reason, setReason] = useState<StopReason | null>(null);
  const [uploadName, setUploadName] = useState('');
  const [planVisible, setPlanVisible] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const plan = reason ? plans[reason] : null;
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    if (!sessionActive) return;
    const timer = window.setInterval(() => setSeconds((value) => {
      if (value <= 1) { setSessionActive(false); return 0; }
      return value - 1;
    }), 1000);
    return () => window.clearInterval(timer);
  }, [sessionActive]);
  const generatePlan = () => { if (plan) { setPlanVisible(true); setSeconds(plan.minutes * 60); } };

  return (
    <AppShell>
      <section className="finish-piece">
        <header className="finish-hero">
          <div>
            <p className="eyebrow">Unfinished work, still worth finishing</p>
            <h1>Finish My Piece</h1>
          </div>
          <p>Don’t hand the work a vague problem. Give it one clear next session.</p>
        </header>
        {!planVisible ? (
          <section className="finish-form">
            <label className="finish-upload">Upload unfinished artwork
              <input aria-label="Upload unfinished artwork" type="file" accept="image/*" onChange={(event) => setUploadName(event.target.files?.[0]?.name ?? '')} />
              <span>{uploadName || 'JPEG, PNG, or HEIC'}</span>
            </label>
            <div className="finish-reason">
              <p className="eyebrow">Why did you stop?</p>
              <div>{reasons.map((option) => <button key={option} className={reason === option ? 'selected' : ''} aria-pressed={reason === option} onClick={() => setReason(option)}>{option}</button>)}</div>
            </div>
            <button className="finish-generate" disabled={!reason || !uploadName} onClick={generatePlan}>Generate finishing plan <span>↗</span></button>
          </section>
        ) : plan && (
          <section className="finish-plan">
            <header>
              <p className="eyebrow">Finishing plan · {uploadName}</p>
              <h2>You are currently in <em>{plan.stage}</em>.</h2>
              <p>Do not restart.</p>
            </header>
            <div className="finish-plan-body">
              <section>
                <p className="eyebrow">Next steps</p>
                <ol>{plan.steps.map((step) => <li key={step}>{step}</li>)}</ol>
              </section>
              <aside>
                <p className="eyebrow">Estimated focused session</p>
                <strong>{plan.minutes} minutes</strong>
                {sessionActive && <span>{formatTime(seconds)} remaining</span>}
                <button onClick={() => setSessionActive((active) => !active)}>{sessionActive ? 'Pause Finish Session' : 'Start Finish Session'} <span>↗</span></button>
              </aside>
            </div>
            <button className="finish-revise" onClick={() => { setPlanVisible(false); setSessionActive(false); }}>Revise the plan</button>
          </section>
        )}
      </section>
    </AppShell>
  );
}
