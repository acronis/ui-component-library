<template>
  <el-button @click="dialogWithoutFooterVisible = true">
    Without Footer
  </el-button>
  <el-dialog
    v-model:visible="dialogWithoutFooterVisible"
    width-size="medium"
    height-size="fixed-medium"
    title="Lorem ipsum dolor sit amet, consectetur adipisicing elit and do it. Autem commodi deleniti dolorem dolorum eligendi"
  >
    <div class="px-24 py-16">
      <div class="mb-8">
        <div class="el-text el-text--size-m">
          Cannot delete Cloud storage
        </div>
      </div>
      <div>
        <div class="el-text el-text--size-xs">
          Disable the backup service for these customers and try again. The following customers are using it: Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae dolore, doloremque eaque esse ex hic magnam qui? Ab aperiam atque debitis eos et iusto quidem veniam? Accusantium at corporis deserunt dignissimos expedita id illo libero, magnam perferendis, perspiciatis quae quo, veritatis voluptatem. Adipisci consectetur cumque doloremque ducimus enim hic iste modi molestiae odit officia quasi, quisquam quos recusandae rem repellat. A cupiditate dolor dolore doloribus dolorum, eaque eveniet facilis inventore ipsam, itaque laborum laudantium magnam obcaecati optio placeat porro possimus quam quibusdam quisquam reiciendis repellat reprehenderit suscipit tempore temporibus vel veritatis voluptas. Blanditiis cum deserunt dolorem eos et ex hic laudantium natus necessitatibus, obcaecati perferendis praesentium quas qui quidem quis quo rem repellat, sapiente suscipit veniam. Accusantium amet, architecto asperiores corporis dolor facilis illo impedit minima mollitia natus nisi obcaecati odit optio perferendis praesentium provident qui quidem quod rerum, sapiente tempora ut vitae? Aperiam esse exercitationem libero magnam mollitia nulla numquam quos tempora unde voluptate! Delectus eos expedita minus molestiae omnis recusandae sapiente! Debitis hic nulla officiis porro velit! Error esse et expedita explicabo labore laudantium minus molestias, nihil provident quae repellendus reprehenderit repudiandae sapiente sit sunt suscipit unde, vitae! Aliquam commodi consectetur deleniti dolore ducimus ea ipsum iusto odit officia provident quam quia ratione, repellat repudiandae velit! Eum fugiat laboriosam soluta tempore? Aliquid, culpa dignissimos ducimus libero perferendis tempora vel. Fuga non quo reprehenderit. Asperiores beatae deserunt dicta id illum iste laudantium libero, maiores, mollitia nesciunt, numquam odio porro praesentium quas repellat. Dignissimos eos eum odit quas quod tenetur voluptatem. Architecto beatae delectus explicabo harum ipsam odio placeat quibusdam reiciendis rerum, sequi ut vel velit vitae? Dolor ex numquam odit rerum tenetur. Accusantium beatae deleniti deserunt distinctio eius error et fuga illo illum ipsam ipsum labore maiores, minima nisi obcaecati provident quibusdam repellat tempora tempore vel. A ad aliquid aperiam aut consectetur cum doloremque dolorum ducimus earum eos exercitationem expedita facilis ipsam itaque laboriosam laudantium molestiae nam natus nemo nesciunt nostrum odit officiis omnis pariatur perferendis placeat quaerat quasi, qui ratione recusandae reiciendis repellendus soluta temporibus, ullam ut velit veritatis? Consequuntur, cum cupiditate distinctio dolores error ex fuga, laborum neque nihil quae, quaerat qui velit voluptate. Architecto, dolorem earum eum exercitationem facilis fuga hic iure, magni placeat possimus quaerat quibusdam saepe soluta sunt vitae? Accusantium ad asperiores blanditiis, ducimus error in ipsum iusto, magnam nihil officia quis quisquam, ullam voluptate. Aperiam, blanditiis consequuntur debitis, deleniti ducimus eaque expedita fugit ipsa magni molestiae non praesentium quis quisquam quo suscipit ut veritatis! Accusamus commodi, distinctio ducimus impedit nesciunt obcaecati quasi rerum. Ad quasi quod repellat totam voluptatibus! Asperiores atque autem blanditiis consequuntur culpa distinctio doloremque ea eum ex facere fuga id in incidunt iure laborum libero maxime natus neque, nulla porro provident rem tempore, ullam? A architecto commodi dicta dolores facilis, maxime nulla odio pariatur placeat possimus quibusdam velit veniam voluptatem. Aspernatur esse eum maiores nam perspiciatis quos veritatis! Accusamus aspernatur assumenda at autem consectetur corporis deserunt dolorem ea eaque, esse fuga fugiat fugit ipsa itaque iusto maxime modi molestiae nihil praesentium quam quas quidem repellendus reprehenderit sequi similique suscipit unde? Ad aliquid blanditiis consectetur eius esse excepturi hic ipsam ipsum, molestiae numquam perspiciatis provident? Ab atque consequuntur dicta doloremque dolores esse ex fugiat hic in ipsum maxime nam nihil odio pariatur quas quasi quia quidem quisquam quos ratione saepe similique sunt, tempore temporibus velit veniam voluptate? Aliquam assumenda blanditiis, culpa, est harum itaque molestias necessitatibus odit placeat, quo recusandae rem repellendus sequi veritatis voluptas? Aliquam beatae, dolor ducimus impedit ipsa magni ut?
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import ElButton from 'packages/button';
import ElDialog from 'packages/dialog';
import { ref } from 'vue';

const dialogWithoutFooterVisible = ref(false);
</script>
