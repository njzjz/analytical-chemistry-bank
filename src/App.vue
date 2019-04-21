<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>分析化学题库</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>

    <v-content>
      <search/>
    </v-content>
  </v-app>
</template>

<script>
import search from './components/search'

export default {
  name: 'App',
  components: {
    search
  },
  data () {
    return {
      //
    }
  }
}
</script>
