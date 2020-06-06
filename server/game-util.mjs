const Util = {
  createId: function createId() {
    return Math.random().toString(36).slice(-8);
  }
}

export default Util;
