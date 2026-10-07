// in-memory stand-in for @react-native-async-storage/async-storage
const store = new Map();
const AsyncStorage = {
  async getItem(k) { return store.has(k) ? store.get(k) : null; },
  async setItem(k, v) { store.set(k, String(v)); },
  async removeItem(k) { store.delete(k); },
  async clear() { store.clear(); },
  async multiGet(keys) { return keys.map((k) => [k, store.has(k) ? store.get(k) : null]); },
  async multiSet(pairs) { pairs.forEach(([k, v]) => store.set(k, String(v))); },
  async getAllKeys() { return [...store.keys()]; },
  __dump: () => Object.fromEntries(store),
};
export default AsyncStorage;
