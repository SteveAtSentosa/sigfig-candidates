export default {
  draftKey(key) {
    return `formDraft_${key}`;
  },

  set(formKey, data) {
    window.sessionStorage.setItem(this.draftKey(formKey), JSON.stringify(data));
  },

  get(formKey) {
    const draft = window.sessionStorage.getItem(this.draftKey(formKey));
    return draft ? JSON.parse(draft) : null;
  },

  clear(formKey) {
    window.sessionStorage.removeItem(this.draftKey(formKey));
  },
};
