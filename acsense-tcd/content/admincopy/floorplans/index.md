Upload new or update existing floorplans in the "SVG file" column. It's important
 that these files are in SVG format. You can use [Inkscape](https://inkscape.org/)
 or [Adobe Illustrator](https://www.adobe.com/ie/products/illustrator.html) to
 create or edit SVG files. The "label" column is used to identify the floorplan; it is 
 what will be displayed in the navigation menu.

The arrows in the "arrange" section are for changing the order of the floor stack.
 Be careful when rearranging floors; spaces and navigation nodes are keyed by the 
 floor's position in the stack. If you change the order of the floors, you will
    need to update the spaces and navigation nodes to reflect the new order.

The "Entry floor" is simply the first floor displayed to a user when they open the 
floorplan viewer. For most buildings, this will be the ground floor. This can be set with
the radio buttons in the "entry floor" column, or with the dropdown above.

The absolute size of "Width" and "Height" boxes above don't really matter, as long as the 
aspect ratio matches that of the SVG files. Set it to match whatver units you used to
create the SVG files, and the floorplan viewer will scale things accordingly. 

Setting both the width and height to 0 will mean the floorplan link will not display on the info page. 

***Warning:*** *If you adjust the map size you will need to update the positions of all the spaces
and navigation nodes*

Press the "Re-generate Map" button to manually refresh the render of the map in the bottom. 
The map doesn't dynamically update when you change the floorplan data, so you need to manually refresh
to see your changes take effect.