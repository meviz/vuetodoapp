<template>
  <v-app id="inspire">
    <router-view/>
    
  </v-app>
</template>

<script>
import { db } from './firebase/firebase.js';


export default {
  name: 'App',
  data() {
    return {
      users: {}
    }
  }, 
};
</script>
