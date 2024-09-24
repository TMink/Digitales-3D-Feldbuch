<!--
 Created Date: 23.09.2024 10:14:23
 Author: Tobias Mink
 
 Last Modified: 24.09.2024 13:29:16
 Modified By: Tobias Mink
 
 Description: 
 --> This system is being implemented as part of a master's thesis and enables 4D analysis and visualization of the stratigraphy of an excavation

<template>
  <div id="wrapper">
    <Navigation active_tab_prop="1" />

  </div>
</template>

<script>
import Navigation from '../components/Navigation.vue';

export default{
  name: 'StratiTool',
  components: {
    Navigation
  },
  data() {},
  mounted() {}
}

</script>