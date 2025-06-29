import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ItemRow from '@/components/ItemRow.vue'

describe('ItemRow.vue', () => {
  const item = {
    id: 1,
    name: 'Milch',
    category: 'Getränke',
    purchased: false,
    shoppingListId: 123
  }

  it('zeigt den Item-Namen und Kategorie an', () => {
    const wrapper = mount(ItemRow, { props: { item } })
    expect(wrapper.text()).toContain('(Getränke) Milch')
  })

  it('emittiert toggle beim Checkbox-Wechsel', async () => {
    const wrapper = mount(ItemRow, { props: { item } })
    await wrapper.find('input[type="checkbox"]').trigger('change')
    expect(wrapper.emitted()).toHaveProperty('toggle')
  })

  it('emittiert delete beim Klick auf Löschen', async () => {
    const wrapper = mount(ItemRow, { props: { item } })
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted()).toHaveProperty('delete')
  })
})
