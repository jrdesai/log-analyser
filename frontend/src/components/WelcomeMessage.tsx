interface WelcomeMessageProps {
  firstName: string;
}

export default function WelcomeMessage({ firstName }: WelcomeMessageProps) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold">
        Welcome back, {firstName}! 👋
      </h2>
    </div>
  );
}

