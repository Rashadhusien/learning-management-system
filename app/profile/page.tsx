import { auth } from "@/auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getProfile } from "@/lib/actions/profile.action";
const StudentPage = async () => {
  const session = await auth();

  const { data: userProfile } = await getProfile({ userId: session?.user.id });

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mt-8">
        <div className="p-6">
          <h2 className="text-2xl md:text-3xl font-semibold">
            Personal Information
          </h2>
          <p className="text-muted-foreground mt-2">
            You can always upload your personal info here
          </p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Full Name
              </label>
              <div className="p-4 border border-border rounded-lg bg-muted/50">
                <p className="text-base font-medium">
                  {userProfile?.name || "Not provided"}
                </p>
              </div>
            </div>

            {/* Username */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Username
              </label>
              <div className="p-4 border border-border rounded-lg bg-muted/50">
                <p className="text-base font-medium">
                  @{userProfile?.username || "Not provided"}
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Email
              </label>
              <div className="p-4 border border-border rounded-lg bg-muted/50">
                <p className="text-base font-medium">
                  {userProfile?.email || "Not provided"}
                </p>
              </div>
            </div>

            {/* Level */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Level
              </label>
              <div className="p-4 border border-border rounded-lg bg-muted/50">
                <p className="text-base font-medium">
                  {userProfile?.level || "Not provided"}
                </p>
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-muted-foreground">
                Bio
              </label>
              <div className="p-4 border border-border rounded-lg bg-muted/50 min-h-[100px]">
                <p className="text-base leading-relaxed">
                  {userProfile?.bio || "No bio provided"}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {/* <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <Button variant="outline" className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button className="w-full sm:w-auto">Save Changes</Button>
          </div> */}
        </div>
      </Card>
    </div>
  );
};

export default StudentPage;
