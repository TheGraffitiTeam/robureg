import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
    Field,
    FieldLabel,
    FieldDescription,
    FieldError,
    FieldGroup,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { config } from "@/lib/config"

// Zod schema matching the CreateRecruitDto
const recruitSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    studentId: z.string().min(1, "Student ID is required"),
    personalEmail: z.string().email("Invalid email address"),
    gsuiteEmail: z.string().email("Invalid GSuite email address"),
    phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
    enrollmentSemester: z.string().min(1, "Enrollment semester is required"),
    residentialSemester: z.string().min(1, "Residential semester is required"),
    currentSemester: z.string().min(1, "Current semester is required"),
    preferedDepartment: z.string().min(1, "Preferred department is required"),
    preferedDepartment2: z
        .string()
        .min(1, "Second preferred department is required"),
    hobbies: z.string().optional(),
    about: z.string().min(10, "Please write at least 10 characters about yourself"),
    skills: z.string().optional(),
    facebookLink: z.string().url("Invalid Facebook URL"),
    linkedinLink: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
    githubLink: z.string().url("Invalid GitHub URL").optional().or(z.literal("")),
    portfolioLink: z.string().url("Invalid Portfolio URL").optional().or(z.literal("")),
})

type RecruitFormData = z.infer<typeof recruitSchema>

// Department options
const departments = [
    { value: "", label: "Select a department" },
    { value: "fm", label: "Finance and Marketing Department (F&M)" },
    { value: "it", label: "Department of IT (IT)" },
    { value: "ep", label: "Editorial and Publications Department (E&P)" },
    { value: "rpm", label: "Research and Project Management Department (RPM)" },
    { value: "em", label: "Event Management (EM)" },
    { value: "sp", label: "Strategic Planning Department (SP)" },
    { value: "hr", label: "Human Resources Department (HR)" },
    { value: "ad", label: "Arts & Design (A&D)" },
]

// Semester options
const semesters = [
    { value: "", label: "Select semester" },
    { value: "N/A", label: "N/A" },
    { value: "Spring 2023", label: "Spring 2023" },
    { value: "Summer 2023", label: "Summer 2023" },
    { value: "Fall 2023", label: "Fall 2023" },
    { value: "Spring 2024", label: "Spring 2024" },
    { value: "Summer 2024", label: "Summer 2024" },
    { value: "Fall 2024", label: "Fall 2024" },
    { value: "Spring 2025", label: "Spring 2025" },
    { value: "Summer 2025", label: "Summer 2025" },
    { value: "Fall 2025", label: "Fall 2025" },
]



