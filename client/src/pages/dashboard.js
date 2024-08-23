import React, { useState } from "react";
import UserPart from "../components/user";
import ProjectPart from "../components/project";

const Dashboard = () => {

    const [fresh, setFresh] = useState("")
    const refresh = (data) => {
        setFresh(data)
    }

    return (
        <>
            <div className="flex overflow-auto flex-col lg:flex-row p-6 gap-4 justify-between">
                <UserPart props={refresh} />
                <ProjectPart send={fresh} />
            </div>
        </>
    )
}

export default Dashboard