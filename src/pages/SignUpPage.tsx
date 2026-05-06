import AuthLayout from "../features/auth/AuthLayout";
import SignUpForm from "../features/auth/SignUpForm";

interface SignUpPageProps {
  disableCustomTheme?: boolean;
}

const SignUpPage = ({ disableCustomTheme }: SignUpPageProps) => {
  return (
    <AuthLayout disableCustomTheme={disableCustomTheme}>
      <SignUpForm />
    </AuthLayout>
  );
}
export default SignUpPage;
