<script setup>
  import AcvCard from '@/components/card/card.vue';
  import AcvList from '@/components/list/list.vue';

  const items = [
    {
      icon: 'external-link--16',
      title: 'Electronics',
      subtitle: 'Mobile, Earbuds, TV',
      avatarProps: { icon: 'i-bx-mobile-alt' },
    },
    {
      icon: 'external-link--16',
      title: 'Fashion',
      subtitle: 'T-shirt, Jeans, Shoes',
      avatarProps: { icon: 'i-bx-closet' },
    },
    {
      icon: 'external-link--16',
      title: 'Decor',
      subtitle: 'Fine Art, Dining',
      avatarProps: { icon: 'i-bx-home' },
    },
    {
      icon: 'external-link--16',
      title: 'Sports',
      subtitle: 'Football, Cricket Kit',
      avatarProps: { icon: 'i-bx-football' },
    },
  ];
</script>

<template>
  <AcvCard>
    <AcvList
      v-model="items"
      icon-append
    />
  </AcvCard>
</template>
