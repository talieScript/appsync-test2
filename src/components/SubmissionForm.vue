<template>
  <v-container class="">
    <h1 class="h1">
      Submission Form
    </h1>
    <h3 class="h3">
      Vessel Infomation
    </h3>
    <v-row>
      <v-col cols="12" sm="6">
        <v-text-field v-model="vesselName" label="Vessel Name" outlined />
      </v-col>

      <v-col cols="12" sm="6">
        <v-text-field
          type="number"
          v-model="vesselImo"
          label="Vessel IMO "
          outlined
        />
      </v-col>
    </v-row>
    <h3 class="h5">
      Date
    </h3>
    <v-row>
      <v-col cols="12" sm="6">
        <v-menu
          v-model="datePicker"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="date"
              label="Date"
              readonly
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="date"
            @input="datePicker = false"
          ></v-date-picker>
        </v-menu>
      </v-col>
      <v-col class="d-flex" cols="12" sm="6">
        <v-select
          v-model="offset"
          :items="offsets"
          label="Offset"
          outlined
        ></v-select>
      </v-col>
    </v-row>
    <h3 class="h5">
      Fuel
    </h3>
    <v-row>
      <v-col sm="4">
        <v-text-field type="number" v-model="fuels.LGO" label="LGO" outlined />
      </v-col>
      <v-col sm="4">
        <v-text-field type="number" v-model="fuels.IFO" label="IFO" outlined />
      </v-col>
      <v-col sm="4">
        <v-text-field type="number" v-model="fuels.MGO" label="MGO" outlined />
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <v-row class="d-flex justify-center">
      <v-col sm="6">
        <v-text-field
          type="number"
          v-model="totalFuel"
          label="Total Fuel"
          :error="!totalFuelValid"
          outlined
        />
      </v-col>
    </v-row>
    <v-row class="d-flex justify-center">
      <v-col sm="6">
        <v-btn @click="submit" color="primary" block>
          submit
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import { Submission } from "../App.vue";

export default Vue.extend({
  name: "SubmssionForm",
  props: {
    active: {
      type: Object,
      required: true
    } as PropOptions<Submission>
  },
  data() {
    return {
      id: 0,
      vesselName: "",
      vesselImo: 0,
      date: "",
      offset: 0,
      fuels: {
        LGO: 0,
        IFO: 0,
        MGO: 0
      },
      totalFuel: 0,
      datePicker: false
    };
  },
  computed: {
    totalFuelValid(): boolean {
      const calculatedFuel = Object.values(this.fuels).reduce((a, b) => {
        return a + Number(b);
      }, 0);
      return calculatedFuel === this.totalFuel;
    },
    offsets(): number[] {
      const offsets = [];
      for (let i = -12; i < 13; i++) {
        offsets.push(i);
      }
      return offsets;
    },
    structuredSubmission(): Submission {
      return {
        id: this.id,
        vesseName: this.vesselName,
        vesselImo: this.vesselImo,
        dateOffset: {
          date: this.date,
          offset: this.offset
        },
        fuels: this.fuels,
        totalFuel: this.totalFuel
      };
    }
  },
  watch: {
    active: {
      immediate: true,
      handler(submission): void {
        this.id = submission.id;
        this.vesselName = submission.vesselName;
        this.vesselImo = submission.vesselImo;
        this.date = submission.dateOffset.date.substr(0, 10);
        this.offset = submission.dateOffset.offset;
        this.fuels = submission.fuels;
        this.totalFuel = submission.totalFuel;
      }
    }
  },
  methods: {
    submit() {
      console.log("here");
      this.$emit("submit", this.structuredSubmission);
    }
  }
});
</script>

<style scoped></style>
