<template>
  <component :is="wrapper.component" v-bind="wrapper.props">
    <!-- Label: Above -->
    <div v-if="$scopedSlots['label-above']">
      <slot name="label-above" />
    </div>

    <!-- Label: Inline -->
    <slot v-if="$scopedSlots['label-inline']" name="label-inline" />

    <!-- Items -->
    <DruxtEntity
      v-for="item of items"
      :key="item.uuid"
      class="d-inline-block"
      v-bind="{ ...item, mode: 'label' }"
    >
      <template #default="{ entity }">
        <UmamiTag
          :label="entity.attributes.name"
          :to="`${prefix}${(entity.attributes.path || {}).alias}`"
        />
      </template>
    </DruxtEntity>
  </component>
</template>

<script>
import { DruxtFieldMixin } from 'druxt-entity'
import { langMixin } from '../../../../utils/lang'

export default {
  mixins: [langMixin, DruxtFieldMixin],
}
</script>
