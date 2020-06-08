const Util = {
  createId: function createId(prefix = false) {
    return (prefix ? prefix + '_' : '') + Math.random().toString(36).slice(-8);
  }
}

export default Util;
