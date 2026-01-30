'use client'
import React, { Fragment } from 'react'
import Link from 'next/link'
import CardHeader from '@/components/shared/CardHeader'
import useCardTitleActions from '@/hooks/useCardTitleActions'
import CardLoader from '@/components/shared/CardLoader'
import { FiPlus, FiUserPlus } from 'react-icons/fi'
import { teamMembersList } from '@/utils/fackData/teamMembersList'
import Image from 'next/image'


const HolodayMarkingIcons = ({ title }) => {
    const { refreshKey, isRemoved, isExpanded, handleRefresh, handleExpand, handleDelete } = useCardTitleActions();

    if (isRemoved) {
        return null;
    }
    return (
        <div className="col-lg-12">
            <div className={`card stretch stretch-full ${isExpanded ? "card-expand" : ""} ${refreshKey ? "card-loading" : ""}`}>
                <CardHeader title="Holidays Marking" refresh={handleRefresh} remove={handleDelete} expanded={handleExpand} />
                <div className="card-body custom-card-action ">
                    {
                        [
                            { id: 1, label: "Present", short: "P", color: "#55b56a" },
                            { id: 2, label: "Sunday", short: "S", color: "#e2554a" },
                            { id: 3, label: "Holiday", short: "H", color: "#d4a437" },
                            { id: 4, label: "Leave", short: "L", color: "#3b82c4" },
                            { id: 6, label: "2nd & 4th Saturday", short: "S", color: "#e2554a" },
                        ].map((item, index, arr) => (
                            <Fragment key={item.id}>

                                <div className="d-flex align-items-center">

                                    {/* Circle icon */}
                                    <div
                                        className="flex-shrink-0 me-3"
                                        style={{
                                            width: 36,
                                            height: 36,
                                            borderRadius: "50%",
                                            backgroundColor: item.color, // you can change colors
                                            color: "#fff",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontWeight: 600,
                                            fontSize: 14,
                                        }}
                                    >
                                        {item.short}
                                    </div>

                                    {/* Text */}
                                    <div className="flex-grow-1">
                                        <h5 className="mb-0 fs-14">{item.label}</h5>
                                    </div>

                                </div>

                                {/* Divider */}
                                {arr.length - 1 !== index && (
                                    <hr className="border-dashed my-3" />
                                )}

                            </Fragment>
                        ))
                    }


                </div>
                <CardLoader refreshKey={refreshKey} />
            </div>
        </div>
    )
}

export default HolodayMarkingIcons
