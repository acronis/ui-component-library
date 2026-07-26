<script setup>
  import AcvButton from '@/components/button/button.vue';
  import AcvSpinner from '@/components/spinner/spinner.vue';
</script>

<template>
  <div class="acv-grid-row acv-grid--cols-3">
    <div class="data-loading">
      <AcvSpinner
        class="icon"
        size="large"
      />
      <div class="title">
        Data is loading
      </div>
      <div class="text">
        Wait until it is completed
      </div>
      <div>
        <AcvButton type="ghost">
          Button
        </AcvButton>
      </div>
    </div>
    <div class="data-is-loading">
      <AcvSpinner size="small" />
      Data is loading...
    </div>
    <div class="no-data-found">
      No data found
    </div>
  </div>
</template>

<style scoped>
.data-loading {
  display: grid;
  justify-content: center;
  place-items: center;
  padding: 16px;
  border: 1px solid hsl(0deg 0% 88%);
  border-radius: 4px;
  gap: 8px;
  font-size: var(--acv-font-size-body);
  line-height: var(--acv-font-line-height-regular);

  .title {
    font-weight: var(--acv-font-weight-strong);
  }
}

.data-is-loading {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: var(--acv-font-size-body);
  line-height: var(--acv-font-line-height-regular);
}

.no-data-found {
  font-size: var(--acv-font-size-body);
  line-height: var(--acv-font-line-height-regular);
}
</style>
