import { Tab } from "@headlessui/react";
import { classNames } from "../../utils/classNames";

export const AnalyticsPage = ({ key }: { key: number }) => {
  return (
    <Tab.Panel
      key={key}
      className={classNames(
        "rounded-xl bg-white p-3",
        "ring-white/60 ring-offset-2 ring-offset-blue-400"
      )}
    >
      <p>Analytics</p>
    </Tab.Panel>
  );
};
