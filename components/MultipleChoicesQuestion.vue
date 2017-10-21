<template>
  <div>
    <div v-for="choice in question.choices" class="response-mcq" v-on:click="selectChoice(choice)" v-bind:key="choice" v-bind:class="{ active: isActive(choice) }">{{choice}}</div>
  </div>
</template>
<script>
export default {
  props: ['question', 'chose'],
  data () {
    return { currentAnswer: '' };
  },
  computed: {
  },
  methods: {
    selectChoice (choice) {
      this.chose(choice);
      this.currentAnswer = choice;
    },
    isActive (choice) {
      return choice === this.currentAnswer;
    },
    cleanAnswer () {
      this.currentAnswer = '';
    }
  }
};
</script>
