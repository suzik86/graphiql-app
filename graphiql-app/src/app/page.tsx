import ErrorBoundary from "../components/ErrorBoundary/ErrorBoundary";
import WelcomeBackSection from "../components/WelcomeBackSection/WelcomeBackSection";
export default function Home() {
  return (
    <>
    <ErrorBoundary>

      <WelcomeBackSection />
    </ErrorBoundary>
    </>
  );
};
