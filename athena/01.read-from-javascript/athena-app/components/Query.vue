<template>
  <dialog id="queryDialog">
    <div class="VueToNuxtLogo">
      <textarea class="query" :model="query" />
      <button :click="postQuery">
        Query
      </button>
      <div v-if="result != ''" class="result">
        {{ result }}
      </div>
    </div>
    <button :click="closeDlg">
      Close
    </button>
  </dialog>
</template>
<script>
import Axios from 'axios'

export default {
  props: {
    propsQuery: {
      type: Object,
      default: () => ''
    },
    propsResult: {
      type: Object,
      default: () => ''
    }
  },
  data: function () {
    return {
      query: this.propsQuery,
      result: this.propsResult
    }
  },
  mounted() {
    const dlg = document.querySelector('#queryDialog')
    dlg.open = false
  },
  methods: {
    openDlg() {
      const dlg = document.querySelector('#queryDialog')
      dlg.open = false
      dlg.showModal()
    },
    closeDlg() {
      const dlg = document.querySelector('#queryDialog')
      dlg.close()

      this.query = ''
      this.result = ''
    },
    postQuery() {
      Axios.post(`http://${process.env.API_URL_PREFIX}/tables`, { query: this.query })
        .then((res) => {
          this.result = res.data
        })
    }
  }
}
</script>

<style scoped>
.query {
  width: 95%;
  height: 200px;
}
.result {
  white-space: pre;
  width: 95%;
  height: 200px;
  line-height: 120%;
}
</style>
