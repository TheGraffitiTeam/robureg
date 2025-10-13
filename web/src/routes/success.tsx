import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/success')({
    component: Success,
})

function Success() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
            <div className="max-w-md w-full text-center space-y-6">
                <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                    <svg
                        className="w-8 h-8 text-green-600 dark:text-green-400"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold">Application Submitted!</h1>
                    <p className="text-muted-foreground">
                        Thank you for applying to ROBU. We've received your application and
                        will review it soon.
                    </p>
                </div>

            </div>
        </div>
    )
}

