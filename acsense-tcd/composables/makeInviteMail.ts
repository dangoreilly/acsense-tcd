/**
 * Generates a formatted mailto link for resetting a user's password.
 * 
 * @param newUserData - The user data obtained from the API.
 * @returns The formatted mailto link.
 */
export default function (newUserData: any, action: string = "invite") :string {
    // Take in user data from api/create-user and return a formatted mailto link

    // Make the action link URL safe
    const actionLink = newUserData.properties.action_link.replace(/&/g, '%26').replace(/=/g, '%3D');

    let mailto = "";
    if (action === "invite") {
        mailto = `mailto:${newUserData.user.email}?subject=Welcome to Acsense!&body=Hello ${newUserData.user.email},%0D%0A%0D%0AWelcome to Acsense!%0D%0A%0D%0AWe're excited to have you on board. Please click the link below to set up your account.%0D%0A%0D%0A${actionLink}%0D%0A%0D%0AIf you have any questions, please don't hesitate to get in touch.%0D%0A%0D%0AKind regards,%0D%0AThe Acsense Team`
    } else if (action === "reset") {
        mailto = `mailto:${newUserData.user.email}?subject=Reset your Acsense password&body=Hello ${newUserData.user.email},%0D%0A%0D%0AWe have received a request to reset your Acsense password. Please click the link below to reset your password.%0D%0A%0D%0A${actionLink}%0D%0A%0D%0AIf you did not request this, please ignore this email.%0D%0A%0D%0AKind regards,%0D%0AThe Acsense Team`
    }
    // const mailto = `mailto:${newUserData.user.email}?subject=Welcome to Acsense!&body=Hello ${newUserData.user.email},%0D%0A%0D%0AWelcome to Acsense!%0D%0A%0D%0AWe're excited to have you on board. Please click the link below to set up your account.%0D%0A%0D%0A${actionLink}%0D%0A%0D%0AIf you have any questions, please don't hesitate to get in touch.%0D%0A%0D%0AKind regards,%0D%0AThe Acsense Team`
    return mailto;
}