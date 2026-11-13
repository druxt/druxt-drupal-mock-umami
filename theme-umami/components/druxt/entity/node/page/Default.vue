<template>
  <UmamiPage :title="entity.attributes.title">
    <template #breadcrumb>
      <DruxtBreadcrumb />
    </template>

    <slot name="field_body" />

    <!-- The About page carries the frontend's own section: what Druxt is.
         Drupal's body above stays the editor's. -->
    <template v-if="isAbout" #after>
      <UmamiAbout
        :kicker="$t('about.kicker')"
        :paragraphs="[$t('about.p1'), $t('about.p2'), $t('about.p3')]"
        :title="$t('about.title')"
      >
        <template #mark>
          <AppDruxtMark class="about-druxt__mark" />
        </template>
      </UmamiAbout>
    </template>
  </UmamiPage>
</template>

<script>
import { DruxtEntityMixin } from 'druxt-entity'

/** The About page's alias in each language. */
const ABOUT = ['/about-umami', '/acerca-de-umami']

export default {
  mixins: [DruxtEntityMixin],

  computed: {
    isAbout: ({ entity }) =>
      ABOUT.includes(((entity.attributes || {}).path || {}).alias),
  },

  druxt: {
    query: {
      fields: ['field_body', 'path', 'title'],
    },
  },
}
</script>
