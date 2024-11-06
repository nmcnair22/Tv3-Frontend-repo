<!-- src/components/ActivityFeed.vue -->
<template>
    <div class="activity-feed">
      <h2 class="section-title">Recent Activities</h2>
      <div v-if="isLoading">
        <Loading />
      </div>
      <div v-else-if="error">
        <ErrorMessage :message="error" />
      </div>
      <div v-else>
        <div v-for="group in groupedActivities" :key="group.dateKey">
          <h3 class="date-title">{{ group.dateKey }}</h3>
          <ul class="feed-list">
            <li
              v-for="activity in group.activities"
              :key="activity.id"
              class="activity-item rounded-xl flex flex-col md:flex-row md:items-center md:justify-between p-4 border mb-4"
              :class="getActivityBackgroundClass(activity)"
            >
              <!-- Left Section: Icon and Text -->
              <div class="flex items-start flex-1">
                <div>
                  <span
                    class="inline-flex justify-center items-center w-8 h-8 rounded-full border mr-2"
                    :class="getIconBorderClass(activity)"
                  >
                    <i
                      :class="[getIcon(activity)]"
                      :style="{ color: getIconColor(activity) }"
                    />
                  </span>
                </div>
                <div>
                  <!-- Activity Title (Bolded Record Type) -->
                  <p :style="{ color: getTitleColor(activity) }" class="font-bold mb-1">
                    {{ getActivityTitle(activity) }}
                  </p>
                  <!-- Customer and Due Date -->
                  <p class="activity-subtitle mb-0">
                    Customer: {{ activity.customerName || 'N/A' }}
                  </p>
                  <p class="activity-subtitle mb-0">
                    Due Date: {{ formatDate(activity.dueDate) || 'N/A' }}
                  </p>
                </div>
              </div>
                <!-- Right Section: Time, Amount, Status Label -->
                <div class="flex flex-col items-end mt-4 md:mt-0 md:ml-4">
                <!-- Time Element -->
                <span class="activity-time">{{ activity.relativeTime }}</span>
                <!-- Amount -->
                <span :style="{ color: getTitleColor(activity) }" class="font-bold mt-1">
                    {{ formatCurrency(activity.amount) }}
                </span>
                <!-- Status Label -->
                <span
                    v-if="activity.statusLabel"
                    :class="['font-bold text-sm mt-1 py-1 px-2 rounded-xl', getStatusLabelClass(activity.statusLabel)]"
                >
                    {{ activity.statusLabel }}
                </span>
                </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </template>

  <script setup>
  import { storeToRefs } from 'pinia';
import { computed, onMounted } from 'vue';
import { useActivityFeedStore } from '../store/activityFeedStore';
  
  // Import components
  import ErrorMessage from './ErrorMessage.vue';
