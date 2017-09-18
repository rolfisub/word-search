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
            }
        },
        data: function(){
            return {
                
            };
        },
        template: '<div class="ws-board container">'
                    + '<div class="row" v-for="cellRow in game.cells">'
                        + '<cell '
                        + 'v-for="cell in cellRow" ' 
                        + 'v-bind:game="game" ' 
                        + 'v-bind:cell="cell" :key="cell.id"></cell>'
                    + '</div>'
                + '</div>'
    }
);