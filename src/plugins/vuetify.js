import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
            light: {
              primary: '#D984A3',
              //secondary: '#F2C9E0',
              secondary: '#D9486E',
            },
        }
    }
});
