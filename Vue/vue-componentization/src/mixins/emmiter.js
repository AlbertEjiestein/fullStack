export default {
  methods: {
    dispatch(eventName, data) {
      let parent = this.$parent;
      while(parent) {
        parent.$emit(eventName, data);
        parent = parent.$parent;
      }
    },
    boardcast(eventName, data) {
      boardcast.call(this, eventName, data);
    }
  }
}

function boardcast(eventName, data) {
  this.$children.forEach(child => {
    child.$emit(eventName, data);
    if(child.$children.length) {
      boardcast.call(child, eventName, data);
    }
  })
}