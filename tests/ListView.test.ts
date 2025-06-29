import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import ListView from '@/views/ListView.vue'
import axios from 'axios'


vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: { id: '123' },
  }),
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

vi.mock('axios')
const mockedAxios = axios as any

describe('ListView.vue', () => {
  beforeEach(() => {
    mockedAxios.get.mockImplementation((url: string) => {
      if (url.includes('/lists/')) {
        return Promise.resolve({ data: { name: 'Testliste' } })
      }
      return Promise.resolve({ data: [] })
    })
  })

  it('rendert die Komponente', async () => {
    const wrapper = mount(ListView)
    await flushPromises()
    expect(wrapper.text()).toContain('Liste löschen')
  })

  it('zeigt Eingabefeld für neuen Artikel', async () => {
    const wrapper = mount(ListView)
    await flushPromises()
    expect(wrapper.find('input[type="text"]').exists()).toBe(true)
  })

  it('zeigt die Kategorie-Auswahl', async () => {
    const wrapper = mount(ListView)
    await flushPromises()
    expect(wrapper.find('select').exists()).toBe(true)
  })
})
