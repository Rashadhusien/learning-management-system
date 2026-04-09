import { ROUTES } from "@/constants/routes";
import { getAuthSession } from "@/lib/auth-wrapper";
import { redirect } from "next/navigation";
const LecturesLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getAuthSession();

  if (!session) {
    redirect(ROUTES.LOGIN);
  }

  return <>{children}</>;
};

export default LecturesLayout;
