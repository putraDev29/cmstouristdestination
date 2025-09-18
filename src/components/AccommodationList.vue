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
        <h6 class="text-center fw-bold mb-0">Accommodation List</h6>
        <a href="/createaccommodation" class="btn btn-success fw-bold">Add Accommodation</a>
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
                <th>Price</th>
                <th>Contact</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(d, index) in accommodations.data" :key="d.id">
                <td>{{ index + 1 + (accommodations.current_page - 1) * accommodations.per_page }}</td>
                <td>{{ d.accommodationName }}</td>
                <td>{{ d.location }}</td>
                <td>{{ d.category }}</td>
                <td>{{ d.price }}</td>
                <td>{{ d.contact }}</td>
                <td>{{ d.rating }}</td>
                <td>
                  <button class="btn btn-sm btn-warning me-2" @click="editAccommodations(d)">Edit</button>
                  <button class="btn btn-sm btn-danger" @click="deleteAccommodation(d.id)">Delete</button>
                </td>
              </tr>
              <tr v-if="!accommodations.data || accommodations.data.length === 0">
                <td colspan="7" class="text-center">No accommodations found.</td>
              </tr>
            </tbody>
          </table>

          <!-- Pagination -->
          <nav v-if="accommodations.last_page > 1">
            <ul class="pagination justify-content-center">
              <li :class="['page-item', { disabled: !accommodations.prev_page_url }]">
                <button class="page-link" @click="fetchPage(accommodations.current_page - 1)">Previous</button>
              </li>
              <li
                v-for="page in totalPages"
                :key="page"
                :class="['page-item', { active: page === accommodations.current_page }]">
                <button class="page-link" @click="fetchPage(page)">{{ page }}</button>
              </li>
              <li :class="['page-item', { disabled: !accommodations.next_page_url }]">
                <button class="page-link" @click="fetchPage(accommodations.current_page + 1)">Next</button>
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
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAccommodation } from '../service/useAccommodation.js'

// Gunakan composable tanpa map
const {
  accommodations,
  totalPages,
  loadAccommodations,
  fetchPage,
  editAccommodations,
  deleteAccommodation,
  successMessage,
  errorMessage,
  closeToast
} = useAccommodation(false, null, false)

onMounted(() => {
  loadAccommodations()
})
</script>
