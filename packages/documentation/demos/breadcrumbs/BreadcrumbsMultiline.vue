<script setup>
  import { createRouter, createWebHashHistory } from 'vue-router';
  import { getCurrentInstance } from 'vue';
  import Breadcrumbs from '@/components/breadcrumbs/breadcrumbs.vue';
  import BreadcrumbLink from '@/components/breadcrumbs/breadcrumbLink.vue';

  const router = createRouter({
    history: createWebHashHistory(),
    routes: [
      {
        path: '/',
        component: {
          template: '<div>Home</div>',
        },
      },
    ],
  });

  const { app } = getCurrentInstance().appContext;
  app.use(router);

  function onClick() {
    console.log('clicked');
  }
</script>

<template>
  <Breadcrumbs multiline>
    <BreadcrumbLink to="/">
      Home
    </BreadcrumbLink>
    <BreadcrumbLink
      icon="i-root-o--16"
      :to="{ path: '/' }"
    >
      First item (link)
    </BreadcrumbLink>
    <BreadcrumbLink
      icon="i-folder-o--16"
      :to="{ path: '/' }"
    >
      Second item (link)
    </BreadcrumbLink>
    <BreadcrumbLink
      icon="i-folder-o--16"
      @click="onClick"
    >
      Third item (click)
    </BreadcrumbLink>
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
  </Breadcrumbs>
</template>
