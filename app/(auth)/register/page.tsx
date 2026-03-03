"use client";

import AuthForm from "@/components/forms/AuthForm";
import { RegisterSchema } from "@/lib/validations";
import { registerWithCredentails } from "@/lib/actions/auth.action";

const Register = () => {
  return (
    <AuthForm
      formType="SIGN_UP"
      schema={RegisterSchema}
      defaultValues={{ name: "", username: "", email: "", password: "" }}
      onSubmit={registerWithCredentails}
    />
  );
};

export default Register;
