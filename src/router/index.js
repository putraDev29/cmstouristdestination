import { createRouter, createWebHistory } from 'vue-router'
import CreateDestination from '../components/CreateDestination.vue'
import DestinationList from '../components/DestinationList.vue'
import EditDestination from '../components/EditDestination.vue'
import CreateAccommodation from '../components/CreateAccommodation.vue'
import AccommodationList from '../components/AccommodationList.vue'
import EditAccommodation from '../components/EditAccommodation.vue'
import CreateFacility from '../components/CreateFacility.vue'
import FacilityList from '../components/FacilityList.vue'
import EditFacility from '../components/EditFacility.vue'

const routes = [
  {
    path: '/createdestination',
    name: 'CreateDestination',
    component: CreateDestination
  },
  {
    path: '/',
    name: 'DestinationList',
    component: DestinationList
  },
  {
    path: '/edit/:id',
    name: 'EditDestination',
    component: EditDestination
  },
  {
    path: '/createaccommodation',
    name: 'CreateAccommodation',
    component: CreateAccommodation
  },
  {
    path: '/accommodationList',
    name: 'AccommodationList',
    component: AccommodationList
  },
  {
    path: '/editAccommodation/:id',
    name: 'EditAccommodation',
    component: EditAccommodation
  },
  {
    path: '/createfacility',
    name: 'CreateFacility',
    component: CreateFacility
  },
  {
    path: '/facilityList',
    name: 'FacilityList',
    component: FacilityList
  },
  {
    path: '/editFacility/:id',
    name: 'EditFacility',
    component: EditFacility
  }


]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
