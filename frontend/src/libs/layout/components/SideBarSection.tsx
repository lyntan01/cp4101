import React from "react";
import { DisclosureMenuItem } from "./DisclosureMenuItem";
import { DisclosureLeafItem } from "./DisclosureLeafItem";
import { NavigationMenuItem } from "../../../types/layout";

export type SideBarSection = {
  section: NavigationMenuItem;
};

export const SideBarSection = ({ section }: SideBarSection) => {
  return (
    <>
      {section.name && (
        <div className="text-xs font-semibold leading-6 text-text-primary">
          {section.name}
        </div>
      )}
      <ul className="-mx-2 space-y-1 list-none">
        {section.children?.map((item) => (
          <li key={item.name}>
            {(item.children && (
              <DisclosureMenuItem key={item.name} item={item} />
            )) || (
              <DisclosureLeafItem isChild={false} key={item.name} item={item} />
            )}
          </li>
        ))}
      </ul>
    </>
  );
};
