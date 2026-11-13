<template>
  <!-- Every term reference on the site resolves to this component: with no
       term view display, a card's kicker asking for a term label lands here
       too. Build the term page only for the term the router actually
       resolved; anywhere else this is a name. -->
  <span v-if="!isRoutedTerm">{{ entity.attributes.name }}</span>

  <UmamiCollection
    v-else
    :count="count"
    :description="description"
    :empty="!entities.length"
    :empty-text="$fetchState.pending ? '' : $t('term.empty')"
    :kicker="$t('term.collection')"
    :title="entity.attributes.name"
  >
    <template #breadcrumb>
      <DruxtBreadcrumb />
    </template>

    <DruxtEntity
      v-for="item of entities"
      :key="item.id"
      mode="card"
      :type="item.type"
      :uuid="item.id"
    />

    <template #note>
      <UmamiNote
        class="term-page__note"
        file="entity/taxonomy-term/tags/Default.vue"
        :kicker="$t('note.howThisWorks')"
        >{{ $t('note.termBody') }}</UmamiNote
      >
    </template>
  </UmamiCollection>
</template>

<script>
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { DruxtEntityMixin } from 'druxt-entity'
import { mapActions } from 'vuex'

export default {
  mixins: [DruxtEntityMixin],

  data: () => ({
    entities: [],
    entityTypes: [],
    field: '',
  }),

  async fetch() {
    if (!this.isRoutedTerm) {
      return
    }
    this.entities = (
      await Promise.all(
        this.entityTypes.map(
          async (type) =>
            (
              await this.getCollection({
                type,
                query: new DrupalJsonApiParams()
                  .addFilter(`${this.field}.id`, this.entity.id, 'CONTAINS')
                  .addFields(type, []),
              })
            ).data
        )
      )
    ).flat()
  },

  computed: {
    /** True only when this term is the one the router resolved. */
    isRoutedTerm() {
      const route = this.$store.state.druxtRouter.route || {}
      return ((route.entity || {}).uuid || null) === this.entity.id
    },

    description: ({ entity }) =>
      ((entity.attributes || {}).description || {}).processed || '',

    /** "18 recipes and 4 articles", as the count line under the name. */
    count() {
      const parts = this.entityTypes
        .map((type) => ({
          label: type.split('--').pop(),
          total: this.entities.filter((entity) => entity.type === type).length,
        }))
        .filter(({ total }) => total)
        .map(({ label, total }) =>
          this.$tc(
            label === 'article' ? 'term.countArticles' : 'term.countRecipes',
            total,
            { n: total }
          )
        )
      return parts.length ? parts.join(` ${this.$t('term.and')} `) : ''
    },
  },

  methods: {
    ...mapActions({
      getCollection: 'druxt/getCollection',
    }),
  },

  druxt: {
    query: {
      fields: ['description', 'name', 'path'],
    },
  },
}
</script>
