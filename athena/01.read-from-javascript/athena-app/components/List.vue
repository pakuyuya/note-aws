<template>
  <div>
    Tables:
    <div v-for="(table, index) in tables" v-bind:key="index">
      <a href="#">{{ table }}</a>
    </div>
  </div>
</template>

<script>
import Axios from 'axios'
// import Query from '~/components/Query.vue'

export default {
  components: {
  },
  props: {
  },
  data: function () {
    return {
      tables: this.props_tables
    }
  },
  mounted() {
    this.refleshTables()
  },
  methods: {
    refleshTables() {
      Axios.get(`${process.env.API_URL_PREFIX}/tables`, { responseType: 'json' })
        .then((res) => {
          this.tables = res.data.map(d => d.Data[0].VarCharValue)
        })
    },
    showQueryDialog(table) {
    }
  }
}
</script>
<style>
</style>
