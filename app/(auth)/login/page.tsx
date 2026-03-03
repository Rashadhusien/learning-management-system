"use client";

import AuthForm from "@/components/forms/AuthForm";
import { logInWithCredentails } from "@/lib/actions/auth.action";
import { LoginSchema } from "@/lib/validations";

const Login = () => {
  return (
    <AuthForm
      formType="SIGN_IN"
      schema={LoginSchema}
      defaultValues={{ email: "", password: "" }}
      onSubmit={logInWithCredentails}
    />
  );
};

export default Login;
