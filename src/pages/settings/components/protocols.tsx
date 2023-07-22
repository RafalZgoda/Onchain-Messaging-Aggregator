import { MESSAGE_PLATFORMS } from "libs";

const Protocol = ({ img, title }: { img: string; title: string }) => {
  const getButtonText = () => {
    switch (title) {
      case MESSAGE_PLATFORMS.vanilla.name:
        return "Enabled ✅";
      case MESSAGE_PLATFORMS.push.name:
        return "Disabled ❌";
      case MESSAGE_PLATFORMS.xmtp.name:
        return "Disabled ❌";
    }
  };
  return (
    <div className="w-64      rounded flex flex-col p-10 items-center justify-end">
      <img src={"img/" + img} className="w-32" />
      <h1 className="font-bold mt-3 text-xl text-white">{title}</h1>
      <button className="bg-[#3C8AFF] text-white px-5 py-1 mt-10  rounded-lg">
        {getButtonText()}
      </button>
    </div>
  );
};

export const Protocols = () => {
  return (
    <div>
      <div className="flex p-10 justify-center gap-32">
        <Protocol img="eth.png" title={MESSAGE_PLATFORMS.vanilla.name} />
        <Protocol img="push.png" title={MESSAGE_PLATFORMS.push.name} />
        <Protocol img="xmtp.png" title={MESSAGE_PLATFORMS.xmtp.name} />
      </div>
    <p className="text-center text-white w-8/12 mx-auto">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eaque eligendi adipisci obcaecati quod dolor nihil ipsam dignissimos quasi, quia pariatur. Eligendi, quaerat eveniet rem voluptas reiciendis maiores? Quis, molestias iste?</p>
    </div>
  );
};
