// src/store/activityFeedStore.js
import axios from 'axios';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useActivityFeedStore = defineStore('activityFeedStore', () => {
    const activities = ref([]);
    const isLoading = ref(false);
    const error = ref(null);

    /**
     * Fetches recent activity feed from the backend.
     */
    async function fetchActivities() {
        isLoading.value = true;
        error.value = null;

        try {
            // Use the backend URL from environment variables or default to 'http://localhost:3000'
            const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

            // Make the API request
            const response = await axios.get(`${backendUrl}/api/local/financial-dashboard/activity-feed`);

            if (Array.isArray(response.data)) {
                activities.value = response.data;
                console.log('Fetched activities:', activities.value);
            } else {
                activities.value = [];
                console.error('Response data is not an array:', response.data);
                error.value = 'Unexpected data format received from the server.';
            }
        } catch (err) {
            error.value = 'Failed to fetch activity feed';
            console.error('Error fetching activity feed:', err);
        } finally {
            isLoading.value = false;
        }
    }

    return {
        activities,
        isLoading,
        error,
        fetchActivities,
    };
});