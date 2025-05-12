import { defineStore } from 'pinia'
import { db } from '../firebase/config'
import { 
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore'

export const useDiscussionsStore = defineStore('discussions', {
  state: () => ({
    discussions: [],
    loading: false,
    error: null
  }),

  getters: {
    getDiscussionById: (state) => (id) => {
      return state.discussions.find(discussion => discussion.id === id)
    },
    getDiscussionsByCategory: (state) => (categoryId) => {
      return state.discussions.filter(discussion => discussion.categoryId === categoryId)
    }
  },

  actions: {
    async fetchDiscussions() {
      this.loading = true
      this.error = null
      try {
        const discussionsRef = collection(db, 'discussions')
        const q = query(discussionsRef, orderBy('createdAt', 'desc'))
        const querySnapshot = await getDocs(q)
        
        this.discussions = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async createDiscussion({ title, content, categoryId, userId, userName }) {
      this.loading = true
      this.error = null
      try {
        const discussionsRef = collection(db, 'discussions')
        const docRef = await addDoc(discussionsRef, {
          title,
          content,
          categoryId,
          userId,
          userName,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          repliesCount: 0,
          viewsCount: 0
        })
        
        const newDiscussion = {
          id: docRef.id,
          title,
          content,
          categoryId,
          userId,
          userName,
          createdAt: new Date(),
          updatedAt: new Date(),
          repliesCount: 0,
          viewsCount: 0
        }
        
        this.discussions.unshift(newDiscussion)
        return docRef.id
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateDiscussion({ id, title, content }) {
      this.loading = true
      this.error = null
      try {
        const discussionRef = doc(db, 'discussions', id)
        await updateDoc(discussionRef, {
          title,
          content,
          updatedAt: serverTimestamp()
        })
        
        const index = this.discussions.findIndex(d => d.id === id)
        if (index !== -1) {
          this.discussions[index] = {
            ...this.discussions[index],
            title,
            content,
            updatedAt: new Date()
          }
        }
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteDiscussion(id) {
      this.loading = true
      this.error = null
      try {
        const discussionRef = doc(db, 'discussions', id)
        await deleteDoc(discussionRef)
        this.discussions = this.discussions.filter(d => d.id !== id)
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async incrementViews(id) {
      try {
        const discussionRef = doc(db, 'discussions', id)
        const discussion = this.discussions.find(d => d.id === id)
        
        if (discussion) {
          await updateDoc(discussionRef, {
            viewsCount: discussion.viewsCount + 1
          })
          discussion.viewsCount++
        }
      } catch (error) {
        console.error('Error incrementing views:', error)
      }
    }
  }
}) 