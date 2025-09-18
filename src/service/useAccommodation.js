import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import L from 'leaflet'

export function useAccommodation(isEdit = false, accommodationId = null, withMap = false) {
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
    accommodationName: '',
    location: '',
    category: '',
    contact: '',
    rating: '',
    price: '',
    latitude: null,
    longitude: null
  })

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
  const loadAccommodation = async (id) => {
    try {
      const res = await axios.get(`http://localhost:8000/api/accommodation/${id}`)
      const data = res.data

      form.value.accommodationName = data.accommodationName
      form.value.location = data.location
      form.value.category = data.category
      form.value.contact = data.contact
      form.value.rating = data.rating
      form.value.price = data.price
      form.value.latitude = data.latitude
      form.value.longitude = data.longitude

      if (data.latitude && data.longitude && map) {
        const latLng = [data.latitude, data.longitude]
        marker = L.marker(latLng).addTo(map)
        map.setView(latLng, 13)
      }

      return data
    } catch (err) {
      console.error('Failed to load accommodation:', err)
      errorMessage.value = 'Failed to load accommodation data.'
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
    

      if (isEdit && accommodationId) {
        await axios.put(`http://localhost:8000/api/accommodation/${accommodationId}`, payload)
        successMessage.value = 'Destination updated successfully!'
      } else {
        await axios.post(`http://localhost:8000/api/accommodation`, payload)
        successMessage.value = 'Accommodation saved successfully!'

        // reset form
        form.value = {
          accommodationName: '',
          location: '',
          category: '',
          contact: '',
          rating: '',
          price: '',
          latitude: null,
          longitude: null
        }
        if (marker) { map.removeLayer(marker); marker = null }
      }

      errorMessage.value = ''
      showToast(successToast)
      // setTimeout(() => { router.push({ name: 'AccommodationList' }) }, 1000)
    } catch (err) {
      console.error(err)
      successMessage.value = ''
      errorMessage.value = 'Failed to save/update accommodation.'
      showToast(errorToast)
    }
  }

  // ----------------- Accommodation List -----------------
  const accommodations = ref({ data: [], current_page: 1, last_page: 1, per_page: 10 })
  const totalPages = ref([])

  const loadAccommodations = async (page = 1) => {
    try {
      const res = await axios.get(`http://localhost:8000/api/accommodation?page=${page}`)
      accommodations.value = res.data
      totalPages.value = Array.from({length: accommodations.value.last_page}, (_, i) => i+1)
    } catch (err) {
      console.error(err)
      errorMessage.value = 'Failed to load accommodations.'
      showToast(errorToast)
    }
  }

  const fetchPage = (page) => { if (page >= 1 && page <= accommodations.value.last_page) loadAccommodations(page) }

  // ----------------- Actions: Edit, Delete, View -----------------
  const editAccommodations = (d) => router.push({ name: 'EditAccommodation', params: { id: d.id } })

  const deleteAccommodation = async (id) => {
    if (!confirm('Are you sure want to delete this accommodation?')) return
    try {
      await axios.delete(`http://localhost:8000/api/accommodation/${id}`)
      successMessage.value = 'Accommodation deleted successfully!'
      errorMessage.value = ''
      showToast(successToast)
      loadAccommodations(destinations.value.current_page)
    } catch (err) {
      console.error(err)
      successMessage.value = ''
      errorMessage.value = 'Failed to delete destination.'
      showToast(errorToast)
    }
  }

  return {
    form,
    submitForm,
    loadAccommodation,
    onFileChange,

    successMessage,
    errorMessage,
    successToast,
    errorToast,
    showToast,
    autoCloseToast,
    closeToast,

    accommodations,
    totalPages,
    loadAccommodations,
    fetchPage,
    editAccommodations,
    deleteAccommodation,
  }
}
