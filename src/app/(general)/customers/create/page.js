import React from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import CustomersCreateHeader from '@/components/customersCreate/CustomersCreateHeader'
import CustomerCreateContent from '@/components/customersCreate/CustomerCreateContent'
import ProposalEditContent from '@/components/proposalEditCreate/ProposalEditContent'

const page = () => {
  return (
    <>
      <PageHeader>
       <h5 className="m-b-10 text-capitalize">Add your employee !</h5>
      </PageHeader>
      <div className='main-content'>
        <div className='row'>
          <ProposalEditContent />
        </div>
      </div>
    </>
  )
}

export default page