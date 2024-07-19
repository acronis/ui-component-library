<template>
  <preview-group>
    <preview name="Default">
      <acv-widget-wrapper
        :title="title"
      >
        <template #header-aside>
          <acv-button
            type="ghost"
            icon="i-console-log-o--16"
          />
        </template>
        <acv-stacked-area-chart
          :data="dataThree"
          :legend="false"
          width="280px"
          height="200px"
        />
        <template #footer>
          <acv-icon
            name="i-exclamation-triangle--16"
            color="fixed-warning"
          />
          <acv-link class="acv-text acv-text--body-24 ml-8">
            1 alert
          </acv-link>
        </template>
        <template #footer-aside>
          <span class="acv-text acv-text--caption">Last check: 2 minutes ago</span>
        </template>
      </acv-widget-wrapper>
    </preview>
    <preview name="Wide">
      <acv-widget-wrapper
        class="widget-three"
        :title="title"
      >
        <template #header-aside>
          <acv-button
            type="ghost"
            icon="i-console-log-o--16"
          />
        </template>
        <acv-stacked-area-chart
          :data="dataThree"
          :legend="false"
          width="280px"
          height="200px"
        />
        <acv-pie-chart :data="data" />
        <template #footer>
          <acv-icon
            name="i-exclamation-triangle--16"
            color="fixed-warning"
          />
          <acv-link class="acv-text acv-text--body-24 ml-8">
            1 alert
          </acv-link>
        </template>
        <template #footer-aside>
          <span class="acv-text acv-text--caption">Last check: 2 minutes ago</span>
        </template>
      </acv-widget-wrapper>
    </preview>
    <preview name="With table widget">
      <acv-widget-wrapper
        class="widget-table"
        no-padding
        min-height="0px"
      >
        <acv-table
          row-key="id"
          :data="tableData"
          size="compact"
        >
          <acv-table-column
            prop="date"
            label="Date"
            width="180"
          />
          <acv-table-column
            prop="name"
            label="Name"
            show-overflow-tooltip
            width="180"
          />
          <acv-table-column
            prop="address"
            label="Address"
            show-overflow-tooltip
          />
        </acv-table>
        <template #footer>
          <acv-icon
            name="i-exclamation-triangle--16"
            color="fixed-warning"
          />
          <acv-link class="acv-text acv-text--body-24 ml-8">
            1 alert
          </acv-link>
        </template>
        <template #footer-aside>
          <span class="acv-text acv-text--caption">Last check: 2 minutes ago</span>
        </template>
      </acv-widget-wrapper>
    </preview>
    <preview name="Header and footer with long text strings">
      <acv-widget-wrapper
        :title="longHeaderText"
      >
        <template #header-aside>
          <acv-button
            type="ghost"
            icon="i-console-log-o--16"
          />
        </template>
        <acv-table
          row-key="id"
          :data="tableData"
          size="compact"
        >
          <acv-table-column
            prop="date"
            label="Date"
            width="180"
          />
          <acv-table-column
            prop="name"
            label="Name"
            show-overflow-tooltip
            width="180"
          />
          <acv-table-column
            prop="address"
            label="Address"
            show-overflow-tooltip
          />
        </acv-table>
        <template #footer>
          <acv-link class="acv-text acv-text--body-24 ml-8">
            {{ longFooterText }}
          </acv-link>
        </template>
        <template #footer-aside>
          <span class="acv-text acv-text--caption">Last check: 2 minutes ago</span>
        </template>
      </acv-widget-wrapper>
    </preview>
    <preview name="Dynamic positioning">
      <div />
    </preview>
  </preview-group>
</template>
