<template>
    <v-card>
        <v-card-text>
            <h2 class="text-h6 font-weight-medium pb-2">
                {{ $t('coordinates') }}
            </h2>
        </v-card-text>
        <v-row 
            no-gutters 
            justify="center">

            <v-text-field 
                hide-details 
                color="primary" 
                class="px-4 pb-4" 
                density="compact" 
                v-model="place.right"
                :label="$t('right')" 
                @keypress="filterNonNumeric(event)">
            </v-text-field>

            <v-text-field 
                hide-details 
                color="primary" 
                class="pr-4 pb-4" 
                density="compact" 
                :label="$t('rightTo')"
                v-model="place.rightTo" 
                @keypress="filterNonNumeric(event)">
            </v-text-field>

            <v-divider 
                class="mt-n1 mb-n2" 
                vertical />
            <v-text-field 
                hide-details 
                color="primary" 
                class="px-4 pb-4" 
                density="compact" 
                :label="$t('up')"
                v-model="place.up" 
                @keypress="filterNonNumeric(event)">
            </v-text-field>

            <v-text-field 
                hide-details 
                color="primary" 
                class="pr-4 pb-4" 
                density="compact" 
                :label="$t('upTo')"
                v-model="place.upTo" 
                @keypress="filterNonNumeric(event)">
            </v-text-field>

            <v-divider 
                class="mt-n1 mb-n2" 
                vertical />

            <v-text-field 
                hide-details 
                color="primary" 
                class="px-4 pb-4" 
                density="compact" 
                :label="$t('depthTop')"
                v-model="place.depthTop" 
                @keypress="filterNonNumeric(event)">
            </v-text-field>

            <v-text-field 
                hide-details 
                color="primary" 
                class="pr-4 pb-4" 
                density="compact" 
                :label="$t('depthBot')"
                v-model="place.depthBot" 
                @keypress="filterNonNumeric(event)">
            </v-text-field>
        </v-row>
    </v-card>
</template>

<script>
/**
 * Methods overview:
 */
import { fromOfflineDB } from '../../ConnectionToOfflineDB';

export default {

  data() {

    return {
      place: {
        placeNumber: '',
        title: [],
        right: '',
        rightTo: '',
        up: '',
        upTo: '',
        depthTop: '',
        depthBot: '',
        date: '',
        positions: []
      },
      headers: [
        {
          title: this.$t('posNumber'),
          align: 'start',
          sortable: true,
          key: 'positionNumber',
        },
        {
          title: this.$t('subNumber'),
          align: 'start',
          sortable: true,
          key: 'subNumber',
        },
        { title: this.$tc('title', 2), align: 'start', key: 'title' },
        { title: this.$t('date'), align: 'start', key: 'date' },
      ],
      positions: null,
      titles: [],
      datings: [],
      hasUnsavedChanges: false,
      componentHasLoaded: false,
    }

  },
  /**
   * Check if there are unsaved changes to the position 
   * before leaving the PositionForm
   * @param {*} to 
   * @param {*} from 
   * @param {*} next 
   */
  async beforeRouteLeave(to, from, next) {
    var confirmation = false;
    if (this.hasUnsavedChanges) {
      confirmation = await this.confirmRouteChange();
      if (confirmation) {
        next();
      }
    } else {
      next();
    }
  },
  /**
   * Initialize data from localDB to the reactive Vue.js data
   */
  async created() {
    const acID = String(VueCookies.get('currentActivity'))
    var activity = await fromOfflineDB.getObject(acID, 'Activities', 'activities')

    const plID = String(VueCookies.get('currentPlace'))
    var place = await fromOfflineDB.getObject(plID, 'Places', 'places')
    
    this.$emit("view", activity.activityNumber + ' ' + place.placeNumber);

    this.titles = JSON.parse(import.meta.env.VITE_TITLES);
    this.datings = JSON.parse(import.meta.env.VITE_DATINGS);

    await fromOfflineDB.syncLocalDBs();
    await this.updatePlace();
    await this.updatePositions();
    this.componentHasLoaded = true;
  },
  watch: {
    'place': {
      handler: 'handlePlaceChange',
      deep: true,
    },
    /**
     * Ensure that only 5 items are selected
     * @param {*} val 
     */
    'place.title'(val) {
      if (val.length > 5) {
        this.$nextTick(() => this.place.title.pop())
      }
    },
  },

  computed: {
   
  },

  methods: {
    /**
     * Prevents the input of non numeric values 
     * (allows one single `,` or `.` for float values)
     * @param {*} evt 
     */
    filterNonNumeric(evt) {
      evt = (evt) ? evt : window.event;
      let expect = evt.target.value.toString() + evt.key.toString();

      if (!/^[-+]?[0-9]*[,.]?[0-9]*$/.test(expect)) {
        evt.preventDefault();
      } else {
        return true;
      }
    }
  }
};

</script>

<style scoped></style>
