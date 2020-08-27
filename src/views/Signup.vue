<template>
  
  <AuthenticationLayout>
    <template slot="login-body">
      <v-card-title class="text-h4">SIGN UP</v-card-title>
      <v-card-text class="px-5 py-5">
        <v-alert dense type="error" v-if="status == 'failure' ? true : false" transition="scale-transition">
            {{error}}
          </v-alert>
          <ValidationObserver ref="observer">
              <form>
                  <ValidationProvider v-slot="{ errors }" name="Email" rules="required|email">
                      <v-text-field
                      color="primary"
                      v-model="email"
                      :error-messages="errors"
                      label="Email"
                      required
                      ></v-text-field>
                  </ValidationProvider>
                  <ValidationProvider v-slot="{ errors }" name="Password" rules="required|min:6|confirmedBy:@Confirm password">
                      <v-text-field
                      v-model="password"
                      :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="showPassword ? 'text' : 'password'"
                      :error-messages="errors"
                      label="Password"
                      required
                      @click:append="showPassword = !showPassword"
                      ></v-text-field>
                  </ValidationProvider>
                  <ValidationProvider v-slot="{ errors }" name="Confirm password" rules="required|confirmedBy:@Password">
                      <v-text-field
                      v-model="cpassword"
                      :type="showCPassword ? 'text' : 'password'"
                      :append-icon="showCPassword ? 'mdi-eye' : 'mdi-eye-off'"
                      :error-messages="errors"
                      label="Confirm Password"
                      @click:append="showCPassword = !showCPassword"
                      required
                      ></v-text-field>
                  </ValidationProvider>
                  
              </form>
          </ValidationObserver>
      </v-card-text>
      <v-card-actions class="px-5 py-5 d-flex flex-row-reverse">
          <div class="">
              <div class="">
              <v-btn text href="/signin" class="mr-4">SIGN IN</v-btn>
              <v-btn color="primary" @click="submit" :loading="loading ? true : false">SIGN UP</v-btn>
          </div>
          </div>
          
      </v-card-actions>
    </template>
  </AuthenticationLayout>
      
</template>

<script>
  import { required, email, max, min, confirmed, target } from 'vee-validate/dist/rules'
  import { extend, ValidationObserver, ValidationProvider, setInteractionMode } from 'vee-validate'
  import AuthenticationLayout from '../layouts/AuthenticationLayout.vue'
  import { mapState } from 'vuex';

  setInteractionMode('eager')

  extend('required', {
    ...required,
     message: '{_field_} is required.'
  });

  extend('email', {
    ...email,
    message: 'Email must be valid.',
  });

  extend('confirmed', {
    ...confirmed,
    message: 'Password and confirm password must be same.',
  });

  extend('confirmedBy', {
    params: ['target'],
    validate(value, {target} ) {
        return value === target;
    },
    message:"Password and confirm password must be same."
  });

  extend('min', {
    ...min,
    message: 'Min character is 6',
  })

  extend('email', {
    ...email,
    message: 'Email must be valid',
  })

  export default {
    components: {
      ValidationProvider,
      ValidationObserver,
      AuthenticationLayout
    },
    data: () => ({
      email: '',
      password: '',
      cpassword: '',
      loading: false,
      showPassword:false,
      showCPassword:false
    }),

    computed: {
      ...mapState(['status','error'])
    },

    methods: {
      submit () {
        var self = this; 
          this.$refs.observer.validate().then(valid=>{
            if(valid){
              const user = {
                self: this,
                email: this.email,
                password: this.password,
                link: 'signin',
              }
              this.$store.dispatch('signUpAction', user);
            }
        });
      },
    },
  }
</script>