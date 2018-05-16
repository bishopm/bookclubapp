<template>
  <div>
    <div class="q-pa-sm">
      <q-input name="isbn" v-model="newbook.isbn" type="text" float-label="Barcode" />
    </div>
    <div id="scanner" class="viewport">
    </div>
  </div>
</template>

<script>
import Quagga from 'quagga'
export default {
  data () {
    return {
      newbook: {title: '', author: '', description: '', image: '', isbn: ''}
    }
  },
  mounted () {
    Quagga.init({
      inputStream: {
        name: 'Live',
        type: 'LiveStream',
        target: '#scanner',
        constraints: {
          width: 640,
          height: 480,
          facingMode: 'environment'
        }
      },
      decoder: {
        readers: ['code_128_reader', 'ean_reader']
      }
    }, function (response) {
      if (response) {
        console.log(response)
        return
      }
      Quagga.start()
      console.log('Quagga started!')
    })
    Quagga.onDetected(this.detected)
  },
  methods: {
    detected (result) {
      if ((result) && (result.codeResult)) {
        this.newbook.isbn = result.codeResult.code
        Quagga.stop()
        this.$router.push('/addbook/' + this.newbook.isbn)
      }
    }
  }
}
</script>

<style>
</style>
