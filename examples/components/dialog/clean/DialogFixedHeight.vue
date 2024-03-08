<template>
  <div class="demo-dialog">
    <el-button @click="showDialog = true">Wrap Content</el-button>
    <el-dialog
      variant="clean"
      width-size="small"
      height-size="fixed-medium"
      v-model:visible="showDialog">
      <div class="clean-content-wrapper">
          <div class="image-skeleton">
          </div>
          <div class="max-width-384px">
            <div class="mt-24 mb-8 el-text--display-medium">
              The headline is better to fix the width of 384 pixels
            </div>
            <div class="mb-24 el-text--body-24">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae dolore, doloremque eaque esse ex hic magnam qui? Ab aperiam atque debitis eos et iusto quidem veniam? Accusantium at corporis deserunt dignissimos expedita id illo libero, magnam perferendis, perspiciatis quae quo, veritatis voluptatem. Adipisci consectetur cumque doloremque ducimus enim hic iste modi molestiae odit officia quasi, quisquam quos recusandae rem repellat. A cupiditate dolor dolore doloribus dolorum, eaque eveniet facilis inventore ipsam, itaque laborum laudantium magnam obcaecati optio placeat porro possimus quam quibusdam quisquam reiciendis repellat reprehenderit suscipit tempore temporibus vel veritatis voluptas. Blanditiis cum deserunt dolorem eos et ex hic laudantium natus necessitatibus, obcaecati perferendis praesentium quas qui quidem quis quo rem repellat, sapiente suscipit veniam. Accusantium amet, architecto asperiores corporis dolor facilis illo impedit minima mollitia natus nisi obcaecati odit optio perferendis praesentium provident qui quidem quod rerum, sapiente tempora ut vitae? Aperiam esse exercitationem libero magnam mollitia nulla numquam quos tempora unde voluptate! Delectus eos expedita minus molestiae omnis recusandae sapiente! Debitis hic nulla officiis porro velit! Error esse et expedita explicabo labore laudantium minus molestias, nihil provident quae repellendus reprehenderit repudiandae sapiente sit sunt suscipit unde, vitae! Aliquam commodi consectetur deleniti dolore ducimus ea ipsum iusto odit officia provident quam quia ratione, repellat repudiandae velit! Eum fugiat laboriosam soluta tempore? Aliquid, culpa dignissimos ducimus libero perferendis tempora vel. Fuga non quo reprehenderit. Asperiores beatae deserunt dicta id illum iste laudantium libero, maiores, mollitia nesciunt, numquam odio porro praesentium quas repellat. Dignissimos eos eum odit quas quod tenetur voluptatem. Architecto beatae delectus explicabo harum ipsam odio placeat quibusdam reiciendis rerum, sequi ut vel velit vitae? Dolor ex numquam odit rerum tenetur. Accusantium beatae deleniti deserunt distinctio eius error et fuga illo illum ipsam ipsum labore maiores, minima nisi obcaecati provident quibusdam repellat tempora tempore vel. A ad aliquid aperiam aut consectetur cum doloremque dolorum ducimus earum eos exercitationem expedita facilis ipsam itaque laboriosam laudantium molestiae nam natus nemo nesciunt nostrum odit officiis omnis pariatur perferendis placeat quaerat quasi, qui ratione recusandae reiciendis repellendus soluta temporibus, ullam ut velit veritatis? Consequuntur, cum cupiditate distinctio dolores error ex fuga, laborum neque nihil quae, quaerat qui velit voluptate. Architecto, dolorem earum eum exercitationem facilis fuga hic iure, magni placeat possimus quaerat quibusdam saepe soluta sunt vitae? Accusantium ad asperiores blanditiis, ducimus error in ipsum iusto, magnam nihil officia quis quisquam, ullam voluptate. Aperiam, blanditiis consequuntur debitis, deleniti ducimus eaque expedita fugit ipsa magni molestiae non praesentium quis quisquam quo suscipit ut veritatis! Accusamus commodi, distinctio ducimus impedit nesciunt obcaecati quasi rerum. Ad quasi quod repellat totam voluptatibus! Asperiores atque autem blanditiis consequuntur culpa distinctio doloremque ea eum ex facere fuga id in incidunt iure laborum libero maxime natus neque, nulla porro provident rem tempore, ullam? A architecto commodi dicta dolores facilis, maxime nulla odio pariatur placeat possimus quibusdam velit veniam voluptatem. Aspernatur esse eum maiores nam perspiciatis quos veritatis!
            </div>
          </div>
          <el-button size="large">Button with action</el-button>
          <el-button type="ghost" class="mt-16" @click="showDialog = false">Cancel</el-button>
        </div>
    </el-dialog>
  </div>
</template>
<script setup>
import ElButton from 'packages/button';
import ElDialog from 'packages/dialog';
import { ref } from 'vue';

const showDialog = ref(false);
</script>
<style lang="scss" scoped>
  .demo-dialog {

    .el-dialog__wrapper {
      margin: 0;
    }

    .image-skeleton {
      height: 96px;
      width: 96px;
      border-radius: 8px;
      background-color: #2668c5;
      opacity: .3;
    }

    .clean-content-wrapper {
      flex: 1 1 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
    }

    $sizes: 384px, 464px, 624px;
    @each $width in $sizes {
      .max-width-#{$width} {
        max-width: $width;
      }
    }
  }
</style>
