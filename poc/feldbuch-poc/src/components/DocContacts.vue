<template>
    <div id="wrapper">

        <v-form>
            <v-subheader v-if="contacts.length === 0"> Bisher wurde kein Kontakt angelegt</v-subheader>
            <v-list>
                <template v-for="(contact, i) in contacts">
                    <v-list-item v-on:click="modifyContact(contact.id)">
                        <v-list-item-content>
                            <v-list-item-title> {{ contact.firstname  + " " + contact.surname }} </v-list-item-title>
                            <v-list-item-subtitle> {{ contact.role }} </v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                    <v-divider v-if="i !== contacts.length - 1"></v-divider>
                </template>
            </v-list>
            <v-btn v-on:click="modifyContact('new')" color="primary"> Neuer Kontakt  </v-btn>
        </v-form>
    </div>
</template>

<script>
import axios from 'axios'
import VueCookies from 'vue-cookies'

export default {
    name: 'ContactsOverview',
    methods: {
        //retrieve all contacts
        getContacts() {
            var context = this;

            axios({
                method: 'get',
                url: '/contacts',
                responseType: 'json'
            })
                .then(function (response) {
                    for (let item of response.data) {
                        context.contacts.push(item);
                    }
                })
                .catch(error => {
                    if (!error.response) {
                        this.errorStatus = 'Error: Network Error';
                    } else {
                        this.errorStatus = error.response.data.message;
                    }
                });
        },
        modifyContact(item_id) {
            if (item_id !== 'new') {
                VueCookies.set('currentContact', item_id)
            }
            this.$router.push({ name: 'ContactCreation', params: { contact_id: item_id } })
        }
    },
    created() {
        this.getContacts();
    },
    data() {
        return {
            contacts: []
        };
    }
}
</script>

<style scoped>
#wrapper {
    height: 100%;
}
</style>
