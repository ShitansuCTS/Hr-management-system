import CustomersHeader from '@/components/customers/CustomersHeader'
import CustomersTable from '@/components/customers/CustomersTable'
import Footer from '@/components/shared/Footer'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import React from 'react'

const page = () => {
    return (
        <>
            <PageHeader>
                <h5 className="m-b-10 text-capitalize">All our employee !!</h5>
            </PageHeader>
            <div className='main-content'>
                <div className='row'>
                    <CustomersTable />
                </div>
            </div>
            <Footer />
        </>
    )
}

export default page