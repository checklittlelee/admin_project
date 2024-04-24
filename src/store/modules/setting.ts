import { defineStore } from 'pinia'
const useLayOutSettingStore = defineStore('SettingStore', {
  state: () => {
    return {
      refresh: false
    }
  }
})

export default useLayOutSettingStore
