<template lang="pug">
  .app-container
    h1
      | {{name}}
    h2
      | {{account}}
</template>
<script>

export default {
    data() {
        return {
            name: this.$store.getters.name,
            account: this.$store.getters.account
        }
    }
}
</script>