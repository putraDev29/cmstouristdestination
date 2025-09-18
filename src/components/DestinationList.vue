<template>
  <div>
    <!-- 🔹 Header Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top shadow">
      <div class="container">
        <a class="navbar-brand fw-bold" href="#">🌍 Tourist Destination Manager</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <a class="nav-link fw-bold" href="/">Destination</a>
            </li>
            <li class="nav-item">
              <a class="nav-link fw-bold" href="/accommodationlist">Accommodation</a>
            </li>
            <li class="nav-item">
              <a class="nav-link fw-bold" href="/facilitylist">Facility</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <div class="container" style="margin-top: 90px; max-width: 1000px;">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h6 class="text-center fw-bold mb-0">Tourist Destination List</h6>
        <a href="/createadestination" class="btn btn-success fw-bold">Add Destination</a>
      </div>
      <!-- Table -->
      <div class="card shadow">
        <div class="card-body">
          <table class="table table-striped align-middle">
            <thead class="table-primary">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Location</th>
                <th>Category</th>
                <th>Ticket Price</th>
                <th>Open - Close</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(d, index) in destinations.data" :key="d.id">
                <td>{{ index + 1 + (destinations.current_page - 1) * destinations.per_page }}</td>
                <td>{{ d.destinationName }}</td>
                <td>{{ d.location }}</td>
                <td>{{ d.category }}</td>
                <td>{{ d.ticketPrice ? d.ticketPrice.toLocaleString() : '-' }}</td>
                <td>{{ d.openTime || '--' }} - {{ d.closeTime || '--' }}</td>
                <td>
                  <button class="btn btn-sm btn-info me-2" @click="viewDetail(d)">View</button>
                  <button class="btn btn-sm btn-warning me-2" @click="editDestination(d)">Edit</button>
                  <button class="btn btn-sm btn-danger" @click="deleteDestination(d.id)">Delete</button>
                </td>
              </tr>
              <tr v-if="!destinations.data || destinations.data.length === 0">
                <td colspan="7" class="text-center">No destinations found.</td>
              </tr>
            </tbody>
          </table>

          <!-- Pagination -->
          <nav v-if="destinations.last_page > 1">
            <ul class="pagination justify-content-center">
              <li :class="['page-item', { disabled: !destinations.prev_page_url }]">
                <button class="page-link" @click="fetchPage(destinations.current_page - 1)">Previous</button>
              </li>
              <li
                v-for="page in totalPages"
                :key="page"
                :class="['page-item', { active: page === destinations.current_page }]">
                <button class="page-link" @click="fetchPage(page)">{{ page }}</button>
              </li>
              <li :class="['page-item', { disabled: !destinations.next_page_url }]">
                <button class="page-link" @click="fetchPage(destinations.current_page + 1)">Next</button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>

    <!-- 🔹 Toast -->
    <div v-if="successMessage || errorMessage"
         class="toast position-fixed top-0 end-0 m-3"
         role="alert" aria-live="assertive" aria-atomic="true"
         style="z-index: 9999">
      <div :class="['toast-header', successMessage ? 'bg-success text-white' : 'bg-danger text-white']">
        <strong class="me-auto">{{ successMessage ? 'Success' : 'Error' }}</strong>
        <button type="button" class="btn-close btn-close-white" @click="closeToast"></button>
      </div>
      <div class="toast-body">
        {{ successMessage || errorMessage }}
      </div>
    </div>

    <!-- 🔹 Detail Modal -->
    <div class="modal fade" :class="{ show: showModal }" style="display: block;" v-if="showModal">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ selectedDestination?.destinationName }}</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <p><strong>Location:</strong> {{ selectedDestination?.location }}</p>
            <p><strong>Category:</strong> {{ selectedDestination?.category }}</p>
            <p><strong>Description:</strong> {{ selectedDestination?.description }}</p>
            <p><strong>Open - Close:</strong> {{ selectedDestination?.openTime || '--' }} - {{ selectedDestination?.closeTime || '--' }}</p>
            <p><strong>Ticket Price:</strong> {{ selectedDestination?.ticketPrice?.toLocaleString() || '-' }}</p>
            <p><strong>Latitude:</strong> {{ selectedDestination?.latitude || '-' }}</p>
            <p><strong>Longitude:</strong> {{ selectedDestination?.longitude || '-' }}</p>
            <p><strong>Facilities:</strong> 
              <span v-for="f in selectedDestination?.facilities || []" :key="f.id">
                 {{ f.facilityName }}{{ f.id !== selectedDestination.facilities[selectedDestination.facilities.length-1]?.id ? ', ' : '' }}
              </span>
            </p>
            <p><strong>Accommodations:</strong> 
              <span v-for="a in selectedDestination?.accommodations || []" :key="a.id">
                {{ a.accommodationName }}{{ a.id !== selectedDestination.accommodations[selectedDestination.accommodations.length-1]?.id ? ', ' : '' }}
              </span>
            </p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeModal">Close</button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showModal" class="modal-backdrop fade show"></div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useDestination } from '../service/useDestination.js'

// Gunakan composable tanpa map
const {
  destinations,
  totalPages,
  loadDestinations,
  fetchPage,
  editDestination,
  deleteDestination,
  showModal,
  selectedDestination,
  viewDetail,
  closeModal,
  successMessage,
  errorMessage,
  closeToast
} = useDestination(false, null, false)

// Auto-load destinations saat mounted
onMounted(() => {
  loadDestinations()
})
</script>
