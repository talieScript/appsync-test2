import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";

// vue-apollo makes it easier for your vue app to interact with the apollo-client
// inside the aws-appsync package, which, in turn, coordinates the data exchanges
// between the front end store and the backend store and deals with caching etc.
import VueApollo from "vue-apollo";
import AWSAppSyncClient from "aws-appsync";

const config = {
  url:
    "https://bu2qdjxiuvb4tgkgpfsbs2x3t4.appsync-api.eu-west-1.amazonaws.com/graphql",
  region: "eu-west-1",
  auth: {
    type: "API_KEY",
    apiKey: "da2-dv3wf7vvzbfc3pwqewli6no4kq"
  },
  disableOffline: true // this was added to stop an issue with duplicated list items
};
// The default fetchPolicy is cache-first. This means that if data
// is returned from the cache, no network request will be sent. If
// a new item is in a list, this will not be realised. So here we change
// the policy so that network requests are always sent after data is returned
// from the cache.
const options = {
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network"
    }
  }
};

const client = new AWSAppSyncClient(config, options);
const appsyncProvider = new VueApollo({
  defaultClient: client
});

Vue.use(VueApollo);
Vue.use(Vuetify);
Vue.config.productionTip = false;

new Vue({
  vuetify,
  render: h => h(App),
  apolloProvider: appsyncProvider
}).$mount("#app");
