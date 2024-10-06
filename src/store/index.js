import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    user: null, // Example state
    notifications: []
  }),
  actions: {
    setUser(user) {
      this.user = user
    },
    addNotification(notification) {
      this.notifications.push(notification)
    }
  }
})