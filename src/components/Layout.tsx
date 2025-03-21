import { CssVarsProvider } from '@mui/joy/styles'
import CssBaseline from '@mui/joy/CssBaseline'
import Box from '@mui/joy/Box'
import { Outlet } from 'react-router-dom'

import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import Typography from '@mui/joy/Typography'
import { usePageData } from '../context/page-data/page-data.context.ts'
import Button from '@mui/joy/Button'
import Sheet from '@mui/joy/Sheet'
import Divider from '@mui/joy/Divider'

export default function Layout() {
    const { pageData } = usePageData()
    return (
        <CssVarsProvider>
            <CssBaseline />
            <Box sx={{ display: 'flex', minHeight: '100dvh', overflow: 'hidden' }}>
                <Header />
                <Sidebar />
                <Box
                    component="main"
                    sx={{
                        px: { xs: 2, md: 6 },
                        pt: {
                            xs: 'calc(12px + var(--Header-height))',
                            sm: 'calc(12px + var(--Header-height))',
                            md: 3,
                        },
                        pb: { xs: 2, sm: 2, md: 3 },
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        minWidth: 0,
                        overflowY: 'auto',
                        height: '100dvh',
                        gap: 1,
                    }}
                >
                    <Sheet
                        sx={{
                            height: '4dvh',
                            display: 'flex',
                            gap: 1,
                            paddingLeft: 2,
                            paddingRight: 2,
                            paddingBottom: 30,
                            flexDirection: { xs: 'column', sm: 'row' },
                            alignItems: { xs: 'start', sm: 'center' },
                            flexWrap: 'wrap',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Typography
                            level="h2"
                            component="h1"
                        >
                            {pageData.title}
                        </Typography>

                        {pageData.button && (
                            <Button
                                onClick={pageData.button.click}
                                color="primary"
                                startDecorator={pageData.button.icon}
                                size="sm"
                            >
                                {pageData.button.label}
                            </Button>
                        )}
                    </Sheet>
                    <Divider />
                    <Sheet
                        id="scroll"
                        sx={{
                            overflowY: 'auto',
                            width: '100%',
                            height: '90dvh',
                            padding: 2,
                        }}
                    >
                        <Outlet />
                    </Sheet>
                    <Divider />
                </Box>
            </Box>
        </CssVarsProvider>
    )
}
