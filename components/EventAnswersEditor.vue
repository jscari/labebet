<template>
  <div class="column">
    <div class="field" v-for="(question,i) in questions" :key="'q'+i">
        <div class="label" >{{question}} </div>
        <select class="select" v-model="myAnswers[i]">
          <option v-for="(choice, c) in choices[i]" :key="'q'+i+'c'+c" :value="choice.value">{{choice.value}} ({{choice.count}} vote)</option>
        </select>
    </div>
  <div>
    <button v-on:click="save" class="button is-primary">Sauvegarder</button>
  </div>
  </div>
</template>
<script>
export default {
  components: {},
  data () {
    return {
      myAnswers: this.answers.map(a => a[0].value),
      choices: this.answers.map(a => a),
      saveTimeout: null
    };
  },
  props: ['answers', 'questions'],
  methods: {
    save () {
      this.$store.dispatch('saveCurrentEventAnswers', this.myAnswers).then(() => { document.location = '/admin/events'; });
    }
  },
  watch: {}
};
</script>
<style>
</style>
