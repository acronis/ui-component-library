<script>
  import { AcvOption, AcvSelect } from '@/components';

  export default {
    components: {
      AcvSelect,
      AcvOption
    },
    data() {
      return {
        serverSearch: {
          single: '',
          singleOptions: [],
          singleLoading: false,
          singleScrollLoading: false,
          singleScrollCurser: 0,
          singleScrollEnd: false,
          singleSearchCount: 0,
          multiple: [],
          multipleOptions: [],
          multipleLoading: false,
          multipleScrollLoading: false,
          multipleScrollCurser: 0,
          multipleScrollEnd: false,
          multipleSearchCount: 0
        },
      };
    },
    methods: {
      remoteMethodSingle(query) {
        this.serverSearch.singleLoading = true;
        this.serverSearch.singleScrollEnd = false;
        setTimeout(() => {
          this.serverSearch.singleLoading = false;
          const queryResults = this.list.filter(item => item.label.toLowerCase().includes(query.toLowerCase()));
          this.serverSearch.singleOptions = queryResults.slice(0, 10);
          if (this.serverSearch.singleOptions.length < 10)
            this.serverSearch.singleScrollEnd = true;
          this.serverSearch.singleScrollCurser = 10;
          this.serverSearch.singleSearchCount = queryResults.length;
        }, 300);
      },
      remoteScrollMethodSingle(query) {
        this.serverSearch.singleScrollLoading = true;
        setTimeout(() => {
          this.serverSearch.singleScrollLoading = false;
          const queryResults = this.list.filter(item => item.label.toLowerCase().includes(query.toLowerCase())).slice(this.serverSearch.singleScrollCurser, this.serverSearch.singleScrollCurser + 10);
          this.serverSearch.singleScrollCurser += queryResults.length;
          if (queryResults.length < 10)
            this.serverSearch.singleScrollEnd = true;
          this.serverSearch.singleOptions = this.serverSearch.singleOptions.concat(queryResults);
        }, 1500);
      },
      remoteMethodMultiple(query) {
        this.serverSearch.multipleLoading = true;
        this.serverSearch.multipleScrollEnd = false;
        setTimeout(() => {
          this.serverSearch.multipleLoading = false;
          const queryResults = this.list.filter(item => item.label.toLowerCase().includes(query.toLowerCase()));
          this.serverSearch.multipleOptions = queryResults.slice(0, 10);
          if (this.serverSearch.multipleOptions.length < 10)
            this.serverSearch.multipleScrollEnd = true;
          this.serverSearch.multipleScrollCurser = 10;
          this.serverSearch.multipleSearchCount = queryResults.length;
        }, 300);
      },
      remoteScrollMethodMultiple(query) {
        this.serverSearch.multipleScrollLoading = true;
        setTimeout(() => {
          this.serverSearch.multipleScrollLoading = false;
          const queryResults = this.list.filter(item => item.label.toLowerCase().includes(query.toLowerCase())).slice(this.serverSearch.multipleScrollCurser, this.serverSearch.multipleScrollCurser + 10);
          this.serverSearch.multipleScrollCurser += queryResults.length;
          if (queryResults.length < 10)
            this.serverSearch.multipleScrollEnd = true;
          this.serverSearch.multipleOptions = this.serverSearch.multipleOptions.concat(queryResults);
        }, 1500);
      }
    }
  };
</script>

<template>
  <PreviewGroup>
    <Preview
      name="Using server search (Single)"
      span="8"
    >
      <AcvSelect
        v-model="serverSearch.single"
        filterable
        clearable
        remote
        :remote-method="remoteMethodSingle"
        :remote-scroll-method="remoteScrollMethodSingle"
        :loading="serverSearch.singleLoading"
        :scroll-loading="serverSearch.singleScrollLoading"
        :is-scroll-end="serverSearch.singleScrollEnd"
        :remote-search-results-count="serverSearch.singleSearchCount"
        label="Label"
      >
        <AcvOption
          v-for="item in serverSearch.singleOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          checkbox
        />
      </AcvSelect>
    </Preview>
    <Preview
      name="Using server search (Single) without results count"
      span="8"
    >
      <AcvSelect
        v-model="serverSearch.single"
        filterable
        clearable
        remote
        :remote-method="remoteMethodSingle"
        :remote-scroll-method="remoteScrollMethodSingle"
        :loading="serverSearch.singleLoading"
        :scroll-loading="serverSearch.singleScrollLoading"
        :is-scroll-end="serverSearch.singleScrollEnd"
        label="Label"
      >
        <AcvOption
          v-for="item in serverSearch.singleOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          checkbox
        />
      </AcvSelect>
    </Preview>
    <Preview
      name="Using server search (Multiple)"
      span="8"
    >
      <AcvSelect
        v-model="serverSearch.multiple"
        multiple
        :multiple-show-items-limit="3"
        clearable
        filterable
        remote
        :remote-method="remoteMethodMultiple"
        :remote-scroll-method="remoteScrollMethodMultiple"
        :loading="serverSearch.multipleLoading"
        :scroll-loading="serverSearch.multipleScrollLoading"
        :is-scroll-end="serverSearch.multipleScrollEnd"
        :remote-search-results-count="serverSearch.multipleSearchCount"
        label="Label"
      >
        <AcvOption
          v-for="item in serverSearch.multipleOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          checkbox
        />
      </AcvSelect>
    </Preview>

    <Preview
      name="Using flyweight and server search (Single)"
      span="8"
    >
      <AcvSelect
        v-model="serverSearch.single"
        filterable
        clearable
        flyweight
        remote
        :remote-method="remoteMethodSingle"
        :remote-scroll-method="remoteScrollMethodSingle"
        :loading="serverSearch.singleLoading"
        :scroll-loading="serverSearch.singleScrollLoading"
        :is-scroll-end="serverSearch.singleScrollEnd"
        :remote-search-results-count="serverSearch.singleSearchCount"
        label="Label"
      >
        <AcvOption
          v-for="item in serverSearch.singleOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          checkbox
        />
      </AcvSelect>
    </Preview>
    <Preview
      name="Select all using server search (Multiple)"
      span="8"
    >
      <AcvSelect
        v-model="serverSearch.multiple"
        multiple
        :multiple-show-items-limit="3"
        clearable
        filterable
        select-all
        remote
        :remote-method="remoteMethodMultiple"
        :remote-scroll-method="remoteScrollMethodMultiple"
        :loading="serverSearch.multipleLoading"
        :scroll-loading="serverSearch.multipleScrollLoading"
        :is-scroll-end="serverSearch.multipleScrollEnd"
        :remote-search-results-count="serverSearch.multipleSearchCount"
        label="Label"
      >
        <AcvOption
          v-for="item in serverSearch.multipleOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          checkbox
        />
      </AcvSelect>
    </Preview>
  </PreviewGroup>
</template>
