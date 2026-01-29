import React from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import Footer from '@/components/shared/Footer'
import HolidaysList from '@/components/holidays/HolidaysList'


const page = () => {
    return (
        <>
            <PageHeader >
                <h5 className="m-b-10 text-capitalize">All Registerd Holidays</h5>
            </PageHeader>
            <div className='main-content'>
                <div className='row'>
                    <HolidaysList />
                </div>
            </div>
            <Footer />
        </>
    )
}

export default page