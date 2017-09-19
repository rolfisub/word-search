/**
 * @author Rolf
 */

Vue.component(
    'board',
    {
        props: {
            game:{
                type: Object,
                required: true
            },
            api: {
                required: true
            }    
        },
        data: function(){
            return {
                
            };
        },
        template: '<div class="container ws-board">'
                    + '<div class="row" v-for="cellRow in game.cells">'
                        + '<cell '
                            + 'v-for="cell in cellRow" ' 
                            + 'v-bind:game="game" '
                            + 'v-bind:api="api" '
                            + 'v-bind:cell="cell" :key="cell.id"></cell>'
                    + '</div>'
                + '</div>'
    }
);