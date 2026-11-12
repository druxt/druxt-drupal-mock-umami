<template>
  <component :is="wrapper.component" v-bind="wrapper.props" v-if="icon">
    <UmamiIconStat
      icon="puzzle"
      :label="$scopedSlots['label-above'] ? schema.label.text : ''"
      :value="items[0]"
    />
  </component>

  <component :is="wrapper.component" v-bind="wrapper.props" v-else>
    <b-badge pill :variant="variant"
      ><span v-text="items[0]"
    /></b-badge>
  </component>
</template>

<script>
import { DruxtFieldMixin } from 'druxt-entity'

export default {
  mixins: [DruxtFieldMixin],

  props: {
    icon: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    variant() {
      switch (this.items[0]) {
        case 'easy':
          return 'success'
        case 'medium':
          return 'warning'
        case 'hard':
          return 'danger'
      }
      return false
    },
  },
}
</script>