export function RecruitForm() {
    const navigate = useNavigate()
    const form = useForm<RecruitFormData>({
        resolver: zodResolver(recruitSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            studentId: "",
            personalEmail: "",
            gsuiteEmail: "",
            phoneNumber: "",
            enrollmentSemester: "",
            residentialSemester: "",
            currentSemester: "Fall 2025",
            preferedDepartment: "",
            preferedDepartment2: "",
            hobbies: "",
            about: "",
            skills: "",
            facebookLink: "",
            linkedinLink: "",
            githubLink: "",
            portfolioLink: "",
        },
    })

    const onSubmit = async (data: RecruitFormData) => {
        try {
            const response = await fetch(`${config.apiUrl}/recruits`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => null)
                const errorMessage = errorData?.message || "Something went wrong while submitting your application"
                throw new Error(errorMessage)
            }

            // Success - redirect to success page
            navigate({ to: "/success" })
        } catch (error) {
            // Show user-friendly error message
            const message = error instanceof Error
                ? error.message
                : "We couldn't submit your application. Please check your connection and try again."

            toast.error("Application Failed", {
                description: message,
            })
        }
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl mx-auto p-6">
            <div className="mb-6 -mx-6">
                <img
                    src="/images/registration_background.jpg"
                    alt="Registration background"
                    className="w-full h-40 md:h-56 object-cover lg:rounded-md"
                />
            </div>
            <div>
                <h1 className="text-3xl font-bold">Recruitment Application</h1>
                <p className="text-muted-foreground mt-2">
                    Fill out the form below to apply to ROBU
                </p>
            </div>

            <FieldGroup>
                {/* Personal Information Section */}
                <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Personal Information</h2>

                    {/* First Name & Last Name - side by side */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field>
                            <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                            <Controller
                                name="firstName"
                                control={form.control}
                                render={({ field }) => (
                                    <Input
                                        id="firstName"
                                        placeholder="John"
                                        aria-invalid={!!form.formState.errors.firstName}
                                        {...field}
                                    />
                                )}
                            />
                            <FieldError>{form.formState.errors.firstName?.message}</FieldError>
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                            <Controller
                                name="lastName"
                                control={form.control}
                                render={({ field }) => (
                                    <Input
                                        id="lastName"
                                        placeholder="Doe"
                                        aria-invalid={!!form.formState.errors.lastName}
                                        {...field}
                                    />
                                )}
                            />
                            <FieldError>{form.formState.errors.lastName?.message}</FieldError>
                        </Field>
                    </div>

                    <Field>
                        <FieldLabel htmlFor="studentId">Student ID</FieldLabel>
                        <Controller
                            name="studentId"
                            control={form.control}
                            render={({ field }) => (
                                <Input
                                    id="studentId"
                                    placeholder="1234567"
                                    aria-invalid={!!form.formState.errors.studentId}
                                    {...field}
                                />
                            )}
                        />
                        <FieldError>{form.formState.errors.studentId?.message}</FieldError>
                    </Field>

                    {/* Email fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field>
                            <FieldLabel htmlFor="personalEmail">Personal Email</FieldLabel>
                            <Controller
                                name="personalEmail"
                                control={form.control}
                                render={({ field }) => (
                                    <Input
                                        id="personalEmail"
                                        type="email"
                                        placeholder="john@example.com"
                                        aria-invalid={!!form.formState.errors.personalEmail}
                                        {...field}
                                    />
                                )}
                            />
                            <FieldError>{form.formState.errors.personalEmail?.message}</FieldError>
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="gsuiteEmail">GSuite Email</FieldLabel>
                            <Controller
                                name="gsuiteEmail"
                                control={form.control}
                                render={({ field }) => (
                                    <Input
                                        id="gsuiteEmail"
                                        type="email"
                                        placeholder="john@g.bracu.ac.bd"
                                        aria-invalid={!!form.formState.errors.gsuiteEmail}
                                        {...field}
                                    />
                                )}
                            />
                            <FieldError>{form.formState.errors.gsuiteEmail?.message}</FieldError>
                        </Field>
                    </div>

                    <Field>
                        <FieldLabel htmlFor="phoneNumber">Phone Number</FieldLabel>
                        <Controller
                            name="phoneNumber"
                            control={form.control}
                            render={({ field }) => (
                                <Input
                                    id="phoneNumber"
                                    type="tel"
                                    placeholder="+1234567890"
                                    aria-invalid={!!form.formState.errors.phoneNumber}
                                    {...field}
                                />
                            )}
                        />
                        <FieldError>{form.formState.errors.phoneNumber?.message}</FieldError>
                    </Field>
                </div>

                {/* Academic Information Section */}
                <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Academic Information</h2>

                    <Field>
                        <FieldLabel htmlFor="enrollmentSemester">Enrollment Semester</FieldLabel>
                        <Controller
                            name="enrollmentSemester"
                            control={form.control}
                            render={({ field }) => (
                                <Select
                                    id="enrollmentSemester"
                                    aria-invalid={!!form.formState.errors.enrollmentSemester}
                                    {...field}
                                >
                                    {semesters.slice(2, semesters.length).map((sem) => (
                                        <option key={sem.value} value={sem.value}>
                                            {sem.label}
                                        </option>
                                    ))}
                                </Select>
                            )}
                        />
                        <FieldError>{form.formState.errors.enrollmentSemester?.message}</FieldError>
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="residentialSemester">Residential Semester</FieldLabel>
                        <Controller
                            name="residentialSemester"
                            control={form.control}
                            render={({ field }) => (
                                <Select
                                    id="residentialSemester"
                                    aria-invalid={!!form.formState.errors.residentialSemester}
                                    {...field}
                                >
                                    {semesters.map((sem) => (
                                        <option key={sem.value} value={sem.value}>
                                            {sem.label}
                                        </option>
                                    ))}
                                </Select>
                            )}
                        />
                        <FieldError>{form.formState.errors.residentialSemester?.message}</FieldError>
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="currentSemester">Current Semester</FieldLabel>
                        <Controller
                            name="currentSemester"
                            control={form.control}
                            render={({ field }) => (
                                <Select
                                    id="currentSemester"
                                    aria-invalid={!!form.formState.errors.currentSemester}
                                    disabled
                                    {...field}
                                >
                                    {semesters.map((sem) => (
                                        <option key={sem.value} value={sem.value}>
                                            {sem.label}
                                        </option>
                                    ))}
                                </Select>
                            )}
                        />
                        <FieldError>{form.formState.errors.currentSemester?.message}</FieldError>
                    </Field>
                </div>

                {/* Department Preferences Section */}
                <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Department Preferences</h2>

                    <Field>
                        <FieldLabel htmlFor="preferedDepartment">First Choice Department</FieldLabel>
                        <Controller
                            name="preferedDepartment"
                            control={form.control}
                            render={({ field }) => (
                                <Select
                                    id="preferedDepartment"
                                    aria-invalid={!!form.formState.errors.preferedDepartment}
                                    {...field}
                                >
                                    {departments.map((dept) => (
                                        <option key={dept.value} value={dept.value}>
                                            {dept.label}
                                        </option>
                                    ))}
                                </Select>
                            )}
                        />
                        <FieldError>{form.formState.errors.preferedDepartment?.message}</FieldError>
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="preferedDepartment2">
                            Second Choice Department
                        </FieldLabel>
                        <Controller
                            name="preferedDepartment2"
                            control={form.control}
                            render={({ field }) => (
                                <Select
                                    id="preferedDepartment2"
                                    aria-invalid={!!form.formState.errors.preferedDepartment2}
                                    {...field}
                                >
                                    {departments.map((dept) => (
                                        <option key={dept.value} value={dept.value}>
                                            {dept.label}
                                        </option>
                                    ))}
                                </Select>
                            )}
                        />
                        <FieldError>{form.formState.errors.preferedDepartment2?.message}</FieldError>
                    </Field>
                </div>

                {/* About You Section */}
                <div className="space-y-6">
                    <h2 className="text-xl font-semibold">About You</h2>

                    <Field>
                        <FieldLabel htmlFor="about">Tell us about yourself</FieldLabel>
                        <Controller
                            name="about"
                            control={form.control}
                            render={({ field }) => (
                                <Textarea
                                    id="about"
                                    placeholder="I'm passionate about robotics and..."
                                    rows={5}
                                    aria-invalid={!!form.formState.errors.about}
                                    {...field}
                                />
                            )}
                        />
                        <FieldError>{form.formState.errors.about?.message}</FieldError>
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="skills">Skills (Optional)</FieldLabel>
                        <FieldDescription>
                            List any relevant skills you have (programming, design, CAD, etc.)
                        </FieldDescription>
                        <Controller
                            name="skills"
                            control={form.control}
                            render={({ field }) => (
                                <Textarea
                                    id="skills"
                                    placeholder="Python, JavaScript, SolidWorks..."
                                    rows={3}
                                    aria-invalid={!!form.formState.errors.skills}
                                    {...field}
                                />
                            )}
                        />
                        <FieldError>{form.formState.errors.skills?.message}</FieldError>
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="hobbies">Hobbies (Optional)</FieldLabel>
                        <Controller
                            name="hobbies"
                            control={form.control}
                            render={({ field }) => (
                                <Input
                                    id="hobbies"
                                    placeholder="Reading, gaming, hiking..."
                                    aria-invalid={!!form.formState.errors.hobbies}
                                    {...field}
                                />
                            )}
                        />
                        <FieldError>{form.formState.errors.hobbies?.message}</FieldError>
                    </Field>
                </div>

                {/* Social Links Section */}
                <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Social Links</h2>

                    <Field>
                        <FieldLabel htmlFor="facebookLink">Facebook Profile</FieldLabel>
                        <Controller
                            name="facebookLink"
                            control={form.control}
                            render={({ field }) => (
                                <Input
                                    id="facebookLink"
                                    type="url"
                                    placeholder="https://facebook.com/yourprofile"
                                    aria-invalid={!!form.formState.errors.facebookLink}
                                    {...field}
                                />
                            )}
                        />
                        <FieldError>{form.formState.errors.facebookLink?.message}</FieldError>
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="linkedinLink">LinkedIn Profile (Optional)</FieldLabel>
                        <Controller
                            name="linkedinLink"
                            control={form.control}
                            render={({ field }) => (
                                <Input
                                    id="linkedinLink"
                                    type="url"
                                    placeholder="https://linkedin.com/in/yourprofile"
                                    aria-invalid={!!form.formState.errors.linkedinLink}
                                    {...field}
                                />
                            )}
                        />
                        <FieldError>{form.formState.errors.linkedinLink?.message}</FieldError>
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="githubLink">GitHub Profile (Optional)</FieldLabel>
                        <Controller
                            name="githubLink"
                            control={form.control}
                            render={({ field }) => (
                                <Input
                                    id="githubLink"
                                    type="url"
                                    placeholder="https://github.com/yourusername"
                                    aria-invalid={!!form.formState.errors.githubLink}
                                    {...field}
                                />
                            )}
                        />
                        <FieldError>{form.formState.errors.githubLink?.message}</FieldError>
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="portfolioLink">Portfolio Link (Optional)</FieldLabel>
                        <Controller
                            name="portfolioLink"
                            control={form.control}
                            render={({ field }) => (
                                <Input
                                    id="portfolioLink"
                                    type="url"
                                    placeholder="https://yourportfolio.com"
                                    aria-invalid={!!form.formState.errors.portfolioLink}
                                    {...field}
                                />
                            )}
                        />
                        <FieldError>{form.formState.errors.portfolioLink?.message}</FieldError>
                    </Field>
                </div>
            </FieldGroup>

            {/* Submit Button */}
            <div className="flex gap-4">
                <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => form.reset()}
                    disabled={form.formState.isSubmitting}
                >
                    Reset Form
                </Button>
            </div>
        </form>
    )
}

