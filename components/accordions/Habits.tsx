import {
    Accordion,
    AccordionDetails,
    TextField,
} from "@mui/material"
import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined"
import ToggleDays from "./ToggleDays"

import { Activity } from "../../entities/Activity"
import { useEditHabits } from "../../usecases/useEditActivities"
import { useGetUser } from "../../usecases/useUser"
import { Adder, HHAccordion, PickFrequency, SuggestionAdd } from "./Common"
import { accordionColor } from "../../utils/consts"
import { useState } from "react"

export function HabitAccordion() {
    return (
        <Accordion
                style={{ backgroundColor: accordionColor }}
                defaultExpanded
            >
                <HHAccordion>
                    <Header />
                </HHAccordion>

                <AccordionDetails>
                    <Body />
                </AccordionDetails>
            </Accordion>
    )
}

export function Header() {
    return (
        <div className="grid grid-cols-[3fr_7fr] items-center w-full">
            <div className="">
                <span className="mr-16">Habits</span>
            </div>
            <span className="text-xs text-demph2">Things you want to do</span>
        </div>
    )
}

export function Body() {
    let { editHabits, habits, createNewHabit, handleDelete } =
        useEditHabits()

    return (
        <>
            <Adder handleAdd={() => createNewHabit("")} />
            {!habits?.length && 
                <SuggestionAdd handleSelect={(opt: any)=>createNewHabit(opt)} options={["Exercise 1 Hour", "Read 30 Minutes", ]} />
            }

            <div className="space-y-4">
                {habits?.map((m, i) => (
                    <HabitForm
                        key={`activity${m.id || m.name}${i}`}
                        index={i}
                        onMinusPress={handleDelete}
                        onChange={(update: Activity) => {
                            editHabits(i, update)
                        }}
                        activity={m}
                    />
                ))}
            </div>
        </>
    )
}

export function HabitForm({ onChange, onMinusPress, activity }: any) {
    let { user } = useGetUser()
    let [days, setDays] = useState(activity.days)
    // let [activity, setActivity] = useState<Activity>(init)

    const handleTextUpdate = (e: any) => {
        let update = {
            ...activity,
            user_id: user.userID,
            name: e.target?.value,
        }
        // setActivity(update)
        onChange(update)
    }

    const handleDaysUpdate = (values: number[]) => {
        let update = {
            ...activity,
            user_id: user.userID,
            days: values,
        }
        // setActivity(update)
        setDays(values)
        onChange(update)
    }

    if (!activity) return null

    return (
        <div className="space-y-2">
            <div className="w-full text-right">
                <RemoveCircleOutlineOutlinedIcon
                    onClick={() => onMinusPress(activity)}
                    className="relative top-3"
                    color="warning"
                />
            </div>
            <TextField
                required
                className="w-full"
                id="standard-required"
                label="Goal"
                defaultValue={activity.name}
                onBlur={handleTextUpdate}
            />

            <PickFrequency {...{days, handleDaysUpdate}} />
        </div>
    )
}