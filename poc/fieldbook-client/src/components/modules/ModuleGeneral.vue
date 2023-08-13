<template>
  <v-col lg="12">
    <v-card class="pa-4"
      v-if="type == 'positions'">
      <h2 class="text-h6 font-weight-medium pb-1">
        {{ $t('generalInformation') }}
      </h2>
      <v-divider/>
      <v-row class="align-center pt-4">
        <v-col cols="2">
          <v-text-field 
            color="primary" 
            :label="$tc('posNumber', 2) + ' *'" 
            maxlength="6" 
            hide-details 
            :rules="is_required"
            v-model="object.positionNumber" 
            @keypress="filterAllNonNumeric(event)">
          </v-text-field>
        </v-col>

        <v-col cols="2">
          <v-text-field 
            hide-details 
            color="primary" 
            :label="$tc('subNumber', 2)" 
            maxlength="5"
            :disabled="!object.hasSubNumber" 
            v-model="object.subNumber">
          </v-text-field>
        </v-col>

        <v-col cols="2">
          <v-tooltip location="bottom">
            <template v-slot:activator="{ props }">
              <v-checkbox 
                hide-details 
                v-bind="props"
                :label="$t('hasSubNumber')" 
                color="secondary" 
                v-model="object.hasSubNumber">
              </v-checkbox>
            </template>
            Check, if the position should have a dedicated subNumber.
          </v-tooltip>
        </v-col>

        <v-col cols="2">
          <v-tooltip location="bottom">
              <template v-slot:activator="{ props }">
                <v-checkbox 
                  class="pl-4" 
                  v-bind="props"
                  hide-details 
                  v-model="object.isSeparate" 
                  color="primary"
                  :disabled="!object.hasSubNumber" 
                  :label="$t('isSeparate')">
                </v-checkbox>
              </template>
              Check, if the position should be saved with a separate
              subNumber, <br>even though the information is similar to the 
                          previous position.
            </v-tooltip>
        </v-col>

        <!-- <v-col cols="2" class="pa-0">
          <v-card class="pa-4 ma-2 mr-3" color="accent">
          <div 
            class="text-h6 text-center" 
            :label="$t('date')">
            {{ object.date }}
          </div>
          <div class="text-body-2 text-grey text-center">
            {{ $t('date') }}
          </div>
        </v-card>
        </v-col> -->
        <v-spacer></v-spacer>

        <v-col cols="2">

          <v-text-field
            hide-details
            color="primary" 
            :hide-no-data="false" 
            :label="$t('date')"
            v-model="object.date">
          </v-text-field>
        </v-col>
      </v-row>

      <v-row class="pt-2">
        <v-col lg="4">
          <v-combobox 
            color="primary" 
            :items="titles" 
            :label="$tc('title', 2) + ' *'" 
            :rules="is_required"
            v-model="object.title">
          </v-combobox>

          <v-text-field 
            class="pt-4" 
            color="primary" 
            hide-details
            :label="$t('editor') + ' *'" 
            :rules="is_required"
            v-model="object.addressOf" 
            no-resize :hint="$tc('please_input', 2, { msg: 'Ansprache von' })">
          </v-text-field>
        </v-col>

        <v-col lg="8">
          <v-textarea 
            rows="5" 
            no-resize 
            hide-details
            color="primary" 
            :label="$t('description')" 
            v-model="object.description">
          </v-textarea>
        </v-col>
      </v-row>
    </v-card>

    <v-card class="pa-4" v-if="type == 'places'">
      <h2 class="text-h6 font-weight-medium pb-1">
        {{ $t('generalInformation') }}
      </h2>
      <v-divider/>
      <v-row class="pt-4">
        <v-col lg="4">
          <v-combobox 
            chips 
            multiple 
            hide-selected 
            closable-chips 
            color="primary" 
            :items="titles" 
            :label="$tc('title', 2)" 
            :hide-no-data="false" 
            v-model="object.title">

            <template #selection="{ item }">
              <v-chip color="secondary">{{ item }}</v-chip>
            </template>

            <template v-slot:no-data>
              <v-list-item>
                <v-list-item-title>
                  {{ $t('noResults') }}
                </v-list-item-title>
              </v-list-item>
            </template>
          </v-combobox>

          <v-text-field 
            class="pt-1" 
            no-resize 
            hide-selected
            color="primary" 
            :items="titles" 
            :hide-no-data="false" 
            :label="$t('date')" 
            v-model="object.date">
          </v-text-field>

          <v-text-field 
            class="pt-1" 
            rows="2" 
            no-resize 
            hide-details
            color="primary" 
            :label="$t('editor')" 
            :rules="is_required"
            v-model="object.editor">
          </v-text-field>

        </v-col>

        <v-col lg="8">
          <v-textarea 
            rows="8" 
            hide-details
            color="primary" 
            v-model="object.description" 
            :label="$t('description')">
          </v-textarea>
        </v-col>
      </v-row>
    </v-card>
  </v-col>
