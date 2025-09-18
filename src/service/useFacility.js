import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import L from 'leaflet'

export function useFacility(isEdit = false, facilityId = null, withMap = false) {
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
    facilityName: '',
    location: '',
    category: '',
    location: '',
    openTime: '',
    closeTime: '',
    contact: '',
    latitude: null,
    longitude: null,
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

  // ----------------- Load single facility -----------------
  const loadFacility = async (id) => {
    try {
      const res = await axios.get(`http://localhost:8000/api/facility/${id}`)
      const data = res.data

      form.value.facilityName = data.facilityName
      form.value.location = data.location
      form.value.category = data.category
      form.value.contact = data.contact
      form.value.openTime = data.openTime
      form.value.closeTime = data.closeTime
      form.value.latitude = data.latitude
      form.value.longitude = data.longitude

      if (data.latitude && data.longitude && map) {
        const latLng = [data.latitude, data.longitude]
        marker = L.marker(latLng).addTo(map)
        map.setView(latLng, 13)
      }

      return data
    } catch (err) {
      console.error('Failed to load facility:', err)
      errorMessage.value = 'Failed to loadfacility data.'
      showToast(errorToast)
    }
  }

  // ----------------- Submit (Create / Update) -----------------
  const submitForm = async () => {
    try {
      const payload = new FormData()
      for (const key in form.value) {
        if (form.value[key] !== null) payload.append(key, form.value[key])
      }
      
      if (isEdit && facilityId) {
        await axios.put(`http://localhost:8000/api/facility/${facilityId}`, payload)
        successMessage.value = 'Facility updated successfully!'
      } else {
        await axios.post(`http://localhost:8000/api/facility`, payload)
        successMessage.value = 'Facility saved successfully!'

        // reset form
        form.value = {
          facilityName: '',
          location: '',
          category: '',
          contact: '',
          openTime: '',
          closeTime: '',
          latitude: null,
          longitude: null
        }
        if (marker) { map.removeLayer(marker); marker = null }
      }

      errorMessage.value = ''
      showToast(successToast)
      setTimeout(() => { router.push({ name: 'FacilityList' }) }, 1000)
    } catch (err) {
      console.error(err)
      successMessage.value = ''
      errorMessage.value = 'Failed to save/update facility.'
      showToast(errorToast)
    }
  }

  // ----------------- Facility List -----------------
  const facility = ref({ data: [], current_page: 1, last_page: 1, per_page: 10 })
  const totalPages = ref([])

  const loadFacilities = async (page = 1) => {
    try {
      const res = await axios.get(`http://localhost:8000/api/facility?page=${page}`)
      facility.value = res.data
      totalPages.value = Array.from({length: facility.value.last_page}, (_, i) => i+1)
    } catch (err) {
      console.error(err)
      errorMessage.value = 'Failed to load facility.'
      showToast(errorToast)
    }
  }

  const fetchPage = (page) => { if (page >= 1 && page <= facility.value.last_page) loadFacilities(page) }

  // ----------------- Actions: Edit, Delete, View -----------------
  const editFacility = (d) => router.push({ name: 'EditFacility', params: { id: d.id } })

  const deleteFacility = async (id) => {
    if (!confirm('Are you sure want to delete this facility?')) return
    try {
      await axios.delete(`http://localhost:8000/api/facility/${id}`)
      successMessage.value = 'Facility deleted successfully!'
      errorMessage.value = ''
      showToast(successToast)
      loadFacilities(facility.value.current_page)
    } catch (err) {
      console.error(err)
      successMessage.value = ''
      errorMessage.value = 'Failed to delete facility.'
      showToast(errorToast)
    }
  }

  return {
    form,
    submitForm,
    loadFacility,

    successMessage,
    errorMessage,
    successToast,
    errorToast,
    showToast,
    autoCloseToast,
    closeToast,

    facility,
    totalPages,
    loadFacilities,
    fetchPage,
    editFacility,
    deleteFacility,
  }
}
