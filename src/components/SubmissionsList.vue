<template>
  <v-list class="pa-1">
    <v-subheader>Submissions</v-subheader>
    <v-list-item-group v-model="item" color="primary">
      <v-list-item v-for="submission in submissions" :key="submission.id">
        <v-list-item-content @click="changeSubmssion(submission.id)">
          {{ submission.id }}
        </v-list-item-content>
      </v-list-item>
      <v-list-item class="d-flex justify-center">
        <v-btn @click="$emit('addSubmission')" color="success" fab small dark>
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-list-item>
    </v-list-item-group>
  </v-list>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "SubmissionsList",
  props: {
    submissions: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      item: 1
    };
  },
  methods: {
    changeSubmssion(id: number) {
      this.$emit("changeSubmission", id);
    }
  }
});
</script>

<style scoped></style>
