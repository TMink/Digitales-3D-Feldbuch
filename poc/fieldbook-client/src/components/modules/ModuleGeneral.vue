<template>
  <v-col lg="12">
    <v-card class="pa-4">
      <v-card-text>
        <h2 class="text-h6 font-weight-medium pb-2">
          {{ $t('generalInformation') }}
        </h2>
      </v-card-text>
      <v-row class="pt-2">
        <v-col lg="4">
          <v-combobox 
            chips 
            multiple 
            hide-selected 
            closable-chips 
            color="primary" 
            :items="titles" 
            persistent-hint
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
            persistent-hint
            :hide-no-data="false" 
            :label="$t('date')" 
            v-model="object.date">
          </v-text-field>

          <v-text-field 
            class="pt-1" 
            rows="2" 
            no-resize 
            color="primary" 
            :label="$t('editor')" 
            :rules="is_required"
            v-model="object.editor">
          </v-text-field>

        </v-col>

        <v-col lg="8">
          <v-textarea 
            rows="8" 
            no-resize 
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
        describer: null,
        editor: null,
        date: null,
        title: null,
      }
    }
  },

  watch: {
    "object.describer": {
      handler: function () {
        if ( this.object.describer != null ) {
          /* Send data back to ModelViewer.vue */
          this.$emit("dataToModelViewer", ['describer', this.object.describer]);
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
    }
  },

  updated() {
    this.type = this.getType(this.$route.path)
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