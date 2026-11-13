<template>
  <!-- field_copyright is the footer's base line: Bottom.vue renders it
       below every column, not inside this one. -->
  <UmamiDisclaimer>
    <slot name="field_disclaimer" />
  </UmamiDisclaimer>
</template>

<script>
import { DruxtEntityMixin } from 'druxt-entity'

export default {
  mixins: [DruxtEntityMixin],
}
</script>
