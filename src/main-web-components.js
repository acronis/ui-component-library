
import { defineCustomElement } from 'vue';
import Alert from '../packages/alert/src/Alert.ce.vue';
import Icon from '../packages/icon/src/Icon.ce.vue';

import '../themes/acronis/src/index.scss';

customElements.define('el-alert', defineCustomElement(Alert));
customElements.define('el-icon', defineCustomElement(Icon));
