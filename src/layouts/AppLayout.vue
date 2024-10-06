<template>
  <div class="app-layout">
    <!-- Sidebar Component (Full height including the top) -->
    <Sidebar />

    <div class="content-area">
      <!-- AppHeader Component (At the top of the content area, to the right of the sidebar) -->
      <AppHeader />

      <!-- Main content area (Router view) -->
      <div class="main-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
// Import Sidebar and Header Components
import AppHeader from '../components/appHeader.vue';
import Sidebar from '../components/Sidebar.vue';
</script>

<style scoped>
/* Styling the overall layout */
.app-layout {
  display: flex;
  height: 100vh; /* Ensure it fills the entire viewport height */
  margin: 0; /* Remove any default margin */
  padding: 0; /* Remove any default padding */
  overflow: hidden; /* Prevent overflow when using fixed elements */
}

/* Sidebar should be fixed and take the full height */
.sidebar {
  width: 18rem; /* Adjust this to the width of your sidebar */
  flex-shrink: 0; /* Prevent the sidebar from shrinking */
  height: 100%; /* Full height of the layout */
  position: relative; /* Keep it in place without absolute or fixed */
  background-color: var(--p-primary-500); /* Your sidebar background color */
  margin: 0;
  padding: 0; /* Ensure there's no padding */
}

/* Content area next to the sidebar */
.content-area {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin-left: 0; /* No need for margin since sidebar is part of the layout */
  padding: 0; /* Remove padding here */
  background-color: var(--p-surface-0); /* Make the background white */
  height: 100%; /* Make sure it fills the vertical space */
}

/* Header at the top of the content area */
.app-header {
  width: 100%;
  height: 64px; /* Adjust height as necessary */
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0 4px;
  background-color: var(--p-surface-0); /* Keep header background white */
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1); /* Optional shadow for separation */
  z-index: 10; /* Keep header above the content */
}

/* Main content area, beneath the header */
.main-content {
  flex-grow: 1;
  padding: 16px; /* Optional padding for main content */
  overflow-y: auto;
  background-color: var(--p-surface-0); /* Ensure background is white for the content */
}
</style>
