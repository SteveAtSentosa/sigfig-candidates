export default {
  responses: {},
  responseTimeouts: {},

  set(query, response, timeoutInMinutes = 5) {
    this.responses[query] = response;

    delete this.responseTimeouts[query];

    this.responseTimeouts[query] = setTimeout(() => {
      delete this.responses[query];
    }, timeoutInMinutes * 60 * 1000);
  },

  update(query, response) {
    if (this.responses[query]) {
      this.responses[query] = response;
    }
  },

  get(query) {
    return this.responses[query];
  },

  contains(query) {
    return Boolean(this.responses[query]);
  },

  reset() {
    this.responses = {};
    this.responseTimeouts = {};
  },
};
