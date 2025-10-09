<!-- src/views/admin/Settings.vue -->
<template>
  <div class="min-h-screen p-6 lg:p-8 bg-[#0F1114] text-white font-poppins">
    <div class="max-w-4xl mx-auto space-y-6">
      <h1 class="text-2xl font-bold text-[#E0B4B2]">Settings</h1>

      <div class="bg-[#111214] rounded-2xl p-6 border border-yellow-400/10 shadow">
        <div class="flex gap-4 items-center mb-4">
          <button
            class="px-3 py-2 rounded-md"
            :class="tab === 'profile' ? 'bg-yellow-500 text-[#0F1114] font-semibold' : 'bg-transparent text-gray-300'"
            @click="tab = 'profile'"
          >
            Profile
          </button>
          <button
            class="px-3 py-2 rounded-md"
            :class="tab === 'password' ? 'bg-yellow-500 text-[#0F1114] font-semibold' : 'bg-transparent text-gray-300'"
            @click="tab = 'password'"
          >
            Password
          </button>
        </div>

        <div v-if="loadingProfile" class="animate-pulse">
          <div class="h-4 w-1/3 bg-gray-700 rounded mb-4"></div>
          <div class="h-10 bg-gray-700 rounded w-full"></div>
        </div>

        <!-- PROFILE TAB -->
        <div v-if="tab === 'profile'">
          <form @submit.prevent="submitProfile" class="space-y-4">
            <div class="flex items-center gap-4">
              <div class="w-24 h-24 rounded-full overflow-hidden border-2 border-yellow-400">
                <img :src="previewAvatar || profile.avatar || defaultAvatar" alt="avatar" class="w-full h-full object-cover" />
              </div>

              <div>
                <div class="text-sm text-gray-400">Avatar</div>
                <input type="file" @change="onAvatarSelected" accept="image/*" class="mt-2 text-sm" />
                <div v-if="avatarUploading" class="text-xs text-gray-400 mt-2">Uploading...</div>
              </div>
            </div>

            <div>
              <label class="text-xs text-gray-400">Name</label>
              <input v-model="form.userName" type="text" class="w-full p-3 rounded-md bg-[#0F1114] border border-yellow-400/10" />
            </div>

            <div>
              <label class="text-xs text-gray-400">Email</label>
              <input v-model="form.email" type="email" class="w-full p-3 rounded-md bg-[#0F1114] border border-yellow-400/10" />
            </div>

            <div class="flex items-center gap-3">
              <button :disabled="profileSaving" type="submit" class="bg-yellow-500 text-[#0F1114] px-4 py-2 rounded-md">
                {{ profileSaving ? 'Saving...' : 'Save Profile' }}
              </button>
              <button type="button" @click="reloadProfile" class="text-sm text-gray-400">Reload</button>
            </div>

            <p v-if="profileMessage" :class="profileMessageClass">{{ profileMessage }}</p>
          </form>
        </div>

        <!-- PASSWORD TAB -->
        <div v-if="tab === 'password'">
          <form @submit.prevent="submitPassword" class="space-y-4 max-w-md">
            <div>
              <label class="text-xs text-gray-400">Current password</label>
              <input v-model="passwordForm.currentPassword" type="password" class="w-full p-3 rounded-md bg-[#0F1114] border border-yellow-400/10" />
            </div>

            <div>
              <label class="text-xs text-gray-400">New password</label>
              <input v-model="passwordForm.newPassword" type="password" class="w-full p-3 rounded-md bg-[#0F1114] border border-yellow-400/10" />
            </div>

            <div>
              <label class="text-xs text-gray-400">Confirm new password</label>
              <input v-model="passwordForm.confirmPassword" type="password" class="w-full p-3 rounded-md bg-[#0F1114] border border-yellow-400/10" />
            </div>

            <div class="flex items-center gap-3">
              <button :disabled="passwordSaving" type="submit" class="bg-yellow-500 text-[#0F1114] px-4 py-2 rounded-md">
                {{ passwordSaving ? 'Changing...' : 'Change password' }}
              </button>
            </div>

            <p v-if="passwordMessage" :class="passwordMessageClass">{{ passwordMessage }}</p>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from "vue";
