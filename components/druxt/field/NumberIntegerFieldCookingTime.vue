<template>
  <component :is="wrapper.component" v-bind="wrapper.props">
    <UmamiIconStat
      icon="stopwatch"
      :label="$scopedSlots['label-above'] ? schema.label.text : ''"
      unit="minutes"
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
