<template>
    <!--TODO: Add Fields for the PositionsOverview-->

    <div id="wrapper">
        <Navigation/>
        <v-form>
            <v-list>
                <v-divider></v-divider>
                <v-subheader v-if="positions.length === 0 && loading === false"> Bisher wurde keine Positionen
                    angelegt</v-subheader>
                <template v-for="(position, i) in positions">
                    <v-list-item class="positionItem mt-3">
                        <v-list-item-content>
                            <v-list-item-title class="text-h6"> Nr. {{position.position_id }} - {{ position.date }}</v-list-item-title>
                            <v-list-item-subtitle class="text-subtitle-1">{{ position.description }} </v-list-item-subtitle>
                        </v-list-item-content>
                        <v-btn color="primary" ><v-icon color="white" v-on:click="modifyPosition(position.id)">mdi-pencil</v-icon></v-btn>
                    </v-list-item>
                    <v-divider v-if="i !== positions.length - 1"></v-divider>
                </template>
            </v-list>
            <v-btn v-on:click="modifyPosition(positions.id)" class="mr-16 mt-3" color="primary"> Position hinzufügen </v-btn>
        </v-form>
    </div>
</template>

<script>
import Navigation from './Navigation.vue'
import VueCookies from 'vue-cookies'

export default {
    name: 'PositionsOverview',
    components: {
        Navigation
    },
    methods: {
        //retrieve all positions
        getPositions() {
            var context = this;

            // Hier Datenbankzugriff auf Positionen implementieren. Daten aus der IndexDB in das Array Positions laden

            //Dummy-Data
            var item = {
                id: "ahsgfuhgaweufgawfu87auzgfu",
                position_id : 1234,
                date: new Date('1999-04-25').toLocaleDateString("de-DE"),
                description: "Gordon Ramsey ist der geilste TV-Koch den es auf der Welt gibt. Change my mind!",
            }
            this.positions.push(item)

        },
        modifyPosition(item_id) {
            if (item_id !== 'new') {
                VueCookies.set('current_position', item_id)
            }
            this.$router.push({ name: 'PositionCreation', params: { position_id: item_id } })
        }
    },
    created() {
        this.getPositions();
    },
    data() {
        return {
            positions: [],
            loading: true
        };
    }
}
</script>

<style scoped>
#wrapper {
    height: 100%;
}

.positionItem{
    border-top: 2px solid black;
    border-bottom: 2px solid black;
    background-color: rgb(221, 221, 221);
}
</style>