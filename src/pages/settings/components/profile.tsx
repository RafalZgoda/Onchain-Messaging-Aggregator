import { TUserProfile } from "libs";

export const Profile = ({ profile }: { profile: TUserProfile }) => {
  return (
    <div className="p-10">
      <div className="bg-[#38383fb7] w-6/12 px-10 py-5 flex rounded-[50px]">
        <img src="img/eth.png" className="w-16 mr-3 object-contain"></img>
        <div>
          <h1 className="m-0 p-0">{profile?.ENS}</h1>
          <p className="m-0 p-0">{profile?.identity}</p>
        </div>
      </div>
      {profile.neighbors.map((neighbor) => {
        return (
          <div className="bg-[#38383fb7] w-6/12 px-10 py-5 flex rounded-[50px]">
            <img src={"img/"+neighbor.source+".png"} className="w-16 mr-3 object-contain"></img>
            <div>
              <h1 className="m-0 p-0">{neighbor.displayName}</h1>
              <p className="m-0 p-0">{neighbor.identity}</p>
              <p className="m-0 p-0">{neighbor.source}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
