"use client";
import { CldImage } from "next-cloudinary";
import { User } from "@/types/action";
import { Button } from "./ui/button";

const ProfileHeader = ({ userProfile }: { userProfile: User | null }) => {
  console.log(userProfile);

  if (!userProfile) {
    return (
      <header>
        <div className="banner">
          <div className="placeholder"></div>
        </div>
      </header>
    );
  }

  const { coverCldPubId, imageCldPubId } = userProfile;

  return (
    <header className="relative">
      {/* Banner Section */}
      <div className="relative w-full h-48 md:h-72 overflow-hidden rounded-2xl">
        {coverCldPubId ? (
          <CldImage
            src={coverCldPubId}
            alt="cover"
            width={1200}
            height={400}
            className="w-full h-full object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground">No cover image</span>
          </div>
        )}
      </div>

      {/* Profile Section */}
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-12 sm:-mt-16">
          {/* Profile Image */}
          <div className="relative">
            {imageCldPubId ? (
              <CldImage
                src={imageCldPubId}
                alt="profile"
                width={200}
                height={200}
                className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-full border-4 border-background shadow-lg"
                priority
              />
            ) : (
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-muted rounded-full border-4 border-background shadow-lg flex items-center justify-center">
                <span className="text-muted-foreground">No photo</span>
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold">
              {userProfile.name}
            </h1>
            <p className="text-muted-foreground">@{userProfile.username}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button size="sm" className="w-full sm:w-auto">
              Edit Profile
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ProfileHeader;
