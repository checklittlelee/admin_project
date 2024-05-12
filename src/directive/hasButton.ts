import pinia from '@/store'
import useUserStore from '@/store/modules/user'
const userStore = useUserStore(pinia)
export const hasButton = (app: any) => {
  app.directive('btn', {
    mounted(el: any, options: any) {
      if (!userStore.buttons.includes(options.value)) el.parentNode.removeChild(el)
    }
  })
}
