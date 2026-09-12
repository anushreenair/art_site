import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { CritiqueIntent, type CritiqueIntentSelection } from '../components/CritiqueIntent';
import { CreationBoundary } from '../components/CreationBoundary';

import { communityPosts as posts } from '../data/community-posts';

const criticLevels = [
  ['Helpful Critic', 'Offers clear, specific observations'],
  ['Experienced Critic', 'Connects feedback to practice skills'],
  ['Mentor', 'Guides artists toward the next useful exercise'],
  ['Highly Rated Mentor', 'Consistently recognised for thoughtful help'],
];

export function CommunityPage() {
  const [feedbackOpen, setFeedbackOpen] = useState<string | null>(null);
  const [feedbackSent, setFeedbackSent] = useState<string | null>(null);
  const [requested, setRequested] = useState<string | null>(null);
  const [saved, setSaved] = useState<string[]>([]);
  const [followed, setFollowed] = useState<string[]>([]);
  const [liked, setLiked] = useState<string[]>([]);
  const [intentPost, setIntentPost] = useState<string | null>(null);
  const [requestIntents, setRequestIntents] = useState<Record<string, CritiqueIntentSelection>>({});

  const toggle = (id: string, current: string[], setCurrent: (next: string[]) => void) => {
    setCurrent(current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  return (
    <AppShell>
      <section className="community-hero">
        <div className="community-hero-copy" data-testid="community-hero-copy">
          <p className="eyebrow">Community / practice in public</p>
          <h1 aria-label="The critique studio.">The critique<br /><em>studio.</em></h1>
        </div>
        <p>Share the work in progress. Ask a better question. Give one specific observation that helps another artist return to the page.</p>
      </section>
      <section className="community-rules">
        <span>Helpful feedback travels further than a heart.</span>
        <span>Say what you see. Name what to try next.</span>
        <Link to="/profile">View your artist profile ↗</Link>
      </section>
      <section className="community-layout">
        <section className="community-feed" aria-label="Community practice">
          {posts.map((post) => (
            <article className="community-post" id={`post-${post.id}`} key={post.id}>
              <header>
                <div><strong>{post.artist}</strong><span>{post.handle}</span></div>
                <button className={`critique-preference ${requested === post.id ? 'requested' : ''}`}>{requested === post.id ? 'Feedback requested' : post.preference}</button>
              </header>
              <img src={post.image} alt={post.alt} />
              <div className="post-copy">
                <p className="post-context">{post.context}</p>
                <h2>{post.title}</h2>
                <p>{post.note}</p>
                <div className="post-actions">
                  <button aria-pressed={liked.includes(post.id)} onClick={() => toggle(post.id, liked, setLiked)}>{liked.includes(post.id) ? 'Liked' : 'Like'}</button>
                  <button aria-pressed={saved.includes(post.id)} onClick={() => toggle(post.id, saved, setSaved)}>{saved.includes(post.id) ? 'Saved' : 'Save'}</button>
                  <button onClick={() => setFeedbackOpen(feedbackOpen === post.id ? null : post.id)}>Comment</button>
                  <button aria-pressed={followed.includes(post.id)} onClick={() => toggle(post.id, followed, setFollowed)}>{followed.includes(post.id) ? 'Following' : 'Follow'}</button>
                  <button onClick={() => setIntentPost(post.id)}>Request Critique</button>
                  <button onClick={() => navigator.clipboard?.writeText(window.location.href)}>Share Completed Practice</button>
                  <Link to="/profile">View Artist Profile</Link>
                </div>
                {requested === post.id && requestIntents[post.id] && <p className="requested-intent">Requested: {requestIntents[post.id].areas.join(' + ')} · {requestIntents[post.id].tone}</p>}
                {post.preference !== 'No critique' && (
                  <div className="community-feedback">
                    <div><span>{post.critic}</span><p>{post.feedback}</p></div>
                    <button onClick={() => setFeedbackOpen(feedbackOpen === post.id ? null : post.id)}>Leave constructive feedback</button>
                  </div>
                )}
                {feedbackOpen === post.id && <FeedbackForm intent={requestIntents[post.id]} onCancel={() => setFeedbackOpen(null)} onSend={() => { setFeedbackSent(post.id); setFeedbackOpen(null); }} />}
                {feedbackSent === post.id && <p className="feedback-shared">Feedback shared</p>}
              </div>
            </article>
          ))}
        </section>
        <aside className="community-aside">
          <section>
            <p className="eyebrow">Critic reputation</p>
            <h2>Help is the signal.</h2>
            <p>Levels recognise useful, actionable feedback—not follower counts or volume.</p>
            {criticLevels.map(([level, description], index) => <article key={level}><span>0{index + 1}</span><div><strong>{level}</strong><small>{description}</small></div></article>)}
          </section>
          <section className="community-prompt">
            <p className="eyebrow">Before you reply</p>
            <strong>Could the artist act on this in their next 20 minutes?</strong>
            <p>Specific observations make the studio safer—and more useful—for everyone.</p>
          </section>
        </aside>
      </section>
      <div className="community-creation-boundary"><CreationBoundary startTo="/build-practice" /></div>
      {intentPost && <CritiqueIntent target="Community Critique" onClose={() => setIntentPost(null)} onContinue={(intent) => { setRequested(intentPost); setRequestIntents((current) => ({ ...current, [intentPost]: intent })); setIntentPost(null); }} />}
    </AppShell>
  );
}

function FeedbackForm({ intent, onCancel, onSend }: { intent?: CritiqueIntentSelection; onCancel: () => void; onSend: () => void }) {
  return <form className="feedback-form" onSubmit={(event) => { event.preventDefault(); onSend(); }}>{intent && <p className="feedback-intent">Requested focus: {intent.areas.join(' + ')} · {intent.tone}</p>}<label>What worked well<textarea required /></label><label>What could improve<textarea required /></label><label>One suggestion<textarea required /></label><div><button type="submit">Share feedback</button><button type="button" onClick={onCancel}>Cancel</button></div></form>;
}
