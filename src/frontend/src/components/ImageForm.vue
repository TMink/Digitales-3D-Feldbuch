<!--
 * Created Date: 06.07.2023 13:22:10
 * Author: Julian Hardtung
 * 
 * Last Modified: 22.02.2024 14:26:45
 * Modified By: Julian Hardtung
 * 
 * Description: list and input form for images of places/positions
 -->

<template>
  <v-card v-if="images.length === 0">
    <v-list>

      <!-- IMAGES LIST -->
      <v-list-subheader >
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
              cover
              height="200" 
              class="ma-2 my-4" 
              :src="item.image"
              style="cursor: zoom-in"
              v-on:click="openImage(i)">
            </v-img>
            
            <v-row no-gutters>
              <v-spacer/>
              <v-btn 
                color="primary"
                class="mr-2"
                v-on:click="editImage(item)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              
              <v-btn 
                color="error" 
                v-on:click="deleteImage(item)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-row>
          </v-card>
        </v-col>
      </v-row>

  <AddButton v-on:click="create_dialog = true" />

  <!-- IMAGE CREATION DIALOG -->
  <v-dialog v-model="create_dialog" max-width="800" persistent>
    <v-card class="px-4 pt-2">
      <v-card-title>
        {{ $t('add', { msg: $t('image') }) }}
      </v-card-title>

      <v-row no-gutters>
        <v-col cols="3">
          <v-checkbox
            v-model="automaticNaming"
            :label="$t('autoNaming')"
            color="secondary">
          </v-checkbox>
        </v-col>
        <v-col cols="9">
          <v-text-field v-if="automaticNaming"
            :disabled="automaticNaming">
            {{ curPath }}
          </v-text-field>
          <v-text-field 
            v-if="!automaticNaming"
            v-model="image.title" 
            :label="$t('title')" 
            :hint="$t('please_input', 
              {msg: $t('title_of', { msg: $t('image') })})">
          </v-text-field>
        </v-col>
      </v-row>

      <v-file-input 
        counter
        multiple
        show-size 
        v-model="uploadImages" 
        prepend-icon="mdi-camera"
        accept="image/png, image/jpeg, image/bmp">
      </v-file-input>

      <v-card-actions class="justify-center">
        <v-btn icon color="primary" v-on:click="addMultipleImages()">
          <v-icon>mdi-content-save-all</v-icon>
        </v-btn>
        <v-btn icon color="error" @click="create_dialog = false">
          <v-icon>mdi-close-circle</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- IMAGE EDITING DIALOG -->
    <v-dialog v-model="edit_dialog" max-width="800" persistent>
      <v-card class="px-4 pt-2">
        <v-card-title>
          {{ $t('editPhrase', { msg: $t('image') }) }}
        </v-card-title>

          <v-row no-gutters>

            <v-col cols="2" class="px-1">
              <v-text-field 
                disabled
                class="pr-2"
                no-hints
                :label="$tc('number', 1)"
                v-model="image.imageNumber">
              </v-text-field>
            </v-col>
            <v-divider vertical class="mb-4"></v-divider>

            <v-col cols="2">
              <v-checkbox
                no-hints
                v-model="automaticNaming"
                label="automatic Naming">
              </v-checkbox>
            </v-col>

            <v-col cols="8">
              <v-text-field 
                no-hints
                v-if="automaticNaming"
                :disabled="automaticNaming">
                {{ curPath }}
              </v-text-field>

              <v-text-field 
                no-hints
                v-if="!automaticNaming"
                v-model="image.title" 
                :label="$t('title')" 
                :hint="$t('please_input',
                  { msg: $t('title_of', { msg: $t('image') }) })">
              </v-text-field>
            </v-col>
          </v-row>
          
          <v-file-input 
            counter
            show-size 
            v-model="temp_editing_img" 
            prepend-icon="mdi-camera"
            accept="image/png, image/jpeg, image/bmp">
          </v-file-input>

        <v-card-actions class="justify-center">
          <v-btn icon color="primary" v-on:click="saveImage()">
            <v-icon>mdi-content-save-all</v-icon>
          </v-btn>
          <v-btn icon color="error" @click="edit_dialog = false; updateImages()">
            <v-icon>mdi-close-circle</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
