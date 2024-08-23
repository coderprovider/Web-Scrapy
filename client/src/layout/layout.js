import { useState } from 'react'
import { Outlet, Link } from 'react-router-dom'
import {
    Menu,
    MenuButton,
    MenuItems,
} from '@headlessui/react'
import {
    Bars3Icon,
    BellIcon,
    FolderIcon,
    HomeIcon,
    UsersIcon,
    WindowIcon
} from '@heroicons/react/24/outline'
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'

const Layout = () => {

    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <>
            <div className="flex gap-4">
                <div className="flex flex-col p-6 w-[200px] h-screen bg-indigo-600">
                    <div >
                        <div className="flex h-16 shrink-0 items-center">
                            <img
                                alt="Your Company"
                                src="https://tailwindui.com/img/logos/mark.svg?color=white"
                                className="h-8 w-auto"
                            />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <Link to="/"
                                className='text-indigo-200 hover:bg-indigo-700 hover:text-white group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6'
                            >
                                <HomeIcon className='text-indigo-200 group-hover:text-white h-6 w-6 shrink-0'
                                />
                                Dashboard
                            </Link>
                            <Link to="/client"
                                className='text-indigo-200 hover:bg-indigo-700 hover:text-white group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6'
                            >
                                <UsersIcon className='text-indigo-200 group-hover:text-white h-6 w-6 shrink-0' />
                                Client
                            </Link>
                            <Link to="/project"
                                className='text-indigo-200 hover:bg-indigo-700 hover:text-white group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6'
                            >
                                <FolderIcon className='text-indigo-200 group-hover:text-white h-6 w-6 shrink-0' />
                                Project
                            </Link>
                            <Link to="/crawl"
                                className='text-indigo-200 hover:bg-indigo-700 hover:text-white group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6'
                            >
                                <WindowIcon className='text-indigo-200 group-hover:text-white h-6 w-6 shrink-0' />
                                Crawl
                            </Link>

                        </div>
                    </div>
                </div>
                <div className='w-full'>
                    <div className="sticky top-0 z-9 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
                        <button type="button" onClick={() => setSidebarOpen(true)} className="-m-2.5 p-2.5 text-gray-700 lg:hidden">
                            <span className="sr-only">Open sidebar</span>
                            <Bars3Icon aria-hidden="true" className="h-6 w-6" />
                        </button>
                        <div aria-hidden="true" className="h-6 w-px bg-gray-900/10 lg:hidden" />
                        <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 p-2 py-2">
                            <form action="#" method="GET" className="relative flex flex-1">
                                <label htmlFor="search-field" className="sr-only">
                                    Search
                                </label>
                                <MagnifyingGlassIcon
                                    aria-hidden="true"
                                    className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
                                />
                                <input
                                    id="search-field"
                                    name="search"
                                    type="search"
                                    placeholder="Search..."
                                    className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                                />
                            </form>
                            <div className="flex items-center gap-x-4 lg:gap-x-6">
                                <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
                                    <span className="sr-only">View notifications</span>
                                    <BellIcon aria-hidden="true" className="h-6 w-6" />
                                </button>

                                <div aria-hidden="true" className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10" />

                                <Menu as="div" className="relative">
                                    <MenuButton className="-m-1.5 flex items-center p-1.5">
                                        <span className="sr-only">Open user menu</span>
                                        <img
                                            alt=""
                                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                            className="h-8 w-8 rounded-full bg-gray-50"
                                        />
                                        <span className="hidden lg:flex lg:items-center">
                                            <span aria-hidden="true" className="ml-4 text-sm font-semibold leading-6 text-gray-900">
                                                Tom Cook
                                            </span>
                                            <ChevronDownIcon aria-hidden="true" className="ml-2 h-5 w-5 text-gray-400" />
                                        </span>
                                    </MenuButton>
                                    <MenuItems
                                        transition
                                        className="absolute px-2 right-0 z-8 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                                    >
                                        settings
                                    </MenuItems>
                                </Menu>
                            </div>
                        </div>
                    </div>
                    <div className='mt-6'>
                        <Outlet />
                    </div>
                </div>
            </div>
        </>
    )
}
export default Layout
