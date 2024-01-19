import { useMemo } from "react";
import { NavLink, useParams } from "react-router-dom";
import { useMenuItem } from "../hooks/useMenuItem";
import { NavigationMenuItem } from "../../../types/layout";

export type DisclosureChildItem = {
  item: NavigationMenuItem;
  isChild?: boolean;
  textColor?: string;
  bgColor?: string;
  bgHoverColor?: string;
};

export const DisclosureLeafItem = ({
  item,
  isChild = true,
  textColor,
  bgColor,
  bgHoverColor,
}: DisclosureChildItem) => {
  const params = useParams();
  const [isActive] = useMenuItem(item);
  const sizeStyles = useMemo(
    () =>
      isChild
        ? "block rounded-md py-2 pr-2 pl-9 text-sm leading-6"
        : "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold",
    [isChild]
  );
  const path = useMemo(() => {
    const subpaths = item.path?.split("/");
    if (!subpaths) {
      return item.path;
    }

    let finalPath = "";
    subpaths.forEach((path) => {
      if (!path) {
        return;
      }
      if (path.charAt(0) === ":") {
        const param = path.substring(1);
        finalPath += "/" + params[param];
      } else {
        finalPath += "/" + path;
      }
    });

    return finalPath;
  }, [params, item]);

  return (
    <NavLink
      to={`${path}`}
      className={`${sizeStyles} ${
        isActive
          ? `${bgColor ?? "bg-sky-700"} text-white`
          : `${textColor ?? "text-white"} hover:text-white ${
              bgHoverColor ?? "hover:bg-sky-700"
            }`
      }`}
    >
      {item.icon && (
        <item.icon
          className={`${isActive ? "text-white" : "group-hover:text-white"}
            h-6 w-6 shrink-0
          `}
          aria-hidden="true"
        />
      )}
      {item.name}
    </NavLink>
  );
};
