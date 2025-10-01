<template>
  <div :style="{ width: size + 'px', height: size + 'px', margin: '0 auto' }" ref="container"></div>
</template>

<script>
import lottie from "lottie-web";

export default {
  name: "LottieAnimation",
  props: {
    path: { type: String, required: true },   // e.g. "/animations/mail.json"
    loop: { type: Boolean, default: true },
    autoplay: { type: Boolean, default: true },
    size: { type: Number, default: 180 }
  },
  mounted() {
    this.anim = lottie.loadAnimation({
      container: this.$refs.container,
      renderer: "svg",
      loop: this.loop,
      autoplay: this.autoplay,
      path: this.path,
    });
  },
  beforeUnmount() {
    if (this.anim) {
      this.anim.destroy();
      this.anim = null;
    }
  },
};
</script>
