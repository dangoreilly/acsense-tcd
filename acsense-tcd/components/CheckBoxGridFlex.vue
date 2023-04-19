<!-- USAGE: <CheckBoxGrid :rows="rows" :cols="cols" @selection-change="selectionChange" /> -->
<!-- rows: Array of objects with name and id properties -->
<!-- cols: Array of objects with name and id properties -->
<!-- selection-change: emits an array of strings with the format "rowId:colId" -->

<template>

    <div class="table">
        <div class="row">

            <div class="cell">
                <span class="align-bottom"> 
                    <input 
                    type="checkbox" 
                    role="switch"
                    :indeterminate="checkSelectionForAll() === 'indeterminate'"
                    :checked="checkSelectionForAll() === 'full'"
                    @click="toggleAll()"
                    :value="'all:all'" 
                    :title="'all:all'">
                    All
                </span>
            </div>

            <div v-for="col in cols" class="cell">
              <label class="centred">  
                <span class="centred">{{ col.name }}</span>
                <input 
                type="checkbox" 
                :indeterminate="checkSelectionForCol(col) === 'indeterminate'"
                :checked="checkSelectionForCol(col) === 'full'"
                @click="toggleCol(col)"
                :id="'all:'+ col.id"
                :value="'all:'+ col.id"
                :title="'all:'+ col.id">
              </label>
            </div>

        </div>

        <div v-for="row in rows" class="row">

            <div class="cell">
                <label>  
                    <input 
                    type="checkbox" 
                    :indeterminate="checkSelectionForRow(row) === 'indeterminate'"
                    :checked="checkSelectionForRow(row) === 'full'"
                    @click="toggleRow(row)"
                    :id="row.id + ':all'"
                    :title="row.id + ':all'">
                    {{ row.name }}
                </label>
            </div>

            <div v-for="col in cols" class="cell" >
                <label class="centred">  
                    <input 
                    type="checkbox" 
                    v-model="selection"
                    :id="row.id + ':' + col.id" 
                    :value="row.id + ':' + col.id" 
                    :title="row.id + ':' + col.id">
                </label>
                
            </div>

          </div>
    </div>

</template>

<script lang="ts">

interface collection {
    name: string;
    id: string;
    indeterminate: boolean;
}

export default {
  data() {
    return {
      // rows: [] as collection[],
      // cols: [] as collection[],
      selection: [] as string[],
    }
  },
  props: {
    rows: {
      type: Array as () => collection[],
      required: true,
    },
    cols: {
      type: Array as () => collection[],
      required: true,
    },
  
  },
  emits: ['selection-change'],
  watch: {
    selection: {
      handler: function (val) {
        this.$emit('selection-change', val);
      },
      deep: true,
    },
  },
  
  methods: {
    toggleRow(row: collection){
      //if row is untoggled or indeterminate, toggle all cols
      //else, untoggle all cols 

      //Check if row is full
      if (this.checkSelectionForRow(row) === 'full'){
        //remove all selection for this col
        //loop through selection backwards to avoid skipping elements
        for (let i = this.selection.length - 1; i >= 0; i--){
          if (this.selection[i].includes(row.id)){
            this.selection.splice(i, 1);
          }
        }
      } else {
        //add all selection for this row
        for (let col of this.cols){
          //check if permission already exists
          if (!this.selection.includes(row.id + ':' + col.id)) {
            //add permission
            this.selection.push(row.id + ':' + col.id);
          }
        }
      }
    },

    toggleCol(col: collection){
      //if col is untoggled or indeterminate, toggle all rows
      //else, untoggle all rows 

      //Check if col is full
      if (this.checkSelectionForCol(col) === 'full'){
        //remove all selection for this col
        //loop through selection backwards to avoid skipping elements
        for (let i = this.selection.length - 1; i >= 0; i--){
          if (this.selection[i].includes(col.id)){
            this.selection.splice(i, 1);
          }
        }
      } else {
        //add all selection for this col
        for (let row of this.rows){
          //check if permission already exists
          if (!this.selection.includes(row.id + ':' + col.id)) {
            //add permission
            this.selection.push(row.id + ':' + col.id);
          }
        }
      }
    },

    toggleAll(){
      //if selection is empty, toggle all rows and cols
      //else, set selection to empty

      //Check all selection are checked
      if (this.checkSelectionForAll() === 'full'){
        //remove all selection
        this.selection = [];
      } else {
        //Loop through rows and cols
        for (let row of this.rows){
          for (let col of this.cols){
            //check if permission already exists
            if (!this.selection.includes(row.id + ':' + col.id)) {
              //add permission
              this.selection.push(row.id + ':' + col.id);
            }
          }
        }
      }
    },

    checkSelectionForRow(row: collection): string{
      // check number of cols for this row
      // if it's equal to the total number of cols, return 'full'
      // if it's equal to 0, return 'empty'
      // else, return 'indeterminate'

      //check number of selection for this row
      let numSelectionForRow = this.containsSubstring({ list: this.selection, substring: row.id }).length;

      if (numSelectionForRow === 0){
        return 'empty'
      }
      if (numSelectionForRow === this.cols.length){
        return 'full'
      }

      return 'indeterminate'
    },

    checkSelectionForCol(col: collection): string{
      // check number of rows for this col
      // if it's equal to the total number of rows, return 'full'
      // if it's equal to 0, return 'empty'
      // else, return 'indeterminate'

      let numSelectionForCol = this.containsSubstring({ list: this.selection, substring: col.id }).length;

      if (numSelectionForCol === 0){
        return 'empty'
      }
      if (numSelectionForCol === this.rows.length){
        return 'full'
      }

      return 'indeterminate'
    },

    checkSelectionForAll(){
      // check total number of selection
      // if it's equal to number of rows * number of cols, return 'full'
      // if it's equal to 0, return 'empty'
      // else, return 'indeterminate'

      let numSelectionTotal = this.selection.length;
      let maxSelection = this.rows.length * this.cols.length;

      if (numSelectionTotal === 0){
        return 'empty'
      }
      if (numSelectionTotal === maxSelection){
        return 'full'
      }

      return 'indeterminate'
    },

    containsSubstring({ list, substring }: { list: string[]; substring: string; }): string[]{
      // loop through list
      // if any item in list contains substring, add it to a new list
      // return new list
      let newList: string[] = [];
      for (let item of list){
        if (item.includes(substring)){
          newList.push(item);
        }
      }
      return newList;
    }


  }
}
</script>

<style>
    .centred{ 
       display: block;
       text-align: center;
    }

    .cell {
        flex: 1; 
        border-width: 1px;
        border-style: solid;
        border-color: darkgray;
        padding: 0.1rem;
        position:relative;
    }
    .row {
        display: flex;
        flex: 1;
        flex-direction: row;
    }
    .table {
        display: flex;
        flex-direction: column;
        border-width: 1px;
        border-style: solid;
        border-color: darkgray;
    }
    .align-bottom{
        position:absolute;
        bottom:0;
    }
</style>