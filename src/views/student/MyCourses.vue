<template>
  <div class="space-y-10">
    <!-- ENROLLED COURSES -->
    <section>
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-2xl font-semibold text-gray-800">My Courses</h1>
      </div>

      <div v-if="loading" class="text-gray-500 text-center py-20">
        Loading your courses...
      </div>

      <div v-else-if="enrolledCourses.length === 0" class="text-gray-500 text-center py-20">
        You haven’t enrolled in any courses yet.
      </div>

      <div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="course in enrolledCourses"
          :key="course._id"
          class="bg-white rounded-xl shadow-sm hover:shadow-md transition p-4 flex flex-col"
        >
          <div class="w-full h-40 bg-gray-100 rounded-lg overflow-hidden">
            <img
              :src="course.thumbnail || '/images/default-course.jpg'"
              alt="Course thumbnail"
              class="w-full h-full object-cover"
            />
          </div>

          <div class="mt-4 flex-1">
            <h2 class="text-lg font-semibold text-gray-800 line-clamp-2">
              {{ course.title }}
            </h2>
            <p class="text-sm text-gray-500 mt-1">
              {{ course.instructor?.name || 'Unknown Instructor' }}
            </p>

            <!-- Progress -->
            <div class="mt-3">
              <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  class="h-full bg-yellow-500 rounded-full"
                  :style="{ width: course.progress + '%' }"
                ></div>
              </div>
              <p class="text-xs text-gray-500 mt-1">{{ course.progress || 0 }}% Complete</p>
            </div>
          </div>

          <button
            class="mt-4 w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 rounded-lg transition"
            @click="goToCourse(course._id)"
          >
            Continue
          </button>
        </div>
      </div>
    </section>

    <!-- BROWSE MORE COURSES -->
    <section>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold text-gray-800">Browse More Courses</h2>
      </div>

      <div v-if="availableCourses.length === 0" class="text-gray-500 text-center py-20">
        No new courses available right now.
      </div>

      <div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="course in availableCourses"
          :key="course._id"
          class="bg-white rounded-xl shadow-sm hover:shadow-md transition p-4 flex flex-col"
        >
          <div class="w-full h-40 bg-gray-100 rounded-lg overflow-hidden">
            <img
              :src="course.thumbnail || '/images/default-course.jpg'"
              alt="Course thumbnail"
              class="w-full h-full object-cover"
            />
          </div>

          <div class="mt-4 flex-1">
            <h2 class="text-lg font-semibold text-gray-800 line-clamp-2">
              {{ course.title }}
            </h2>
            <p class="text-sm text-gray-500 mt-1">
              {{ course.instructor?.name || 'Unknown Instructor' }}
            </p>
            <p class="text-sm text-gray-600 mt-3 line-clamp-2">
              {{ course.description }}
            </p>
          </div>

          <button
            class="mt-4 w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 rounded-lg transition"
            @click="enroll(course._id)"
            :disabled="enrollingId === course._id"
          >
            <span v-if="enrollingId === course._id">Enrolling...</span>
            <span v-else>Enroll Now</span>
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getEnrolledCourses, getAllCourses, enrollInCourse } from "@/services/student";

const enrolledCourses = ref([]);
const availableCourses = ref([]);
const loading = ref(true);
const enrollingId = ref(null);

const fetchCourses = async () => {
  try {
    loading.value = true;
    const userId = localStorage.getItem("userId");

    const [enrolledRes, allRes] = await Promise.all([
      getEnrolledCourses(userId),
      getAllCourses(),
    ]);

    enrolledCourses.value = enrolledRes.data || [];
    const enrolledIds = enrolledCourses.value.map((c) => c._id);

    availableCourses.value = (allRes.data || []).filter(
      (c) => !enrolledIds.includes(c._id)
    );
  } catch (err) {
    console.error("Error fetching courses:", err);
  } finally {
    loading.value = false;
  }
};

const enroll = async (courseId) => {
  try {
    enrollingId.value = courseId;
    await enrollInCourse(courseId);
    alert("✅ Enrolled successfully!");
    fetchCourses();
  } catch (err) {
    console.error("Error enrolling:", err);
    alert("Something went wrong while enrolling.");
  } finally {
    enrollingId.value = null;
  }
};

const goToCourse = (id) => {
  window.location.href = `/student/course/${id}`;
};

onMounted(fetchCourses);
</script>
