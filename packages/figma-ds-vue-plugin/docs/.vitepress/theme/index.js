import './tailwind.pcss'
import '@/assets/style/index.css'
import './theme.pcss'
import ComponentWrapper from "components/markdownPage/ComponentWrapper.vue";
import Components from "components/misc/Components.vue";
import DefaultTheme from 'vitepress/theme';
import {
    Button,
    Checkbox,
    Disclosure,
    DisclosureItem,
    Divider,
    Icon,
    IconButton,
    Input,
    Label,
    NumInput,
    Radio,
    Select,
    Toggle,
    Textarea,
    Txt,
    Title,
    Tooltip,
} from '@/components'

export default {
    extends: DefaultTheme,
    enhanceApp({ app }) {
        app.component('Button',Button);
        app.component('Checkbox',Checkbox);
        app.component('Disclosure',Disclosure);
        app.component('DisclosureItem',DisclosureItem);
        app.component('Divider',Divider);
        app.component('Icon',Icon);
        app.component('IconButton',IconButton);
        app.component('Input',Input);
        app.component('Label',Label);
        app.component('NumInput',NumInput);
        app.component('Radio',Radio);
        app.component('Select',Select);
        app.component('Toggle',Toggle);
        app.component('Textarea',Textarea);
        app.component('Txt',Txt);
        app.component('Title',Title);
        app.component('Tooltip',Tooltip);

        app.component('Components', Components)
        app.component('ComponentWrapper', ComponentWrapper)
    }
}
