import { createRouter, createWebHistory } from 'vue-router';

// Public
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import VerifyEmail from '../views/VerifyEmail.vue';
import ForgotPassword from '../views/ForgotPassword.vue';
import ResetPassword from '../views/ResetPassword.vue';

// Student
import StudentDashboard from '../views/student/StudentDashboard.vue';
import BrowseCourses from '../views/student/BrowseCourses.vue';
import CourseDetails from '../views/student/CourseDetails.vue';
import MyCourses from '../views/student/MyCourses.vue';
import StudentProfile from '../views/student/StudentProfile.vue';

// Instructor
import InstructorDashboard from '../views/instructor/InstructorDashboard.vue';
import CreateCourse from '../views/instructor/CreateCourse.vue';
import UploadLesson from '../views/instructor/UploadLesson.vue';
import InstructorCourses from '../views/instructor/InstructorCourses.vue';
import InstructorProfile from '../views/instructor/InstructorProfile.vue';

// Admin
import AdminDashboard from '../views/admin/AdminDashboard.vue';
import ManageUsers from '../views/admin/ManageUsers.vue';
import ManageCourses from '../views/admin/ManageCourses.vue';

// Not found
import NotFound from '../views/NotFound.vue';

const routes = [
  // Public
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/verify-email/:token', name: 'VerifyEmail', component: VerifyEmail, props: true },
  { path: '/forgot-password', name: 'ForgotPassword', component: ForgotPassword },
  { path: '/reset-password', name: 'ResetPassword', component: ResetPassword },

  // Student
  { path: '/student', name: 'StudentDashboard', component: StudentDashboard, meta: { requiresAuth: true, role: "student"} },
  { path: '/student/courses', name: 'BrowseCourses', component: BrowseCourses, meta: { requiresAuth: true, role: "student"} },
  { path: '/student/courses/:id', name: 'CourseDetails', component: CourseDetails, meta: { requiresAuth: true, role: "student"} },
  { path: '/student/my-courses', name: 'MyCourses', component: MyCourses, meta: { requiresAuth: true, role: "student"} },
  { path: '/student/profile', name: 'StudentProfile', component: StudentProfile, meta: { requiresAuth: true, role: "student"} },

  // Instructor
  { path: '/instructor/dashboard', name: 'InstructorDashboard', component: InstructorDashboard, meta: { requiresAuth: true, role: "instructor"} },
  { path: '/instructor/create-course', name: 'CreateCourse', component: CreateCourse, meta: { requiresAuth: true, role: "instructor"} },
  { path: '/instructor/upload-lesson', name: 'UploadLesson', component: UploadLesson, meta: { requiresAuth: true, role: "instructor"} },
  { path: '/instructor/courses', name: 'InstructorCourses', component: InstructorCourses, meta: { requiresAuth: true, role: "instructor"} },
  { path: '/instructor/profile', name: 'InstructorProfile', component: InstructorProfile, meta: { requiresAuth: true, role: "instructor"} },

  // Admin
  { path: '/admin/dashboard', name: 'AdminDashboard', component: AdminDashboard, meta: { requiresAuth: true, role: "admin"} },
  { path: '/admin/manage-users', name: 'ManageUsers', component: ManageUsers, meta: { requiresAuth: true, role: "admin"} },
  { path: '/admin/manage-courses', name: 'ManageCourses', component: ManageCourses, meta: { requiresAuth: true, role: "admin"} },

  // Catch-all
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound, },
];

const router = createRouter({ 
  history: createWebHistory(),
  routes,
});

// Auth guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (to.meta.requiresAuth && !token) {
    return next('/login');
  }

  if (to.meta.role && role !== to.meta.role) {
    return next('/');
  }

  next();
});

export default router;