import { Switch } from "@mantine/core";

export default function Preferences({
  isWorldcoinFilterChecked,
  setIsWorldcoinFilterChecked,
}: {
  isWorldcoinFilterChecked: boolean;
  setIsWorldcoinFilterChecked: any;
}) {
  return (
    <div className="px-20">
      <div>
        <h1>Quality filters</h1>
        <p>
          Choose the notifications you want to see, and those you want to avoid.
        </p>

        <div className="flex items-center">
          <Switch
            size="xl"
            onLabel="ON"
            offLabel="OFF"
            checked={isWorldcoinFilterChecked}
            onChange={() => {
              setIsWorldcoinFilterChecked(!isWorldcoinFilterChecked);
            }}
          />
          <p className="ml-3 text-xl">Only show verified users</p>
        </div>
      </div>
    </div>
  );
}
