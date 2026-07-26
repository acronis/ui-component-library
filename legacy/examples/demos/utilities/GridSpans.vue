<template>
  <PreviewGroup>
    <Preview
      name="acv-grid--row-span-2"
      span="12"
    >
      <div class="acv-grid acv-grid--rows-3 acv-grid--cols-2 acv-grid--gap-16">
        <div class="acv-grid--row-span-2  acv-grid--row-start-1  acv-grid--col-start-1 acv-bg-primary pa-8">
          Column 1
        </div>
        <div class="acv-bg-secondary acv-grid--row-start-1  acv-grid--col-start-2 pa-8">
          Column 2
        </div>
        <div class="acv-bg-primary acv-grid--row-start-2  acv-grid--col-start-2 pa-8">
          Column 3
        </div>
        <div class="acv-grid--col-span-2 acv-grid--row-start-3  acv-grid--col-start-1 acv-bg-secondary pa-8">
          Column 4
        </div>
      </div>
    </Preview>
    <Preview
      name="acv-grid--col-span-2"
      span="12"
    >
      <div class="acv-grid acv-grid--rows-2  acv-grid--row-start-1  acv-grid--col-start-1 acv-grid--cols-2 acv-grid--gap-16">
        <div class="acv-grid--col-span-2 acv-bg-secondary pa-8">
          Column 1
        </div>
        <div class="acv-bg-primary acv-grid--row-start-2  acv-grid--col-start-1  pa-8">
          Column 2
        </div>
        <div class="acv-bg-primary acv-grid--row-start-2  acv-grid--col-start-2  pa-8">
          Column 3
        </div>
        <div class="acv-grid--col-span-2 acv-grid--row-start-3  acv-grid--col-start-1  acv-bg-secondary pa-8">
          Column 4
        </div>
      </div>
    </Preview>
  </PreviewGroup>
</template>
