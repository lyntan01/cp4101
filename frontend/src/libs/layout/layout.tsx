import { Outlet } from "react-router-dom";
import { DesktopSideBar } from "./components/DesktopSidebar";
import { NavigationMenuItem } from "../../types/layout";

export type SidebarLayoutProps = {
  navigationMenu: NavigationMenuItem[];
  className?: string;
};

export const SidebarLayout = ({
  navigationMenu,
  className,
}: SidebarLayoutProps) => {
  return (
    <div className={`relative overflow-y-scroll h-full ${className}`}>
      <DesktopSideBar navigationMenu={navigationMenu} />

      <main className="py-10 lg:pl-72 h-full">
        <div className="px-4 sm:px-6 lg:px-8 h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
