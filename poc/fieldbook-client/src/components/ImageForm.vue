<template>
    <v-card>

      <!-- IMAGES LIST -->
      <v-list>
        <v-list-subheader v-if="images.length === 0">
          {{ $t('not_created_yet', { object: $tc('image', 1) }) }}
        </v-list-subheader>


        <template v-for="(image, i) in images" :key="image">

          <!-- LIST ITEM -->
          <v-card class="imageItem mt-3 d-flex align-center">
            <v-card-title> Nr. {{ image.imageNumber }} </v-card-title>
            <v-card-subtitle> {{ image.title }} </v-card-subtitle>
            <v-img height="150" :src=image.image></v-img>
            <v-btn 
              color="error" 
              class="ml-2" 
              v-on:click="deleteImage(image)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-card>

          <v-divider v-if="i !== image.length - 1"></v-divider>
        </template>
      </v-list>
    </v-card>

    <AddButton v-on:click="image_dialog = true" />

    <!-- IMAGE CREATION DIALOG -->
    <v-dialog v-model="image_dialog" max-width="800" persistent>
      <v-card>
        <v-card-title>
          {{ $t('add', { msg: $t('image') }) }}
        </v-card-title>
        <v-card-text>

          <v-text-field 
            disabled 
            v-model="object.id" 
            label="ID">
          </v-text-field>

          <v-text-field 
          v-model="image.title" 
          :label="$t('title')" 
          :hint="$t('please_input', 
          {msg: $t('title_of', { msg: $t('image') })})">
          </v-text-field>

          <v-file-input 
            show-size 
            v-model="image.image" 
            prepend-icon="mdi-camera"
            accept="image/png, image/jpeg, image/bmp">
          </v-file-input>
        </v-card-text>

        <v-card-actions class="justify-center">
          <v-btn icon color="primary" v-on:click="addImage()">
            <v-icon>mdi-content-save-all</v-icon>
          </v-btn>
          <v-btn icon color="error" @click="image_dialog = false">
            <v-icon>mdi-close-circle</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  
</template>

<script>
import AddButton from '../components/AddButton.vue';
import VueCookies from 'vue-cookies';
import { fromOfflineDB } from '../ConnectionToOfflineDB.js';
import { toRaw } from 'vue';

export default {
  name: "AddPosition",
  components: {
    AddButton
  },
  /**
   * Props from PlaceForm/PositionForm
   */
  props: {
    object_id: String,
    object_type: String,
  },
  /**
   * Reactive Vue.js data
   */
  data() {
    return {
      object: '',
      image: {
        id: '',
        positionID: '',
        placeID: '',
        title: '',
        image: [],
      },
      images: [],
      image_dialog: false,
      is_required: [v => !!v || 'Pflichtfeld'],
    }
  },
  /**
   * Initialize data from IndexedDB to the reactive Vue.js data
   */
  async created() {
    await fromOfflineDB.syncLocalDBs();
    await this.updateObject();
    await this.updateImages();
  },
  methods: {
    /**
     * Update reactive Vue.js object data
     */
    async updateObject() {
      this.object = await fromOfflineDB.getObject(this.object_id, 
                        this.object_type, this.object_type.toLowerCase());
    },

    /**
     * Update reactive Vue.js images data
     */
    async updateImages() {
      var objectType = this.object_type.substring(0, this.object_type.length - 1);
      this.images = await fromOfflineDB.getAllObjectsWithID(
                      this.object_id, objectType, 'Images', 'images');
    },

    /**
     * Adds a new image-placeholder to the images-array
     */
    async addImage() {
      // Add imageID to the object array of all images
      var newImageID = String(Date.now());
      var rawObject = toRaw(this.object);
      var rawImage = toRaw(this.image);

      // update lastChanged date of object
      rawObject.images.push(newImageID);
      rawObject.lastChanged = Date.now();

      // new image data
      const newImage = {
        id: newImageID,
        imageNumber: null,
        title: rawImage.title,
        image: await this.textureToBase64(toRaw(rawImage.image)),
        lastChanged: Date.now(),
        lastSync: ''
      };

      // set the image parentID
      if (this.object_type == "Positions") {
        newImage.positionID = this.object_id;
      } else {
        newImage.placeID = this.object_id;
      }

      // set new imageNumber
      if (this.images.length == 0) {
        newImage.imageNumber = 1;
      } else {
        this.updateImages();
        const imageNumber = Math.max(...this.images.map(o => o.imageNumber));
        const newImageNumber = imageNumber + 1;
        newImage.imageNumber = newImageNumber;
      }

      // hide image creation dialog
      this.image_dialog = false;

      // update IndexedDB
      await fromOfflineDB.updateObject(rawObject, this.object_type, this.object_type.toLowerCase())
      await fromOfflineDB.addObject(newImage, "Images", "images");
      await fromOfflineDB.addObject({ id: newImageID, object: 'images' }, 'Changes', 'created');
      await this.updateImages();
    },

    /**
     * Change texture data to base64
     * @param {*} rawData 
     */
    async textureToBase64(rawData) {

      const output = await new Promise((resolve) => {

        let reader = new FileReader();
        let f = rawData[0];
        reader.onload = e => {
          const b64 = e.target.result
          resolve(b64)
        }
        reader.readAsDataURL(f);

      });
      return output;
    },

    /**
     * Removes an image from IndexedDB and the connected object
     * @param {ProxyObject} image 
     */
    async deleteImage(image) {

      var rawImage = toRaw(image);
      var rawObject = toRaw(this.object);
      var index = rawObject.images.indexOf(rawImage.id.toString())

      // Remove the imageID from connected object
      if (index != -1) {
        rawObject.images.splice(index, 1);
        rawObject.lastChanged = Date.now();
        await fromOfflineDB.updateObject(rawObject, this.object_type, this.object_type.toLowerCase());
      }

      // Delete the image itself
      await fromOfflineDB.deleteObject(image, 'Images', 'images');
      VueCookies.remove('currentImage');

      await this.updateImages();
    },

    /**
     * Closes the image creation dialog
     */
    closeDiag() {
      this.dialog = false;
      this.$emit('closeDiag', false);
    },
    
  }
}
</script>