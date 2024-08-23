import React, { useEffect, useState } from "react";
import { supabase } from "../api/supabaseClient";
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import { TrashIcon, PencilSquareIcon } from '@heroicons/react/24/outline'

const UserPart = ({ props }) => {

    const [userData, setUserData] = useState([])
    const [open, setOpen] = useState(false)
    const [openConfirm, setOpenConfirm] = useState(false)
    const [openUpdate, setOpenUpdate] = useState(false)
    const [name, setName] = useState("")
    const [mail, setMail] = useState("")
    const [delId, setDelId] = useState("")
    const [updateId, setUpdateId] = useState("")
    const [updateName, setUpdateName] = useState()
    const [updateMail, setUpdateMail] = useState()
    const [fresh, setFresh] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")
    const [updateErrorMsg, setUpdateErrorMsg] = useState("")
    const [isVisible, setIsVisible] = useState(false);
    const [isUpdateVisible, setIsUpdateVisible] = useState(false);
    const [isValid, setIsValid] = useState(true);
    const [isUpdateValid, setIsUpdateValid] = useState(true);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const addUser = async () => {
        const { data, error } = await supabase
            .from('clients')
            .insert([{ name: name, contact: mail }]);
        if (error) console.error(error);
        else {
            setUserData([...userData, data[0]])
        }
        setName('');
        setMail('');
        setIsValid(true)
        setFresh(!fresh)
        props(fresh)
    };

    const fetchUser = async () => {
        const { data, error } = await supabase
            .from('clients')
            .select('*')
            .order('createAt', { ascending: false });
        if (error) console.error(error);
        else setUserData(data);
    };

    const fetchUpdateUser = async () => {
        const { data, error } = await supabase
            .from('clients')
            .select('*')
            .eq("id", updateId)
        if (error) console.error(error);
        else {
            setUpdateMail(data[0].contact)
            setUpdateName(data[0].name)
        }
    }

    const deleteUser = async (id) => {
        const { error } = await supabase
            .from('clients')
            .delete()
            .eq('id', id);
        if (error) console.error(error);
        else {
            setUserData(userData.filter(item => item.id !== id));
            setDelId("")
            setFresh(!fresh)
            props(fresh)
        }
    };

    useEffect(() => {
        fetchUpdateUser()
    }, [updateId])

    const updateUser = async () => {
        const { data, error } = await supabase
            .from('clients')
            .update({ name: updateName, contact: updateMail })
            .eq('id', updateId);
        if (error) console.error(error);
        else {
            setUserData(userData.map(item => (item.id === updateId ? data[0] : item)));
            setUpdateId("")
            setUpdateName("")
            setUpdateMail("")
            setIsUpdateValid(true)
            setFresh(!fresh)
            props(fresh)
            setOpenUpdate(false)
        }
    };

    const handleMail = (e) => {
        const inputMail = e.target.value
        setMail(inputMail)
        setIsValid(emailRegex.test(inputMail))
    }

    const handleUpdateMail = (e) => {
        const inputUpdateMail = e.target.value
        setUpdateMail(inputUpdateMail)
        setIsUpdateValid(emailRegex.test(inputUpdateMail))
    }

    const save = () => {
        if (name === "")
            setErrorMsg("Name is required!")

        if (mail === "")
            setErrorMsg("Mail is required!")

        if (!isValid)
            setErrorMsg("Input Email correctly!")

        if (
            name !== "" && mail !== "" && isValid
        ) {
            addUser()
            setOpen(false)
        }
    }

    useEffect(() => {
        if (errorMsg !== "") {
            setIsVisible(true)
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 3000);

            return () => clearTimeout(timer);

        }
    }, [errorMsg])

    useEffect(() => {
        if (updateErrorMsg !== "") {
            setIsUpdateVisible(true)

            const timer = setTimeout(() => {
                setIsUpdateVisible(false);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [updateErrorMsg])

    const confirm = (id) => {
        setDelId(id)
        setOpenConfirm(true)
    }

    const Del = () => {
        deleteUser(delId)
        setOpenConfirm(false)
    }

    const update = (id) => {
        setUpdateId(id)
        setOpenUpdate(true)
    }

    const confirmUpdate = () => {
        if (updateName === "") setUpdateErrorMsg("Name is required!")
        if (updateMail === "") setUpdateErrorMsg("Mail is required!")
        if (!isUpdateValid) setUpdateErrorMsg("Input Email correctly!")
        if (
            updateName !== "" && updateMail !== "" && isUpdateValid
        ) {
            updateUser()
        }
    }

    const cancel = () => {
        setOpen(false)
        setName('');
        setMail('');
        setErrorMsg('')
        setIsValid(true)
        setFresh(!fresh)
    }

    useEffect(() => {
        fetchUser()
    }, [fresh])

    return (
        <>
            <div className="w-full shadow-md py-8 px-6 h-[80vh]">
                <div>
                    <p className="text-center text-[24px] font-bold">Client Management</p>
                    <div>
                        <button
                            onClick={() => setOpen(true)}
                            type="button"
                            className="border-[1px] border-indigo-600 float-right rounded bg-indigo-600 px-4 py-1 text-xs font-semibold text-white shadow-sm hover:bg-white hover:text-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                        >
                            ADD
                        </button>
                    </div>
                </div>
                <div className="mt-8 overflow-y-auto h-[60vh]">
                    <table className="min-w-full divide-y divide-gray-300 text-left" >
                        <thead>
                            <tr>
                                <th className="px-2 py-2 text-md text-gray-900">No</th>
                                <th className="px-2 py-2 text-md text-gray-900">Name</th>
                                <th className="px-2 py-2 text-md text-gray-900">Contact Details</th>
                                <th className="px-2 py-2 text-md text-gray-900">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {
                                userData.map((item, key) => (
                                    <tr className="rounded-[10px] hover:bg-slate-100 hover:cursor-pointer">
                                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900"> {key + 1}</td>
                                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">  {item?.name}</td>
                                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900"> {item?.contact}</td>
                                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">
                                            <div className="flex gap-2">
                                                <PencilSquareIcon
                                                    onClick={() => update(item.id)}
                                                    className="w-6 h-6 text-green-400 hover:text-indigo-800"
                                                />
                                                <TrashIcon
                                                    onClick={() => confirm(item.id)}
                                                    className="w-6 h-6 text-red-400 hover:text-indigo-800"
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>

            <Dialog open={open} onClose={cancel} className="relative z-10">
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
                />
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <DialogPanel
                            transition
                            className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-sm sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
                        >
                            <div className="text-center text-lg font-semibold">
                                Add new Item
                            </div>

                            <div className="h-[10px] mt-[10px]">
                                {isVisible && <h1 className="text-red-500 text-center">{errorMsg}</h1>}
                            </div>

                            <div className="flex flex-col gap-2 mt-4">
                                <div className="flex gap-4 w-full justify-center items-center">
                                    <label className="block w-[15%] text-sm font-medium leading-6 text-gray-900">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="name...."
                                        className="block w-full rounded-md border-0 py-1.5 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className="flex gap-4 w-full justify-center items-center">
                                    <label className="block w-[15%] text-sm font-medium leading-6 text-gray-900">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="you@gmail.com...."
                                        className="block w-full rounded-md border-0 py-1.5 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        onChange={(e) => handleMail(e)}
                                    />
                                </div>
                            </div>
                            <div className="mt-5 sm:mt-6 flex gap-2 justify-between">
                                <button
                                    type="button"
                                    onClick={() => cancel()}
                                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={() => save()}
                                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Save
                                </button>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>

            <Dialog open={openConfirm} onClose={setOpenConfirm} className="relative z-10">
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
                />
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <DialogPanel
                            transition
                            className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-sm sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
                        >
                            <div className="mt-4">
                                <div className="w-full text-md font-semibold">
                                    Do you want to delete this item?
                                </div>
                            </div>
                            <div className="flex gap-2 mt-4 ml-[40%]">
                                <button
                                    type="button"
                                    onClick={() => setOpenConfirm(false)}
                                    className="border-[1px] border-indigo-600 inline-flex w-[100px] justify-center rounded-md  px-2 py-1 text-[14px]  text-indigo-600 shadow-sm hover:bg-indigo-600 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={() => Del()}
                                    className="border-[1px] border-indigo-600 inline-flex w-[100px] justify-center rounded-md bg-indigo-600 px-2 py-1 text-[14px] text-white shadow-sm hover:bg-white hover:text-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Confirm
                                </button>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>

            <Dialog open={openUpdate} onClose={setOpenUpdate} className="relative z-10">
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
                />
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <DialogPanel
                            transition
                            className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-sm sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
                        >
                            <div className="text-center text-lg font-semibold">
                                Update this Item
                            </div>
                            <div className="h-[10px] mt-[10px]">
                                {isUpdateVisible && <h1 className="text-red-500 text-center">{updateErrorMsg}</h1>}
                            </div>
                            <div className="flex flex-col gap-2 mt-4">
                                <div className="flex gap-4 w-full justify-center items-center">
                                    <label className="block w-[15%] text-sm font-medium leading-6 text-gray-900">
                                        Name
                                    </label>

                                    <input
                                        value={updateName}
                                        placeholder="name"
                                        type="text"
                                        className="block w-full rounded-md border-0 py-1.5 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        onChange={(e) => setUpdateName(e.target.value)}
                                    />
                                </div>
                                <div className="flex gap-4 w-full justify-center items-center">
                                    <label className="block w-[15%] text-sm font-medium leading-6 text-gray-900">
                                        Email
                                    </label>

                                    <input
                                        value={updateMail}
                                        placeholder="email"
                                        type="email"
                                        className="block w-full rounded-md border-0 py-1.5 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        onChange={(e) => handleUpdateMail(e)}
                                    />
                                </div>
                            </div>
                            <div className="mt-5 sm:mt-6 flex gap-2 justify-between">
                                <button
                                    type="button"
                                    onClick={() => setOpenUpdate(false)}
                                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={() => confirmUpdate()}
                                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Save
                                </button>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </>
    )
}

export default UserPart