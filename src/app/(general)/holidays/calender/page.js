import React from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import Footer from '@/components/shared/Footer'
import CalenderView from '@/components/holidays/CalenderView'


const page = () => {
    return (
        <>
            <PageHeader >
                <h5 className="m-b-10 text-capitalize">Calendar of this Year</h5>
            </PageHeader>
            <div className='main-content'>
                <CalenderView />
            </div>
            <Footer />
        </>
    )
}

export default page