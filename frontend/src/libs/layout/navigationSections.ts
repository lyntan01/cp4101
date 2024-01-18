import { NavigationMenuItem } from "../../types/layout";
import { Cog6ToothIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import { COURSES, SETTINGS } from "../routes";

export const NAV_SECTIONS: NavigationMenuItem[] = [
  {
    name: "MANAGEMENT",
    children: [
      {
        name: "Courses",
        path: COURSES,
        icon: DocumentTextIcon,
        // children: [
        //   { name: "Teachers", path: TEACHERS },
        //   { name: "Students", path: STUDENTS },
        //   { name: "Admin", path: ADMINS },
        // ],
      },
      //   { name: "FAQ", path: FAQ, icon: QuestionMarkCircleIcon },
    ],
  },
  {
    name: "OTHERS",
    children: [{ name: "Settings", path: SETTINGS, icon: Cog6ToothIcon }],
  },
];
