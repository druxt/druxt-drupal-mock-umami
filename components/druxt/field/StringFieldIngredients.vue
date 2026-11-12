<template>
  <component :is="wrapper.component" v-bind="wrapper.props">
    <!-- No label: the recipe display heads this list itself. -->
    <UmamiIngredients :items="items" />
  </component>
</template>

<script>
import { DruxtFieldMixin } from 'druxt-entity'

export default {
  mixins: [DruxtFieldMixin],
}
</script>
