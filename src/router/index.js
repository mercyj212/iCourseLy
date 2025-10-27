import { createRouter, createWebHistory } from 'vue-router';

// Public
import Home from '@/views/Home.vue';
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';
import VerifyEmail from '@/views/VerifyEmail.vue';
import ForgotPassword from '@/views/ForgotPassword.vue';
import ResetPassword from '@/views/ResetPassword.vue';

// Student
import StudentLayout from '@/components/StudentLayout.vue';
import StudentDashboard from '@/views/student/StudentDashboard.vue';
import BrowseCourses from '@/views/student/BrowseCourses.vue';
import CourseDetails from '@/views/student/CourseDetails.vue';
import MyCourses from '@/views/student/MyCourses.vue';
import StudentProfile from '@/views/student/StudentProfile.vue';

// Instructor
import InstructorDashboard from '@/views/instructor/InstructorDashboard.vue';
import CreateCourse from '@/views/instructor/CreateCourse.vue';
import UploadLesson from '@/views/instructor/UploadLesson.vue';
import InstructorCourses from '@/views/instructor/InstructorCourses.vue';
import InstructorProfile from '@/views/instructor/InstructorProfile.vue';

// Admin
import AdminLayout from '@/components/AdminLayout.vue';
import AdminDashboard from '@/views/admin/AdminDashboard.vue';
import ManageInstructors from '@/views/admin/ManageInstructors.vue';
import ManageCourses from '@/views/admin/ManageCourses.vue';
import ManageStudents from '@/views/admin/ManageStudents.vue';
import AdminAnalytics from '@/views/admin/AdminAnalytics.vue';
import AdminSettings from '@/views/admin/AdminSettings.vue';

// Not found
import NotFound from '@/views/NotFound.vue';

const routes = [
  // Public
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/verify-email', name: 'VerifyEmail', component: VerifyEmail },
  { path: '/verify-email/:token', name: 'VerifyEmailToken', component: VerifyEmail, props: true },
  { path: '/forgot-password', name: 'ForgotPassword', component: ForgotPassword },
  { path: '/reset-password/:token', name: 'ResetPassword', component: ResetPassword },

  // Student
 {
  path: '/student',
  component: StudentLayout,
  meta: { requiresAuth: true, role: 'student' },
  children: [
    { path: 'dashboard', name: 'StudentDashboard', component: StudentDashboard },
    { path: 'my-courses', name: 'MyCourses', component: MyCourses },
    { path: 'profile', name: 'StudentProfile', component: StudentProfile },

    // placeholders for sidebar routes
    { path: 'lessons', component: () => import('@/views/student/Lessons.vue') },
    { path: 'assignments', component: () => import('@/views/student/Assignments.vue') },
    { path: 'progress', component: () => import('@/views/student/Progress.vue') },
    { path: 'achievements', component: () => import('@/views/student/Achievements.vue') },
    { path: 'streaks', component: () => import('@/views/student/Streaks.vue') },
    { path: 'community', component: () => import('@/views/student/Community.vue') },
    { path: 'schedule', component: () => import('@/views/student/Schedule.vue') },
    { path: 'notes', component: () => import('@/views/student/Notes.vue') },
    { path: 'path', component: () => import('@/views/student/LearningPath.vue') },
    { path: 'certificates', component: () => import('@/views/student/Certificates.vue') },
    { path: 'payments', component: () => import('@/views/student/Payments.vue') },
    { path: 'notifications', component: () => import('@/views/student/Notifications.vue') },
  ],
},


  // Instructor
  { path: '/instructor/dashboard', name: 'InstructorDashboard', component: InstructorDashboard, meta: { requiresAuth: true, role: 'instructor' } },
  { path: '/instructor/create-course', name: 'CreateCourse', component: CreateCourse, meta: { requiresAuth: true, role: 'instructor' } },
  { path: '/instructor/upload-lesson', name: 'UploadLesson', component: UploadLesson, meta: { requiresAuth: true, role: 'instructor' } },
  { path: '/instructor/courses', name: 'InstructorCourses', component: InstructorCourses, meta: { requiresAuth: true, role: 'instructor' } },
  { path: '/instructor/profile', name: 'InstructorProfile', component: InstructorProfile, meta: { requiresAuth: true, role: 'instructor' } },

  // Admin (with layout)
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, role: 'admin' },
    children: [
      { path: 'dashboard', name: 'AdminDashboard', component: AdminDashboard },
      { path: 'manage-instructors', name: 'ManageInstructors', component: ManageInstructors },
      { path: 'manage-courses', name: 'ManageCourses', component: ManageCourses },
      { path: 'manage-students', name: 'ManageStudents', component: ManageStudents },
      { path: 'analytics', name: 'AdminAnalytics', component: AdminAnalytics },
      { path: 'settings', name: 'AdminSettings', component: AdminSettings },
    ],
  },

  // Catch-all
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Auth Guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('accessToken');
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
