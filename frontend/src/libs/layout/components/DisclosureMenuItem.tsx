import { Disclosure, DisclosureButtonProps } from "@headlessui/react";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { NavLink } from "react-router-dom";
import { DisclosureLeafItem } from "./DisclosureLeafItem";
import { useMenuItem } from "../hooks/useMenuItem";
import { ElementType, useMemo } from "react";
import { NavigationMenuItem } from "../../../types/layout";

export type DisclosureMenuItemProps = {
  item: NavigationMenuItem;
};

export const DisclosureMenuItem = ({ item }: DisclosureMenuItemProps) => {
  const [isActive] = useMenuItem(item);

  const disclosureProps = useMemo<Partial<DisclosureButtonProps<ElementType>>>(
    () =>
      item.path
        ? {
            as: NavLink,
            to: item.path,
          }
        : {},
    [item]
  );

  return (
    <Disclosure as="div">
      {({ open }) => (
        <>
          <Disclosure.Button
            {...disclosureProps}
            className={`${
              isActive
                ? "bg-sky-700 text-white"
                : "text-white-200 hover:text-white hover:bg-sky-700"
            } " group flex items-center w-full text-left rounded-md p-2 gap-x-3 text-sm leading-6 font-semibold"`}
          >
            {item.icon && (
              <item.icon
                className={`${
                  isActive
                    ? "text-white"
                    : "text-white-200 group-hover:text-white"
                } " h-6 w-6 shrink-0"`}
                aria-hidden="true"
              />
            )}
            {item.name}
            <ChevronRightIcon
              className={`${
                isActive
                  ? "rotate-90 text-white"
                  : "text-white-200 group-hover:text-white"
              } " ml-auto h-5 w-5 shrink-0"`}
              aria-hidden="true"
            />
          </Disclosure.Button>
          <Disclosure.Panel as="ul" className="mt-1 px-2">
            {item.children?.map((subItem) => (
              <DisclosureLeafItem key={subItem.name} item={subItem} />
            ))}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};
