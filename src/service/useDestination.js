import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import L from 'leaflet'

export function useDestination(isEdit = false, destinationId = null, withMap = false) {
  const router = useRouter()

  // ----------------- Toast -----------------
  const successMessage = ref('')
  const errorMessage = ref('')
  const successToast = ref(null)
  const errorToast = ref(null)
  const showToast = (toastRef) => {
    if (toastRef?.value) {
      const toast = new bootstrap.Toast(toastRef.value)
      toast.show()
    }
  }
  const autoCloseToast = async () => {
    await nextTick()
    setTimeout(() => { successMessage.value = ''; errorMessage.value = '' }, 3000)
  }
  const closeToast = () => { successMessage.value = ''; errorMessage.value = '' }

  // ----------------- Form -----------------
  const form = ref({
    destinationName: '',
    location: '',
    category: '',
    description: '',
    openTime: '',
    closeTime: '',
    ticketPrice: null,
    latitude: null,
    longitude: null,
    image: null // 🔹 image file
  })

  // ----------------- Facilities & Accommodations -----------------
  const facilities = ref([])
  const accommodations = ref([])
  const selectedFacilities = ref([])
  const selectedAccommodations = ref([])

  const loadAccommodations = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/accommodation')
      accommodations.value = res.data
    } catch (err) {
      console.error('Failed to load accommodations', err)
    }
  }

  const loadFacility = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/facility')
      facilities.value = res.data
    } catch (err) {
      console.error('Failed to load facility', err)
    }
  }

  // ----------------- Map -----------------
  let map, marker
  onMounted(async () => {
    if (withMap) {
      await nextTick()
      map = L.map('map').setView([0, 0], 2)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map)

      map.on('click', (e) => {
        const { lat, lng } = e.latlng
        form.value.latitude = parseFloat(lat.toFixed(6))
        form.value.longitude = parseFloat(lng.toFixed(6))
        if(marker) marker.setLatLng([lat,lng])
        else marker = L.marker([lat,lng]).addTo(map)
      })
    }
  })

  // ----------------- Load single destination -----------------
  const loadDestination = async (id) => {
    try {
      await loadFacility()
      await loadAccommodations()

      const res = await axios.get(`http://localhost:8000/api/tourist-destinations/${id}`)
      const data = res.data

      form.value.destinationName = data.destinationName
      form.value.location = data.location
      form.value.category = data.category
      form.value.description = data.description
      form.value.openTime = data.openTime
      form.value.closeTime = data.closeTime
      form.value.ticketPrice = data.ticketPrice
      form.value.latitude = data.latitude
      form.value.longitude = data.longitude
      form.value.image = data.image || null

      selectedFacilities.value = data.facilities?.map(f => f.id) || []
      selectedAccommodations.value = data.accommodations?.map(a => a.id) || []

      if (data.latitude && data.longitude && map) {
        const latLng = [data.latitude, data.longitude]
        marker = L.marker(latLng).addTo(map)
        map.setView(latLng, 13)
      }

      return data
    } catch (err) {
      console.error('Failed to load destination:', err)
      errorMessage.value = 'Failed to load destination data.'
      showToast(errorToast)
    }
  }

  // ----------------- Image handler -----------------
  const onFileChange = (e) => {
    const file = e.target.files[0]
    if (file) form.value.image = file
  }

  // ----------------- Submit (Create / Update) -----------------
  const submitForm = async () => {
    try {
      const payload = new FormData()
      for (const key in form.value) {
        if (form.value[key] !== null) payload.append(key, form.value[key])
      }
      selectedFacilities.value.forEach(f => payload.append('facilities[]', f))
      selectedAccommodations.value.forEach(a => payload.append('accommodations[]', a))

      const config = { headers: { 'Content-Type': 'multipart/form-data' } }

      if (isEdit && destinationId) {
        await axios.put(`http://localhost:8000/api/tourist-destinations/${destinationId}`, payload, config)
        successMessage.value = 'Destination updated successfully!'
      } else {
        await axios.post(`http://localhost:8000/api/tourist-destinations`, payload, config)
        successMessage.value = 'Destination saved successfully!'

        // reset form
        form.value = {
          destinationName: '',
          location: '',
          category: '',
          description: '',
          openTime: '',
          closeTime: '',
          ticketPrice: null,
          latitude: null,
          longitude: null,
          image: null
        }
        selectedFacilities.value = []
        selectedAccommodations.value = []
        if (marker) { map.removeLayer(marker); marker = null }
      }

      errorMessage.value = ''
      showToast(successToast)
      setTimeout(() => { router.push({ name: 'DestinationList' }) }, 1000)
    } catch (err) {
      console.error(err)
      successMessage.value = ''
      errorMessage.value = 'Failed to save/update destination.'
      showToast(errorToast)
    }
  }

  // ----------------- Destination List -----------------
  const destinations = ref({ data: [], current_page: 1, last_page: 1, per_page: 10 })
  const totalPages = ref([])

  const loadDestinations = async (page = 1) => {
    try {
      const res = await axios.get(`http://localhost:8000/api/tourist-destinations?page=${page}`)
      destinations.value = res.data
      totalPages.value = Array.from({length: destinations.value.last_page}, (_, i) => i+1)
    } catch (err) {
      console.error(err)
      errorMessage.value = 'Failed to load destinations.'
      showToast(errorToast)
    }
  }

  const fetchPage = (page) => { if (page >= 1 && page <= destinations.value.last_page) loadDestinations(page) }

  // ----------------- Actions: Edit, Delete, View -----------------
  const editDestination = (d) => router.push({ name: 'EditDestination', params: { id: d.id } })

  const deleteDestination = async (id) => {
    if (!confirm('Are you sure want to delete this destination?')) return
    try {
      await axios.delete(`http://localhost:8000/api/tourist-destinations/${id}`)
      successMessage.value = 'Destination deleted successfully!'
      errorMessage.value = ''
      showToast(successToast)
      loadDestinations(destinations.value.current_page)
    } catch (err) {
      console.error(err)
      successMessage.value = ''
      errorMessage.value = 'Failed to delete destination.'
      showToast(errorToast)
    }
  }

  // ----------------- Modal Detail -----------------
  const showModal = ref(false)
  const selectedDestination = ref(null)
  const viewDetail = async (d) => {
    try {
      selectedDestination.value = await loadDestination(d.id)
      showModal.value = true
    } catch (err) {
      console.error(err)
      errorMessage.value = 'Failed to load destination detail.'
      showToast(errorToast)
    }
  }
  const closeModal = () => { showModal.value = false; selectedDestination.value = null }

  return {
    form,
    facilities,
    accommodations,
    selectedFacilities,
    selectedAccommodations,
    submitForm,
    loadDestination,
    onFileChange, // 🔹 image handler

    successMessage,
    errorMessage,
    successToast,
    errorToast,
    showToast,
    autoCloseToast,
    closeToast,

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

    loadAccommodations,
    loadFacility
  }
}
