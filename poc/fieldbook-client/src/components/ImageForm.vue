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
  <!-- TODO: fix virtual scroller -->
  <!-- <v-virtual-scroll  :max-height="windowHeight - 300">
    <template v-slot:default="{ item }" > -->
      <v-row no-gutters class="align-center">
        <v-col xl="3" md="4" sm="6" v-for="item in images" :key="item">
          <v-card class="pa-2 ma-2">
            <v-card-title> Nr. {{ item.imageNumber }} </v-card-title>
            <v-card-subtitle> {{ item.title }} </v-card-subtitle>
            
              <v-img 
              style="cursor: pointer;" 
              class="my-2" 
              height="150" 
              :src=item.image
              v-on:click="openImage(item)">
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
<!--     </template>
  </v-virtual-scroll> -->

  <AddButton v-on:click="create_dialog = true" />

  <!-- IMAGE CREATION DIALOG -->
  <v-dialog v-model="create_dialog" max-width="800" persistent>
    <v-card>
      <v-card-title>
        {{ $t('add', { msg: $t('image') }) }}
      </v-card-title>
      <v-card-text>

        <v-row v-if='object.placeNumber > 0'>
          <v-card-title>
            {{ $t('place') }}
          </v-card-title>
        
          <v-text-field 
            disabled 
            :label="$t('number')"
            v-model="object.placeNumber">
          </v-text-field>
        </v-row>

        <v-row no-gutters v-if="object.positionNumber > 0">
          <v-col cols="2">
            <v-card-title>
              {{ $t('position') }}
            </v-card-title>
          </v-col>

          <v-col cols="5">
            <v-text-field 
              disabled 
              :label="$t('number')"
              class="pr-2"
              v-model="object.positionNumber">
            </v-text-field>
          </v-col>

          <v-col cols="5">
            <v-text-field 
              disabled 
              v-model="object.subNumber" 
              :label="$t('subNumber')">
            </v-text-field>
          </v-col>
        </v-row>

        <v-text-field 
          v-model="image.title" 
          :label="$t('title')" 
          :hint="$t('please_input', 
          {msg: $t('title_of', { msg: $t('image') })})">
        </v-text-field>

        <v-file-input 
          counter
          multiple
          show-size 
          v-model="image.image" 
          prepend-icon="mdi-camera"
          accept="image/png, image/jpeg, image/bmp">
        </v-file-input>
      </v-card-text>

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
      <v-card class="pa-2">
        <v-card-title>
          {{ $t('edit', { msg: $t('image') }) }}
        </v-card-title>

          <v-row v-if='object.placeNumber > 0'>
            <v-col cols="2">
              <v-card-title>
                {{ $tc('place', 2) }}
              </v-card-title>
            </v-col>

            <v-col cols="10">

              <v-text-field 
                disabled 
                :label="$t('number')"
                v-model="object.placeNumber">
              </v-text-field>
            </v-col>
          </v-row>

          <v-row v-if="object.positionNumber > 0">
            <v-col cols="2">
              <v-card-title>
                Position
              </v-card-title>
            </v-col>

            <v-col cols="5">
              <v-text-field 
                disabled 
                :label="$t('number')"
                class="pr-2"
                v-model="object.positionNumber">
              </v-text-field>
            </v-col>

            <v-col cols="5">
              <v-text-field 
                disabled 
                v-model="object.subNumber" 
                :label="$t('subNumber')">
              </v-text-field>
            </v-col>
          </v-row>

          <v-row no-gutters>
            <v-col cols="2">
              <v-card-title>
                {{ $t('image') }}
              </v-card-title>
            </v-col>

            <v-col cols="3">
              <v-text-field 
                disabled
                class="pr-2"
                :label="$tc('number', 1)"
                v-model="image.imageNumber">
              </v-text-field>
            </v-col>
            <v-col cols="7">
              <v-text-field 
                v-model="image.title" 
                :label="$tc('title', 1)" 
                :hint="$t('please_input',
                  { msg: $t('title_of', { msg: $t('image') }) })">
              </v-text-field>
            </v-col>
          </v-row>
          
          <v-row>
            <v-file-input 
              counter
              show-size 
              v-model="temp_editing_img" 
              prepend-icon="mdi-camera"
              accept="image/png, image/jpeg, image/bmp">
            </v-file-input>
          </v-row>

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
  <v-dialog v-model="img_carousel_dialog" max-width="800px">
    <div id="imgContainer">
      <img id="realImg" style="cursor: zoom-in" :src="openedImage" alt="">
    </div>
  </v-dialog>
</template>