</template>

<script>
export default {
		
	props: {
    objectProp: Object,
  },

  emits: ['dataToModelViewer'],

  data() {
    return {
      type: null,
      object: {
        description: null,
        editor: null,
        date: null,
        title: null,

        positionNumber: null,
        hasSubNumber: null,
        subNumber: null,
        addressOf: null,
      },
      is_required: [v => !!v || 'Pflichtfeld'],
    }
  },

  watch: {
    "object.description": {
      handler: function () {
        if ( this.object.description != null ) {
          /* Send data back to ModelViewer.vue */
          this.$emit("dataToModelViewer", ['description', this.object.description]);
        }
      }
    },
    "object.editor": {
      handler: function () {
        if ( this.object.editor != null ) {
          /* Send data back to ModelViewer.vue */
          this.$emit("dataToModelViewer", ['editor', this.object.editor]);
        }
      }
    },
    "object.date": {
      handler: function () {
        if ( this.object.date != null ) {
          /* Send data back to ModelViewer.vue */
          this.$emit("dataToModelViewer", ['date', this.object.date]);
        }
      }
    },
    "object.title": {
      handler: function () {
        if ( this.object.title != null ) {
          /* Send data back to ModelViewer.vue */
          this.$emit("dataToModelViewer", ['title', this.object.title]);
        }
      }
    },
    "object.positionNumber": {
      handler: function () {
        if ( this.object.positionNumber != null && this.type == 'positions' ) {
          /* Send data back to ModelViewer.vue */
          this.$emit("dataToModelViewer", ['positionNumber', this.object.positionNumber]);
        }
      }
    },
    "object.hasSubNumber": {
      handler: function () {
        if ( this.object.hasSubNumber != null && this.type == 'positions' ) {
          /* Send data back to ModelViewer.vue */
          this.$emit("dataToModelViewer", ['hasSubNumber', this.object.hasSubNumber]);
        }
      }
    },
    "object.subNumber": {
      handler: function () {
        if ( this.object.subNumber != null && this.type == 'positions' ) {
          /* Send data back to ModelViewer.vue */
          this.$emit("dataToModelViewer", ['subNumber', this.object.subNumber]);
        }
      }
    },
    "object.addressOf": {
      handler: function () {
        if ( this.object.addressOf != null && this.type == 'positions' ) {
          /* Send data back to ModelViewer.vue */
          this.$emit("dataToModelViewer", ['addressOf', this.object.addressOf]);
        }
      }
    }
  },

  created() {
    this.type = this.getType(this.$route.path)
    this.titles = JSON.parse(import.meta.env.VITE_TITLES);
    this.object = this.objectProp;
  },

  methods: {
    getType(path) {
      const lowerName = path.substring(
        path.indexOf("/") + 1, 
        path.lastIndexOf("/")
      );
      return lowerName
    },
  }

}

</script>

<style scoped></style>