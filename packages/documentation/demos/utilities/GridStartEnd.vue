<template>
  <preview-group>
    <preview
      name="acv-grid--col-start / acv-grid--col-end"
      span="12"
    >
      <div class="acv-grid acv-grid--cols-6 acv-grid--gap-16">
        <div class="acv-grid--row-start-1 acv-grid--col-start-2  acv-grid--col-end-5 acv-bg--brand-light pa-8">
          Column 1
        </div>
        <div class="acv-grid--row-start-2 acv-grid--col-start-1 acv-grid--col-end-3 acv-bg--brand-light pa-8">
          Column 2
        </div>
        <div class="acv-grid--row-start-2 acv-grid--col-start-4 acv-grid--col-end-6  acv-grid--col-span-2 acv-bg--brand-light pa-8">
          Column 3
        </div>
        <div class="acv-grid--row-start-3 acv-grid--col-start-2 acv-grid--col-end-5 acv-bg--brand-light pa-8">
          Column 4
        </div>
      </div>
    </preview>
    <preview
      name="acv-grid--row-start / acv-grid--row-end"
      span="12"
    >
      <div class="acv-grid acv-grid--rows-3 acv-grid--flow-col acv-grid--gap-16">
        <div class="acv-grid--row-start-2 acv-grid--row-span-2 acv-bg--brand-light pa-8">
          Column 1
        </div>
        <div class="acv-grid--row-end-3 acv-grid--row-span-2 acv-bg--brand-light pa-8">
          Column 2
        </div>
        <div class="acv-grid--row-start-1 acv-grid--row-end-4 acv-bg--brand-light pa-8">
          Column 3
        </div>
      </div>
    </preview>
  </preview-group>
</template>
