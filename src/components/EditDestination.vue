<template>
  <div>
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

    <div class="container" style="margin-top: 90px; max-width: 800px;">
      <h6 class="text-center fw-bold mb-4">Edit Tourist Destination</h6>

      <div class="card shadow">
        <div class="card-body">
          <form @submit.prevent="submitForm">

            <!-- Destination Name -->
            <div class="row mb-3">
              <label class="col-sm-3 col-form-label text-end">Destination Name</label>
              <div class="col-sm-9">
                <input v-model="form.destinationName" type="text" class="form-control" required />
              </div>
            </div>

            <!-- Address -->
            <div class="row mb-3">
              <label class="col-sm-3 col-form-label text-end">Address</label>
              <div class="col-sm-9">
                <input v-model="form.location" type="text" class="form-control" required />
              </div>
            </div>

            <!-- Category -->
            <div class="row mb-3">
              <label class="col-sm-3 col-form-label text-end">Category</label>
              <div class="col-sm-9">
                <input v-model="form.category" type="text" class="form-control" required />
              </div>
            </div>

            <!-- Description -->
            <div class="row mb-3">
              <label class="col-sm-3 col-form-label text-end">Description</label>
              <div class="col-sm-9">
                <textarea v-model="form.description" class="form-control" rows="3"></textarea>
              </div>
            </div>

            <!-- Open & Close Time -->
            <div class="row mb-3">
              <label class="col-sm-3 col-form-label text-end">Open Time</label>
              <div class="col-sm-3">
                <input v-model="form.openTime" type="time" class="form-control" />
              </div>
              <label class="col-sm-3 col-form-label text-end">Close Time</label>
              <div class="col-sm-3">
                <input v-model="form.closeTime" type="time" class="form-control" />
              </div>
            </div>

            <!-- Ticket Price -->
            <div class="row mb-3">
              <label class="col-sm-3 col-form-label text-end">Ticket Price</label>
              <div class="col-sm-9">
                <input v-model.number="form.ticketPrice" type="number" class="form-control" />
              </div>
            </div>

            <!-- Image Upload & Preview -->
            <div class="row mb-3">
              <label class="col-sm-3 col-form-label text-end">Image</label>
              <div class="col-sm-9">
                <input type="file" class="form-control" @change="onFileChange" />
                <div v-if="form.image" class="mt-2">
                  <img :src="typeof form.image === 'string' ? form.image : URL.createObjectURL(form.image)" 
                       alt="Preview" style="max-height: 150px;">
                </div>
              </div>
            </div>

            <!-- Map -->
            <div class="row mb-3">
              <label class="col-sm-3 col-form-label text-end">Location on Map</label>
              <div class="col-sm-9">
                <div id="map" style="height: 300px; border: 1px solid #ccc;"></div>
                <p class="mt-2">
                  Selected Coordinates:
                  <strong>{{ form.latitude || '-' }}, {{ form.longitude || '-' }}</strong>
                </p>
              </div>
            </div>

            <!-- Facilities -->
            <div class="row mb-3">
              <label class="col-sm-3 col-form-label text-end">Facilities</label>
              <div class="col-sm-9">
                <select v-model="selectedFacilities" multiple class="form-select">
                  <option v-for="f in facilities" :key="f.id" :value="f.id">{{ f.facilityName }}</option>
                </select>
              </div>
            </div>

            <!-- Accommodations -->
            <div class="row mb-3">
              <label class="col-sm-3 col-form-label text-end">Accommodations</label>
              <div class="col-sm-9">
                <select v-model="selectedAccommodations" multiple class="form-select">
                  <option v-for="a in accommodations" :key="a.id" :value="a.id">{{ a.accommodationName }}</option>
                </select>
              </div>
            </div>

            <!-- Submit -->
            <div class="row mb-3">
              <div class="offset-sm-3 col-sm-9">
                <button type="submit" class="btn btn-primary w-100 fw-bold">Update Destination</button>
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useDestination } from '../service/useDestination.js'

const route = useRoute()
const { 
  form,
  facilities,
  accommodations,
  selectedFacilities,
  selectedAccommodations,
  submitForm,
  onFileChange,
  loadDestination
} = useDestination(true, route.params.id, true)

onMounted(() => {
  if (route.params.id) loadDestination(route.params.id)
})
</script>
