import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Toaster } from '@/components/ui/sonner'

const RootLayout = () => (
    <>

        <hr />
        <Outlet />
        <footer className="border-t py-6 mt-auto">
            <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                Built by{' '}
                crew/<a
                    href="https://www.bracurobu.com/crews/thegraffititeam"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium hover:underline"
                >
                    tgt.fyi
                </a>
            </div>
        </footer>
        <Toaster />
        <TanStackRouterDevtools />
    </>
)

export const Route = createRootRoute({ component: RootLayout })

