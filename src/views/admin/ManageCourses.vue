<template>
  <div class="min-h-screen p-6 lg:p-8 bg-[#0F1114] text-white font-poppins">
    <!-- ===== TOP BAR ===== -->
    <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 gap-4">
      <h1 class="text-2xl font-bold text-[#E0B4B2]">Manage Courses</h1>

      <div class="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
        <input
          v-model="search"
          placeholder="Search by course name, instructor, category..."
          class="bg-[#111214] placeholder-gray-400 text-sm px-4 py-2 rounded-md outline-none w-full sm:w-64"
        />

        <select v-model="filterStatus" class="bg-[#111214] px-3 py-2 rounded-md text-sm">
          <option value="">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>

        <select v-model="filterCategory" class="bg-[#111214] px-3 py-2 rounded-md text-sm">
          <option value="">All Categories</option>
          <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
        </select>

        <button @click="showModal = true"
          class="bg-yellow-500 hover:bg-yellow-600 text-[#0F1114] font-semibold px-4 py-2 rounded-md transition">
          Add Course
        </button>
      </div>
    </div>

    <!-- ===== COURSES TABLE ===== -->
    <div class="overflow-x-auto rounded-2xl shadow border border-yellow-400/10 bg-[#111214] mb-8">
      <table class="min-w-full text-left text-sm divide-y divide-yellow-400/10">
        <thead class="bg-[#111214] text-gray-400">
          <tr>
            <th class="px-4 py-3">Course</th>
            <th class="px-4 py-3">Instructor</th>
            <th class="px-4 py-3">Students</th>
            <th class="px-4 py-3">Status</th>
            <th class="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-yellow-400/10">
          <tr v-for="course in filteredCourses" :key="course._id" class="hover:bg-[#151515] transition">
            <td class="px-4 py-3 flex items-center gap-3">
              <img :src="course.coverImage?.url || defaultCover" alt="cover" class="w-12 h-12 rounded-md object-cover" />
              <span>{{ course.title }}</span>
            </td>
            <td class="px-4 py-3">{{ course.instructorName }}</td>
            <td class="px-4 py-3">{{ course.studentsEnrolled }}</td>
            <td class="px-4 py-3">
              <span
                :class="{
                  'bg-green-500/20 text-green-400': course.status === 'published',
                  'bg-yellow-500/20 text-yellow-400': course.status === 'draft',
                }"
                class="px-3 py-1 rounded-full text-xs font-semibold"
              >
                {{ course.status }}
              </span>
            </td>
            <td class="px-4 py-3 flex gap-2">
              <button @click="editCourse(course)" class="text-purple-500 hover:text-purple-400 transition">Edit</button>
              <button @click="deleteCourse(course)" class="text-red-500 hover:text-red-400 transition">Delete</button>
            </td>
          </tr>
          <tr v-if="filteredCourses.length === 0">
            <td colspan="5" class="py-6 text-center text-gray-500">No courses found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ===== COURSES CARD VIEW ===== -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="course in filteredCourses" :key="course._id"
        class="bg-[#111214] rounded-2xl p-4 shadow border border-yellow-400/10 hover:-translate-y-1 transition transform">
        <img :src="course.coverImage?.url || defaultCover" alt="cover" class="w-full h-36 object-cover rounded-md mb-3" />
        <h3 class="font-bold text-lg text-[#E0B4B2]">{{ course.title }}</h3>
        <p class="text-gray-400 text-sm mb-2">{{ course.instructorName }}</p>
        <p class="text-gray-400 text-xs mb-2">Students: {{ course.studentsEnrolled }}</p>
        <span
          :class="{
            'bg-green-500/20 text-green-400': course.status === 'published',
            'bg-yellow-500/20 text-yellow-400': course.status === 'draft',
          }"
          class="px-3 py-1 rounded-full text-xs font-semibold mb-2 inline-block"
        >
          {{ course.status }}
        </span>
        <div class="flex justify-between mt-3">
          <button @click="editCourse(course)" class="text-purple-500 hover:text-purple-400 transition text-sm">Edit</button>
          <button @click="deleteCourse(course)" class="text-red-500 hover:text-red-400 transition text-sm">Delete</button>
        </div>
      </div>
    </div>

    <!-- ===== ADD COURSE MODAL ===== -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div class="bg-[#111214] rounded-2xl p-6 w-full max-w-lg relative">
        <button @click="closeModal" class="absolute top-4 right-4 text-gray-400 hover:text-white">&times;</button>
        <h2 class="text-xl font-bold text-[#E0B4B2] mb-4">Create New Course</h2>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <input
            v-model="form.title"
            type="text"
            placeholder="Course title"
            class="w-full p-3 rounded-lg bg-[#0F1114] border border-yellow-400 text-white focus:ring-2 focus:ring-yellow-500 outline-none"
          />
          <textarea
            v-model="form.description"
            rows="3"
            placeholder="Course description"
            class="w-full p-3 rounded-lg bg-[#0F1114] border border-yellow-400 text-white focus:ring-2 focus:ring-yellow-500 outline-none"
          ></textarea>
          <div class="grid grid-cols-2 gap-4">
            <input
              v-model="form.category"
              type="text"
              placeholder="Category"
              class="p-3 rounded-lg bg-[#0F1114] border border-yellow-400 text-white focus:ring-2 focus:ring-yellow-500 outline-none"
            />
            <input
              v-model="form.price"
              type="number"
              placeholder="Price"
              class="p-3 rounded-lg bg-[#0F1114] border border-yellow-400 text-white focus:ring-2 focus:ring-yellow-500 outline-none"
            />
          </div>
          <input
            v-model="form.instructorId"
            type="text"
            placeholder="Instructor ID"
            class="w-full p-3 rounded-lg bg-[#0F1114] border border-yellow-400 text-white focus:ring-2 focus:ring-yellow-500 outline-none"
          />
          <input type="file" @change="handleFileUpload" accept="image/*" class="w-full p-2 rounded-lg bg-[#0F1114] border border-yellow-400 text-white" />
          <div v-if="previewImage" class="mt-2">
            <img :src="previewImage" class="w-48 h-32 object-cover rounded-lg" />
          </div>

          <button type="submit"
            class="bg-yellow-500 hover:bg-yellow-600 text-[#0F1114] font-semibold px-6 py-2 rounded-md w-full mt-3">
            {{ loading ? "Creating..." : "Create Course" }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { getAllCoursesAdmin, deleteCourseAdmin, createCourseAdmin } from "@/services/admin";

export default {
  name: "CoursesPage",
  setup() {
    const courses = ref([]);
    const search = ref("");
    const filterStatus = ref("");
    const filterCategory = ref("");
    const showModal = ref(false);
    const loading = ref(false);
    const previewImage = ref(null);
    const defaultCover = "https://cdn-icons-png.flaticon.com/512/847/847969.png";

    const categories = ["Development", "Design", "Marketing", "Business", "Photography"];

    const form = ref({
      title: "",
      description: "",
      category: "",
      price: "",
      instructorId: "",
    });

    const loadCourses = async () => {
      try {
        const { data } = await getAllCoursesAdmin();
        courses.value = data.map(c => ({
          ...c,
          instructorName: c.instructorId?.userName || "Unknown",
          studentsEnrolled: c.students?.length || 0,
          status: c.isPublished ? "published" : "draft"
        }));
      } catch (err) {
        console.error("Failed to load courses", err);
      }
    };

    const deleteCourse = async (course) => {
      if (!confirm(`Delete course "${course.title}"?`)) return;
      try {
        await deleteCourseAdmin(course._id);
        courses.value = courses.value.filter(c => c._id !== course._id);
      } catch (err) {
        console.error("Failed to delete course", err);
      }
    };

    const editCourse = (course) => {
      console.log("Edit course", course);
    };

    const openAddCourseModal = () => { showModal.value = true; };
    const closeModal = () => {
      showModal.value = false;
      form.value = { title: "", description: "", category: "", price: "", instructorId: "" };
      previewImage.value = null;
    };

    const handleFileUpload = (e) => {
      const file = e.target.files[0];
      if (file) previewImage.value = URL.createObjectURL(file);
    };

    const handleSubmit = async () => {
      if (!form.value.title || !form.value.description || !form.value.category || !form.value.price || !form.value.instructorId) {
        alert("Please fill all fields");
        return;
      }

      try {
        loading.value = true;
        const formData = new FormData();
        Object.entries(form.value).forEach(([k, v]) => formData.append(k, v));
        if (previewImage.value) formData.append("coverImage", previewImage.value);
        await createCourseAdmin(formData);
        closeModal();
        loadCourses();
      } catch (err) {
        console.error(err);
        alert("Failed to create course");
      } finally {
        loading.value = false;
      }
    };

    const filteredCourses = computed(() => {
      return courses.value.filter(c => {
        const matchesSearch = c.title.toLowerCase().includes(search.value.toLowerCase());
        const matchesStatus = filterStatus.value ? c.status === filterStatus.value : true;
        const matchesCategory = filterCategory.value ? c.category === filterCategory.value : true;
        return matchesSearch && matchesStatus && matchesCategory;
      });
    });

    onMounted(loadCourses);

    return {
      courses, search, filterStatus, filterCategory, filteredCourses, categories, defaultCover,
      deleteCourse, editCourse, showModal, openAddCourseModal, closeModal,
      form, previewImage, handleFileUpload, handleSubmit, loading
    };
  }
};
</script>

<style scoped>
.font-poppins { font-family: "Poppins", sans-serif; }
</style>
