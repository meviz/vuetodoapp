<template>
  <v-app id="inspire">
    <v-app-bar
      app
      color="blue-grey"
      dark
    >
      <v-app-bar-nav-icon @click.stop="showRightMenu = !showRightMenu"></v-app-bar-nav-icon>
      <v-toolbar-title>TODO APP</v-toolbar-title>
    </v-app-bar>    

    <v-navigation-drawer
      v-model="showRightMenu"
      app
    >
      <v-list dense>
        <v-list-item href="/">
          <v-list-item-action>
            <v-icon>mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Homepage</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-list dense>
        <v-list-item @click="logout()">
          <v-list-item-action>
            <v-icon>mdi-exit-to-app</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
    <v-container fluid>
        <v-row>
            <v-col cols="12" md="4" sm="12">
                <v-card class="mx-auto" tile >
                    <v-card-title>
                        TODO LIST
                        <v-spacer></v-spacer>
                        <v-btn small fab @click="openAddDialog()">
                            <v-icon v-text="'mdi-plus'"></v-icon>
                        </v-btn>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-list v-if="todos.length" dense class="fluid">
                        <v-list-item-group v-model="itemIndex" color="blue-grey">
                        <v-list-item
                            v-for="(item, i) in todos"
                            :key="i"
                             @click="setActive(item)"
                        >
                            <v-tooltip top>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-list-item-icon v-bind="attrs"
                                    v-on="on">
                                        <v-icon 
                                            :color="item.type == 'Done' ? 'green' : 'red'" 
                                            v-text="item.type == 'Done' ? 'mdi-checkbox-marked-circle-outline' : 'mdi-checkbox-blank-circle-outline'">
                                        </v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-content>
                                    <v-list-item-title v-text="item.title"></v-list-item-title>
                                    </v-list-item-content>
                                </template>
                                {{item.type}}
                            </v-tooltip>
                        </v-list-item>
                        </v-list-item-group>
                    </v-list>
                    <v-card-text v-if="todos == null || todos.length == 0">You don't have any todos</v-card-text>
                </v-card>
            </v-col>
            <v-col v-if="activeItem" cols="12" md="8" sm="12">
                <v-card>
                    <v-card-title>
                        <v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon class="mr-1"
                                    v-bind="attrs"
                                    v-on="on"
                                    :color="activeItem.type == 'Done' ? 'green' : 'red'" 
                                    v-text="activeItem.type == 'Done' ? 'mdi-checkbox-marked-circle-outline' : 'mdi-checkbox-blank-circle-outline'">
                                </v-icon>
                            </template>
                            {{activeItem.type}}
                        </v-tooltip>
                        <span>{{activeItem.title}}</span>
                        <v-spacer></v-spacer>
                        <v-btn small fab @click="openEditDialog(activeItem)">
                            <v-icon v-text="'mdi-pencil'"></v-icon>
                        </v-btn>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text>{{activeItem.text}}</v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
    </v-main>

    <v-dialog v-model="dialog" max-width="600px">
        <v-card>
            <v-card-title>
                <span class="headline">TODO</span>
                <v-spacer></v-spacer>
                <v-btn x-small dark color="red" fab @click="dialog = !dialog">
                    <v-icon class="text--white" v-text="'mdi-close'"></v-icon>
                </v-btn>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
                <v-container>
                    <v-row>
                        <v-col cols="12">
                          <ValidationObserver ref="observer">
                            <form>
                              <ValidationProvider v-slot="{ errors }" name="Title" rules="required">
                                <v-text-field label="Title" :error-messages="errors" v-model="titleValue" required></v-text-field>
                              </ValidationProvider>
                              <ValidationProvider v-slot="{ errors }" name="Type" rules="required">
                                <v-select
                                    v-model="typeValue"
                                    :items="types"
                                    :error-messages="errors"
                                    label="Type"
                                    required
                                    dense
                                ></v-select>
                              </ValidationProvider>
                              <ValidationProvider v-slot="{ errors }" name="Detail" rules="required">
                                <v-textarea required v-model="textValue" label="Detail" :error-messages="errors" no-resize></v-textarea>
                              </ValidationProvider>
                            </form>
                          </ValidationObserver>
                        </v-col>
                    </v-row>
                    <div class="d-flex">
                        <v-spacer></v-spacer>
                        <v-btn class="mr-4" color="red" dark @click="dialog = false">Close</v-btn>
                        <v-btn color="blue-grey" dark @click="saveTodo()">Save</v-btn>
                    </div>
                </v-container>
            </v-card-text>
            <v-card-actions>
                
            </v-card-actions>
        </v-card>
    </v-dialog>
    
    <v-footer
      app
      color="blue-grey"
      class="white--text"
    >
      <span>Vuetify</span>
      <v-spacer></v-spacer>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
  import { db } from '../firebase/firebase';
  import { required } from 'vee-validate/dist/rules'
  import { extend, ValidationObserver, ValidationProvider, setInteractionMode } from 'vee-validate'

  setInteractionMode('eager')

  extend('required', {
    ...required,
    message: '{_field_} can not be empty',
  })

  export default {
    props: {
      source: String,
    },
    data: () => ({
        dialog: false,
        showRightMenu: false,
        todos: [],
        activeItem: null,
        types: ['Done', 'Todo'],
        titleValue:"",
        typeValue:"",
        textValue:"",
        uid:"",
        btnType:"",
        itemIndex:null,
    }),

    beforeMount(){
      this.getTodo();
    },

    methods: {
        getTodo(){
          var self = this;
          self.uid = localStorage.getItem('user');
          console.log(self.uid);
          db.ref('/' + self.uid ).once('value').then((snapshot)=>{
            self.todos = snapshot.val();
            console.log(self.todos);
            if(self.todos == null){
              self.todos = [];
            }
          });
        },

        setActive(item,ind){
            this.itemIndex = ind;
            this.activeItem = item;
        },

        openAddDialog(){
          this.dialog = !this.dialog;
          this.btnType = 'add';
          this.titleValue = null;
          this.typeValue = null;
          this.textValue = null;
        },

        openEditDialog(item){
          this.dialog = !this.dialog;
          this.btnType = 'edit';
          this.titleValue = item.title;
          this.typeValue = item.type;
          this.textValue = item.text;
        },

        saveTodo(){
          console.log(this.btnType);
          if(this.btnType && this.btnType == 'add'){
            this.addTodo();
          }else if(this.btnType && this.btnType == 'edit'){
            this.editTodo();
          }
        },

        editTodo(item){
          var self = this
          var data = {
            title: self.titleValue,
            text: self.textValue,
            type: self.typeValue,
          }
          db.ref('/' + self.uid + '/' + self.itemIndex).set(data).then(()=>{
            self.dialog = !self.dialog;
            self.getTodo();
            self.setActive(data,self.itemIndex)
          });
        },

        addTodo(){
          var self = this
          
          db.ref('/' + self.uid + '/' + self.todos.length).set({
            title: self.titleValue,
            text: self.textValue,
            type: self.typeValue,
          }).then(()=>{
            self.dialog = !self.dialog;
            self.getTodo();
          });
        },

        logout(){
          this.$store.dispatch('signOutAction', this);
        }
    }
  }
</script>
