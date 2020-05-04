# Data sources test app

For creating prototypes to test for [snapshot](https://github.com/StratumFive/snapshot-backend) data source solutions.

This is to be used as a mock submission form and submissions list.

### How to test
Remove the `fakeSubmssions` & the dummy data folder. Replace this with the data source data that you are testing.

Make sure whatever data you are using it is in the same format as what is presented in the `Submissions` interface.

Add the submit/save functionality of the data source framework you are testing in the `submit` function.

### What to keep in mind while testing

#####
- How it works while offline.
- Synchronise with server
- Multi user edits. Edit in one browser observe changes in another
- What are its bandwidth requirements?
- How disruptive would it be to the existing Snapshot architecture?
- Is the project well maintained?
- How easy is it to use?
- How good are the docs?
- How opinionated about data is it?

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
