<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-8">
      <h1 class="text-3xl font-semibold text-gray-800 mb-8">
        Manage Courses
      </h1>

      <!-- ========== Create New Course Form ========== -->
      <div class="border-b border-gray-200 pb-6 mb-8">
        <h2 class="text-xl font-medium mb-4 text-gray-700">Create New Course</h2>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <input
              v-model="form.title"
              type="text"
              placeholder="Course title"
              class="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              v-model="form.category"
              type="text"
              placeholder="Category"
              class="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <textarea
              v-model="form.description"
              rows="3"
              placeholder="Course description"
              class="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <input
              v-model="form.price"
              type="number"
              placeholder="Price"
              class="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              v-model="form.instructorId"
              type="text"
              placeholder="Instructor ID"
              class="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <input
              type="file"
              @change="handleFileUpload"
              accept="image/*"
              class="border p-2 w-full rounded-lg"
            />
            <div v-if="previewImage" class="mt-3">
              <img
                :src="previewImage"
                alt="Preview"
                class="w-48 h-32 object-cover rounded-lg shadow"
              />
            </div>
          </div>

          <button
            type="submit"
            class="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition w-full md:w-auto"
            :disabled="loading"
          >
            {{ loading ? "Creating..." : "Create Course" }}
          </button>

          <p v-if="message" class="text-green-600 mt-2 text-sm">{{ message }}</p>
        </form>
      </div>

      <!-- ========== Existing Courses Table ========== -->
      <div>
        <h2 class="text-xl font-medium mb-4 text-gray-700">All Courses</h2>

        <div v-if="courses.length === 0" class="text-gray-500 text-center py-10">
          No courses available.
        </div>

        <table v-else class="w-full border-collapse text-sm">
          <thead>
            <tr class="bg-gray-100 text-gray-700 text-left">
              <th class="py-3 px-4 border-b">Title</th>
              <th class="py-3 px-4 border-b">Category</th>
              <th class="py-3 px-4 border-b">Price</th>
              <th class="py-3 px-4 border-b">Instructor</th>
              <th class="py-3 px-4 border-b text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="course in courses"
              :key="course._id"
              class="hover:bg-gray-50"
            >
              <td class="py-3 px-4 border-b">{{ course.title }}</td>
              <td class="py-3 px-4 border-b">{{ course.category }}</td>
              <td class="py-3 px-4 border-b">${{ course.price }}</td>
              <td class="py-3 px-4 border-b">
                {{ course.instructorId?.userName || "Unknown" }}
              </td>
              <td class="py-3 px-4 border-b text-center space-x-3">
                <button
                  @click="approve(course._id)"
                  class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                >
                  Approve
                </button>
                <button
                  @click="remove(course._id)"
                  class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  getAllCoursesAdmin,
  approveCourse,
  deleteCourseAdmin,
  createCourseAdmin,
} from "@/services/admin";

const courses = ref([]);
const loading = ref(false);
const message = ref("");
const form = ref({
  title: "",
  description: "",
  category: "",
  price: "",
  instructorId: "",
});
const coverImage = ref(null);
const previewImage = ref(null);

// fetch all courses
const fetchCourses = async () => {
  try {
    const { data } = await getAllCoursesAdmin();
    courses.value = data;
  } catch (err) {
    console.error(err);
  }
};

// approve course
const approve = async (id) => {
  try {
    await approveCourse(id);
    message.value = "Course approved successfully!";
    fetchCourses();
  } catch (err) {
    alert("Failed to approve course");
  }
};

// delete course
const remove = async (id) => {
  if (!confirm("Are you sure you want to delete this course?")) return;
  try {
    await deleteCourseAdmin(id);
    message.value = "Course deleted!";
    fetchCourses();
  } catch (err) {
    alert("Failed to delete course");
  }
};

// handle file upload
const handleFileUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    coverImage.value = file;
    previewImage.value = URL.createObjectURL(file);
  }
};

// submit create form
const handleSubmit = async () => {
  if (
    !form.value.title ||
    !form.value.description ||
    !form.value.category ||
    !form.value.price ||
    !form.value.instructorId
  ) {
    alert("Please fill in all fields");
    return;
  }

  try {
    loading.value = true;
    const formData = new FormData();
    Object.entries(form.value).forEach(([key, value]) => {
      formData.append(key, value);
    });
    if (coverImage.value) {
      formData.append("coverImage", coverImage.value);
    }

    await createCourseAdmin(formData);
    message.value = "Course created successfully!";
    form.value = { title: "", description: "", category: "", price: "", instructorId: "" };
    coverImage.value = null;
    previewImage.value = null;
    fetchCourses();
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Error creating course");
  } finally {
    loading.value = false;
  }
};

onMounted(fetchCourses);
</script>
