import React, { useEffect, useState } from "react";
import { supabase } from "../api/supabaseClient";
import { Dialog, DialogBackdrop, DialogPanel, Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { TrashIcon, PencilSquareIcon } from '@heroicons/react/24/outline'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'

const ProjectPart = ({ send }) => {

    const [userData, setUserData] = useState([
        { id: " ", name: "Client name..." }
    ])
    const [selected, setSelected] = useState(userData[0])
    const [projectData, setProjectData] = useState([])
    const [open, setOpen] = useState(false)
    const [openConfirm, setOpenConfirm] = useState(false)
    const [openUpdate, setOpenUpdate] = useState(false)
    const [name, setName] = useState("")
    const [delId, setDelId] = useState("")
    const [updateId, setUpdateId] = useState("")
    const [updateName, setUpdateName] = useState("")
    const [updateClient, setUpdateClient] = useState(userData[0])
    const [fresh, setFresh] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")
    const [updateErrorMsg, setUpdateErrorMsg] = useState("")
    const [isVisible, setIsVisible] = useState(false);
    const [isUpdateVisible, setIsUpdateVisible] = useState("")

    const addProject = async () => {
        const { data, error } = await supabase
            .from('project')
            .insert([{ name: name, client: selected.id }]);
        if (error) console.error(error);
        else {
            setProjectData([...projectData, data[0]])
        }
        setName('');
    };

    const fetchUser = async () => {
        const { data, error } = await supabase
            .from('clients')
            .select('id, name')
            .order('createAt', { ascending: true });
        if (error) console.error(error);
        else setUserData(data);
    };

    const fetchProject = async () => {
        const { data, error } = await supabase
            .from('project')
            .select(`
                id,
                name,
                clients (
                    id,
                    name
                )
            `)
            .order('createAt', { ascending: true });
        if (error) console.error(error);
        else {
            setProjectData(data);
            setFresh(!fresh)
        }
    };

    const deleteProject = async (id) => {
        const { error } = await supabase
            .from('project')
            .delete()
            .eq('id', id);
        if (error) console.error(error);
        else {
            setProjectData(projectData.filter(item => item.id !== id));
            setDelId("")
        }
    };

    const updateProject = async () => {
        const { data, error } = await supabase
            .from('project')
            .update({ name: updateName, client: updateClient.id })
            .eq('id', updateId);
        if (error) console.error(error);
        else {
            setProjectData(projectData.map(item => (item.id === updateId ? data[0] : item)));
            setOpenUpdate(false)
            setUpdateId('')
            setUpdateErrorMsg('')
            setUpdateName('')
            setUpdateClient(userData[0])
            setFresh(!fresh)
        }
    };

    const save = () => {
        if (name.trim() === "") setErrorMsg("Name is required!")
        if (selected.id.trim() === "") setErrorMsg("Client is required!")
        if (
            name.trim() !== "" && selected.id.trim() !== ""
        ) {
            addProject()
            setFresh(!fresh)
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
        deleteProject(delId)
        setOpenConfirm(false)
    }

    const update = (id) => {
        setUpdateId(id)
        setOpenUpdate(true)
    }

    const confirmUpdate = () => {
        if (updateName === "") setUpdateErrorMsg("Project name is required")
        if (updateClient.id === "") setUpdateErrorMsg("Client is required")
        if (
            updateName !== "" && updateClient.id !== ""
        ) {
            updateProject()
        }
    }

    useEffect(() => {
        fetchUser()
        fetchProject()
    }, [fresh, send])

    return (
        <>
            <div className="w-full shadow-md py-8 px-6 h-[80vh]">
                <div>
                    <p className="text-center text-[24px] font-bold">Project Management</p>
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
                    <table className=" min-w-full divide-y divide-gray-300 text-left" >
                        <thead>
                            <tr>
                                <th className="px-2 py-2 text-md text-gray-900">No</th>
                                <th className="px-2 py-2 text-md text-gray-900">Name</th>
                                <th className="px-2 py-2 text-md text-gray-900">Client</th>
                                <th className="px-2 py-2 text-md text-gray-900">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {
                                projectData.map((item, key) => (
                                    <tr className="rounded-[10px] hover:bg-slate-100 hover:cursor-pointer">
                                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900"> {key + 1}</td>
                                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">  {item.name}</td>
                                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900"> {item.clients?.name}</td>
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

            <Dialog open={open} onClose={setOpen} className="relative z-10">
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
                />
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <DialogPanel
                            transition
                            className="relative transform rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-sm sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
                        >
                            <div className="text-center text-lg font-semibold">
                                Add new Item
                            </div>

                            <div className="h-[10px] mt-[10px]">
                                {isVisible && <h1 className="text-red-500 text-center">{errorMsg}</h1>}
                            </div>

                            <div className="flex flex-col gap-2 mt-4">
                                <div className="flex gap-4 w-full justify-center items-center">
                                    <label className="block w-[18%] text-sm font-medium leading-6 text-gray-900">
                                        Name
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="project name..."
                                        className="block w-full rounded-md border-0 py-1.5 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <Listbox value={selected} onChange={setSelected}>
                                    <div className='flex gap-4 justify-center items-center'>

                                        <Label className="block mt-2 w-[18%] text-sm font-medium leading-6 text-gray-900">Clients</Label>

                                        <div className="relative mt-2 w-full">
                                            <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                                <span className="block truncate">{selected.name}</span>
                                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                    <ChevronUpDownIcon aria-hidden="true" className="h-5 w-5 text-gray-400" />
                                                </span>
                                            </ListboxButton>

                                            <ListboxOptions
                                                transition
                                                className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:text-sm"
                                            >
                                                {userData.map((item) => (
                                                    <ListboxOption
                                                        key={item.id}
                                                        value={item}
                                                        className="group relative cursor-default select-none py-2 pl-8 pr-4 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white"
                                                    >
                                                        <span className="block truncate font-normal group-data-[selected]:font-semibold">{item.name}</span>
                                                        <span className="absolute inset-y-0 left-0 flex items-center pl-1.5 text-indigo-600 group-data-[focus]:text-white [.group:not([data-selected])_&]:hidden">
                                                            <CheckIcon aria-hidden="true" className="h-5 w-5" />
                                                        </span>
                                                    </ListboxOption>
                                                ))}
                                            </ListboxOptions>
                                        </div>
                                    </div>
                                </Listbox>
                            </div>
                            <div className="mt-5 sm:mt-6 flex gap-2 justify-between">
                                <button
                                    type="button"
                                    onClick={() => setOpen(false)}
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
                            className="relative transform rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-sm sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
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
                            className="relative transform rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-sm sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
                        >
                            <div className="text-center text-lg font-semibold">
                                Update this Item
                            </div>

                            <div className="h-[10px] mt-[10px]">
                                {isUpdateVisible && <h1 className="text-red-500 text-center">{updateErrorMsg}</h1>}
                            </div>

                            <div className="flex flex-col gap-2 mt-4">
                                <div className="flex gap-4 w-full justify-center items-center">
                                    <label className="block w-[18%] text-sm font-medium leading-6 text-gray-900">
                                        Name
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="project name..."
                                        className="block w-full rounded-md border-0 py-1.5 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        onChange={(e) => setUpdateName(e.target.value)}
                                    />
                                </div>
                                <Listbox value={updateClient} onChange={setUpdateClient}>
                                    <div className='flex gap-4 justify-center items-center'>

                                        <Label className="block mt-2 w-[18%] text-sm font-medium leading-6 text-gray-900">Clients</Label>

                                        <div className="relative mt-2 w-full">
                                            <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                                <span className="block truncate">{updateClient.name}</span>
                                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                    <ChevronUpDownIcon aria-hidden="true" className="h-5 w-5 text-gray-400" />
                                                </span>
                                            </ListboxButton>

                                            <ListboxOptions
                                                transition
                                                className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:text-sm"
                                            >
                                                {userData.map((item) => (
                                                    <ListboxOption
                                                        key={item.id}
                                                        value={item}
                                                        className="group relative cursor-default select-none py-2 pl-8 pr-4 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white"
                                                    >
                                                        <span className="block truncate font-normal group-data-[selected]:font-semibold">{item.name}</span>
                                                        <span className="absolute inset-y-0 left-0 flex items-center pl-1.5 text-indigo-600 group-data-[focus]:text-white [.group:not([data-selected])_&]:hidden">
                                                            <CheckIcon aria-hidden="true" className="h-5 w-5" />
                                                        </span>
                                                    </ListboxOption>
                                                ))}
                                            </ListboxOptions>
                                        </div>
                                    </div>
                                </Listbox>
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

export default ProjectPart