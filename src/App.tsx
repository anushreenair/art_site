import { Route, Routes } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { SignInPage } from './pages/SignInPage';
import { SignUpPage } from './pages/SignUpPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { ExplorePage } from './pages/ExplorePage';

export function App() { return <Routes><Route path="/" element={<HomePage />} /><Route path="/explore" element={<ExplorePage />} /><Route path="/sign-in" element={<SignInPage />} /><Route path="/sign-up" element={<SignUpPage />} /><Route path="/onboarding" element={<OnboardingPage />} /></Routes>; }
