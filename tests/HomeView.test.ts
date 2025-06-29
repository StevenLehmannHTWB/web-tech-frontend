import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import HomeView from '@/views/HomeView.vue'
import axios from 'axios'

vi.mock('axios')
const mockedAxios = axios as any

describe('HomeView.vue', () => {
  beforeEach(() => {
    mockedAxios.get.mockResolvedValue({
      data: [{ id: 1, name: 'Wocheneinkauf' }]
    })
    mockedAxios.post.mockResolvedValue({
      data: { id: 2, name: 'Neue Liste' }
    })
  })

  it('lädt und zeigt Listen', async () => {
    const wrapper = mount(HomeView)
    await flushPromises()
    expect(wrapper.text()).toContain('Wocheneinkauf')
  })

  it('erstellt eine neue Liste', async () => {
    const wrapper = mount(HomeView)
    await flushPromises()
    const input = wrapper.find('input[type="text"]')
    await input.setValue('Neue Liste')
    await wrapper.find('button').trigger('click')
    await flushPromises()
    expect(wrapper.text()).toContain('Neue Liste')
  })
})
