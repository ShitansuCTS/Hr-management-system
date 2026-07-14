export async function createFinancialDetails(
  tx,
  userId,
  data
) {
  await tx.financialDetails.create({
    data: {
      bankName:
        data.bankName,

      accountNo:
        data.accountNo,

      ifscCode:
        data.ifscCode,

      panNumber:
        data.panNumber,

      uanNo:
        data.uanNo,

      esicNo:
        data.esicNo,

      userId,
    },
  });
}