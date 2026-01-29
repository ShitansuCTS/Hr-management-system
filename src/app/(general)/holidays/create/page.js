import React from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import Footer from '@/components/shared/Footer'
import HolidaysList from '@/components/holidays/HolidaysList'
import CreateHolidayList from '@/components/holidays/CreateHolidayList'


const page = () => {
    return (
        <>
            <PageHeader >
                <h5 className="m-b-10 text-capitalize">Add the Holidays</h5>
            </PageHeader>
            <div className='main-content'>
                <div className='row'>
                    <CreateHolidayList />
                </div>
            </div>
            <Footer />
        </>
    )
}

export default page