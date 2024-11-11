<script setup>
  import BreadcrumbItem from '@/components/breadcrumbs/breadcrumbItem.vue';
  // import { createRouter, createWebHashHistory } from 'vue-router';
  import Breadcrumbs from '@/components/breadcrumbs/breadcrumbs.vue';

  // const router = createRouter({
  //   history: createWebHashHistory(),
  //   routes: [
  //     {
  //       path: '/',
  //       component: {
  //         template: '<div>Home</div>',
  //       },
  //     },
  //   ],
  // });

  // const { app } = getCurrentInstance().appContext;
  // app.use(router);

  function onClick() {
    console.log('clicked');
  }
</script>

<template>
  <Breadcrumbs :max-items="3">
    <BreadcrumbItem to="/">
      Home
    </BreadcrumbItem>
    <BreadcrumbItem
      to="/first"
    >
      First item (link)
    </BreadcrumbItem>
    <BreadcrumbItem
      to="/second"
    >
      Second item (link)
    </BreadcrumbItem>
    <BreadcrumbItem
      @click="onClick"
    >
      Third item (click)
    </BreadcrumbItem>
  </Breadcrumbs>
  <!--    <BreadcrumbLink -->
  <!--      icon="i-folder-o&#45;&#45;16" -->
  <!--      @click="onClick" -->
  <!--    > -->
  <!--      Fourth item (click) -->
  <!--    </BreadcrumbLink> -->
  <!--    <BreadcrumbLink -->
  <!--      icon="i-folder-o&#45;&#45;16" -->
  <!--      @click="onClick" -->
  <!--    > -->
  <!--      Fifth item (click) -->
  <!--    </BreadcrumbLink> -->
  <!--    <BreadcrumbLink -->
  <!--      icon="i-folder-o&#45;&#45;16" -->
  <!--      @click="onClick" -->
  <!--    > -->
  <!--      a (click) -->
  <!--    </BreadcrumbLink> -->
  <!--    <BreadcrumbLink icon="i-customer-o&#45;&#45;16"> -->
  <!--      Active item -->
  <!--    </BreadcrumbLink> -->
</template>
