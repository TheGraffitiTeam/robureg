import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { config } from "@/lib/config"

export const Route = createFileRoute('/dashboard')({
    component: Dashboard,
})

interface Recruit {
    id: number
    firstName: string
    lastName: string
    studentId: string
    personalEmail: string
    gsuiteEmail: string
    phoneNumber: string
    enrollmentSemester: string
    residentialSemester: string
    currentSemester: string
    preferedDepartment: string
    preferedDepartment2: string
    hobbies?: string
    about: string
    skills?: string
    facebookLink: string
    linkedinLink?: string
    githubLink?: string
    portfolioLink?: string
    createdAt: string
    updatedAt: string
}

function Dashboard() {
    const navigate = useNavigate()
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [recruits, setRecruits] = useState<Recruit[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedRecruit, setSelectedRecruit] = useState<Recruit | null>(null)
    const [sheetOpen, setSheetOpen] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem('access_token')
        if (!token) {
            navigate({ to: "/login" })
        } else {
            setIsAuthenticated(true)
            fetchRecruits(token)
        }
    }, [navigate])

    const fetchRecruits = async (token: string) => {
        try {
            const response = await fetch(`${config.apiUrl}/recruits`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            })

            if (response.status === 401) {
                toast.error("Session expired", {
                    description: "Please login again",
                })
                localStorage.removeItem('access_token')
                navigate({ to: "/login" })
                return
            }

            if (!response.ok) {
                throw new Error("Failed to fetch recruits")
            }

            const data = await response.json()
            setRecruits(data)
        } catch (error) {
            toast.error("Error", {
                description: error instanceof Error ? error.message : "Failed to load recruits",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('access_token')
        navigate({ to: "/login" })
    }

    const getDepartmentLabel = (dept: string) => {
        const departments: Record<string, string> = {
            "fm": "F&M",
            "it": "IT",
            "ep": "E&P",
            "rpm": "RPM",
            "em": "EM",
            "sp": "SP",
            "hr": "HR",
        }
        return departments[dept] || dept
    }

    const getDepartmentFullName = (dept: string) => {
        const departments: Record<string, string> = {
            "fm": "Finance and Marketing Department",
            "it": "Department of IT",
            "ep": "Editorial and Publications Department",
            "rpm": "Research and Project Management Department",
            "em": "Event Management",
            "sp": "Strategic Planning Department",
            "hr": "Human Resources Department",
        }
        return departments[dept] || dept
    }

    const handleRowClick = (recruit: Recruit) => {
        setSelectedRecruit(recruit)
        setSheetOpen(true)
    }

    if (!isAuthenticated) {
        return null
    }

    return (
        <div className="min-h-screen bg-background">
            <nav className="border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold">ROBU Dashboard</h1>
                        </div>
                        <div className="flex items-center">
                            <Button onClick={handleLogout} variant="outline">
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="mb-6">
                        <h2 className="text-3xl font-bold mb-2">Recruitment Applications</h2>
                        <p className="text-muted-foreground">
                            {loading ? "Loading..." : `Total: ${recruits.length} applicants`}
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <p className="text-muted-foreground">Loading recruits...</p>
                        </div>
                    ) : recruits.length === 0 ? (
                        <div className="border-4 border-dashed border-gray-200 rounded-lg p-12 text-center">
                            <p className="text-muted-foreground">No recruits found</p>
                        </div>
                    ) : (
                        <div className="border rounded-lg">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Student ID</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Phone</TableHead>
                                        <TableHead>Dept 1</TableHead>
                                        <TableHead>Dept 2</TableHead>
                                        <TableHead>Semester</TableHead>
                                        <TableHead>Applied</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recruits.map((recruit) => (
                                        <TableRow
                                            key={recruit.id}
                                            onClick={() => handleRowClick(recruit)}
                                            className="cursor-pointer"
                                        >
                                            <TableCell className="font-medium">{recruit.id}</TableCell>
                                            <TableCell>{recruit.firstName} {recruit.lastName}</TableCell>
                                            <TableCell>{recruit.studentId}</TableCell>
                                            <TableCell>{recruit.personalEmail}</TableCell>
                                            <TableCell>{recruit.phoneNumber}</TableCell>
                                            <TableCell>{getDepartmentLabel(recruit.preferedDepartment)}</TableCell>
                                            <TableCell>{getDepartmentLabel(recruit.preferedDepartment2)}</TableCell>
                                            <TableCell>{recruit.currentSemester}</TableCell>
                                            <TableCell>
                                                {new Date(recruit.createdAt).toLocaleDateString()}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>
            </main>

            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetContent className="overflow-y-auto sm:max-w-lg px-6">
                    {selectedRecruit && (
                        <>
                            <SheetHeader>
                                <SheetTitle>
                                    {selectedRecruit.firstName} {selectedRecruit.lastName}
                                </SheetTitle>
                                <SheetDescription>
                                    Application ID: {selectedRecruit.id} • Applied {new Date(selectedRecruit.createdAt).toLocaleDateString()}
                                </SheetDescription>
                            </SheetHeader>

                            <div className="space-y-6 py-6">
                                <div>
                                    <h3 className="font-semibold mb-3">Personal Information</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="grid grid-cols-3 gap-2">
                                            <span className="text-muted-foreground">Student ID:</span>
                                            <span className="col-span-2">{selectedRecruit.studentId}</span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                            <span className="text-muted-foreground">Personal Email:</span>
                                            <span className="col-span-2">{selectedRecruit.personalEmail}</span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                            <span className="text-muted-foreground">GSuite Email:</span>
                                            <span className="col-span-2">{selectedRecruit.gsuiteEmail}</span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                            <span className="text-muted-foreground">Phone:</span>
                                            <span className="col-span-2">{selectedRecruit.phoneNumber}</span>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                <div>
                                    <h3 className="font-semibold mb-3">Academic Information</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="grid grid-cols-3 gap-2">
                                            <span className="text-muted-foreground">Enrollment:</span>
                                            <span className="col-span-2">{selectedRecruit.enrollmentSemester}</span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                            <span className="text-muted-foreground">Residential:</span>
                                            <span className="col-span-2">{selectedRecruit.residentialSemester}</span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                            <span className="text-muted-foreground">Current:</span>
                                            <span className="col-span-2">{selectedRecruit.currentSemester}</span>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                <div>
                                    <h3 className="font-semibold mb-3">Department Preferences</h3>
                                    <div className="space-y-2 text-sm">
                                        <div>
                                            <span className="text-muted-foreground block mb-1">First Choice:</span>
                                            <span className="font-medium">{getDepartmentFullName(selectedRecruit.preferedDepartment)}</span>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground block mb-1">Second Choice:</span>
                                            <span className="font-medium">{getDepartmentFullName(selectedRecruit.preferedDepartment2)}</span>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                <div>
                                    <h3 className="font-semibold mb-3">About</h3>
                                    <p className="text-sm whitespace-pre-wrap">{selectedRecruit.about}</p>
                                </div>

                                {selectedRecruit.skills && (
                                    <>
                                        <Separator />
                                        <div>
                                            <h3 className="font-semibold mb-3">Skills</h3>
                                            <p className="text-sm whitespace-pre-wrap">{selectedRecruit.skills}</p>
                                        </div>
                                    </>
                                )}

                                {selectedRecruit.hobbies && (
                                    <>
                                        <Separator />
                                        <div>
                                            <h3 className="font-semibold mb-3">Hobbies</h3>
                                            <p className="text-sm">{selectedRecruit.hobbies}</p>
                                        </div>
                                    </>
                                )}

                                <Separator />

                                <div>
                                    <h3 className="font-semibold mb-3">Social Links</h3>
                                    <div className="space-y-2 text-sm">
                                        <div>
                                            <span className="text-muted-foreground block mb-1">Facebook:</span>
                                            <a href={selectedRecruit.facebookLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                                                {selectedRecruit.facebookLink}
                                            </a>
                                        </div>
                                        {selectedRecruit.linkedinLink && (
                                            <div>
                                                <span className="text-muted-foreground block mb-1">LinkedIn:</span>
                                                <a href={selectedRecruit.linkedinLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                                                    {selectedRecruit.linkedinLink}
                                                </a>
                                            </div>
                                        )}
                                        {selectedRecruit.githubLink && (
                                            <div>
                                                <span className="text-muted-foreground block mb-1">GitHub:</span>
                                                <a href={selectedRecruit.githubLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                                                    {selectedRecruit.githubLink}
                                                </a>
                                            </div>
                                        )}
                                        {selectedRecruit.portfolioLink && (
                                            <div>
                                                <span className="text-muted-foreground block mb-1">Portfolio:</span>
                                                <a href={selectedRecruit.portfolioLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                                                    {selectedRecruit.portfolioLink}
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    )
}

