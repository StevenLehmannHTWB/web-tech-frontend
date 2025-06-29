import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ShoppingListItem from '@/components/ShoppingListItem.vue'

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn()
  })
}))

describe('ShoppingListItem.vue', () => {
  it('zeigt den Namen der Liste an', () => {
    const wrapper = mount(ShoppingListItem, {
      props: {
        list: { id: 42, name: 'Wocheneinkauf' }
      }
    })
    expect(wrapper.text()).toContain('Wocheneinkauf')
  })
})
