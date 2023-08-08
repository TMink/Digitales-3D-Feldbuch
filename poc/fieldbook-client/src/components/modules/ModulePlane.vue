<template>
    <v-card height="10em">
        <v-textarea 
            rows="2" 
            counter 
            no-resize 
            color="primary" 
            class="ma-1 px-2 pt-2" 
            v-model="place.plane"
            :label="$t('plane')">
        </v-textarea>
    </v-card>
</template>

<script>
/**
 * Methods overview:
 */
import { fromOfflineDB } from '../../ConnectionToOfflineDB';

export default {

  name: 'PlaceCreation',
  components: {

  },
  emits: ['view'],
  setup() {
    
  },
  /**
   * Reactive Vue.js data
   */
  data() {

    return {
      tab: null,
      place: {
        id: '',
        activityID: '',
        placeNumber: '',

        code: '',         //can maybe be removed
        title: [],
        datingCode: '',   //can maybe be removed
        dating: '',
        noFinding: false,
        restFinding: false,
        right: '',
        rightTo: '',
        up: '',
        upTo: '',
        depthTop: '',
        depthBot: '',
        plane: '',
        profile: '',
        visibility: '',
        drawing: '',
        description: '',
        planum: '',
        editor: '',
        date: '',

        positions: [],
        images: [],
        models: [],
        lines: [],
        lastChanged: '',
        lastSync: ''
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
      searchQuery: '',
      hoveredRow: -1,
      positions: null,
      titles: [],
      datings: [],
      is_required: [v => !!v || 'Pflichtfeld'],
      tickLabels: {
        3: this.$t('veryGood'),
        2: this.$t('good'),
        1: this.$t('moderate'),
        0: this.$t('bad'),
      },
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
    getTableHeight() {
      // Calculate the required table height based on the number of items
      const numberOfRows = this.positions.length > 0 ? this.positions.length : 1;
      const headerHeight = 56;
      const rowHeight = 73;
      const totalTableHeight = numberOfRows * rowHeight + headerHeight;

      if (totalTableHeight > (this.windowHeight - 350)) {
        return this.windowHeight - 350;
      }

      return totalTableHeight + "px";
    },
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