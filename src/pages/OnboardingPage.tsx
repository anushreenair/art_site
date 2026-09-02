import { OnboardingFlow } from '../components/OnboardingFlow';

export function OnboardingPage() { return <main className="onboarding-page"><a className="wordmark auth-mark" href="/">atelier<span>·</span></a><OnboardingFlow onComplete={() => undefined} /></main>; }
