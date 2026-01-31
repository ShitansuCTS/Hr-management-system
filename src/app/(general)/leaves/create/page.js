import React from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import CreateLeaves from '@/components/leaves/CreateLeaves'

const page = () => {
    return (
        <>
            <PageHeader>
                {/* <PaymentHeader /> */}
            </PageHeader>
            <div className='main-content'>
                <div className='row'>
                    {/* <PaymentTable /> */}
                    <CreateLeaves />
                </div>
            </div>
        </>
    )
}

export default page