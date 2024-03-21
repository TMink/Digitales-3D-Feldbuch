<!--
 * Created Date: 09.01.2024 11:33:59
 * Author: Julian Hardtung
 * 
 * Last Modified: 21.03.2024 17:04:03
 * Modified By: Julian Hardtung
 * 
 * Description: lists all images of a place
 -->

<template>
  <v-card>
    <v-card-title>{{ $t('imageOverview')}}</v-card-title>
    <v-divider v-if="images.length === 0"></v-divider>

    <v-list-subheader class="pa-4" v-if="images.length === 0">
      {{ $t('not_created_yet', { object: $tc('image', 2) }) }}
    </v-list-subheader>

  </v-card>

  <!-- LIST ITEM -->
  <v-row no-gutters class="align-center mx-n2">
    <v-col xl="3" md="4" sm="6" v-for="(item, i) in images" :key="item">
      <v-card class="pa-2 my-2 ma-1">
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
    await fromOfflineDB.syncLocalDBs().catch(err => console.error(err));
    await this.updateImages().catch(err => console.error(err));

  },
  methods: {
    /**
     * Update reactive Vue.js images data
     */
    async updateImages() {
      var curPlace = await fromOfflineDB
        .getObject(this.object_id, 'Places', 'places')
        .catch(err => console.error(err));

      var allPositions = await fromOfflineDB
        .getAllObjectsFromArray(curPlace.positions, 'Positions', 'positions')
        .catch(err => console.error(err));
      var allImages = [];

      allPositions.forEach(curPos => {
        if (curPos.images.length > 0) {
          curPos.images.forEach(imagesID => {
            allImages.push(imagesID);
          });
        }
      });
      this.images = await fromOfflineDB
        .getAllObjectsFromArray(allImages, 'Images', 'images')
        .catch(err => console.error(err));
    },

    /**
     * Routes to the PositionForm of the image
     * @param {ProxyObject} image 
     */
    editImage(image) {
      this.$generalStore.setCurrentObject(image.positionID, 'position');
      this.$router.push({ name: 'PositionCreation', params: { positionID: image.positionID } });
    },

    /**
     * Removes an image from IndexedDB and the connected object
     * @param {ProxyObject} image 
     */
    async deleteImage(image) {

      var curPlaceID = this.$generalStore.getCurrentObject('place')
      var curPlace = await fromOfflineDB
        .getObject(curPlaceID, 'Places', 'places')
        .catch(err => console.error(err));
      var rawImage = toRaw(image);
      var curPos = await fromOfflineDB
        .getObject(rawImage.positionID, 'Positions', 'positions')
        .catch(err => console.error(err));
      
     
      
      // Delete position only if the image is the only one in this position
      if (curPos.images.length == 1) {
        
        // Remove the posID from place
        var index = curPlace.positions.indexOf(rawImage.positionID.toString());
        if (index != -1) {
          curPlace.positions.splice(index, 1);
          curPlace.lastChanged = Date.now();
          await fromOfflineDB.updateObject(curPlace, 'Places', 'places')
            .catch(err => console.error(err));
        }

        // delete position
        await fromOfflineDB.deleteObject(curPos, 'Positions', 'positions')
          .catch(err => console.error(err));

      } else {
        //just remove the image id fromt he position
        var index = curPos.images.indexOf(rawImage._id);
        if (index != -1) {
          curPos.images.splice(index, 1);
        }
      }

      // Delete the image itself
      await fromOfflineDB.deleteObject(rawImage, 'Images', 'images')
        .catch(err => console.error(err));

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