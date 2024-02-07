<!--
 * Created Date: 09.01.2024 11:33:59
 * Author: Julian Hardtung
 * 
 * Last Modified: 07.02.2024 10:48:13
 * Modified By: Julian Hardtung
 * 
 * Description: lists all images of a place
 -->

<template>
  <v-card v-if="images.length === 0">
    <v-list>

      <!-- IMAGES LIST -->
      <v-list-subheader>
        {{ $t('not_created_yet', { object: $tc('image', 1) }) }}
      </v-list-subheader>

    </v-list>
  </v-card>

  <!-- LIST ITEM -->
  <v-row no-gutters class="align-center">
    <v-col xl="3" md="4" sm="6" v-for="(item, i) in images" :key="item">
      <v-card class="pa-2 ma-2">
        <v-card-title> Nr. {{ item.imageNumber }} </v-card-title>
        <v-card-subtitle> {{ item.title }} </v-card-subtitle>

        <v-img 
          cover height="200" 
          class="ma-2 my-4" 
          :src="item.image" 
          style="cursor: zoom-in" 
          v-on:click="openImage(i)">
        </v-img>

        <v-row no-gutters>
          <v-spacer />
          <v-btn color="primary" class="mr-2" v-on:click="editImage(item)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>

          <v-btn color="error" v-on:click="deleteImage(item)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-row>
      </v-card>
    </v-col>
  </v-row>


  <!-- IMAGE CAROUSEL DIALOG -->
  <v-dialog v-model="img_carousel_dialog">
    <v-carousel hide-delimiters :model-value="carouselIndex" height="100vh">
      <v-carousel-item 
        @click="closeImgDialog" 
        v-for="(item, i) in images" 
        :key="i" 
        :src="item.image">
      </v-carousel-item>
    </v-carousel>
  </v-dialog>
</template>

<script>
import { fromOfflineDB } from '../ConnectionToOfflineDB.js';
import { toRaw } from 'vue';

export default {
  name: "ImageOverview",
  /**
   * Props from PlaceForm/PositionForm
   */
  props: {
    object_id: String,
  },
  /**
   * Reactive Vue.js data
   */
  data() {
    return {
      images: [],
      img_carousel_dialog: false,
    }
  },
  /**
   * Initialize data from IndexedDB to the reactive Vue.js data
   */
  async created() {
    await fromOfflineDB.syncLocalDBs();
    await this.updateImages();

  },
  methods: {
    /**
     * Update reactive Vue.js images data
     */
    async updateImages() {
      var curPlace = await fromOfflineDB.getObject(this.object_id, 'Places', 'places');

      var allPositions = await fromOfflineDB.getAllObjectsFromArray(curPlace.positions, 'Positions', 'positions');
      var allImages = [];

      allPositions.forEach(curPos => {
        if (curPos.images.length > 0) {
          curPos.images.forEach(imagesID => {
            allImages.push(imagesID);
          });
        }
      });
      this.images = await fromOfflineDB.getAllObjectsFromArray(allImages, 'Images', 'images');
    },

    /**
     * Routes to the PositionForm of the image
     * @param {ProxyObject} image 
     */
    editImage(image) {
      this.$cookies.set('currentPosition', image.positionID);
      this.$router.push({ name: 'PositionCreation', params: { positionID: image.positionID } });
    },

    /**
     * Removes an image from IndexedDB and the connected object
     * @param {ProxyObject} image 
     */
    async deleteImage(image) {

      var curPlaceID = this.$cookies.get('currentPlace');
      var curPlace = await fromOfflineDB.getObject(curPlaceID, 'Places', 'places');
      var rawImage = toRaw(image);
     
      // Remove the posID from place
      var index = curPlace.positions.indexOf(rawImage.positionID.toString());
      if (index != -1) {
        curPlace.positions.splice(index, 1);
        curPlace.lastChanged = Date.now();
        await fromOfflineDB.updateObject(curPlace, 'Places', 'places');
      }
      
      // Delete position
      var curPos = await fromOfflineDB.getObject(rawImage.positionID, 'Positions', 'positions');
      await fromOfflineDB.deleteObject(curPos, 'Positions', 'positions');

      // Delete the image itself
      await fromOfflineDB.deleteObject(rawImage, 'Images', 'images');
      this.$cookies.remove('currentImage');


      // update local images list, without additional IndexedDB access
      var imgIndex = this.images.indexOf(rawImage);
      this.images.splice(imgIndex, 1);
    },

    /**
     * Opens an image in a dedicated dialog
     * @param {ImageObject} image 
     */
    async openImage(index) {
      this.img_carousel_dialog = true;
      this.carouselIndex = index;
    },

    /**
     * Closes the image carousel dialog
     */
    closeImgDialog() {
      this.img_carousel_dialog = false;
    },
  }
}
</script>

<style scoped></style>