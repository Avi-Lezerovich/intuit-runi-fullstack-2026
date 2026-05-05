import AuthLayout from "../features/auth/AuthLayout";
import SignInForm from "../features/auth/SignInForm";

interface SignInPageProps {
  disableCustomTheme?: boolean;
}

// Thin page-level component: just routes-level concerns + composition.
export default function SignInPage({ disableCustomTheme }: SignInPageProps) {
  return (
    <AuthLayout disableCustomTheme={disableCustomTheme}>
      <SignInForm />
    </AuthLayout>
  );
}
