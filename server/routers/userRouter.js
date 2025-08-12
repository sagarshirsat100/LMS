import express from 'express'
import {getUserCourseProgress, getUserData, purchaseCourse, userEnrolledCourses, updateCourseProgress, addUserRating} from '../controller/userController.js'

const userRouter = express.Router();

userRouter.get('/data', getUserData);
userRouter.get('/enrolled-courses', userEnrolledCourses);
userRouter.post('/purchase', purchaseCourse); 
userRouter.post('/update-course-progess', updateCourseProgress); 
userRouter.post('/get-course-progess', getUserCourseProgress); 
userRouter.post('/add-rating', addUserRating); 

export default userRouter;