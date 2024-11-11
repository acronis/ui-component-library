# Examples for {{ $params.pkg }} component

- package name: {{ $params.pkg }}

<div v-for="demo in $params.demos">

- <a :href="`${$params.pkg}-${demo}`">{{demo}}</a>

</div>

<!-- @content -->
