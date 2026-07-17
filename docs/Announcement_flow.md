## CREATE ANNOUNCEMENT BY THE ADMIN/HR

    This module is part of the Notification System.
    It allows the HR or Admin of an organization to create announcements that will be visible to employees. All announcement data is stored and maintained in the system database.

    FRONTEND:--
        -The HR/ADMIN will fills out the Create announcenmnt form.
        -Fisrt choose whome to send this email to All Active Employees or to Specific Individuals
        -for that a fetch api will hit and get all the email of our Organization of active users
        -and once fill
        -then hit the submit button
        -Data send to the backend


        if sucessly ->
            Refesh the Sidebar Update Automatically

    BACKEND:--
        -The API receives the data from the frontend and performs the following validations:
            -Token validation
            -ADMIN Will Only Post The data
            -get the frontend data
            -find the All Active users `user.findMany`
            -Once sucessfull , Create the `announcement.create` records
            -Again create the Receptiant recprds `announcementRecipient.createMany`
            -Once True
            -Send the email to all the users `resend.emails.send`  || RESEND
            -Sending the responce to frontend `totalRecipients`

## FETCH LATEST ANNOUNCEMENT BY THE ADMIN/HR

    This module is part of the Notification System Shown in the sidebar for HR.
    It allows the HR or Admin of an organization to fetch the latest Announcement ans showns in the sidebar

    FRONTEND:--
        -In the frontend a `Fetch` Request will hit.
        -On sucessfull
        -Render all the informataion in the ui


        if no data  ->
            Showing no email / Announcements Found

    BACKEND:--
        -The API receives the data from the frontend and performs the following validations:
            -Token validation
            -ADMIN Will Only GET The data
            -get the Only last Some announcemnts `announcement.findMany` data with Desending Order
            -Send Responce to the frontend `announcements`

