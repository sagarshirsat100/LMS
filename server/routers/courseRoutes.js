import express from "express";
import { getAllCourse, getCourseId } from "../controller/courseController";

const courseRouter = express.Router();

courseRouter.get('/all', getAllCourse)
courseRouter.get('/:id', getCourseId)

export default courseRouter;
