<template>
  <v-btn text :loading="loader" @click="deleteClick" color="error">Usuń</v-btn>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "DeleteEvent",
  data: () => ({
    loader: false,
  }),
  props: ["eventRef"],
  methods: {
    ...mapActions(["removeEvent"]),
    async deleteClick() {
      this.loader = true;
      let eventDoc = await this.eventRef.get();
      let event = eventDoc.data();
      event.id = eventDoc.id;
      await this.removeEvent(event, null, null);
      this.loader = false;
      this.$emit("eventRemoved", event);
    },
  },
};
</script>
