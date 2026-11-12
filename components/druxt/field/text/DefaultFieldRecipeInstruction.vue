<template>
  <component :is="wrapper.component" v-bind="wrapper.props">
    <!-- No label: the recipe display heads the method itself. Each item of
         the instructions' list becomes a numbered step. -->
    <UmamiMethodSteps :html="items[0].processed" />
  </component>
</template>

<script>
import { DruxtFieldMixin } from 'druxt-entity'

export default {
  mixins: [DruxtFieldMixin],
}
</script>
