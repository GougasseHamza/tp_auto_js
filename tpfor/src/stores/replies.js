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
  serverTimestamp,
  increment
} from 'firebase/firestore'

export const useRepliesStore = defineStore('replies', {
  state: () => ({
    replies: [],
    loading: false,
    error: null
  }),

  getters: {
    getRepliesByDiscussionId: (state) => (discussionId) => {
      return state.replies.filter(reply => reply.discussionId === discussionId)
    }
  },

  actions: {
    async fetchReplies(discussionId) {
      this.loading = true
      this.error = null
      try {
        const repliesRef = collection(db, 'replies')
        const q = query(
          repliesRef,
          where('discussionId', '==', discussionId),
          orderBy('createdAt', 'asc')
        )
        const querySnapshot = await getDocs(q)
        
        this.replies = querySnapshot.docs.map(doc => ({
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

    async createReply({ content, discussionId, userId, userName }) {
      this.loading = true
      this.error = null
      try {
        const repliesRef = collection(db, 'replies')
        const docRef = await addDoc(repliesRef, {
          content,
          discussionId,
          userId,
          userName,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        })
        
        // Update discussion's replies count
        const discussionRef = doc(db, 'discussions', discussionId)
        await updateDoc(discussionRef, {
          repliesCount: increment(1)
        })
        
        const newReply = {
          id: docRef.id,
          content,
          discussionId,
          userId,
          userName,
          createdAt: new Date(),
          updatedAt: new Date()
        }
        
        this.replies.push(newReply)
        return docRef.id
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateReply({ id, content }) {
      this.loading = true
      this.error = null
      try {
        const replyRef = doc(db, 'replies', id)
        await updateDoc(replyRef, {
          content,
          updatedAt: serverTimestamp()
        })
        
        const index = this.replies.findIndex(r => r.id === id)
        if (index !== -1) {
          this.replies[index] = {
            ...this.replies[index],
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

    async deleteReply(id, discussionId) {
      this.loading = true
      this.error = null
      try {
        const replyRef = doc(db, 'replies', id)
        await deleteDoc(replyRef)
        
        // Update discussion's replies count
        const discussionRef = doc(db, 'discussions', discussionId)
        await updateDoc(discussionRef, {
          repliesCount: increment(-1)
        })
        
        this.replies = this.replies.filter(r => r.id !== id)
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    }
  }
}) 