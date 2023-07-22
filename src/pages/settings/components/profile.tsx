import { TUserProfile } from "libs";

export const Profile = ({ profile }: { profile: TUserProfile }) => {
  return <h1>{profile.ENS}</h1>;
};
