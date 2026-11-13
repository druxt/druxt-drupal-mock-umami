<template>
  <UmamiRecipePage>
    <UmamiRecipeHero :title="entity.attributes.title">
      <template #media>
        <slot name="field_media_image" />
      </template>

      <template #breadcrumb>
        <DruxtBreadcrumb />
      </template>

      <template #summary>
        <slot name="field_summary" />
      </template>
    </UmamiRecipeHero>

    <UmamiStatGrid :stats="stats" />

    <UmamiRecipeBody
      :ingredients-heading="$t('recipe.ingredients')"
      :method-heading="$t('recipe.method')"
    >
      <template #ingredients>
        <slot name="field_ingredients" />
      </template>

      <template #method>
        <slot name="field_recipe_instruction" />
      </template>

      <template #tags>
        <slot name="field_recipe_category" />
        <slot name="field_tags" />
      </template>
    </UmamiRecipeBody>

    <!-- The note follows the recipe. -->
    <UmamiNote
      class="mt-5"
      :title="$t('note.recipeTitle')"
      :cta="$t('note.recipeCta')"
      href="https://druxtjs.org/modules/entity"
      :code="code"
      >{{ $t('note.recipeBody', { mode: 'full' }) }}</UmamiNote
    >
  </UmamiRecipePage>
</template>

<script>
import { DruxtEntityMixin } from 'druxt-entity'
import { langMixin } from '../../../../../utils/lang'

export default {
  mixins: [langMixin, DruxtEntityMixin],

  computed: {
    stats() {
      const a = this.entity.attributes
      const level = a.field_difficulty || ''
      const minutes = (n) => (n || n === 0 ? this.$t('recipe.min', { n }) : '')
      // A recipe without a value shows no stat rather than "undefined min".
      return [
        {
          label: this.$t('recipe.prep'),
          value: minutes(a.field_preparation_time),
        },
        {
          label: this.$t('recipe.cook'),
          value: minutes(a.field_cooking_time),
        },
        { label: this.$t('recipe.serves'), value: a.field_number_of_servings },
        {
          label: this.$t('recipe.difficulty'),
          value: level && this.$t(`listing.${level}`),
        },
      ].filter(({ value }) => value || value === 0)
    },

    code: () =>
      [
        '<span class="t">&lt;DruxtEntity</span>',
        '  <span class="a">type</span>=<span class="v">"node--recipe"</span>',
        '  <span class="a">mode</span>=<span class="v">"full"</span>',
        '  <span class="a">:uuid</span>=<span class="v">"uuid"</span>',
        '<span class="t">/&gt;</span>',
      ].join('\n'),
  },

  // The display carries no title: the page title block does, and this
  // template draws its own.
  druxt: {
    query: {
      fields: ['title'],
    },
  },
}
</script>
