<!-- Admin page for displaying logs -->
<template>
    <NuxtLayout name="admin-layout" :activePage="'contributors'">
        <!-- Header -->
        <div class="border-bottom border-2 border-black mb-3 d-flex">
            <!-- Title -->
            <h1 class="display-6 d-flex align-items-end">
                Contributors    
            </h1>

            <!-- Construction Badge -->
            <div class="d-flex align-items-center m-3 fs-5">
                <span class="badge rounded-pill text-bg-warning">
                    Outline Only
                </span>
            </div>

        </div>
        <!-- Main Matter -->
        <div style="overflow-y: auto; overflow-x: hidden;">
            <!-- Use a ContentDoc as a quick way to insert a summary -->
            <ContentDoc path="/contributors" />

            <!-- Demonstration of granular access controls -->
            <CheckBoxGrid
            :rows="rowsForGrid"
            :cols="colsForGrid"
            />
        </div>
    </NuxtLayout>
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
        // Convert the example data into the format required by the CheckBoxGrid
        // I will admit, this is a mess left over from experimentation
        // But as of time of writing, development on this section hasn't fully started
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
        // Initialise the buildings and sections
        this.buildings = [
            {
                name: "Arts Building",
                id: "bld1",
            },
            {
                name: "SNIAM",
                id: "bld2",
            },
            {
                name: "Hamilton Building",
                id: "bld3",
            }
        ];
        this.sections = [
            {
                name: "Description/Location",
                id: "sec1",
            },
            {
                name: "Sensory Information",
                id: "sec2",
            },
            {
                name: "Physical Access/Times",
                id: "sec3",
            },
            {
                name: "Gallery/Further Info",
                id: "sec4",
            }
        ];
    },
}

</script>

<style>
</style>