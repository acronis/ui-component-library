<script setup>
  import BreadcrumbItem from '@/components/breadcrumbs/breadcrumbItem.vue';
  import Breadcrumbs from '@/components/breadcrumbs/breadcrumbs.vue';
</script>

<template>
  <Breadcrumbs>
    <BreadcrumbItem
      to="/"
    >
      Home
    </BreadcrumbItem>
    <BreadcrumbItem to="/products">
      Products
    </BreadcrumbItem>
    <BreadcrumbItem to="/customers">
      Customers
    </BreadcrumbItem>
  </Breadcrumbs>
<!--  <Breadcrumbs :max-items="maxItems"> -->
<!--    <BreadcrumbItem -->
<!--      to="/" -->
<!--    > -->
<!--      <template #icon> -->
<!--        <IconDot16 /> -->
<!--      </template> -->
<!--      Home -->
<!--    </BreadcrumbItem> -->
<!--    <BreadcrumbItem -->
<!--      to="/test" -->
<!--    > -->
<!--      Test -->
<!--    </BreadcrumbItem> -->
<!--    <BreadcrumbItem -->
<!--      to="/wow" -->
<!--    > -->
<!--      Wow -->
<!--    </BreadcrumbItem> -->
<!--    <BreadcrumbItem -->
<!--      to="/products" -->
<!--    > -->
<!--      <template #icon> -->
<!--        <IconDot16 /> -->
<!--      </template> -->
<!--      Products -->
<!--    </BreadcrumbItem> -->
<!--    <BreadcrumbItem -->
<!--      to="/customer" -->
<!--    > -->
<!--      <template #icon> -->
<!--        <IconDot16 /> -->
<!--      </template> -->
<!--      Customers -->
<!--    </BreadcrumbItem> -->
<!--  </Breadcrumbs> -->
</template>
