<template>
  <!-- Drupal returns the full result set once; the filters work in the
       browser. -->
  <UmamiRecipeListing
    :count-text="
      $t('listing.count', {
        shown: filtered.length,
        total: results.length,
      })
    "
    :difficulties="
      difficulties.map((value) => ({
        value,
        text: $t(`listing.${value}`),
      }))
    "
    :difficulty-label="$t('listing.difficulty')"
    :difficulty.sync="difficulty"
    :empty-text="$t('listing.nothingMatches')"
    :filter-placeholder="$t('listing.filterByIngredient')"
    :items="filtered"
    :query.sync="query"
    :sort-label="$t('listing.sort')"
    :sort-options="sortOptions"
    :sort.sync="sort"
  >
    <template #card="{ item }">
      <DruxtEntity mode="card" :type="item.type" :uuid="item.id" />
    </template>

    <template #note>
      <UmamiNote
        class="mt-4"
        :title="$t('note.recipesTitle')"
        :cta="$t('note.recipesCta')"
        href="https://druxtjs.org/modules/views"
        >{{ $t('note.recipesBody') }}</UmamiNote
      >
    </template>
  </UmamiRecipeListing>
</template>

<script>
import { DruxtViewsViewMixin } from 'druxt-views'

const attr = (result, field) => (result.attributes || {})[field]

export default {
  mixins: [DruxtViewsViewMixin],

  data: () => ({
    difficulties: ['easy', 'medium', 'hard'],
    difficulty: null,
    query: '',
    sort: 'title',
  }),

  computed: {
    sortOptions() {
      return [
        { value: 'title', text: this.$t('listing.sortAz') },
        { value: 'time', text: this.$t('listing.sortQuickest') },
      ]
    },

    filtered() {
      const query = this.query.trim().toLowerCase()

      const matches = (this.results || []).filter((result) => {
        if (
          this.difficulty &&
          (attr(result, 'field_difficulty') || '').toLowerCase() !==
            this.difficulty.toLowerCase()
        ) {
          return false
        }

        if (!query) {
          return true
        }

        const haystack = [
          attr(result, 'title'),
          ...(attr(result, 'field_ingredients') || []),
        ]
          .join(' ')
          .toLowerCase()

        return haystack.includes(query)
      })

      return [...matches].sort((a, b) =>
        this.sort === 'time'
          ? (attr(a, 'field_cooking_time') || 0) -
            (attr(b, 'field_cooking_time') || 0)
          : String(attr(a, 'title')).localeCompare(String(attr(b, 'title')))
      )
    },
  },

  /**
   * The view's own field list is filtered by bundle; ask for the fields the
   * client-side filters need.
   */
  druxt: {
    query: {
      fields: [
        'field_cooking_time',
        'field_difficulty',
        'field_ingredients',
        'path',
        'title',
      ],
    },
  },
}
</script>
