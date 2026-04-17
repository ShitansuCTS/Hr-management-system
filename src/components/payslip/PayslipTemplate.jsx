const PayslipTemplate = ({ payroll }) => {
  if (!payroll) return null;

  const monthName = new Date(0, payroll.month - 1).toLocaleString("default", {
    month: "long",
  });

  return (
    <div className="w-[800px] bg-white text-black border border-black text-[12px]">
      {/* HEADER */}
      <div className="flex justify-between items-center border-b border-black p-2">
        <div className="flex items-center gap-2">
          <img src="/logo.png" className="h-10" />
          <div>
            <h1 className="font-bold text-lg">CRUSHADERS</h1>
            <p className="text-xs">Tech Solution</p>
          </div>
        </div>

        <div className="text-right text-[11px]">
          <p>2nd Floor, Plot no - 450/4507</p>
          <p>GPS Tower, Kananvihar, Phase-II</p>
          <p>Bhubaneswar, Odisha, 751031, India</p>
        </div>
      </div>

      {/* TITLE */}
      <div className="text-center font-semibold border-b border-black py-1">
        Payslip for the Month of {monthName} {payroll.year}
      </div>

      {/* EMPLOYEE DETAILS */}
      <table className="w-full border-b border-black">
        <tbody>
          <tr>
            <td className="border-r p-1">Emp Code</td>
            <td className="border-r p-1">{payroll.user.employeeId}</td>

            <td className="border-r p-1">Payable Days</td>
            <td className="p-1">{payroll.totalWorkingDays}</td>
          </tr>

          <tr>
            <td className="border-r p-1">Emp Name</td>
            <td className="border-r p-1">{payroll.user.fullName}</td>

            <td className="border-r p-1">Paid Days</td>
            <td className="p-1">{payroll.presentDays}</td>
          </tr>

          <tr>
            <td className="border-r p-1">Designation</td>
            <td className="border-r p-1">Developer</td>

            <td className="border-r p-1">Loss of Pay</td>
            <td className="p-1">{payroll.absentDays}</td>
          </tr>

          <tr>
            <td className="border-r p-1">Bank Name</td>
            <td className="border-r p-1">HDFC Bank</td>

            <td className="border-r p-1">PAN</td>
            <td className="p-1">XXXXXXXXXX</td>
          </tr>

          <tr>
            <td className="border-r p-1">Account No</td>
            <td className="border-r p-1">XXXXXXXXXXXX</td>

            <td className="border-r p-1">DOJ</td>
            <td className="p-1">--</td>
          </tr>
        </tbody>
      </table>

      {/* EARNINGS + DEDUCTIONS */}
      <table className="w-full">
        <thead>
          <tr className="border-b border-black">
            <th className="border-r p-1 text-left">Head</th>
            <th className="border-r p-1 text-center">Earning</th>
            <th className="p-1 text-center">Deduction</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td className="border-r p-1">Basic</td>
            <td className="border-r p-1 text-right">{payroll.basic.toFixed(2)}</td>
            <td></td>
          </tr>

          <tr>
            <td className="border-r p-1">House Rent Allowance</td>
            <td className="border-r p-1 text-right">{payroll.hra.toFixed(2)}</td>
            <td></td>
          </tr>

          <tr>
            <td className="border-r p-1">Medical Allowance</td>
            <td className="border-r p-1 text-right">{payroll.medicalAllowance.toFixed(2)}</td>
            <td></td>
          </tr>

          <tr>
            <td className="border-r p-1">Special Allowance</td>
            <td className="border-r p-1 text-right">{payroll.specialAllowance.toFixed(2)}</td>
            <td></td>
          </tr>

          <tr>
            <td className="border-r p-1">Incentive</td>
            <td className="border-r p-1 text-right">{payroll.incentive.toFixed(2)}</td>
            <td></td>
          </tr>

          <tr>
            <td className="border-r p-1">Provident Fund</td>
            <td></td>
            <td className="text-right pr-2">{payroll.providentFund.toFixed(2)}</td>
          </tr>

          <tr>
            <td className="border-r p-1">Profession Tax</td>
            <td></td>
            <td className="text-right pr-2">{payroll.professionTax.toFixed(2)}</td>
          </tr>

          <tr>
            <td className="border-r p-1">ESIC</td>
            <td></td>
            <td className="text-right pr-2">{payroll.esic.toFixed(2)}</td>
          </tr>

          {/* EMPTY SPACE LIKE ORIGINAL */}
          <tr>
            <td className="h-24 border-r"></td>
            <td className="border-r"></td>
            <td></td>
          </tr>
        </tbody>
      </table>

      {/* TOTAL */}
      <table className="w-full border-t border-black">
        <tbody>
          <tr>
            <td className="border-r p-1 font-semibold">Total</td>
            <td className="border-r p-1 text-right font-semibold">
              {payroll.grossSalary.toFixed(2)}
            </td>
            <td className="p-1 text-right font-semibold">{payroll.totalDeductions.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      {/* NET SALARY */}
      <div className="border-t border-black p-2 font-semibold">
        Net Salary : Rs.{payroll.netSalary.toFixed(2)}
      </div>

      {/* FOOTER */}
      <div className="border-t border-black text-center text-[10px] p-2">
        **Note: THIS IS A COMPUTER GENERATED STATEMENT AND DOES NOT REQUIRE ANY SIGNATURE OR STAMP**
      </div>
    </div>
  );
};

export default PayslipTemplate;