import { getAdminProfile, uploadAdminAvatar, updateAdminProfile, changeAdminPassword } from "@/services/admin";

export default {
  name: "AdminSettings",
  setup() {
    const tab = ref("profile");

    const profile = reactive({
      _id: null,
      userName: "",
      email: "",
      avatar: ""
    });

    const form = reactive({
      userName: "",
      email: ""
    });

    const loadingProfile = ref(true);
    const profileSaving = ref(false);
    const profileMessage = ref("");
    const profileMessageClass = ref("");

    const avatarFile = ref(null);
    const previewAvatar = ref("");
    const avatarUploading = ref(false);

    const passwordForm = reactive({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
    const passwordSaving = ref(false);
    const passwordMessage = ref("");
    const passwordMessageClass = ref("");

    const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/847/847969.png";

    const loadProfile = async () => {
      loadingProfile.value = true;
      try {
        const { data } = await getAdminProfile();
        profile._id = data._id;
        profile.userName = data.userName || "";
        profile.email = data.email || "";
        profile.avatar = data.avatar || "";
        form.userName = profile.userName;
        form.email = profile.email;
      } catch (err) {
        console.error("Failed to fetch admin profile", err);
        profileMessage.value = "Failed to load profile";
        profileMessageClass.value = "text-red-400";
      } finally {
        loadingProfile.value = false;
      }
    };

    onMounted(loadProfile);

    const onAvatarSelected = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      avatarFile.value = file;
      previewAvatar.value = URL.createObjectURL(file);

      // upload immediately
      avatarUploading.value = true;
      try {
        await uploadAdminAvatar(file); // returns { data }
        // after success, reload profile so avatar url from backend/cloudinary persists
        await loadProfile();
        profileMessage.value = "Avatar uploaded";
        profileMessageClass.value = "text-green-400";
      } catch (err) {
        console.error("Avatar upload failed", err);
        profileMessage.value = "Avatar upload failed";
        profileMessageClass.value = "text-red-400";
      } finally {
        avatarUploading.value = false;
      }
    };

    const submitProfile = async () => {
      profileSaving.value = true;
      profileMessage.value = "";
      try {
        const payload = { userName: form.userName, email: form.email };
        const res = await updateAdminProfile(payload);
        profileMessage.value = res.data?.message || "Profile updated";
        profileMessageClass.value = "text-green-400";
        await loadProfile();
      } catch (err) {
        console.error(err);
        profileMessage.value = err.response?.data?.message || "Failed to update profile";
        profileMessageClass.value = "text-red-400";
      } finally {
        profileSaving.value = false;
      }
    };

    const submitPassword = async () => {
      passwordMessage.value = "";
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        passwordMessage.value = "New password and confirmation do not match";
        passwordMessageClass.value = "text-red-400";
        return;
      }
      passwordSaving.value = true;
      try {
        await changeAdminPassword({ currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword });
        passwordMessage.value = "Password changed";
        passwordMessageClass.value = "text-green-400";
        passwordForm.currentPassword = passwordForm.newPassword = passwordForm.confirmPassword = "";
      } catch (err) {
        console.error(err);
        passwordMessage.value = err.response?.data?.message || "Failed to change password";
        passwordMessageClass.value = "text-red-400";
      } finally {
        passwordSaving.value = false;
      }
    };

    const reloadProfile = loadProfile;

    return {
      tab,
      profile,
      form,
      loadProfile,
      loadingProfile,
      profileSaving,
      profileMessage,
      profileMessageClass,
      onAvatarSelected,
      previewAvatar,
      avatarUploading,
      submitProfile,
      defaultAvatar,
      // password
      passwordForm,
      passwordSaving,
      passwordMessage,
      passwordMessageClass,
      submitPassword,
      reloadProfile
    };
  }
};
</script>

<style scoped>
.font-poppins { font-family: "Poppins", sans-serif; }
</style>
