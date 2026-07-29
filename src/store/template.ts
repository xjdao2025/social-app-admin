import { create } from 'zustand'
import throttle from 'lodash/throttle'
import createSelectors from '@/store/helper/createSelectors'
import server, { type Templates } from '@/server/rice'

interface TemplateStore {
  templates?: Templates | null
  fetchTemplate: ReturnType<typeof throttle<() => Promise<void>>>
}

const useGetTemplate = createSelectors(
  create<TemplateStore>((set) => ({
    fetchTemplate: throttle(
      async () => {
        const templates = await server.templates.get()
        set(() => ({ templates }))
      },
      1000,
      { leading: true, trailing: false },
    ),
  })),
)

export default useGetTemplate