import AddButton from '../components/AddButton.vue';
import { fromOfflineDB } from '../ConnectionToOfflineDB.js';
import { generalDataStore } from '../ConnectionToLocalStorage.js';
import { useWindowSize } from 'vue-window-size';
import { toRaw } from 'vue';

export default {
  name: "ImageForm",
  components: {
    AddButton
  },
  emits: ['addImage'],
  /**
   * Props from PlaceForm/PositionForm
   */
  props: {
    position_prop: Object,
  },
  /**
   * Reactive Vue.js data
   */
  data() {
    return {
      position: '',
      image: {
        _id: '',
        positionID: '',
        placeID: '',
        title: '',
        image: '',
      },
      images: [],
      uploadImages: [],
      temp_editing_img: [],
      openedImage: '',
      backup_image: '',
      hovering: false,
      create_dialog: false,
      automaticNaming: true,
      curPath: '',
      edit_dialog: false,
      img_carousel_dialog: false,
    }
  },
  setup() {
    const { width, height } = useWindowSize();
    const generalStore = generalDataStore();
    
    return {
      windowWidth: width,
      windowHeight: height,
      generalStore,
    };
  },
  /**
   * Initialize data from IndexedDB to the reactive Vue.js data
   */
  async created() {
    await fromOfflineDB.syncLocalDBs()
      .catch(err => console.error(err));
    this.position = this.position_prop;
    await this.updateImages()
      .catch(err => console.error(err));

    this.curPath = await this.getAutoImgTitle()
      .catch(err => console.error(err));
  },
  methods: {
    /**
     * Update reactive Vue.js images data
     */
    async updateImages() {
        this.images = await fromOfflineDB
          .getAllObjectsWithID(this.position._id, 'Position', 'Images', 'images')
          .catch(err => console.error(err));
    },

    /**
     * Saves an edited image to IndexedDB
     */
    async saveImage() {
      var rawImage = toRaw(this.image);
      var index = this.images.indexOf(this.image);
      
      if (this.temp_editing_img.length == 0) {
        rawImage.image = this.backup_image;
      } else {
        rawImage.image = await this.textureToBase64(this.temp_editing_img)
          .catch(err => console.error(err));
      }

      // automatically name the image title
      if (this.automaticNaming) {
        var imgNumber = String(rawImage.imageNumber).padStart(4, '0');
        rawImage.title = this.curPath + imgNumber;
      }

      await fromOfflineDB.updateObject(rawImage, 'Images', 'images')
        .catch(err => console.error(err));

      this.images[index] = await fromOfflineDB.getObject(rawImage._id, 'Images', 'images')
        .catch(err => console.error(err));
      this.edit_dialog = false;
    },

    /**
     * Automatically adds all selected imageFiles to IndexedDB 
     * for the current Place/Position 
     */
    async addMultipleImages() {
      var rawImageArray = toRaw(this.uploadImages);
      var curImages = [];
      const initImageNumbers = this.images.length;

      for (var i=0; i<rawImageArray.length; i++) {

        var imageNumber = initImageNumbers + 1 + i;
        var addedImg = await this.addImage(rawImageArray[i], imageNumber)
          .catch(err => console.error(err));
        curImages.push(addedImg);
      }
      this.images = this.images.concat(curImages);
    },

    /**
     * Adds a new image-placeholder to the images-array
     */
    async addImage(imageFile, imageNumber) {
      // get all data for the new image
      var newImage = await this.fillNewImgData(imageFile, imageNumber)
        .catch(err => console.error(err));

      // add imageID to the position array of all images
      var rawPosition = toRaw(this.position);

      // update lastChanged date of position
      rawPosition.images.push(newImage._id);
      rawPosition.lastChanged = Date.now();

      // hide image creation dialog
      this.create_dialog = false;

      // update IndexedDB
      await fromOfflineDB.updateObject(rawPosition, 'Positions', 'positions')
        .catch(err => console.error(err));
      await fromOfflineDB.addObject(newImage, "Images", "images")
        .catch(err => console.error(err));
      //await fromOfflineDB.addObject({ _id: newImage._id, object: 'images' }, 'Changes', 'created');
      return newImage;
    },

    /**
     * Collects all relevant data for the new Image
     * @param {*} imageFile 
     */
    async fillNewImgData(imageFile, imageNumber) {
      var newImageID = String(Date.now());
      var rawImage = toRaw(this.image);

      // new image data
      var filledImg = {
        _id: newImageID,
        imageNumber: imageNumber,
        title: rawImage.title,
        image: await this.textureToBase64([imageFile])
          .catch(err => console.error(err)),
        lastChanged: Date.now(),
        lastSync: 0
      };

      // automatically name the image title
      if (this.automaticNaming) {
        filledImg.title = await this.getAutoImgTitle()
          .catch(err => console.error(err));
      }

      // set the image parentID
      filledImg.positionID = this.position._id;

      return filledImg;
    },

    /**
     * Fill image VueProxy variables with image data that is to be edited and
     * open die edit dialog.
     * @param {*} item 
     */
    editImage(item) {
      this.backup_image = item.image;
      this.image = toRaw(item)

      this.edit_dialog = true;
    },

    /**
     * Clears relevant image VueProxy data for future image creation/editing
     */
    clearImgProxy() {
      this.image._id = '';
      this.image.title = '';
      this.image.image = [];
      this.temp_editing_img = [];
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

    dataURLtoFile(dataurl, filename) {
      var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[arr.length - 1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    },

    /**
     * Removes an image from IndexedDB and the connected position
     * @param {ProxyObject} image 
     */
    async deleteImage(image) {

      var rawImage = toRaw(image);
      var rawPosition = toRaw(this.position);
      var index = rawPosition.images.indexOf(rawImage._id.toString());

      // Remove the imageID from connected position
      if (index != -1) {
        rawPosition.images.splice(index, 1);
        rawPosition.lastChanged = Date.now();
        await fromOfflineDB.updateObject(rawPosition, 'Positions', 'positions')
          .catch(err => console.error(err));
      }

      // Delete the image itself
      await fromOfflineDB.deleteObject(image, 'Images', 'images')
        .catch(err => console.error(err));

      this.images.splice(index, 1);
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

    /**
     * Creates and returns the title beginning of an image for 
     * the current `position`.
     * 
     * To create a full image title the `imageNumber` has to be 
     * appended to this return `String`.
     * @returns {String} image title 
     */
    async getAutoImgTitle() {
      const curActivityID = this.generalStore.getCurrentObject('activity');
      const curActivity = await fromOfflineDB
        .getObject(curActivityID, 'Activities', 'activities')
        .catch(err => console.error(err));

      const curPlaceID = this.generalStore.getCurrentObject('place');
      const curPlace = await fromOfflineDB
        .getObject(curPlaceID, 'Places', 'places')
        .catch(err => console.error(err));
      const placeNumber = curPlace.placeNumber.toString().padStart(4, '0');

      const posNumber = this.position.positionNumber.toString().padStart(4, '0');

      var autoTitle = curActivity.activityNumber
        + '_' + placeNumber
        + '_' + posNumber;


      return autoTitle;
    },

    /**
     * Waits until the HTML element exists
     * @param {String} selector 
     */
    waitForElm(selector) {
      return new Promise(resolve => {
        // if it already exists, return it
        if (document.getElementById(selector)) {
          return resolve(document.getElementById(selector));
        }

        // otherwise create a MutationObserver and wait for it
        const observer = new MutationObserver(mutations => {
          if (document.getElementById(selector)) {
            resolve(document.getElementById(selector));
            observer.disconnect();
          }
        });

        observer.observe(document.body, {
          childList: true,
          subtree: true
        });
      });
    }
  }
}
</script>

<style scoped>
</style>