import Loading from './Loading.vue';
  
  const activityFeedStore = useActivityFeedStore();
  
  const { activities, isLoading, error } = storeToRefs(activityFeedStore);
  const { fetchActivities } = activityFeedStore;
  
  onMounted(() => {
    fetchActivities();
  });
  
  const groupedActivities = computed(() => {
    // Sort activities by createdAt descending (most recent first)
    const sortedActivities = [...activities.value].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  
    // Initialize groups as an array
    const groups = [];
  
    sortedActivities.forEach((activity) => {
      const activityDate = new Date(activity.createdAt); // Assuming createdAt is in UTC
      const activityDateOnly = new Date(
        Date.UTC(
          activityDate.getUTCFullYear(),
          activityDate.getUTCMonth(),
          activityDate.getUTCDate()
        )
      );
  
      const now = new Date();
      const today = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
      );
      const yesterday = new Date(today);
      yesterday.setUTCDate(today.getUTCDate() - 1);
  
      let dateKey = '';
      if (activityDateOnly.getTime() === today.getTime()) {
        dateKey = 'Today';
      } else if (activityDateOnly.getTime() === yesterday.getTime()) {
        dateKey = 'Yesterday';
      } else {
        dateKey = activityDateOnly.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
          timeZone: 'UTC',
        });
      }
  
      // Compute relative time
      const relativeTime = formatRelativeTime(activityDate);
      activity.relativeTime = relativeTime;
  
      // Check if the last group has the same dateKey
      const lastGroup = groups.length > 0 ? groups[groups.length - 1] : null;
      if (lastGroup && lastGroup.dateKey === dateKey) {
        // Add to existing group
        lastGroup.activities.push(activity);
      } else {
        // Create new group
        groups.push({
          dateKey: dateKey,
          activities: [activity],
        });
      }
    });
  
    return groups;
  });
  
  function formatRelativeTime(date) {
    const now = new Date();
    const activityTime = new Date(date);
  
    let diffMs = now.getTime() - activityTime.getTime(); // Difference in milliseconds
  
    if (isNaN(diffMs)) {
      return '';
    }
  
    // If the activity date is in the future, set diffMs to zero
    if (diffMs < 0) {
      diffMs = 0;
    }
  
    const diffSeconds = Math.floor(diffMs / 1000);
  
    if (diffSeconds < 60) {
      return `${diffSeconds} seconds ago`;
    }
  
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) {
      return `${diffMinutes} minutes ago`;
    }
  
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) {
      return `${diffHours} hours ago`;
    }
  
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) {
      return `1 day ago`;
    }
  
    return `${diffDays} days ago`;
  }
  
  function getIcon(activity) {
    switch (activity.type) {
      case 'Payment':
        return 'pi pi-dollar';
      case 'Invoice':
        return 'pi pi-file';
      case 'Credit Memo':
        return 'pi pi-credit-card';
      case 'Adjustment':
        return 'pi pi-refresh';
      default:
        return 'pi pi-info-circle';
    }
  }
  
  function getActivityBackgroundClass(activity) {
    switch (activity.type) {
      case 'Payment':
        return activity.isLate
          ? 'bg-red-50 border-red-500'
          : 'bg-green-50 border-green-500';
      case 'Invoice':
        if (activity.status === 'Open' || activity.status === 'Unpaid') {
          return 'bg-yellow-50 border-yellow-500';
        } else if (activity.status === 'Paid') {
          return 'bg-green-50 border-green-500';
        } else {
          return 'bg-gray-50 border-gray-500';
        }
      case 'Credit Memo':
        return 'bg-orange-50 border-orange-500';
      case 'Adjustment':
        return 'bg-gray-50 border-gray-500';
      default:
        return 'bg-surface-50 border-surface-500';
    }
  }
  
  function getIconBorderClass(activity) {
    switch (activity.type) {
      case 'Payment':
        return activity.isLate
          ? 'border-red-700'
          : 'border-green-700';
      case 'Invoice':
        if (activity.status === 'Open' || activity.status === 'Unpaid') {
          return 'border-yellow-700';
        } else if (activity.status === 'Paid') {
          return 'border-green-700';
        } else {
          return 'border-gray-700';
        }
      case 'Credit Memo':
        return 'border-orange-700';
      case 'Adjustment':
        return 'border-gray-700';
      default:
        return 'border-surface-700';
    }
  }
  
  function getIconColor(activity) {
    switch (activity.type) {
      case 'Payment':
        return activity.isLate ? '#dc2626' : '#16a34a'; // Red or Green
      case 'Invoice':
        if (activity.status === 'Open' || activity.status === 'Unpaid') {
          return '#ca8a04'; // Yellow
        } else if (activity.status === 'Paid') {
          return '#16a34a'; // Green
        } else {
          return '#6b7280'; // Gray
        }
      case 'Credit Memo':
        return '#ea580c'; // Orange
      case 'Adjustment':
        return '#525252'; // Gray
      default:
        return '#6b7280';
    }
  }
  
  function getTitleColor(activity) {
    return getIconColor(activity);
  }
  
function getStatusLabelClass(statusLabel) {
  switch (statusLabel) {
    case 'Late':
      return 'bg-red-400 text-red-900';
    case 'On Time':
      return 'bg-green-400 text-green-900';
    case 'Unpaid':
      return 'bg-yellow-400 text-yellow-900';
    case 'Paid':
      return 'bg-green-400 text-green-900';
    default:
      return 'bg-gray-400 text-gray-900';
  }
}
  
  function formatCurrency(amount) {
    if (isNaN(amount)) {
      return '$0.00';
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }
  
  function getActivityTitle(activity) {
    switch (activity.type) {
      case 'Payment':
        return `New Payment Received for Invoice ${activity.documentNumber}`;
      case 'Invoice':
        return `New Invoice ${activity.documentNumber}`;
      case 'Credit Memo':
        return `Credit Memo: ${activity.documentNumber}`;
      case 'Adjustment':
        return `Adjustment`;
      default:
        return activity.description || 'Activity';
    }
  }
  
  function formatDate(date) {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US');
  }
  </script>
    
  <style scoped>
.activity-feed {
  margin-top: 1rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  margin-top: 2rem; /* Adjusted top margin */
}

.date-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #6B7280;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}

.feed-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.activity-item {
  /* The main styles are applied through classes in the template */
}

.activity-subtitle {
  color: #4B5563; /* Gray-600 */
}

.activity-time {
  color: #6B7280;
  font-size: 0.875rem;
}

.activity-details span {
  display: block;
  line-height: 1.4;
}

.activity-details {
  margin-top: 0.5rem;
}

/* Add classes for status labels */
.status-label {
  font-weight: bold;
  font-size: 0.875rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .activity-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .activity-time {
    margin-top: 0.5rem;
  }

  .flex-col.items-end {
    align-items: flex-start;
  }
}
</style>