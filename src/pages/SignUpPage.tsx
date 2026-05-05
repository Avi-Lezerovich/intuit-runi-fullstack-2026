import AuthLayout from "../features/auth/AuthLayout";
import SignUpForm from "../features/auth/SignUpForm";

interface SignUpPageProps {
  disableCustomTheme?: boolean;
}

export default function SignUpPage({ disableCustomTheme }: SignUpPageProps) {
  return (
    <AuthLayout disableCustomTheme={disableCustomTheme}>
      <SignUpForm />
    </AuthLayout>
  );
}
