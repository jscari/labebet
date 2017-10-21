<template>
  <input type="number" class="response-number" placeholder="Entrez un nombre"  v-model="currentAnswer"/>
</template>
<script>
export default {
  props: ['bet', 'chose'],
  data () {
    return { currentAnswer: '' };
  },
  watch: {
    currentAnswer: function (val, oldVal) {
      this.chose(parseInt(val, 10));
    }
  },
  methods: {
    cleanAnswer () {
      this.currentAnswer = '';
    }
  }
};
</script>
