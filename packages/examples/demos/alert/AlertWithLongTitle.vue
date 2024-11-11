<script>
  import AcvAlert from '@/components/alert/alert.vue';

  export default {
    components: { AcvAlert },
    data() {
      return {
        description: 'LoremipsumdolorsitametconsecteturadipiscingAcvitseddoeiusmodtemporincididuntutlaboreetdoloremagnaaliquaUtenimadminimveniamquisnostrudexercitationullamcolaborisnisiutaliquipexeacommodoconsequatDuisauteiruredolorinreprehenderitinvoluptatevAcvitessecillumdoloreeufugiatnullapariaturExcepteursintoccaecatcupidatatnonproidentsuntinculpaquiofficiadeseruntmollitanimidestlaborum.'
      };
    },
    methods: {
      onClose() {
        console.log('Alert is closed');
      }
    }
  };
</script>

<template>
  <div class="qa-alert-title">
    <AcvAlert
      type="info"
      :title="description"
      :description="description"
      @close="onClose"
    />
  </div>
</template>

<style scoped>
  .qa-alert-title {
    width: 50%;
  }
</style>
