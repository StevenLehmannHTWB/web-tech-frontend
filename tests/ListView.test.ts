import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import ListView from '@/views/ListView.vue'
import axios from 'axios'

vi.mock('vue-router', async () => {
  const actual = await vi.importActual<typeof import('vue-router')>('vue-router')
  return {
    ...actual,
    useRouter: () => ({
      push: vi.fn(),
    }),
  }
})

vi.mock('axios')
const mockedAxios = axios as any

describe('ListView.vue', () => {
  beforeEach(() => {
    mockedAxios.get.mockImplementation((url: string) => {
      if (url.includes('/lists/')) {
        return Promise.resolve({ data: { name: 'Meine Liste' } })
      }
      return Promise.resolve({ data: [] })
    })
    mockedAxios.post.mockResolvedValue({
      data: { id: 10, name: 'Brot', category: 'Backwaren', purchased: false, shoppingListId: 123 }
    })
  })

  it('lädt Listennamen', async () => {
    const wrapper = mount(ListView)
    await flushPromises()
    expect(wrapper.text()).toContain('Meine Liste')
  })

  it('fügt neuen Artikel hinzu', async () => {
    const wrapper = mount(ListView)
    await flushPromises()
    await wrapper.find('input[type="text"]').setValue('Brot')
    await wrapper.find('button').trigger('click')
    await flushPromises()
    expect(wrapper.text()).toContain('Brot')
  })
})
