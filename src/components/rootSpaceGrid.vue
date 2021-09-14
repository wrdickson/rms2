<template>
  <v-data-table
    dense
    fixed-header
    height="500"
    :loading="loading"
    style="width: 100%"
    :headers="headers"
    :items="rootSpaces"
  >
    <template v-slot:top>
      <v-toolbar
        flat
        dense
      >
        <v-toolbar-title>Root Spaces Admin</v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <!-- New Item Dialog -->
        <v-dialog
          v-model="newDialog"
          max-width="500px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              small
              dark
              class="mb-2"
              v-bind="attrs"
              v-on="on"
            >
              New Item
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">New Item</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col
                    cols="12"
                    sm="4"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.title"
                      label="Title"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="4"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.displayOrder"
                      label="Display Order"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="4"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.childOf"
                      label="Child of"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="4"
                    md="4"
                  >
                    <v-switch
                      clearable
                      v-model="editedItem.showChildren"
                      label="Show Children"
                    ></v-switch>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="closeNewDialog"
              >
                Cancel
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="saveNewItem"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!-- Delete Item dialog -->
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="headline">Are you sure you want to delete this item?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!-- Edit Item dialog -->
        <v-dialog
          v-model="editDialog"
          max-width="500px"
        >
          <v-card>
            <v-card-title>
              <span class="headline">Edit Item</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col
                    cols="12"
                    sm="4"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.title"
                      label="Title"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="4"
                    md="4"
                  >
                    <v-text-field
                      clearable
                      v-model="editedItem.displayOrder"
                      label="displayOrder"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="4"
                    md="4"
                  >
                    <v-text-field
                      clearable
                      v-model="editedItem.childOf"
                      label="Child of"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="4"
                    md="4"
                  >
                    <v-switch
                      clearable
                      v-model="editedItem.showChildren"
                      label="Show Children"
                    ></v-switch>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="closeEditDialog"
              >
                Cancel
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="saveEditItem"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

      </v-toolbar>
    </template>

    <template v-slot:item.action="{ item }">
      <v-btn
        @click="editItemDialog(item)"
        icon
        x-small
      >
        <i class="v-icon mdi mdi-pencil"></i>
      </v-btn>
      <v-btn
        @click="deleteItemDialog(item)"
        icon
        x-small
      >
        <i class="v-icon mdi mdi-delete"></i>
      </v-btn>
    </template>
    <!-- snackbar -->
    <template v-slot:body.prepend>
      <v-snackbar
        v-model="snackbar"
        :color="snackbarColor"
        :timeout="snackbarTimeout"
      >
        {{ snackbarText }}

        <template v-slot:action="{ attrs }">
          <v-btn
            color="green darken-3"
            text
            v-bind="attrs"
            @click="snackbar = false"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </template>
  </v-data-table>

</template>

<script>
import _ from 'lodash'
export default {
  name: 'rootSpaceGrid',
  props: [
    'rootSpaces'
  ],
  data: () => {
    return {
      dialogDelete: false,
      editDialog: false,
      newDialog: false,
      editedItem: {
        id: 0,
        childOf: 0,
        showChildren: true,
        title: ''
      },
      selectedItem: null,
      snackbar: false,
      snackbarColor: 'success',
      snackbarText: '',
      snackbarTimeout: 2000,
      headers: [
        {
          text: 'ID',
          value: 'id'
        },
        {
          text: 'Title',
          value: 'title'
        },
        {
          text: 'Display Order',
          value: 'displayOrder'
        },
        {
          text: 'Show Children',
          value: 'showChildren'
        },
        {
          text: 'Child Of',
          value: 'childOf'
        },
        {
          text: 'Space Code',
          value: 'spaceCode'
        },
        {
          text: 'Action',
          value: 'action'
        }
      ],
      loading: false,
      max25chars: v => v.length <= 25 || 'Input too long!'
    }
  },
  methods: {
    resetEditedItem () {
      this.editedItem = {
        id: 0,
        title: '',
        childOf: 0,
        showChildren: true
      }
    },

    //  delete ftns
    closeDelete () {
      this.selectedItem = null
      this.dialogDelete = false
    },
    deleteItemDialog (item) {
      this.selectedItem = item
      this.dialogDelete = true
    },
    deleteItemConfirm () {
      /*
      *  of course, delete is bullshit
      *  in the real world, you couldn't delete a space
      *  if it had a reservation, anytime in the past.
      *  maybe an ARCHIVE option or something
      *  YOU JUST CAN NOT DELETE
      *  or at least, as long as there's a reservation reference
      */
      //  ensure that user does not delete an item with children
      var rootItem = _.find(this.rootSpaces, (o) => {
        return o.id === this.selectedItem.id
      })
      if (rootItem.children.length === 0) {
        this.$emit('deleteRootSpace', this.selectedItem.id)
        this.dialogDelete = false
      } else {
        this.snackbarText = 'Can not delete a node with children'
        this.snackbarColor = 'warning'
        this.snackbar = true
      }
    },

    //  edit ftns
    editItemDialog (item) {
      //  clone, don't make them equal
      this.editedItem = JSON.parse(JSON.stringify(item))
      this.editDialog = true
    },
    closeEditDialog () {
      this.resetEditedItem()
      this.editDialog = false
    },
    saveEditItem () {
      //  validate
      var valid = true
      var errorMessage = ''
      //  1. it can't be a child of one of its children
      var rootItem = _.find(this.rootSpaces, (o) => {
        return o.id === this.editedItem.id
      })
      if (rootItem.children.indexOf(parseInt(this.editedItem.childOf)) > -1) {
        valid = false
        errorMessage = 'Cannot be a child of your child.'
      }
      //  2. it must be the id of an existing space OR 0
      var f = _.find(this.rootSpaces, (o) => {
        return o.id === parseInt(this.editedItem.childOf)
      })
      if (!f) {
        //  3. it can be 0
        if (parseInt(this.editedItem.childOf) !== 0) {
          valid = false
          errorMessage = errorMessage + ' Parent must exist (or be 0)'
        }
      }
      if (valid === true) {
        this.$emit('updateRootSpace', this.editedItem)
        this.resetEditedItem()
        this.editDialog = false
      } else {
        this.snackbarText = errorMessage
        this.snackbarColor = 'warning'
        this.snackbar = true
      }
      errorMessage = ''
    },

    //  new item ftns
    saveNewItem () {
      console.log('saveNewItem()', this.editedItem.title, ' . . . . go to db here')
      //  TODO validate
      //  save off . .
      this.$emit('saveNewRootSpace', this.editedItem)
      this.resetEditedItem()
      this.newDialog = false
    },
    cancel () {
      console.log('cancel')
    },
    open () {
      console.log('open')
    },
    closeNewDialog () {
      this.newDialog = false
      this.resetEditedItem()
    }
  }
}
</script>

<style>
.theme--dark.v-data-table {
  color: rgb(151, 190, 151) !important;
}
.displayHeader {
  max-width: 120px !important;
  overflow: hidden;
}
</style>
