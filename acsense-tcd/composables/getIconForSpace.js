export default function(space, styles) {

    // Check if the space has an icon override
    if (space.icon_override != null && space.icon_override != "")
        return space.icon_override;
    else {
        // Otherwise, try to get the icon from the space style
        for (let i = 0; i < styles.length; i++) {
            if (styles[i].category == space.type)
                return styles[i].icon;
        }

        // If no icon is found, return the default icon
        return "https://hadxekyuhdhfnfhsfrcx.supabase.co/storage/v1/object/public/icons/default.png"
    }
}