export const logInWithCredentails = async (data: {
  email: string;
  password: string;
}) => {
  // TODO: Implement sign in with credentials
  console.log("Sign in with credentials:", data);
  return { success: true };
};

export const registerWithCredentails = async (data: {
  name: string;
  username: string;
  email: string;
  password: string;
}) => {
  // TODO: Implement register with credentials
  console.log("Register with credentials:", data);
  return { success: true };
};
