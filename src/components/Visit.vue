<template>
  <v-dialog v-model="dialog" width="800">
    <template v-slot:activator="{ on, attrs }">
      <v-list-item v-bind="attrs" v-on="on">
        <v-list-item-content>
          <v-list-item-title>{{ event.name }}</v-list-item-title>
          <v-list-item-subtitle>{{ event.start }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </template>
    <v-card>
      <v-card-title>Szczegóły zabiegu</v-card-title>
      <v-card-text class="black--text">
        <div class="caption">Klient</div>
        <div class="subtitle-1">{{event.clientName}}</div>
        <div class="caption mt-1">Zabieg</div>
        <div class="subtitle-1">{{event.name}}</div>
        <div class="caption mt-1">Termin</div>
        <div class="subtitle-1">{{event.start}}</div>
        <div class="caption mt-1">Ocena</div>
        <div class="subtitle-1">{{event.rate}}</div>
        <div class="caption mt-1">Zdjęcia</div>
        <v-row v-if="event.imageUrls.length > 0">
          <v-col v-for="image in event.imageUrls" :key="image" cols="12" md="4">
            <VisitImage :image="image" />
          </v-col>
        </v-row>
        <div v-else class="subtitle-1">Brak zdjęć</div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import VisitImage from "@/components/VisitImage";
export default {
  props: ["event"],
  components: {
    VisitImage,
  },
  data: () => ({
    dialog: false,
  }),
};
</script>
