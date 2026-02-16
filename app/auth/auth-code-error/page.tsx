// app/auth/auth-code-error/page.tsx

export default function AuthCodeErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-2xl font-bold text-red-500 mb-4">Authentication Error</h1>
      <p>There was a problem authenticating your account.</p>
      <p>Please try signing in again or contact support if the problem persists.</p>
    </div>
  );
}
