<template>
  <v-app v-if="hydrated">
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-btn @click="menu = !menu" text>
          <v-icon>mdi-menu</v-icon>
          <span class="ml-2">Submissions</span>
        </v-btn>
      </div>

      <v-spacer></v-spacer>

      <v-img
        alt="Stratum Logo"
        class="shrink mr-2"
        contain
        src="https://res-2.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_256,w_256,f_auto,q_auto:eco/41873246e73b8cf3ed5f"
        transition="scale-transition"
        width="150"
      />
    </v-app-bar>

    <v-navigation-drawer v-model="menu" absolute temporary>
      <SubmissionsList
        @changeSubmission="changeActiveSubmission"
        @addSubmission="addSubmission"
        :submissions="submissions"
      />
    </v-navigation-drawer>

    <v-content>
      <submssion-form
        v-if="activeSubmission.id"
        @submit="submit"
        :active="activeSubmission"
      />
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import SubmissionsList from "./components/SubmissionsList.vue";
import fakeSubmssions from "./dummyData/submissions";
import SubmssionForm from "./components/SubmissionForm.vue";
import { v4 as uuidv4 } from "uuid";

import gql from "graphql-tag";
import { createSubmission } from "./graphql/mutations.js";
import { listSubmissions } from "@graphql/queries.js";

export interface Submission {
  id: number;
  vesselName: string;
  vesselImo: number;
  dateOffset: {
    // iso string
    date: string;
    // + or - offset
    offset: number;
  };
  fuels: {
    LGO: number;
    IFO: number;
    MGO: number;
  };
  // sum of fuels
  totalFuel: number;
}

export default Vue.extend({
  name: "App",
  components: {
    SubmissionsList,
    SubmssionForm
  },
  data() {
    return {
      menu: true,
      submissions: [],
      activeSubmission: {},
      hydrated: false
    };
  },
  methods: {
    setActiveSubmission(value) {
      this.activeSubmission = value;
    },
    changeActiveSubmission(id: string) {
      this.activeSubmission = this.submissions.find(submission => {
        return submission.id == id;
      }) as Submission;
    },
    /**
     * submit function here
     */
    submit(submission) {
      console.log(submission);
    },
    addSubmission() {
      const emptySubmission = {
        id: uuidv4(),
        vesselName: "vessel",
        vesselImo: "1"
      };
      console.log(emptySubmission);
      this.$apollo.mutate({
        mutation: gql(createSubmission),
        variables: { input: emptySubmission },
        optimisticResponse: {
          // we stub this user with a temporary id before the actual record
          // is returned from the backend. Because this temporary id is a number
          // rather than a string like the real ids, we can use that difference
          // to effect a style change in the ui
          __typename: "Mutation",
          createSubmission: {
            ...emptySubmission,
            __typename: "Submission"
          }
        }
      });
    }
  },
  async mounted() {
    this.submissions = fakeSubmssions;
    this.activeSubmission = this.submissions[0];
    this.$apollo.provider.defaultClient.hydrated().then(() => {
      this.hydrated = true;
    });
  }
});
</script>
