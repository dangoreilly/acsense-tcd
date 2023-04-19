<template>

<div class="container">
    <CheckBoxGridFlex
    :rows="rowsForGrid"
    :cols="colsForGrid"
    @selection-change="updatePermissions"
    />
    <div  
    class="m-5 p-3 text-primary-emphasis bg-primary-subtle border border-primary-subtle rounded-3"
    >
        <p>Permissions:</p>
        <p>{{ permissions }}</p>
    </div>

</div>

</template>

<script lang="ts">


interface building_mini {
  name: string;
  id: string;
}

interface section_mini {
  name: string;
  id: string;
}

export default {
    data() {
        return {
            buildings: [] as building_mini[],
            sections: [] as section_mini[],
            permissions: [] as string[],
        };
    },
    computed: {
        rowsForGrid() {
            return this.buildings.map((bld) => {
                return {
                    name: bld.name,
                    id: bld.id,
                    indeterminate: false,
                };
            });
        },
        colsForGrid() {
            return this.sections.map((sec) => {
                return {
                    name: sec.name,
                    id: sec.id,
                    indeterminate: false,
                };
            });
        },
    },
    created() {
        this.buildings = [
            {
                name: "Building 1",
                id: "bld1",
            },
            {
                name: "Building 2",
                id: "bld2",
            },
            {
                name: "Building 3",
                id: "bld3",
            }
        ];
        this.sections = [
            {
                name: "Section 1",
                id: "sec1",
            },
            {
                name: "Section 2",
                id: "sec2",
            },
            {
                name: "Section 3",
                id: "sec3",
            },
            {
                name: "Section 4",
                id: "sec4",
            }
        ];
    },
    methods: {
        updatePermissions(val: string[]) {
            this.permissions = val;
        },
    },
}

useHead({
  link:[
      {
        rel: "stylesheet",
        href: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css",
        integrity: "sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ",
        crossorigin: "anonymous"
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Lato&family=PT+Mono&display=swap"
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossorigin: "anonymous"
      },
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      }
  ],
  meta: [
    { charset: "utf-8"},
    {  name: "viewport",
      content: "width=device-width, initial-scale=1, shrink-to-fit=no"
    }
  ]
});

</script>

