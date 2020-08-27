<template>
  
  <v-container
        class="fill-height"
        fluid
      >
        <v-row
          align="center"
          justify="center"
        >
            <v-col
                cols="12"
                sm="8"
                md="4"
            >
                <v-card class="elevation-12">
                    <div class="bg-login d-flex flex-column-reverse"></div>
                    <slot name="login-body"/>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<style lang="scss" scoped>
    .bg-login{
        background-image: url('../assets/views.jpeg');
        background-repeat: no-repeat;
        background-size: cover;
        background-position:center center;
        height:200px;
    }
</style>

<script>
export default {
}
</script>