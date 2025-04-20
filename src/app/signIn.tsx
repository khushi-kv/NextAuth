// pages/login.tsx
import { signIn } from "next-auth/react";

const LoginButton = () => {
  return (
    <div>
      <h1>Login</h1>
      <button onClick={() => signIn("github")}>
        Sign in with GitHub
      </button>
    </div>
  );
};

export default LoginButton;
