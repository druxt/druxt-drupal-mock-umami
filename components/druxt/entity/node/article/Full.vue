<template>
  <UmamiArticle
    :byline="$t('article.byline')"
    :date="longDate"
    :kicker="`${$t('bundle.article')} · ${readTimeText}`"
    :rail="[$t('bundle.article'), readTimeText, shortDate]"
    :title="entity.attributes.title"
  >
    <template #media>
      <slot name="field_media_image" />
    </template>

    <template #body>
      <slot name="field_body" />
    </template>

    <template #tags>
      <slot name="field_tags" />
    </template>

    <!-- The related articles: a Drupal view, filtered by this node's id. -->
    <template #more>
      <DruxtView
        :arguments="[entity.attributes.drupal_internal__nid]"
        display-id="block_1"
        view-id="articles_aside"
      >
        <template #default="{ display, results }">
          <UmamiHeading :text="display.display_options.title" />
          <UmamiGrid variant="aside">
            <DruxtEntity
              v-for="result of results"
              :key="result.id"
              mode="card"
              :type="result.type"
              :uuid="result.id"
            />
          </UmamiGrid>
        </template>
      </DruxtView>
    </template>

    <template #note>
      <UmamiNote
        class="mt-4"
        :title="$t('note.articleTitle')"
        :cta="$t('note.articleCta')"
        href="https://druxtjs.org/modules/views"
        :code="code"
        >{{ $t('note.articleBody') }}</UmamiNote
      >
    </template>
  </UmamiArticle>
</template>

<script>
import { DruxtEntityMixin } from 'druxt-entity'
import { langMixin } from '../../../../../utils/lang'

export default {
  mixins: [langMixin, DruxtEntityMixin],

  computed: {
    theme: () => 'umami',

    /** Words in the body at 200 a minute, never under one. */
    readTime: ({ entity }) => {
      const html = ((entity.attributes || {}).field_body || {}).processed || ''
      const words = html
        .replace(/<[^>]+>/g, ' ')
        .split(/\s+/)
        .filter(Boolean)
      return Math.max(1, Math.round(words.length / 200))
    },

    readTimeText() {
      return this.$t('article.readTime', { n: this.readTime })
    },

    created: ({ entity }) => new Date((entity.attributes || {}).created),

    longDate() {
      return this.formatDate(this.created, 'long')
    },
    shortDate() {
      return this.formatDate(this.created, 'short')
    },

    code: () =>
      [
        '<span class="t">&lt;DruxtView</span>',
        '  <span class="a">view-id</span>=<span class="v">"articles_aside"</span>',
        '  <span class="a">:arguments</span>=<span class="v">"[nid]"</span>',
        '<span class="t">/&gt;</span>',
      ].join('\n'),
  },

  druxt: {
    query: {
      fields: ['created', 'drupal_internal__nid', 'field_body', 'title'],
    },
  },
}
</script>
