<template>
    <div id="wrapper">
        <Navigation/>
        <div class="ma-10" v-if="loading === true">
            <v-progress-circular d-flex color="primary" :active="loading" :indeterminate="loading" :size="86" :width="8">
            </v-progress-circular>
        </div>
        <v-form>
            <v-list>
                <v-list-item class="mt-5" v-if="current_section.id !== undefined"
                    v-on:click="modifySection(current_section.id)">
                    <v-chip>
                        Derzeit ausgewählt
                    </v-chip>
                    <v-list-item-content>
                        <v-list-item-title> {{ current_section.title }} </v-list-item-title>
                        <v-list-item-subtitle> {{ current_section.description }} </v-list-item-subtitle>
                    </v-list-item-content>
                    <v-chip variant="elevated">
                        Derzeit ausgewählt
                    </v-chip>
                </v-list-item>
                <v-divider></v-divider>
                <v-subheader v-if="sections.length === 0 && current_section.id == undefined && loading === false"> Bisher
                    wurden dem Projekt keine Schnitte
                    hinzugefügt</v-subheader>
                <template v-for="(section, i) in sections">
                    <v-list-item v-on:click="modifySection(section.id)">
                        <v-list-item-content>
                            <v-list-item-title> {{ section.title }} </v-list-item-title>
                            <v-list-item-subtitle> {{ section.description }} </v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                    <v-divider></v-divider>
                </template>
            </v-list>
            <v-btn v-on:click="modifySection('new')" color="secondary"> Schnitt hinzufügen</v-btn>
        </v-form>
    </div>
</template>

<script>
import Navigation from './Navigation.vue'
import axios from 'axios';
import VueCookies from 'vue-cookies';


export default {
    name: 'SectionsOverview',
    components: {
        Navigation
    },
    created() {
        var context = this;
        context.project_id = VueCookies.get('currentProject');
        context.excavation_id = VueCookies.get('currentExcavation');
    },
    methods: {
        getSections() {
            var context = this;

            axios({
                method: 'get',
                url: '/sections/excavation_id/' + VueCookies.get('currentExcavation'),
                responseType: 'json'
            })
                .then(function (response) {
                    for (let item of response.data) {
                        //if the section id is saved in cookies => mark is as current section
                        if (VueCookies.get('currentSection') === item.id.trim()) {
                            context.current_section = item;
                        } else {
                            context.sections.push(item)
                        }
                    }
                    //hide the loading circle
                    context.loading = false;
                })
                .catch(error => {
                    if (!error.response) {
                        this.errorStatus = 'Error: Network Error';
                    } else {
                        this.errorStatus = error.response.data.message;
                    }
                    //hide the loading circle
                    context.loading = false;
                });
        },
        modifySection(item_id) {
            if (item_id !== 'new') {
                VueCookies.set('currentSection', item_id)
            }
            this.$router.push({ name: 'SectionCreation', params: { section_id: item_id } })
        }
    },
    beforeMount() {
        this.getSections()
    },
    data: function () {
        return {
            sections: [],
            current_section: {},
            new_section: false,
            project_id: '',
            excavation_id: '',
            loading: true
        }
    }
}

</script>

<style scoped>
#wrapper {
    height: 100%;
}
</style>