<script>
import AddButton from '../components/AddButton.vue';
import VueCookies from 'vue-cookies';
import { fromOfflineDB } from '../ConnectionToOfflineDB.js';
import { useWindowSize } from 'vue-window-size';
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
  emits: ['addImage'],
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
      temp_editing_img: [],
      openedImage: '',
      backup_image: '',
      hovering: false,
      create_dialog: false,
      edit_dialog: false,
      img_carousel_dialog: false,
      is_required: [v => !!v || 'Pflichtfeld'],
    }
  },
  setup() {
    const { width, height } = useWindowSize();
    return {
      windowWidth: width,
      windowHeight: height,
    };
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
     * Saves an edited image to IndexedDB
     */
    async saveImage() {
      var rawImage = toRaw(this.image);
      if (this.temp_editing_img.length == 0) {
        rawImage.image = this.backup_image;
      } else {
        rawImage.image = await this.textureToBase64(this.temp_editing_img);
      }
      await fromOfflineDB.updateObject(rawImage, 'Images', 'images');
      await this.updateImages();

      this.clearImgProxy();
      this.edit_dialog = false;
    },

    /**
     * Automatically adds all selected imageFiles to IndexedDB 
     * for the current Place/Position 
     */
    async addMultipleImages() {
      var rawImageArray = toRaw(this.image);

      for (var i=0; i<rawImageArray.image.length; i++) {
       await this.addImage(rawImageArray.image[i]);
      }

      await this.updateImages();
    },

    /**
     * Adds a new image-placeholder to the images-array
     */
    async addImage(imageFile) {
      // get all data for the new image
      var newImage = await this.fillNewImgData(imageFile);

      // add imageID to the object array of all images
      var rawObject = toRaw(this.object);

      // update lastChanged date of object
      rawObject.images.push(newImage.id);
      rawObject.lastChanged = Date.now();

      // hide image creation dialog
      this.create_dialog = false;

      this.clearImgProxy();
      console.log(newImage)
      // update IndexedDB
      await fromOfflineDB.updateObject(rawObject, this.object_type, this.object_type.toLowerCase());
      await fromOfflineDB.addObject(newImage, "Images", "images");
      await fromOfflineDB.addObject({ id: newImage.id, object: 'images' }, 'Changes', 'created');
      
    },

    /**
     * Collects all relevant data for the new Image
     * @param {*} imageFile 
     */
    async fillNewImgData(imageFile) {
      var newImageID = String(Date.now());
      var rawImage = toRaw(this.image);
      // new image data
      var filledImg = {
        id: newImageID,
        imageNumber: null,
        title: rawImage.title,
        image: await this.textureToBase64([imageFile]),
        lastChanged: Date.now(),
        lastSync: ''
      };

      // set the image parentID
      if (this.object_type == "Positions") {
        filledImg.positionID = this.object_id;
      } else {
        filledImg.placeID = this.object_id;
      }

      // set new imageNumber
      if (this.images.length == 0) {
        filledImg.imageNumber = 1;
      } else {
        this.updateImages();
        const imageNumber = Math.max(...this.images.map(o => o.imageNumber));
        const newImageNumber = imageNumber + 1;
        filledImg.imageNumber = newImageNumber;
      }

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
     * Removes an image from IndexedDB and the connected object
     * @param {ProxyObject} image 
     */
    async deleteImage(image) {

      var rawImage = toRaw(image);
      var rawObject = toRaw(this.object);
      var index = rawObject.images.indexOf(rawImage.id.toString());

      // Remove the imageID from connected object
      if (index != -1) {
        rawObject.images.splice(index, 1);
        rawObject.lastChanged = Date.now();
        await fromOfflineDB.updateObject(
              rawObject, this.object_type, this.object_type.toLowerCase());
      }

      // Delete the image itself
      await fromOfflineDB.deleteObject(image, 'Images', 'images');
      VueCookies.remove('currentImage');

      await this.updateImages();
    },
    /**
     * Opens an image in a dedicated dialog
     * @param {ImageObject} image 
     */
    async openImage(image) {
      this.img_carousel_dialog = true;
      this.openedImage = image.image;

      const imgContainer = await this.waitForElm('imgContainer');
      const img = await this.waitForElm('realImg');
      
      // zoom in/out on click and change the mouse cursor
      imgContainer.addEventListener("click", (e) => {
        if (img.style.cursor == "zoom-in") {
          img.style.cursor = "zoom-out";
        } else {
          img.style.cursor = "zoom-in";
        }

        if(img.style.transform == "scale(2)") {
          img.style.transform = "scale(1)";
        } else {
          img.style.transform = "scale(2)";
        }
      });

      // change img position according to mouse
      imgContainer.addEventListener("mousemove", (e) => {
        const x = e.x - 550; //TODO: find perfect offsets
        const y = e.y  //+ (img.height/2)// maybe with e.target.offset*LEFT/TOP*
        img.style.transformOrigin = `${x}px ${y}px`;
      });

      // zoom out when mouse leaves img bounds
      /* imgContainer.addEventListener("mouseleave", (e) => {
        img.style.transform = ' translate(-50%, -50%) scale(1)'
        img.style.cursor = "zoom-in";
        img.style.transformOrigin = 'center';
        img.style.transform = "scale(1)";
      }); */
    },
    /**
     * Clears relevant image VueProxy data for future image creation/editing
     */
    clearImgProxy() {
      this.image.id = '';
      this.image.positionID = '';
      this.image.placeID = '';
      this.image.title = '';
      this.image.image = [];
      this.temp_editing_img = [];
    },
    /**
     * 
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

#imgContainer {
  align-items: center;
  justify-content: center;
  margin: auto;
  box-shadow: 3px 3px 4px rgba(0,0,0,0.3);
  overflow: hidden;
}

img {
  transform-origin: center;
  object-fit: cover;
  height: 100%;
  width: 100%;
}
</style>