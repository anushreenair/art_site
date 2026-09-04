import { Route, Routes } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { SignInPage } from './pages/SignInPage';
import { SignUpPage } from './pages/SignUpPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { ExplorePage } from './pages/ExplorePage';
import { PracticeWorkspace } from './pages/PracticeWorkspace';
import { PracticeGenerator } from './pages/PracticeGenerator';
import { ChallengePage } from './pages/ChallengePage';
import { ComparePage } from './pages/ComparePage';
import { ProfilePage } from './pages/ProfilePage';
import { CommunityPage } from './pages/CommunityPage';
import { OpportunitiesPage } from './pages/OpportunitiesPage';
import { LearningPathsPage } from './pages/LearningPathsPage';
import { ProgressPage } from './pages/ProgressPage';
import { MasterStudiesPage } from './pages/MasterStudiesPage';
import { FocusedInspirationPage } from './pages/FocusedInspirationPage';
import { PaletteLabPage } from './pages/PaletteLabPage';
import { ArtBoxPage } from './pages/ArtBoxPage';
import { ArtBoxProvider } from './components/ArtBoxProvider';
import { FinishPiecePage } from './pages/FinishPiecePage';
import { ArtRoulettePage } from './pages/ArtRoulettePage';
import { ArtistRightsPage } from './pages/ArtistRightsPage';

export function App() { return <ArtBoxProvider><Routes><Route path="/" element={<HomePage />} /><Route path="/explore" element={<ExplorePage />} /><Route path="/focused-inspiration" element={<FocusedInspirationPage />} /><Route path="/art-roulette" element={<ArtRoulettePage />} /><Route path="/build-practice" element={<PracticeGenerator />} /><Route path="/finish-piece" element={<FinishPiecePage />} /><Route path="/artist-rights" element={<ArtistRightsPage />} /><Route path="/learning" element={<LearningPathsPage />} /><Route path="/masters" element={<MasterStudiesPage />} /><Route path="/progress" element={<ProgressPage />} /><Route path="/challenge" element={<ChallengePage />} /><Route path="/opportunities" element={<OpportunitiesPage />} /><Route path="/community" element={<CommunityPage />} /><Route path="/practice/:studyId" element={<PracticeWorkspace />} /><Route path="/palette-lab/:studyId" element={<PaletteLabPage />} /><Route path="/compare/:studyId" element={<ComparePage />} /><Route path="/art-box" element={<ArtBoxPage />} /><Route path="/profile" element={<ProfilePage />} /><Route path="/sign-in" element={<SignInPage />} /><Route path="/sign-up" element={<SignUpPage />} /><Route path="/onboarding" element={<OnboardingPage />} /></Routes></ArtBoxProvider>; }
