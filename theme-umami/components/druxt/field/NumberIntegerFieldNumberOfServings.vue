<template>
  <component :is="wrapper.component" v-bind="wrapper.props">
    <UmamiIconStat
      icon="people"
      :label="$scopedSlots['label-above'] ? schema.label.text : ''"
      :value="items[0]"
    />
  </component>
</template>

<script>
import { DruxtFieldMixin } from 'druxt-entity'

export default {
  mixins: [DruxtFieldMixin],
}
</script>
