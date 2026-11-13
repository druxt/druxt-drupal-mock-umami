<template>
  <UmamiTiles :cta-text="$t('home.allRecipes')" :cta-to="`${prefix}/recipes`">
    <!-- The view's own title is the heading: Drupal owns this copy. -->
    <template v-if="$scopedSlots.header" #heading>
      <slot name="header" />
    </template>

    <slot
      name="results"
      :wrapper="{
        component: 'b-col',
        class: 'mb-4',
        propsData: {
          cols: 6,
          md: 4,
          lg: 3,
        },
      }"
    />
  </UmamiTiles>
</template>

<script>
import { langMixin } from '../../../../utils/lang'

export default {
  mixins: [langMixin],
}
</script>
