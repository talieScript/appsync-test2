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
        @deleteSubmission="deleteSubmission"
        :submissions="listSubmissions.items"
      />
    </v-navigation-drawer>

    <v-content>
      <submssion-form
        v-if="activeSubmission.id"
        @submit="submit"
        :active="activeSubmission"
      />
      <p v-else class="text-center text--secondary">
        Select or create a submission.
      </p>
    </v-content>
    <v-snackbar :timeout="0" :value="showSnack">
      {{ snackText }}
      <v-btn color="info" text @click="showSnack = false">
        Close
      </v-btn>
    </v-snackbar>
  </v-app>
</template>

<script lang="ts">
// @ts-nocheck
import Vue from "vue";
import SubmissionsList from "./components/SubmissionsList.vue";
import SubmssionForm from "./components/SubmissionForm.vue";
import { v4 as uuidv4 } from "uuid";

import gql from "graphql-tag";
import {
  createSubmission,
  deleteSubmission,
  updateSubmission
} from "./graphql/mutations.js";
import { listSubmissions } from "./graphql/queries.js";
import {
  onCreateSubmission,
  onDeleteSubmission,
  onUpdateSubmission
} from "./graphql/subscriptions.js";

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
      menu: false,
      activeSubmission: {},
      hydrated: false,
      blockSnack: false,
      showSnack: false,
      snackText: ""
    };
  },
  methods: {
    deleteSubmission(submission: Submission) {
      this.blockSnack = true;
      this.$apollo.mutate({
        mutation: gql(deleteSubmission),
        variables: { input: { id: submission.id } },
        optimisticResponse: {
          __typename: "Mutation",
          deleteSubmission: submission
        }
      });
    },
    changeActiveSubmission(id: string) {
      this.activeSubmission = this.listSubmissions.items.find(submission => {
        return submission.id == id;
      }) as Submission;
    },
    /**
     * submit function here
     */
    submit(submission) {
      this.blockSnack = true;
      this.$apollo.mutate({
        mutation: gql(updateSubmission),
        variables: { input: { ...submission } },
        __typename: "Mutation",
        updateSubmission: {
          ...submission,
          __typename: "Submission"
        }
      });
    },
    addSubmission() {
      const emptySubmission = {
        id: uuidv4(),
        vesselName: "vessel",
        vesselImo: "1",
        dateOffset: {
          date: new Date().toISOString(),
          offset: 0
        },
        fuels: {
          LGO: 0,
          IFO: 0,
          MGO: 0
        },
        totalFuel: 0
      };
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
        },
        update(cache, { data: { createSubmission } }) {
          // read the data from the cache for this query
          const query = cache.readQuery({ query: gql(listSubmissions) });
          // add our submission from the mutation to the end
          query.listSubmissions.items.push(createSubmission);
          // write the data back to the cache
          cache.writeQuery({
            query: gql(listSubmissions),
            data: query
          });
        }
      });
      // set active submission to new submission instantly
      this.activeSubmission = emptySubmission;
    }
  },
  apollo: {
    listSubmissions: {
      query: gql(listSubmissions),
      subscribeToMore: [
        {
          document: gql(onCreateSubmission),
          updateQuery(prev, { subscriptionData: { data } }) {
            // this will stop a duplicate submission being added in the browser that made the change
            const idInListAlready = prev.listSubmissions.items.some(
              submission => submission.id === data.onCreateSubmission.id
            );
            if (idInListAlready) {
              return prev;
            }
            return {
              listSubmissions: {
                ...prev.listSubmissions,
                items: prev.listSubmissions.items.concat([
                  data.onCreateSubmission
                ])
              }
            };
          }
        },
        {
          document: gql(onUpdateSubmission),
          updateQuery(prev, { subscriptionData: { data } }) {
            // check is active submission
            if (data.onUpdateSubmission.id === this.activeSubmission.id) {
              this.activeSubmission = data.onUpdateSubmission;
              this.snackText = "Submission has been updated by another user.";
              if (!this.blockSnack) {
                this.showSnack = true;
              }
              this.blockSnack = false;
            }
          }
        },
        {
          document: gql(onDeleteSubmission),
          updateQuery(prev, { subscriptionData: { data } }) {
            // check deleted submission was active
            if (data.onDeleteSubmission.id === this.activeSubmission.id) {
              if (!this.blockSnack) {
                this.snackText = "Submission deleted by another user";
                this.showSnack = true;
              }
              this.activeSubmission = {};
              this.blockSnack = false;
            }
            return {
              listSubmissions: {
                ...prev.listSubmissions,
                items: prev.listSubmissions.items.filter(
                  person => person.id !== data.onDeleteSubmission.id
                )
              }
            };
          }
        }
      ]
    }
  },
  async mounted() {
    this.$apollo.provider.defaultClient.hydrated().then(() => {
      this.hydrated = true;
    });
  }
});
</script>
