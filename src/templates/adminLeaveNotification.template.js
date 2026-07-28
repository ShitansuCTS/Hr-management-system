export function adminLeaveNotificationTemplate({
  employeeName,
  leaveType,
  startDate,
  endDate,
  reason,
}) {
  return `
<div style="background-color:#f4f6f8;padding:40px 0;font-family:Arial,Helvetica,sans-serif;">

<table
  align="center"
  width="700"
  cellpadding="0"
  cellspacing="0"
  style="
    background:#ffffff;
    border-radius:10px;
    overflow:hidden;
    box-shadow:0 6px 18px rgba(0,0,0,0.08);
  "
>

<!-- HEADER -->

<tr>
<td style="background:#3454d1;padding:24px 30px;">

<table width="100%">

<tr>

<td align="left">

<img
src="https://crushaderstech.com/images/logo/logo.webp"
width="150"
alt="Company Logo"
/>

</td>

<td
align="right"
style="color:#ffffff;font-size:14px;"
>

Leave Management System

</td>

</tr>

</table>

</td>
</tr>

<!-- BODY -->

<tr>

<td style="padding:35px;">

<h2
style="
margin:0 0 20px;
color:#3454d1;
"
>

New Leave Application

</h2>

<p>

Hello Admin,

</p>

<p>

A new leave request has been submitted by one of your employees.

</p>

<table
width="100%"
cellpadding="10"
style="
border-collapse:collapse;
margin-top:20px;
"
>

<tr style="background:#f7f8fb;">

<td><strong>Employee</strong></td>

<td>${employeeName}</td>

</tr>

<tr>

<td><strong>Leave Type</strong></td>

<td>${leaveType}</td>

</tr>

<tr style="background:#f7f8fb;">

<td><strong>Start Date</strong></td>

<td>${startDate}</td>

</tr>

<tr>

<td><strong>End Date</strong></td>

<td>${endDate}</td>

</tr>

<tr style="background:#f7f8fb;">

<td><strong>Reason</strong></td>

<td>${reason}</td>

</tr>

</table>

<div
style="
margin-top:35px;
text-align:center;
"
>

<a
href="https://testctsl.in/leaves/list"
style="
background:#3454d1;
color:#ffffff;
padding:14px 28px;
text-decoration:none;
border-radius:6px;
display:inline-block;
font-weight:bold;
"
>

Review Leave Request

</a>

</div>

<p
style="
margin-top:35px;
font-size:14px;
"
>

Regards,

<br>

<strong>HR Management System</strong>

</p>

</td>

</tr>

<!-- FOOTER -->

<tr>

<td
style="
background:#f5f5f5;
padding:20px;
text-align:center;
font-size:12px;
color:#777777;
"
>

© ${new Date().getFullYear()} Crushaders Tech Solutions.

<br>

This is an automated email.

</td>

</tr>

</table>

</div>
`;
}
