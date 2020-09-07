<template>
  <div class="schedule">
    <v-container>
      <Calendar/>
      <AddEvent/>
    </v-container>
  </div>
</template>

<script>

import Calendar from '@/components/Calendar.vue';
import AddEvent from '@/components/AddEvent.vue';

export default {
  name: "Schedule",
  components: {
    Calendar,
    AddEvent,
  },

}
</script>

<style>

</style>