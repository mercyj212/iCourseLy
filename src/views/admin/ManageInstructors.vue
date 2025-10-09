<template>
  <div class="min-h-screen p-6 lg:p-8 bg-[#0F1114] text-white font-poppins">
    <!-- TOP BAR -->
    <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 gap-4">
      <h1 class="text-2xl font-bold text-[#E0B4B2]">Manage Instructors</h1>

      <div class="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
        <input
          v-model="search"
          placeholder="Search by name or email..."
          class="bg-[#111214] placeholder-gray-400 text-sm px-4 py-2 rounded-md outline-none w-full sm:w-64"
        />

        <select v-model="filterStatus" class="bg-[#111214] px-3 py-2 rounded-md text-sm">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <button
          @click="openModal()"
          class="bg-yellow-500 hover:bg-yellow-600 text-[#0F1114] font-semibold px-4 py-2 rounded-md transition"
        >
          Add Instructor
        </button>
      </div>
    </div>

    <!-- TABLE VIEW -->
    <div class="overflow-x-auto rounded-2xl shadow border border-yellow-400/10 bg-[#111214] mb-8">
      <table class="min-w-full text-left text-sm divide-y divide-yellow-400/10">
        <thead class="bg-[#111214] text-gray-400">
          <tr>
            <th class="px-4 py-3">Instructor</th>
            <th class="px-4 py-3">Email</th>
            <th class="px-4 py-3">Role</th>
            <th class="px-4 py-3">Status</th>
            <th class="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-yellow-400/10">
          <tr
            v-for="inst in filteredInstructors"
            :key="inst._id"
            class="hover:bg-[#151515] transition"
          >
            <td class="px-4 py-3 flex items-center gap-3">
              <img :src="inst.avatar || defaultAvatar" class="w-10 h-10 rounded-full object-cover" />
              <span>{{ inst.name }}</span>
            </td>
            <td class="px-4 py-3">{{ inst.email }}</td>
            <td class="px-4 py-3 capitalize">{{ inst.role }}</td>
            <td class="px-4 py-3">
              <span
                :class="{
                  'bg-green-500/20 text-green-400': inst.status === 'active',
                  'bg-red-500/20 text-red-400': inst.status === 'inactive',
                }"
                class="px-3 py-1 rounded-full text-xs font-semibold"
              >
                {{ inst.status }}
              </span>
            </td>
            <td class="px-4 py-3 flex gap-2">
              <button @click="openModal(inst)" class="text-purple-500 hover:text-purple-400 transition">Edit</button>
              <button @click="deleteInstructor(inst._id)" class="text-red-500 hover:text-red-400 transition">Delete</button>
            </td>
          </tr>
          <tr v-if="filteredInstructors.length === 0">
            <td colspan="6" class="py-6 text-center text-gray-500">No instructors found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ADD / EDIT MODAL -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div class="bg-[#111214] rounded-2xl p-6 w-full max-w-lg relative">
        <button @click="closeModal" class="absolute top-4 right-4 text-gray-400 hover:text-white">&times;</button>
        <h2 class="text-xl font-bold text-[#E0B4B2] mb-4">{{ isEditing ? 'Edit Instructor' : 'Add Instructor' }}</h2>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <input v-model="form.name" type="text" placeholder="Instructor Name"
            class="w-full p-3 rounded-lg bg-[#0F1114] border border-yellow-400 text-white focus:ring-2 focus:ring-yellow-500 outline-none" />
          <input v-model="form.email" type="email" placeholder="Email"
            class="w-full p-3 rounded-lg bg-[#0F1114] border border-yellow-400 text-white focus:ring-2 focus:ring-yellow-500 outline-none" />
          <select v-model="form.status" class="w-full p-3 rounded-lg bg-[#0F1114] border border-yellow-400 text-white">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <button type="submit"
            class="bg-yellow-500 hover:bg-yellow-600 text-[#0F1114] font-semibold px-6 py-2 rounded-md w-full mt-3">
            {{ loading ? 'Saving...' : isEditing ? 'Save Changes' : 'Add Instructor' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { getAllUsers, deleteUser, updateUserRole } from "../../services/admin";

export default {
  name: "InstructorsPage",
  setup() {
    const instructors = ref([]);
    const search = ref("");
    const filterStatus = ref("");
    const showModal = ref(false);
    const isEditing = ref(false);
    const loading = ref(false);
    const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/847/847969.png";

    const form = ref({
      _id: null,
      name: "",
      email: "",
      status: "active",
      role: "instructor",
    });

    const loadInstructors = async () => {
      try {
        const { data } = await getAllUsers();
        instructors.value = data.filter((user) => user.role === "instructor");
      } catch (err) {
        console.error("Failed to fetch instructors", err);
      }
    };

    const openModal = (inst = null) => {
      if (inst) {
        form.value = { ...inst };
        isEditing.value = true;
      } else {
        form.value = { _id: null, name: "", email: "", status: "active", role: "instructor" };
        isEditing.value = false;
      }
      showModal.value = true;
    };

    const closeModal = () => {
      showModal.value = false;
      isEditing.value = false;
    };

    const handleSubmit = async () => {
      loading.value = true;
      try {
        if (isEditing.value) {
          await updateUserRole(form.value._id, form.value.role);
        } else {
          alert("Adding instructors manually not yet supported (backend needed).");
        }
        await loadInstructors();
        closeModal();
      } catch (err) {
        console.error("Failed to save instructor", err);
      } finally {
        loading.value = false;
      }
    };

    const deleteInstructor = async (id) => {
      if (!confirm("Are you sure you want to delete this instructor?")) return;
      try {
        await deleteUser(id);
        await loadInstructors();
      } catch (err) {
        console.error("Failed to delete instructor", err);
      }
    };

    const filteredInstructors = computed(() =>
      instructors.value.filter((i) => {
        const matchesSearch =
          i.name.toLowerCase().includes(search.value.toLowerCase()) ||
          i.email.toLowerCase().includes(search.value.toLowerCase());
        const matchesStatus = filterStatus.value ? i.status === filterStatus.value : true;
        return matchesSearch && matchesStatus;
      })
    );

    onMounted(loadInstructors);

    return {
      instructors,
      search,
      filterStatus,
      filteredInstructors,
      defaultAvatar,
      showModal,
      form,
      loading,
      isEditing,
      openModal,
      closeModal,
      handleSubmit,
      deleteInstructor,
    };
  },
};
</script>

<style scoped>
.font-poppins {
  font-family: "Poppins", sans-serif;
}
</style>
