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
      <h6 class="text-center fw-bold mb-4">Edit Facility</h6>

      <div class="card shadow">
        <div class="card-body">
          <form @submit.prevent="submitForm">
            <div class="row mb-3">
              <label class="col-sm-3 col-form-label text-end">Facility Name</label>
              <div class="col-sm-9">
                <input v-model="form.facilityName" type="text" class="form-control" required />
              </div>
            </div>
            <div class="row mb-3">
              <label class="col-sm-3 col-form-label text-end">Address</label>
              <div class="col-sm-9">
                <input v-model="form.location" type="text" class="form-control" required />
              </div>
            </div>
            <div class="row mb-3">
              <label class="col-sm-3 col-form-label text-end">Category</label>
              <div class="col-sm-9">
                <input v-model="form.category" type="text" class="form-control" required />
              </div>
            </div>
            <div class="row mb-3">
              <label class="col-sm-3 col-form-label text-end">Contact</label>
              <div class="col-sm-9">
                <input v-model="form.contact" type="text" class="form-control" required />
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
            <!-- Submit -->
            <div class="row mb-3">
              <div class="offset-sm-3 col-sm-9">
                <button type="submit" class="btn btn-primary w-100 fw-bold">Update Facility</button>
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
import { useFacility } from '../service/useFacility.js'

const route = useRoute()
const { 
  form,
  submitForm,
  loadFacility
} = useFacility(true, route.params.id, true)

onMounted(() => {
  if (route.params.id) loadFacility(route.params.id)
})
</script>
