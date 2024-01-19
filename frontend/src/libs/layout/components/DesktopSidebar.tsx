import { SideBarSection } from "./SideBarSection";
import { Avatar } from "./Avatar";
import { LogoutButton } from "./LogoutButton";
import { useAuth } from "../../../wrappers/AuthContext";
import { CodeLearnerLogo } from "../../logo";
import { User } from "../../../types/user";
import { NavigationMenuItem } from "../../../types/layout";

export type DesktopSidebarProps = {
  navigationMenu: NavigationMenuItem[];
};

export const DesktopSideBar = ({ navigationMenu }: DesktopSidebarProps) => {
  const { user } = useAuth<User>();

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-1 lg:flex lg:w-72 lg:flex-col">
      {/* Sidebar component, swap this element with another sidebar if you like */}
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-sky-600 border-r px-6">
        <div className="flex h-24 shrink-0 items-center mt-4 justify-center">
          <CodeLearnerLogo className="h-32" />
        </div>
        <nav className="flex flex-1 flex-col">
          <ul className="flex flex-1 flex-col gap-y-7 justify-between content-between">
            {navigationMenu.map((section) => (
              <li key={section.name}>
                <SideBarSection section={section} key={section.name} />
              </li>
            ))}
            <li className="-mx-6 flex gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-text-primary justify-between">
              {/* @TODO: Use AuthContext to pass in name here */}
              <Avatar firstName={user?.name ?? "User"} />
              {/* @TODO: Use AuthContext to sign out from here */}
              <LogoutButton />
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};
