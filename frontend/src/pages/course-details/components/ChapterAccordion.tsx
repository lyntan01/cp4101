import { useState } from "react";
import { Chapter } from "../../../types/models";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import { Icon } from "./AccordionIcon";

interface ChapterAccordionProps {
  chapters: Chapter[];
}

export function ChapterAccordion({ chapters }: ChapterAccordionProps) {
  const [open, setOpen] = useState<string[]>([]);

  const handleOpen = (id: string) => {
    if (open.includes(id)) {
      setOpen(open.filter((item: string) => item !== id)); // Remove id from open array
    } else {
      setOpen([...open, id]); // Add id to open array
    }
  };

  return (
    <div className="mt-8">
      {chapters.length === 0 ? (
        <p className="mt-8 text-gray-500">No chapters added yet.</p>
      ) : (
        chapters.map((chapter) => (
          <Accordion
            key={chapter.id}
            open={open.includes(chapter.id)}
            icon={<Icon id={chapter.id} open={open} />}
            placeholder=""
            className="mb-8 rounded-lg border border-blue-gray-100"
          >
            <AccordionHeader
              onClick={() => handleOpen(chapter.id)}
              placeholder=""
              className="bg-slate-100 px-6 text-base font-medium text-slate-800"
            >
              {chapter.name}
            </AccordionHeader>
            <AccordionBody className="px-6">
              {chapter.pages.length === 0 ? (
                <p>No pages yet</p>
              ) : (
                chapter.pages.map((page) => <div>PAGE TO DO</div>)
              )}
            </AccordionBody>
          </Accordion>
        ))
      )}
    </div>
  );
}
