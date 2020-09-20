<template>
  <v-dialog v-model="dialog" width="500">
    <template v-slot:activator="{ on, attrs }">
      <v-img :src="image" v-bind="attrs" v-on="on"></v-img>
    </template>
    <v-img :src="image"></v-img>
  </v-dialog>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
  }),
  props: ["image"],
};
</script>

