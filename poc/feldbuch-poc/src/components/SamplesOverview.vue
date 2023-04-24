<template>
  <div id="wrapper">
    <Navigation/>

    <v-form>
      <v-subheader v-if="samples.length === 0"> Bisher wurde keine Probe angelegt</v-subheader>
      <v-list>
        <template v-for="(sample, i) in samples">
          <v-list-item v-on:click="modifySample(sample.id)">
            <v-list-item-content>
              <v-list-item-title> {{ sample.type }} </v-list-item-title>
              <v-list-item-subtitle> {{ sample.description }} </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-divider v-if="i !== samples.length - 1 "></v-divider>
        </template>
      </v-list>
      <v-btn v-on:click="modifySample('new')" color="primary"> Probe hinzufügen </v-btn>
    </v-form>
  </div>
  
</template>

<script>
import Navigation from './Navigation.vue'
import axios from 'axios'
import VueCookies from 'vue-cookies'

export default {
  name: 'SamplesOverview',
  components: {
    Navigation
  },
  methods: {
    //retrieve all samples
    getSamples() {
      var context = this;

      axios({
        method: 'get',
        url: '/samples',
        responseType: 'json'
      })
      .then(function (response) {
        for (let item of response.data) {
          context.samples.push(item);
        }
      })
      .catch(error => {
        if (!error.response) {
          this.errorStatus = 'Error: Network Error';
        } else {
          this.errorStatus = error.response.data.message;
        }
      });
    },
    modifySample(item_id) {
      if (item_id !== 'new') {
        VueCookies.set('currentSample', item_id)

      }
      this.$router.push({ name: 'SampleCreation', params: { sample_id: item_id } })
    }
  },
  created() {
    this.getSamples();
  },
  data() {
    return {
      samples: []
    };
  }
}
</script>

<style scoped>

  #wrapper {
    height: 100%;
  }
</style>
