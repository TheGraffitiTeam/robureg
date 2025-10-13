import { createFileRoute } from '@tanstack/react-router'
import { RecruitForm } from '@/components/RecruitForm'

export const Route = createFileRoute('/')({
    component: Index,
})

function Index() {
    return (
        <div className="min-h-screen bg-background py-12">
            <RecruitForm />
        </div>
    )
}

