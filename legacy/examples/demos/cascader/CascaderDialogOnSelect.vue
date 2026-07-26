<script setup>
  import AcvButton from '@/components/button/button.vue';

  import AcvCascader from '@/components/cascader/cascader.vue';
  import AcvDialog from '@/components/dialog/dialog.vue';
  import { ref } from 'vue';
  import options from '../../__mocks__/data.mock.cascader.options.json';

  const valueTwo = ref('');
  const dialogBasicVisible = ref(false);

  function handleChange(value) {
    console.log('Change event fired');
    console.log(value);
  }

  function showDialog() {
    dialogBasicVisible.value = true;
  }
</script>

<template>
  <AcvCascader
    v-model="valueTwo"
    :options="options"
    @change="handleChange"
    @select="showDialog"
  />
  <AcvDialog
    v-model:visible="dialogBasicVisible"
    width-size="medium"
    height-size="fixed-medium"
    title="Lorem ipsum dolor sit amet, consectetur adipisicing elit and do it. Autem commodi deleniti dolorem dolorum eligendi"
  >
    <div class="px-24 py-16">
      <div class="mb-8">
        <div class="acv-text acv-text--size-m">
          Cannot delete Cloud storage
        </div>
      </div>
      <div>
        <div class="acv-text acv-text--size-xs">
          Disable the backup service for these customers and try again. The following customers are using it: Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae dolore, doloremque eaque esse ex hic magnam qui? Ab aperiam atque debitis eos et iusto quidem veniam? Accusantium at corporis deserunt dignissimos expedita id illo libero, magnam perferendis, perspiciatis quae quo, veritatis voluptatem. Adipisci consectetur cumque doloremque ducimus enim hic iste modi molestiae odit officia quasi, quisquam quos recusandae rem repellat. A cupiditate dolor dolore doloribus dolorum, eaque eveniet facilis inventore ipsam, itaque laborum laudantium magnam obcaecati optio placeat porro possimus quam quibusdam quisquam reiciendis repellat reprehenderit suscipit tempore temporibus vel veritatis voluptas. Blanditiis cum deserunt dolorem eos et ex hic laudantium natus necessitatibus, obcaecati perferendis praesentium quas qui quidem quis quo rem repellat, sapiente suscipit veniam. Accusantium amet, architecto asperiores corporis dolor facilis illo impedit minima mollitia natus nisi obcaecati odit optio perferendis praesentium provident qui quidem quod rerum, sapiente tempora ut vitae? Aperiam esse exercitationem libero magnam mollitia nulla numquam quos tempora unde voluptate! Delectus eos expedita minus molestiae omnis recusandae sapiente! Debitis hic nulla officiis porro velit! Error esse et expedita explicabo labore laudantium minus molestias, nihil provident quae repellendus reprehenderit repudiandae sapiente sit sunt suscipit unde, vitae! Aliquam commodi consectetur deleniti dolore ducimus ea ipsum iusto odit officia provident quam quia ratione, repellat repudiandae velit! Eum fugiat laboriosam soluta tempore? Aliquid, culpa dignissimos ducimus libero perferendis tempora vel. Fuga non quo reprehenderit. Asperiores beatae deserunt dicta id illum iste laudantium libero, maiores, mollitia nesciunt, numquam odio porro praesentium quas repellat. Dignissimos eos eum odit quas quod tenetur voluptatem. Architecto beatae delectus explicabo harum ipsam odio placeat quibusdam reiciendis rerum, sequi ut vel velit vitae? Dolor ex numquam odit rerum tenetur. Accusantium beatae deleniti deserunt distinctio eius error et fuga illo illum ipsam ipsum labore maiores, minima nisi obcaecati provident quibusdam repellat tempora tempore vel. A ad aliquid aperiam aut consectetur cum doloremque dolorum ducimus earum eos exercitationem expedita facilis ipsam itaque laboriosam laudantium molestiae nam natus nemo nesciunt nostrum odit officiis omnis pariatur perferendis placeat quaerat quasi, qui ratione recusandae reiciendis repellendus soluta temporibus, ullam ut velit veritatis? Consequuntur, cum cupiditate distinctio dolores error ex fuga, laborum neque nihil quae, quaerat qui velit voluptate. Architecto, dolorem earum eum exercitationem facilis fuga hic iure, magni placeat possimus quaerat quibusdam saepe soluta sunt vitae? Accusantium ad asperiores blanditiis, ducimus error in ipsum iusto, magnam nihil officia quis quisquam, ullam voluptate. Aperiam, blanditiis consequuntur debitis, deleniti ducimus eaque expedita fugit ipsa magni molestiae non praesentium quis quisquam quo suscipit ut veritatis! Accusamus commodi, distinctio ducimus impedit nesciunt obcaecati quasi rerum. Ad quasi quod repellat totam voluptatibus! Asperiores atque autem blanditiis consequuntur culpa distinctio doloremque ea eum ex facere fuga id in incidunt iure laborum libero maxime natus neque, nulla porro provident rem tempore, ullam? A architecto commodi dicta dolores facilis, maxime nulla odio pariatur placeat possimus quibusdam velit veniam voluptatem. Aspernatur esse eum maiores nam perspiciatis quos veritatis! Accusamus aspernatur assumenda at autem consectetur corporis deserunt dolorem ea eaque, esse fuga fugiat fugit ipsa itaque iusto maxime modi molestiae nihil praesentium quam quas quidem repellendus reprehenderit sequi similique suscipit unde? Ad aliquid blanditiis consectetur eius esse excepturi hic ipsam ipsum, molestiae numquam perspiciatis provident? Ab atque consequuntur dicta doloremque dolores esse ex fugiat hic in ipsum maxime nam nihil odio pariatur quas quasi quia quidem quisquam quos ratione saepe similique sunt, tempore temporibus velit veniam voluptate? Aliquam assumenda blanditiis, culpa, est harum itaque molestias necessitatibus odit placeat, quo recusandae rem repellendus sequi veritatis voluptas? Aliquam beatae, dolor ducimus impedit ipsa magni ut? Aperiam dicta, dolorem, doloremque esse, expedita iusto labore odit omnis quae sapiente temporibus vero. Ad assumenda autem culpa dolor doloremque esse expedita facere hic inventore, laboriosam maiores maxime natus nobis odit, omnis perferendis perspiciatis praesentium reiciendis reprehenderit tenetur ullam vel voluptatibus! Consectetur dolor ipsum quo quos. Consequuntur dolores iure minima optio reprehenderit temporibus vitae! Aspernatur cum est et itaque quis quo reiciendis. Consequatur consequuntur dicta doloribus eos eum fugiat hic, impedit modi, neque nisi omnis possimus reprehenderit sed totam unde. Aliquam animi delectus dignissimos, ducimus eaque eligendi facere hic ipsum, iste magni minus mollitia nemo non placeat quam, quidem quisquam recusandae sint tempora ullam velit voluptate voluptates? Asperiores consequatur consequuntur dolor ipsum iste neque obcaecati quasi totam. Adipisci eligendi in magnam maxime minus quia, quod repellendus sunt. Asperiores aspernatur consequuntur delectus, doloremque ex exercitationem laudantium molestias nemo, officia omnis porro quae quisquam tenetur velit veritatis voluptate voluptatem. Ad, mollitia, sapiente. Adipisci, aliquam beatae cumque debitis dicta dolorum, eaque eius ex, facere fugiat iste minus molestiae nam neque nostrum nulla quae quas recusandae sed similique sunt suscipit ullam voluptatibus. Ab assumenda commodi excepturi, laborum non praesentium rem. Accusantium aliquid beatae deserunt eos expedita facilis ipsum nisi optio possimus provident rerum temporibus veritatis, vitae voluptas voluptate? A, ad, adipisci aliquam aperiam aspernatur, consectetur cum cumque delectus distinctio dolores doloribus dolorum esse et facere harum iste iusto laboriosam magni molestiae nisi nostrum obcaecati officiis perferendis quae quas qui quos reprehenderit sapiente sequi sint totam velit vitae voluptatem! Autem, delectus, voluptate. Animi earum fugit ipsum laboriosam, minus odit optio placeat quidem totam. Ab ad alias culpa cum distinctio dolor doloremque doloribus, ducimus ea eius excepturi explicabo impedit, iste itaque iure laborum mollitia nisi nobis nostrum numquam odio praesentium quaerat quos, rem rerum sed sunt suscipit ullam veritatis voluptates. Adipisci alias aliquid blanditiis culpa deleniti dicta dolorem dolorum eaque eligendi esse et expedita, facere fugit illum ipsum laboriosam nihil nisi numquam obcaecati quaerat qui quos recusandae reiciendis, repellendus rerum sint velit vitae voluptas voluptates voluptatibus! Ad adipisci animi aperiam aspernatur autem blanditiis deleniti deserunt, ea enim est ex fugiat fugit inventore iste itaque modi molestias nam nihil nostrum, odit officiis porro praesentium provident quam quasi quis quod ratione reprehenderit repudiandae rerum sed sequi sunt tenetur ut vel veniam vero. Delectus eaque excepturi molestias necessitatibus neque reprehenderit unde velit? Animi asperiores aut autem commodi dicta earum eos facere facilis impedit iste labore libero nihil non perferendis quasi qui quia similique, sunt! Asperiores dolores excepturi quasi. Animi deserunt ducimus expedita quis repellendus sapiente sint unde.
        </div>
      </div>
    </div>
    <template #footer-aside>
      <span class="acv-text acv-text--body-24">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem commodi deleniti dolorem dolorum eligendi</span>
    </template>
    <template #footer>
      <AcvButton
        type="secondary"
        @click="dialogBasicVisible = false"
      >
        Cancel
      </AcvButton>
      <AcvButton @click="dialogBasicVisible = false">
        Ok
      </AcvButton>
    </template>
  </AcvDialog>
</template>
