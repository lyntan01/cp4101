import { Request, Response, Router } from "express";
import { CourseService } from "../services/CourseService";
import { Prisma } from "@prisma/client";
import { restrictBodyId } from "../middleware/validationMiddleware";

const courseRouter = Router();
const courseService = new CourseService();

/**
 * POST /courses/
 * Creates a new course.
 */
courseRouter.post("/", async (req: Request, res: Response) => {
  try {
    const courseData: Prisma.CourseCreateInput = req.body;
    const newCourse = await courseService.createCourse(courseData);
    return res.status(201).json(newCourse);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

/**
 * POST /courses/enrollStudents
 * Enrolls students in an existing course.
 */
courseRouter.post("/enrollStudents", async (req: Request, res: Response) => {
  try {
    const {
      studentEmails,
      courseId,
    }: { studentEmails: string[]; courseId: string } = req.body;

    // Validate input
    if (!studentEmails || !courseId) {
      return res.status(400).json({
        error: "Missing studentEmails or courseId",
      });
    }

    const updatedCourse = await courseService.enrollStudents(
      studentEmails,
      courseId
    );
    return res.status(201).json(updatedCourse);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

/**
 * GET /courses/
 * Retrieves a list of all courses.
 */
courseRouter.get("/", async (req: Request, res: Response) => {
  try {
    const courses = await courseService.getAllCourses();
    return res.status(200).json(courses);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * GET /courses/{courseId}
 * Retrieves a course by its unique ID.
 */
courseRouter.get("/:courseId", async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    const course = await courseService.getCourseById(courseId);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    return res.status(200).json(course);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * GET /courses/teacher/{teacher}
 * Retrieves all created course by a teacher ID.
 */
courseRouter.get("/teacher/:teacherId", async (req: Request, res: Response) => {
  try {
    const { teacherId } = req.params;
    const courses = await courseService.getCreatedCoursesByTeacherId(teacherId);

    if (!courses) {
      return res.status(404).json({ error: "Courses not found" });
    }

    return res.status(200).json(courses);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /courses/{courseId}
 * Updates a course's information by its unique ID.
 */
courseRouter.put(
  "/:courseId",
  restrictBodyId,
  async (req: Request, res: Response) => {
    try {
      const { courseId } = req.params;
      const courseData: Prisma.CourseUpdateInput = req.body;

      const updatedCourse = await courseService.updateCourse(
        courseId,
        courseData
      );

      if (!updatedCourse) {
        return res.status(404).json({ error: "Course not found" });
      }

      return res.status(200).json(updatedCourse);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

/**
 * DELETE /courses/{courseId}
 * Deletes a course by its unique ID.
 */
courseRouter.delete("/:courseId", async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;

    const deletedCourse = await courseService.deleteCourse(courseId);

    if (!deletedCourse) {
      return res.status(404).json({ error: "Course not found" });
    }

    return res.status(204).send();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

export default courseRouter;
