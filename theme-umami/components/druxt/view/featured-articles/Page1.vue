<template>
  <div>
    <!-- Header -->
    <b-row v-if="$scopedSlots.header">
      <b-col>
        <slot name="header" />
      </b-col>
    </b-row>

    <!-- The newest article leads at full width; the rest are cards. -->
    <UmamiArticleLead
      v-if="lead"
      v-bind="lead"
      :cta-text="$t('listing.readArticle')"
      :kicker="$t('listing.latest')"
    />

    <UmamiGrid variant="articles">
      <DruxtEntity
        v-for="result of rest"
        :key="result.id"
        mode="card"
        :type="result.type"
        :uuid="result.id"
      />
    </UmamiGrid>
  </div>
</template>

<script>
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { DruxtViewsViewMixin } from 'druxt-views'
import { mapActions } from 'vuex'
import { langMixin } from '../../../../utils/lang'

export default {
  mixins: [langMixin, DruxtViewsViewMixin],

  data: () => ({
    img: false,
  }),

  async fetch() {
    const media = (((this.results || [])[0] || {}).relationships || {})
      .field_media_image
    if (!media || !media.data) {
      return
    }
    const resource = await this.getResource({
      ...media.data,
      query: new DrupalJsonApiParams()
        .addInclude(['field_media_image'])
        .addFields('media--image', [])
        .addFields('file--file', ['uri']),
    })
    const file = (resource.included || []).find((o) => o.type === 'file--file')
    this.img = file ? (this.$config.baseUrl || '') + file.attributes.uri.url : false
  },

  computed: {
    lead() {
      const first = (this.results || [])[0]
      if (!first) {
        return null
      }
      const body = first.attributes.field_body || {}
      const text = (body.summary || body.processed || '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
      return {
        img: this.img,
        summary:
          text.length > 160
            ? `${text.slice(0, 157).replace(/\s+\S*$/, '')}…`
            : text,
        title: first.attributes.title,
        /* @todo - Implement proper multilingual support */
        to: `${this.prefix}${(first.attributes.path || {}).alias}`,
      }
    },

    rest: ({ results }) => (results || []).slice(1),
  },

  methods: {
    ...mapActions({
      getResource: 'druxt/getResource',
    }),
  },

  druxt: {
    query: {
      fields: ['field_body', 'field_media_image', 'path', 'title'],
    },
  },
}
</script>
