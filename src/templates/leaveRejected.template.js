export function leaveRejectedTemplate({ userName, leaveType, startDate, endDate }) {
  return `
<div style="background:#eef1f7;padding:40px;font-family:Arial,sans-serif;">

<table
align="center"
width="650"
style="
background:#fff;
border-radius:10px;
overflow:hidden;
box-shadow:0 8px 18px rgba(0,0,0,.08);
">

<tr>

<td
style="
background:#ef4444;
color:white;
padding:30px;
text-align:center;
">

<h2>Leave Rejected ❌</h2>

<p>HR Management System</p>

</td>

</tr>

<tr>

<td style="padding:35px;">

<p>

Hello <strong>${userName}</strong>,

</p>

<p>

Unfortunately your leave request has been rejected.

</p>

<table
width="100%"
cellpadding="10"
style="
background:#f8f9fc;
border-collapse:collapse;
">

<tr>

<td><strong>Leave Type</strong></td>

<td>${leaveType}</td>

</tr>

<tr>

<td><strong>Start Date</strong></td>

<td>${new Date(startDate).toLocaleDateString("en-IN")}</td>

</tr>

<tr>

<td><strong>End Date</strong></td>

<td>${new Date(endDate).toLocaleDateString("en-IN")}</td>

</tr>

</table>

<p
style="
margin-top:30px;
">

For more information please contact HR.

</p>

</td>

</tr>

<tr>

<td
style="
background:#f4f4f4;
padding:20px;
text-align:center;
font-size:12px;
">

© ${new Date().getFullYear()} HRMS

</td>

</tr>

</table>

</div>
`;
}
